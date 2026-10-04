import { createClient, type Client } from "@libsql/client";
import fs from "node:fs";
import path from "node:path";
import bcrypt from "bcryptjs";
import seedSnapshotJson from "./db-seed.json";

/**
 * База данных через @libsql/client:
 *  — если заданы TURSO_DATABASE_URL и TURSO_AUTH_TOKEN — работаем
 *    с облачной базой Turso (данные переживают любой рестарт,
 *    все инстансы видят одно состояние);
 *  — иначе локальный файл data/patronage.db (на Vercel — в /tmp,
 *    с автосевом из снапшота db-seed.json).
 *
 * API libsql асинхронный, поэтому getDb() возвращает Promise<Client> —
 * все потребители ждут его перед запросами. Схема и сев выполняются
 * один раз при первом обращении (глобально закешированный промис).
 *
 * Схема — третья нормальная форма: телефон у профиля, цена у тарифа,
 * состояние — только у заявки (см. таблицы ниже).
 */

const DATA_DIR = process.env.VERCEL
  ? "/tmp/patronage-data"
  : path.join(process.cwd(), "data");

const TURSO_URL = process.env.TURSO_DATABASE_URL;
const TURSO_TOKEN = process.env.TURSO_AUTH_TOKEN;

const DB_URL =
  TURSO_URL && TURSO_TOKEN
    ? TURSO_URL
    : `file:${path.join(DATA_DIR, "patronage.db").replace(/\\/g, "/")}`;

const IS_REMOTE = DB_URL.startsWith("libsql:") || DB_URL.startsWith("https:");

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

  CREATE TABLE IF NOT EXISTS plans (
    id            INTEGER PRIMARY KEY AUTOINCREMENT,
    name          TEXT NOT NULL UNIQUE,
    monthly_price INTEGER NOT NULL,
    note          TEXT,
    is_popular    INTEGER NOT NULL DEFAULT 0
  );

  CREATE TABLE IF NOT EXISTS plan_features (
    id         INTEGER PRIMARY KEY AUTOINCREMENT,
    plan_id    INTEGER NOT NULL REFERENCES plans(id) ON DELETE CASCADE,
    feature    TEXT NOT NULL,
    sort_order INTEGER NOT NULL DEFAULT 0
  );

  CREATE TABLE IF NOT EXISTS requests (
    id          INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id     INTEGER NOT NULL REFERENCES users(id),
    employee_id INTEGER REFERENCES users(id),
    status      TEXT NOT NULL DEFAULT 'new'
                CHECK (status IN ('new', 'in_progress', 'done', 'cancelled')),
    message     TEXT,
    ward_name   TEXT,
    passport    TEXT,
    description TEXT,
    plan_id     INTEGER REFERENCES plans(id),
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

  CREATE TABLE IF NOT EXISTS request_deletions (
    id          INTEGER PRIMARY KEY AUTOINCREMENT,
    request_id  INTEGER NOT NULL,
    user_id     INTEGER NOT NULL,
    deleted_by  INTEGER NOT NULL REFERENCES users(id),
    reason      TEXT NOT NULL,
    created_at  TEXT NOT NULL DEFAULT (datetime('now'))
  );

  CREATE INDEX IF NOT EXISTS idx_requests_user     ON requests(user_id);
  CREATE INDEX IF NOT EXISTS idx_requests_employee ON requests(employee_id);
  CREATE INDEX IF NOT EXISTS idx_messages_convo    ON messages(conversation_id);
  CREATE INDEX IF NOT EXISTS idx_plan_features     ON plan_features(plan_id);
`;

/** Демо-аккаунты создаются, только если база пуста и нет снапшота. */
const SEED_USERS = [
  { email: "admin@patronage.ru", password: "Admin123!", role: "admin" as const },
  { email: "employee@patronage.ru", password: "Employee123!", role: "employee" as const },
];

const SEED_PLANS = [
  {
    name: "Стандарт",
    monthlyPrice: 45000,
    note: "Базовый уход и комфорт",
    isPopular: 0,
    features: [
      "Место в двухместной комнате",
      "Пятиразовое питание",
      "Ежедневный уход и присмотр",
      "Врачебный осмотр раз в неделю",
      "Прогулки и досуг с группой",
    ],
  },
  {
    name: "Комфорт",
    monthlyPrice: 65000,
    note: "Оптимальное сочетание цены и заботы",
    isPopular: 1,
    features: [
      "Комната на двоих с санузлом",
      "Питание с выбором блюд",
      "Уход 24/7 и помощь с гигиеной",
      "Врачебный осмотр дважды в неделю",
      "Индивидуальные занятия",
      "Видеосвязь с родственниками",
    ],
  },
  {
    name: "Премиум",
    monthlyPrice: 95000,
    note: "Максимальное внимание и сервис",
    isPopular: 0,
    features: [
      "Одноместный номер повышенной комфортности",
      "Индивидуальное меню по рекомендациям врача",
      "Персональный сотрудник по уходу",
      "Ежедневный врачебный контроль",
      "Физиопроцедуры и реабилитация",
      "Приоритетная связь с руководством",
    ],
  },
];

const SNAPSHOT_TABLES = [
  "users",
  "user_profiles",
  "plans",
  "plan_features",
  "requests",
  "conversations",
  "messages",
] as const;

/** Заливает снапшот db-seed.json в пустую базу (batch-вставками). */
async function importSnapshot(client: Client) {
  const snapshot = seedSnapshotJson as unknown as {
    tables: Record<string, Record<string, unknown>[]>;
  };

  for (const table of SNAPSHOT_TABLES) {
    const rows = snapshot.tables[table] ?? [];
    if (rows.length === 0) continue;

    const columns = Object.keys(rows[0]);
    const sql = `INSERT INTO ${table} (${columns.map((c) => `"${c}"`).join(", ")})
                 VALUES (${columns.map(() => "?").join(", ")})`;

    // libsql batch — единая атомарная пачка
    for (let i = 0; i < rows.length; i += 50) {
      const chunk = rows.slice(i, i + 50).map(
        (row) =>
          ({
            sql,
            args: columns.map((column) => row[column]),
          }) as never,
      );
      await client.batch(chunk, "write");
    }

    // Сдвиг счётчика автоинкремента (таблицы с id; у user_profiles ключ user_id)
    if (table !== "user_profiles") {
      try {
        await client.executeMultiple(
          `UPDATE sqlite_sequence SET seq = (SELECT MAX(id) FROM ${table}) WHERE name = '${table}';
           INSERT INTO sqlite_sequence(name, seq) SELECT '${table}', (SELECT MAX(id) FROM ${table}) WHERE NOT EXISTS (SELECT 1 FROM sqlite_sequence WHERE name = '${table}');`,
        );
      } catch {
        // sqlite_sequence недоступен — AUTOINCREMENT сам догонит при вставках
      }
    }
  }
}

/** Демо-аккаунты и справочник тарифов (когда нет снапшота). */
async function seedDefaults(client: Client) {
  for (const user of SEED_USERS) {
    await client.execute({
      sql: `INSERT OR IGNORE INTO users (email, password_hash, role) VALUES (?, ?, ?)`,
      args: [user.email, bcrypt.hashSync(user.password, 10), user.role],
    });
  }

  const planCount = await dbGet<{ c: number }>(client, `SELECT COUNT(*) AS c FROM plans`);
  if (Number(planCount?.c ?? 0) === 0) {
    for (const plan of SEED_PLANS) {
      const result = await client.execute({
        sql: `INSERT INTO plans (name, monthly_price, note, is_popular) VALUES (?, ?, ?, ?)`,
        args: [plan.name, plan.monthlyPrice, plan.note, plan.isPopular],
      });
      const planId = Number(result.lastInsertRowid);
      await client.batch(
        plan.features.map(
          (feature, index) =>
            ({
              sql: `INSERT INTO plan_features (plan_id, feature, sort_order) VALUES (?, ?, ?)`,
              args: [planId, feature, index],
            }) as never,
        ),
        "write",
      );
    }
  }
}

/** Инициализация: схема → (снапшот | демо-данные). Выполняется один раз. */
async function initDb(client: Client) {
  await client.executeMultiple(SCHEMA);

  const usersRow = await dbGet<{ c: number }>(client, `SELECT COUNT(*) AS c FROM users`);
  if (Number(usersRow?.c ?? 0) > 0) return;

  const snapshot = seedSnapshotJson as unknown as { tables: { users?: unknown[] } };
  if (snapshot.tables.users?.length) {
    await importSnapshot(client);
    return;
  }

  await seedDefaults(client);
}

type GlobalDb = typeof globalThis & {
  __patronageClient?: Client;
  __patronageReady?: Promise<void>;
};
const globalForDb = globalThis as GlobalDb;

/** Единая точка доступа к базе: ждите перед запросами. */
export async function getDb(): Promise<Client> {
  if (!globalForDb.__patronageClient) {
    if (!IS_REMOTE) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
    const client = createClient(
      IS_REMOTE ? { url: DB_URL, authToken: TURSO_TOKEN } : { url: DB_URL },
    );
    globalForDb.__patronageClient = client;
    globalForDb.__patronageReady = initDb(client).catch((error) => {
      // Сбрасываем кеш, чтобы следующая попытка начала заново
      globalForDb.__patronageClient = undefined;
      globalForDb.__patronageReady = undefined;
      throw error;
    });
  }

  await globalForDb.__patronageReady;
  return globalForDb.__patronageClient;
}

/** Первая строка результата (аналог .get() в better-sqlite3). */
export async function dbGet<T>(
  client: Client,
  sql: string,
  args: unknown[] = [],
): Promise<T | undefined> {
  const rs = await client.execute({ sql, args: args as never });
  return rs.rows[0] as T | undefined;
}

/** Все строки результата (аналог .all() в better-sqlite3). */
export async function dbAll<T>(
  client: Client,
  sql: string,
  args: unknown[] = [],
): Promise<T[]> {
  const rs = await client.execute({ sql, args: args as never });
  return rs.rows as unknown as T[];
}
