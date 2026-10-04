"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

type ProfileCardProps = {
  initialFullName: string | null;
  initialPhone: string | null;
};

export default function ProfileCard({ initialFullName, initialPhone }: ProfileCardProps) {
  const router = useRouter();
  const [fullName, setFullName] = useState(initialFullName ?? "");
  const [phone, setPhone] = useState(initialPhone ?? "");
  const [status, setStatus] = useState<"idle" | "saving" | "saved" | "error">("idle");
  const [error, setError] = useState<string | null>(null);

  const phoneValid = !phone || /^[+0-9()\-\s]{6,20}$/.test(phone);

  const handleSave = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!phoneValid || status === "saving") return;

    setStatus("saving");
    setError(null);

    try {
      const response = await fetch("/api/profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ fullName, phone }),
      });

      if (!response.ok) {
        const data = (await response.json()) as { error?: string };
        setError(data.error ?? "Не удалось сохранить");
        setStatus("error");
        return;
      }

      setStatus("saved");
      // Убираем ?edit=1 и обновляем серверные данные — после этого
      // форма исчезнет, кабинет покажет сохранённые контакты
      router.push("/cabinet");
      router.refresh();
      window.setTimeout(() => setStatus("idle"), 2500);
    } catch {
      setError("Сервер недоступен, попробуйте ещё раз");
      setStatus("error");
    }
  };

  return (
    <div className="glass rounded-[2rem] p-7 md:p-8">
      <h2 className="text-lg font-semibold text-brand">Контакты для связи</h2>
      <p className="mt-1 text-sm text-slate-500">
        Оставьте имя и телефон — сотрудник пансионата перезвонит вам.
      </p>

      <form className="mt-6 space-y-4" onSubmit={handleSave}>
        <div>
          <label htmlFor="full-name" className="mb-2 block text-sm font-medium text-brand">
            Ваше имя
          </label>
          <input
            id="full-name"
            type="text"
            placeholder="Как к вам обращаться"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            className="input-glass"
          />
        </div>

        <div>
          <label htmlFor="phone" className="mb-2 block text-sm font-medium text-brand">
            Телефон для связи
          </label>
          <input
            id="phone"
            type="tel"
            placeholder="+7 (___) ___-__-__"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            className="input-glass"
          />
          {!phoneValid ? (
            <p className="mt-2 text-sm text-red-600">Похоже, в номере есть опечатка</p>
          ) : null}
        </div>

        {error ? <p className="text-sm text-red-600" role="alert">{error}</p> : null}

        <div className="flex items-center gap-4">
          <button
            type="submit"
            disabled={status === "saving" || !phoneValid}
            className="btn-glass-primary rounded-full px-6 py-3 text-sm font-semibold disabled:cursor-not-allowed disabled:opacity-50"
          >
            {status === "saving" ? "Сохраняем…" : "Сохранить"}
          </button>

          {status === "saved" ? (
            <span className="text-sm font-medium text-emerald-600" role="status">
              Сохранено ✓
            </span>
          ) : null}
        </div>
      </form>
    </div>
  );
}
