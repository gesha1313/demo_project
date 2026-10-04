import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Reveal from "@/components/Reveal";
import ProfileCard from "@/components/ProfileCard";
import LogoutButton from "@/components/LogoutButton";
import { getCurrentUser, isStaff } from "@/lib/auth";
import { getDb } from "@/lib/db";

export const metadata: Metadata = {
  title: "Личный кабинет",
  description:
    "Личный кабинет: контакты для связи, статус заявки и чат с горячей линией пансионата.",
};

const STATUS_LABELS: Record<string, string> = {
  new: "Новая — ждёт распределения",
  in_progress: "В работе — сотрудник свяжется с вами",
  done: "Завершена",
  cancelled: "Отменена",
};

const STATUS_STYLES: Record<string, string> = {
  new: "bg-blue-100/80 text-blue-700",
  in_progress: "bg-amber-100/80 text-amber-700",
  done: "bg-emerald-100/80 text-emerald-700",
  cancelled: "bg-slate-200/80 text-slate-500",
};

export default async function CabinetPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const user = await getCurrentUser();
  if (!user) {
    redirect("/login");
  }

  // Форма контактов показывается, пока телефон не оставлен,
  // или когда пользователь нажал «Изменить данные» (?edit=1)
  const params = await searchParams;
  const showForm = !user.phone || params.edit === "1";

  const db = getDb();
  const request = db
    .prepare(
      `SELECT r.id, r.status, r.message, r.created_at, r.employee_id,
              e.email AS employee_email
         FROM requests r
         LEFT JOIN users e ON e.id = r.employee_id
        WHERE r.user_id = ?
        ORDER BY r.id DESC LIMIT 1`,
    )
    .get(user.id) as
    | {
        id: number;
        status: string;
        message: string | null;
        created_at: string;
        employee_id: number | null;
        employee_email: string | null;
      }
    | undefined;

  const displayName = user.fullName?.trim() || user.email;

  // Карточка статуса заявки — одна на обе композиции
  const statusCard = (
    <div className="glass h-full rounded-[2rem] p-7 md:p-8">
      <div className="flex items-center justify-between gap-4">
        <h2 className="text-lg font-semibold text-brand">Статус заявки</h2>
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
            <div className="text-xs font-semibold uppercase tracking-wide text-blue-700">
              Заявка №{request.id} · {request.created_at.slice(0, 10)}
            </div>
            {request.message ? (
              <p className="mt-1 leading-6 text-slate-600">{request.message}</p>
            ) : (
              <p className="mt-1 text-slate-500">Без комментария</p>
            )}
          </div>

          <p className="text-slate-500">
            {request.employee_email
              ? `Ваш заявкой занимается: ${request.employee_email}`
              : "Заявка ждёт распределения к сотруднику."}
          </p>
        </div>
      ) : (
        <p className="mt-5 text-sm leading-6 text-slate-500">
          Заявок пока нет. Заполните форму на странице «Получить консультацию»,
          и мы свяжемся с вами.
        </p>
      )}
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
      <main className="relative flex-1 overflow-hidden bg-gradient-to-br from-white via-blue-50 to-indigo-100">
        <div className="absolute -right-32 -top-24 h-96 w-96 animate-float rounded-full bg-blue-300/40 blur-3xl" />
        <div className="absolute -left-28 bottom-0 h-96 w-96 animate-float-slow rounded-full bg-indigo-200/50 blur-3xl" />

        <div className="relative mx-auto max-w-6xl px-6 py-16 md:py-20">
          {/* Приветствие */}
          <div className="animate-fade-up flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <span className="inline-flex items-center gap-2 rounded-full glass px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.18em] text-blue-700">
                Личный кабинет
              </span>
              <h1 className="mt-4 text-3xl font-semibold tracking-tight text-brand md:text-4xl">
                Здравствуйте, {displayName}
              </h1>
              <p className="mt-2 text-slate-600">
                {showForm && !user.phone
                  ? "Оставьте номер телефона, чтобы мы могли вам перезвонить."
                  : "Всё о заявке и связь с пансионатом — в одном месте."}
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              {isStaff(user) ? (
                <Link
                  href="/admin"
                  className="btn-glass-primary rounded-full px-6 py-3 text-sm font-semibold"
                >
                  Админ-панель
                </Link>
              ) : null}
              <LogoutButton />
            </div>
          </div>

          {showForm ? (
            /* До сохранения контактов: форма + статус рядом, линия во всю ширину */
            <div className="mt-12 grid gap-6 lg:grid-cols-2">
              <Reveal>
                <ProfileCard initialFullName={user.fullName} initialPhone={user.phone} />
              </Reveal>

              <Reveal delay={120}>{statusCard}</Reveal>

              <Reveal delay={180} className="lg:col-span-2">
                {supportCard(false)}
              </Reveal>
            </div>
          ) : (
            /* Контакты сохранены: вместо формы — компактная полоска,
               статус и горячая линия встают рядом */
            <div className="mt-12 space-y-6">
              <div className="glass animate-fade-up flex flex-col gap-4 rounded-[2rem] px-7 py-5 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex items-center gap-4">
                  <span className="icon-glow glass-strong flex h-11 w-11 shrink-0 items-center justify-center rounded-full text-blue-700">
                    ✓
                  </span>
                  <div>
                    <div className="text-sm font-semibold text-brand">
                      {user.fullName?.trim() ? `${user.fullName} · ${user.phone}` : user.phone}
                    </div>
                    <div className="text-sm text-slate-500">
                      Контакты сохранены — перезвоним на этот номер
                    </div>
                  </div>
                </div>

                <Link
                  href="/cabinet?edit=1"
                  className="w-fit shrink-0 text-sm font-semibold text-blue-700 transition-colors hover:text-blue-800"
                >
                  Изменить данные
                </Link>
              </div>

              <div className="grid gap-6 lg:grid-cols-2">
                <Reveal>{statusCard}</Reveal>
                <Reveal delay={120}>{supportCard(true)}</Reveal>
              </div>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
}
