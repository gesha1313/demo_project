// Полный флоу-тест на новой libsql-архитектуре (локальный режим)
const BASE = "http://localhost:3000";

async function main() {
  // Ждём сервер
  for (let i = 0; i < 30; i += 1) {
    try {
      const ping = await fetch(BASE);
      if (ping.ok) break;
    } catch {}
    await new Promise((r) => setTimeout(r, 2000));
  }

  const email = `turso${Date.now()}@test.ru`;

  // 1. Логин админа
  const admin = await fetch(`${BASE}/api/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email: "admin@patronage.ru", password: "Admin123!" }),
  });
  const adminCookie = admin.headers.get("set-cookie").split(";")[0];
  console.log("1. Админ:", admin.status);

  // 2. Регистрация нового пользователя
  const reg = await fetch(`${BASE}/api/auth/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password: "Test1234" }),
  });
  const cookie = reg.headers.get("set-cookie").split(";")[0];
  console.log("2. Регистрация:", reg.status);

  // 3. Профиль (телефон)
  const profile = await fetch(`${BASE}/api/profile`, {
    method: "PUT",
    headers: { "Content-Type": "application/json", cookie },
    body: JSON.stringify({ fullName: "Тестов Тест Тестович", phone: "+7 999 000-11-22" }),
  });
  console.log("3. Профиль:", profile.status);

  // 4. Создание заявки
  const create = await fetch(`${BASE}/api/requests`, {
    method: "POST",
    headers: { "Content-Type": "application/json", cookie },
    body: JSON.stringify({
      wardName: "Сидоров Пётр Николаевич",
      passport: "2222 333344",
      description: "Проверка полного сценария на libsql",
      planId: 2,
    }),
  });
  console.log("4. Заявка:", create.status, await create.text());

  // 5. Кабинет
  const cabinet = await fetch(`${BASE}/cabinet`, { headers: { cookie } });
  const cabHtml = await cabinet.text();
  console.log(
    "5. Кабинет:",
    cabinet.status,
    "| подопечный:",
    cabHtml.includes("Сидоров Пётр Николаевич"),
    "| тариф:",
    cabHtml.includes("Комфорт"),
  );

  // 6. Все заявки
  const all = await fetch(`${BASE}/cabinet/requests`, { headers: { cookie } });
  const allHtml = await all.text();
  console.log("6. Все заявки:", all.status, "| есть:", allHtml.includes("Сидоров Пётр Николаевич"));

  // 7. Чат: приветствие
  const chat = await fetch(`${BASE}/api/chat`, { headers: { cookie } });
  const chatData = await chat.json();
  console.log("7. Чат:", chat.status, "| сообщений:", chatData.messages.length);

  // 8. Сообщение клиента
  const msg = await fetch(`${BASE}/api/chat`, {
    method: "POST",
    headers: { "Content-Type": "application/json", cookie },
    body: JSON.stringify({ body: "Вопрос про условия" }),
  });
  console.log("8. Сообщение:", msg.status);

  // 9. Админ видит заявку
  const adminReqs = await fetch(`${BASE}/api/admin/requests`, {
    headers: { cookie: adminCookie },
  });
  const reqData = await adminReqs.json();
  const mine = reqData.requests.find((r) => r.email === email);
  console.log(
    "9. Админ видит заявку:",
    adminReqs.status,
    "| подопечный:",
    mine?.ward_name,
    "| телефон:",
    mine?.phone,
  );

  // 10. Админ отвечает в чат
  const reply = await fetch(`${BASE}/api/admin/chat`, {
    method: "POST",
    headers: { "Content-Type": "application/json", cookie: adminCookie },
    body: JSON.stringify({ conversationId: chatData.conversationId, body: "Отвечаем!" }),
  });
  console.log("10. Ответ поддержки:", reply.status);

  // 11. Пользователь видит ответ
  const chat2 = await fetch(`${BASE}/api/chat`, { headers: { cookie } });
  const chat2Data = await chat2.json();
  console.log("11. Сообщений у клиента:", chat2Data.messages.length);
}

main().catch((e) => {
  console.error("FAIL:", e.message);
  process.exit(1);
});
