import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Reveal from "@/components/Reveal";
import ProfileCard from "@/components/ProfileCard";
import LogoutButton from "@/components/LogoutButton";
import { getCurrentUser, isStaff } from "@/lib/auth";
import { dbGet, getDb } from "@/lib/db";
import CaretakerCabinet from "@/components/CaretakerCabinet";

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
  new: "bg-sky-100/80 text-sky-700",
  in_progress: "bg-amber-100/80 text-amber-700",
  done: "bg-sky-100/80 text-sky-700",
  cancelled: "bg-slate-200/80 text-slate-700",
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
    <div className="glass h-full rounded-[2rem] p-7 md:p-8">
      <div className="flex items-center justify-between gap-4">
        <h2 className="text-lg font-semibold text-brand">
          {request ? "Последняя заявка" : "Заявки"}
        </h2>
        {request ? (
          <span
            className={`rounded-full px-3 py-1 text-xs font-semibold ${
              STATUS_STYLES[request.status] ?? STATUS_STYLES.new
            }`}
          >
            {STATUS_LABELS[request.status] ?? request.status}
          </span>
        ) : null}
      </div>

      {request ? (
        <div className="mt-5 space-y-3 text-sm">
          <div className="glass-strong rounded-2xl px-5 py-4">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div className="text-xs font-semibold uppercase tracking-wide text-sky-700">
                Заявка №{request.id} · {request.created_at.slice(0, 10)}
              </div>
              {request.ward_name ? (
                <span className="rounded-full bg-slate-100/80 px-3 py-0.5 text-xs font-medium text-slate-600">
                  {request.ward_name}
                </span>
              ) : null}
            </div>

            {request.plan_name ? (
              <div className="mt-2 text-sm font-medium text-brand">
                Тариф: {request.plan_name}
                {request.monthly_price ? (
                  <span className="font-normal text-slate-700">
                    {" "}· {formatPrice(request.monthly_price)} ₽/мес
                  </span>
                ) : null}
              </div>
            ) : null}

            {(request.description ?? request.message) ? (
              <p className="mt-1 leading-6 text-slate-600">
                {request.description ?? request.message}
              </p>
            ) : null}
          </div>

          <p className="text-slate-700">
            {request.employee_email
              ? `Вашей заявкой занимается: ${request.employee_email}`
              : "Заявка ждёт распределения к сотруднику."}
          </p>

          <div className="flex flex-wrap gap-x-6 gap-y-2">
            <Link
              href="/cabinet/requests"
              className="inline-flex items-center gap-2 font-semibold text-sky-700 transition-all duration-200 hover:translate-x-1 hover:text-sky-800"
            >
              Подробнее — все заявки{totalCount > 1 ? ` (${totalCount})` : ""} →
            </Link>
            <Link
              href="/cabinet/new"
              className="inline-flex items-center gap-2 font-semibold text-sky-700 transition-all duration-200 hover:translate-x-1 hover:text-sky-800"
            >
              Создать следующую заявку →
            </Link>
          </div>
        </div>
      ) : (
        <div className="mt-5">
          <p className="text-sm leading-6 text-slate-700">
            Заявок пока нет. Создайте первую — расскажите о подопечном
            и выберите тариф, а мы перезвоним и всё обсудим.
          </p>
          <Link
            href="/cabinet/new"
            className="btn-glass-primary mt-5 inline-block rounded-full px-6 py-3 text-sm font-semibold"
          >
            Создать заявку
          </Link>
        </div>
      )}
    </div>
  );

  // Карточка последней заявки на сиделку — визуально отличается от пансионатных
  const caretakerCard = caretaker ? (
    <div className="glass h-full rounded-[2rem] border-l-4 border-l-sky-400 p-7 md:p-8">
      <div className="flex items-center justify-between gap-4">
        <h2 className="text-lg font-semibold text-brand">Заявка на сиделку</h2>
        <span className="rounded-full bg-sky-100/80 px-3 py-1 text-xs font-semibold text-sky-700">
          Сиделка · №{caretaker.id}
        </span>
      </div>

          <div className="mt-5 space-y-3 text-sm">
            <div className="glass-strong rounded-2xl px-5 py-4">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <span className="font-medium text-brand">{caretaker.ward_name}</span>
                {caretaker.address ? (
                  <span className="text-xs text-slate-700">{caretaker.address}</span>
                ) : null}
              </div>
              {caretaker.status === "new" ? (
                <div className="mt-2 text-amber-700">
                  Сейчас все сиделки заняты — заявка в очереди, свяжемся при освобождении
                </div>
              ) : caretaker.caretaker_name ? (
                <div className="mt-2 text-slate-600">
                  {caretaker.status === "accepted" ? (
                    <>
                      Сиделка приняла заявку:{" "}
                      <span className="font-semibold text-brand">{caretaker.caretaker_name}</span>
                      {caretaker.caretaker_experience
                        ? ` · стаж ${caretaker.caretaker_experience} лет`
                        : ""}
                    </>
                  ) : (
                    <>
                      Предложена сиделке:{" "}
                      <span className="font-semibold text-brand">{caretaker.caretaker_name}</span>
                      {caretaker.caretaker_experience
                        ? ` · стаж ${caretaker.caretaker_experience} лет`
                        : ""}{" "}
                      · ждём её ответа
                    </>
                  )}
                </div>
              ) : null}
            </div>

        <Link
          href="/cabinet/requests"
          className="inline-flex items-center gap-2 font-semibold text-sky-700 transition-all duration-200 hover:translate-x-1 hover:text-sky-800"
        >
          Подробнее — все заявки →
        </Link>
      </div>
    </div>
  ) : (
    <div className="glass flex h-full flex-col rounded-[2rem] p-7 md:p-8">
      <div className="flex items-center justify-between gap-4">
        <h2 className="text-lg font-semibold text-brand">Услуга сиделки</h2>
        <span className="rounded-full bg-sky-100/80 px-3 py-1 text-xs font-semibold text-sky-700">
          Сиделка
        </span>
      </div>
      <p className="mt-4 text-sm leading-6 text-slate-700">
        Нужна сиделка на дом? Заполните короткую анкету — подберём свободную
        рядом с вами и покажем на карте.
      </p>
      <Link
        href="/caretaker"
        className="btn-glass-primary mt-auto w-fit rounded-full px-6 py-3 text-sm font-semibold"
      >
        Оформить заявку
      </Link>
    </div>
  );

  // Карточка горячей линии — широкая (внизу) или компактная (половина сетки)
  const supportCard = (compact: boolean) =>
    compact ? (
      <div className="glass flex h-full flex-col rounded-[2rem] p-7 md:p-8">
        <h2 className="text-lg font-semibold text-brand">Горячая линия</h2>
        <p className="mt-2 text-sm leading-6 text-slate-600">
          Есть вопрос о проживании, уходе или документах? Напишите в чат —
          сотрудник поддержки ответит вам напрямую.
        </p>
        <Link
          href="/support"
          className="btn-glass-primary mt-6 w-fit rounded-full px-6 py-3 text-sm font-semibold"
        >
          Открыть чат
        </Link>
      </div>
    ) : (
      <div className="glass flex h-full flex-col items-start gap-5 rounded-[2rem] p-7 md:flex-row md:items-center md:justify-between md:p-8">
        <div>
          <h2 className="text-lg font-semibold text-brand">Горячая линия</h2>
          <p className="mt-1 max-w-lg text-sm leading-6 text-slate-600">
            Есть вопрос о проживании, уходе или документах? Напишите в чат —
            сотрудник поддержки ответит вам напрямую.
          </p>
        </div>
        <Link
          href="/support"
          className="btn-glass-primary shrink-0 rounded-full px-6 py-3 text-sm font-semibold"
        >
          Открыть чат
        </Link>
      </div>
    );

  return (
    <>
      <Header />
      <main className="relative flex-1 overflow-hidden bg-gradient-to-br from-white via-sky-50 to-amber-100">
        <div className="absolute -right-32 -top-24 h-96 w-96 animate-float rounded-full bg-sky-300/40 blur-3xl" />
        <div className="absolute -left-28 bottom-0 h-96 w-96 animate-float-slow rounded-full bg-amber-200/50 blur-3xl" />

        <div className="relative mx-auto max-w-6xl px-6 py-16 md:py-20">
          {/* Приветствие */}
          <div className="animate-fade-up flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <span className="inline-flex items-center gap-2 rounded-full glass px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.18em] text-sky-700">
                Личный кабинет
              </span>
              <h1 className="mt-4 text-3xl font-semibold tracking-tight text-brand md:text-4xl">
                Здравствуйте, {displayName}
              </h1>
              <p className="mt-1 text-sm text-slate-700">Аккаунт: {user.email}</p>
              <p className="mt-2 text-slate-600">
                {showForm && !user.phone
                  ? "Оставьте номер телефона, чтобы мы могли вам перезвонить."
                  : "Всё о заявках и связь с пансионатом — в одном месте."}
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <Link
                href="/cabinet/new"
                className="btn-glass-primary rounded-full px-6 py-3 text-sm font-semibold"
              >
                Создать заявку
              </Link>
              {isStaff(user) ? (
                <Link
                  href="/admin"
                  className="btn-glass-ghost rounded-full px-6 py-3 text-sm font-semibold"
                >
                  Админ-панель
                </Link>
              ) : null}
              <LogoutButton />
            </div>
          </div>

          {showForm ? (
            /* До сохранения контактов: форма + заявки рядом, линия во всю ширину */
            <div className="mt-12 grid gap-6 lg:grid-cols-2">
              <Reveal>
                <ProfileCard initialFullName={user.fullName} initialPhone={user.phone} />
              </Reveal>

              <Reveal delay={120}>{statusCard}</Reveal>

              <Reveal delay={180}>{caretakerCard}</Reveal>

              <Reveal delay={240} className="lg:col-span-2">
                {supportCard(false)}
              </Reveal>
            </div>
          ) : (
            /* Контакты сохранены: вместо формы — компактная полоска,
               заявки (пансионат и сиделка) встают рядом */
            <div className="mt-12 space-y-6">
              <div className="glass animate-fade-up flex flex-col gap-4 rounded-[2rem] px-7 py-5 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex items-center gap-4">
                  <span className="icon-glow glass-strong flex h-11 w-11 shrink-0 items-center justify-center rounded-full text-sky-700">
                    ✓
                  </span>
                  <div>
                    <div className="text-sm font-semibold text-brand">
                      {user.fullName?.trim() ? `${user.fullName} · ${user.phone}` : user.phone}
                    </div>
                    <div className="text-sm text-slate-700">
                      Контакты сохранены — перезвоним на этот номер
                    </div>
                  </div>
                </div>

                <Link
                  href="/cabinet?edit=1"
                  className="w-fit shrink-0 text-sm font-semibold text-sky-700 transition-colors hover:text-sky-800"
                >
                  Изменить данные
                </Link>
              </div>

              <div className="grid gap-6 lg:grid-cols-2">
                <Reveal>{statusCard}</Reveal>
                <Reveal delay={120}>{caretakerCard}</Reveal>
              </div>

              <Reveal delay={180}>{supportCard(false)}</Reveal>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
}
