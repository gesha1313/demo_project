"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import Reveal from "./Reveal";

export type PlanOption = {
  id: number;
  name: string;
  monthlyPrice: number;
  note: string | null;
  isPopular: boolean;
  features: string[];
};

const formatPrice = (price: number) => price.toLocaleString("ru-RU");

/**
 * Создание заявки в два шага:
 *   1 — данные подопечного (ФИО, паспорт, описание);
 *   2 — выбор тарифа и отправка.
 * Кнопка «Продолжить» активна только после заполнения первого шага.
 */
export default function RequestWizard({ plans }: { plans: PlanOption[] }) {
  const router = useRouter();

  const [step, setStep] = useState<1 | 2>(1);
  const [wardName, setWardName] = useState("");
  const [passport, setPassport] = useState("");
  const [description, setDescription] = useState("");
  const [planId, setPlanId] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const step1Valid =
    wardName.trim().length >= 3 &&
    passport.trim().length >= 3 &&
    description.trim().length >= 5;

  const handleSubmit = async () => {
    if (planId === null || submitting) return;

    setSubmitting(true);
    setError(null);

    try {
      const response = await fetch("/api/requests", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ wardName, passport, description, planId }),
      });

      if (!response.ok) {
        const data = (await response.json()) as { error?: string };
        setError(data.error ?? "Не удалось создать заявку");
        return;
      }

      router.push("/cabinet");
      router.refresh();
    } catch {
      setError("Сервер недоступен, попробуйте ещё раз");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="glass-strong relative w-full max-w-2xl overflow-hidden rounded-[2.5rem] p-7 md:p-10">
      <div className="pointer-events-none absolute -right-16 -top-16 h-48 w-48 rounded-full bg-white/50 blur-3xl" />

      <div className="relative">
        {/* Индикатор шагов */}
        <div className="flex items-center gap-3">
          {(["Данные подопечного", "Выбор тарифа"] as const).map((label, index) => {
            const number = (index + 1) as 1 | 2;
            const active = step === number;
            const passed = step > number;

            return (
              <div key={label} className="flex items-center gap-3">
                <span
                  className={`flex h-8 w-8 items-center justify-center rounded-full text-sm font-semibold transition-all duration-300 ${
                    passed
                      ? "bg-gradient-to-br from-blue-600 to-indigo-600 text-white"
                      : active
                        ? "glass-strong text-blue-700 ring-2 ring-blue-500/40"
                        : "bg-white/50 text-slate-400"
                  }`}
                >
                  {passed ? "✓" : number}
                </span>
                <span
                  className={`text-sm font-medium ${active ? "text-brand" : "text-slate-400"}`}
                >
                  {label}
                </span>
                {number === 1 ? <span className="mx-1 h-px w-6 bg-slate-300" /> : null}
              </div>
            );
          })}
        </div>

        {/* Шаг 1 — данные подопечного */}
        {step === 1 ? (
          <div className="mt-8 space-y-5">
            <div>
              <h2 className="text-2xl font-semibold tracking-tight text-brand">
                Расскажите о подопечном
              </h2>
              <p className="mt-2 text-sm leading-6 text-slate-500">
                Эти данные увидит сотрудник, который будет вести заявку.
              </p>
            </div>

            <div>
              <label htmlFor="ward-name" className="mb-2 block text-sm font-medium text-brand">
                ФИО подопечного
              </label>
              <input
                id="ward-name"
                type="text"
                placeholder="Иванов Иван Иванович"
                value={wardName}
                onChange={(e) => setWardName(e.target.value)}
                className="input-glass"
              />
            </div>

            <div>
              <label htmlFor="passport" className="mb-2 block text-sm font-medium text-brand">
                Паспортные данные
              </label>
              <input
                id="passport"
                type="text"
                placeholder="Серия, номер, кем выдан"
                value={passport}
                onChange={(e) => setPassport(e.target.value)}
                className="input-glass"
              />
            </div>

            <div>
              <label htmlFor="description" className="mb-2 block text-sm font-medium text-brand">
                Описание ситуации
              </label>
              <textarea
                id="description"
                rows={4}
                placeholder="Возраст, состояние, что важно учитывать при уходе"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="input-glass resize-none"
              />
            </div>

            <button
              type="button"
              disabled={!step1Valid}
              onClick={() => setStep(2)}
              className="btn-glass-primary w-full rounded-full px-7 py-4 text-center font-semibold disabled:cursor-not-allowed disabled:opacity-50"
            >
              Продолжить
            </button>

            {!step1Valid ? (
              <p className="text-center text-xs text-slate-400">
                Заполните все поля, чтобы перейти к выбору тарифа
              </p>
            ) : null}
          </div>
        ) : (
          /* Шаг 2 — выбор тарифа */
          <div className="mt-8">
            <div className="flex flex-col gap-1">
              <h2 className="text-2xl font-semibold tracking-tight text-brand">
                Выберите тариф
              </h2>
              <p className="text-sm leading-6 text-slate-500">
                Подопечный: <span className="font-medium text-slate-700">{wardName.trim()}</span>.
                Тариф можно будет изменить по согласованию.
              </p>
            </div>

            <div className="mt-6 space-y-4">
              {plans.map((plan) => {
                const selected = planId === plan.id;

                return (
                  <button
                    key={plan.id}
                    type="button"
                    onClick={() => setPlanId(plan.id)}
                    aria-pressed={selected}
                    className={`w-full rounded-[1.75rem] p-5 text-left transition-all duration-300 md:p-6 ${
                      selected
                        ? "glass-strong shadow-[0_16px_40px_rgba(13,36,74,0.15)] ring-2 ring-blue-500/50"
                        : "glass hover:-translate-y-0.5 hover:shadow-[0_12px_32px_rgba(13,36,74,0.1)]"
                    }`}
                  >
                    <div className="flex flex-wrap items-start justify-between gap-3">
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="text-lg font-semibold text-brand">{plan.name}</h3>
                          {plan.isPopular ? (
                            <span className="rounded-full bg-blue-100/80 px-2.5 py-0.5 text-xs font-semibold text-blue-700">
                              Популярный
                            </span>
                          ) : null}
                        </div>
                        {plan.note ? (
                          <p className="mt-0.5 text-sm text-slate-500">{plan.note}</p>
                        ) : null}
                      </div>

                      <div className="text-right">
                        <div className="text-xl font-semibold text-brand">
                          {formatPrice(plan.monthlyPrice)} ₽
                        </div>
                        <div className="text-xs text-slate-400">в месяц</div>
                      </div>
                    </div>

                    <ul className="mt-4 grid gap-1.5 sm:grid-cols-2">
                      {plan.features.map((feature) => (
                        <li
                          key={feature}
                          className="flex items-start gap-2 text-sm text-slate-600"
                        >
                          <span className="mt-0.5 text-blue-700">✓</span>
                          {feature}
                        </li>
                      ))}
                    </ul>
                  </button>
                );
              })}
            </div>

            {error ? (
              <p className="glass mt-5 rounded-2xl px-4 py-3 text-sm text-red-600" role="alert">
                {error}
              </p>
            ) : null}

            <div className="mt-7 flex flex-col gap-3 sm:flex-row">
              <button
                type="button"
                onClick={() => setStep(1)}
                disabled={submitting}
                className="btn-glass-ghost rounded-full px-7 py-4 text-center font-semibold"
              >
                ← Назад к данным
              </button>

              <button
                type="button"
                onClick={handleSubmit}
                disabled={planId === null || submitting}
                className="btn-glass-primary flex-1 rounded-full px-7 py-4 text-center font-semibold disabled:cursor-not-allowed disabled:opacity-50"
              >
                {submitting ? "Создаём заявку…" : "Создать заявку"}
              </button>
            </div>

            {planId === null ? (
              <p className="mt-4 text-center text-xs text-slate-400">
                Выберите тариф, чтобы создать заявку
              </p>
            ) : null}
          </div>
        )}
      </div>
    </div>
  );
}
