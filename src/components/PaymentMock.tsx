"use client";

import Link from "next/link";
import { useState } from "react";

type PaymentMockProps = {
  /** Итоговая сумма в рублях */
  amount: number;
  /** Строки-пояснения: что оплачивается */
  lines: string[];
  /** Тариф за месяц — тогда показываем выбор количества месяцев */
  perMonthPrice?: number;
  /** Если задан — после «оплаты» вызывается он (вместо экрана успеха) */
  onPaid?: () => void;
};

/** Мок-оплата: реквизиты любые, кнопка всегда «проходит». */
export default function PaymentMock({ amount, lines, perMonthPrice, onPaid }: PaymentMockProps) {
  const [months, setMonths] = useState(1);
  const [card, setCard] = useState("");
  const [expiry, setExpiry] = useState("");
  const [cvc, setCvc] = useState("");
  const [paying, setPaying] = useState(false);
  const [paid, setPaid] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const total = perMonthPrice ? perMonthPrice * months : amount;

  const handlePay = () => {
    if (card.replace(/\D/g, "").length < 12 || !/^\d{2}\/\d{2}$/.test(expiry) || cvc.length < 3) {
      setError("Заполните реквизиты (любые: 16 цифр карты, ММ/ГГ, 3 цифры CVC)");
      return;
    }
    setError(null);
    setPaying(true);
    // Муляж: через полторы секунды оплата «проходит»
    window.setTimeout(() => {
      if (onPaid) onPaid();
      else setPaid(true);
    }, 1500);
  };

  if (paid) {
    return (
      <div className="glass-strong rounded-xl p-8 text-center">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-sky-500 to-teal-600 text-2xl text-white shadow-lg">
          ✓
        </div>
        <h2 className="mt-5 text-2xl font-semibold text-brand">Оплата прошла</h2>
        <p className="mt-2 text-sm text-slate-700">
          Оплачено {total.toLocaleString("ru-RU")} ₽. Квитанция сохранена в заявке.
        </p>
        <Link
          href="/cabinet/requests"
          className="btn-glass-primary mt-6 inline-block rounded-full px-6 py-3 text-sm font-semibold"
        >
          Мои заявки
        </Link>
      </div>
    );
  }

  return (
    <div className="glass-strong rounded-xl p-7 md:p-8">
      <h2 className="text-xl font-semibold text-brand">Оплата</h2>

      <div className="mt-4 space-y-1.5">
        {lines.map((line) => (
          <div key={line} className="flex items-center gap-2 text-sm text-slate-600">
            <span className="h-1.5 w-1.5 rounded-full bg-sky-500" />
            {line}
          </div>
        ))}
      </div>

      {perMonthPrice ? (
        <div className="glass mt-5 flex items-center justify-between gap-4 rounded-xl px-5 py-4">
          <div>
            <div className="text-xs uppercase tracking-wide text-slate-600">На сколько месяцев</div>
            <div className="text-sm text-slate-600">{perMonthPrice.toLocaleString("ru-RU")} ₽ / месяц</div>
          </div>
          <select
            value={months}
            onChange={(e) => setMonths(Number(e.target.value))}
            className="input-glass w-auto py-2.5"
            aria-label="Количество месяцев"
          >
            {[1, 2, 3, 6, 12].map((m) => (
              <option key={m} value={m}>
                {m} мес.
              </option>
            ))}
          </select>
        </div>
      ) : null}

      <div className="glass mt-5 flex items-center justify-between rounded-xl px-5 py-4">
        <span className="text-sm font-medium text-slate-600">Итого к оплате</span>
        <span className="text-2xl font-semibold text-brand">{total.toLocaleString("ru-RU")} ₽</span>
      </div>

      {/* Реквизиты (муляж — принимаются любые данные) */}
      <div className="mt-5 space-y-4">
        <div>
          <label htmlFor="card" className="mb-2 block text-sm font-medium text-brand">
            Номер карты
          </label>
          <input
            id="card"
            inputMode="numeric"
            placeholder="0000 0000 0000 0000"
            value={card}
            onChange={(e) => setCard(e.target.value)}
            className="input-glass"
          />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label htmlFor="expiry" className="mb-2 block text-sm font-medium text-brand">
              Срок (ММ/ГГ)
            </label>
            <input
              id="expiry"
              placeholder="12/28"
              value={expiry}
              onChange={(e) => setExpiry(e.target.value)}
              className="input-glass"
            />
          </div>
          <div>
            <label htmlFor="cvc" className="mb-2 block text-sm font-medium text-brand">
              CVC
            </label>
            <input
              id="cvc"
              inputMode="numeric"
              placeholder="123"
              value={cvc}
              onChange={(e) => setCvc(e.target.value)}
              className="input-glass"
            />
          </div>
        </div>
      </div>

      {error ? (
        <p className="mt-4 text-sm text-red-600" role="alert">
          {error}
        </p>
      ) : null}

      <button
        type="button"
        onClick={handlePay}
        disabled={paying}
        className="btn-glass-primary mt-6 w-full rounded-full px-7 py-4 font-semibold disabled:opacity-60"
      >
        {paying ? "Обрабатываем оплату…" : `Оплатить ${total.toLocaleString("ru-RU")} ₽`}
      </button>

      <p className="mt-3 text-center text-xs text-slate-600">
        Демонстрационная оплата — данные карты никуда не отправляются
      </p>
    </div>
  );
}
