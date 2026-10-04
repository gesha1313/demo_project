import Image from "next/image";
import Reveal from "./Reveal";
import SectionHeading from "./SectionHeading";
import SectionFooter from "./SectionFooter";

type SectionProps = {
  /** Переход к следующему блоку — задаётся страницей, а не секцией */
  footer?: { href: string; next: string; hint?: string };
};

const points = ["Опытные сотрудники", "Понятные правила работы", "Индивидуальное отношение"];

export default function About({ footer }: SectionProps) {
  return (
    <section id="about" className="relative py-14 md:py-20">
      <div className="mx-auto max-w-7xl px-6">
        <div className="grid gap-12 md:grid-cols-2 md:items-center">
          <Reveal>
            <div className="glass-strong overflow-hidden rounded-[2rem] p-2">
              <div className="relative aspect-[4/3] overflow-hidden rounded-[1.7rem]">
                <Image
                  src="/photos/about.jpg"
                  alt="Сотрудница пансионата рядом с постоялицей — тёплый момент заботы"
                  fill
                  sizes="(max-width: 768px) 100vw, 50vw"
                  className="object-cover"
                />
              </div>
            </div>
          </Reveal>

          <Reveal delay={150}>
            <SectionHeading
              eyebrow="О компании"
              title="За заботой стоят конкретные люди"
              description="Здесь мы расскажем о команде, опыте сотрудников, принципах работы и о том, почему нам можно доверить заботу о близком человеке."
            />

            <div className="mt-6 space-y-3">
              {points.map((point) => (
                <div
                  key={point}
                  className="glass flex w-fit items-center gap-3 rounded-full py-2 pl-2 pr-5 transition-all duration-300 hover:translate-x-1"
                >
                  <div className="glass-strong icon-glow flex h-8 w-8 items-center justify-center rounded-full text-blue-700">
                    ✓
                  </div>
                  <span className="text-sm text-slate-700">{point}</span>
                </div>
              ))}
            </div>
          </Reveal>
        </div>

        {footer ? <SectionFooter {...footer} /> : null}
      </div>
    </section>
  );
}
