import { NextResponse } from "next/server";
import { dbGet, getDb } from "@/lib/db";
import { getCurrentUser } from "@/lib/auth";

/** Допустимые пункты анкеты (дублируются в CaretakerWizard). */
const ALLOWED_TASKS = new Set([
  "Гигиена и уход",
  "Кормление",
  "Прогулки",
  "Приём лекарств",
  "Медпроцедуры",
  "Сопровождение",
  "Уборка и готовка",
  "Общение и досуг",
]);

type Body = {
  wardName?: string;
  wardAge?: number | string;
  address?: string;
  tasks?: string[];
  startDate?: string;
  notes?: string;
};

/**
 * Создание заявки на сиделку с подбором из БД:
 *  — есть сиделка со статусом «свободна» → заявка «предложена», сиделка «ожидает»;
 *  — свободных нет → заявка сохраняется со статусом new, matched=false.
 */
export async function POST(request: Request) {
  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json({ error: "Требуется вход" }, { status: 401 });
  }

  let body: Body;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Некорректный запрос" }, { status: 400 });
  }

  const wardName = (body.wardName ?? "").trim();
  const wardAge = Number(body.wardAge);
  const address = (body.address ?? "").trim();
  const startDate = (body.startDate ?? "").trim() || null;
  const notes = (body.notes ?? "").trim() || null;
  const tasks = Array.isArray(body.tasks)
    ? body.tasks.map((t) => String(t).trim()).filter((t) => ALLOWED_TASKS.has(t))
    : [];

  if (wardName.length < 3 || wardName.length > 120) {
    return NextResponse.json({ error: "Укажите ФИО подопечного" }, { status: 400 });
  }
  if (!Number.isInteger(wardAge) || wardAge < 1 || wardAge > 120) {
    return NextResponse.json({ error: "Укажите возраст подопечного" }, { status: 400 });
  }
  if (address.length < 5) {
    return NextResponse.json({ error: "Укажите адрес в Нижнем Новгороде" }, { status: 400 });
  }
  if (tasks.length === 0) {
    return NextResponse.json({ error: "Выберите хотя бы одну услугу" }, { status: 400 });
  }

  const db = await getDb();

  // Ищем свободную сиделку (случайная из свободных)
  const free = await dbGet<{
    user_id: number;
    full_name: string;
    experience_years: number;
  }>(
    db,
    `SELECT cp.user_id, cp.full_name, cp.experience_years
       FROM caretaker_profiles cp
       JOIN users u ON u.id = cp.user_id
      WHERE cp.status = 'free'
      ORDER BY RANDOM()
      LIMIT 1`,
  );

  const arrival = 20 + Math.floor(Math.random() * 17) * 5;

  if (!free) {
    // Свободных сиделок нет — заявка сохраняется, ждёт освобождения
    const inserted = await db.execute({
      sql: `INSERT INTO caretaker_requests
              (user_id, status, ward_name, ward_age, address, tasks, start_date, notes, arrival_minutes)
            VALUES (?, 'new', ?, ?, ?, ?, ?, ?, ?)`,
      args: [user.id, wardName, wardAge, address, JSON.stringify(tasks), startDate, notes, arrival],
    });

    return NextResponse.json({
      ok: true,
      matched: false,
      requestId: Number(inserted.lastInsertRowid),
    });
  }

  const tx = await db.transaction();
  let requestId: number;
  try {
    // Сиделка переходит в «ожидание» — у неё в кабинете появится заявка
    await tx.execute({
      sql: `UPDATE caretaker_profiles SET status = 'waiting', updated_at = datetime('now')
            WHERE user_id = ?`,
      args: [free.user_id],
    });

    const inserted = await tx.execute({
      sql: `INSERT INTO caretaker_requests
              (user_id, status, ward_name, ward_age, address, tasks, start_date, notes,
               caretaker_user_id, arrival_minutes)
            VALUES (?, 'offered', ?, ?, ?, ?, ?, ?, ?, ?)`,
      args: [
        user.id,
        wardName,
        wardAge,
        address,
        JSON.stringify(tasks),
        startDate,
        notes,
        free.user_id,
        arrival,
      ],
    });
    requestId = Number(inserted.lastInsertRowid);

    await tx.commit();
  } catch (error) {
    await tx.rollback();
    throw error;
  }

  return NextResponse.json({
    ok: true,
    matched: true,
    requestId,
    caretakerName: free.full_name,
    caretakerExperience: free.experience_years,
    arrivalMinutes: arrival,
  });
}
