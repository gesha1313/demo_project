"use client";

import Link from "next/link";
import { useState } from "react";
import { site } from "@/lib/site";

const QUESTIONS = [
  {
    key: "type",
    title: "Что нужно?",
    options: ["Сиделка на дом", "Размещение в пансионате"],
  },
  {
    key: "duration",
    title: "На какой срок?",
    options: ["2 часа", "12 часов", "Сутки / проживание"],
  },
  {
    key: "district",
    title: "Ваш район в Нижнем?",
    options: ["Любой", "Сормовский", "Приокский"],
  },
] as const;

/** Плавающие кнопки: Telegram + мини-квиз «Подобрать уход» (3 вопроса) */
export default function FloatingActions() {
  const [open, setOpen] = useState(false);
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<string[]>([]);

  const pick = (option: string) => {
    const next = [...answers, option];
    setAnswers(next);
    setStep((s) => s + 1);
  };

  const reset = () => {
    setOpen(false);
    setStep(0);
    setAnswers([]);
  };

  const isPansionat = answers[0] === "Размещение в пансионате";

  return (
    <>
      <div className="fixed bottom-20 right-4 z-40 flex flex-col gap-2 md:bottom-6">
        <a
          href={site.telegram}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Написать в Telegram"
          className="flex h-12 w-12 items-center justify-center rounded-xl border-[1.5px] border-slate-400 bg-white/90 text-sky-700 shadow-lg backdrop-blur-md transition-all hover:-translate-y-0.5 hover:border-sky-500"
        >
          <svg viewBox="0 0 24 24" fill="currentColor" className="h-5 w-5" aria-hidden="true">
            <path d="M21.9 4.6c.2-1.1-.8-2-1.9-1.6L2.7 9.7c-1.2.5-1.1 2.2.1 2.6l4.4 1.4 1.7 5.3c.3 1 1.6 1.3 2.3.5l2.4-2.5 4.3 3.2c.8.6 2 .2 2.2-.9l3.8-14.7ZM8.6 13.2l8.9-5.6-6.9 6.5-.2 3.3-1.8-4.2Z" />
          </svg>
        </a>
        <button
          type="button"
          onClick={() => setOpen(true)}
          className="btn-glass-primary flex h-12 w-12 items-center justify-center rounded-xl shadow-lg"
          aria-label="Подобрать уход — мини-квиз"
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.9}
            strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5" aria-hidden="true">
            <path d="M12 3v2M12 19v2M3 12h2M19 12h2M5.6 5.6l1.4 1.4M17 17l1.4 1.4M18.4 5.6 17 7M7 17l-1.4 1.4" />
            <circle cx="12" cy="12" r="3.5" />
          </svg>
        </button>
      </div>

      {open ? (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4" role="dialog" aria-modal="true">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={reset} aria-hidden="true" />
          <div className="glass-strong relative w-full max-w-md rounded-xl bg-white p-6 shadow-2xl">
            <button
              type="button"
              onClick={reset}
              aria-label="Закрыть"
              className="absolute right-4 top-4 text-slate-500 hover:text-slate-800"
            >
              ✕
            </button>

            {step < QUESTIONS.length ? (
              <>
                <div className="text-xs font-semibold uppercase tracking-wider text-slate-600">
                  Шаг {step + 1} из {QUESTIONS.length}
                </div>
                <h3 className="mt-2 text-xl font-bold text-brand">{QUESTIONS[step].title}</h3>
                <div className="mt-5 flex flex-col gap-2">
                  {QUESTIONS[step].options.map((option) => (
                    <button
                      key={option}
                      type="button"
                      onClick={() => pick(option)}
                      className="rounded-xl border-[1.5px] border-slate-300 bg-white px-4 py-3 text-left text-sm font-semibold text-slate-800 transition-all hover:border-sky-500 hover:text-sky-700"
                    >
                      {option}
                    </button>
                  ))}
                </div>
              </>
            ) : (
              <>
                <h3 className="text-xl font-bold text-brand">Ваш вариант готов</h3>
                <p className="mt-3 text-sm leading-6 text-slate-700">
                  {answers.join(" · ")}. Менеджер подтвердит детали и назовёт точную
                  стоимость после заявки.
                </p>
                <div className="mt-5 flex flex-col gap-2 sm:flex-row">
                  <Link
                    href="/register"
                    onClick={reset}
                    className="btn-glass-primary flex-1 rounded-xl px-5 py-3 text-center text-sm font-semibold"
                  >
                    Оформить заявку
                  </Link>
                  <Link
                    href={isPansionat ? "/pansionat" : "/sidelki"}
                    onClick={reset}
                    className="btn-glass-ghost flex-1 rounded-xl px-5 py-3 text-center text-sm font-semibold"
                  >
                    Смотреть тарифы
                  </Link>
                </div>
              </>
            )}
          </div>
        </div>
      ) : null}
    </>
  );
}
