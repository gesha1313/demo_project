import Link from "next/link";
import Reveal from "./Reveal";

export default function CtaSection() {
  return (
    <section className="relative overflow-hidden py-12 md:py-16">
      <div className="mx-auto max-w-5xl px-6">
        <Reveal>
          <div className="relative overflow-hidden rounded-lg bg-brand-dark px-6 py-10 text-center text-white shadow-lg md:px-16 md:py-14">
            {/* Световые пятна на тёмном стекле */}
            <div className="absolute -right-20 -top-20 h-64 w-64 animate-float rounded-full bg-brand/30 blur-3xl" />
            <div className="absolute -bottom-24 -left-16 h-64 w-64 animate-float-slow rounded-full bg-brand-300/25 blur-3xl" />

            <div className="relative mx-auto max-w-2xl">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-white/80">
                Мы готовы поговорить
              </p>

              <h2 className="mt-4 text-2xl font-semibold leading-snug text-white md:text-3xl">
                Давайте обсудим ситуацию вашего близкого
              </h2>

              <p className="mx-auto mt-4 max-w-xl text-sm leading-6 text-slate-100 md:text-base md:leading-7">
                Расскажите нам о ситуации — мы ответим на вопросы и объясним,
                какие варианты могут подойти.
              </p>

              <Link
                href="/register"
                className="btn-glass-primary mt-7 inline-block w-full rounded-lg px-7 py-4 text-center font-semibold sm:w-auto"
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
