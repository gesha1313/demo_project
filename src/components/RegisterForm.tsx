"use client";

import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import { isValidEmail, scorePassword } from "@/lib/validation";

const SEGMENT_COLORS: Record<string, string> = {
  weak: "bg-red-500",
  medium: "bg-orange-400",
  strong: "bg-emerald-500",
};

const LABEL_COLORS: Record<string, string> = {
  weak: "text-red-600",
  medium: "text-orange-500",
  strong: "text-emerald-600",
};

export default function RegisterForm() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordRepeat, setPasswordRepeat] = useState("");
  const [consent, setConsent] = useState(false);

  const [emailTouched, setEmailTouched] = useState(false);
  const [repeatTouched, setRepeatTouched] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const emailValid = useMemo(() => isValidEmail(email), [email]);
  const strength = useMemo(() => scorePassword(password), [password]);
  const passwordsMatch = password === passwordRepeat;

  const showEmailError = emailTouched && email.length > 0 && !emailValid;
  const showRepeatError = repeatTouched && !passwordsMatch;

  const canSubmit =
    emailValid &&
    strength.acceptable &&
    passwordsMatch &&
    consent &&
    !loading;

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!canSubmit) return;

    setLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) {
        const data = (await response.json()) as { error?: string };
        setError(data.error ?? "Не удалось зарегистрироваться");
        return;
      }

      router.push("/register/success");
    } catch {
      setError("Сервер недоступен, попробуйте ещё раз");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="glass-strong relative w-full max-w-xl overflow-hidden rounded-[2.5rem] p-8 md:p-10">
      <div className="pointer-events-none absolute -right-16 -top-16 h-48 w-48 rounded-full bg-white/50 blur-3xl" />

      <div className="relative">
        <h2 className="text-2xl font-semibold tracking-tight text-brand md:text-3xl">
          Создать аккаунт
        </h2>

        <p className="mt-3 leading-7 text-slate-600">
          Зарегистрируйтесь — в личном кабинете вы сможете оставить номер
          для связи и создать заявку на консультацию.
        </p>

        <form className="mt-8 space-y-5" onSubmit={handleSubmit} noValidate>
          {/* Email */}
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
              <p className="mt-2 text-sm text-red-600">
                Проверьте адрес: похоже, есть опечатка
              </p>
            ) : null}
          </div>

          {/* Пароль + индикатор надёжности */}
          <div>
            <label htmlFor="password" className="mb-2 block text-sm font-medium text-brand">
              Пароль
            </label>
            <input
              id="password"
              name="password"
              type="password"
              autoComplete="new-password"
              placeholder="Минимум 8 символов"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="input-glass"
            />

            {password ? (
              <div className="mt-3">
                <div className="flex gap-1.5" aria-hidden>
                  {[1, 2, 3].map((segment) => (
                    <span
                      key={segment}
                      className={`h-1.5 flex-1 rounded-full transition-colors duration-300 ${
                        segment <= strength.segments ? SEGMENT_COLORS[strength.level] : "bg-slate-200"
                      }`}
                    />
                  ))}
                </div>
                <p className={`mt-1.5 text-sm ${LABEL_COLORS[strength.level]}`} aria-live="polite">
                  {strength.label}
                </p>
              </div>
            ) : null}

            <p className="mt-2 text-xs leading-5 text-slate-400">
              Надёжный пароль: 8+ символов, заглавные и строчные буквы, цифры, спецсимволы
            </p>
          </div>

          {/* Повтор пароля */}
          <div>
            <label htmlFor="password-repeat" className="mb-2 block text-sm font-medium text-brand">
              Повторите пароль
            </label>
            <input
              id="password-repeat"
              name="password-repeat"
              type="password"
              autoComplete="new-password"
              placeholder="Ещё раз"
              value={passwordRepeat}
              onChange={(e) => setPasswordRepeat(e.target.value)}
              onBlur={() => setRepeatTouched(true)}
              className="input-glass"
            />
            {showRepeatError ? (
              <p className="mt-2 text-sm text-red-600">Пароли не совпадают</p>
            ) : null}
          </div>

          {/* Согласие */}
          <label className="flex cursor-pointer items-start gap-3 text-sm text-slate-600">
            <input
              type="checkbox"
              checked={consent}
              onChange={(e) => setConsent(e.target.checked)}
              className="mt-0.5 h-4 w-4 shrink-0 cursor-pointer appearance-none rounded-md border border-slate-300 bg-white/70 transition-all checked:border-blue-600 checked:bg-blue-600 checked:bg-[url('data:image/svg+xml;utf8,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 24 24%22 fill=%22none%22 stroke=%22white%22 stroke-width=%223%22 stroke-linecap=%22round%22 stroke-linejoin=%22round%22><polyline points=%2220 6 9 17 4 12%22/></svg>')] checked:bg-[length:12px_12px] checked:bg-center checked:bg-no-repeat"
            />
            <span>
              Соглашаюсь с обработкой персональных данных и политикой конфиденциальности
            </span>
          </label>

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
            {loading ? "Создаём аккаунт…" : "Зарегистрироваться"}
          </button>

          <p className="text-center text-sm text-slate-500">
            Уже есть аккаунт?{" "}
            <a href="/login" className="font-semibold text-blue-700 hover:text-blue-800">
              Войти
            </a>
          </p>
        </form>
      </div>
    </div>
  );
}
