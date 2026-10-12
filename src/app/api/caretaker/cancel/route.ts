import { NextResponse } from "next/server";
import { dbGet, getDb } from "@/lib/db";
import { getCurrentUser } from "@/lib/auth";

/** Отмена заявки на сиделку клиентом: только неактивные (new/declined). */
export async function POST(request: Request) {
  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json({ error: "Требуется вход" }, { status: 401 });
  }

  let body: { requestId?: number };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Некорректный запрос" }, { status: 400 });
  }

  const requestId = Number(body.requestId);
  if (!Number.isInteger(requestId) || requestId <= 0) {
    return NextResponse.json({ error: "Некорректные данные" }, { status: 400 });
  }

  const db = await getDb();
  const req = await dbGet<{ id: number; status: string }>(
    db,
    `SELECT id, status FROM caretaker_requests WHERE id = ? AND user_id = ?`,
    [requestId, user.id],
  );

  if (!req) {
    return NextResponse.json({ error: "Заявка не найдена" }, { status: 404 });
  }
  if (req.status !== "new" && req.status !== "declined") {
    return NextResponse.json(
      { error: "Активную заявку (принятую или на рассмотрении) отменить нельзя" },
      { status: 400 },
    );
  }

  await db.execute({
    sql: `UPDATE caretaker_requests SET status = 'cancelled', updated_at = datetime('now')
          WHERE id = ?`,
    args: [requestId],
  });

  return NextResponse.json({ ok: true });
}
