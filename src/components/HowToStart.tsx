import Link from "next/link";
import Reveal from "./Reveal";
import SectionHeading from "./SectionHeading";
import SectionFooter from "./SectionFooter";

type SectionProps = {
  /** Переход к следующему блоку — задаётся страницей, а не секцией */
  footer?: { href: string; next: string; hint?: string };
};

const steps = [
  {
    number: "01",
    title: "Позвонить нам",
    text: "Ответим на вопросы и договоримся об экскурсии.",
  },
  {
    number: "02",
    title: "Приехать на экскурсию",
    text: "Покажем пансионат: номера, столовую, веранду, досуг.",
  },
  {
    number: "03",
    title: "Заключить договор",
    text: "Все условия фиксируем в договоре — без устных обещаний.",
  },
  {
    number: "04",
    title: "Заселиться",
    text: "Можем организовать трансфер до пансионата.",
  },
];

const documents = [
  "Паспорт РФ",
  "Медицинский полис",
  "Страховое свидетельство (СНИЛС)",
  "Выписка из медучреждения (если есть)",
];

export default function HowToStart({ footer }: SectionProps) {
  return (
    <section id="how" className="relative py-12 md:py-16">
      <div className="mx-auto max-w-7xl px-6">
        <div className="grid gap-12 md:grid-cols-2 md:items-center">
          <Reveal>
            <SectionHeading
              eyebrow="Как заселиться"
              title="Четыре простых шага"
              description="Звоните — будем рады показать и рассказать о пансионате. При желании организуем трансфер."
            />

            <div className="mt-7 animate-fade-up [animation-delay:300ms]">
              <Link
                href="#contacts"
                className="btn-glass-primary inline-block rounded-lg px-7 py-4 font-semibold"
              >
                Связаться с нами
              </Link>
            </div>

            {/* Документы для заселения */}
            <div className="glass mt-7 rounded-lg p-6">
              <h3 className="font-semibold text-brand">Какие нужны документы</h3>
              <ul className="mt-3 space-y-2 text-sm text-slate-700">
                {documents.map((doc) => (
                  <li key={doc} className="flex gap-2">
                    <span className="mt-0.5 text-brand">✓</span>
                    {doc}
                  </li>
                ))}
              </ul>
            </div>
          </Reveal>

          <div className="space-y-4">
            {steps.map((step, index) => (
              <Reveal key={step.number} delay={index * 120}>
                <div className="glass flex gap-5 rounded-lg p-6 transition-all duration-300 hover:shadow-[0_16px_40px_rgba(13,36,74,0.13)]">
                  <div
                    className={`bg-brand-100/70 ${index === 1 ? "icon-glow-delay-1" : index === 2 ? "icon-glow-delay-2" : index === 3 ? "icon-glow-delay-3" : ""} flex h-11 w-11 shrink-0 items-center justify-center rounded-lg text-sm font-semibold text-brand`}
                  >
                    {step.number}
                  </div>

                  <div>
                    <h3 className="font-semibold text-brand">{step.title}</h3>
                    <p className="mt-1 text-sm leading-6 text-slate-700">{step.text}</p>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>

        {footer ? <SectionFooter {...footer} /> : null}
      </div>
    </section>
  );
}
