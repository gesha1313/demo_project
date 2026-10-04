import { NextResponse } from "next/server";
import { dbGet, getDb } from "@/lib/db";
import { getCurrentUser, isStaff } from "@/lib/auth";

const STATUSES = ["new", "in_progress", "done", "cancelled"] as const;
const MIN_DELETE_REASON = 20;

/** Список заявок: админ видит все, сотрудник — только свои. */
export async function GET() {
  const user = await getCurrentUser();
  if (!isStaff(user)) {
    return NextResponse.json({ error: "Доступ запрещён" }, { status: 403 });
  }

  const db = await getDb();
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
      ? await db.execute({ sql: `${base} ORDER BY r.id DESC` })
      : await db.execute({
          sql: `${base} WHERE r.employee_id = ? ORDER BY r.id DESC`,
          args: [user!.id],
        });

  const employees =
    user!.role === "admin"
      ? (
          await db.execute({
            sql: `SELECT id, email FROM users WHERE role IN ('employee', 'admin') ORDER BY email`,
          })
        ).rows
      : [];

  return NextResponse.json({ requests: rows.rows, employees });
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

  const db = await getDb();
  const existing = await dbGet<{ id: number; employee_id: number | null }>(
    db,
    `SELECT id, employee_id FROM requests WHERE id = ?`,
    [id],
  );
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

  await db.execute({
    sql: `UPDATE requests
             SET status = COALESCE(?, status),
                 employee_id = COALESCE(?, employee_id),
                 updated_at = datetime('now')
           WHERE id = ?`,
    args: [status, employeeId, id],
  });

  return NextResponse.json({ ok: true });
}

/** Удаление заявки: нельзя для статусов «в работе» и «завершена». */
export async function DELETE(request: Request) {
  const user = await getCurrentUser();
  if (!isStaff(user)) {
    return NextResponse.json({ error: "Доступ запрещён" }, { status: 403 });
  }

  let body: { id?: number; reason?: string };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Некорректный запрос" }, { status: 400 });
  }

  const id = Number(body.id);
  const reason = (body.reason ?? "").trim();

  if (!Number.isInteger(id) || id <= 0) {
    return NextResponse.json({ error: "Некорректный id" }, { status: 400 });
  }
  if (reason.length < MIN_DELETE_REASON) {
    return NextResponse.json(
      { error: `Опишите причину удаления — минимум ${MIN_DELETE_REASON} символов` },
      { status: 400 },
    );
  }

  const db = await getDb();
  const existing = await dbGet<{
    id: number;
    user_id: number;
    employee_id: number | null;
    status: string;
  }>(
    db,
    `SELECT id, user_id, employee_id, status FROM requests WHERE id = ?`,
    [id],
  );

  if (!existing) {
    return NextResponse.json({ error: "Заявка не найдена" }, { status: 404 });
  }
  if (existing.status === "in_progress" || existing.status === "done") {
    return NextResponse.json(
      { error: "Заявки в работе и завершённые удалить нельзя" },
      { status: 400 },
    );
  }
  // Сотрудник удаляет только заявки, закреплённые за ним
  if (user!.role === "employee" && existing.employee_id !== user!.id) {
    return NextResponse.json({ error: "Это не ваша заявка" }, { status: 403 });
  }

  // Удаляем и фиксируем в журнале: кто, что и по какой причине
  const tx = await db.transaction();
  try {
    await tx.execute({
      sql: `INSERT INTO request_deletions (request_id, user_id, deleted_by, reason)
            VALUES (?, ?, ?, ?)`,
      args: [existing.id, existing.user_id, user!.id, reason],
    });
    await tx.execute({ sql: `DELETE FROM requests WHERE id = ?`, args: [id] });
    await tx.commit();
  } catch (error) {
    await tx.rollback();
    throw error;
  }

  return NextResponse.json({ ok: true });
}
