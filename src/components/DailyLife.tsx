import Image from "next/image";
import Reveal from "./Reveal";
import SectionHeading from "./SectionHeading";
import SectionFooter from "./SectionFooter";

type SectionProps = {
  /** Переход к следующему блоку — задаётся страницей, а не секцией */
  footer?: { href: string; next: string; hint?: string };
};

const partsOfDay = [
  {
    time: "Утро",
    title: "Спокойное начало дня",
    text: "Завтрак, привычный распорядок и помощь в тех вещах, которые человеку сложно выполнять самостоятельно.",
  },
  {
    time: "Днём",
    title: "Общение и занятия",
    text: "Общение, отдых, прогулки и другие занятия в зависимости от возможностей и привычек человека.",
  },
  {
    time: "Вечером",
    title: "Тишина и отдых",
    text: "Спокойная атмосфера, привычный ритм и возможность провести вечер без спешки.",
  },
];

export default function DailyLife({ footer }: SectionProps) {
  return (
    <section id="life" className="relative py-14 md:py-20">
      <div className="mx-auto max-w-7xl px-6">
        <SectionHeading
          eyebrow="Обычный день"
          title="Здесь живут, а не просто получают уход"
          description="Нам важно, чтобы каждый день состоял не только из необходимых процедур, но и из привычных вещей: общения, отдыха, прогулок и ощущения домашнего пространства."
        />

        {/* Большая фотография */}
        <Reveal className="mt-10" delay={150}>
          <div className="glass-strong overflow-hidden rounded-[2rem] p-2 transition-shadow duration-300 hover:shadow-[0_18px_48px_rgba(13,36,74,0.15)]">
            <div className="relative aspect-[16/7] overflow-hidden rounded-[1.7rem]">
              <Image
                src="/photos/life.jpg"
                alt="Общая зона пансионата: занятия и общение постояльцев при дневном свете"
                fill
                sizes="(max-width: 768px) 100vw, 1200px"
                className="object-cover"
              />
            </div>
          </div>
        </Reveal>

        {/* Сценарии дня */}
        <div className="mt-5 grid gap-5 md:grid-cols-3">
          {partsOfDay.map((part, index) => (
            <Reveal key={part.time} delay={index * 120}>
              <div className="glass h-full rounded-3xl p-7 transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_16px_40px_rgba(13,36,74,0.13)]">
                <span className="inline-block rounded-full bg-blue-100/80 px-3 py-1 text-xs font-semibold text-blue-700">
                  {part.time}
                </span>
                <h3 className="mt-4 text-xl font-semibold text-brand">{part.title}</h3>
                <p className="mt-3 leading-7 text-slate-600">{part.text}</p>
              </div>
            </Reveal>
          ))}
        </div>

        {footer ? <SectionFooter {...footer} /> : null}
      </div>
    </section>
  );
}
