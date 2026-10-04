import { NextResponse } from "next/server";
import { dbGet, getDb } from "@/lib/db";
import { getCurrentUser, hashPassword, startSession } from "@/lib/auth";
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

  let body: { email?: string; password?: string };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Некорректный запрос" }, { status: 400 });
  }

  const email = (body.email ?? "").trim().toLowerCase();
  const password = body.password ?? "";

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

  const db = await getDb();
  const existing = await dbGet<{ id: number }>(db, `SELECT id FROM users WHERE email = ?`, [
    email,
  ]);
  if (existing) {
    return NextResponse.json(
      { error: "Пользователь с таким email уже зарегистрирован" },
      { status: 409 },
    );
  }

  // Аккаунт + пустой профиль (заявки клиент создаёт сам в кабинете)
  const tx = await db.transaction();
  let userId: number;
  try {
    const result = await tx.execute({
      sql: `INSERT INTO users (email, password_hash, role) VALUES (?, ?, 'user')`,
      args: [email, hashPassword(password)],
    });
    userId = Number(result.lastInsertRowid);

    await tx.execute({
      sql: `INSERT INTO user_profiles (user_id) VALUES (?)`,
      args: [userId],
    });

    await tx.commit();
  } catch (error) {
    await tx.rollback();
    throw error;
  }

  await startSession({ id: userId, email, role: "user" });

  return NextResponse.json({ ok: true });
}
