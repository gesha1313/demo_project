import Link from "next/link";
import Reveal from "./Reveal";
import SectionHeading from "./SectionHeading";
import SectionFooter from "./SectionFooter";

export default function Pricing() {
  return (
    <section id="pricing" className="section-band relative overflow-hidden py-14 md:py-20">
      <div className="absolute -right-32 top-16 h-80 w-80 animate-float rounded-full bg-blue-200/40 blur-3xl" />

      <div className="relative mx-auto max-w-7xl px-6">
        <SectionHeading
          eyebrow="Стоимость"
          title="Условия и стоимость"
          description="Здесь будут реальные тарифы и подробное описание того, что входит в стоимость."
        />

        <Reveal className="mt-10" delay={150}>
          <div className="glass-strong flex flex-col gap-6 rounded-[2rem] p-8 transition-all duration-300 hover:shadow-[0_18px_48px_rgba(13,36,74,0.15)] md:flex-row md:items-center md:justify-between">
            <div>
              <h3 className="text-xl font-semibold text-brand">Индивидуальный расчёт</h3>
              <p className="mt-2 text-slate-500">
                Стоимость зависит от выбранного формата и потребностей.
              </p>
            </div>

            <div className="flex flex-col gap-4 sm:flex-row">
              <Link
                href="/register"
                className="btn-glass-primary rounded-full px-7 py-4 text-center font-semibold"
              >
                Узнать стоимость
              </Link>

              <Link
                href="/rooms"
                className="btn-glass-ghost rounded-full px-7 py-4 text-center font-semibold"
              >
                Номера и тарифы
              </Link>
            </div>
          </div>
        </Reveal>

        <SectionFooter
          href="#faq"
          next="Частые вопросы"
          hint="Короткие ответы о первом обращении, питании и связи"
        />
      </div>
    </section>
  );
}
