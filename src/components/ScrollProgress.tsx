"use client";

import { useEffect, useState } from "react";

/** Тонкая полоска прогресса чтения поверх шапки */
export default function ScrollProgress() {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const onScroll = () => {
      const h = document.documentElement;
      const max = h.scrollHeight - h.clientHeight;
      setProgress(max > 0 ? Math.min(100, (h.scrollTop / max) * 100) : 0);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div
      className="fixed left-0 top-0 z-[70] h-[3px] bg-brand transition-[width] duration-100"
      style={{ width: `${progress}%` }}
      aria-hidden="true"
    />
  );
}
