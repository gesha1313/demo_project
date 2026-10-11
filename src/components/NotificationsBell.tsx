"use client";

import { useCallback, useEffect, useRef, useState } from "react";

type Notification = {
  id: number;
  kind: string;
  title: string;
  body: string | null;
  is_read: number;
  created_at: string;
};

const POLL_INTERVAL_MS = 20000;

const KIND_STYLES: Record<string, string> = {
  offered: "bg-blue-100/80 text-blue-700",
  accepted: "bg-emerald-100/80 text-emerald-700",
  declined: "bg-red-100/80 text-red-600",
  transferred: "bg-amber-100/80 text-amber-700",
  queued: "bg-amber-100/80 text-amber-700",
  info: "bg-slate-200/80 text-slate-600",
};

const formatTime = (value: string) => {
  const date = new Date(value.replace(" ", "T"));
  if (Number.isNaN(date.getTime())) return value;
  return date.toLocaleString("ru-RU", {
    day: "2-digit",
    month: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  });
};

/** Колокол уведомлений в шапке (для вошедших пользователей). */
export default function NotificationsBell() {
  const [open, setOpen] = useState(false);
  const [items, setItems] = useState<Notification[]>([]);
  const [unread, setUnread] = useState(0);
  const rootRef = useRef<HTMLDivElement>(null);

  const load = useCallback(async () => {
    try {
      const response = await fetch("/api/notifications", { cache: "no-store" });
      if (!response.ok) return;
      const data = (await response.json()) as {
        notifications: Notification[];
        unread: number;
      };
      setItems(data.notifications);
      setUnread(data.unread);
    } catch {
      // следующий опрос повторит
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

  // Закрытие по клику вне панели
  useEffect(() => {
    const onClick = (event: MouseEvent) => {
      if (rootRef.current && !rootRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, []);

  const markRead = async () => {
    try {
      await fetch("/api/notifications", { method: "POST" });
      setUnread(0);
      setItems((current) => current.map((n) => ({ ...n, is_read: 1 })));
    } catch {}
  };

  return (
    <div ref={rootRef} className="relative">
      <button
        type="button"
        onClick={() => {
          setOpen((v) => !v);
          if (!open && unread > 0) void markRead();
        }}
        aria-label={`Уведомления${unread ? ` (${unread} новых)` : ""}`}
        className="relative flex h-11 w-11 items-center justify-center rounded-full border border-white/70 bg-white/50 backdrop-blur-md transition-colors hover:bg-white/80"
      >
        {/* Колокол */}
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth={1.8}
          strokeLinecap="round"
          strokeLinejoin="round"
          className="h-5 w-5 text-slate-700"
          aria-hidden
        >
          <path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9" />
          <path d="M10.3 21a1.94 1.94 0 0 0 3.4 0" />
        </svg>

        {unread > 0 ? (
          <span className="absolute -right-0.5 -top-0.5 flex h-5 min-w-5 items-center justify-center rounded-full bg-red-500 px-1 text-[10px] font-bold text-white shadow">
            {unread > 9 ? "9+" : unread}
          </span>
        ) : null}
      </button>

      {/* Панель уведомлений */}
      {open ? (
        <div className="glass-strong absolute right-0 top-13 z-50 w-80 max-w-[calc(100vw-3rem)] overflow-hidden rounded-2xl p-2 shadow-xl animate-fade-up">
          <div className="flex items-center justify-between px-3 py-2">
            <span className="text-sm font-semibold text-brand">Уведомления</span>
            {unread > 0 ? (
              <span className="text-xs text-slate-400">{unread} новых</span>
            ) : null}
          </div>

          <div className="max-h-80 space-y-1.5 overflow-y-auto px-1 pb-1">
            {items.length === 0 ? (
              <p className="px-3 py-6 text-center text-sm text-slate-400">
                Пока нет уведомлений
              </p>
            ) : (
              items.map((item) => (
                <div
                  key={item.id}
                  className={`rounded-xl px-3 py-2.5 ${
                    item.is_read ? "bg-white/40" : "bg-white/75 shadow-sm"
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <span
                      className={`h-1.5 w-1.5 shrink-0 rounded-full ${
                        item.is_read ? "bg-slate-300" : "bg-blue-600"
                      }`}
                    />
                    <span className="truncate text-sm font-semibold text-brand">
                      {item.title}
                    </span>
                    <span
                      className={`ml-auto shrink-0 rounded-full px-2 py-0.5 text-[10px] font-semibold ${
                        KIND_STYLES[item.kind] ?? KIND_STYLES.info
                      }`}
                    >
                      {item.kind === "offered"
                        ? "на рассмотрении"
                        : item.kind === "accepted"
                          ? "одобрена"
                          : item.kind === "declined"
                            ? "отклонена"
                            : item.kind === "transferred"
                              ? "перенесена"
                              : item.kind === "queued"
                                ? "в очереди"
                                : ""}
                    </span>
                  </div>
                  {item.body ? (
                    <p className="mt-1 pl-3.5 text-xs leading-5 text-slate-600">
                      {item.body}
                    </p>
                  ) : null}
                  <div className="mt-1 pl-3.5 text-[10px] text-slate-400">
                    {formatTime(item.created_at)}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      ) : null}
    </div>
  );
}
