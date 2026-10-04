"use client";

import { useCallback, useEffect, useRef, useState } from "react";type RequestRow = {
  id: number;
  user_id: number;
  employee_id: number | null;
  status: string;
  message: string | null;
  created_at: string;
  email: string;
  phone: string | null;
  full_name: string | null;
  employee_email: string | null;
  ward_name: string | null;
  passport: string | null;
  description: string | null;
  plan_name: string | null;
  monthly_price: number | null;
};

type UserRow = {
  id: number;
  email: string;
  role: string;
  full_name: string | null;
  phone: string | null;
  created_at: string;
  requests_count: number;
};

type ConversationRow = {
  id: number;
  user_id: number;
  status: string;
  updated_at: string;
  email: string;
  phone: string | null;
  last_message: string | null;
};

type ChatMessage = {
  id: number;
  sender_id: number;
  body: string;
  created_at: string;
  sender_email: string;
};

const STATUS_OPTIONS = [
  { value: "new", label: "Новая" },
  { value: "in_progress", label: "В работе" },
  { value: "done", label: "Завершена" },
  { value: "cancelled", label: "Отменена" },
];

const STATUS_STYLES: Record<string, string> = {
  new: "bg-blue-100/80 text-blue-700",
  in_progress: "bg-amber-100/80 text-amber-700",
  done: "bg-emerald-100/80 text-emerald-700",
  cancelled: "bg-slate-200/80 text-slate-500",
};

const ROLE_OPTIONS = [
  { value: "user", label: "Клиент" },
  { value: "employee", label: "Сотрудник" },
  { value: "admin", label: "Администратор" },
];

type Tab = "requests" | "users" | "chat";

export default function AdminDashboard({
  role,
  myId,
}: {
  role: "admin" | "employee";
  myId: number;
}) {
  const [tab, setTab] = useState<Tab>("requests");
  const [requests, setRequests] = useState<RequestRow[]>([]);
  const [employees, setEmployees] = useState<{ id: number; email: string }[]>([]);
  const [users, setUsers] = useState<UserRow[]>([]);
  const [conversations, setConversations] = useState<ConversationRow[]>([]);
  const [busyRow, setBusyRow] = useState<number | null>(null);
  /** Выбранный диалог горячей линии (общий для таба чата) */
  const [activeConversationId, setActiveConversationId] = useState<number | null>(null);
  /** Удаление заявки: раскрытая форма и причина */
  const [deletingRowId, setDeletingRowId] = useState<number | null>(null);
  const [deleteReason, setDeleteReason] = useState("");
  const [deleteError, setDeleteError] = useState<string | null>(null);

  const loadRequests = useCallback(async () => {
    const response = await fetch("/api/admin/requests", { cache: "no-store" });
    if (!response.ok) return;
    const data = (await response.json()) as {
      requests: RequestRow[];
      employees: { id: number; email: string }[];
    };
    setRequests(data.requests);
    setEmployees(data.employees);
  }, []);

  const loadUsers = useCallback(async () => {
    const response = await fetch("/api/admin/users", { cache: "no-store" });
    if (!response.ok) return;
    const data = (await response.json()) as { users: UserRow[] };
    setUsers(data.users);
  }, []);

  const loadConversations = useCallback(async () => {
    const response = await fetch("/api/admin/chat", { cache: "no-store" });
    if (!response.ok) return;
    const data = (await response.json()) as { conversations: ConversationRow[] };
    setConversations(data.conversations);
  }, []);

  useEffect(() => {
    const loadAll = () => {
      loadRequests();
      if (role === "admin") loadUsers();
    };
    const initial = window.setTimeout(loadAll, 0);
    return () => window.clearTimeout(initial);
  }, [loadRequests, loadUsers, role]);

  const updateRequest = async (
    id: number,
    patch: { status?: string; employeeId?: number | null },
  ) => {
    setBusyRow(id);
    try {
      await fetch("/api/admin/requests", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, ...patch }),
      });
      await loadRequests();
    } finally {
      setBusyRow(null);
    }
  };

  const updateUserRole = async (id: number, newRole: string) => {
    await fetch("/api/admin/users", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, role: newRole }),
    });
    await loadUsers();
  };

  /** Удаление заявки с обязательной причиной (минимум 20 символов). */
  const handleDeleteRequest = async (id: number) => {
    if (deleteReason.trim().length < 20) return;

    setBusyRow(id);
    setDeleteError(null);

    try {
      const response = await fetch("/api/admin/requests", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, reason: deleteReason.trim() }),
      });

      if (!response.ok) {
        const data = (await response.json()) as { error?: string };
        setDeleteError(data.error ?? "Не удалось удалить заявку");
        return;
      }

      setDeletingRowId(null);
      setDeleteReason("");
      await loadRequests();
    } finally {
      setBusyRow(null);
    }
  };

  /** Переходник «заявка → чат»: открывает переписку с клиентом из заявки. */
  const openChatWithUser = useCallback(async (userId: number) => {
    try {
      const response = await fetch("/api/admin/chat", { cache: "no-store" });
      if (!response.ok) return;
      const data = (await response.json()) as { conversations: ConversationRow[] };
      setConversations(data.conversations);

      const conversation = data.conversations.find((c) => c.user_id === userId);
      if (conversation) {
        setActiveConversationId(conversation.id);
        setTab("chat");
      } else {
        setTab("chat");
        setActiveConversationId(null);
      }
    } catch {
      setTab("chat");
    }
  }, []);

  const tabs: { id: Tab; label: string; adminOnly?: boolean }[] = [
    { id: "requests", label: role === "admin" ? "Все заявки" : "Мои заявки" },
    { id: "users", label: "Пользователи", adminOnly: true },
    { id: "chat", label: "Горячая линия" },
  ];

  return (
    <div>
      {/* Табы */}
      <div className="glass inline-flex flex-wrap gap-1 rounded-full p-1.5">
        {tabs
          .filter((t) => !t.adminOnly || role === "admin")
          .map((t) => (
            <button
              key={t.id}
              type="button"
              onClick={() => {
                setTab(t.id);
                if (t.id === "chat") loadConversations();
              }}
              className={`rounded-full px-5 py-2.5 text-sm font-medium transition-all duration-200 ${
                tab === t.id
                  ? "bg-gradient-to-br from-blue-600 to-indigo-600 text-white shadow-md shadow-blue-700/25"
                  : "text-slate-600 hover:bg-white/60 hover:text-blue-700"
              }`}
            >
              {t.label}
            </button>
          ))}
      </div>

      {/* === ЗАЯВКИ === */}
      {tab === "requests" ? (
        <div className="mt-8 grid gap-5 lg:grid-cols-2">
          {requests.length === 0 ? (
            <p className="glass rounded-2xl px-6 py-8 text-sm text-slate-500">
              {role === "admin"
                ? "Заявок пока нет."
                : "У вас пока нет назначенных заявок — распределение выполняет администратор."}
            </p>
          ) : null}

          {requests.map((request) => (
            <div key={request.id} className="glass rounded-[1.75rem] p-6">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <div className="text-sm font-semibold text-brand">
                    {request.full_name?.trim() || request.email}
                  </div>
                  <div className="text-xs text-slate-500">
                    №{request.id} · {request.created_at.slice(0, 10)} · {request.email}
                  </div>
                </div>
                <span
                  className={`shrink-0 rounded-full px-3 py-1 text-xs font-semibold ${
                    STATUS_STYLES[request.status] ?? STATUS_STYLES.new
                  }`}
                >
                  {STATUS_OPTIONS.find((s) => s.value === request.status)?.label ?? request.status}
                </span>
              </div>

              <div className="mt-4 space-y-1 text-sm text-slate-600">
                {request.ward_name ? (
                  <div>
                    <span className="text-slate-400">Подопечный: </span>
                    <span className="font-medium text-brand">{request.ward_name}</span>
                  </div>
                ) : null}

                {request.plan_name ? (
                  <div>
                    <span className="text-slate-400">Тариф: </span>
                    <span className="rounded-full bg-blue-100/80 px-2.5 py-0.5 text-xs font-semibold text-blue-700">
                      {request.plan_name}
                      {request.monthly_price
                        ? ` · ${request.monthly_price.toLocaleString("ru-RU")} ₽/мес`
                        : ""}
                    </span>
                  </div>
                ) : null}

                <div>
                  <span className="text-slate-400">Телефон: </span>
                  {request.phone ?? <span className="text-slate-400">не оставлен</span>}
                </div>

                {request.passport ? (
                  <div>
                    <span className="text-slate-400">Паспорт: </span>
                    {request.passport}
                  </div>
                ) : null}

                {(request.description ?? request.message) ? (
                  <p className="glass-strong mt-2 rounded-2xl px-4 py-3 leading-6">
                    {request.description ?? request.message}
                  </p>
                ) : null}
              </div>

              <div className="mt-5 flex flex-wrap items-center gap-3">
                <select
                  value={request.status}
                  disabled={busyRow === request.id}
                  onChange={(e) => updateRequest(request.id, { status: e.target.value })}
                  className="input-glass w-auto py-2.5 text-sm"
                  aria-label="Статус заявки"
                >
                  {STATUS_OPTIONS.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>

                {role === "admin" ? (
                  <select
                    value={request.employee_id ?? ""}
                    disabled={busyRow === request.id}
                    onChange={(e) =>
                      updateRequest(request.id, {
                        employeeId: e.target.value ? Number(e.target.value) : null,
                      })
                    }
                    className="input-glass w-auto py-2.5 text-sm"
                    aria-label="Сотрудник"
                  >
                    <option value="">— не назначен —</option>
                    {employees.map((employee) => (
                      <option key={employee.id} value={employee.id}>
                        {employee.email}
                      </option>
                    ))}
                  </select>
                ) : (
                  <span className="text-xs text-slate-400">
                    {request.employee_email
                      ? `Сотрудник: ${request.employee_email}`
                      : "Сотрудник не назначен"}
                  </span>
                )}

                <button
                  type="button"
                  onClick={() => void openChatWithUser(request.user_id)}
                  className="ml-auto text-sm font-semibold text-blue-700 transition-all duration-200 hover:translate-x-1 hover:text-blue-800"
                >
                  Переписка →
                </button>

                {/* Удаление доступно только для новых и отменённых заявок */}
                {request.status === "new" || request.status === "cancelled" ? (
                  <button
                    type="button"
                    onClick={() => {
                      setDeletingRowId(deletingRowId === request.id ? null : request.id);
                      setDeleteReason("");
                      setDeleteError(null);
                    }}
                    className="text-sm font-semibold text-red-600 transition-colors hover:text-red-700"
                  >
                    {deletingRowId === request.id ? "Скрыть" : "Удалить"}
                  </button>
                ) : null}
              </div>

              {/* Форма удаления с обязательной причиной */}
              {deletingRowId === request.id ? (
                <div className="glass-strong mt-4 rounded-2xl p-4">
                  <label
                    htmlFor={`delete-reason-${request.id}`}
                    className="block text-sm font-medium text-brand"
                  >
                    Причина удаления{" "}
                    <span className="font-normal text-slate-400">
                      (минимум 20 символов: {deleteReason.trim().length}/20)
                    </span>
                  </label>
                  <textarea
                    id={`delete-reason-${request.id}`}
                    rows={2}
                    placeholder="Например: клиент передумал и попросил убрать заявку из списка"
                    value={deleteReason}
                    onChange={(e) => setDeleteReason(e.target.value)}
                    className="input-glass mt-2 resize-none"
                  />

                  {deleteError ? (
                    <p className="mt-2 text-sm text-red-600" role="alert">
                      {deleteError}
                    </p>
                  ) : null}

                  <div className="mt-3 flex flex-wrap gap-3">
                    <button
                      type="button"
                      onClick={() => void handleDeleteRequest(request.id)}
                      disabled={deleteReason.trim().length < 20 || busyRow === request.id}
                      className="rounded-full bg-red-600 px-5 py-2.5 text-sm font-semibold text-white shadow-md shadow-red-600/25 transition-all duration-200 hover:bg-red-700 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      {busyRow === request.id ? "Удаляем…" : "Удалить заявку"}
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setDeletingRowId(null);
                        setDeleteReason("");
                        setDeleteError(null);
                      }}
                      className="btn-glass-ghost rounded-full px-5 py-2.5 text-sm font-semibold"
                    >
                      Отмена
                    </button>
                  </div>
                </div>
              ) : null}
            </div>
          ))}
        </div>
      ) : null}

      {/* === ПОЛЬЗОВАТЕЛИ === */}
      {tab === "users" && role === "admin" ? (
        <div className="glass mt-8 overflow-x-auto rounded-[1.75rem]">
          <table className="w-full min-w-[640px] text-left text-sm">
            <thead>
              <tr className="border-b border-white/60 text-xs uppercase tracking-wide text-slate-400">
                <th className="px-6 py-4 font-semibold">Пользователь</th>
                <th className="px-6 py-4 font-semibold">Телефон</th>
                <th className="px-6 py-4 font-semibold">Заявок</th>
                <th className="px-6 py-4 font-semibold">Роль</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user.id} className="border-b border-white/40 last:border-0">
                  <td className="px-6 py-4">
                    <div className="font-medium text-brand">
                      {user.full_name?.trim() || user.email}
                    </div>
                    <div className="text-xs text-slate-400">
                      {user.email} · с {user.created_at.slice(0, 10)}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-slate-600">
                    {user.phone ?? <span className="text-slate-400">—</span>}
                  </td>
                  <td className="px-6 py-4 text-slate-600">{user.requests_count}</td>
                  <td className="px-6 py-4">
                    <select
                      value={user.role}
                      onChange={(e) => updateUserRole(user.id, e.target.value)}
                      className="input-glass w-auto py-2 text-sm"
                      aria-label={`Роль пользователя ${user.email}`}
                    >
                      {ROLE_OPTIONS.map((option) => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : null}

      {/* === ГОРЯЧАЯ ЛИНИЯ === */}
      {tab === "chat" ? (
        <AdminChat
          conversations={conversations}
          reload={loadConversations}
          myId={myId}
          activeId={activeConversationId}
          onSelect={setActiveConversationId}
        />
      ) : null}
    </div>
  );
}

/** Чат поддержки: список диалогов слева, переписка справа. */
function AdminChat({
  conversations,
  reload,
  myId,
  activeId,
  onSelect,
}: {
  conversations: ConversationRow[];
  reload: () => Promise<void>;
  myId: number;
  activeId: number | null;
  onSelect: (id: number | null) => void;
}) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [draft, setDraft] = useState("");
  const [sending, setSending] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  const loadMessages = useCallback(async (conversationId: number) => {
    const response = await fetch(
      `/api/admin/chat?conversationId=${conversationId}`,
      { cache: "no-store" },
    );
    if (!response.ok) return;
    const data = (await response.json()) as { messages: ChatMessage[] };
    setMessages(data.messages);
  }, []);

  useEffect(() => {
    if (!activeId) return;
    const initial = window.setTimeout(() => loadMessages(activeId), 0);
    const timer = window.setInterval(() => loadMessages(activeId), 3000);
    return () => {
      window.clearTimeout(initial);
      window.clearInterval(timer);
    };
  }, [activeId, loadMessages]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
  }, [messages.length]);

  const handleReply = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const text = draft.trim();
    if (!text || sending || !activeId) return;

    setSending(true);
    try {
      const response = await fetch("/api/admin/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ conversationId: activeId, body: text }),
      });
      if (response.ok) {
        setDraft("");
        await Promise.all([loadMessages(activeId), reload()]);
      }
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="mt-8 grid gap-5 lg:grid-cols-[340px_1fr]">
      {/* Список диалогов */}
      <div className="glass max-h-[70vh] space-y-2 overflow-y-auto rounded-[1.75rem] p-4">
        {conversations.length === 0 ? (
          <p className="px-3 py-6 text-sm text-slate-400">Обращений в чат пока нет</p>
        ) : null}

        {conversations.map((conversation) => (
          <button
            key={conversation.id}
            type="button"
            onClick={() => onSelect(conversation.id)}
            className={`w-full rounded-2xl px-4 py-3 text-left transition-all duration-200 ${
              activeId === conversation.id
                ? "glass-strong shadow-md"
                : "hover:bg-white/50"
            }`}
          >
            <div className="flex items-center justify-between gap-2">
              <span className="truncate text-sm font-semibold text-brand">
                {conversation.email}
              </span>
              <span className="shrink-0 text-[10px] text-slate-400">
                {conversation.updated_at.slice(5, 16).replace("T", " ")}
              </span>
            </div>
            <p className="mt-1 truncate text-xs text-slate-500">
              {conversation.last_message ?? "Нет сообщений"}
            </p>
          </button>
        ))}
      </div>

      {/* Переписка */}
      <div className="glass flex h-[70vh] min-h-[420px] flex-col overflow-hidden rounded-[1.75rem]">
        {activeId === null ? (
          <div className="flex flex-1 items-center justify-center px-6 text-center text-sm text-slate-400">
            Выберите диалог слева, чтобы ответить клиенту
          </div>
        ) : (
          <>
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
                      {!mine ? (
                        <span className="mb-0.5 block text-[10px] font-semibold text-blue-700">
                          {message.sender_email}
                        </span>
                      ) : null}
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
              <div ref={bottomRef} />
            </div>

            <form className="glass-strong border-t border-white/60 px-5 py-4" onSubmit={handleReply}>
              <div className="flex items-end gap-3">
                <textarea
                  rows={1}
                  placeholder="Ответ клиенту…"
                  value={draft}
                  onChange={(e) => setDraft(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && !e.shiftKey) {
                      e.preventDefault();
                      handleReply(e as unknown as React.FormEvent<HTMLFormElement>);
                    }
                  }}
                  className="input-glass max-h-32 min-h-[3rem] flex-1 resize-none"
                />
                <button
                  type="submit"
                  disabled={sending || !draft.trim()}
                  className="btn-glass-primary shrink-0 rounded-full px-6 py-3.5 text-sm font-semibold disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {sending ? "…" : "Ответить"}
                </button>
              </div>
            </form>
          </>
        )}
      </div>
    </div>
  );
}
