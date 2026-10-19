import type { Metadata } from "next";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import TransferButton from "@/components/TransferButton";
import CancelRequestButton from "@/components/CancelRequestButton";
import CaretakerDecideButtons from "@/components/CaretakerDecideButtons";
import { getCurrentUser } from "@/lib/auth";
import { dbGet, getDb } from "@/lib/db";

export const metadata: Metadata = {
  title: "Заявка",
  description: "Полная информация о заявке.",
};

const STATUS_LABELS: Record<string, string> = {
  new: "Новая — ждёт сиделку",
  in_progress: "В работе",
  done: "Завершена",
  cancelled: "Отменена",
  offered: "На рассмотрении у сиделки",
  accepted: "Одобрена сиделкой",
  declined: "Отклонена",
};

const STATUS_STYLES: Record<string, string> = {
  new: "bg-sky-100/80 text-sky-700",
  in_progress: "bg-amber-100/80 text-amber-700",
  done: "bg-sky-100/80 text-sky-700",
  cancelled: "bg-slate-200/80 text-slate-700",
  offered: "bg-amber-100/80 text-amber-700",
  accepted: "bg-sky-100/80 text-sky-700",
  declined: "bg-slate-200/80 text-slate-700",
};

const pluralYears = (n: number) => {
  if (n % 10 === 1 && n !== 11) return `${n} год`;
  if ([2, 3, 4].includes(n % 10) && ![12, 13, 14].includes(n)) return `${n} года`;
  return `${n} лет`;
};

const fmtDate = (value: string | null) =>
  value ? value.split("-").reverse().join(".") : null;

type CaretakerRequest = {
  kind: "caretaker";
  id: number;
  user_id: number;
  status: string;
  ward_name: string;
  ward_age: number | null;
  address: string | null;
  tasks: string | null;
  start_date: string | null;
  end_date: string | null;
  notes: string | null;
  caretaker_user_id: number | null;
  arrival_minutes: number | null;
  created_at: string;
  updated_at: string;
  caretaker_name: string | null;
  caretaker_experience: number | null;
  client_name: string | null;
  client_email: string;
  client_phone: string | null;
};

type PansionatRequest = {
  kind: "pansionat";
  id: number;
  user_id: number;
  status: string;
  message: string | null;
  description: string | null;
  ward_name: string | null;
  passport: string | null;
  created_at: string;
  updated_at: string;
  plan_name: string | null;
  monthly_price: number | null;
  employee_email: string | null;
  client_name: string | null;
  client_email: string;
  client_phone: string | null;
};

export default async function RequestDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const user = await getCurrentUser();
  if (!user) {
    redirect("/login");
  }

  const { id: rawId } = await params;
  const id = Number(rawId);
  if (!Number.isInteger(id) || id <= 0) {
    notFound();
  }

  const db = await getDb();

  // Сначала ищем среди заявок на сиделку, затем среди пансионатных
  let request: CaretakerRequest | PansionatRequest | null = null;

  const caretaker = await dbGet<Omit<CaretakerRequest, "kind">>(
    db,
    `SELECT cr.id, cr.user_id, cr.status, cr.ward_name, cr.ward_age, cr.address, cr.tasks,
            cr.start_date, cr.end_date, cr.notes, cr.caretaker_user_id, cr.arrival_minutes,
            cr.created_at, cr.updated_at,
            cp.full_name AS caretaker_name,
            cp.experience_years AS caretaker_experience,
            u.email AS client_email,
            p.full_name AS client_name,
            p.phone AS client_phone
       FROM caretaker_requests cr
       LEFT JOIN caretaker_profiles cp ON cp.user_id = cr.caretaker_user_id
       LEFT JOIN users u ON u.id = cr.user_id
       LEFT JOIN user_profiles p ON p.user_id = cr.user_id
      WHERE cr.id = ?`,
    [id],
  );

  if (caretaker) {
    request = { ...caretaker, kind: "caretaker" };
  } else {
    const pansionat = await dbGet<Omit<PansionatRequest, "kind">>(
      db,
      `SELECT r.id, r.user_id, r.status, r.message, r.description, r.ward_name, r.passport,
              r.created_at, r.updated_at,
              pl.name AS plan_name, pl.monthly_price,
              e.email AS employee_email,
              u.email AS client_email,
              p.full_name AS client_name,
              p.phone AS client_phone
         FROM requests r
         LEFT JOIN plans pl ON pl.id = r.plan_id
         LEFT JOIN users e ON e.id = r.employee_id
         LEFT JOIN users u ON u.id = r.user_id
         LEFT JOIN user_profiles p ON p.user_id = r.user_id
        WHERE r.id = ?`,
      [id],
    );
    if (pansionat) {
      request = { ...pansionat, kind: "pansionat" };
    }
  }

  if (!request) {
    notFound();
  }

  // Доступ: владелец, назначенная сиделка или админ
  const isOwner = request.user_id === user.id;
  const isAssignedCaretaker =
    request.kind === "caretaker" && request.caretaker_user_id === user.id;
  const isAdmin = user.role === "admin";

  if (!isOwner && !isAssignedCaretaker && !isAdmin) {
    notFound();
  }

  const tasks: string[] = request.kind === "caretaker" && request.tasks
    ? (JSON.parse(request.tasks) as string[])
    : [];
  const period =
    request.kind === "caretaker"
      ? [fmtDate(request.start_date), fmtDate(request.end_date)]
      : null;
  const periodLabel =
    period && (period[0] || period[1])
      ? period[0] && period[1]
        ? `${period[0]} — ${period[1]}`
        : `с ${period[0] ?? period[1]}`
      : null;

  return (
    <>
      <Header />
      <main className="relative flex-1 overflow-hidden bg-gradient-to-br from-white via-sky-50 to-amber-100">
        <div className="absolute -right-32 -top-24 h-96 w-96 animate-float rounded-full bg-sky-300/40 blur-3xl" />
        <div className="absolute -left-28 bottom-0 h-96 w-96 animate-float-slow rounded-full bg-amber-200/50 blur-3xl" />

        <div className="relative mx-auto max-w-3xl px-6 py-16">
          {/* Заголовок */}
          <div className="animate-fade-up">
            <Link
              href={isAssignedCaretaker && !isOwner ? "/cabinet" : "/cabinet/requests"}
              className="inline-flex items-center gap-2 text-sm font-semibold text-sky-700 transition-all duration-200 hover:translate-x-1 hover:text-sky-800"
            >
              ← К заявкам
            </Link>

            <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
              <h1 className="text-3xl font-semibold tracking-tight text-brand md:text-4xl">
                {request.kind === "caretaker" ? "Заявка на сиделку" : "Заявка в пансионат"} №{request.id}
              </h1>
              <span
                className={`rounded-full px-4 py-1.5 text-sm font-semibold ${
                  STATUS_STYLES[request.status] ?? STATUS_STYLES.new
                }`}
              >
                {STATUS_LABELS[request.status] ?? request.status}
              </span>
            </div>
            <p className="mt-2 text-sm text-slate-700">
              Создана {request.created_at.slice(0, 10)} в {request.created_at.slice(11, 16)}
              {request.updated_at !== request.created_at
                ? ` · обновлена ${request.updated_at.slice(0, 10)}`
                : ""}
            </p>
          </div>

          {/* Основная информация */}
          <div className="glass-strong animate-fade-up mt-8 rounded-[2rem] p-7 md:p-8 [animation-delay:100ms]">
            <div className="grid gap-6 sm:grid-cols-2">
              {/* Подопечный */}
              <div>
                <div className="text-xs uppercase tracking-wide text-slate-600">Подопечный</div>
                <div className="mt-1 text-lg font-semibold text-brand">
                  {request.ward_name ?? "—"}
                  {request.kind === "caretaker" && request.ward_age
                    ? `, ${request.ward_age} лет`
                    : ""}
                </div>
              </div>

              {/* Период / тариф */}
              {request.kind === "caretaker" ? (
                <div>
                  <div className="text-xs uppercase tracking-wide text-slate-600">Период ухода</div>
                  <div className="mt-1 text-lg font-semibold text-brand">
                    {periodLabel ?? "не указан"}
                  </div>
                </div>
              ) : (
                <div>
                  <div className="text-xs uppercase tracking-wide text-slate-600">Тариф</div>
                  <div className="mt-1 text-lg font-semibold text-brand">
                    {request.plan_name ?? "—"}
                    {request.monthly_price
                      ? ` · ${request.monthly_price.toLocaleString("ru-RU")} ₽/мес`
                      : ""}
                  </div>
                </div>
              )}

              {/* Адрес */}
              {request.kind === "caretaker" ? (
                <div>
                  <div className="text-xs uppercase tracking-wide text-slate-600">Адрес</div>
                  <div className="mt-1 font-medium text-slate-700">{request.address ?? "—"}</div>
                </div>
              ) : (
                <div>
                  <div className="text-xs uppercase tracking-wide text-slate-600">Паспорт</div>
                  <div className="mt-1 font-medium text-slate-700">{request.passport ?? "—"}</div>
                </div>
              )}

              {/* Клиент */}
              <div>
                <div className="text-xs uppercase tracking-wide text-slate-600">Клиент</div>
                <div className="mt-1 font-medium text-slate-700">
                  {request.client_name?.trim() || request.client_email}
                </div>
                {request.client_phone ? (
                  <a
                    href={`tel:${request.client_phone.replace(/[^+\d]/g, "")}`}
                    className="text-sm text-sky-700 hover:text-sky-800"
                  >
                    {request.client_phone}
                  </a>
                ) : (
                  <div className="text-xs text-slate-600">телефон не оставлен</div>
                )}
              </div>
            </div>

            {/* Услуги (сиделка) */}
            {request.kind === "caretaker" && tasks.length > 0 ? (
              <div className="mt-6">
                <div className="text-xs uppercase tracking-wide text-slate-600">Услуги</div>
                <div className="mt-2 flex flex-wrap gap-2">
                  {tasks.map((task) => (
                    <span
                      key={task}
                      className="rounded-full bg-sky-50/90 px-3 py-1 text-sm text-sky-700"
                    >
                      {task}
                    </span>
                  ))}
                </div>
              </div>
            ) : null}

            {/* Описание / пожелания */}
            {request.kind === "caretaker"
              ? request.notes
                ? (
                    <div className="mt-6">
                      <div className="text-xs uppercase tracking-wide text-slate-600">Пожелания</div>
                      <p className="glass mt-2 rounded-2xl px-5 py-4 leading-7 text-slate-600">
                        {request.notes}
                      </p>
                    </div>
                  )
                : null
              : request.description ?? request.message
                ? (
                    <div className="mt-6">
                      <div className="text-xs uppercase tracking-wide text-slate-600">
                        Описание ситуации
                      </div>
                      <p className="glass mt-2 rounded-2xl px-5 py-4 leading-7 text-slate-600">
                        {request.description ?? request.message}
                      </p>
                    </div>
                  )
                : null}

            {/* Сиделка / сотрудник */}
            {request.kind === "caretaker" ? (
              request.caretaker_name ? (
                <div className="glass mt-6 rounded-2xl px-5 py-4">
                  <div className="text-xs uppercase tracking-wide text-slate-600">Сиделка</div>
                  <div className="mt-1">
                    <span className="text-lg font-semibold text-brand">{request.caretaker_name}</span>
                    {request.caretaker_experience ? (
                      <span className="text-slate-600">
                        {" "}· стаж {pluralYears(request.caretaker_experience)}
                      </span>
                    ) : null}
                    <div className="mt-1 text-sm text-slate-700">
                      {request.status === "accepted"
                        ? "Приняла заявку — вы в работе"
                        : "Заявка ждёт её ответа"}
                    </div>
                  </div>
                </div>
              ) : request.status === "new" ? (
                <p className="glass mt-6 rounded-2xl px-5 py-4 text-sm leading-6 text-amber-700">
                  Сейчас все сиделки заняты — заявка в очереди.
                </p>
              ) : null
            ) : request.employee_email ? (
              <div className="glass mt-6 rounded-2xl px-5 py-4 text-sm">
                <span className="text-slate-700">Заявку ведёт: </span>
                <span className="font-semibold text-brand">{request.employee_email}</span>
              </div>
            ) : null}
          </div>

          {/* Действия */}
          <div className="animate-fade-up mt-8 space-y-6">
            {/* Клиент отменяет неактивную заявку на сиделку (в очереди / без сиделки) */}
            {request.kind === "caretaker" &&
            isOwner &&
            (request.status === "new" || request.status === "declined") ? (
              <div className="glass rounded-[2rem] p-6">
                <div className="text-sm font-semibold text-brand">Передумали?</div>
                <p className="mt-1 text-sm leading-6 text-slate-700">
                  Заявка ещё не активна — её можно отменить.
                </p>
                <div className="mt-4">
                  <CancelRequestButton requestId={request.id} />
                </div>
              </div>
            ) : null}

            {/* Сиделка решает по предложенной заявке */}
            {request.kind === "caretaker" && isAssignedCaretaker && request.status === "offered" ? (
              <CaretakerDecideButtons requestId={request.id} />
            ) : null}

            {/* Клиент может перенести активную заявку к другой сиделке */}
            {request.kind === "caretaker" &&
            isOwner &&
            (request.status === "offered" || request.status === "accepted") ? (
              <div className="glass rounded-[2rem] p-6">
                <div className="text-sm font-semibold text-brand">
                  Не подходит сиделка или поменялись планы?
                </div>
                <p className="mt-1 text-sm leading-6 text-slate-700">
                  Перенесите заявку — текущая сиделка освободится, заявку примет
                  другая свободная.
                </p>
                <div className="mt-4">
                  <TransferButton requestId={request.id} />
                </div>
              </div>
            ) : null}
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
