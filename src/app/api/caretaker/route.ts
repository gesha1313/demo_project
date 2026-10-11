import { NextResponse } from "next/server";
import { getDb } from "@/lib/db";
import { getCurrentUser } from "@/lib/auth";

/** Пул сиделок для подбора (демо): имя и стаж в годах. */
const CARETAKERS = [
  { name: "Наталья", experience: 8 },
  { name: "Ольга", experience: 12 },
  { name: "Мария", experience: 5 },
  { name: "Екатерина", experience: 15 },
  { name: "Светлана", experience: 7 },
  { name: "Татьяна", experience: 10 },
  { name: "Анна", experience: 4 },
  { name: "Ирина", experience: 9 },
];

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

/** Создание заявки на сиделку: анкета + мгновенный подбор (демо). */
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

  // «Подбор»: случайная сиделка и время приезда 20–100 минут (кратно 5)
  const caretaker = CARETAKERS[Math.floor(Math.random() * CARETAKERS.length)];
  const arrival = 20 + Math.floor(Math.random() * 17) * 5;

  const db = await getDb();
  const inserted = await db.execute({
    sql: `INSERT INTO caretaker_requests
            (user_id, status, ward_name, ward_age, address, tasks, start_date, notes,
             caretaker_name, caretaker_experience, arrival_minutes)
          VALUES (?, 'matched', ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    args: [
      user.id,
      wardName,
      wardAge,
      address,
      JSON.stringify(tasks),
      startDate,
      notes,
      caretaker.name,
      caretaker.experience,
      arrival,
    ],
  });

  return NextResponse.json({
    ok: true,
    requestId: Number(inserted.lastInsertRowid),
    caretakerName: caretaker.name,
    caretakerExperience: caretaker.experience,
    arrivalMinutes: arrival,
  });
}
