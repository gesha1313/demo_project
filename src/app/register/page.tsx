import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import RegisterForm from "@/components/RegisterForm";
import { getCurrentUser } from "@/lib/auth";

export const metadata: Metadata = {
  title: "Регистрация",
  description:
    "Создайте аккаунт — оставите телефон для связи в личном кабинете и сможете написать в горячую линию.",
};

const benefits = [
  "Заявка на консультацию создаётся автоматически",
  "Номер телефона оставите в личном кабинете",
  "Чат с горячей линией пансионата",
];

export default async function RegisterPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  // Авторизованного пользователя некуда регистрировать — отправляем в кабинет
  const user = await getCurrentUser();
  if (user) {
    redirect("/cabinet");
  }

  // Куда перейти после регистрации (например, сразу к анкете сиделки)
  const params = await searchParams;
  const next =
    typeof params.next === "string" && params.next.startsWith("/") ? params.next : null;

  return (
    <>
      <Header />
      <main className="relative flex-1 overflow-hidden bg-gradient-to-br from-white via-brand-50 to-brand-100">
        <div className="absolute -right-32 -top-24 h-96 w-96 animate-float rounded-full bg-brand-300/40 blur-3xl" />
        <div className="absolute -left-28 bottom-0 h-96 w-96 animate-float-slow rounded-full bg-brand-200/50 blur-3xl" />

        <div className="relative mx-auto grid max-w-6xl items-center gap-14 px-6 py-16 md:py-24 lg:grid-cols-2">
          {/* Текстовый блок */}
          <div className="animate-fade-up">
            <span className="inline-flex items-center gap-2 rounded-full glass px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.18em] text-brand">
              <span className="h-1.5 w-1.5 rounded-full bg-brand shadow-[0_0_8px_rgba(62,107,79,0.9)]" />
              Регистрация
            </span>

            <h1 className="mt-4 bg-gradient-to-br from-[#3f6f9f] via-[#5b93c4] to-[#8ab4d6] bg-clip-text text-4xl font-semibold leading-[1.1] tracking-tight text-transparent md:text-5xl">
              Аккаунт для заботы о близком
            </h1>

            <p className="mt-5 max-w-lg text-lg leading-8 text-slate-600">
              Регистрация по email — без подтверждения по SMS.
              После входа оставьте телефон, и мы перезвоним вам.
            </p>

            <ul className="mt-8 space-y-3">
              {benefits.map((benefit) => (
                <li key={benefit} className="flex items-center gap-3">
                  <span className="glass-strong icon-glow flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-sm text-brand">
                    ✓
                  </span>
                  <span className="text-slate-700">{benefit}</span>
                </li>
              ))}
            </ul>

            <p className="mt-8 max-w-md text-sm leading-6 text-slate-700">
              Уже зарегистрированы?{" "}
              <Link href="/login" className="font-semibold text-brand hover:text-brand-dark">
                Войдите в личный кабинет
              </Link>
              .
            </p>
          </div>

          {/* Форма */}
          <div className="flex animate-fade-up justify-center [animation-delay:100ms]">
            <RegisterForm nextPath={next} />
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
