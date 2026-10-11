import { NextResponse } from "next/server";
import { dbGet, getDb } from "@/lib/db";
import { getCurrentUser } from "@/lib/auth";
import { notify } from "@/lib/notify";

/**
 * Перенос заявки на сиделку по инициативе клиента:
 * текущая сиделка освобождается, заявка предлагается другой свободной.
 */
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
  const req = await dbGet<{
    id: number;
    status: string;
    ward_name: string;
    caretaker_user_id: number | null;
  }>(
    db,
    `SELECT id, status, ward_name, caretaker_user_id FROM caretaker_requests
      WHERE id = ? AND user_id = ?`,
    [requestId, user.id],
  );

  if (!req) {
    return NextResponse.json({ error: "Заявка не найдена" }, { status: 404 });
  }
  if (req.status !== "offered" && req.status !== "accepted") {
    return NextResponse.json(
      { error: "Эту заявку нельзя перенести" },
      { status: 400 },
    );
  }

  // Ищем замену среди свободных (текущую исключаем)
  const next = await dbGet<{ user_id: number; full_name: string }>(
    db,
    `SELECT cp.user_id, cp.full_name FROM caretaker_profiles cp
      JOIN users u ON u.id = cp.user_id
     WHERE cp.status = 'free'
       AND cp.user_id != ?
     ORDER BY RANDOM()
     LIMIT 1`,
    [req.caretaker_user_id ?? 0],
  );

  if (!next) {
    return NextResponse.json(
      { error: "Свободных сиделок для переноса сейчас нет" },
      { status: 409 },
    );
  }

  const tx = await db.transaction();
  try {
    await tx.execute({
      sql: `UPDATE caretaker_requests
               SET status = 'offered', caretaker_user_id = ?, updated_at = datetime('now')
             WHERE id = ?`,
      args: [next.user_id, requestId],
    });

    // Новая сиделка — в ожидание
    await tx.execute({
      sql: `UPDATE caretaker_profiles SET status = 'waiting', updated_at = datetime('now')
            WHERE user_id = ?`,
      args: [next.user_id],
    });

    // Прежняя — освобождается, если у неё не осталось других предложенных/принятых
    if (req.caretaker_user_id) {
      await tx.execute({
        sql: `UPDATE caretaker_profiles
                 SET status = CASE
                       WHEN EXISTS (SELECT 1 FROM caretaker_requests
                                     WHERE caretaker_user_id = ?
                                       AND status IN ('offered', 'accepted'))
                         THEN status ELSE 'free' END,
                     updated_at = datetime('now')
               WHERE user_id = ?`,
        args: [req.caretaker_user_id, req.caretaker_user_id],
      });
    }

    await tx.commit();
  } catch (error) {
    await tx.rollback();
    throw error;
  }

  await notify(
    user.id,
    "transferred",
    "Заявка перенесена",
    `Заявка №${req.id} передана сиделке ${next.full_name}. Ожидаем её ответа.`,
  );
  await notify(
    next.user_id,
    "offered",
    "Новый заказ",
    `Заявка №${req.id}: ${req.ward_name}. Проверьте кабинет — заявка ждёт вашего ответа.`,
  );

  return NextResponse.json({ ok: true, caretakerName: next.full_name });
}
