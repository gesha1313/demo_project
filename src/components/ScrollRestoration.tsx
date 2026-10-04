"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";

const STORAGE_KEY = "patronage:scroll";

/**
 * Скролл-менеджер сайта:
 *
 *  — обновление страницы (F5): позиция восстанавливается инлайн-скриптом
 *    из layout.tsx — он срабатывает до гидратации, страница не мигает;
 *  — переход на новую страницу: прокрутка всегда мгновенно возвращается
 *    к вершине (иначе из-за scroll-behavior: smooth она «летит» со старой
 *    позиции);
 *  — назад/вперёд (кнопки браузера): не трогаем — позиции восстанавливает
 *    сам Next.js из своей истории.
 */
export default function ScrollRestoration() {
  const pathname = usePathname();
  const isFirstRender = useRef(true);
  const isPopState = useRef(false);

  // Помечаем переходы назад/вперёд, чтобы не перекрывать их скроллом к вершине
  useEffect(() => {
    const onPopState = () => {
      isPopState.current = true;
    };
    window.addEventListener("popstate", onPopState);
    return () => window.removeEventListener("popstate", onPopState);
  }, []);

  // Новая страница — всегда с вершины
  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }
    if (isPopState.current) {
      isPopState.current = false;
      return;
    }
    window.scrollTo({ top: 0, behavior: "instant" });
  }, [pathname]);

  // Сохраняем позицию каждой страницы для восстановления после F5
  useEffect(() => {
    let frame = 0;

    const save = () => {
      const key = `${STORAGE_KEY}:${window.location.pathname}`;
      try {
        sessionStorage.setItem(key, String(window.scrollY));
      } catch {
        // Приватный режим браузера — просто не сохраняем
      }
    };

    // Сохраняем на каждом кадре скролла и при уходе со страницы
    const onScroll = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(save);
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("pagehide", save);

    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("pagehide", save);
    };
  }, []);

  return null;
}
