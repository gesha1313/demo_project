import Link from "next/link";
import Reveal from "./Reveal";

export default function CtaSection() {
  return (
    <section className="relative overflow-hidden py-14 md:py-20">
      <div className="mx-auto max-w-5xl px-6">
        <Reveal>
          <div className="relative overflow-hidden rounded-[2rem] bg-gradient-to-br from-[#0b2a5b] via-[#122f63] to-[#1e3a8a] px-6 py-10 text-center text-white shadow-2xl shadow-blue-900/30 md:rounded-[2.5rem] md:px-16 md:py-14">
            {/* Световые пятна на тёмном стекле */}
            <div className="absolute -right-20 -top-20 h-64 w-64 animate-float rounded-full bg-blue-500/30 blur-3xl" />
            <div className="absolute -bottom-24 -left-16 h-64 w-64 animate-float-slow rounded-full bg-indigo-400/25 blur-3xl" />

            <div className="glass-dark relative mx-auto max-w-2xl rounded-[1.75rem] px-6 py-8 md:rounded-[2rem] md:px-8 md:py-12">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-blue-200 md:text-sm">
                Мы готовы поговорить
              </p>

              <h2 className="mt-4 text-2xl font-semibold leading-snug md:text-4xl">
                Давайте обсудим ситуацию вашего близкого
              </h2>

              <p className="mx-auto mt-4 max-w-xl text-sm leading-6 text-blue-100/90 md:mt-5 md:text-base md:leading-7">
                Расскажите нам о ситуации — мы ответим на вопросы и объясним,
                какие варианты могут подойти.
              </p>

              <Link
                href="/register"
                className="mt-7 inline-block w-full rounded-full bg-white px-7 py-4 text-center font-semibold text-brand shadow-[0_10px_30px_rgba(255,255,255,0.25)] transition-all duration-200 hover:-translate-y-0.5 hover:shadow-[0_14px_36px_rgba(255,255,255,0.35)] active:scale-[0.98] sm:w-auto"
              >
                Получить консультацию
              </Link>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
