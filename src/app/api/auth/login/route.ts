import { NextResponse } from "next/server";
import { getDb } from "@/lib/db";
import { createSession, setSessionCookie, verifyPassword } from "@/lib/auth";

export async function POST(request: Request) {
  let body: { email?: string; password?: string };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Некорректный запрос" }, { status: 400 });
  }

  const email = (body.email ?? "").trim().toLowerCase();
  const password = body.password ?? "";

  const db = getDb();
  const user = db
    .prepare(`SELECT id, password_hash FROM users WHERE email = ?`)
    .get(email) as { id: number; password_hash: string } | undefined;

  if (!user || !verifyPassword(password, user.password_hash)) {
    return NextResponse.json({ error: "Неверный email или пароль" }, { status: 401 });
  }

  const token = createSession(user.id);
  await setSessionCookie(token);

  return NextResponse.json({ ok: true });
}
