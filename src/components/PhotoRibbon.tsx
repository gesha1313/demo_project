import Image from "next/image";

/** Фотографии ленты «Жизнь пансионата» (дублируются для бесшовной прокрутки) */
const photos = [
  { src: "/photos/dosug-loto.jpg", alt: "Играем в лото" },
  { src: "/photos/dosug-veranda.jpg", alt: "Прогулка на веранде" },
  { src: "/photos/dosug-den-rozhdeniya.jpg", alt: "Отмечаем день рождения" },
  { src: "/photos/osvyaschenie.jpg", alt: "Отец Сергий освящает пансионат" },
  { src: "/photos/dosug-massazher.jpg", alt: "Массажёры для здоровья" },
  { src: "/photos/glinolechenie.jpg", alt: "Глинолечение от боли" },
  { src: "/photos/dosug-veranda-2.jpg", alt: "Веранда, второй этаж" },
  { src: "/photos/about-pansionat.png", alt: "Пансионат «Народный»" },
];

/**
 * Медленная лента фотографий под hero: живёт на CSS-анимации
 * (translateX -50% по дублированной полосе), останавливается
 * при наведении. Серверный компонент — без JS.
 */
export default function PhotoRibbon() {
  const strip = (duplicate: boolean) => (
    <div className="flex shrink-0 gap-4 pr-4" aria-hidden={duplicate || undefined}>
      {photos.map((photo) => (
        <div
          key={photo.src}
          className="glass relative h-40 w-60 shrink-0 overflow-hidden rounded-lg p-1.5 md:h-48 md:w-72"
        >
          <div className="relative h-full w-full overflow-hidden rounded-lg">
            <Image
              src={photo.src}
              alt={duplicate ? "" : photo.alt}
              fill
              sizes="300px"
              className="object-cover"
            />
          </div>
        </div>
      ))}
    </div>
  );

  return (
    <section
      aria-label="Жизнь пансионата — фотографии"
      className="photo-ribbon relative overflow-hidden py-6"
    >
      <div className="photo-ribbon-track flex w-max">
        {strip(false)}
        {strip(true)}
      </div>
    </section>
  );
}
