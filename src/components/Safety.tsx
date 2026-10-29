import Image from "next/image";
import Reveal from "./Reveal";
import SectionHeading from "./SectionHeading";
import SectionFooter from "./SectionFooter";

type SectionProps = {
  /** Переход к следующему блоку — задаётся страницей, а не секцией */
  footer?: { href: string; next: string; hint?: string };
};

const items = [
  {
    title: "Медицинское сопровождение",
    text: "Состояние постояльцев под контролем медперсонала — ежедневно.",
  },
  {
    title: "Гигиенические процедуры",
    text: "Индивидуальная гигиена и помощь в самообслуживании.",
  },
  {
    title: "Здоровое питание",
    text: "Меню — согласно рекомендациям Роспотребнадзора, победителя национального проекта «Здоровое питание».",
  },
  {
    title: "Уборка и смена белья",
    text: "Помещения и номера содержатся в чистоте, бельё меняем регулярно.",
  },
];

export default function Safety({ footer }: SectionProps) {
  return (
    <section id="safety" className="section-band relative overflow-hidden py-10 md:py-14">
      <div className="absolute -left-32 bottom-0 h-80 w-80 animate-float-slow rounded-full bg-brand-200/40 blur-3xl" />

      <div className="relative mx-auto max-w-7xl px-6">
        <SectionHeading
          eyebrow="Безопасность и стандарты качества"
          title="Спокойствие родственников тоже важно"
        />

        <div className="mt-10 grid gap-5 md:grid-cols-2 lg:grid-cols-4">
          {items.map((item, index) => (
            <Reveal key={item.title} delay={index * 120}>
              <div className="glass h-full rounded-lg p-7 transition-all duration-300 hover:shadow-[0_16px_40px_rgba(13,36,74,0.13)]">
                <h3 className="text-lg font-semibold text-brand">{item.title}</h3>
                <p className="mt-3 leading-7 text-slate-600">{item.text}</p>
              </div>
            </Reveal>
          ))}
        </div>

        <Reveal className="mt-5" delay={200}>
          <div className="glass flex flex-wrap items-center gap-x-6 gap-y-3 rounded-lg px-7 py-5 text-sm text-slate-600">
            <span className="font-semibold text-brand">Проверки и стандарты:</span>
            <span>Питание одобрено Роспотребнадзором</span>
            <span>Национальный проект «Здоровое питание»</span>
            <a
              href="https://здоровое-питание.рф"
              target="_blank"
              rel="noopener noreferrer"
              className="ml-auto block shrink-0"
              title="Национальный проект «Здоровое питание»"
            >
              <Image
                src="/photos/menu-pitanie.png"
                alt="Значок национального проекта «Здоровое питание»"
                width={174}
                height={42}
                className="h-10 w-auto"
              />
            </a>
          </div>
        </Reveal>

        {footer ? <SectionFooter {...footer} /> : null}
      </div>
    </section>
  );
}
