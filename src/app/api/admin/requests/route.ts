import { NextResponse } from "next/server";
import { getDb } from "@/lib/db";
import { getCurrentUser, isStaff } from "@/lib/auth";

const STATUSES = ["new", "in_progress", "done", "cancelled"] as const;

type RequestRow = {
  id: number;
  user_id: number;
  employee_id: number | null;
  status: string;
  message: string | null;
  created_at: string;
  email: string;
  phone: string | null;
  full_name: string | null;
  employee_email: string | null;
  ward_name: string | null;
  passport: string | null;
  description: string | null;
  plan_name: string | null;
  monthly_price: number | null;
};

/** Список заявок: админ видит все, сотрудник — только свои. */
export async function GET() {
  const user = await getCurrentUser();
  if (!isStaff(user)) {
    return NextResponse.json({ error: "Доступ запрещён" }, { status: 403 });
  }

  const db = getDb();
  const base = `
    SELECT r.id, r.user_id, r.employee_id, r.status, r.message, r.created_at,
           r.ward_name, r.passport, r.description,
           pl.name AS plan_name, pl.monthly_price,
           u.email,
           p.phone, p.full_name,
           e.email AS employee_email
      FROM requests r
      JOIN users u ON u.id = r.user_id
      LEFT JOIN user_profiles p ON p.user_id = r.user_id
      LEFT JOIN plans pl ON pl.id = r.plan_id
      LEFT JOIN users e ON e.id = r.employee_id
  `;

  const rows =
    user!.role === "admin"
      ? (db.prepare(`${base} ORDER BY r.id DESC`).all() as RequestRow[])
      : (db
          .prepare(`${base} WHERE r.employee_id = ? ORDER BY r.id DESC`)
          .all(user!.id) as RequestRow[]);

  const employees =
    user!.role === "admin"
      ? (db
          .prepare(`SELECT id, email FROM users WHERE role IN ('employee', 'admin') ORDER BY email`)
          .all() as { id: number; email: string }[])
      : [];

  return NextResponse.json({ requests: rows, employees });
}

/** Изменение заявки: статус и/или назначенный сотрудник. */
export async function PATCH(request: Request) {
  const user = await getCurrentUser();
  if (!isStaff(user)) {
    return NextResponse.json({ error: "Доступ запрещён" }, { status: 403 });
  }

  let body: { id?: number; status?: string; employeeId?: number | null };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Некорректный запрос" }, { status: 400 });
  }

  const id = Number(body.id);
  if (!Number.isInteger(id) || id <= 0) {
    return NextResponse.json({ error: "Некорректный id" }, { status: 400 });
  }

  const db = getDb();
  const existing = db.prepare(`SELECT id, employee_id FROM requests WHERE id = ?`).get(id) as
    | { id: number; employee_id: number | null }
    | undefined;
  if (!existing) {
    return NextResponse.json({ error: "Заявка не найдена" }, { status: 404 });
  }

  // Сотрудник может менять статус только своих заявок
  if (user!.role === "employee" && existing.employee_id !== user!.id) {
    return NextResponse.json({ error: "Это не ваша заявка" }, { status: 403 });
  }

  const status =
    body.status !== undefined && STATUSES.includes(body.status as (typeof STATUSES)[number])
      ? body.status
      : null;

  // Назначать сотрудников может только администратор
  const employeeId =
    user!.role === "admin" && body.employeeId !== undefined ? body.employeeId : null;

  db.prepare(
    `UPDATE requests
        SET status = COALESCE(?, status),
            employee_id = COALESCE(?, employee_id),
            updated_at = datetime('now')
      WHERE id = ?`,
  ).run(status, employeeId, id);

  return NextResponse.json({ ok: true });
}
