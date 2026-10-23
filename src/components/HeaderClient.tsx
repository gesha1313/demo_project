"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { navLinks, site } from "@/lib/site";
import AccessibilityToggle from "./AccessibilityToggle";
import NotificationsBell from "./NotificationsBell";

type HeaderUser = {
  email: string;
  role: "user" | "employee" | "admin" | "caretaker";
} | null;

/** Шапка: только главное (логотип, телефон, CTA). Навигация и вход —
    в выезжающей панели слева, чтобы номер всегда помещался. */
export default function HeaderClient({ user }: { user: HeaderUser }) {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const closeMenu = () => setMenuOpen(false);

  return (
    <>
      <header
        className={`sticky top-0 z-50 border-b transition-all duration-300 ${
          scrolled
            ? "glass border-white/60"
            : "border-transparent bg-white/40 backdrop-blur-sm"
        }`}
      >
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-3 px-4 py-3.5 sm:px-6">
          {/* Бургер — всегда слева, открывает панель */}
          <button
            type="button"
            onClick={() => setMenuOpen(true)}
            aria-label="Открыть меню"
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-white/70 bg-white/50 backdrop-blur-md transition-colors hover:bg-white/70"
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}
              strokeLinecap="round" className="h-5 w-5 text-slate-800" aria-hidden="true">
              <path d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>

          {/* Логотип */}
          <Link href="/" className="group flex min-w-0 items-center gap-2.5">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-brand text-white shadow-[0_6px_16px_rgba(63,105,150,0.35)] transition-transform duration-200 group-hover:scale-105">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.9}
                strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5" aria-hidden="true">
                <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" />
              </svg>
            </div>
            <div className="min-w-0">
              <div className="truncate text-lg font-bold leading-tight tracking-tight text-brand transition-colors group-hover:text-sky-800 min-[480px]:text-xl">
                {site.name}
              </div>
              <div className="hidden text-xs text-slate-700 min-[560px]:block">{site.tagline}</div>
            </div>
          </Link>

          {/* Главное: телефон (обязательно), режим для слабовидящих, CTA */}
          <div className="ml-auto flex items-center gap-2 sm:gap-3">
            <AccessibilityToggle />
            {user ? <NotificationsBell /> : null}

            <a
              href={site.phoneHref}
              className="hidden items-center gap-1.5 rounded-xl border-[1.5px] border-slate-400 bg-white/60 px-3.5 py-2.5 text-sm font-semibold text-slate-900 backdrop-blur-md transition-all duration-200 hover:border-sky-500 hover:bg-white/70 hover:ring-1 hover:ring-sky-500 hover:text-sky-700 min-[640px]:flex"
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.9}
                strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4 text-sky-700" aria-hidden="true">
                <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92Z" />
              </svg>
              {site.phone}
            </a>

            <Link
              href="/register"
              className="btn-glass-primary hidden rounded-xl px-4 py-2.5 text-sm font-semibold sm:inline-block"
            >
              Консультация →
            </Link>
          </div>
        </div>
      </header>

      {/* Левая боковая панель */}
      {menuOpen ? (
        <div className="fixed inset-0 z-[60]" role="dialog" aria-modal="true">
          <div
            className="absolute inset-0 bg-black/40 backdrop-blur-sm"
            onClick={closeMenu}
            aria-hidden="true"
          />
          <aside className="absolute left-0 top-0 flex h-full w-80 max-w-[85vw] flex-col overflow-y-auto bg-white shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-200 px-5 py-4">
              <span className="font-bold text-brand">Меню</span>
              <button
                type="button"
                onClick={closeMenu}
                aria-label="Закрыть меню"
                className="flex h-9 w-9 items-center justify-center rounded-xl border border-slate-300 bg-white text-slate-700 transition-colors hover:bg-slate-100"
              >
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}
                  strokeLinecap="round" className="h-4 w-4" aria-hidden="true">
                  <path d="M6 6l12 12M18 6L6 18" />
                </svg>
              </button>
            </div>

            <nav className="flex flex-col gap-1 p-4">
              {navLinks.map((link) =>
                link.href.includes("#") ? (
                  <a
                    key={link.href}
                    href={link.href}
                    onClick={closeMenu}
                    className="rounded-xl px-4 py-3 text-sm font-medium text-slate-700 transition-colors hover:bg-sky-50 hover:text-sky-700"
                  >
                    {link.label}
                  </a>
                ) : (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={closeMenu}
                    className="rounded-xl px-4 py-3 text-sm font-medium text-slate-700 transition-colors hover:bg-sky-50 hover:text-sky-700"
                  >
                    {link.label}
                  </Link>
                )
              )}
            </nav>

            <div className="mt-auto space-y-2 border-t border-slate-200 p-4">
              {user ? (
                <>
                  <Link
                    href="/cabinet"
                    onClick={closeMenu}
                    className="block rounded-xl px-4 py-3 text-sm font-semibold text-slate-800 transition-colors hover:bg-sky-50"
                  >
                    Личный кабинет
                  </Link>
                  {user.role !== "user" ? (
                    <Link
                      href="/admin"
                      onClick={closeMenu}
                      className="block rounded-xl px-4 py-3 text-sm font-semibold text-sky-700 transition-colors hover:bg-sky-50"
                    >
                      Админ-панель
                    </Link>
                  ) : null}
                </>
              ) : (
                <Link
                  href="/login"
                  onClick={closeMenu}
                  className="btn-glass-ghost block rounded-xl px-4 py-3 text-center text-sm font-semibold"
                >
                  Войти
                </Link>
              )}

              <a href={site.phoneHref} className="block px-4 py-2 text-sm font-bold text-brand">
                {site.phone}
              </a>
              <p className="px-4 pb-2 text-xs text-slate-600">{site.hours}</p>
            </div>
          </aside>
        </div>
      ) : null}
    </>
  );
}
