import { NextResponse } from "next/server";
import { dbGet, getDb } from "@/lib/db";
import { getCurrentUser } from "@/lib/auth";

const GREETING =
  "Здравствуйте! Это горячая линия пансионата. Расскажите, чем можем помочь, — сотрудник ответит в ближайшее время.";

type MessageRow = {
  id: number;
  sender_id: number;
  body: string;
  created_at: string;
};

/** Диалог текущего клиента с поддержкой (создаётся при первом обращении). */
async function ensureConversation(userId: number): Promise<number> {
  const db = await getDb();

  const existing = await dbGet<{ id: number }>(
    db,
    `SELECT id FROM conversations WHERE user_id = ? ORDER BY id DESC LIMIT 1`,
    [userId],
  );

  if (existing) return existing.id;

  const tx = await db.transaction();
  try {
    const created = await tx.execute({
      sql: `INSERT INTO conversations (user_id) VALUES (?)`,
      args: [userId],
    });
    const conversationId = Number(created.lastInsertRowid);

    // Приветствие от администратора, чтобы чат не выглядел пустым
    const adminRs = await tx.execute(
      `SELECT id FROM users WHERE role = 'admin' ORDER BY id LIMIT 1`,
    );
    const admin = adminRs.rows[0] as unknown as { id: number } | undefined;
    if (admin) {
      await tx.execute({
        sql: `INSERT INTO messages (conversation_id, sender_id, body) VALUES (?, ?, ?)`,
        args: [conversationId, admin.id, GREETING],
      });
    }

    await tx.commit();
    return conversationId;
  } catch (error) {
    await tx.rollback();
    throw error;
  }
}

export async function GET() {
  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json({ error: "Требуется вход" }, { status: 401 });
  }

  const db = await getDb();
  const conversationId = await ensureConversation(user.id);
  const result = await db.execute({
    sql: `SELECT id, sender_id, body, created_at
            FROM messages
           WHERE conversation_id = ?
           ORDER BY id ASC`,
    args: [conversationId],
  });

  const messages = result.rows as unknown as MessageRow[];
  return NextResponse.json({ conversationId, messages, myId: user.id });
}

export async function POST(request: Request) {
  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json({ error: "Требуется вход" }, { status: 401 });
  }

  let body: { body?: string };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Некорректный запрос" }, { status: 400 });
  }

  const text = (body.body ?? "").trim();
  if (!text) {
    return NextResponse.json({ error: "Пустое сообщение" }, { status: 400 });
  }
  if (text.length > 2000) {
    return NextResponse.json({ error: "Сообщение слишком длинное" }, { status: 400 });
  }

  const db = await getDb();
  const conversationId = await ensureConversation(user.id);

  const tx = await db.transaction();
  try {
    await tx.execute({
      sql: `INSERT INTO messages (conversation_id, sender_id, body) VALUES (?, ?, ?)`,
      args: [conversationId, user.id, text],
    });
    await tx.execute({
      sql: `UPDATE conversations SET updated_at = datetime('now') WHERE id = ?`,
      args: [conversationId],
    });
    await tx.commit();
  } catch (error) {
    await tx.rollback();
    throw error;
  }

  return NextResponse.json({ ok: true });
}
