import { NextResponse } from "next/server";
import { getDb } from "@/lib/db";
import { getCurrentUser } from "@/lib/auth";

/** Сохранение телефона и имени в профиле (личный кабинет). */
export async function PUT(request: Request) {
  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json({ error: "Требуется вход" }, { status: 401 });
  }

  let body: { phone?: string; fullName?: string };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Некорректный запрос" }, { status: 400 });
  }

  const phone = (body.phone ?? "").trim();
  const fullName = (body.fullName ?? "").trim() || null;

  if (phone && !/^[+0-9()\-\s]{6,20}$/.test(phone)) {
    return NextResponse.json({ error: "Некорректный номер телефона" }, { status: 400 });
  }

  const db = getDb();
  db.prepare(
    `INSERT INTO user_profiles (user_id, full_name, phone, updated_at)
     VALUES (?, ?, ?, datetime('now'))
     ON CONFLICT(user_id) DO UPDATE SET
       full_name = excluded.full_name,
       phone = excluded.phone,
       updated_at = excluded.updated_at`,
  ).run(user.id, fullName, phone || null);

  return NextResponse.json({ ok: true });
}
