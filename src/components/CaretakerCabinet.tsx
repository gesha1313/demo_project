import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Reveal from "@/components/Reveal";
import LogoutButton from "@/components/LogoutButton";
import CaretakerDecideButtons from "@/components/CaretakerDecideButtons";
import { dbAll, dbGet, getDb } from "@/lib/db";

const STATUS_META: Record<string, { label: string; className: string; hint: string }> = {
  free: {
    label: "Свободна",
    className: "bg-emerald-100/80 text-emerald-700",
    hint: "Вы в очереди на подбор — новые заявки придут вам первыми",
  },
  waiting: {
    label: "Ожидание",
    className: "bg-amber-100/80 text-amber-700",
    hint: "Есть заявка, которая ждёт вашего ответа",
  },
  busy: {
    label: "В работе",
    className: "bg-blue-100/80 text-blue-700",
    hint: "Вы приняли заявку — новые предложения не приходят",
  },
};

const pluralYears = (n: number) => {
  if (n % 10 === 1 && n !== 11) return `${n} год`;
  if ([2, 3, 4].includes(n % 10) && ![12, 13, 14].includes(n)) return `${n} года`;
  return `${n} лет`;
};

type Offer = {
  id: number;
  status: string;
  ward_name: string;
  ward_age: number | null;
  address: string | null;
  tasks: string | null;
  start_date: string | null;
  end_date: string | null;
  notes: string | null;
  arrival_minutes: number | null;
  created_at: string;
  client_name: string | null;
  client_email: string;
  client_phone: string | null;
};

/** Кабинет сиделки: статус и предложенные/принятые заявки. */
export default async function CaretakerCabinet({
  userId,
  email,
}: {
  userId: number;
  email: string;
}) {
  const db = await getDb();

  const profile = await dbGet<{
    full_name: string;
    experience_years: number;
    status: "free" | "waiting" | "busy";
  }>(
    db,
    `SELECT full_name, experience_years, status FROM caretaker_profiles WHERE user_id = ?`,
    [userId],
  );

  const offers = await dbAll<Offer>(
    db,
    `SELECT cr.id, cr.status, cr.ward_name, cr.ward_age, cr.address, cr.tasks,
            cr.start_date, cr.end_date, cr.notes, cr.arrival_minutes, cr.created_at,
            u.email AS client_email,
            p.full_name AS client_name,
            p.phone AS client_phone
       FROM caretaker_requests cr
       JOIN users u ON u.id = cr.user_id
       LEFT JOIN user_profiles p ON p.user_id = cr.user_id
      WHERE cr.caretaker_user_id = ?
        AND cr.status IN ('offered', 'accepted')
      ORDER BY cr.id DESC`,
    [userId],
  );

  const statusMeta = STATUS_META[profile?.status ?? "free"];

  return (
    <>
      <Header />
      <main className="relative flex-1 overflow-hidden bg-gradient-to-br from-white via-blue-50 to-indigo-100">
        <div className="absolute -right-32 -top-24 h-96 w-96 animate-float rounded-full bg-blue-300/40 blur-3xl" />
        <div className="absolute -left-28 bottom-0 h-96 w-96 animate-float-slow rounded-full bg-indigo-200/50 blur-3xl" />

        <div className="relative mx-auto max-w-4xl px-6 py-16">
          {/* Приветствие и статус */}
          <div className="animate-fade-up flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <span className="inline-flex items-center gap-2 rounded-full glass px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.18em] text-blue-700">
                Кабинет сиделки
              </span>
              <h1 className="mt-4 text-3xl font-semibold tracking-tight text-brand md:text-4xl">
                {profile?.full_name ?? email}
              </h1>
              <p className="mt-1 text-sm text-slate-500">
                {email}
                {profile ? ` · стаж ${pluralYears(profile.experience_years)}` : ""}
              </p>
              <p className="mt-2 max-w-md text-sm text-slate-500">{statusMeta.hint}</p>
            </div>

            <div className="flex flex-col items-start gap-3 md:items-end">
              <span
                className={`glass rounded-full px-5 py-2.5 text-sm font-semibold ${statusMeta.className}`}
              >
                Статус: {statusMeta.label}
              </span>
              <LogoutButton />
            </div>
          </div>

          {/* Заявки */}
          <div className="mt-12 space-y-5">
            {offers.length === 0 ? (
              <Reveal>
                <div className="glass rounded-[2rem] p-8 text-center">
                  <p className="text-slate-600">
                    Заявок пока нет. Как только клиент оформит заказ на сиделку,
                    он появится здесь.
                  </p>
                </div>
              </Reveal>
            ) : (
              offers.map((offer, index) => (
                <Reveal key={offer.id} delay={Math.min(index * 80, 320)}>
                  <article
                    className={`glass rounded-[1.75rem] p-6 md:p-7 ${
                      offer.status === "accepted" ? "border-l-4 border-l-emerald-400" : ""
                    }`}
                  >
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="rounded-full bg-slate-100/80 px-3 py-1 text-xs font-semibold text-slate-600">
                          Заявка №{offer.id}
                        </span>
                        <span className="text-xs text-slate-400">
                          {offer.created_at.slice(0, 10)} {offer.created_at.slice(11, 16)}
                        </span>
                      </div>

                      {offer.status === "accepted" ? (
                        <span className="rounded-full bg-emerald-100/80 px-3 py-1 text-xs font-semibold text-emerald-700">
                          Принята · вы в работе
                        </span>
                      ) : (
                        <span className="rounded-full bg-amber-100/80 px-3 py-1 text-xs font-semibold text-amber-700">
                          Ждёт вашего ответа
                        </span>
                      )}
                    </div>

                    <div className="mt-4 grid gap-3 text-sm sm:grid-cols-2">
                      <div>
                        <div className="text-xs uppercase tracking-wide text-slate-400">Клиент</div>
                        <div className="mt-1 font-medium text-brand">
                          {offer.client_name?.trim() || offer.client_email}
                        </div>
                        {offer.client_phone ? (
                          <a
                            href={`tel:${offer.client_phone.replace(/[^+\d]/g, "")}`}
                            className="text-blue-700 hover:text-blue-800"
                          >
                            {offer.client_phone}
                          </a>
                        ) : (
                          <div className="text-xs text-slate-400">телефон не оставлен</div>
                        )}
                      </div>
                      <div>
                        <div className="text-xs uppercase tracking-wide text-slate-400">
                          Подопечный и адрес
                        </div>
                        <div className="mt-1 font-medium text-brand">
                          {offer.ward_name}
                          {offer.ward_age ? `, ${offer.ward_age} лет` : ""}
                        </div>
                        <div className="text-slate-600">{offer.address}</div>
                      </div>
                    </div>

                    {offer.tasks ? (
                      <div className="mt-3 flex flex-wrap gap-1.5">
                        {(JSON.parse(offer.tasks) as string[]).map((task) => (
                          <span
                            key={task}
                            className="rounded-full bg-emerald-50/90 px-2.5 py-0.5 text-xs text-emerald-700"
                          >
                            {task}
                          </span>
                        ))}
                      </div>
                    ) : null}

                    <div className="mt-3 flex flex-wrap gap-x-5 gap-y-1 text-xs text-slate-500">
                      {offer.start_date || offer.end_date ? (
                        <span>
                          Период:{" "}
                          {offer.start_date && offer.end_date
                            ? `${offer.start_date.split("-").reverse().join(".")} — ${offer.end_date.split("-").reverse().join(".")}`
                            : `с ${(offer.start_date ?? offer.end_date)!.split("-").reverse().join(".")}`}
                        </span>
                      ) : null}
                      {offer.arrival_minutes ? <span>Выезд ~{offer.arrival_minutes} мин</span> : null}
                    </div>

                    {offer.notes ? (
                      <p className="glass-strong mt-4 rounded-2xl px-4 py-3 text-sm leading-6 text-slate-600">
                        {offer.notes}
                      </p>
                    ) : null}

                    {offer.status === "offered" ? (
                      <div className="mt-5">
                        <CaretakerDecideButtons requestId={offer.id} />
                      </div>
                    ) : null}

                    <div className="mt-4">
                      <Link
                        href={`/cabinet/requests/${offer.id}`}
                        className="inline-flex items-center gap-1.5 text-sm font-semibold text-blue-700 transition-all duration-200 hover:translate-x-1 hover:text-blue-800"
                      >
                        Подробнее →
                      </Link>
                    </div>
                  </article>
                </Reveal>
              ))
            )}
          </div>

          <p className="mt-10 text-center text-sm text-slate-400">
            Приняли заявку — статус меняется на «В работе», новые предложения
            не приходят. Отказались — вернётесь в очередь «Свободна»,{" "}
            <Link href="/" className="text-blue-700 hover:text-blue-800">
              если других заявок нет
            </Link>
            .
          </p>
        </div>
      </main>
      <Footer />
    </>
  );
}
