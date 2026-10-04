import { NextResponse } from "next/server";
import { getDb } from "@/lib/db";
import { getCurrentUser } from "@/lib/auth";

/** Создание заявки: подопечный, паспорт, описание, тариф. */
export async function POST(request: Request) {
  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json({ error: "Требуется вход" }, { status: 401 });
  }

  let body: {
    wardName?: string;
    passport?: string;
    description?: string;
    planId?: number;
  };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Некорректный запрос" }, { status: 400 });
  }

  const wardName = (body.wardName ?? "").trim();
  const passport = (body.passport ?? "").trim();
  const description = (body.description ?? "").trim();
  const planId = Number(body.planId);

  if (wardName.length < 3 || wardName.length > 120) {
    return NextResponse.json(
      { error: "Укажите ФИО подопечного (от 3 символов)" },
      { status: 400 },
    );
  }
  if (!passport || passport.length > 120) {
    return NextResponse.json({ error: "Укажите данные паспорта" }, { status: 400 });
  }
  if (description.length < 5 || description.length > 2000) {
    return NextResponse.json(
      { error: "Опишите ситуацию (от 5 символов)" },
      { status: 400 },
    );
  }
  if (!Number.isInteger(planId) || planId <= 0) {
    return NextResponse.json({ error: "Выберите тариф" }, { status: 400 });
  }

  const db = getDb();
  const plan = db.prepare(`SELECT id FROM plans WHERE id = ?`).get(planId);
  if (!plan) {
    return NextResponse.json({ error: "Такой тариф не найден" }, { status: 400 });
  }

  db.prepare(
    `INSERT INTO requests (user_id, status, ward_name, passport, description, plan_id)
     VALUES (?, 'new', ?, ?, ?, ?)`,
  ).run(user.id, wardName, passport, description, planId);

  return NextResponse.json({ ok: true });
}
