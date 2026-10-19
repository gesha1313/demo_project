"use client";

import { useState } from "react";

type LeadFormProps = {
  /** Быстрая форма заявки или форма обратной связи в контактах */
  variant: "quick" | "contact";
};

/** Клиентская форма: имя, телефон + поля по варианту. Демо-режим:
    отправка не уходит на бэкенд, показываем подтверждение. */
export default function LeadForm({ variant }: LeadFormProps) {
  const [sent, setSent] = useState(false);
  const [homeVisit, setHomeVisit] = useState(false);

  if (sent) {
    return (
      <div className="glass-strong rounded-3xl p-8 text-center">
        <p className="text-lg font-semibold text-brand">Заявка отправлена!</p>
        <p className="mt-2 text-sm text-slate-600">
          Мы перезвоним в течение 30 минут в рабочее время.
        </p>
      </div>
    );
  }

  return (
    <form
      className="glass-strong space-y-4 rounded-3xl p-7"
      onSubmit={(e) => {
        e.preventDefault();
        setSent(true);
      }}
    >
      <input
        required
        className="input-glass"
        name="name"
        placeholder="Ваше имя"
        autoComplete="name"
      />
      <input
        required
        className="input-glass"
        name="phone"
        type="tel"
        placeholder="Телефон"
        autoComplete="tel"
      />

      {variant === "quick" ? (
        <>
          <input
            className="input-glass"
            name="time"
            placeholder="Удобное время звонка (например, после 18:00)"
          />
          <textarea
            className="input-glass min-h-24 resize-y"
            name="problem"
            placeholder="Коротко опишите проблему: за кем нужен уход и что важно"
          />
        </>
      ) : (
        <textarea
          className="input-glass min-h-24 resize-y"
          name="message"
          placeholder="Сообщение"
        />
      )}

      {variant === "contact" ? (
        <label className="flex cursor-pointer items-center gap-3 text-sm text-slate-600">
          <input
            type="checkbox"
            checked={homeVisit}
            onChange={(e) => setHomeVisit(e.target.checked)}
            className="h-4 w-4 accent-sky-700"
          />
          Прошу консультацию на дому
        </label>
      ) : null}

      <button type="submit" className="btn-glass-primary w-full rounded-2xl px-6 py-3.5 text-sm font-semibold">
        {variant === "quick" ? "Отправить заявку" : "Отправить сообщение"}
      </button>

      {variant === "quick" ? (
        <p className="text-center text-xs text-slate-700">Мы перезвоним в течение 30 минут</p>
      ) : null}
    </form>
  );
}
