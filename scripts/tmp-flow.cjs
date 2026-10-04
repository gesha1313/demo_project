// Временный скрипт: полный браузерный сценарий заявки (register → create → cabinet)
const BASE = "http://localhost:3000";

async function main() {
  const email = `flow${Date.now()}@test.ru`;

  // 1. Регистрация
  const reg = await fetch(`${BASE}/api/auth/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password: "Test1234" }),
  });
  const cookie = reg.headers.get("set-cookie").split(";")[0];
  console.log("1. Регистрация:", reg.status);

  // 2. Создание заявки (как из визарда, корректный UTF-8)
  const create = await fetch(`${BASE}/api/requests`, {
    method: "POST",
    headers: { "Content-Type": "application/json", cookie },
    body: JSON.stringify({
      wardName: "Сидоров Пётр Николаевич",
      passport: "2222 333344",
      description: "Проверка полного сценария создания заявки",
      planId: 2,
    }),
  });
  console.log("2. Создание заявки:", create.status, await create.text());

  // 3. Кабинет показывает заявку?
  const cabinet = await fetch(`${BASE}/cabinet`, { headers: { cookie } });
  const html = await cabinet.text();
  const hasWard = html.includes("Сидоров Пётр Николаевич");
  const hasPlan = html.includes("Комфорт");
  console.log("3. Кабинет:", cabinet.status, "| подопечный:", hasWard, "| тариф:", hasPlan);

  // 4. Страница всех заявок
  const all = await fetch(`${BASE}/cabinet/requests`, { headers: { cookie } });
  const allHtml = await all.text();
  console.log("4. Все заявки:", all.status, "| подопечный там:", allHtml.includes("Сидоров Пётр Николаевич"));
}

main().catch((e) => {
  console.error("FAIL:", e.message);
  process.exit(1);
});
