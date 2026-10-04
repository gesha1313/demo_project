import { NextResponse } from "next/server";
import { getDb } from "@/lib/db";
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
function ensureConversation(userId: number): number {
  const db = getDb();
  const existing = db
    .prepare(`SELECT id FROM conversations WHERE user_id = ? ORDER BY id DESC LIMIT 1`)
    .get(userId) as { id: number } | undefined;

  if (existing) return existing.id;

  const create = db.transaction(() => {
    const info = db
      .prepare(`INSERT INTO conversations (user_id) VALUES (?)`)
      .run(userId);
    const conversationId = Number(info.lastInsertRowid);

    // Приветствие от администратора, чтобы чат не выглядел пустым
    const admin = db
      .prepare(`SELECT id FROM users WHERE role = 'admin' ORDER BY id LIMIT 1`)
      .get() as { id: number } | undefined;
    if (admin) {
      db.prepare(
        `INSERT INTO messages (conversation_id, sender_id, body) VALUES (?, ?, ?)`,
      ).run(conversationId, admin.id, GREETING);
    }

    return conversationId;
  });

  return create();
}

export async function GET() {
  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json({ error: "Требуется вход" }, { status: 401 });
  }

  const db = getDb();
  const conversationId = ensureConversation(user.id);
  const messages = db
    .prepare(
      `SELECT id, sender_id, body, created_at
         FROM messages
        WHERE conversation_id = ?
        ORDER BY id ASC`,
    )
    .all(conversationId) as MessageRow[];

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

  const db = getDb();
  const conversationId = ensureConversation(user.id);
  db.prepare(
    `INSERT INTO messages (conversation_id, sender_id, body) VALUES (?, ?, ?)`,
  ).run(conversationId, user.id, text);
  db.prepare(
    `UPDATE conversations SET updated_at = datetime('now') WHERE id = ?`,
  ).run(conversationId);

  return NextResponse.json({ ok: true });
}
