# Сайт пансионата «Патронаж»

Лендинг пансионата с личным кабинетом, горячей линией и админ-панелью.
Стек: **Next.js 16 (App Router) · React 19 · Tailwind CSS 4 · TypeScript · libSQL (Turso / локальный SQLite)**.

## Запуск

```bash
npm install
npm run dev
```

Открыть [http://localhost:3000](http://localhost:3000).

Продакшен-сборка: `npm run build && npm start`.

## Деплой на Amvera (доступен из РФ без VPN)

Проект готов к Amvera: в корне лежит `amvera.yaml` (Node 22, сборка
`npm run build`, запуск `npm start`, порт 3000).

1. amvera.ru → регистрация → **Создать проект** (тип Node.js)
2. Загрузка кода — на выбор:
   - привязать GitHub-репозиторий в интерфейсе (деплой при каждом пуш), или
   - через git-remote Amvera:
     ```
     git remote add amvera https://git.amvera.ru/<логин>/<проект>.git
     git push amvera main:master
     ```
3. В проекте → **Переменные и секреты** добавить:
   - `TURSO_DATABASE_URL` и `TURSO_AUTH_TOKEN` (секреты) — база общая
     с локальной разработкой и Vercel, данные те же;
   - `NEXT_PUBLIC_YANDEX_MAPS_API_KEY` (переменная; нужна на этапе сборки).
4. Дождаться сборки → адрес `https://<проект>.amvera.io`

При обновлении кода достаточно `git push` — Amvera пересоберёт сам.

## База данных: Turso (облако) или локальный файл

Приложение работает через `@libsql/client`:

- **заполнены `TURSO_DATABASE_URL` и `TURSO_AUTH_TOKEN`** — все данные пишутся
  в облачную базу [Turso](https://turso.tech): общая для локальной разработки
  и Vercel, переживает любые рестарты и инстансы;
- **переменные пустые** — локальный файл `data/patronage.db`
  (на Vercel — `/tmp` с автосевом из снапшота `src/lib/db-seed.json`).

### Подключение Turso (один раз)

```bash
# Turso CLI: https://docs.turso.tech/cli/installation
turso auth login           # браузер → вход в ваш аккаунт
turso db create patronage
turso db show patronage --url      # → libsql://patronage-<ваш>.turso.io
turso db tokens create patronage   # → длинный токен
```

Впишите оба значения в `.env.local`:

```
TURSO_DATABASE_URL=libsql://patronage-xxx.turso.io
TURSO_AUTH_TOKEN=eyJ...
```

Залейте текущие данные (схема + все аккаунты/заявки из снапшота):

```bash
npm run db:push-turso
npm run dev
```

Для Vercel добавьте обе переменные в Settings → Environment Variables
и задеплойте — регистрации, заявки и чаты станут постоянными на любом
количестве инстансов. Скрипт безопасно запускать повторно: если в базе
уже есть пользователи, снапшот не заливается.

## Авторизация: подписанные cookie (stateless)

Сессия — это HMAC-SHA256 подписанный токен в httpOnly-cookie
(`src/lib/auth.ts`): id, email, роль и срок действия. Проверка подписи
не требует обращения к базе, поэтому вход работает на любом serverless-
инстансе Vercel, даже если логин обрабатывал другой инстанс. Профиль
(имя, телефон) подтягивается из базы, когда она доступна.

Для продакшена задайте свой секрет в переменных окружения Vercel
(Settings → Environment Variables): `AUTH_SECRET=<случайная строка>`.
Без него используется девелоперский секрет (для демо допустимо).

## Сохранение данных при деплое (Vercel и другие serverless)

На serverless-хостингах файловая система проекта доступна только для чтения,
поэтому база на Vercel создаётся в единственном writable-каталоге `/tmp`
(`process.env.VERCEL` в `src/lib/db.ts`) и при каждом холодном старте
инстанса автоматически восстанавливается из снапшота `src/lib/db-seed.json`.

```bash
npm run db:export        # data/patronage.db → src/lib/db-seed.json (коммитится)
git add . && git commit -m "db snapshot" && git push
```

Что это даёт на деплое:

- **Вход существующих пользователей** — работает полностью и сразу после пуша.
- **Регистрация и заявки** — работают в рамках жизни тёплого инстанса
  (минуты–часы). После рецикла инстанса новые данные исчезают, база снова
  разворачивается из снапшота — это ограничение serverless, а не ошибка.
- **Постоянная запись** — переведите БД на Turso (бесплатный облачный SQLite):
  вся работа с базой изолирована в `src/lib/db.ts`, меняется один файл.

Если на деплое в формах появляется «Сервер недоступен» — смотрите логи
функций в Vercel (Deployments → Logs): почти всегда это ошибка загрузки
нативного модуля better-sqlite3 или обращения к БД.

## Демо-аккаунты (создаются автоматически при первом запуске)

| Роль | Email | Пароль |
| --- | --- | --- |
| Администратор | `admin@patronage.ru` | `Admin123!` |
| Сотрудник | `employee@patronage.ru` | `Employee123!` |
| Сиделка (демо) | `elena@patronage.ru` | `Caretaker123!` |
| Сиделка (демо) | `olga@patronage.ru` | `Caretaker123!` |
| Сиделка (демо) | `marina@patronage.ru` | `Caretaker123!` |

## Маршруты и воронка

| Маршрут | Назначение |
| --- | --- |
| `/` | Главная: цепочка секций знакомства, форма заявки, sticky-навигация |
| `/sidelki` | Услуга сиделки: тарифы 2 ч / 12 ч / сутки (старый `/services` редиректит сюда) |
| `/pansionat` | Пансионат: районы Нижнего Новгорода, цены, фото |
| `/social` | Социальная программа: господдержка и компенсации |
| `/transport` | Перевозка маломобильных (раздел готовится) |
| `/blog` | Блог: статьи об уходе и поддержка родственников |
| `/about` | О пансионате: обычный день, безопасность |
| `/caretaker` | Анкета подбора сиделки → карта с меткой (только для авторизованных) |
| `/register` → `/register/success` | Регистрация: email + пароль, индикатор надёжности пароля |
| `/login` | Вход (поддерживает `?next=` — возврат к цели, например к анкете) |
| `/cabinet` | Личный кабинет: профиль, заявки, горячая линия |
| `/cabinet/new` | Заявка в пансионат: визард с выбором тарифа |
| `/cabinet/requests`, `/cabinet/requests/[id]` | Все заявки (пансионат и сиделка) и карточка заявки |
| `/support` | Чат с горячей линией (клиентская сторона) |
| `/admin` | Админ-панель: заявки, пользователи, чат (staff-only) |
| `/pay/pansionat/[id]`, `/pay/caretaker/[id]` | Мок-оплата заявки (демо) |

## Услуга сиделки (`/caretaker`)

Отдельный тип заявок — таблица `caretaker_requests` (ФИО и возраст
подопечного, адрес, список услуг чекбоксами, даты начала/конца,
пожелания). Гостя редиректит на `/login?next=/caretaker`, после
входа/регистрации он возвращается к анкете. По кнопке «Оформить»:
POST `/api/caretaker` сохраняет заявку и предлагает её случайной
**свободной сиделке из базы** (аккаунты с ролью `caretaker`, профили
в `caretaker_profiles`): заявка получает статус `offered`, сиделка
видит предложение в своём кабинете, а клиент — анимацию подбора и
Яндекс-карту с меткой сиделки и временем приезда (20–100 мин).
Если свободных сиделок нет — заявка встаёт в очередь (`new`)
с уведомлением. Дальше: сиделка принимает или отклоняет предложение
(`/api/caretaker/decide`, при отказе подбирается другая), клиент
может заменить сиделку (`/api/caretaker/transfer`) или отменить
заявку (`/api/caretaker/cancel`).

Секции главной и внутренних страниц — переиспользуемые компоненты с
опциональным «переходником» (`footer`): блок заканчивается ссылкой на
следующий по смыслу раздел, композицию каждой страницы собирает сама страница.

Регистрация по email без SMS: после входа клиент оставляет телефон
в личном кабинете — он попадает в БД и виден сотруднику в заявке.

## База данных (SQLite, 3NF)

Файл: `data/patronage.db` (создаётся автоматически). Схема — в `src/lib/db.ts`.

```
users               аккаунты: email, password_hash, role (user|employee|admin|caretaker)
user_profiles       профиль (1:1): full_name, phone — телефон для связи
sessions            legacy: сессии stateless (подписанная cookie), таблица не пишется
plans               тарифы пансионата: monthly_price, note, is_popular
plan_features       состав тарифа (N:1 → plans)
requests            заявки в пансионат: user_id → employee_id (кто ведёт), статус, подопечный, тариф
request_deletions   журнал удалённых заявок: кем и по какой причине
caretaker_profiles  сиделки: full_name, experience_years, status (free|waiting|busy)
caretaker_requests  заявки на сиделку: подопечный, задачи, даты, назначенная сиделка
conversations       диалоги горячей линии: user_id ↔ employee_id
messages            сообщения диалогов: sender_id, body
notifications       уведомления (колокольчик): kind, title, body, is_read
```

Роли: **клиент** (user) регистрируется и оставляет заявки; **сиделка**
(caretaker) принимает и отклоняет предложенные ей заявки на уход;
**сотрудник** (employee) ведёт назначенные ему заявки и отвечает в чате;
**администратор** (admin) видит все заявки, распределяет их между
сотрудниками и меняет роли.

## API

| Метод и путь | Описание |
| --- | --- |
| `POST /api/auth/register` | Регистрация (email + пароль) |
| `POST /api/auth/login` | Вход, ставит подписанную cookie |
| `POST /api/auth/logout` | Выход |
| `PUT /api/profile` | Имя и телефон для связи (кабинет) |
| `POST /api/requests` | Заявка в пансионат (визард `/cabinet/new`) |
| `GET/POST /api/chat` | Сообщения горячей линии клиента |
| `GET/POST /api/notifications` | Уведомления; POST — отметить прочитанными |
| `POST /api/caretaker` | Заявка на сиделку: подбор свободной или очередь |
| `GET /api/caretaker/requests` | Кабинет сиделки: статус, предложенные и принятые заявки |
| `POST /api/caretaker/decide` | Решение сиделки: accept / decline (переподбор) |
| `POST /api/caretaker/transfer` | Замена сиделки по инициативе клиента |
| `POST /api/caretaker/cancel` | Отмена заявки на сиделку (только new/declined) |
| `GET/PATCH/DELETE /api/admin/requests` | Заявки (admin — все, employee — свои): статус, назначение, удаление |
| `GET/PATCH /api/admin/users` | Пользователи и роли (admin-only) |
| `GET/POST /api/admin/chat` | Диалоги поддержки: список и ответ (staff) |

## Структура проекта

```
src/
├── app/                    # App Router: маршруты и корневой layout
│   ├── layout.tsx          # <html lang="ru">, шрифт PT Serif, метаданные
│   ├── page.tsx            # Главная: композиция из секций + JSON-LD
│   ├── globals.css         # Tailwind 4 + токены темы + Liquid Glass материалы
│   ├── about/ blog/ social/ transport/    # Контентные страницы
│   ├── sidelki/ pansionat/                # Услуги и цены (/services → /sidelki)
│   ├── register/ login/                   # Регистрация и вход
│   ├── caretaker/ support/                # Анкета сиделки, чат горячей линии
│   ├── cabinet/            # Личный кабинет клиента (+ new/, requests/[id]/)
│   ├── admin/              # Админ-панель (staff-only)
│   ├── pay/                # Мок-оплата: pansionat/[id], caretaker/[id]
│   └── api/                # Route Handlers: auth, profile, chat, notifications,
│                           #   requests, caretaker/*, admin/*
├── components/             # Секции лендинга, формы, кабинеты, виджеты
└── lib/
    ├── db.ts               # libSQL: схема 3NF, миграции, снапшот, демо-данные
    ├── auth.ts             # Stateless-сессии (HMAC-cookie), getCurrentUser
    ├── validation.ts       # Валидация email и оценка пароля (клиент+сервер)
    ├── notify.ts           # Записи в notifications
    ├── ymaps.ts            # Загрузчик JS API Яндекс.Карт
    └── site.ts             # Название, телефон, e-mail, ссылки меню
scripts/                    # export-db, push-turso, reset-db, turso-flow
data/                       # patronage.db — создаётся при первом запуске
```

Основные компоненты (`src/components/`): `Header`/`HeaderClient` (шапка
с учётом авторизации), `Hero`, `Trust`, `About`, `DailyLife`, `Safety`,
`WhyUs`, `Services`, `HowToStart`, `Team`, `Reviews`, `Pricing`, `Faq`,
`Contacts`, `Guarantees`, `Footer` — секции лендинга; `RegisterForm`,
`LoginForm`, `QuickForm`, `LeadForm` — формы; `RequestWizard` и
`CaretakerWizard` — визарды заявок; `CaretakerCabinet` — кабинет сиделки;
`AdminDashboard` — админ-панель; `SupportChat` — чат горячей линии;
`NotificationsBell`, `FloatingActions`, `CookieBar`, `StickyNav` — виджеты;
`Reveal` и `SectionHeading` — анимация появления и общий заголовок секций.

## Яндекс.Карты (анкета сиделки)

После оформления заявки на сиделку визард показывает карту с меткой
в пределах Нижнего Новгорода (`src/components/CaretakerWizard.tsx`,
загрузчик API — `src/lib/ymaps.ts`).

Для стабильной работы нужен бесплатный ключ «JavaScript API и HTTP
Геокодер»: https://developer.tech.yandex.ru/services/ →

```
# .env.local
NEXT_PUBLIC_YANDEX_MAPS_API_KEY=ваш_ключ
```

После изменения переменной перезапустите `npm run dev`. Без ключа карта
грузится в демо-режиме (может показывать предупреждение Яндекса); если
загрузка блокируется — секция показывает заглушку с этой же инструкцией.
На Vercel добавьте переменную в Settings → Environment Variables.

## Дизайн: сдержанный «государственный» стиль

Шрифт — системный **Times New Roman** (без загрузки веб-шрифта). Палитра —
синяя шкала `brand` (`--color-brand-50…400` + `brand`, `brand-dark` в
`@theme`): ссылки, бейджи, иконки, кнопки и тёмные секции используют только
её. Терракотовый (#b34700) — единственный тёплый акцент: главные
кнопки-действия. Янтарный — только статусные бейджи «в работе» и звёзды рейтинга.

Внешний вид: плоские поверхности, скругления 8px (`rounded-lg`), тонкие
рамки вместо пышных теней, без hover-подъёмов карточек; появление при
скролле — короткая прозрачность без сдвигов. Классы материалов в `globals.css`:

- `.glass` / `.glass-strong` — плотные светлые панели (92–98% белого,
  видимая синеватая рамка);
- `.glass-dark` — тёмное стекло для тёмных секций и CTA-блока;
- `.section-band` — светлая полоса-секция (ритм чередования с фоном);
- `.section-dark` — однотонная тёмно-синяя полоса (контрастный акцент);
- `.btn-glass-primary` — тёплая терракотовая главная кнопка (одна на экран);
- `.btn-glass-ghost` — вторичная кнопка с синей рамкой;
- `.input-glass` — поля ввода с видимыми рамками и синим фокус-рингом.

Главная страница построена как «цепочка знакомства»: каждый раздел
заканчивается компонентом `SectionFooter` — переходом к следующему
по смыслу блоку. Фон сайта тонированный (не белый), секции чередуются
светлая полоса / фон / тёмная полоса — стекло читается на контрасте.

## Соглашения

- **Серверные компоненты по умолчанию.** `"use client"` только там, где нужна
  интерактивность: `Header` (меню), `Faq` (аккордеон), `Reveal` (IntersectionObserver).
- **Контакты и название** меняются в одном файле — `src/lib/site.ts`.
- **Цвета темы** (`text-brand`, `bg-surface` и т.д.) заданы токенами в `globals.css`
  (`@theme`), хардкод-цвета в классах не используются.
- **Анимации** минималистичны: появление при скролле (`Reveal`), каскад в hero,
  плавный аккордеон, липкая шапка с blur. Все отключаются при
  `prefers-reduced-motion`.
