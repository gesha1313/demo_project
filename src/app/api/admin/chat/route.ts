import { NextResponse } from "next/server";
import { getDb } from "@/lib/db";
import { getCurrentUser, isStaff } from "@/lib/auth";

type ConversationRow = {
  id: number;
  user_id: number;
  status: string;
  updated_at: string;
  email: string;
  phone: string | null;
  last_message: string | null;
};

type MessageRow = {
  id: number;
  sender_id: number;
  body: string;
  created_at: string;
  sender_email: string;
};

/**
 * GET — список диалогов горячей линии (с последним сообщением),
 * или сообщения конкретного диалога при ?conversationId=…
 */
export async function GET(request: Request) {
  const user = await getCurrentUser();
  if (!isStaff(user)) {
    return NextResponse.json({ error: "Доступ запрещён" }, { status: 403 });
  }

  const db = getDb();
  const conversationId = new URL(request.url).searchParams.get("conversationId");

  if (conversationId) {
    const id = Number(conversationId);
    if (!Number.isInteger(id) || id <= 0) {
      return NextResponse.json({ error: "Некорректный id" }, { status: 400 });
    }

    const messages = db
      .prepare(
        `SELECT m.id, m.sender_id, m.body, m.created_at, u.email AS sender_email
           FROM messages m
           JOIN users u ON u.id = m.sender_id
          WHERE m.conversation_id = ?
          ORDER BY m.id ASC`,
      )
      .all(id) as MessageRow[];

    return NextResponse.json({ messages, myId: user!.id });
  }

  const conversations = db
    .prepare(
      `SELECT c.id, c.user_id, c.status, c.updated_at,
              u.email, p.phone,
              (SELECT body FROM messages m
                WHERE m.conversation_id = c.id
                ORDER BY m.id DESC LIMIT 1) AS last_message
         FROM conversations c
         JOIN users u ON u.id = c.user_id
         LEFT JOIN user_profiles p ON p.user_id = c.user_id
        ORDER BY c.updated_at DESC`,
    )
    .all() as ConversationRow[];

  return NextResponse.json({ conversations });
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

  const db = getDb();
  const conversation = db
    .prepare(`SELECT id, employee_id FROM conversations WHERE id = ?`)
    .get(conversationId) as { id: number; employee_id: number | null } | undefined;
  if (!conversation) {
    return NextResponse.json({ error: "Диалог не найден" }, { status: 404 });
  }

  db.transaction(() => {
    // Закрепляем сотрудника за диалогом при первом ответе
    db.prepare(
      `UPDATE conversations
          SET employee_id = COALESCE(employee_id, ?),
              updated_at = datetime('now')
        WHERE id = ?`,
    ).run(user!.id, conversationId);

    db.prepare(
      `INSERT INTO messages (conversation_id, sender_id, body) VALUES (?, ?, ?)`,
    ).run(conversationId, user!.id, text);
  })();

  return NextResponse.json({ ok: true });
}
