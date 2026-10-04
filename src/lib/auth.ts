import crypto from "node:crypto";
import { cookies } from "next/headers";
import bcrypt from "bcryptjs";
import { getDb } from "./db";

export const SESSION_COOKIE = "patronage_session";
const SESSION_TTL_DAYS = 30;

export type SessionUser = {
  id: number;
  email: string;
  role: "user" | "employee" | "admin";
  fullName: string | null;
  phone: string | null;
};

export function hashPassword(password: string): string {
  return bcrypt.hashSync(password, 10);
}

export function verifyPassword(password: string, hash: string): boolean {
  return bcrypt.compareSync(password, hash);
}

/** Создаёт запись сессии в БД и возвращает токен для cookie. */
export function createSession(userId: number): string {
  const db = getDb();
  const token = crypto.randomBytes(32).toString("hex");
  const expires = new Date(Date.now() + SESSION_TTL_DAYS * 24 * 60 * 60 * 1000);
  db.prepare(
    `INSERT INTO sessions (token, user_id, expires_at) VALUES (?, ?, ?)`,
  ).run(token, userId, expires.toISOString());
  return token;
}

export async function setSessionCookie(token: string): Promise<void> {
  const store = await cookies();
  store.set(SESSION_COOKIE, token, {
    httpOnly: true,
    sameSite: "lax",
    path: "/",
    maxAge: SESSION_TTL_DAYS * 24 * 60 * 60,
  });
}

export async function clearSessionCookie(): Promise<void> {
  const store = await cookies();
  store.delete(SESSION_COOKIE);
}

/** Текущий пользователь по cookie сессии или null. */
export async function getCurrentUser(): Promise<SessionUser | null> {
  const store = await cookies();
  const token = store.get(SESSION_COOKIE)?.value;
  if (!token) return null;

  const db = getDb();
  const row = db
    .prepare(
      `SELECT u.id, u.email, u.role, p.full_name, p.phone, s.expires_at
         FROM sessions s
         JOIN users u ON u.id = s.user_id
         LEFT JOIN user_profiles p ON p.user_id = u.id
        WHERE s.token = ?`,
    )
    .get(token) as
    | {
        id: number;
        email: string;
        role: "user" | "employee" | "admin";
        full_name: string | null;
        phone: string | null;
        expires_at: string;
      }
    | undefined;

  if (!row) return null;
  if (new Date(row.expires_at).getTime() < Date.now()) {
    db.prepare(`DELETE FROM sessions WHERE token = ?`).run(token);
    return null;
  }

  return {
    id: row.id,
    email: row.email,
    role: row.role,
    fullName: row.full_name,
    phone: row.phone,
  };
}

/** Удаляет сессию из БД и гасит cookie. */
export async function destroySession(): Promise<void> {
  const store = await cookies();
  const token = store.get(SESSION_COOKIE)?.value;
  if (token) {
    getDb().prepare(`DELETE FROM sessions WHERE token = ?`).run(token);
  }
  await clearSessionCookie();
}

export function isStaff(user: SessionUser | null): boolean {
  return user?.role === "admin" || user?.role === "employee";
}
