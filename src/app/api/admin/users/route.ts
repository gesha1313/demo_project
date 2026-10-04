import { NextResponse } from "next/server";
import { getDb } from "@/lib/db";
import { getCurrentUser } from "@/lib/auth";

const ROLES = ["user", "employee", "admin"] as const;

/** Список пользователей (только администратор). */
export async function GET() {
  const user = await getCurrentUser();
  if (user?.role !== "admin") {
    return NextResponse.json({ error: "Доступ запрещён" }, { status: 403 });
  }

  const db = await getDb();
  const result = await db.execute(`
    SELECT u.id, u.email, u.role, u.created_at,
           p.full_name, p.phone,
           (SELECT COUNT(*) FROM requests r WHERE r.user_id = u.id) AS requests_count
      FROM users u
      LEFT JOIN user_profiles p ON p.user_id = u.id
     ORDER BY u.id ASC
  `);

  return NextResponse.json({ users: result.rows });
}

/** Смена роли пользователя (только администратор). */
export async function PATCH(request: Request) {
  const user = await getCurrentUser();
  if (user?.role !== "admin") {
    return NextResponse.json({ error: "Доступ запрещён" }, { status: 403 });
  }

  let body: { id?: number; role?: string };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Некорректный запрос" }, { status: 400 });
  }

  const id = Number(body.id);
  const role = body.role ?? "";
  if (!Number.isInteger(id) || !ROLES.includes(role as (typeof ROLES)[number])) {
    return NextResponse.json({ error: "Некорректные данные" }, { status: 400 });
  }
  if (id === user.id) {
    return NextResponse.json(
      { error: "Нельзя менять роль собственного аккаунта" },
      { status: 400 },
    );
  }

  const db = await getDb();
  const result = await db.execute({
    sql: `UPDATE users SET role = ? WHERE id = ?`,
    args: [role, id],
  });
  if (result.rowsAffected === 0) {
    return NextResponse.json({ error: "Пользователь не найден" }, { status: 404 });
  }

  return NextResponse.json({ ok: true });
}
