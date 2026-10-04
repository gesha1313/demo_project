import crypto from "node:crypto";
import { cookies } from "next/headers";
import bcrypt from "bcryptjs";
import { dbGet, getDb } from "./db";

export const SESSION_COOKIE = "patronage_session";
const SESSION_TTL_DAYS = 30;

/**
 * Сессии — stateless: в cookie лежит подписанный HMAC-SHA256 токен
 * (id, email, роль, срок). Любой serverless-инстанс проверяет подпись
 * сам, без записи в базе — поэтому вход не зависит от того, какой
 * инстанс обработал логин. Продуктивный секрет задаётся переменной
 * AUTH_SECRET; без неё используется девелоперский.
 */
const SECRET = process.env.AUTH_SECRET ?? "patronage-dev-secret-do-not-use-in-prod";

export type SessionUser = {
  id: number;
  email: string;
  role: "user" | "employee" | "admin";
  fullName: string | null;
  phone: string | null;
};

type TokenPayload = {
  id: number;
  email: string;
  role: "user" | "employee" | "admin";
  exp: string;
};

export function hashPassword(password: string): string {
  return bcrypt.hashSync(password, 10);
}

export function verifyPassword(password: string, hash: string): boolean {
  return bcrypt.compareSync(password, hash);
}

function sign(payload: string): string {
  return crypto.createHmac("sha256", SECRET).update(payload).digest("hex");
}

/** Подписанный токен сессии: base64url(payload).hmac */
export function createSessionToken(user: {
  id: number;
  email: string;
  role: "user" | "employee" | "admin";
}): string {
  const payload: TokenPayload = {
    id: user.id,
    email: user.email,
    role: user.role,
    exp: new Date(Date.now() + SESSION_TTL_DAYS * 24 * 60 * 60 * 1000).toISOString(),
  };
  const encoded = Buffer.from(JSON.stringify(payload)).toString("base64url");
  return `${encoded}.${sign(encoded)}`;
}

export function verifySessionToken(token: string): TokenPayload | null {
  const dot = token.lastIndexOf(".");
  if (dot <= 0) return null;

  const encoded = token.slice(0, dot);
  const signature = token.slice(dot + 1);
  const expected = sign(encoded);

  const a = Buffer.from(signature);
  const b = Buffer.from(expected);
  if (a.length !== b.length || !crypto.timingSafeEqual(a, b)) return null;

  try {
    const payload = JSON.parse(Buffer.from(encoded, "base64url").toString()) as TokenPayload;
    if (new Date(payload.exp).getTime() < Date.now()) return null;
    return payload;
  } catch {
    return null;
  }
}

/** Ставит cookie с подписанным токеном (вызывается после логина/регистрации). */
export async function startSession(user: {
  id: number;
  email: string;
  role: "user" | "employee" | "admin";
}): Promise<void> {
  const store = await cookies();
  store.set(SESSION_COOKIE, createSessionToken(user), {
    httpOnly: true,
    sameSite: "lax",
    path: "/",
    maxAge: SESSION_TTL_DAYS * 24 * 60 * 60,
  });
}

/**
 * Текущий пользователь: подпись и срок проверяются без БД,
 * профиль (имя, телефон) подтягивается из базы, если она доступна.
 */
export async function getCurrentUser(): Promise<SessionUser | null> {
  const store = await cookies();
  const token = store.get(SESSION_COOKIE)?.value;
  if (!token) return null;

  const payload = verifySessionToken(token);
  if (!payload) return null;

  let fullName: string | null = null;
  let phone: string | null = null;
  try {
    const db = await getDb();
    const profile = await dbGet<{ full_name: string | null; phone: string | null }>(
      db,
      `SELECT full_name, phone FROM user_profiles WHERE user_id = ?`,
      [payload.id],
    );
    fullName = profile?.full_name ?? null;
    phone = profile?.phone ?? null;
  } catch {
    // База недоступна — авторизация всё равно валидна, просто без профиля
  }

  return {
    id: payload.id,
    email: payload.email,
    role: payload.role,
    fullName,
    phone,
  };
}

/** Выход: гасим cookie (сессия stateless, записи в БД нет). */
export async function destroySession(): Promise<void> {
  const store = await cookies();
  store.delete(SESSION_COOKIE);
}

export function isStaff(user: SessionUser | null): boolean {
  return user?.role === "admin" || user?.role === "employee";
}
