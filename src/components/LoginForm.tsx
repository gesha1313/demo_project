"use client";

import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import { isValidEmail } from "@/lib/validation";

export default function LoginForm() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [emailTouched, setEmailTouched] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const emailValid = useMemo(() => isValidEmail(email), [email]);
  const showEmailError = emailTouched && email.length > 0 && !emailValid;
  const canSubmit = emailValid && password.length > 0 && !loading;

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!canSubmit) return;

    setLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) {
        const data = (await response.json()) as { error?: string };
        setError(data.error ?? "Не удалось войти");
        return;
      }

      router.push("/cabinet");
      router.refresh();
    } catch {
      setError("Сервер недоступен, попробуйте ещё раз");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="glass-strong relative w-full max-w-md overflow-hidden rounded-[2.5rem] p-8 md:p-10">
      <div className="pointer-events-none absolute -right-16 -top-16 h-48 w-48 rounded-full bg-white/50 blur-3xl" />

      <div className="relative">
        <h2 className="text-2xl font-semibold tracking-tight text-brand md:text-3xl">
          Вход в аккаунт
        </h2>

        <p className="mt-3 leading-7 text-slate-600">
          Войдите, чтобы оставить номер для связи, следить за заявкой
          и общаться с горячей линией.
        </p>

        <form className="mt-8 space-y-5" onSubmit={handleSubmit} noValidate>
          <div>
            <label htmlFor="email" className="mb-2 block text-sm font-medium text-brand">
              Email
            </label>
            <input
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              placeholder="you@example.ru"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              onBlur={() => setEmailTouched(true)}
              className="input-glass"
            />
            {showEmailError ? (
              <p className="mt-2 text-sm text-red-600">Проверьте адрес: похоже, есть опечатка</p>
            ) : null}
          </div>

          <div>
            <label htmlFor="password" className="mb-2 block text-sm font-medium text-brand">
              Пароль
            </label>
            <input
              id="password"
              name="password"
              type="password"
              autoComplete="current-password"
              placeholder="Ваш пароль"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="input-glass"
            />
          </div>

          {error ? (
            <p className="glass rounded-2xl px-4 py-3 text-sm text-red-600" role="alert">
              {error}
            </p>
          ) : null}

          <button
            type="submit"
            disabled={!canSubmit}
            className="btn-glass-primary w-full rounded-full px-7 py-4 text-center font-semibold disabled:cursor-not-allowed disabled:opacity-50"
          >
            {loading ? "Входим…" : "Войти"}
          </button>

          <p className="text-center text-sm text-slate-500">
            Нет аккаунта?{" "}
            <a href="/register" className="font-semibold text-blue-700 hover:text-blue-800">
              Зарегистрироваться
            </a>
          </p>
        </form>
      </div>
    </div>
  );
}
