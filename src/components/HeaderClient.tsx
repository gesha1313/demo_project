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

export default function HeaderClient({ user }: { user: HeaderUser }) {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`sticky top-0 z-50 border-b transition-all duration-300 ${
        scrolled || menuOpen
          ? "glass border-white/60"
          : "border-transparent bg-white/40 backdrop-blur-sm"
      }`}
    >
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-6 py-4">
        {/* Логотип */}
        <Link href="/" className="group flex shrink-0 items-center gap-2.5">
          <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-brand text-white shadow-[0_6px_16px_rgba(63,105,150,0.35)] transition-transform duration-200 group-hover:scale-105 min-[400px]:h-11 min-[400px]:w-11">
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth={1.9}
              strokeLinecap="round"
              strokeLinejoin="round"
              className="h-5 w-5"
              aria-hidden="true"
            >
              <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" />
            </svg>
          </div>
          <div>
            <div className="text-lg font-bold leading-tight tracking-tight text-brand transition-colors group-hover:text-sky-800 min-[400px]:text-xl">
              {site.name}
            </div>
            <div className="hidden text-xs text-slate-700 min-[400px]:block">{site.tagline}</div>
          </div>
        </Link>

        {/* Навигация */}
        <nav className="hidden items-center gap-1 lg:flex">
          {navLinks.map((link) => (
            <Link
              key={link.label}
              href={
                link.href === "/register" && user ? "/cabinet/new" : link.href
              }
              className="rounded-full px-4 py-2 text-sm font-medium text-slate-600 transition-all duration-200 hover:bg-white/60 hover:text-sky-700"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        {/* Контакты и аккаунт */}
        <div className="hidden items-center gap-4 md:flex">
          <AccessibilityToggle />
          {user ? <NotificationsBell /> : null}
          {user ? (
            <>
              <Link
                href="/cabinet"
                className="text-sm font-medium text-slate-900 transition-colors hover:text-sky-700"
              >
                Личный кабинет
              </Link>
              {user.role !== "user" ? (
                <Link
                  href="/admin"
                  className="text-sm font-medium text-sky-700 transition-colors hover:text-sky-800"
                >
                  Админ-панель
                </Link>
              ) : null}
              <Link
                href="/register"
                className="btn-glass-primary rounded-full px-4 py-2.5 text-sm font-semibold"
              >
                Получить консультацию →
              </Link>
            </>
          ) : (
            <>
              <a
                href={site.phoneHref}
                className="flex items-center gap-1.5 rounded-full border-[1.5px] border-slate-400 bg-white/60 px-4 py-2.5 text-sm font-semibold text-slate-900 backdrop-blur-md transition-all duration-200 hover:border-sky-500 hover:bg-white/70 hover:ring-1 hover:ring-sky-500 hover:text-sky-700"
              >
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={1.9}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="h-4 w-4 text-sky-700"
                  aria-hidden="true"
                >
                  <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92Z" />
                </svg>
                {site.phone}
              </a>

              <Link
                href="/login"
                className="btn-glass-ghost rounded-full px-4 py-2.5 text-sm font-semibold"
              >
                Войти
              </Link>

              <Link
                href="/register"
                className="btn-glass-primary rounded-full px-4 py-2.5 text-sm font-semibold"
              >
                Получить консультацию →
              </Link>
            </>
          )}
        </div>

        {/* Мобильные: уведомления + меню */}
        <div className="flex items-center gap-1.5 md:hidden">
          <AccessibilityToggle />
          {user ? <NotificationsBell /> : null}
          <button
            type="button"
            onClick={() => setMenuOpen((open) => !open)}
            aria-label={menuOpen ? "Закрыть меню" : "Открыть меню"}
            aria-expanded={menuOpen}
            className="flex h-9 w-9 flex-col items-center justify-center rounded-full border border-white/70 bg-white/50 backdrop-blur-md md:hidden"
          >
          <span
            className={`block h-0.5 w-6 rounded bg-slate-800 transition-all duration-300 ${
              menuOpen ? "translate-y-[4px] rotate-45" : ""
            }`}
          />
          <span
            className={`mt-1.5 block h-0.5 w-6 rounded bg-slate-800 transition-all duration-300 ${
              menuOpen ? "mt-0 -translate-y-[4px] -rotate-45" : ""
            }`}
          />
        </button>
        </div>
      </div>

      {/* Мобильное меню — плавно раскрывается через grid-rows */}
      <div
        className={`grid transition-all duration-300 ease-out md:hidden ${
          menuOpen ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
        }`}
      >
        <div className="overflow-hidden">
          <nav className="flex flex-col gap-1 border-t border-white/60 px-6 pb-6 pt-4">
            {navLinks.map((link) => (
              <Link
                key={link.label}
                href={
                  link.href === "/register" && user ? "/cabinet/new" : link.href
                }
                onClick={() => setMenuOpen(false)}
                className="rounded-xl px-3 py-3 text-sm font-medium text-slate-700 transition-colors hover:bg-white/70 hover:text-sky-700"
              >
                {link.label}
              </Link>
            ))}

            {user ? (
              <>
                <Link
                  href="/cabinet"
                  onClick={() => setMenuOpen(false)}
                  className="rounded-xl px-3 py-3 text-sm font-medium text-slate-700 transition-colors hover:bg-white/70 hover:text-sky-700"
                >
                  Личный кабинет
                </Link>
                {user.role !== "user" ? (
                  <Link
                    href="/admin"
                    onClick={() => setMenuOpen(false)}
                    className="rounded-xl px-3 py-3 text-sm font-medium text-sky-700 transition-colors hover:bg-white/70"
                  >
                    Админ-панель
                  </Link>
                ) : null}
              </>
            ) : (
              <>
                <a
                  href={site.phoneHref}
                  className="mt-2 px-3 py-3 text-sm font-semibold text-brand"
                >
                  {site.phone}
                </a>
                <Link
                  href="/login"
                  onClick={() => setMenuOpen(false)}
                  className="btn-glass-ghost mt-2 rounded-full px-5 py-3 text-center text-sm font-semibold"
                >
                  Войти
                </Link>
              </>
            )}

            <Link
              href="/register"
              onClick={() => setMenuOpen(false)}
              className="btn-glass-primary mt-2 rounded-full px-5 py-3 text-center text-sm font-semibold"
            >
              Получить консультацию →
            </Link>
          </nav>
        </div>
      </div>
    </header>
  );
}
