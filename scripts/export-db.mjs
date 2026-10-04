import Database from "better-sqlite3";
import fs from "node:fs";
import path from "node:path";

/**
 * Экспорт текущей базы в снапшот src/lib/db-seed.json.
 *
 * Снапшот коммитится в репозиторий: при деплое на serverless-хостинг
 * (Vercel) файловая система не сохраняется, поэтому каждый запуск
 * получает пустую базу — initDb в src/lib/db.ts автоматически
 * восстанавливает данные из снапшота. Существующие аккаунты
 * продолжают работать, вход по прежним паролям.
 *
 * Запуск: npm run db:export
 */

const TABLES = [
  "users",
  "user_profiles",
  "plans",
  "plan_features",
  "requests",
  "conversations",
  "messages",
];

const dbPath = path.join(process.cwd(), "data", "patronage.db");
const outPath = path.join(process.cwd(), "src", "lib", "db-seed.json");

if (!fs.existsSync(dbPath)) {
  console.error("База не найдена:", dbPath);
  process.exit(1);
}

const db = new Database(dbPath, { readonly: true });

const snapshot = {
  exportedAt: new Date().toISOString(),
  tables: {},
};

for (const table of TABLES) {
  snapshot.tables[table] = db.prepare(`SELECT * FROM ${table}`).all();
}

db.close();

fs.mkdirSync(path.dirname(outPath), { recursive: true });
fs.writeFileSync(outPath, JSON.stringify(snapshot, null, 2));

const summary = TABLES.map((t) => `${t}=${snapshot.tables[t].length}`).join(", ");
console.log(`Снапшот сохранён в src/lib/db-seed.json (${summary})`);
