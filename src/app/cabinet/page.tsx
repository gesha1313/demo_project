import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { Inter, Lora } from "next/font/google";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ProfileCard from "@/components/ProfileCard";
import LogoutButton from "@/components/LogoutButton";
import { getCurrentUser, isStaff } from "@/lib/auth";
import { dbGet, getDb } from "@/lib/db";
import CaretakerCabinet from "@/components/CaretakerCabinet";
import "./cabinet.css";

/* Шрифты темы кабинета: Lora — заголовки (характер бренда),
   Inter — интерфейс (кнопки, подписи, поля). Кириллица включена. */
const lora = Lora({
  subsets: ["latin", "cyrillic"],
  weight: ["500", "600"],
  variable: "--font-lora",
  display: "swap",
});

const inter = Inter({
  subsets: ["latin", "cyrillic"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Личный кабинет",
  description:
    "Личный кабинет: контакты для связи, последняя заявка, все заявки и чат с горячей линией пансионата.",
};

const STATUS_LABELS: Record<string, string> = {
  new: "Новая — ждёт распределения",
  in_progress: "В работе — сотрудник свяжется с вами",
  done: "Завершена",
  cancelled: "Отменена",
};

const STATUS_STYLES: Record<string, string> = {
  new: "cb-pill cb-pill--new",
  in_progress: "cb-pill cb-pill--in_progress",
  done: "cb-pill cb-pill--done",
  cancelled: "cb-pill cb-pill--cancelled",
};

const formatPrice = (price: number) => price.toLocaleString("ru-RU");

export default async function CabinetPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const user = await getCurrentUser();
  if (!user) {
    redirect("/login");
  }

  // Сиделка попадает в свой кабинет: статус + предложенные заявки
  if (user.role === "caretaker") {
    return <CaretakerCabinet userId={user.id} email={user.email} />;
  }

  // Форма контактов показывается, пока телефон не оставлен,
  // или когда пользователь нажал «Изменить данные» (?edit=1)
  const params = await searchParams;
  const showForm = !user.phone || params.edit === "1";

  const db = await getDb();
  const request = await dbGet<{
    id: number;
    status: string;
    message: string | null;
    description: string | null;
    ward_name: string | null;
    created_at: string;
    plan_name: string | null;
    monthly_price: number | null;
    employee_email: string | null;
  }>(
    db,
    `SELECT r.id, r.status, r.message, r.description, r.ward_name, r.created_at,
            pl.name AS plan_name, pl.monthly_price,
            e.email AS employee_email
       FROM requests r
       LEFT JOIN plans pl ON pl.id = r.plan_id
       LEFT JOIN users e ON e.id = r.employee_id
      WHERE r.user_id = ?
      ORDER BY r.id DESC LIMIT 1`,
    [user.id],
  );

  const displayName = user.fullName?.trim() || user.email;

  // Инициалы для аватара в приветствии
  const initials = displayName
    .split(/[\s@.]+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? "")
    .join("");

  // Последняя заявка на сиделку (отдельный тип заявок)
  const caretaker = await dbGet<{
    id: number;
    status: string;
    ward_name: string;
    address: string | null;
    caretaker_name: string | null;
    caretaker_experience: number | null;
    arrival_minutes: number | null;
    created_at: string;
  }>(
    db,
    `SELECT cr.id, cr.status, cr.ward_name, cr.address,
            cp.full_name AS caretaker_name,
            cp.experience_years AS caretaker_experience,
            cr.arrival_minutes, cr.created_at
       FROM caretaker_requests cr
       LEFT JOIN caretaker_profiles cp ON cp.user_id = cr.caretaker_user_id
      WHERE cr.user_id = ?
      ORDER BY cr.id DESC LIMIT 1`,
    [user.id],
  );

  // Всего заявок — для перехода «Подробнее»
  const totalRow = await dbGet<{ count: number }>(
    db,
    `SELECT COUNT(*) AS count FROM requests WHERE user_id = ?`,
    [user.id],
  );
  const totalCount = Number(totalRow?.count ?? 0);

  // Карточка статуса последней заявки — одна на обе композиции
  const statusCard = (
    <div className="cb-card cb-card--hover h-full">
      <div className="flex items-center justify-between gap-4">
        <h2 className="cb-h2">
          {request ? "Последняя заявка" : `Заявки · ${totalCount}`}
        </h2>
        {request ? (
          <span className={STATUS_STYLES[request.status] ?? STATUS_STYLES.new}>
            {STATUS_LABELS[request.status] ?? request.status}
          </span>
        ) : null}
      </div>

      {request ? (
        <div className="mt-5 space-y-4 text-[15px] leading-relaxed">
          <div className="cb-subcard">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div className="cb-label">Заявка №{request.id} · {request.created_at.slice(0, 10)}</div>
              {request.ward_name ? (
                <span className="cb-pill cb-pill--cancelled">{request.ward_name}</span>
              ) : null}
            </div>

            {request.plan_name ? (
              <div className="mt-2 font-medium text-[var(--cb-green-700)]">
                Тариф: {request.plan_name}
                {request.monthly_price ? (
                  <span className="font-normal cb-muted">
                    {" "}· {formatPrice(request.monthly_price)} ₽/мес
                  </span>
                ) : null}
              </div>
            ) : null}

            {(request.description ?? request.message) ? (
              <p className="mt-1 cb-muted">{request.description ?? request.message}</p>
            ) : null}
          </div>

          <p className="cb-muted">
            {request.employee_email
              ? `Вашей заявкой занимается: ${request.employee_email}`
              : "Заявка ждёт распределения к сотруднику."}
          </p>

          <div className="flex flex-wrap gap-x-6 gap-y-2">
            <Link href="/cabinet/requests" className="cb-link">
              Подробнее — все заявки{totalCount > 1 ? ` (${totalCount})` : ""} →
            </Link>
            <Link href="/cabinet/new" className="cb-link">
              Создать следующую заявку →
            </Link>
          </div>
        </div>
      ) : (
        <div className="cb-empty mt-5">
          <div className="cb-empty__circle" aria-hidden="true">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8}
              strokeLinecap="round" strokeLinejoin="round" className="h-7 w-7">
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8Z" />
              <path d="M14 2v6h6M12 18v-6M9 15h6" />
            </svg>
          </div>
          <p className="cb-empty__title">Заявок пока нет</p>
          <p className="cb-empty__text">
            Создайте первую — расскажите о подопечном и выберите тариф,
            а мы перезвоним и всё обсудим.
          </p>
          <Link href="/cabinet/new" className="cb-btn cb-btn--primary mt-5">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}
              strokeLinecap="round" className="h-4 w-4" aria-hidden="true">
              <path d="M12 5v14M5 12h14" />
            </svg>
            Создать заявку
          </Link>
        </div>
      )}
    </div>
  );

  // Карточка последней заявки на сиделку — визуально отличается от пансионатных
  const caretakerCard = caretaker ? (
    <div className="cb-card cb-card--hover h-full" style={{ borderTop: "3px solid var(--cb-green-300)" }}>
      <div className="flex items-center justify-between gap-4">
        <h2 className="cb-h2">Заявка на сиделку</h2>
        <span className="cb-badge">Сиделка · №{caretaker.id}</span>
      </div>

      <div className="mt-5 space-y-4 text-[15px] leading-relaxed">
        <div className="cb-subcard">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <span className="font-medium text-[var(--cb-green-700)]">{caretaker.ward_name}</span>
            {caretaker.address ? (
              <span className="text-sm cb-muted">{caretaker.address}</span>
            ) : null}
          </div>
          {caretaker.status === "new" ? (
            <div className="mt-2" style={{ color: "#7a5312" }}>
              Сейчас все сиделки заняты — заявка в очереди, свяжемся при освобождении
            </div>
          ) : caretaker.caretaker_name ? (
            <div className="mt-2 cb-muted">
              {caretaker.status === "accepted" ? (
                <>
                  Сиделка приняла заявку:{" "}
                  <span className="font-semibold text-[var(--cb-green-700)]">{caretaker.caretaker_name}</span>
                  {caretaker.caretaker_experience
                    ? ` · стаж ${caretaker.caretaker_experience} лет`
                    : ""}
                </>
              ) : (
                <>
                  Предложена сиделке:{" "}
                  <span className="font-semibold text-[var(--cb-green-700)]">{caretaker.caretaker_name}</span>
                  {caretaker.caretaker_experience
                    ? ` · стаж ${caretaker.caretaker_experience} лет`
                    : ""}{" "}
                  · ждём её ответа
                </>
              )}
            </div>
          ) : null}
        </div>

        <Link href="/cabinet/requests" className="cb-link">
          Подробнее — все заявки →
        </Link>
      </div>
    </div>
  ) : (
    <div className="cb-card cb-card--hover flex h-full flex-col">
      <div className="flex items-center justify-between gap-4">
        <h2 className="cb-h2">Услуга сиделки</h2>
        <span className="cb-badge">Сиделка</span>
      </div>
      <p className="cb-lead mt-3">
        Нужна сиделка на дом? Заполните короткую анкету — подберём свободную
        рядом с вами и покажем на карте.
      </p>

      {/* Три коротких пункта вместо «дыры» между текстом и кнопкой */}
      <ul className="cb-check mt-5">
        <li>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.2}
            strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4" aria-hidden="true">
            <path d="M20 6 9 17l-5-5" />
          </svg>
          Подбор свободной сиделки рядом с вами
        </li>
        <li>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.2}
            strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4" aria-hidden="true">
            <path d="M20 6 9 17l-5-5" />
          </svg>
          Показ выбранной сиделки на карте
        </li>
        <li>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.2}
            strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4" aria-hidden="true">
            <path d="M20 6 9 17l-5-5" />
          </svg>
          Перезвоним и всё обсудим
        </li>
      </ul>

      <Link href="/caretaker" className="cb-btn cb-btn--primary mt-auto w-fit self-start">
        Оформить заявку
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}
          strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4" aria-hidden="true">
          <path d="M5 12h14M13 6l6 6-6 6" />
        </svg>
      </Link>
    </div>
  );

  // Карточка горячей линии — широкая (внизу) или компактная (половина сетки)
  const supportCard = (compact: boolean) =>
    compact ? (
      <div className="cb-card cb-card--hover flex h-full flex-col">
        <h2 className="cb-h2">Горячая линия</h2>
        <p className="cb-lead mt-2">
          Есть вопрос о проживании, уходе или документах? Напишите в чат —
          сотрудник поддержки ответит вам напрямую.
        </p>
        <Link href="/support" className="cb-btn cb-btn--primary mt-6 w-fit">
          Открыть чат
        </Link>
      </div>
    ) : (
      <div className="cb-card cb-card--hover flex h-full flex-col items-start gap-5 md:flex-row md:items-center md:justify-between">
        <div>
          <h2 className="cb-h2">Горячая линия</h2>
          <p className="cb-lead mt-1 max-w-lg">
            Есть вопрос о проживании, уходе или документах? Напишите в чат —
            сотрудник поддержки ответит вам напрямую.
          </p>
        </div>
        <Link href="/support" className="cb-btn cb-btn--primary shrink-0">
          Открыть чат
        </Link>
      </div>
    );

  return (
    <>
      <Header />
      <main className={`cabinet-page ${lora.variable} ${inter.variable} relative flex-1`}>
        <div className="relative mx-auto max-w-[1200px] px-4 py-10 sm:px-6 md:px-8 md:py-14">
          {/* Шапка страницы: слева — приветствие, справа — действия */}
          <header className="animate-fade-up flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
            <div>
              <span className="cb-badge">
                <span className="h-1.5 w-1.5 rounded-full bg-[var(--cb-green-400)]" aria-hidden="true" />
                Личный кабинет
              </span>

              <div className="mt-4 flex items-center gap-4">
                <span className="cb-avatar h-14 w-14 text-lg" aria-hidden="true">
                  {initials || "П"}
                </span>
                <h1 className="cb-h1">Здравствуйте, {displayName}</h1>
              </div>

              <p className="mt-3 text-sm cb-muted">Аккаунт: {user.email}</p>
              <p className="cb-lead mt-1 max-w-xl">
                {showForm && !user.phone
                  ? "Оставьте номер телефона, чтобы мы могли вам перезвонить."
                  : "Всё о заявках и связь с пансионатом — в одном месте."}
              </p>
            </div>

            <div className="cb-actions flex flex-wrap items-center gap-3">
              <Link href="/cabinet/new" className="cb-btn cb-btn--primary">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.2}
                  strokeLinecap="round" className="h-4 w-4" aria-hidden="true">
                  <path d="M12 5v14M5 12h14" />
                </svg>
                Создать заявку
              </Link>
              {isStaff(user) ? (
                <Link href="/admin" className="cb-btn cb-btn--secondary">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.9}
                    strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4" aria-hidden="true">
                    <path d="M12 22s8-3.5 8-10V5l-8-3-8 3v7c0 6.5 8 10 8 10Z" />
                    <path d="m9 12 2 2 4-4" />
                  </svg>
                  Админ-панель
                </Link>
              ) : null}
              <LogoutButton className="cb-logout" />
            </div>
          </header>

          {showForm ? (
            /* До сохранения контактов: форма + заявки рядом, линия во всю ширину.
               Карточки кабинета — функциональный контент, без scroll-reveal:
               анимация появления здесь оставляла «дыры» при смене веток */
            <div className="mt-10 grid items-stretch gap-6 lg:grid-cols-2">
              <ProfileCard initialFullName={user.fullName} initialPhone={user.phone} />

              {statusCard}

              {caretakerCard}

              <div className="lg:col-span-2">{supportCard(false)}</div>
            </div>
          ) : (
            /* Контакты сохранены: компактная карточка контактов,
               заявки (пансионат и сиделка) встают рядом */
            <div className="mt-10 space-y-6">
              <div className="animate-fade-up">
                <div className="cb-card cb-card--accent cb-card--hover flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                  <div className="flex items-center gap-4">
                    <span className="cb-tile cb-tile--solid h-12 w-12" aria-hidden="true">
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.9}
                        strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5">
                        <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92Z" />
                      </svg>
                    </span>
                    <div>
                      <div className="cb-label">
                        {user.fullName?.trim() || "Ваш профиль"}
                      </div>
                      <div className="mt-0.5 text-xl font-semibold text-[var(--cb-green-800)]">
                        {user.phone}
                      </div>
                      <div className="mt-0.5 text-sm cb-muted">
                        Контакты сохранены — перезвоним на этот номер
                      </div>
                    </div>
                  </div>

                  <Link href="/cabinet?edit=1" className="cb-btn cb-btn--secondary w-fit shrink-0">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.9}
                      strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4" aria-hidden="true">
                      <path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z" />
                    </svg>
                    Изменить данные
                  </Link>
                </div>
              </div>

              <div className="grid items-stretch gap-6 lg:grid-cols-2">
                {statusCard}
                {caretakerCard}
              </div>

              {supportCard(false)}
            </div>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
}
