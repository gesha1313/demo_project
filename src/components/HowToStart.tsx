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
    title: "Расскажите о ситуации",
    text: "Коротко обсудим состояние и потребности человека.",
  },
  {
    number: "02",
    title: "Подберём вариант",
    text: "Объясним доступные форматы и условия.",
  },
  {
    number: "03",
    title: "Ответим на вопросы",
    text: "Вы сможете спокойно принять решение.",
  },
];

export default function HowToStart({ footer }: SectionProps) {
  return (
    <section id="how" className="relative py-14 md:py-20">
      <div className="mx-auto max-w-7xl px-6">
        <div className="grid gap-12 md:grid-cols-2 md:items-center">
          <Reveal>
            <SectionHeading
              eyebrow="Как начать"
              title="Всё начинается с разговора"
              description="Расскажите нам о ситуации вашего близкого. Мы зададим необходимые вопросы и поможем подобрать подходящий вариант."
            />

            <div className="mt-7 animate-fade-up [animation-delay:300ms]">
              <Link
                href="/register"
                className="btn-glass-primary inline-block rounded-full px-7 py-4 font-semibold"
              >
                Получить консультацию
              </Link>
            </div>
          </Reveal>

          <div className="space-y-4">
            {steps.map((step, index) => (
              <Reveal key={step.number} delay={index * 120}>
                <div className="glass flex gap-5 rounded-2xl p-6 transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_16px_40px_rgba(13,36,74,0.13)]">
                  <div
                    className={`glass-strong icon-glow ${index === 1 ? "icon-glow-delay-1" : index === 2 ? "icon-glow-delay-2" : ""} flex h-11 w-11 shrink-0 items-center justify-center rounded-full text-sm font-semibold text-blue-700`}
                  >
                    {step.number}
                  </div>

                  <div>
                    <h3 className="font-semibold text-brand">{step.title}</h3>
                    <p className="mt-1 text-sm leading-6 text-slate-500">{step.text}</p>
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
