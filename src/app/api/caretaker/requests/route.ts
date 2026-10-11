import { NextResponse } from "next/server";
import { dbAll, dbGet, getDb } from "@/lib/db";
import { getCurrentUser } from "@/lib/auth";

/** Кабинет сиделки: её статус, предложенные и принятые заявки. */
export async function GET() {
  const user = await getCurrentUser();
  if (user?.role !== "caretaker") {
    return NextResponse.json({ error: "Доступ запрещён" }, { status: 403 });
  }

  const db = await getDb();

  const profile = await dbGet<{
    full_name: string;
    experience_years: number;
    status: "free" | "waiting" | "busy";
  }>(
    db,
    `SELECT full_name, experience_years, status FROM caretaker_profiles WHERE user_id = ?`,
    [user.id],
  );

  const offers = await dbAll<{
    id: number;
    status: string;
    ward_name: string;
    ward_age: number | null;
    address: string | null;
    tasks: string | null;
    start_date: string | null;
    notes: string | null;
    arrival_minutes: number | null;
    created_at: string;
    client_name: string | null;
    client_email: string;
    client_phone: string | null;
  }>(
    db,
    `SELECT cr.id, cr.status, cr.ward_name, cr.ward_age, cr.address, cr.tasks,
            cr.start_date, cr.notes, cr.arrival_minutes, cr.created_at,
            u.email AS client_email,
            p.full_name AS client_name,
            p.phone AS client_phone
       FROM caretaker_requests cr
       JOIN users u ON u.id = cr.user_id
       LEFT JOIN user_profiles p ON p.user_id = cr.user_id
      WHERE cr.caretaker_user_id = ?
        AND cr.status IN ('offered', 'accepted')
      ORDER BY cr.id DESC`,
    [user.id],
  );

  return NextResponse.json({ profile, offers });
}
