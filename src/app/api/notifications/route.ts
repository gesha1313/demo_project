import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { listNotifications, markAllRead } from "@/lib/notify";

/** Список уведомлений текущего пользователя (+ счётчик непрочитанных). */
export async function GET() {
  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json({ error: "Требуется вход" }, { status: 401 });
  }

  const notifications = await listNotifications(user.id);
  const unread = notifications.filter((n) => !n.is_read).length;

  return NextResponse.json({ notifications, unread });
}

/** Пометить все уведомления прочитанными. */
export async function POST() {
  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json({ error: "Требуется вход" }, { status: 401 });
  }

  await markAllRead(user.id);
  return NextResponse.json({ ok: true });
}
