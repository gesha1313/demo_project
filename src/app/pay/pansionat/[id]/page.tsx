import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import PaymentMock from "@/components/PaymentMock";
import { getCurrentUser } from "@/lib/auth";
import { dbGet, getDb } from "@/lib/db";

/** Оплата тарифа пансионата: цена тарифа × количество месяцев. */
export default async function PayPansionatPage({
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
    ward_name: string | null;
    plan_name: string;
    monthly_price: number;
  }>(
    db,
    `SELECT r.id, r.user_id, r.ward_name,
            pl.name AS plan_name, pl.monthly_price
       FROM requests r
       LEFT JOIN plans pl ON pl.id = r.plan_id
      WHERE r.id = ?`,
    [id],
  );

  if (!req || req.user_id !== user.id) {
    notFound();
  }

  return (
    <>
      <Header />
      <main className="flex-1">
        <div className="mx-auto max-w-xl px-6 py-16">
          <Link
            href="/cabinet/requests"
            className="text-sm font-semibold text-sky-700 hover:text-sky-800"
          >
            ← К заявкам
          </Link>
          <h1 className="mt-4 text-3xl font-semibold tracking-tight text-brand">
            Оплата тарифа пансионата
          </h1>
          <p className="mt-2 text-sm text-slate-700">
            Заявка №{req.id}
            {req.ward_name ? ` · подопечный ${req.ward_name}` : ""}
          </p>

          <div className="mt-8">
            <PaymentMock
              amount={req.monthly_price}
              perMonthPrice={req.monthly_price}
              lines={[
                `Тариф «${req.plan_name}»`,
                "Оплата помесячно — выберите количество месяцев",
              ]}
            />
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
