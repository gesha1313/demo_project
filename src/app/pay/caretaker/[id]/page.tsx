import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import PaymentMock from "@/components/PaymentMock";
import { getCurrentUser } from "@/lib/auth";
import { dbGet, getDb } from "@/lib/db";

const PRICE_PER_DAY = 2500;

/** Оплата услуги сиделки: количество дней × 2500 ₽. */
export default async function PayCaretakerPage({
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
  const req = await dbGet<{
    id: number;
    user_id: number;
    start_date: string | null;
    end_date: string | null;
    ward_name: string;
  }>(
    db,
    `SELECT id, user_id, start_date, end_date, ward_name FROM caretaker_requests WHERE id = ?`,
    [id],
  );

  if (!req || req.user_id !== user.id) {
    notFound();
  }

  // Считаем дни: разница дат, минимум 1
  let days = 1;
  if (req.start_date && req.end_date) {
    const diff = Math.round(
      (new Date(req.end_date).getTime() - new Date(req.start_date).getTime()) / 86400000,
    );
    days = Math.max(1, diff);
  }

  const period =
    req.start_date && req.end_date
      ? `${req.start_date.split("-").reverse().join(".")} — ${req.end_date.split("-").reverse().join(".")} (${days} дн.)`
      : "1 день";

  return (
    <>
      <Header />
      <main className="flex-1">
        <div className="mx-auto max-w-xl px-6 py-16">
          <Link
            href="/cabinet/requests"
            className="text-sm font-semibold text-brand hover:text-brand-dark"
          >
            ← К заявкам
          </Link>
          <h1 className="mt-4 text-3xl font-semibold tracking-tight text-brand">
            Оплата услуги сиделки
          </h1>
          <p className="mt-2 text-sm text-slate-700">
            Заявка №{req.id} · подопечный {req.ward_name}
          </p>

          <div className="mt-8">
            <PaymentMock
              amount={days * PRICE_PER_DAY}
              lines={[
                `Тариф: ${PRICE_PER_DAY.toLocaleString("ru-RU")} ₽ за день`,
                `Период: ${period}`,
              ]}
            />
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
