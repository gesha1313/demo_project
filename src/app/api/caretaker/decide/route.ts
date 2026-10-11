import { NextResponse } from "next/server";
import { dbGet, getDb } from "@/lib/db";
import { getCurrentUser } from "@/lib/auth";

/**
 * Решение сиделки по заявке:
 *  accept  → заявка «принята», сиделка «в работе»;
 *  decline → заявка «отказ», повторный подбор другой свободной сиделке,
 *            а сама сиделка освобождается, если других предложенных нет.
 */
export async function POST(request: Request) {
  const user = await getCurrentUser();
  if (user?.role !== "caretaker") {
    return NextResponse.json({ error: "Доступ запрещён" }, { status: 403 });
  }

  let body: { requestId?: number; decision?: string };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Некорректный запрос" }, { status: 400 });
  }

  const requestId = Number(body.requestId);
  const decision = body.decision === "accept" ? "accept" : body.decision === "decline" ? "decline" : null;

  if (!Number.isInteger(requestId) || requestId <= 0 || !decision) {
    return NextResponse.json({ error: "Некорректные данные" }, { status: 400 });
  }

  const db = await getDb();
  const req = await dbGet<{ id: number; status: string }>(
    db,
    `SELECT id, status FROM caretaker_requests
      WHERE id = ? AND caretaker_user_id = ?`,
    [requestId, user.id],
  );

  if (!req) {
    return NextResponse.json({ error: "Заявка не найдена" }, { status: 404 });
  }
  if (req.status !== "offered") {
    return NextResponse.json({ error: "Заявка уже не ждёт ответа" }, { status: 400 });
  }

  const tx = await db.transaction();
  try {
    if (decision === "accept") {
      await tx.execute({
        sql: `UPDATE caretaker_requests SET status = 'accepted', updated_at = datetime('now')
              WHERE id = ?`,
        args: [requestId],
      });
      await tx.execute({
        sql: `UPDATE caretaker_profiles SET status = 'busy', updated_at = datetime('now')
              WHERE user_id = ?`,
        args: [user.id],
      });
    } else {
      // Отказ: заявка уходит этой сиделке и тут же предлагается другой свободной
      await tx.execute({
        sql: `UPDATE caretaker_requests SET status = 'declined', updated_at = datetime('now')
              WHERE id = ?`,
        args: [requestId],
      });

      const next = await dbGet<{ user_id: number }>(
        tx as never,
        `SELECT cp.user_id FROM caretaker_profiles cp
          JOIN users u ON u.id = cp.user_id
         WHERE cp.status = 'free' AND cp.user_id != ?
         ORDER BY RANDOM() LIMIT 1`,
        [user.id],
      );

      if (next) {
        await tx.execute({
          sql: `UPDATE caretaker_requests
                  SET status = 'offered', caretaker_user_id = ?, updated_at = datetime('now')
                WHERE id = ?`,
          args: [next.user_id, requestId],
        });
        await tx.execute({
          sql: `UPDATE caretaker_profiles SET status = 'waiting', updated_at = datetime('now')
                WHERE user_id = ?`,
          args: [next.user_id],
        });
      }

      // Отказавшая сиделка освобождается, если других предложенных заявок нет
      // (занятой — «в работе» — статус не трогаем)
      await tx.execute({
        sql: `UPDATE caretaker_profiles
                 SET status = CASE
                       WHEN EXISTS (SELECT 1 FROM caretaker_requests
                                     WHERE caretaker_user_id = ? AND status = 'offered')
                         THEN 'waiting' ELSE 'free' END,
                     updated_at = datetime('now')
               WHERE user_id = ? AND status = 'waiting'`,
        args: [user.id, user.id],
      });
    }

    await tx.commit();
  } catch (error) {
    await tx.rollback();
    throw error;
  }

  return NextResponse.json({ ok: true });
}
