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
    <div className="glass-strong fixed bottom-4 left-4 right-4 z-40 flex flex-col gap-3 rounded-lg p-4 shadow-xl sm:right-auto sm:max-w-md sm:flex-row sm:items-center">
      <p className="text-xs leading-5 text-slate-700">
        Мы используем файлы cookie для корректной работы сайта. Оставаясь здесь,
        вы соглашаетесь с обработкой данных согласно политике конфиденциальности.
      </p>
      <button
        type="button"
        onClick={accept}
        className="btn-glass-primary shrink-0 rounded-lg px-5 py-2.5 text-xs font-semibold"
      >
        Принято
      </button>
    </div>
  );
}
