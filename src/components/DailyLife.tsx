import Image from "next/image";
import Reveal from "./Reveal";
import SectionHeading from "./SectionHeading";
import SectionFooter from "./SectionFooter";
import PhotoGallery from "./PhotoGallery";

type SectionProps = {
  /** Переход к следующему блоку — задаётся страницей, а не секцией */
  footer?: { href: string; next: string; hint?: string };
};

const partsOfDay = [
  {
    time: "Игры",
    title: "Лото и развлечения",
    text: "Играем в лото, устраиваем игры и развлечения, музыкальный час и смехотерапию.",
  },
  {
    time: "Здоровье",
    title: "Тренажёры и массаж",
    text: "Восстановительные тренажёры, массажное оборудование и ЛФК — для подвижности и хорошего самочувствия.",
  },
  {
    time: "Прогулки",
    title: "Свежий воздух",
    text: "Гуляем на веранде и территории пансионата — в хорошую погоду каждый день.",
  },
];

export default function DailyLife({ footer }: SectionProps) {
  return (
    <section id="life" className="relative py-12 md:py-16">
      <div className="mx-auto max-w-7xl px-6">
        <SectionHeading
          eyebrow="Как устроен наш день"
          title="Здесь живут, а не просто получают уход"
          description="Восстановительные тренажёры, массажное оборудование, музыкальный час, прогулки, ЛФК, игры и развлечения — все досуговые мероприятия входят в стоимость проживания."
        />

        {/* Большая фотография */}
        <Reveal className="mt-10" delay={150}>
          <div className="glass-strong overflow-hidden rounded-lg p-2 transition-shadow duration-300 hover:shadow-[0_18px_48px_rgba(13,36,74,0.15)]">
            <div className="relative aspect-[16/7] overflow-hidden rounded-lg">
              <Image
                src="/photos/dosug-veranda.jpg"
                alt="Постояльцы пансионата на прогулке у веранды"
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
              <div className="glass h-full rounded-lg p-6 transition-all duration-300 hover:shadow-[0_16px_40px_rgba(13,36,74,0.13)]">
                <span className="inline-block rounded-full bg-brand-100/80 px-3 py-1 text-xs font-semibold text-brand">
                  {part.time}
                </span>
                <h3 className="mt-4 text-lg font-semibold text-brand">{part.title}</h3>
                <p className="mt-3 text-base leading-7 text-slate-600">{part.text}</p>
              </div>
            </Reveal>
          ))}
        </div>

        {/* Фотогалерея «Немного о нас» с лайтбоксом */}
        <div className="mt-12">
          <PhotoGallery />
        </div>

        {footer ? <SectionFooter {...footer} /> : null}
      </div>
    </section>
  );
}
