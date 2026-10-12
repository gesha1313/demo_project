import { getDb } from "./db";

/**
 * Уведомления пользователей (клиент и сиделка).
 * kind: info | offered | accepted | declined | transferred | queued
 */

export type NotificationRow = {
  id: number;
  kind: string;
  title: string;
  body: string | null;
  is_read: number;
  created_at: string;
};

export async function notify(
  userId: number,
  kind: string,
  title: string,
  body: string,
): Promise<void> {
  const db = await getDb();
  await db.execute({
    sql: `INSERT INTO notifications (user_id, kind, title, body) VALUES (?, ?, ?, ?)`,
    args: [userId, kind, title, body],
  });
}

export async function listNotifications(userId: number): Promise<NotificationRow[]> {
  const db = await getDb();
  const rs = await db.execute({
    sql: `SELECT id, kind, title, body, is_read, created_at
            FROM notifications
           WHERE user_id = ?
           ORDER BY id DESC`,
    args: [userId],
  });
  return rs.rows as unknown as NotificationRow[];
}

export async function markAllRead(userId: number): Promise<void> {
  const db = await getDb();
  await db.execute({
    sql: `UPDATE notifications SET is_read = 1 WHERE user_id = ?`,
    args: [userId],
  });
}
