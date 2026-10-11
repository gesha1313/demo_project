/**
 * Разовый сброс базы под систему сиделок:
 *  — все заявки (пансионат и сиделки) и журнал удалений очищаются;
 *  — таблицы пересоздаются под новую схему (роль caretaker, caretaker_profiles);
 *  — пользователи, профили и чаты сохраняются;
 *  — создаются 3 демо-сиделки со статусом «свободна».
 *
 * Запуск:  node scripts/reset-db.mjs           → Turso (из .env.local)
 *          node scripts/reset-db.mjs --local   → локальный файл data/patronage.db
 */
import { createClient } from "@libsql/client";
import fs from "node:fs";
import path from "node:path";
import bcrypt from "bcryptjs";

const isLocal = process.argv.includes("--local");

let url;
let token;
if (isLocal) {
  url =
    "file:" +
    path.join(process.cwd(), "data", "patronage.db").replace(/\\/g, "/");
  token = undefined;
} else {
  const env = fs.readFileSync(".env.local", "utf8");
  url = env.match(/^TURSO_DATABASE_URL=(.+)$/m)[1].trim();
  token = env.match(/^TURSO_AUTH_TOKEN=(.+)$/m)[1].trim();
}
const db = createClient(token ? { url, authToken: token } : { url });

// Схему берём из db.ts, чтобы не разошлись версии
const dbSource = fs.readFileSync(path.join(process.cwd(), "src", "lib", "db.ts"), "utf8");
const schema = dbSource.match(/const SCHEMA = `([\s\S]*?)`;/)[1];

const ALL_TABLES = [
  "messages",
  "conversations",
  "request_deletions",
  "caretaker_requests",
  "caretaker_profiles",
  "requests",
  "plan_features",
  "plans",
  "sessions",
  "user_profiles",
  "users",
];

const SEED_PLANS = [
  { name: "Стандарт", price: 45000, note: "Базовый уход и комфорт", popular: 0, features: ["Место в двухместной комнате", "Пятиразовое питание", "Ежедневный уход и присмотр", "Врачебный осмотр раз в неделю", "Прогулки и досуг с группой"] },
  { name: "Комфорт", price: 65000, note: "Оптимальное сочетание цены и заботы", popular: 1, features: ["Комната на двоих с санузлом", "Питание с выбором блюд", "Уход 24/7 и помощь с гигиеной", "Врачебный осмотр дважды в неделю", "Индивидуальные занятия", "Видеосвязь с родственниками"] },
  { name: "Премиум", price: 95000, note: "Максимальное внимание и сервис", popular: 0, features: ["Одноместный номер повышенной комфортности", "Индивидуальное меню по рекомендациям врача", "Персональный сотрудник по уходу", "Ежедневный врачебный контроль", "Физиопроцедуры и реабилитация", "Приоритетная связь с руководством"] },
];

const SEED_CARETAKERS = [
  { email: "elena@patronage.ru", password: "Caretaker123!", fullName: "Елена", experience: 9 },
  { email: "olga@patronage.ru", password: "Caretaker123!", fullName: "Ольга", experience: 12 },
  { email: "marina@patronage.ru", password: "Caretaker123!", fullName: "Марина", experience: 6 },
];

const insertRows = async (table, rows) => {
  if (!rows.length) return;
  const columns = Object.keys(rows[0]);
  const sql = `INSERT INTO ${table} (${columns.map((c) => `"${c}"`).join(", ")})
               VALUES (${columns.map(() => "?").join(", ")})`;
  for (let i = 0; i < rows.length; i += 50) {
    await db.batch(
      rows.slice(i, i + 50).map((row) => ({ sql, args: columns.map((c) => row[c]) })),
      "write",
    );
  }
  console.log(`  ${table}: ${rows.length} восстановлено`);
};

const bumpSeq = async (table) => {
  try {
    await db.executeMultiple(
      `UPDATE sqlite_sequence SET seq = (SELECT MAX(id) FROM ${table}) WHERE name = '${table}';
       INSERT INTO sqlite_sequence(name, seq) SELECT '${table}', (SELECT MAX(id) FROM ${table})
        WHERE NOT EXISTS (SELECT 1 FROM sqlite_sequence WHERE name = '${table}');`,
    );
  } catch {}
};

console.log("Подключение:", url);

// 1. Сохраняем то, что не входит в «заявки»
const users = (await db.execute("SELECT * FROM users")).rows;
const profiles = (await db.execute("SELECT * FROM user_profiles")).rows;
const convos = (await db.execute("SELECT * FROM conversations")).rows;
const messages = (await db.execute("SELECT * FROM messages")).rows;
console.log(`Сохраняем: users=${users.length}, profiles=${profiles.length}, chats=${convos.length}/${messages.length}`);

// 2. Сносим всё и пересоздаём схему
try { await db.execute("PRAGMA foreign_keys=OFF"); } catch {}
for (const table of ALL_TABLES) {
  try { await db.execute(`DROP TABLE IF EXISTS ${table}`); } catch (e) { console.log(`  ! drop ${table}: ${e.message}`); }
}
await db.executeMultiple(schema);
console.log("Схема пересоздана (заявки очищены)");

// 3. Восстанавливаем сохранённое
await insertRows("users", users);
await insertRows("user_profiles", profiles);
await insertRows("conversations", convos);
await insertRows("messages", messages);

// 4. Тарифы
for (const plan of SEED_PLANS) {
  const r = await db.execute({
    sql: `INSERT INTO plans (name, monthly_price, note, is_popular) VALUES (?, ?, ?, ?)`,
    args: [plan.name, plan.price, plan.note, plan.popular],
  });
  const pid = Number(r.lastInsertRowid);
  await db.batch(
    plan.features.map((f, i) => ({
      sql: `INSERT INTO plan_features (plan_id, feature, sort_order) VALUES (?, ?, ?)`,
      args: [pid, f, i],
    })),
    "write",
  );
}
console.log("  plans: 3 тарифа");

// 5. Сиделки
for (const c of SEED_CARETAKERS) {
  const r = await db.execute({
    sql: `INSERT INTO users (email, password_hash, role) VALUES (?, ?, 'caretaker')`,
    args: [c.email, bcrypt.hashSync(c.password, 10)],
  });
  await db.execute({
    sql: `INSERT INTO caretaker_profiles (user_id, full_name, experience_years, status) VALUES (?, ?, ?, 'free')`,
    args: [Number(r.lastInsertRowid), c.fullName, c.experience],
  });
  console.log(`  сиделка: ${c.fullName} (${c.email}) — свободна`);
}

// 6. Счётчики автоинкремента
for (const table of ["users", "user_profiles", "plans", "plan_features", "conversations", "messages"]) {
  await bumpSeq(table);
}

// 7. Итог
const summary = await db.execute(`
  SELECT (SELECT COUNT(*) FROM users) AS users,
         (SELECT COUNT(*) FROM caretaker_profiles) AS caretakers,
         (SELECT COUNT(*) FROM caretaker_requests) AS c_requests,
         (SELECT COUNT(*) FROM requests) AS p_requests
`);
console.log("Итог:", JSON.stringify(summary.rows[0]));
