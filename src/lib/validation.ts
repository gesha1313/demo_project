/** Валидация, общая для клиента и сервера. */

export function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email.trim());
}

export type PasswordLevel = "empty" | "weak" | "medium" | "strong";

export type PasswordStrength = {
  /** 0–4 балла: длина, регистр, цифры, спецсимволы */
  score: number;
  level: PasswordLevel;
  /** Число заполненных сегментов индикатора: 1–3 */
  segments: 0 | 1 | 2 | 3;
  label: string;
  /** Пароль подходит для регистрации */
  acceptable: boolean;
};

/**
 * Оценка надёжности пароля по четырём критериям:
 *   длина ≥ 8 · строчные + заглавные · есть цифра · есть спецсимвол
 *
 * Слабый (красный) — 0–1 балл, средний (оранжевый) — 2,
 * надёжный (зелёный) — 3–4. Для регистрации достаточно среднего
 * уровня и длины от 8 символов.
 */
export function scorePassword(password: string): PasswordStrength {
  if (!password) {
    return { score: 0, level: "empty", segments: 0, label: "", acceptable: false };
  }

  let score = 0;
  if (password.length >= 8) score += 1;
  if (/[a-zа-я]/.test(password) && /[A-ZА-Я]/.test(password)) score += 1;
  if (/\d/.test(password)) score += 1;
  if (/[^A-Za-zА-Яа-я0-9]/.test(password)) score += 1;

  if (score <= 1) {
    return {
      score,
      level: "weak",
      segments: 1,
      label: "Слабый пароль",
      acceptable: false,
    };
  }

  if (score === 2) {
    return {
      score,
      level: "medium",
      segments: 2,
      label: "Средняя надёжность",
      acceptable: password.length >= 8,
    };
  }

  return {
    score,
    level: "strong",
    segments: 3,
    label: "Надёжный пароль",
    acceptable: true,
  };
}

export function isPasswordAcceptable(password: string): boolean {
  return scorePassword(password).acceptable;
}
