"use client";

import { useEffect, useState } from "react";

const STORAGE_KEY = "patronage:cookie-ok";

/** Плашка согласия на обработку данных файлов cookie (152-ФЗ) */
export default function CookieBar() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    try {
      if (localStorage.getItem(STORAGE_KEY) !== "1") setShow(true);
    } catch {
      /* приватный режим — не показываем */
    }
  }, []);

  if (!show) return null;

  const accept = () => {
    setShow(false);
    try {
      localStorage.setItem(STORAGE_KEY, "1");
    } catch {
      /* без сохранения */
    }
  };

  return (
    <div className="glass-strong fixed bottom-2 left-2 right-2 z-40 flex flex-col gap-2 rounded-lg p-3 shadow-xl sm:bottom-4 sm:left-4 sm:right-auto sm:max-w-md sm:flex-row sm:items-center sm:gap-3 sm:p-4">
      <p className="text-xs leading-5 text-slate-700">
        Мы используем файлы cookie для работы сайта. Оставаясь здесь, вы
        соглашаетесь с обработкой данных согласно политике конфиденциальности.
      </p>
      <button
        type="button"
        onClick={accept}
        className="btn-glass-primary shrink-0 rounded-lg px-5 py-2 text-xs font-semibold"
      >
        Принято
      </button>
    </div>
  );
}
