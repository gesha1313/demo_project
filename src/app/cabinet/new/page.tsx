import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import RequestWizard, { type PlanOption } from "@/components/RequestWizard";
import { getCurrentUser } from "@/lib/auth";
import { dbAll, getDb } from "@/lib/db";

export const metadata: Metadata = {
  title: "Новая заявка",
  description:
    "Создание заявки: данные подопечного и выбор тарифа проживания с уходом.",
};

export default async function NewRequestPage() {
  const user = await getCurrentUser();
  if (!user) {
    redirect("/login");
  }

  const db = await getDb();
  const plans = await dbAll<{
    id: number;
    name: string;
    monthly_price: number;
    note: string | null;
    is_popular: number;
  }>(db, `SELECT id, name, monthly_price, note, is_popular FROM plans ORDER BY id`);

  const features = await dbAll<{ plan_id: number; feature: string }>(
    db,
    `SELECT plan_id, feature FROM plan_features ORDER BY sort_order`,
  );

  const planOptions: PlanOption[] = plans.map((plan) => ({
    id: plan.id,
    name: plan.name,
    monthlyPrice: plan.monthly_price,
    note: plan.note,
    isPopular: plan.is_popular === 1,
    features: features.filter((f) => f.plan_id === plan.id).map((f) => f.feature),
  }));

  return (
    <>
      <Header />
      <main className="relative flex-1 overflow-hidden bg-gradient-to-br from-white via-blue-50 to-indigo-100">
        <div className="absolute -right-32 -top-24 h-96 w-96 animate-float rounded-full bg-blue-300/40 blur-3xl" />
        <div className="absolute -left-28 bottom-0 h-96 w-96 animate-float-slow rounded-full bg-indigo-200/50 blur-3xl" />

        <div className="relative mx-auto max-w-6xl px-6 py-16 md:py-20">
          <div className="animate-fade-up mb-10">
            <Link
              href="/cabinet"
              className="inline-flex items-center gap-2 text-sm font-semibold text-blue-700 transition-all duration-200 hover:translate-x-1 hover:text-blue-800"
            >
              ← В личный кабинет
            </Link>
            <h1 className="mt-4 text-3xl font-semibold tracking-tight text-brand md:text-4xl">
              Новая заявка
            </h1>
            <p className="mt-2 max-w-lg text-slate-600">
              Два шага: расскажите о подопечном и выберите тариф проживания.
              Заявок может быть несколько — например, для двух близких.
            </p>
          </div>

          <div className="flex animate-fade-up justify-center [animation-delay:75ms]">
            <RequestWizard plans={planOptions} />
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
