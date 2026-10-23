import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Reveal from "@/components/Reveal";
import SectionFooter from "@/components/SectionFooter";
import { getCurrentUser } from "@/lib/auth";
import { dbAll, getDb } from "@/lib/db";

export const metadata: Metadata = {
  title: "Мои заявки",
  description: "Все отправленные заявки: пансионат и услуга сиделки.",
};

const STATUS_LABELS: Record<string, string> = {
  new: "Новая",
  in_progress: "В работе",
  done: "Завершена",
  cancelled: "Отменена",
  // статусы заявок на сиделку
  offered: "Ждёт ответа сиделки",
  accepted: "Принята сиделкой",
  declined: "Ищем другую сиделку",
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

const formatPrice = (price: number) => price.toLocaleString("ru-RU");

type PansionatRequest = {
  kind: "pansionat";
  id: number;
  status: string;
  message: string | null;
  description: string | null;
  ward_name: string | null;
  created_at: string;
  updated_at: string;
  plan_name: string | null;
  monthly_price: number | null;
  employee_email: string | null;
};

type CaretakerRequest = {
  kind: "caretaker";
  id: number;
  status: string;
  ward_name: string;
  ward_age: number | null;
  address: string | null;
  tasks: string | null;
  start_date: string | null;
  caretaker_name: string | null;
  caretaker_experience: number | null;
  arrival_minutes: number | null;
  created_at: string;
};

type AnyRequest = PansionatRequest | CaretakerRequest;

const pluralYears = (n: number) => {
  if (n % 10 === 1 && n !== 11) return "год";
  if ([2, 3, 4].includes(n % 10) && ![12, 13, 14].includes(n)) return "года";
  return "лет";
};

export default async function CabinetRequestsPage() {
  const user = await getCurrentUser();
  if (!user) {
    redirect("/login");
  }

  const db = await getDb();

  const pansionat = await dbAll<Omit<PansionatRequest, "kind">>(
    db,
    `SELECT r.id, r.status, r.message, r.description, r.ward_name, r.created_at, r.updated_at,
            pl.name AS plan_name, pl.monthly_price,
            e.email AS employee_email
       FROM requests r
       LEFT JOIN plans pl ON pl.id = r.plan_id
       LEFT JOIN users e ON e.id = r.employee_id
      WHERE r.user_id = ?
      ORDER BY r.id DESC`,
    [user.id],
  );

  const caretaker = await dbAll<Omit<CaretakerRequest, "kind">>(
    db,
    `SELECT cr.id, cr.status, cr.ward_name, cr.ward_age, cr.address, cr.tasks,
            cr.start_date, cr.arrival_minutes, cr.created_at,
            cp.full_name AS caretaker_name,
            cp.experience_years AS caretaker_experience
       FROM caretaker_requests cr
       LEFT JOIN caretaker_profiles cp ON cp.user_id = cr.caretaker_user_id
      WHERE cr.user_id = ?
      ORDER BY cr.id DESC`,
    [user.id],
  );

  // Единый список: свежие сверху
  const all: AnyRequest[] = [
    ...pansionat.map((r) => ({ ...r, kind: "pansionat" as const })),
    ...caretaker.map((r) => ({ ...r, kind: "caretaker" as const })),
  ].sort((a, b) => b.created_at.localeCompare(a.created_at) || b.id - a.id);

  const pansionatCount = pansionat.length;
  const caretakerCount = caretaker.length;

  return (
    <>
      <Header />
      <main className="relative flex-1 overflow-hidden">
        <div className="absolute -right-32 -top-24 h-96 w-96 animate-float rounded-full bg-sky-300/30 blur-3xl" />
        <div className="absolute -left-28 bottom-0 h-96 w-96 animate-float-slow rounded-full bg-amber-200/40 blur-3xl" />

        <div className="relative mx-auto max-w-4xl px-6 py-16">
          {/* Заголовок */}
          <div className="animate-fade-up flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <Link
                href="/cabinet"
                className="inline-flex items-center gap-2 text-sm font-semibold text-sky-700 transition-all duration-200 hover:translate-x-1 hover:text-sky-800"
              >
                ← В личный кабинет
              </Link>
              <h1 className="mt-4 text-3xl font-semibold tracking-tight text-brand md:text-4xl">
                Мои заявки
              </h1>
              <p className="mt-2 text-slate-600">
                Все ваши обращения — в пансионат и на услугу сиделки.
              </p>
            </div>

            <div className="flex gap-3">
              <span className="glass rounded-full px-4 py-2 text-sm font-semibold text-sky-700">
                Пансионат: {pansionatCount}
              </span>
              <span className="glass rounded-full px-4 py-2 text-sm font-semibold text-sky-700">
                Сиделки: {caretakerCount}
              </span>
            </div>
          </div>

          {/* Список заявок */}
          <div className="mt-10 space-y-5">
            {all.length === 0 ? (
              <div className="glass rounded-xl p-8 text-center">
                <p className="text-slate-600">
                  Заявок пока нет. Оформите первую — в пансионат или на услугу сиделки.
                </p>
                <div className="mt-6 flex flex-col justify-center gap-3 sm:flex-row">
                  <Link
                    href="/caretaker"
                    className="btn-glass-primary rounded-full px-6 py-3 text-sm font-semibold"
                  >
                    Заказать сиделку
                  </Link>
                  <Link
                    href="/cabinet/new"
                    className="btn-glass-ghost rounded-full px-6 py-3 text-sm font-semibold"
                  >
                    Заявка в пансионат
                  </Link>
                </div>
              </div>
            ) : (
              all.map((request, index) => (
                <Reveal key={`${request.kind}-${request.id}`} delay={Math.min(index * 80, 320)}>
                  {request.kind === "pansionat" ? (
                    <article className="glass rounded-xl p-6 md:p-7">
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <div className="flex flex-wrap items-center gap-2">
                            <span className="rounded-full bg-sky-100/80 px-3 py-1 text-xs font-semibold text-sky-700">
                              Пансионат · №{request.id}
                            </span>
                            <span className="text-xs text-slate-600">
                              {request.created_at.slice(0, 10)}{" "}
                              {request.created_at.slice(11, 16)}
                            </span>
                          </div>
                        </div>

                        <span
                          className={`shrink-0 rounded-full px-3 py-1 text-xs font-semibold ${
                            STATUS_STYLES[request.status] ?? STATUS_STYLES.new
                          }`}
                        >
                          {STATUS_LABELS[request.status] ?? request.status}
                        </span>
                      </div>

                      <div className="mt-4 flex flex-wrap gap-2">
                        {request.ward_name ? (
                          <span className="rounded-full bg-slate-100/80 px-3 py-1 text-xs font-medium text-slate-600">
                            Подопечный: {request.ward_name}
                          </span>
                        ) : null}
                        {request.plan_name ? (
                          <span className="rounded-full bg-sky-100/80 px-3 py-1 text-xs font-semibold text-sky-700">
                            {request.plan_name}
                            {request.monthly_price
                              ? ` · ${formatPrice(request.monthly_price)} ₽/мес`
                              : ""}
                          </span>
                        ) : null}
                      </div>

                      {request.description ?? request.message ? (
                        <p className="glass-strong mt-4 rounded-xl px-5 py-4 text-sm leading-6 text-slate-600">
                          {request.description ?? request.message}
                        </p>
                      ) : null}

                      <div className="mt-4 text-sm text-slate-700">
                        {request.employee_email
                          ? `Заявку ведёт: ${request.employee_email}`
                          : "Ждёт распределения к сотруднику"}
                      </div>

                      <div className="mt-4">
                        <Link
                          href={`/cabinet/requests/${request.id}`}
                          className="inline-flex items-center gap-1.5 text-sm font-semibold text-sky-700 transition-all duration-200 hover:translate-x-1 hover:text-sky-800"
                        >
                          Подробнее →
                        </Link>
                      </div>
                    </article>
                  ) : (
                    /* ===== Заявка на сиделку — визуально отличается ===== */
                    <article className="glass rounded-xl border-l-4 border-l-sky-400 p-6 md:p-7">
                      <div className="flex items-start justify-between gap-3">
                       

                        <span
                          className={`shrink-0 rounded-full px-3 py-1 text-xs font-semibold ${
                            STATUS_STYLES[request.status] ?? STATUS_STYLES.offered
                          }`}
                        >
                          {STATUS_LABELS[request.status] ?? request.status}
                        </span>
                      </div>

                      <div className="mt-4 flex flex-wrap gap-2">
                        <span className="rounded-full bg-slate-100/80 px-3 py-1 text-sm font-medium text-slate-800">
                          {request.ward_name}
                          {request.ward_age ? `, ${request.ward_age} лет` : ""}
                        </span>
                        {request.address ? (
                          <span className="rounded-full bg-slate-100/80 px-3 py-1 text-sm font-medium text-slate-800">
                            {request.address}
                          </span>
                        ) : null}
                       
                      </div>

                      {request.tasks ? (
                        <div className="mt-3 flex flex-wrap gap-1.5">
                          {(JSON.parse(request.tasks) as string[]).map((task) => (
                            <span
                              key={task}
                              className="rounded-full bg-sky-50/90 px-2.5 py-0.5 text-xs text-sky-700"
                            >
                              {task}
                            </span>
                          ))}
                        </div>
                      ) : null}

                      {request.caretaker_name ? (
                        <div className="glass-strong mt-4 rounded-xl px-5 py-4 text-sm">
                          <span className="font-bold text-brand">
                            {request.status === "accepted" ? "Сиделка приняла заявку: " : "Предложена сиделке: "}
                          </span>
                          <span className="font-bold text-brand">{request.caretaker_name}</span>
                          {request.caretaker_experience ? (
                            <span className="text-slate-600">
                              {" "}· стаж {request.caretaker_experience}{" "}
                              {pluralYears(request.caretaker_experience)}
                            </span>
                          ) : null}

                        </div>
                      ) : request.status === "new" ? (
                        <p className="glass-strong mt-4 rounded-xl px-5 py-4 text-sm leading-6 text-amber-700">
                          Сейчас все сиделки заняты — заявка в очереди.
                        </p>
                      ) : null}

                      <div className="mt-4">
                        <Link
                          href={`/cabinet/requests/${request.id}`}
                          className="inline-flex items-center gap-1.5 text-sm font-semibold text-sky-700 transition-all duration-200 hover:translate-x-1 hover:text-sky-800"
                        >
                          Подробнее →
                        </Link>
                      </div>
                    </article>
                  )}
                </Reveal>
              ))
            )}
          </div>

          {/* Переходник: создание следующей заявки */}
          {all.length > 0 ? (
            <SectionFooter
              href="/caretaker"
              next="Заказать сиделку ещё раз"
              hint="Анкета займет пару минут — подберём свободную сиделку рядом"
            />
          ) : null}
        </div>
      </main>
      <Footer />
    </>
  );
}
