"use client";

import { useState } from "react";

/** Маска: любые вводимые цифры превращаются в +7 (XXX) XXX-XX-XX */
function formatPhone(value: string) {
  const digits = value
    .replace(/\D/g, "")
    .replace(/^8/, "7")
    .replace(/^[^7]/, "7$&")
    .slice(0, 11);
  const rest = digits.slice(1);
  let out = "+7";
  if (rest.length > 0) out += ` (${rest.slice(0, 3)}`;
  if (rest.length >= 3) out += `) ${rest.slice(3, 6)}`;
  if (rest.length >= 6) out += `-${rest.slice(6, 8)}`;
  if (rest.length >= 8) out += `-${rest.slice(8, 10)}`;
  return out;
}

type LeadFormProps = {
  /** Быстрая форма заявки или форма обратной связи в контактах */
  variant: "quick" | "contact";
};

/** Клиентская форма: имя, телефон + поля по варианту. Демо-режим:
    отправка не уходит на бэкенд, показываем подтверждение. */
export default function LeadForm({ variant }: LeadFormProps) {
  const [sent, setSent] = useState(false);
  const [sending, setSending] = useState(false);
  const [homeVisit, setHomeVisit] = useState(false);
  const [phone, setPhone] = useState("");

  if (sent) {
    return (
      <div className="glass-strong rounded-lg p-6 md:p-8 text-center">
        <p className="text-lg font-semibold text-brand">Заявка отправлена!</p>
        <p className="mt-2 text-sm text-slate-600">
          Мы перезвоним в течение 30 минут в рабочее время.
        </p>
      </div>
    );
  }

  return (
    <form
      className="glass-strong space-y-4 rounded-lg p-6"
      onSubmit={(e) => {
        e.preventDefault();
        setSending(true);
        /* Демо-режим: имитируем отправку на сервер */
        setTimeout(() => {
          setSending(false);
          setSent(true);
        }, 900);
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
        placeholder="+7 (___) ___-__-__"
        autoComplete="tel"
        inputMode="tel"
        value={phone}
        onChange={(e) => setPhone(formatPhone(e.target.value))}
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
            className="h-4 w-4 accent-brand"
          />
          Прошу консультацию на дому
        </label>
      ) : null}

      <button
        type="submit"
        disabled={sending}
        className="btn-glass-primary w-full rounded-lg px-6 py-3.5 text-sm font-semibold disabled:cursor-not-allowed"
      >
        {sending
          ? "Отправка…"
          : variant === "quick"
            ? "Отправить заявку"
            : "Отправить сообщение"}
      </button>

      {variant === "quick" ? (
        <p className="text-center text-xs text-slate-700">Мы перезвоним в течение 30 минут</p>
      ) : null}
    </form>
  );
}
