"use client";

import Link from "next/link";
import { useState } from "react";
import { site } from "@/lib/site";
import SupportChat from "./SupportChat";

/** Единственный плавающий FAB: открывает маленькое окно чата поддержки.
    Авторизованным — живой чат, гостям — вход и телефон горячей линии. */
export default function FloatingActions({ myId }: { myId: number | null }) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-label={open ? "Закрыть чат поддержки" : "Открыть чат поддержки"}
        aria-expanded={open}
        className="btn-glass-primary fixed bottom-5 right-4 z-40 flex h-12 w-12 items-center justify-center rounded-lg shadow-lg transition-transform md:bottom-6 md:right-6"
      >
        {open ? (
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}
            strokeLinecap="round" className="h-5 w-5" aria-hidden="true">
            <path d="M6 6l12 12M18 6L6 18" />
          </svg>
        ) : (
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.9}
            strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5" aria-hidden="true">
            <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
          </svg>
        )}
      </button>

      {open ? (
        <div
          className="fixed inset-0 z-[59] flex items-end justify-end p-4 sm:items-center sm:justify-center"
          role="dialog"
          aria-modal="true"
          aria-label="Чат поддержки"
        >
          <div
            className="absolute inset-0 bg-black/30 backdrop-blur-sm"
            onClick={() => setOpen(false)}
            aria-hidden="true"
          />

          <div className="glass-strong relative flex h-[75vh] w-full max-w-md flex-col overflow-hidden rounded-lg bg-white shadow-2xl">
            {myId !== null ? (
              <div className="flex h-full min-h-0 flex-col [&>div]:h-full [&>div]:min-h-0 [&>div]:flex-1">
                <SupportChat myId={myId} />
              </div>
            ) : (
              <div className="flex h-full flex-col items-center justify-center gap-3 p-8 text-center">
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-brand text-white">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.9}
                    strokeLinecap="round" strokeLinejoin="round" className="h-6 w-6" aria-hidden="true">
                    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
                  </svg>
                </div>
                <p className="font-semibold text-brand">Чат поддержки</p>
                <p className="text-sm leading-6 text-slate-700">
                  Чтобы написать в чат, войдите в личный кабинет.
                  Или просто позвоните нам — ответим сразу.
                </p>
                <a href={site.phoneHref} className="text-lg font-bold text-brand hover:text-brand-dark">
                  {site.phone}
                </a>
                <Link
                  href="/login?next=/support"
                  onClick={() => setOpen(false)}
                  className="btn-glass-primary mt-2 rounded-lg px-6 py-3 text-sm font-semibold"
                >
                  Войти и открыть чат
                </Link>
              </div>
            )}
          </div>
        </div>
      ) : null}
    </>
  );
}
