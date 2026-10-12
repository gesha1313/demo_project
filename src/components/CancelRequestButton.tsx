"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

/** Кнопка отмены неактивной заявки на сиделку (в очереди или без сиделки). */
export default function CancelRequestButton({ requestId }: { requestId: number }) {
  const router = useRouter();
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleCancel = async () => {
    if (busy) return;
    setBusy(true);
    setError(null);

    try {
      const response = await fetch("/api/caretaker/cancel", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ requestId }),
      });

      if (!response.ok) {
        const data = (await response.json()) as { error?: string };
        setError(data.error ?? "Не удалось отменить заявку");
        return;
      }

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
      <button
        type="button"
        onClick={() => void handleCancel()}
        disabled={busy}
        className="rounded-full border border-red-200 bg-white/60 px-6 py-3 text-sm font-semibold text-red-600 backdrop-blur-md transition-all duration-200 hover:bg-red-50 active:scale-[0.98] disabled:opacity-50"
      >
        {busy ? "Отменяем…" : "Отменить заявку"}
      </button>
    </div>
  );
}
