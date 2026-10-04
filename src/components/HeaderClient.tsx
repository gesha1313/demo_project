"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { navLinks, site } from "@/lib/site";

type HeaderUser = { email: string; role: "user" | "employee" | "admin" } | null;

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
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-5">
        {/* Логотип */}
        <Link href="/" className="group">
          <div className="text-xl font-bold tracking-tight text-brand transition-colors group-hover:text-blue-800">
            {site.name}
          </div>
          <div className="text-xs text-slate-500">{site.tagline}</div>
        </Link>

        {/* Навигация */}
        <nav className="hidden items-center gap-1 lg:flex">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="rounded-full px-4 py-2 text-sm text-slate-600 transition-all duration-200 hover:bg-white/60 hover:text-blue-700"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        {/* Контакты и аккаунт */}
        <div className="hidden items-center gap-5 md:flex">
          {user ? (
            <>
              <Link
                href="/cabinet"
                className="text-sm font-medium text-slate-900 transition-colors hover:text-blue-700"
              >
                Личный кабинет
              </Link>
              {user.role !== "user" ? (
                <Link
                  href="/admin"
                  className="text-sm font-medium text-blue-700 transition-colors hover:text-blue-800"
                >
                  Админ-панель
                </Link>
              ) : null}
              <Link
                href="/register"
                className="btn-glass-primary rounded-full px-5 py-3 text-sm font-semibold"
              >
                Получить консультацию
              </Link>
            </>
          ) : (
            <>
              <a
                href={site.phoneHref}
                className="text-sm font-medium text-slate-900 transition-colors hover:text-blue-700"
              >
                {site.phone}
              </a>

              <Link
                href="/login"
                className="btn-glass-ghost rounded-full px-5 py-3 text-sm font-semibold"
              >
                Войти
              </Link>

              <Link
                href="/register"
                className="btn-glass-primary rounded-full px-5 py-3 text-sm font-semibold"
              >
                Получить консультацию
              </Link>
            </>
          )}
        </div>

        {/* Кнопка мобильного меню */}
        <button
          type="button"
          onClick={() => setMenuOpen((open) => !open)}
          aria-label={menuOpen ? "Закрыть меню" : "Открыть меню"}
          aria-expanded={menuOpen}
          className="flex h-11 w-11 flex-col items-center justify-center rounded-full border border-white/70 bg-white/50 backdrop-blur-md md:hidden"
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
                key={link.href}
                href={link.href}
                onClick={() => setMenuOpen(false)}
                className="rounded-xl px-3 py-3 text-sm font-medium text-slate-700 transition-colors hover:bg-white/70 hover:text-blue-700"
              >
                {link.label}
              </Link>
            ))}

            {user ? (
              <>
                <Link
                  href="/cabinet"
                  onClick={() => setMenuOpen(false)}
                  className="rounded-xl px-3 py-3 text-sm font-medium text-slate-700 transition-colors hover:bg-white/70 hover:text-blue-700"
                >
                  Личный кабинет
                </Link>
                {user.role !== "user" ? (
                  <Link
                    href="/admin"
                    onClick={() => setMenuOpen(false)}
                    className="rounded-xl px-3 py-3 text-sm font-medium text-blue-700 transition-colors hover:bg-white/70"
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
              Получить консультацию
            </Link>
          </nav>
        </div>
      </div>
    </header>
  );
}
