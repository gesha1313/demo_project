"use client";

import { useEffect, useState } from "react";

const STORAGE_KEY = "patronage:hc";

/** Переключатель версии для слабовидящих: добавляет класс .hc на <html>.
    Выбор сохраняется в localStorage и применяется до рендера скриптом в layout. */
export default function AccessibilityToggle() {
  const [on, setOn] = useState(false);

  useEffect(() => {
    setOn(document.documentElement.classList.contains("hc"));
  }, []);

  const toggle = () => {
    const next = !on;
    setOn(next);
    document.documentElement.classList.toggle("hc", next);
    try {
      localStorage.setItem(STORAGE_KEY, next ? "1" : "0");
    } catch {
      /* приватный режим — просто без сохранения */
    }
  };

  return (
    <button
      type="button"
      onClick={toggle}
      aria-pressed={on}
      aria-label="Версия для слабовидящих"
      title={on ? "Вернуть обычную версию" : "Версия для слабовидящих"}
      className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full border backdrop-blur-md transition-all duration-200 md:h-11 md:w-11 ${
        on
          ? "border-brand-300 bg-brand-100/80 text-brand-dark"
          : "border-white/70 bg-white/50 text-slate-700 hover:bg-white/70"
      }`}
    >
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth={1.8}
        strokeLinecap="round"
        strokeLinejoin="round"
        className="h-4 w-4 md:h-5 md:w-5"
        aria-hidden="true"
      >
        <path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7-10-7-10-7Z" />
        <circle cx="12" cy="12" r="3" />
      </svg>
    </button>
  );
}
