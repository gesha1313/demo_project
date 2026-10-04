import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import SupportChat from "@/components/SupportChat";
import { getCurrentUser } from "@/lib/auth";

export const metadata: Metadata = {
  title: "Горячая линия",
  description: "Чат с горячей линией пансионата — задайте вопрос о проживании и уходе.",
};

export default async function SupportPage() {
  const user = await getCurrentUser();
  if (!user) {
    redirect("/login");
  }

  return (
    <>
      <Header />
      <main className="relative flex-1 overflow-hidden bg-gradient-to-br from-white via-blue-50 to-indigo-100">
        <div className="absolute -right-32 -top-24 h-96 w-96 animate-float rounded-full bg-blue-300/40 blur-3xl" />
        <div className="absolute -left-28 bottom-0 h-96 w-96 animate-float-slow rounded-full bg-indigo-200/50 blur-3xl" />

        <div className="relative mx-auto max-w-3xl px-6 py-16 md:py-20">
          <div className="animate-fade-up mb-8">
            <Link
              href="/cabinet"
              className="inline-flex items-center gap-2 text-sm font-semibold text-blue-700 transition-all duration-200 hover:translate-x-1 hover:text-blue-800"
            >
              ← В личный кабинет
            </Link>
            <h1 className="mt-4 text-3xl font-semibold tracking-tight text-brand md:text-4xl">
              Чат с горячей линией
            </h1>
            <p className="mt-2 max-w-lg text-slate-600">
              Задайте любой вопрос о проживании, уходе и документах —
              сотрудник поддержки ответит в этом чате.
            </p>
          </div>

          <div className="animate-fade-up [animation-delay:150ms]">
            <SupportChat myId={user.id} />
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
