"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export default function CaretakerDecideButtons({ requestId }: { requestId: number }) {
  const router = useRouter();
  const [busy, setBusy] = useState<"accept" | "decline" | null>(null);
  const [error, setError] = useState<string | null>(null);

  const decide = async (decision: "accept" | "decline") => {
    if (busy) return;
    setBusy(decision);
    setError(null);

    try {
      const response = await fetch("/api/caretaker/decide", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ requestId, decision }),
      });

      if (!response.ok) {
        const data = (await response.json()) as { error?: string };
        setError(data.error ?? "Не удалось сохранить решение");
        return;
      }

      router.refresh();
    } catch {
      setError("Сервер недоступен, попробуйте ещё раз");
    } finally {
      setBusy(null);
    }
  };

  return (
    <div>
      {error ? (
        <p className="mb-2 text-sm text-red-600" role="alert">
          {error}
        </p>
      ) : null}
      <div className="flex flex-col gap-3 sm:flex-row">
        <button
          type="button"
          onClick={() => void decide("accept")}
          disabled={busy !== null}
          className="btn-glass-primary rounded-lg px-6 py-3 text-sm font-semibold disabled:opacity-50"
        >
          {busy === "accept" ? "Принимаем…" : "Принять"}
        </button>
        <button
          type="button"
          onClick={() => void decide("decline")}
          disabled={busy !== null}
          className="rounded-full border border-red-200 bg-white/60 px-6 py-3 text-sm font-semibold text-red-600 backdrop-blur-md transition-all duration-200 hover:bg-red-50 active:scale-[0.98] disabled:opacity-50"
        >
          {busy === "decline" ? "Отказываем…" : "Отказаться"}
        </button>
      </div>
    </div>
  );
}
