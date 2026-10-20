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

const DESKTOP_QUERY = "(min-width: 768px)";

const sideLinkClass =
  "rounded-xl px-4 py-3 text-sm font-medium text-slate-700 transition-colors hover:bg-white/70 hover:text-sky-700";

function PhoneIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.9}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92Z" />
    </svg>
  );
}

function LogoMark() {
  return (
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
  );
}

function BurgerLines({ open }: { open: boolean }) {
  return (
    <>
      <span
        className={`block h-0.5 w-6 rounded bg-slate-800 transition-all duration-300 ${
          open ? "translate-y-[4px] rotate-45" : ""
        }`}
      />
      <span
        className={`mt-1.5 block h-0.5 w-6 rounded bg-slate-800 transition-all duration-300 ${
          open ? "mt-0 -translate-y-[4px] -rotate-45" : ""
        }`}
      />
    </>
  );
}

export default function HeaderClient({ user }: { user: HeaderUser }) {
  const [scrolled, setScrolled] = useState(false);
  // мобильное выпадающее меню (< md)
  const [menuOpen, setMenuOpen] = useState(false);
  // левая панель на ПК (>= md)
  const [drawerOpen, setDrawerOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // При смене размера окна закрываем оба меню, чтобы не оставалось "зависших" состояний
  useEffect(() => {
    const mq = window.matchMedia(DESKTOP_QUERY);
    const onChange = () => {
      setMenuOpen(false);
      setDrawerOpen(false);
    };
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);

  // Esc закрывает панель + блокируем прокрутку страницы, пока панель открыта
  useEffect(() => {
    if (!drawerOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setDrawerOpen(false);
    };
    document.addEventListener("keydown", onKey);
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prevOverflow;
    };
  }, [drawerOpen]);

  const closeDrawer = () => setDrawerOpen(false);

  return (
    <>
      <header
        className={`sticky top-0 z-50 border-b transition-all duration-300 ${
          scrolled || menuOpen
            ? "glass border-white/60"
            : "border-transparent bg-white/40 backdrop-blur-sm"
        }`}
      >
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-6 py-4">
          {/* Слева: бургер (только ПК) + логотип */}
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setDrawerOpen((open) => !open)}
              aria-label={drawerOpen ? "Закрыть меню" : "Открыть меню"}
              aria-expanded={drawerOpen}
              className="hidden h-10 w-10 flex-col items-center justify-center rounded-full border border-white/70 bg-white/50 backdrop-blur-md transition-colors hover:bg-white/80 md:flex"
            >
              <BurgerLines open={drawerOpen} />
            </button>

            <Link href="/" className="group flex shrink-0 items-center gap-2.5">
              <LogoMark />
              <div>
                <div className="text-lg font-bold leading-tight tracking-tight text-brand transition-colors group-hover:text-sky-800 min-[400px]:text-xl">
                  {site.name}
                </div>
                <div className="hidden text-xs text-slate-700 min-[400px]:block">
                  {site.tagline}
                </div>
              </div>
            </Link>
          </div>

          {/* ПК: только главное — телефон и заказ услуг */}
          <div className="ml-auto hidden items-center gap-4 md:flex">
            <AccessibilityToggle />
            {user ? <NotificationsBell /> : null}

            <a
              href={site.phoneHref}
              className="flex items-center gap-1.5 rounded-full border-[1.5px] border-slate-400 bg-white/60 px-4 py-2.5 text-sm font-semibold text-slate-900 backdrop-blur-md transition-all duration-200 hover:border-sky-500 hover:bg-white/70 hover:text-sky-700 hover:ring-1 hover:ring-sky-500"
            >
              <PhoneIcon className="h-4 w-4 text-sky-700" />
              {site.phone}
            </a>

            <Link
              href="/register"
              className="btn-glass-primary rounded-full px-4 py-2.5 text-sm font-semibold"
            >
              Получить консультацию →
            </Link>
          </div>

          {/* Мобильные: уведомления + бургер (только < md) */}
          <div className="flex items-center gap-1.5 md:hidden">
            <AccessibilityToggle />
            {user ? <NotificationsBell /> : null}
            <button
              type="button"
              onClick={() => setMenuOpen((open) => !open)}
              aria-label={menuOpen ? "Закрыть меню" : "Открыть меню"}
              aria-expanded={menuOpen}
              className="flex h-9 w-9 flex-col items-center justify-center rounded-full border border-white/70 bg-white/50 backdrop-blur-md"
            >
              <BurgerLines open={menuOpen} />
            </button>
          </div>
        </div>

        {/* Мобильное меню — плавно раскрывается через grid-rows (только < md) */}
        <div
          className={`grid transition-all duration-300 ease-out md:hidden ${
            menuOpen ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
          }`}
        >
          <div className="overflow-hidden">
            <nav className="flex flex-col gap-1 border-t border-white/60 px-6 pb-6 pt-4">
              {navLinks.map((link) =>
                link.href.includes("#") ? (
                  <a
                    key={link.href}
                    href={link.href}
                    onClick={() => setMenuOpen(false)}
                    className="rounded-xl px-3 py-3 text-sm font-medium text-slate-700 transition-colors hover:bg-white/70 hover:text-sky-700"
                  >
                    {link.label}
                  </a>
                ) : (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={() => setMenuOpen(false)}
                    className="rounded-xl px-3 py-3 text-sm font-medium text-slate-700 transition-colors hover:bg-white/70 hover:text-sky-700"
                  >
                    {link.label}
                  </Link>
                )
              )}

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

      {/* Левая панель для ПК.
          Вынесена за пределы <header>: из-за backdrop-blur у шапки
          position: fixed внутри неё работал бы относительно шапки, а не окна. */}
      <div className="hidden md:block">
        {/* Затемнение */}
        <div
          onClick={closeDrawer}
          aria-hidden="true"
          className={`fixed inset-0 z-[60] bg-slate-900/30 backdrop-blur-[2px] transition-opacity duration-300 ${
            drawerOpen ? "opacity-100" : "pointer-events-none opacity-0"
          }`}
        />

        {/* Сама панель */}
        <aside
          role="dialog"
          aria-modal="true"
          aria-label="Меню сайта"
          aria-hidden={!drawerOpen}
          className={`glass fixed inset-y-0 left-0 z-[70] flex w-80 flex-col border-r border-white/60 shadow-2xl transition-transform duration-300 ease-out ${
            drawerOpen ? "translate-x-0" : "-translate-x-full"
          }`}
        >
          {/* Верх панели */}
          <div className="flex items-center justify-between gap-3 border-b border-white/60 px-5 py-4">
            <Link
              href="/"
              onClick={closeDrawer}
              className="group flex items-center gap-2.5"
              tabIndex={drawerOpen ? 0 : -1}
            >
              <LogoMark />
              <span className="text-lg font-bold tracking-tight text-brand">
                {site.name}
              </span>
            </Link>
            <button
              type="button"
              onClick={closeDrawer}
              aria-label="Закрыть меню"
              tabIndex={drawerOpen ? 0 : -1}
              className="flex h-9 w-9 items-center justify-center rounded-full border border-white/70 bg-white/50 text-slate-800 backdrop-blur-md transition-colors hover:bg-white/80"
            >
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth={2}
                strokeLinecap="round"
                className="h-4 w-4"
                aria-hidden="true"
              >
                <path d="M6 6l12 12M18 6L6 18" />
              </svg>
            </button>
          </div>

          {/* Навигация */}
          <nav className="flex flex-1 flex-col gap-1 overflow-y-auto px-4 py-4">
            {navLinks.map((link) =>
              link.href.includes("#") ? (
                <a
                  key={link.href}
                  href={link.href}
                  onClick={closeDrawer}
                  tabIndex={drawerOpen ? 0 : -1}
                  className={sideLinkClass}
                >
                  {link.label}
                </a>
              ) : (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={closeDrawer}
                  tabIndex={drawerOpen ? 0 : -1}
                  className={sideLinkClass}
                >
                  {link.label}
                </Link>
              )
            )}

            {user ? (
              <>
                <div className="my-2 border-t border-white/60" />
                <Link
                  href="/cabinet"
                  onClick={closeDrawer}
                  tabIndex={drawerOpen ? 0 : -1}
                  className={sideLinkClass}
                >
                  Личный кабинет
                </Link>
                {user.role !== "user" ? (
                  <Link
                    href="/admin"
                    onClick={closeDrawer}
                    tabIndex={drawerOpen ? 0 : -1}
                    className="rounded-xl px-4 py-3 text-sm font-medium text-sky-700 transition-colors hover:bg-white/70"
                  >
                    Админ-панель
                  </Link>
                ) : null}
              </>
            ) : null}
          </nav>

          {/* Низ панели: вход для гостей */}
          {!user ? (
            <div className="border-t border-white/60 px-5 py-4">
              <Link
                href="/login"
                onClick={closeDrawer}
                tabIndex={drawerOpen ? 0 : -1}
                className="btn-glass-ghost block rounded-full px-5 py-3 text-center text-sm font-semibold"
              >
                Войти
              </Link>
            </div>
          ) : null}
        </aside>
      </div>
    </>
  );
}