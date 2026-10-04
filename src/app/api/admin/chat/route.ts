import { NextResponse } from "next/server";
import { dbGet, getDb } from "@/lib/db";
import { getCurrentUser, isStaff } from "@/lib/auth";

/**
 * GET — список диалогов горячей линии (с последним сообщением),
 * или сообщения конкретного диалога при ?conversationId=…
 */
export async function GET(request: Request) {
  const user = await getCurrentUser();
  if (!isStaff(user)) {
    return NextResponse.json({ error: "Доступ запрещён" }, { status: 403 });
  }

  const db = await getDb();
  const conversationId = new URL(request.url).searchParams.get("conversationId");

  if (conversationId) {
    const id = Number(conversationId);
    if (!Number.isInteger(id) || id <= 0) {
      return NextResponse.json({ error: "Некорректный id" }, { status: 400 });
    }

    const result = await db.execute({
      sql: `SELECT m.id, m.sender_id, m.body, m.created_at, u.email AS sender_email
              FROM messages m
              JOIN users u ON u.id = m.sender_id
             WHERE m.conversation_id = ?
             ORDER BY m.id ASC`,
      args: [id],
    });

    return NextResponse.json({ messages: result.rows, myId: user!.id });
  }

  const conversations = await db.execute(`
    SELECT c.id, c.user_id, c.status, c.updated_at,
           u.email, p.phone,
           (SELECT body FROM messages m
             WHERE m.conversation_id = c.id
             ORDER BY m.id DESC LIMIT 1) AS last_message
      FROM conversations c
      JOIN users u ON u.id = c.user_id
      LEFT JOIN user_profiles p ON p.user_id = c.user_id
     ORDER BY c.updated_at DESC
  `);

  return NextResponse.json({ conversations: conversations.rows });
}

/** POST — ответ сотрудника в диалоге. */
export async function POST(request: Request) {
  const user = await getCurrentUser();
  if (!isStaff(user)) {
    return NextResponse.json({ error: "Доступ запрещён" }, { status: 403 });
  }

  let body: { conversationId?: number; body?: string };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Некорректный запрос" }, { status: 400 });
  }

  const conversationId = Number(body.conversationId);
  const text = (body.body ?? "").trim();
  if (!Number.isInteger(conversationId) || conversationId <= 0 || !text) {
    return NextResponse.json({ error: "Некорректные данные" }, { status: 400 });
  }
  if (text.length > 2000) {
    return NextResponse.json({ error: "Сообщение слишком длинное" }, { status: 400 });
  }

  const db = await getDb();
  const conversation = await dbGet<{ id: number }>(
    db,
    `SELECT id FROM conversations WHERE id = ?`,
    [conversationId],
  );
  if (!conversation) {
    return NextResponse.json({ error: "Диалог не найден" }, { status: 404 });
  }

  const tx = await db.transaction();
  try {
    // Закрепляем сотрудника за диалогом при первом ответе
    await tx.execute({
      sql: `UPDATE conversations
               SET employee_id = COALESCE(employee_id, ?),
                   updated_at = datetime('now')
             WHERE id = ?`,
      args: [user!.id, conversationId],
    });
    await tx.execute({
      sql: `INSERT INTO messages (conversation_id, sender_id, body) VALUES (?, ?, ?)`,
      args: [conversationId, user!.id, text],
    });
    await tx.commit();
  } catch (error) {
    await tx.rollback();
    throw error;
  }

  return NextResponse.json({ ok: true });
}
