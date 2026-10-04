import type { Metadata } from "next";
import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "Аккаунт создан",
  description: "Аккаунт создан — оставьте телефон в личном кабинете, и мы перезвоним.",
};

const steps = [
  {
    number: "01",
    title: "Оставьте телефон",
    text: "В личном кабинете укажите номер — туда мы перезвоним.",
  },
  {
    number: "02",
    title: "Мы перезвоним",
    text: "Обсудим ситуацию и ответим на все вопросы.",
  },
  {
    number: "03",
    title: "Спокойное решение",
    text: "Вместе подберём формат ухода, который подойдёт вашему близкому.",
  },
];

export default function RegisterSuccessPage() {
  return (
    <>
      <Header />
      <main className="relative flex-1 overflow-hidden bg-gradient-to-br from-white via-blue-50 to-indigo-100">
        <div className="absolute -right-32 -top-24 h-96 w-96 animate-float rounded-full bg-blue-300/40 blur-3xl" />
        <div className="absolute -left-28 bottom-0 h-96 w-96 animate-float-slow rounded-full bg-indigo-200/50 blur-3xl" />

        <div className="relative mx-auto max-w-3xl px-6 py-16 md:py-24">
          <div className="glass-strong animate-fade-up relative overflow-hidden rounded-[2.5rem] p-8 text-center md:p-12">
            <div className="pointer-events-none absolute -right-16 -top-16 h-48 w-48 rounded-full bg-white/50 blur-3xl" />

            <div className="relative">
              {/* Значок успеха */}
              <div className="icon-glow mx-auto flex h-20 w-20 animate-fade-up items-center justify-center rounded-full bg-gradient-to-br from-blue-600 to-indigo-600 text-3xl text-white shadow-[0_14px_36px_rgba(37,99,235,0.4),inset_0_1px_0_rgba(255,255,255,0.35)]">
                ✓
              </div>

              <h1 className="mt-7 animate-fade-up text-3xl font-semibold tracking-tight text-brand md:text-4xl [animation-delay:100ms]">
                Аккаунт создан
              </h1>

              <p className="mx-auto mt-4 max-w-md animate-fade-up leading-7 text-slate-600 [animation-delay:200ms]">
                Заявка на консультацию уже в работе. Осталось оставить телефон —
                сделаем это в личном кабинете.
              </p>

              {/* Что дальше */}
              <div className="mt-10 grid gap-4 text-left sm:grid-cols-3">
                {steps.map((step, index) => (
                  <div
                    key={step.number}
                    className="glass animate-fade-up rounded-2xl p-5"
                    style={{ animationDelay: `${300 + index * 100}ms` }}
                  >
                    <div className="text-sm font-semibold text-blue-700">{step.number}</div>
                    <div className="mt-2 text-sm font-semibold text-brand">{step.title}</div>
                    <p className="mt-1 text-sm leading-6 text-slate-500">{step.text}</p>
                  </div>
                ))}
              </div>

              {/* Кнопки */}
              <div className="mt-10 flex animate-fade-up flex-col justify-center gap-4 [animation-delay:600ms] sm:flex-row">
                <Link
                  href="/cabinet"
                  className="btn-glass-primary rounded-full px-7 py-4 text-center font-semibold"
                >
                  В личный кабинет
                </Link>

                <Link
                  href="/rooms"
                  className="btn-glass-ghost rounded-full px-7 py-4 text-center font-semibold"
                >
                  Посмотреть номера
                </Link>
              </div>

              {/* Контакт */}
              <p className="mt-8 animate-fade-up text-sm text-slate-500 [animation-delay:700ms]">
                Не хочется ждать? Позвоните нам:{" "}
                <a
                  href={site.phoneHref}
                  className="font-semibold text-blue-700 transition-colors hover:text-blue-800"
                >
                  {site.phone}
                </a>
              </p>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
