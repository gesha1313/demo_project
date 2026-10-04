import Database from "better-sqlite3";
import fs from "node:fs";
import path from "node:path";
import bcrypt from "bcryptjs";
import seedSnapshotJson from "./db-seed.json";

/**
 * Схема БД (SQLite, третья нормальная форма):
 *
 * users          — аккаунты: email + хеш пароля + роль (user | employee | admin)
 * user_profiles  — профиль клиента (1:1 с users): имя, телефон для связи
 * sessions       — сессии авторизации (token в httpOnly-cookie)
 * plans          — тарифы проживания: название, цена в месяц, примечание
 * plan_features  — характеристики тарифа (1:N к plans, упорядочены)
 * requests       — заявки: подопечный, паспорт, описание, выбранный тариф,
 *                  статус, назначенный сотрудник
 * conversations  — диалоги горячей линии (клиент ↔ сотрудник поддержки)
 * messages       — сообщения в диалогах
 *
 * Каждая неключевая характеристика зависит только от ключа своей таблицы:
 * телефон — у профиля, цена и условия — у тарифа, состояние заявки —
 * только у заявки (тариф подставляется по plan_id).
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

  CREATE INDEX IF NOT EXISTS idx_requests_user     ON requests(user_id);
  CREATE INDEX IF NOT EXISTS idx_requests_employee ON requests(employee_id);
  CREATE INDEX IF NOT EXISTS idx_messages_convo    ON messages(conversation_id);
  CREATE INDEX IF NOT EXISTS idx_plan_features     ON plan_features(plan_id);
`;

/** Демо-администратор и демо-сотрудник поддержки создаются при первом запуске. */
const SEED_USERS = [
  { email: "admin@patronage.ru", password: "Admin123!", role: "admin" as const },
  { email: "employee@patronage.ru", password: "Employee123!", role: "employee" as const },
];

/** Три тарифа проживания — справочник, на который ссылается заявка. */
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

/** Добавляет отсутствующие колонки requests (миграция старой базы без потерь). */
function ensureRequestColumns(db: Database.Database) {
  const columns = new Set(
    (db.prepare(`PRAGMA table_info(requests)`).all() as { name: string }[]).map((c) => c.name),
  );

  const add = (name: string, ddl: string) => {
    if (!columns.has(name)) {
      db.exec(`ALTER TABLE requests ADD COLUMN ${name} ${ddl}`);
    }
  };

  add("ward_name", "TEXT");
  add("passport", "TEXT");
  add("description", "TEXT");
  add("plan_id", "INTEGER REFERENCES plans(id)");
}

function seedPlans(db: Database.Database) {
  const insertPlan = db.prepare(
    `INSERT OR IGNORE INTO plans (name, monthly_price, note, is_popular) VALUES (?, ?, ?, ?)`,
  );
  for (const plan of SEED_PLANS) {
    insertPlan.run(plan.name, plan.monthlyPrice, plan.note, plan.isPopular);
  }

  const featureCount = (db.prepare(`SELECT COUNT(*) AS c FROM plan_features`).get() as { c: number }).c;
  if (featureCount === 0) {
    const plans = db.prepare(`SELECT id, name FROM plans`).all() as { id: number; name: string }[];
    const insertFeature = db.prepare(
      `INSERT INTO plan_features (plan_id, feature, sort_order) VALUES (?, ?, ?)`,
    );
    for (const plan of SEED_PLANS) {
      const row = plans.find((p) => p.name === plan.name);
      if (!row) continue;
      plan.features.forEach((feature, index) => insertFeature.run(row.id, feature, index));
    }
  }
}

/**
 * Восстанавливает базу из снапшота (src/lib/db-seed.json, экспорт через
 * `npm run db:export`). Нужно на serverless-хостинге (Vercel): там файловая
 * система не переживает перезапуск, поэтому каждая холодная стартовая база
 * пуста — и initDb наполняет её снапшотом: все аккаунты, заявки и чаты
 * из репозитория доступны сразу, вход работает по прежним паролям.
 */
function importSnapshot(db: Database.Database) {
  const snapshot = seedSnapshotJson as unknown as {
    tables: Record<string, Record<string, unknown>[]>;
  };

  db.transaction(() => {
    for (const table of [
      "users",
      "user_profiles",
      "plans",
      "plan_features",
      "requests",
      "conversations",
      "messages",
    ]) {
      const rows = snapshot.tables[table] ?? [];
      if (rows.length === 0) continue;

      const columns = Object.keys(rows[0]);
      const insert = db.prepare(
        `INSERT INTO ${table} (${columns.map((c) => `"${c}"`).join(", ")})
         VALUES (${columns.map(() => "?").join(", ")})`,
      );

      for (const row of rows) {
        insert.run(...columns.map((column) => row[column]));
      }

      // Сдвигаем счётчик автоинкремента за последний вставленный id
      // (только у таблиц с id; у user_profiles ключ — user_id)
      if (table !== "user_profiles") {
        const maxId = db.prepare(`SELECT MAX(id) AS max FROM ${table}`).get() as {
          max: number | null;
        };
        if (maxId.max) {
          const updated = db
            .prepare(`UPDATE sqlite_sequence SET seq = ? WHERE name = ?`)
            .run(maxId.max, table);
          if (updated.changes === 0) {
            db.prepare(
              `INSERT INTO sqlite_sequence(name, seq) VALUES (?, ?)`,
            ).run(table, maxId.max);
          }
        }
      }
    }
  })();
}

function initDb(db: Database.Database) {
  db.exec(SCHEMA);
  ensureRequestColumns(db);

  const usersCount = (
    db.prepare(`SELECT COUNT(*) AS c FROM users`).get() as { c: number }
  ).c;

  if (usersCount === 0) {
    // Пустая база: на Vercel — каждый холодный старт, локально — первый запуск.
    // Если есть снапшот, восстанавливаем его целиком (аккаунты, тарифы, заявки,
    // чаты); иначе создаём демо-аккаунты и справочник тарифов.
    const snapshot = seedSnapshotJson as unknown as {
      tables: { users?: unknown[] };
    };
    if (snapshot.tables.users?.length) {
      importSnapshot(db);
      return;
    }

    const seedUser = db.prepare(
      `INSERT OR IGNORE INTO users (email, password_hash, role) VALUES (?, ?, ?)`,
    );
    for (const user of SEED_USERS) {
      seedUser.run(user.email, bcrypt.hashSync(user.password, 10), user.role);
    }

    seedPlans(db);
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
