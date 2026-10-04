import { createClient } from "@libsql/client";
import fs from "node:fs";
import path from "node:path";

/**
 * Заливает схему и снапшот db-seed.json в облачную базу Turso.
 *
 * Запуск (после заполнения TURSO_DATABASE_URL/TURSO_AUTH_TOKEN в .env.local):
 *   npm run db:push-turso
 *
 * Безопасно запускать повторно: если в базе уже есть пользователи,
 * снапшот не заливается (данные не перезаписываются).
 */

const ENV_FILE = path.join(process.cwd(), ".env.local");

function readEnv(key) {
  if (process.env[key]) return process.env[key];
  if (!fs.existsSync(ENV_FILE)) return undefined;
  const match = fs
    .readFileSync(ENV_FILE, "utf8")
    .split(/\r?\n/)
    .find((line) => line.startsWith(`${key}=`));
  return match ? match.slice(key.length + 1).trim() : undefined;
}

const url = readEnv("TURSO_DATABASE_URL");
const authToken = readEnv("TURSO_AUTH_TOKEN");

if (!url || !authToken) {
  console.error(
    "Заполните TURSO_DATABASE_URL и TURSO_AUTH_TOKEN в .env.local\n" +
      "  turso db create patronage\n" +
      "  turso db show patronage --url\n" +
      "  turso db tokens create patronage",
  );
  process.exit(1);
}

const snapshotPath = path.join(process.cwd(), "src", "lib", "db-seed.json");
const snapshot = JSON.parse(fs.readFileSync(snapshotPath, "utf8"));

// Схема копируется из db.ts через общий экспорт — дублируем минимум:
// читаем SCHEMA прямо из исходника, чтобы не разошлись версии
const dbSource = fs.readFileSync(path.join(process.cwd(), "src", "lib", "db.ts"), "utf8");
const schemaMatch = dbSource.match(/const SCHEMA = `([\s\S]*?)`;/);
if (!schemaMatch) {
  console.error("Не удалось извлечь SCHEMA из src/lib/db.ts");
  process.exit(1);
}

const client = createClient({ url, authToken });

const usersRow = await client
  .prepare("SELECT COUNT(*) AS c FROM users")
  .get();
const existing = Number(usersRow?.c ?? 0);

await client.executeMultiple(schemaMatch[1]);
console.log("Схема применена:", url.replace(/\/\/.*@/, "//***@"));

if (existing > 0) {
  console.log(`В базе уже есть пользователи (${existing}) — снапшот не заливался.`);
  process.exit(0);
}

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
  if (!rows.length) continue;

  const columns = Object.keys(rows[0]);
  const sql = `INSERT INTO ${table} (${columns.map((c) => `"${c}"`).join(", ")})
               VALUES (${columns.map(() => "?").join(", ")})`;

  for (let i = 0; i < rows.length; i += 50) {
    await client.batch(
      rows.slice(i, i + 50).map((row) => ({ sql, args: columns.map((c) => row[c]) })),
      "write",
    );
  }

  if (table !== "user_profiles") {
    try {
      await client.executeMultiple(
        `UPDATE sqlite_sequence SET seq = (SELECT MAX(id) FROM ${table}) WHERE name = '${table}';
         INSERT INTO sqlite_sequence(name, seq) SELECT '${table}', (SELECT MAX(id) FROM ${table})
          WHERE NOT EXISTS (SELECT 1 FROM sqlite_sequence WHERE name = '${table}');`,
      );
    } catch {
      // счётчик догонит сам при следующих вставках
    }
  }

  console.log(`  ${table}: ${rows.length}`);
}

console.log("Готово — данные из снапшота залиты в Turso.");
