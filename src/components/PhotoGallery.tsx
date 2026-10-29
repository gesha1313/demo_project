"use client";

import Image from "next/image";
import { useCallback, useEffect, useState } from "react";
import Reveal from "./Reveal";

/** Галерея «Немного о нас»: сетка фото + лайтбокс с листанием */
const photos = [
  { src: "/photos/dosug-loto.jpg", caption: "Играем в лото" },
  { src: "/photos/dosug-massazher.jpg", caption: "Массажёры для здоровья" },
  { src: "/photos/dosug-den-rozhdeniya.jpg", caption: "Отмечаем день рождения" },
  { src: "/photos/osvyaschenie.jpg", caption: "Отец Сергий освящает пансионат" },
  { src: "/photos/dosug-veranda.jpg", caption: "Гуляем на веранде" },
  { src: "/photos/glinolechenie.jpg", caption: "Глинолечение от боли" },
  { src: "/photos/dosug-veranda-2.jpg", caption: "Веранда, второй этаж" },
];

export default function PhotoGallery() {
  const [open, setOpen] = useState<number | null>(null);

  const close = useCallback(() => setOpen(null), []);
  const show = useCallback(
    (delta: number) =>
      setOpen((current) =>
        current === null ? current : (current + delta + photos.length) % photos.length,
      ),
    [],
  );

  // Клавиатура и блокировка прокрутки страницы, пока открыт лайтбокс
  useEffect(() => {
    if (open === null) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") close();
      if (event.key === "ArrowRight") show(1);
      if (event.key === "ArrowLeft") show(-1);
    };
    document.addEventListener("keydown", onKey);
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = previousOverflow;
    };
  }, [open, close, show]);

  const current = open === null ? null : photos[open];

  return (
    <>
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
        {photos.map((photo, index) => (
          <Reveal key={photo.src} delay={index * 80}>
            <button
              type="button"
              onClick={() => setOpen(index)}
              className="glass-strong block h-full w-full overflow-hidden rounded-lg p-2 text-left transition-all duration-300 hover:shadow-[0_16px_40px_rgba(13,36,74,0.13)]"
              aria-label={`Открыть фото: ${photo.caption}`}
            >
              <div className="relative aspect-[4/3] overflow-hidden rounded-lg">
                <Image
                  src={photo.src}
                  alt={photo.caption}
                  fill
                  sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                  className="object-cover"
                />
              </div>
              <span className="block px-1.5 pb-1 pt-2.5 text-xs font-medium text-slate-700">
                {photo.caption}
              </span>
            </button>
          </Reveal>
        ))}
      </div>

      {current ? (
        <div
          className="fixed inset-0 z-[70] flex items-center justify-center bg-brand-dark/90 p-4"
          role="dialog"
          aria-modal="true"
          aria-label={`Фото: ${current.caption}`}
          onClick={close}
        >
          <button
            type="button"
            onClick={close}
            aria-label="Закрыть"
            className="absolute right-4 top-4 flex h-11 w-11 items-center justify-center rounded-lg border border-white/30 text-xl text-white transition-colors hover:bg-white/10"
          >
            ×
          </button>

          <button
            type="button"
            onClick={(event) => {
              event.stopPropagation();
              show(-1);
            }}
            aria-label="Предыдущее фото"
            className="absolute left-2 top-1/2 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-lg border border-white/30 text-xl text-white transition-colors hover:bg-white/10 md:left-6"
          >
            ‹
          </button>

          <figure
            className="w-full max-w-3xl"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="relative mx-auto aspect-[4/3] w-full overflow-hidden rounded-lg bg-black/30">
              <Image
                src={current.src}
                alt={current.caption}
                fill
                sizes="(max-width: 768px) 100vw, 768px"
                className="object-contain"
                priority
              />
            </div>
            <figcaption className="mt-3 text-center text-sm font-medium text-white">
              {current.caption}
              <span className="ml-2 text-white/60">
                {(open ?? 0) + 1} / {photos.length}
              </span>
            </figcaption>
          </figure>

          <button
            type="button"
            onClick={(event) => {
              event.stopPropagation();
              show(1);
            }}
            aria-label="Следующее фото"
            className="absolute right-2 top-1/2 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-lg border border-white/30 text-xl text-white transition-colors hover:bg-white/10 md:right-6"
          >
            ›
          </button>
        </div>
      ) : null}
    </>
  );
}
