"use client";

import { useCallback, useEffect, useRef, useState } from "react";

type Message = {
  id: number;
  sender_id: number;
  body: string;
  created_at: string;
};

const POLL_INTERVAL_MS = 3000;

export default function SupportChat({ myId }: { myId: number }) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [draft, setDraft] = useState("");
  const [sending, setSending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const bottomRef = useRef<HTMLDivElement>(null);

  const load = useCallback(async () => {
    try {
      const response = await fetch("/api/chat", { cache: "no-store" });
      if (!response.ok) return;
      const data = (await response.json()) as { messages: Message[] };
      setMessages(data.messages);
    } catch {
      // Следующий опрос повторит попытку
    }
  }, []);

  useEffect(() => {
    const initial = window.setTimeout(load, 0);
    const timer = window.setInterval(load, POLL_INTERVAL_MS);
    return () => {
      window.clearTimeout(initial);
      window.clearInterval(timer);
    };
  }, [load]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
  }, [messages.length]);

  const handleSend = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const text = draft.trim();
    if (!text || sending) return;

    setSending(true);
    setError(null);

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ body: text }),
      });

      if (!response.ok) {
        const data = (await response.json()) as { error?: string };
        setError(data.error ?? "Не удалось отправить сообщение");
        return;
      }

      setDraft("");
      await load();
    } catch {
      setError("Сервер недоступен, попробуйте ещё раз");
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="glass flex h-[70vh] min-h-[480px] flex-col overflow-hidden rounded-[2rem]">
      {/* Шапка чата */}
      <div className="glass-strong flex items-center gap-3 border-b border-white/60 px-6 py-4">
        <span className="relative flex h-3 w-3">
          <span className="absolute h-full w-full animate-ping rounded-full bg-emerald-400/70" />
          <span className="h-3 w-3 rounded-full bg-emerald-500" />
        </span>
        <div>
          <div className="text-sm font-semibold text-brand">Горячая линия пансионата</div>
          <div className="text-xs text-slate-500">Мы на связи в рабочее время</div>
        </div>
      </div>

      {/* Лента сообщений */}
      <div className="flex-1 space-y-3 overflow-y-auto px-5 py-5">
        {messages.map((message) => {
          const mine = message.sender_id === myId;
          return (
            <div key={message.id} className={`flex ${mine ? "justify-end" : "justify-start"}`}>
              <div
                className={`max-w-[80%] rounded-2xl px-4 py-2.5 text-sm leading-6 ${
                  mine
                    ? "bg-gradient-to-br from-blue-600 to-indigo-600 text-white shadow-md shadow-blue-700/20"
                    : "glass-strong text-slate-700"
                }`}
              >
                <p>{message.body}</p>
                <span
                  className={`mt-1 block text-[10px] ${
                    mine ? "text-blue-100/80" : "text-slate-400"
                  }`}
                >
                  {message.created_at.slice(11, 16)}
                </span>
              </div>
            </div>
          );
        })}

        {messages.length === 0 ? (
          <p className="pt-10 text-center text-sm text-slate-400">
            Загружаем историю сообщений…
          </p>
        ) : null}

        <div ref={bottomRef} />
      </div>

      {/* Поле ввода */}
      <form className="glass-strong border-t border-white/60 px-5 py-4" onSubmit={handleSend}>
        {error ? (
          <p className="mb-2 text-sm text-red-600" role="alert">
            {error}
          </p>
        ) : null}
        <div className="flex items-end gap-3">
          <textarea
            rows={1}
            placeholder="Напишите сообщение…"
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                handleSend(e as unknown as React.FormEvent<HTMLFormElement>);
              }
            }}
            className="input-glass max-h-32 min-h-[3rem] flex-1 resize-none"
          />
          <button
            type="submit"
            disabled={sending || !draft.trim()}
            className="btn-glass-primary shrink-0 rounded-full px-6 py-3.5 text-sm font-semibold disabled:cursor-not-allowed disabled:opacity-50"
          >
            {sending ? "…" : "Отправить"}
          </button>
        </div>
      </form>
    </div>
  );
}
