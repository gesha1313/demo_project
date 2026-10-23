"use client";

import { useEffect, useState } from "react";

const LINKS = [
  { href: "#services", label: "Услуги" },
  { href: "#pricing", label: "Тарифы" },
  { href: "#team", label: "Команда" },
  { href: "#reviews", label: "Отзывы" },
  { href: "#contacts", label: "Контакты" },
];

/** Липкое оглавление главной: подсвечивает текущий блок при скролле */
export default function StickyNav() {
  const [active, setActive] = useState("");

  useEffect(() => {
    const sections = LINKS.map((l) => document.querySelector(l.href)).filter(
      (el): el is Element => el !== null
    );
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
        if (visible) setActive(`#${visible.target.id}`);
      },
      { rootMargin: "-25% 0px -60% 0px", threshold: [0.05, 0.25, 0.5] }
    );
    sections.forEach((s) => observer.observe(s));
    return () => observer.disconnect();
  }, []);

  return (
    <div className="sticky top-[68px] z-30 hidden border-b border-white/50 bg-white/70 backdrop-blur-md md:block">
      <nav className="mx-auto flex max-w-7xl gap-1 px-6 py-2">
        {LINKS.map((link) => (
          <a
            key={link.href}
            href={link.href}
            className={`rounded-full px-4 py-1.5 text-sm font-medium transition-colors ${
              active === link.href
                ? "bg-brand text-white"
                : "text-slate-600 hover:bg-white/60 hover:text-sky-700"
            }`}
          >
            {link.label}
          </a>
        ))}
      </nav>
    </div>
  );
}
