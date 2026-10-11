/**
 * Загрузчик JS API Яндекс.Карт (общий для всех карт сайта).
 * Скрипт подключается один раз; промис кешируется на window.
 */

const API_KEY = process.env.NEXT_PUBLIC_YANDEX_MAPS_API_KEY;

/** Границы города Нижний Новгород (чуть внутри административных) */
export const NN_BOUNDS = {
  latMin: 56.205,
  latMax: 56.345,
  lonMin: 43.73,
  lonMax: 44.07,
};

export const NN_CENTER: [number, number] = [56.326885, 44.005986];

export type Placemark = {
  properties: { set: (key: string, value: string) => void };
};

export type YmapsApi = {
  ready: (cb: () => void) => void;
  Map: new (
    el: HTMLElement,
    state: unknown,
    options?: unknown,
  ) => {
    geoObjects: { removeAll: () => void; add: (obj: unknown) => void };
    setCenter: (coords: [number, number], zoom?: number, opts?: unknown) => void;
    destroy: () => void;
  };
  Placemark: new (coords: [number, number], props: unknown, options: unknown) => Placemark;
};

declare global {
  interface Window {
    ymaps?: YmapsApi;
    __ymapsReady?: Promise<YmapsApi>;
  }
}

export function loadYmaps(): Promise<YmapsApi> {
  if (window.__ymapsReady) return window.__ymapsReady;

  window.__ymapsReady = new Promise<YmapsApi>((resolve, reject) => {
    if (window.ymaps) {
      window.ymaps.ready(() => resolve(window.ymaps!));
      return;
    }

    const script = document.createElement("script");
    script.src = `https://api-maps.yandex.ru/2.1/?lang=ru_RU${API_KEY ? `&apikey=${API_KEY}` : ""}`;
    script.async = true;

    script.addEventListener("load", () => {
      window.ymaps?.ready(() => {
        if (window.ymaps) resolve(window.ymaps);
        else reject(new Error("ymaps is undefined"));
      });
    });
    script.addEventListener("error", () => reject(new Error("Не удалось загрузить Яндекс.Карты")));

    document.head.appendChild(script);
  });

  return window.__ymapsReady;
}

/** Случайная точка в пределах Нижнего Новгорода */
export const randomNNPoint = (): [number, number] => [
  NN_BOUNDS.latMin + Math.random() * (NN_BOUNDS.latMax - NN_BOUNDS.latMin),
  NN_BOUNDS.lonMin + Math.random() * (NN_BOUNDS.lonMax - NN_BOUNDS.lonMin),
];
