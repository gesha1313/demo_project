import { NextResponse } from "next/server";
import { getDb } from "@/lib/db";
import { createSession, getCurrentUser, hashPassword, setSessionCookie } from "@/lib/auth";
import { isPasswordAcceptable, isValidEmail } from "@/lib/validation";

export async function POST(request: Request) {
  // Повторная регистрация под активной сессией запрещена
  const currentUser = await getCurrentUser();
  if (currentUser) {
    return NextResponse.json(
      { error: "Вы уже вошли в аккаунт. Выйдите, чтобы зарегистрировать новый" },
      { status: 403 },
    );
  }

  let body: { email?: string; password?: string; message?: string };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Некорректный запрос" }, { status: 400 });
  }

  const email = (body.email ?? "").trim().toLowerCase();
  const password = body.password ?? "";
  const message = (body.message ?? "").trim() || null;

  if (!isValidEmail(email)) {
    return NextResponse.json({ error: "Некорректный email" }, { status: 400 });
  }
  if (!isPasswordAcceptable(password)) {
    return NextResponse.json(
      {
        error:
          "Пароль слишком простой: минимум 8 символов, заглавная буква и цифра",
      },
      { status: 400 },
    );
  }

  const db = getDb();
  const existing = db.prepare(`SELECT id FROM users WHERE email = ?`).get(email);
  if (existing) {
    return NextResponse.json(
      { error: "Пользователь с таким email уже зарегистрирован" },
      { status: 409 },
    );
  }

  // Аккаунт + пустой профиль + заявка на консультацию одним заходом
  const register = db.transaction(() => {
    const info = db
      .prepare(`INSERT INTO users (email, password_hash, role) VALUES (?, ?, 'user')`)
      .run(email, hashPassword(password));
    const userId = Number(info.lastInsertRowid);

    db.prepare(`INSERT INTO user_profiles (user_id) VALUES (?)`).run(userId);
    db.prepare(
      `INSERT INTO requests (user_id, employee_id, status, message) VALUES (?, NULL, 'new', ?)`,
    ).run(userId, message);

    return userId;
  });

  const userId = register();
  const token = createSession(userId);
  await setSessionCookie(token);

  return NextResponse.json({ ok: true });
}
