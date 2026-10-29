"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { loadYmaps, NN_CENTER, randomNNPoint } from "@/lib/ymaps";
import Icon from "./Icon";
import PaymentMock from "./PaymentMock";

/** Пункты анкеты (список согласован с серверной валидацией). */
const TASK_OPTIONS = [
  "Гигиена и уход",
  "Кормление",
  "Прогулки",
  "Приём лекарств",
  "Медпроцедуры",
  "Сопровождение",
  "Уборка и готовка",
  "Общение и досуг",
];

const MATCHING_STEPS = [
  "Анализируем анкету…",
  "Ищем свободных сиделок рядом…",
  "Проверяем стаж и отзывы…",
  "Согласовываем выезд…",
];

const MATCHING_DURATION_MS = 3600;

/** «9 лет» / «12 лет» / «5 лет» — склонение по числу */
const pluralYears = (n: number) => {
  if (n % 10 === 1 && n !== 11) return `${n} год`;
  if ([2, 3, 4].includes(n % 10) && ![12, 13, 14].includes(n)) return `${n} года`;
  return `${n} лет`;
};

type MatchResult = {
  requestId: number;
  matched: boolean;
  caretakerName?: string;
  caretakerExperience?: number;
  arrivalMinutes?: number;
};

type Phase = "form" | "payment" | "matching" | "result" | "error";

export default function CaretakerWizard({ userName }: { userName: string }) {
  // Поля анкеты
  const [wardName, setWardName] = useState("");
  const [wardAge, setWardAge] = useState("");
  const [address, setAddress] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [notes, setNotes] = useState("");
  const [tasks, setTasks] = useState<string[]>([]);

  const [phase, setPhase] = useState<Phase>("form");
  const [periodDays, setPeriodDays] = useState(1);
  const [stepIndex, setStepIndex] = useState(0);
  const [result, setResult] = useState<MatchResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const mapNodeRef = useRef<HTMLDivElement>(null);

  const formValid =
    wardName.trim().length >= 3 &&
    /^\d{1,3}$/.test(wardAge.trim()) &&
    Number(wardAge) >= 1 &&
    Number(wardAge) <= 120 &&
    address.trim().length >= 5 &&
    tasks.length > 0;

  const toggleTask = (task: string) => {
    setTasks((current) =>
      current.includes(task) ? current.filter((t) => t !== task) : [...current, task],
    );
  };

  /** Сначала оплата (по датам анкеты), после неё — поиск сиделки */
  const handleSubmit = () => {
    if (!formValid) return;

    let days = 1;
    if (startDate && endDate) {
      days = Math.max(
        1,
        Math.round((new Date(endDate).getTime() - new Date(startDate).getTime()) / 86400000),
      );
    }
    setPeriodDays(days);
    setPhase("payment");
  };

  /** Вызывается после «оплаты» — теперь создаём заявку и ищем сиделку */
  const startMatching = async () => {
    setSubmitting(true);
    setError(null);

    try {
      const response = await fetch("/api/caretaker", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          wardName,
          wardAge: Number(wardAge),
          address,
          tasks,
          startDate,
          endDate,
          notes,
        }),
      });

      if (!response.ok) {
        const data = (await response.json()) as { error?: string };
        setError(data.error ?? "Не удалось оформить заявку");
        return;
      }

      const data = (await response.json()) as MatchResult & { ok: boolean };
      setResult({
        requestId: data.requestId,
        matched: data.matched,
        caretakerName: data.caretakerName,
        caretakerExperience: data.caretakerExperience,
        arrivalMinutes: data.arrivalMinutes,
      });

      // Анимация подбора → результат
      setStepIndex(0);
      setPhase("matching");
    } catch {
      setError("Сервер недоступен, попробуйте ещё раз");
    } finally {
      setSubmitting(false);
    }
  };

  // Смена подписей во время «подбора» и переход к результату
  useEffect(() => {
    if (phase !== "matching") return;

    const stepTimer = window.setInterval(() => {
      setStepIndex((i) => Math.min(i + 1, MATCHING_STEPS.length - 1));
    }, MATCHING_DURATION_MS / MATCHING_STEPS.length);

    const doneTimer = window.setTimeout(() => setPhase("result"), MATCHING_DURATION_MS);

    return () => {
      window.clearInterval(stepTimer);
      window.clearTimeout(doneTimer);
    };
  }, [phase]);

  // Карта с меткой подобранной сиделки
  useEffect(() => {
    if (phase !== "result" || !result?.matched || !mapNodeRef.current) return;

    let destroyed = false;

    loadYmaps()
      .then((ymaps) => {
        if (destroyed || !mapNodeRef.current) return;

        const map = new ymaps.Map(
          mapNodeRef.current,
          { center: NN_CENTER, zoom: 12, controls: ["zoomControl"] },
          { suppressMapOpenBlock: true },
        );

        const coords = randomNNPoint();
        const placemark = new ymaps.Placemark(
          coords,
          {
            balloonContent:
              `<strong>${result.caretakerName}</strong><br/>` +
              `Стаж: ${result.caretakerExperience} лет`,
            hintContent: `${result.caretakerName} · стаж ${result.caretakerExperience} лет`,
          },
          { preset: "islands#redDotIcon" },
        );

        map.geoObjects.add(placemark);
        map.setCenter(coords, 13, { duration: 500 });

        return () => map.destroy();
      })
      .catch(() => {
        // карта не критична: карточка результата остаётся
      });

    return () => {
      destroyed = true;
    };
  }, [phase, result]);

  return (
    <div className="glass-strong relative w-full max-w-2xl overflow-hidden rounded-[2.5rem] p-7 md:p-10">
      <div className="pointer-events-none absolute -right-16 -top-16 h-48 w-48 rounded-full bg-white/50 blur-3xl" />

      <div className="relative">
        {/*АНКЕТА */}
        {phase === "form" ? (
          <>
            <h2 className="text-2xl font-semibold tracking-tight text-brand md:text-3xl">
              Анкета для подбора сиделки
            </h2>
            <p className="mt-2 text-sm leading-6 text-slate-700">
              {userName}, заполните короткую анкету — подберём свободную сиделку
              в вашем районе Нижнего Новгорода.
            </p>

            <div className="mt-7 space-y-5">
              <div className="grid gap-5 sm:grid-cols-[1fr_130px]">
                <div>
                  <label htmlFor="ward-name" className="mb-2 block text-sm font-medium text-brand">
                    ФИО подопечного
                  </label>
                  <input
                    id="ward-name"
                    type="text"
                    placeholder="Иванова Мария Петровна"
                    value={wardName}
                    onChange={(e) => setWardName(e.target.value)}
                    className="input-glass"
                  />
                </div>

                <div>
                  <label htmlFor="ward-age" className="mb-2 block text-sm font-medium text-brand">
                    Возраст
                  </label>
                  <input
                    id="ward-age"
                    type="number"
                    min={1}
                    max={120}
                    placeholder="78"
                    value={wardAge}
                    onChange={(e) => setWardAge(e.target.value)}
                    className="input-glass"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="address" className="mb-2 block text-sm font-medium text-brand">
                  Адрес
                </label>
                <input
                  id="address"
                  type="text"
                  placeholder="ул. Большая Покровская, д. 12"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  className="input-glass"
                />
              </div>

              <div>
                <span className="mb-2 block text-sm font-medium text-brand">
                  Что нужно делать <span className="font-normal text-slate-600"></span>
                </span>
                <div className="flex flex-wrap gap-2">
                  {TASK_OPTIONS.map((task) => {
                    const active = tasks.includes(task);
                    return (
                      <button
                        key={task}
                        type="button"
                        onClick={() => toggleTask(task)}
                        aria-pressed={active}
                        className={`rounded-full border px-4 py-2 text-sm transition-all duration-200 ${
                          active
                            ? "border-brand bg-brand-50/80 font-semibold text-brand shadow-sm"
                            : "glass border-transparent text-slate-600 hover:text-brand"
                        }`}
                      >
                        {active ? "✓ " : ""}
                        {task}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div>
                <span className="mb-2 block text-sm font-medium text-brand">
                  Период ухода{" "}
                  <span className="font-normal text-slate-600"></span>
                </span>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label htmlFor="start-date" className="mb-1 block text-xs text-slate-700">
                      дата начала 
                    </label>
                    <input
                      id="start-date"
                      type="date"
                      value={startDate}
                      onChange={(e) => setStartDate(e.target.value)}
                      className="input-glass"
                    />
                  </div>
                  <div>
                    <label htmlFor="end-date" className="mb-1 block text-xs text-slate-700">
                      дата окончания
                    </label>
                    <input
                      id="end-date"
                      type="date"
                      min={startDate || undefined}
                      value={endDate}
                      onChange={(e) => setEndDate(e.target.value)}
                      className="input-glass"
                    />
                  </div>
                </div>
              </div>

              <div>
                <label htmlFor="notes" className="mb-2 block text-sm font-medium text-brand">
                  Пожелания{" "}
                  <span className="font-normal text-slate-600"></span>
                </label>
                <input
                  id="notes"
                  type="text"
                  placeholder="Особенности режима, характер"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="input-glass"
                />
              </div>

              {error ? (
                <p className="glass rounded-lg px-4 py-3 text-sm text-red-600" role="alert">
                  {error}
                </p>
              ) : null}

              <button
                type="button"
                onClick={() => void handleSubmit()}
                disabled={!formValid || submitting}
                className="btn-glass-primary w-full rounded-lg px-7 py-4 text-center font-semibold disabled:cursor-not-allowed disabled:opacity-50"
              >
                {submitting ? "Отправляем…" : "Оформить"}
              </button>

              {!formValid ? (
                <p className="text-center text-xs text-slate-600">
                  Заполните ФИО, возраст, адрес и выберите услуги
                </p>
              ) : null}
            </div>
          </>
        ) : null}

        {/* ===================== ОПЛАТА (до поиска) ===================== */}
        {phase === "payment" ? (
          <PaymentMock
            amount={periodDays * 2500}
            lines={[
              "Тариф: 2 500 ₽ за день",
              periodDays > 1
                ? `Период: ${periodDays} дн.`
                : "Период: 1 день",
            ]}
            onPaid={() => void startMatching()}
          />
        ) : null}

        {/* ===================== АНИМАЦИЯ ПОДБОРА ===================== */}
        {phase === "matching" ? (
          <div className="flex flex-col items-center py-16 text-center">
            <span className="relative flex h-20 w-20 items-center justify-center">
              <span className="absolute h-full w-full animate-ping rounded-full bg-brand-400/40" />
              <span className="flex h-16 w-16 animate-spin items-center justify-center rounded-full border-4 border-brand-100 border-t-brand" />
            </span>

            <h2 className="mt-7 text-xl font-semibold text-brand md:text-2xl">
              Подбираем сиделку
            </h2>
            <p className="mt-2 text-sm text-slate-700" aria-live="polite">
              {MATCHING_STEPS[stepIndex]}
            </p>

            <div className="mt-5 flex gap-1.5">
              {MATCHING_STEPS.map((_, index) => (
                <span
                  key={index}
                  className={`h-1.5 w-8 rounded-full transition-colors duration-300 ${
                    index <= stepIndex ? "bg-brand" : "bg-slate-200"
                  }`}
                />
              ))}
            </div>
          </div>
        ) : null}

        {/* ===================== РЕЗУЛЬТАТ: СВОБОДНЫХ НЕТ ===================== */}
        {phase === "result" && result && !result.matched ? (
          <div className="flex flex-col items-center py-10 text-center">
            <span className="icon-glow glass-strong flex h-16 w-16 items-center justify-center rounded-lg text-brand">
              <Icon name="clock" className="h-8 w-8" />
            </span>

            <h2 className="mt-6 text-2xl font-semibold tracking-tight text-brand">
              На данный момент свободных сотрудников нет
            </h2>
            <p className="mt-3 max-w-md text-sm leading-6 text-slate-700">
              Все сиделки сейчас заняты. Ваша заявка №{result.requestId} сохранена —
              как только кто-то освободится, мы свяжемся с вами по телефону
              из личного кабинета.
            </p>

            <div className="mt-8 flex w-full flex-col gap-3 sm:w-auto sm:flex-row">
              <Link
                href="/cabinet"
                className="btn-glass-primary rounded-lg px-6 py-3.5 text-sm font-semibold"
              >
                В личный кабинет
              </Link>
              <button
                type="button"
                onClick={() => {
                  setPhase("form");
                  setResult(null);
                }}
                className="btn-glass-ghost rounded-lg px-6 py-3.5 text-sm font-semibold"
              >
                Попробовать позже
              </button>
            </div>
          </div>
        ) : null}

        {/* ===================== РЕЗУЛЬТАТ: СИДЕЛКА ПОДОБРАНА ===================== */}
        {phase === "result" && result && result.matched ? (
          <div>
            <div className="flex items-start gap-4">
              <span className="icon-glow glass-strong flex h-14 w-14 shrink-0 items-center justify-center rounded-lg text-2xl">
                ✓
              </span>
              <div>
                <h2 className="text-2xl font-semibold tracking-tight text-brand">
                  Сиделка подобрана
                </h2>
                <p className="mt-1 text-sm text-slate-700">
                  Заявка №{result.requestId} сохранена в личном кабинете
                </p>
              </div>
            </div>

            {/* Данные подобранной сиделки */}
            <div className="glass mt-6 grid gap-4 rounded-lg p-5 sm:grid-cols-2">
              <div>
                <div className="text-xs uppercase tracking-wide text-slate-600">Сиделка</div>
                <div className="mt-1 text-lg font-semibold text-brand">
                  {result.caretakerName ?? "Сиделка"}
                </div>
              </div>
              <div>
                <div className="text-xs uppercase tracking-wide text-slate-600">Стаж</div>
                <div className="mt-1 text-lg font-semibold text-brand">
                  {pluralYears(result.caretakerExperience ?? 0)}
                </div>
              </div>
            </div>

            {/* Карта с меткой */}
            <div className="glass mt-5 overflow-hidden rounded-lg p-2">
              <div
                ref={mapNodeRef}
                className="h-[280px] w-full overflow-hidden rounded-lg bg-slate-200"
              />
              <p className="px-3 py-2 text-center text-xs text-slate-700">
                Красная метка — район, из которого выезжает сиделка
              </p>
            </div>

            <div className="mt-7 flex flex-col gap-3 sm:flex-row">
              <Link
                href="/cabinet/requests"
                className="btn-glass-primary flex-1 rounded-lg px-6 py-4 text-center text-sm font-semibold"
              >
                Мои заявки
              </Link>
              <Link
                href="/caretaker"
                onClick={() => {
                  setPhase("form");
                  setWardName("");
                  setWardAge("");
                  setAddress("");
                  setTasks([]);
                  setStartDate("");
                  setEndDate("");
                  setNotes("");
                  setResult(null);
                }}
                className="btn-glass-ghost rounded-lg px-6 py-4 text-center text-sm font-semibold"
              >
                Оформить ещё одну
              </Link>
            </div>
          </div>
        ) : null}
      </div>
    </div>
  );
}
