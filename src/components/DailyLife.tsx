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

/** Фотогалерея «Немного о нас» с подписями с сайта пансионата */
const gallery = [
  { src: "/photos/dosug-loto.jpg", caption: "Играем в лото" },
  { src: "/photos/dosug-massazher.jpg", caption: "Массажёры для здоровья" },
  { src: "/photos/dosug-den-rozhdeniya.jpg", caption: "Отмечаем день рождения" },
  { src: "/photos/osvyaschenie.jpg", caption: "Отец Сергий освящает пансионат" },
  { src: "/photos/dosug-veranda.jpg", caption: "Гуляем на веранде" },
  { src: "/photos/glinolechenie.jpg", caption: "Глинолечение от боли" },
  { src: "/photos/dosug-veranda-2.jpg", caption: "Веранда, второй этаж" },
];

export default function DailyLife({ footer }: SectionProps) {
  return (
    <section id="life" className="relative py-10 md:py-14">
      <div className="mx-auto max-w-7xl px-6">
        <SectionHeading
          eyebrow="Наш досуг"
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
              <div className="glass h-full rounded-lg p-7 transition-all duration-300 hover:shadow-[0_16px_40px_rgba(13,36,74,0.13)]">
                <span className="inline-block rounded-full bg-brand-100/80 px-3 py-1 text-xs font-semibold text-brand">
                  {part.time}
                </span>
                <h3 className="mt-4 text-xl font-semibold text-brand">{part.title}</h3>
                <p className="mt-3 leading-7 text-slate-600">{part.text}</p>
              </div>
            </Reveal>
          ))}
        </div>

        {/* Фотогалерея «Немного о нас» */}
        <div className="mt-12 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
          {gallery.map((photo, index) => (
            <Reveal key={photo.src} delay={index * 80}>
              <figure className="glass-strong h-full overflow-hidden rounded-lg p-2">
                <div className="relative aspect-[4/3] overflow-hidden rounded-lg">
                  <Image
                    src={photo.src}
                    alt={photo.caption}
                    fill
                    sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                    className="object-cover"
                  />
                </div>
                <figcaption className="px-1.5 pb-1 pt-2.5 text-xs font-medium text-slate-700">
                  {photo.caption}
                </figcaption>
              </figure>
            </Reveal>
          ))}

          {/* Видео: танцы в 101 год */}
          <Reveal delay={560}>
            <a
              href="https://youtube.com/shorts/gDwIBg29Avc"
              target="_blank"
              rel="noopener noreferrer"
              className="glass-strong group relative block h-full overflow-hidden rounded-lg p-2"
            >
              <div className="relative aspect-[4/3] overflow-hidden rounded-lg">
                <Image
                  src="/photos/tancy-101.png"
                  alt="Постоялица пансионата танцует в 101 год"
                  fill
                  sizes="(max-width: 640px) 50vw, 25vw"
                  className="object-cover"
                />
                <span className="absolute inset-0 flex items-center justify-center bg-brand-dark/25">
                  <span className="flex h-12 w-12 items-center justify-center rounded-lg bg-white/90 text-xl text-brand">
                    ▶
                  </span>
                </span>
              </div>
              <span className="block px-1.5 pb-1 pt-2.5 text-xs font-medium text-brand group-hover:underline">
                Танцы в 101 год — видео
              </span>
            </a>
          </Reveal>
        </div>

        {footer ? <SectionFooter {...footer} /> : null}
      </div>
    </section>
  );
}
