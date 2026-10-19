"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

/** Кнопка «Перенести к другой сиделке» на странице заявки (для клиента). */
export default function TransferButton({ requestId }: { requestId: number }) {
  const router = useRouter();
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [done, setDone] = useState<string | null>(null);

  const handleTransfer = async () => {
    if (busy) return;
    setBusy(true);
    setError(null);
    setDone(null);

    try {
      const response = await fetch("/api/caretaker/transfer", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ requestId }),
      });

      const data = (await response.json()) as { error?: string; caretakerName?: string };

      if (!response.ok) {
        setError(data.error ?? "Не удалось перенести заявку");
        return;
      }

      setDone(`Заявка передана сиделке ${data.caretakerName}`);
      router.refresh();
    } catch {
      setError("Сервер недоступен, попробуйте ещё раз");
    } finally {
      setBusy(false);
    }
  };

  return (
    <div>
      {error ? (
        <p className="mb-2 text-sm text-red-600" role="alert">
          {error}
        </p>
      ) : null}
      {done ? (
        <p className="mb-2 text-sm font-medium text-sky-600" role="status">
          {done}
        </p>
      ) : null}
      <button
        type="button"
        onClick={() => void handleTransfer()}
        disabled={busy}
        className="btn-glass-ghost rounded-full px-6 py-3.5 text-sm font-semibold disabled:opacity-50"
      >
        {busy ? "Переносим…" : "Перенести к другой сиделке"}
      </button>
    </div>
  );
}
