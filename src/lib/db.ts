import Database from "better-sqlite3";
import fs from "node:fs";
import path from "node:path";
import bcrypt from "bcryptjs";

/**
 * Схема БД (SQLite, третья нормальная форма):
 *
 * users          — аккаунты: email + хеш пароля + роль (user | employee | admin)
 * user_profiles  — профиль клиента (1:1 с users): имя, телефон для связи
 * sessions       — сессии авторизации (token в httpOnly-cookie)
 * requests       — заявки на консультацию: клиент → назначенный сотрудник
 * conversations  — диалоги горячей линии (клиент ↔ сотрудник поддержки)
 * messages       — сообщения в диалогах
 *
 * Каждая неключевая характеристика зависит только от ключа своей таблицы:
 * например, телефон зависит от пользователя (user_profiles.user_id),
 * а не от заявки; текст и статус — только от конкретной заявки.
 */

const DATA_DIR = path.join(process.cwd(), "data");

const SCHEMA = `
  CREATE TABLE IF NOT EXISTS users (
    id            INTEGER PRIMARY KEY AUTOINCREMENT,
    email         TEXT NOT NULL UNIQUE COLLATE NOCASE,
    password_hash TEXT NOT NULL,
    role          TEXT NOT NULL DEFAULT 'user'
                  CHECK (role IN ('user', 'employee', 'admin')),
    created_at    TEXT NOT NULL DEFAULT (datetime('now'))
  );

  CREATE TABLE IF NOT EXISTS user_profiles (
    user_id    INTEGER PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
    full_name  TEXT,
    phone      TEXT,
    updated_at TEXT NOT NULL DEFAULT (datetime('now'))
  );

  CREATE TABLE IF NOT EXISTS sessions (
    id         INTEGER PRIMARY KEY AUTOINCREMENT,
    token      TEXT NOT NULL UNIQUE,
    user_id    INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    created_at TEXT NOT NULL DEFAULT (datetime('now')),
    expires_at TEXT NOT NULL
  );

  CREATE TABLE IF NOT EXISTS requests (
    id          INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id     INTEGER NOT NULL REFERENCES users(id),
    employee_id INTEGER REFERENCES users(id),
    status      TEXT NOT NULL DEFAULT 'new'
                CHECK (status IN ('new', 'in_progress', 'done', 'cancelled')),
    message     TEXT,
    created_at  TEXT NOT NULL DEFAULT (datetime('now')),
    updated_at  TEXT NOT NULL DEFAULT (datetime('now'))
  );

  CREATE TABLE IF NOT EXISTS conversations (
    id          INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id     INTEGER NOT NULL REFERENCES users(id),
    employee_id INTEGER REFERENCES users(id),
    status      TEXT NOT NULL DEFAULT 'open'
                CHECK (status IN ('open', 'closed')),
    created_at  TEXT NOT NULL DEFAULT (datetime('now')),
    updated_at  TEXT NOT NULL DEFAULT (datetime('now'))
  );

  CREATE TABLE IF NOT EXISTS messages (
    id              INTEGER PRIMARY KEY AUTOINCREMENT,
    conversation_id INTEGER NOT NULL REFERENCES conversations(id) ON DELETE CASCADE,
    sender_id       INTEGER NOT NULL REFERENCES users(id),
    body            TEXT NOT NULL,
    created_at      TEXT NOT NULL DEFAULT (datetime('now'))
  );

  CREATE INDEX IF NOT EXISTS idx_requests_user     ON requests(user_id);
  CREATE INDEX IF NOT EXISTS idx_requests_employee ON requests(employee_id);
  CREATE INDEX IF NOT EXISTS idx_messages_convo    ON messages(conversation_id);
`;

/** Демо-администратор и демо-сотрудник поддержки создаются при первом запуске. */
const SEED_USERS = [
  { email: "admin@patronage.ru", password: "Admin123!", role: "admin" as const },
  { email: "employee@patronage.ru", password: "Employee123!", role: "employee" as const },
];

function initDb(db: Database.Database) {
  db.exec(SCHEMA);

  const seed = db.prepare(
    `INSERT OR IGNORE INTO users (email, password_hash, role) VALUES (?, ?, ?)`,
  );
  for (const user of SEED_USERS) {
    seed.run(user.email, bcrypt.hashSync(user.password, 10), user.role);
  }
}

const globalForDb = globalThis as unknown as { __patronageDb?: Database.Database };

export function getDb(): Database.Database {
  if (!globalForDb.__patronageDb) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
    const db = new Database(path.join(DATA_DIR, "patronage.db"));
    db.pragma("journal_mode = WAL");
    db.pragma("foreign_keys = ON");
    initDb(db);
    globalForDb.__patronageDb = db;
  }
  return globalForDb.__patronageDb;
}
