import Image from "next/image";
import Reveal from "./Reveal";
import SectionHeading from "./SectionHeading";
import SectionFooter from "./SectionFooter";

type SectionProps = {
  /** Переход к следующему блоку — задаётся страницей, а не секцией */
  footer?: { href: string; next: string; hint?: string };
};

const points = [
  "Проживание от 900 ₽/сутки",
  "Питание по рекомендациям Роспотребнадзора",
  "Соцпрограмма для одиноких",
];

export default function About({ footer }: SectionProps) {
  return (
    <section id="about" className="relative py-12 md:py-16">
      <div className="mx-auto max-w-7xl px-6">
        <div className="grid gap-12 md:grid-cols-2 md:items-center">
          <Reveal>
            <div className="glass-strong overflow-hidden rounded-lg p-2">
              <div className="relative aspect-[4/3] overflow-hidden rounded-lg">
                <Image
                  src="/photos/dosug-den-rozhdeniya.jpg"
                  alt="Постояльцы пансионата отмечают день рождения за праздничным столом"
                  fill
                  sizes="(max-width: 768px) 100vw, 50vw"
                  className="object-cover"
                />
              </div>
            </div>
          </Reveal>

          <Reveal delay={150}>
            <SectionHeading
              eyebrow="Немного о нас"
              title="«Народный» — дом, где о близком позаботятся"
              description="Пансионат для пожилых в Нижнем Новгороде: комфортные номера, здоровое питание, медицинское сопровождение и увлекательная атмосфера — всё это входит в стоимость."
            />

            <p className="mt-5 border-l-4 border-brand/50 pl-4 text-lg italic leading-8 text-slate-700">
              Комфорт, забота и внимание — каждый день, а не по расписанию.
            </p>

            <div className="mt-6 space-y-3">
              {points.map((point) => (
                <div
                  key={point}
                  className="glass flex w-fit items-center rounded-lg px-5 py-2.5 transition-all duration-300"
                >
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
