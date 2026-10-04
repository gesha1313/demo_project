# Сайт пансионата «Патронаж»

Лендинг пансионата с личным кабинетом, горячей линией и админ-панелью.
Стек: **Next.js 16 (App Router) · React 19 · Tailwind CSS 4 · TypeScript · SQLite (better-sqlite3)**.

## Запуск

```bash
npm install
npm run dev
```

Открыть [http://localhost:3000](http://localhost:3000).

Продакшен-сборка: `npm run build && npm start`.

## Демо-аккаунты (создаются автоматически при первом запуске)

| Роль | Email | Пароль |
| --- | --- | --- |
| Администратор | `admin@patronage.ru` | `Admin123!` |
| Сотрудник | `employee@patronage.ru` | `Employee123!` |

## Маршруты и воронка

| Маршрут | Назначение |
| --- | --- |
| `/` | Лендинг: все секции пансионата |
| `/register` | Регистрация: email + пароль, индикатор надёжности пароля |
| `/register/success` | «Аккаунт создан» + следующие шаги |
| `/login` | Вход |
| `/rooms` | Номера и тарифы |
| `/cabinet` | Личный кабинет: телефон для связи, статус заявки |
| `/support` | Чат с горячей линией (клиентская сторона) |
| `/admin` | Админ-панель: заявки, пользователи, чат (staff-only) |

Регистрация по email без SMS: после входа клиент оставляет телефон
в личном кабинете — он попадает в БД и виден сотруднику в заявке.

## База данных (SQLite, 3NF)

Файл: `data/patronage.db` (создаётся автоматически). Схема — в `src/lib/db.ts`.

```
users          аккаунты: email, password_hash, role (user|employee|admin)
user_profiles  профиль (1:1): full_name, phone — телефон для связи
sessions       сессии: token (httpOnly cookie) → user_id, expires_at
requests       заявки: user_id → employee_id (кто ведёт), status, message
conversations  диалоги горячей линии: user_id ↔ employee_id
messages       сообщения диалогов: sender_id, body
```

Роли: **клиент** (user) регистрируется и оставляет заявку; **сотрудник**
(employee) ведёт назначенные ему заявки и отвечает в чате; **администратор**
(admin) видит все заявки, распределяет их между сотрудниками и меняет роли.

## API

| Метод и путь | Описание |
| --- | --- |
| `POST /api/auth/register` | Регистрация (email, пароль, комментарий) + заявка |
| `POST /api/auth/login` | Вход, ставит cookie сессии |
| `POST /api/auth/logout` | Выход |
| `PUT /api/profile` | Имя и телефон для связи (кабинет) |
| `GET/POST /api/chat` | Сообщения горячей линии клиента |
| `GET /api/admin/requests` | Заявки (admin — все, employee — свои) |
| `PATCH /api/admin/requests` | Статус заявки, назначение сотрудника |
| `GET/PATCH /api/admin/users` | Пользователи и роли (admin-only) |
| `GET/POST /api/admin/chat` | Диалоги поддержки: список и ответ (staff) |

## Структура проекта

```
src/
├── app/                    # App Router: маршруты и корневой layout
│   ├── layout.tsx          # <html lang="ru">, шрифт Manrope, метаданные
│   ├── page.tsx            # Главная: композиция из секций
│   ├── register/           # Регистрация + страница успеха
│   ├── login/              # Вход
│   ├── rooms/              # Номера и тарифы
│   ├── cabinet/            # Личный кабинет клиента
│   ├── support/            # Чат горячей линии (клиент)
│   ├── admin/              # Админ-панель (staff-only)
│   ├── api/                # Route Handlers (auth, profile, chat, admin/*)
│   └── globals.css         # Tailwind 4 + токены темы + Liquid Glass материалы
├── components/             # Секции и общие блоки
├── lib/
│   ├── db.ts               # SQLite: схема 3NF, миграции, демо-аккаунты
│   ├── auth.ts             # Сессии, хеширование паролей, getCurrentUser
│   ├── validation.ts       # Валидация email и оценка пароля (клиент+сервер)
│   └── site.ts             # Название, телефон, e-mail, ссылки меню
└── data/                   # patronage.db — создаётся при первом запуске
```

Основные компоненты (`src/components/`): `Header`/`HeaderClient` (шапка
с учётом авторизации), `Hero`, `DailyLife`, `Trust`, `Services`, `HowToStart`,
`Conditions`, `About`, `Safety`, `Reviews`, `Pricing`, `Faq`, `CtaSection`,
`Footer` — секции лендинга; `RegisterForm` и `LoginForm` — формы входа
и регистрации; `ProfileCard` — телефон в кабинете; `SupportChat` и
`AdminDashboard` — чат и админ-панель; `Reveal` и `SectionHeading` —
анимация появления и общий заголовок секций.

## Дизайн: Liquid Glass

Материалы «жидкого стекла» описаны в `globals.css` и переиспользуются классами:

- `.glass` / `.glass-strong` — светлые полупрозрачные панели (blur + светящаяся кромка);
- `.glass-dark` — тёмное стекло для CTA-блока;
- `.btn-glass-primary` — глянцевая кнопка с бегущим бликом;
- `.btn-glass-ghost` — вторичная стеклянная кнопка;
- `.input-glass` — стеклянные поля ввода (страница `/register`).

## Соглашения

- **Серверные компоненты по умолчанию.** `"use client"` только там, где нужна
  интерактивность: `Header` (меню), `Faq` (аккордеон), `Reveal` (IntersectionObserver).
- **Контакты и название** меняются в одном файле — `src/lib/site.ts`.
- **Цвета темы** (`text-brand`, `bg-surface` и т.д.) заданы токенами в `globals.css`
  (`@theme`), хардкод-цвета в классах не используются.
- **Анимации** минималистичны: появление при скролле (`Reveal`), каскад в hero,
  плавный аккордеон, липкая шапка с blur. Все отключаются при
  `prefers-reduced-motion`.
