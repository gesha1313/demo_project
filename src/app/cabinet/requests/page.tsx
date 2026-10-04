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
  description: "Все отправленные заявки на консультацию и их статусы.",
};

const STATUS_LABELS: Record<string, string> = {
  new: "Новая",
  in_progress: "В работе",
  done: "Завершена",
  cancelled: "Отменена",
};

const STATUS_STYLES: Record<string, string> = {
  new: "bg-blue-100/80 text-blue-700",
  in_progress: "bg-amber-100/80 text-amber-700",
  done: "bg-emerald-100/80 text-emerald-700",
  cancelled: "bg-slate-200/80 text-slate-500",
};

export default async function CabinetRequestsPage() {
  const user = await getCurrentUser();
  if (!user) {
    redirect("/login");
  }

  const db = await getDb();
  const requests = await dbAll<{
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
  }>(
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

  return (
    <>
      <Header />
      <main className="relative flex-1 overflow-hidden">
        <div className="absolute -right-32 -top-24 h-96 w-96 animate-float rounded-full bg-blue-300/30 blur-3xl" />
        <div className="absolute -left-28 bottom-0 h-96 w-96 animate-float-slow rounded-full bg-indigo-200/40 blur-3xl" />

        <div className="relative mx-auto max-w-4xl px-6 py-16">
          {/* Заголовок */}
          <div className="animate-fade-up flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <Link
                href="/cabinet"
                className="inline-flex items-center gap-2 text-sm font-semibold text-blue-700 transition-all duration-200 hover:translate-x-1 hover:text-blue-800"
              >
                ← В личный кабинет
              </Link>
              <h1 className="mt-4 text-3xl font-semibold tracking-tight text-brand md:text-4xl">
                Мои заявки
              </h1>
              <p className="mt-2 text-slate-600">
                Все ваши обращения — от первой заявки до текущей.
              </p>
            </div>

            <span className="glass w-fit rounded-full px-4 py-2 text-sm font-semibold text-blue-700">
              Всего: {requests.length}
            </span>
          </div>

          {/* Список заявок */}
          <div className="mt-10 space-y-5">
            {requests.length === 0 ? (
              <div className="glass rounded-[2rem] p-8 text-center">
                <p className="text-slate-600">
                  Заявок пока нет. Создайте первую — расскажите о подопечном и выберите тариф.
                </p>
                <Link
                  href="/cabinet/new"
                  className="btn-glass-primary mt-6 inline-block rounded-full px-6 py-3 text-sm font-semibold"
                >
                  Создать заявку
                </Link>
              </div>
            ) : (
              requests.map((request, index) => (
                <Reveal key={request.id} delay={Math.min(index * 80, 320)}>
                  <article className="glass rounded-[1.75rem] p-6 md:p-7">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <div className="text-xs font-semibold uppercase tracking-wide text-blue-700">
                          Заявка №{request.id}
                        </div>
                        <div className="mt-1 text-sm text-slate-500">
                          Отправлена {request.created_at.slice(0, 10)} в{" "}
                          {request.created_at.slice(11, 16)}
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
                        <span className="rounded-full bg-blue-100/80 px-3 py-1 text-xs font-semibold text-blue-700">
                          {request.plan_name}
                          {request.monthly_price
                            ? ` · ${(request.monthly_price ?? 0).toLocaleString("ru-RU")} ₽/мес`
                            : ""}
                        </span>
                      ) : null}
                    </div>

                    {(request.description ?? request.message) ? (
                      <p className="glass-strong mt-4 rounded-2xl px-5 py-4 text-sm leading-6 text-slate-600">
                        {request.description ?? request.message}
                      </p>
                    ) : null}

                    <div className="mt-4 text-sm text-slate-500">
                      {request.employee_email ? (
                        <>Заявку ведёт: <span className="font-medium text-brand">{request.employee_email}</span></>
                      ) : (
                        "Ждёт распределения к сотруднику"
                      )}
                      {request.updated_at !== request.created_at ? (
                        <span className="text-slate-400">
                          {" "}· обновлена {request.updated_at.slice(0, 10)}
                        </span>
                      ) : null}
                    </div>
                  </article>
                </Reveal>
              ))
            )}
          </div>

          {/* Переходник: создание следующей заявки */}
          {requests.length > 0 ? (
            <SectionFooter
              href="/cabinet/new"
              next="Создать новую заявку"
              hint="Можно отправить несколько заявок — например, для двух близких"
            />
          ) : null}
        </div>
      </main>
      <Footer />
    </>
  );
}
