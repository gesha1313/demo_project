import Link from "next/link";
import Reveal from "./Reveal";

export default function CtaSection() {
  return (
    <section className="relative overflow-hidden py-10 md:py-14">
      <div className="mx-auto max-w-5xl px-6">
        <Reveal>
          <div className="relative overflow-hidden rounded-xl bg-gradient-to-br from-[#4a7ba6] via-[#3f6f9f] to-[#2f5578] px-6 py-10 text-center text-white shadow-2xl shadow-sky-900/30 md:rounded-[2.5rem] md:px-16 md:py-14">
            {/* Световые пятна на тёмном стекле */}
            <div className="absolute -right-20 -top-20 h-64 w-64 animate-float rounded-full bg-sky-500/30 blur-3xl" />
            <div className="absolute -bottom-24 -left-16 h-64 w-64 animate-float-slow rounded-full bg-amber-400/25 blur-3xl" />

            <div className="glass-dark relative mx-auto max-w-2xl rounded-xl px-6 py-8 md:rounded-xl md:px-8 md:py-12">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-sky-200 md:text-sm">
                Мы готовы поговорить
              </p>

              <h2 className="mt-4 text-2xl font-semibold leading-snug md:text-4xl">
                Давайте обсудим ситуацию вашего близкого
              </h2>

              <p className="mx-auto mt-4 max-w-xl text-sm leading-6 text-slate-100 md:mt-5 md:text-base md:leading-7">
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
