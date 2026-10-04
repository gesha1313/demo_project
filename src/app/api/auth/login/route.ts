import { NextResponse } from "next/server";
import { dbGet, getDb } from "@/lib/db";
import { startSession, verifyPassword } from "@/lib/auth";

export async function POST(request: Request) {
  let body: { email?: string; password?: string };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Некорректный запрос" }, { status: 400 });
  }

  const email = (body.email ?? "").trim().toLowerCase();
  const password = body.password ?? "";

  const db = await getDb();
  const user = await dbGet<{
    id: number;
    email: string;
    role: "user" | "employee" | "admin";
    password_hash: string;
  }>(db, `SELECT id, email, role, password_hash FROM users WHERE email = ?`, [email]);

  if (!user || !verifyPassword(password, user.password_hash)) {
    return NextResponse.json({ error: "Неверный email или пароль" }, { status: 401 });
  }

  // Stateless-сессия: подписанный cookie, действительный на любом инстансе
  await startSession({ id: user.id, email: user.email, role: user.role });

  return NextResponse.json({ ok: true });
}
