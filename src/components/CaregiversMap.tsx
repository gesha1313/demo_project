"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Reveal from "./Reveal";
import SectionHeading from "./SectionHeading";

/**
 * Карта свободных сиделок (JS API Яндекс.Карт):
 *  — 5 красных меток в пределах Нижнего Новгорода;
 *  — метки переезжают на новые случайные точки каждые 5 минут;
 *  — в балуне — ближайший адрес (обратное геокодирование).
 *
 * Ключ берётся из NEXT_PUBLIC_YANDEX_MAPS_API_KEY (.env.local).
 * Без ключа API загружается в демо-режиме; если Яндекс откажет —
 * показываем аккуратную заглушку с инструкцией.
 */

const API_KEY = process.env.NEXT_PUBLIC_YANDEX_MAPS_API_KEY;

/** Границы города Нижний Новгород (чуть внутри административных, для надёжности) */
const NN_BOUNDS = {
  latMin: 56.205,
  latMax: 56.345,
  lonMin: 43.73,
  lonMax: 44.07,
};

const NN_CENTER: [number, number] = [56.326885, 44.005986];
const MARKERS_COUNT = 5;
const REFRESH_INTERVAL_MS = 5 * 60 * 1000;

type Placemark = {
  setGeometry: (coords: [number, number]) => void;
  properties: { set: (key: string, value: string) => void };
};

type YmapsApi = {
  ready: (cb: () => void) => void;
  Map: new (el: HTMLElement, state: unknown, options?: unknown) => {
    geoObjects: { removeAll: () => void; add: (obj: unknown) => void };
    destroy: () => void;
  };
  Placemark: new (coords: [number, number], props: unknown, options: unknown) => Placemark;
  geocode: (coords: [number, number], opts?: unknown) => Promise<{
    geoObjects: { get: (i: number) => { getAddressLine: () => string } | undefined };
  }>;
};

declare global {
  interface Window {
    ymaps?: YmapsApi;
  }
}

/** Однократная загрузка скрипта JS API с промисом. */
function loadYmaps(): Promise<YmapsApi> {
  if (window.ymaps) {
    return Promise.resolve(window.ymaps);
  }

  const existing = document.querySelector<HTMLScriptElement>("script[data-ymaps]");
  const script = existing ?? document.createElement("script");

  const ready = new Promise<YmapsApi>((resolve, reject) => {
    script.addEventListener("load", () => {
      window.ymaps?.ready(() => {
        if (window.ymaps) resolve(window.ymaps);
        else reject(new Error("ymaps is undefined"));
      });
    });
    script.addEventListener("error", () => reject(new Error("Не удалось загрузить Яндекс.Карты")));
  });

  if (!existing) {
    script.src = `https://api-maps.yandex.ru/2.1/?lang=ru_RU${API_KEY ? `&apikey=${API_KEY}` : ""}`;
    script.async = true;
    script.dataset.ymaps = "true";
    document.head.appendChild(script);
  }

  return ready;
}

const randomPoint = (): [number, number] => [
  NN_BOUNDS.latMin + Math.random() * (NN_BOUNDS.latMax - NN_BOUNDS.latMin),
  NN_BOUNDS.lonMin + Math.random() * (NN_BOUNDS.lonMax - NN_BOUNDS.lonMin),
];

const formatTime = (date: Date) =>
  date.toLocaleTimeString("ru-RU", { hour: "2-digit", minute: "2-digit" });

export default function CaregiversMap() {
  const mapNodeRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<InstanceType<YmapsApi["Map"]> | null>(null);
  const ymapsRef = useRef<YmapsApi | null>(null);
  const [status, setStatus] = useState<"loading" | "ok" | "error">("loading");
  const [updatedAt, setUpdatedAt] = useState<Date | null>(null);

  /** Расставляет метки заново: 5 случайных точек с обратным геокодированием. */
  const placeMarkers = useCallback(() => {
    const ymaps = ymapsRef.current;
    const map = mapRef.current;
    if (!ymaps || !map) return;

    map.geoObjects.removeAll();
    const now = new Date();
    setUpdatedAt(now);

    for (let i = 0; i < MARKERS_COUNT; i += 1) {
      const coords = randomPoint();

      const placemark = new ymaps.Placemark(
        coords,
        {
          balloonContent:
            "<strong>Свободная сиделка</strong><br/>Определяем ближайший адрес…",
        },
        { preset: "islands#redDotIcon" },
      );
      map.geoObjects.add(placemark);

      // Адрес в балуне — необязательное украшение: без ключа геокодер
      // может быть недоступен, тогда остаётся текст по умолчанию
      ymaps
        .geocode(coords, { results: 1 })
        .then((result) => {
          const first = result.geoObjects.get(0);
          const address = first?.getAddressLine();
          if (address) {
            placemark.properties.set(
              "balloonContent",
              `<strong>Свободная сиделка</strong><br/>${address}<br/>` +
                `<span style="color:#64748b">Метка сменится через 5 минут</span>`,
            );
          }
        })
        .catch(() => {
          // адрес не получили — балун остаётся без адреса, это не ошибка
        });
    }
  }, []);

  useEffect(() => {
    let destroyed = false;
    let timer = 0;

    loadYmaps()
      .then((ymaps) => {
        if (destroyed || !mapNodeRef.current) return;
        ymapsRef.current = ymaps;

        mapRef.current = new ymaps.Map(
          mapNodeRef.current,
          {
            center: NN_CENTER,
            zoom: 12,
            controls: ["zoomControl", "typeSelector"],
          },
          { suppressMapOpenBlock: true },
        );

        placeMarkers();
        setStatus("ok");

        timer = window.setInterval(placeMarkers, REFRESH_INTERVAL_MS);
      })
      .catch(() => {
        if (!destroyed) setStatus("error");
      });

    return () => {
      destroyed = true;
      window.clearInterval(timer);
      mapRef.current?.destroy();
      mapRef.current = null;
    };
  }, [placeMarkers]);

  return (
    <section id="caregivers-map" className="relative overflow-hidden py-14 md:py-20">
      <div className="absolute -left-32 bottom-0 h-80 w-80 animate-float-slow rounded-full bg-blue-200/40 blur-3xl" />

      <div className="relative mx-auto max-w-7xl px-6">
        <SectionHeading
          eyebrow="Карта"
          title="Свободные сиделки рядом"
          description="Пять сотрудников сейчас свободны в своих округах Нижнего Новгорода. Красные метки показывают районы — список обновляется каждые 5 минут."
        />

        <Reveal className="mt-10" delay={120}>
          <div className="glass-strong overflow-hidden rounded-[2rem] p-2">
            {status === "error" ? (
              <div className="flex aspect-[16/9] max-h-[460px] flex-col items-center justify-center rounded-[1.7rem] bg-gradient-to-br from-slate-100 to-blue-50 px-6 text-center">
                <span className="icon-glow glass-strong flex h-14 w-14 items-center justify-center rounded-2xl text-2xl text-blue-700">
                  🗺
                </span>
                <p className="mt-4 max-w-md text-sm leading-6 text-slate-600">
                  Карта Яндекс не загрузилась. Добавьте ключ API в файл{" "}
                  <code className="rounded bg-white/70 px-1.5 py-0.5 text-brand">
                    .env.local
                  </code>
                  :
                  <br />
                  <code className="rounded bg-white/70 px-1.5 py-0.5 text-brand">
                    NEXT_PUBLIC_YANDEX_MAPS_API_KEY=ваш_ключ
                  </code>
                  <br />
                  Ключ бесплатный —{" "}
                  <a
                    href="https://developer.tech.yandex.ru/services/"
                    target="_blank"
                    rel="noreferrer"
                    className="font-semibold text-blue-700 hover:text-blue-800"
                  >
                    developer.tech.yandex.ru
                  </a>{" "}
                  («JavaScript API и HTTP Геокодер»), затем перезапустите сервер.
                </p>
              </div>
            ) : (
              <div
                ref={mapNodeRef}
                className="h-[420px] w-full overflow-hidden rounded-[1.7rem] bg-slate-200"
              />
            )}
          </div>
        </Reveal>

        <p className="mt-4 text-center text-sm text-slate-500">
          {status === "ok" && updatedAt
            ? `Метки обновлены в ${formatTime(updatedAt)} · следующее обновление через 5 минут`
            : "Метки показывают округа, где сейчас свободны сиделки"}
        </p>
      </div>
    </section>
  );
}
