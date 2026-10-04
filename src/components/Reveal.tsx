"use client";

import { useEffect, useRef, type ReactNode } from "react";

type RevealProps = {
  children: ReactNode;
  className?: string;
  /** Задержка появления в миллисекундах — для эффекта каскада */
  delay?: number;
};

const HIDDEN_CLASSES = ["translate-y-8", "opacity-0"];
const VISIBLE_CLASSES = ["translate-y-0", "opacity-100"];

/**
 * Плавное появление блока при попадании в область просмотра.
 * Классы переключаются напрямую на DOM-элементе, без состояния React —
 * начальный HTML одинаков на сервере и клиенте, гидратация проходит
 * без расхождений.
 */
export default function Reveal({ children, className = "", delay = 0 }: RevealProps) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const show = () => {
      el.classList.remove(...HIDDEN_CLASSES);
      el.classList.add(...VISIBLE_CLASSES);
    };

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      show();
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          show();
          observer.disconnect();
        }
      },
      { threshold: 0.15, rootMargin: "0px 0px -40px 0px" },
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      className={`transition-all duration-200 ease-out ${HIDDEN_CLASSES.join(" ")} ${className}`}
      style={delay ? { transitionDelay: `${delay}ms` } : undefined}
    >
      {children}
    </div>
  );
}
