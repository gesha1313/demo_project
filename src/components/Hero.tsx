import Link from "next/link";
import Image from "next/image";

const advantages = ["Здоровое питание", "Медицинское сопровождение", "Досуг и занятия каждый день"];

export default function Hero() {
  return (
    <section id="top" className="relative overflow-hidden py-12 md:py-16">
      {/* Декоративные световые пятна */}
      <div className="absolute -right-32 -top-32 h-96 w-96 animate-float rounded-full bg-brand-300/35 blur-3xl" />
      <div className="absolute -left-24 bottom-0 h-80 w-80 animate-float-slow rounded-full bg-brand-200/45 blur-3xl" />

      <div className="relative mx-auto grid max-w-7xl items-center gap-10 px-6 md:grid-cols-2 md:gap-14">
        {/* Текст */}
        <div>
          <div className="mb-6 inline-flex animate-fade-up items-center gap-2 rounded-full glass px-4 py-2 text-sm font-medium text-brand">
            <span className="h-1.5 w-1.5 rounded-full bg-brand shadow-[0_0_8px_rgba(63,105,150,0.9)]" />
            Пансионат для пожилых в Нижнем Новгороде
          </div>

          <h1 className="max-w-2xl animate-fade-up text-3xl font-semibold leading-[1.12] tracking-tight text-brand [animation-delay:50ms] sm:text-4xl md:text-5xl">
            Комфорт, забота и медицинское сопровождение для ваших близких
          </h1>

          <p className="mt-6 max-w-xl animate-fade-up text-base leading-7 text-slate-600 [animation-delay:100ms] md:text-lg md:leading-8">
            Пансионат «Народный»: проживание в 2–3-местных номерах, здоровое
            питание, ежедневный уход и увлекательная атмосфера. Для одиноких
            есть социальная программа «Проживание за пенсию».
          </p>

          {/* Цифры доверия */}
          <div className="mt-6 flex flex-wrap gap-x-10 gap-y-3">
            {[
              ["от 900 ₽", "стоимость в сутки"],
              ["3", "категории проживания"],
              ["2–3", "места в номере"],
            ].map(([num, label]) => (
              <div key={label}>
                <div className="text-2xl font-bold text-brand">{num}</div>
                <div className="text-xs text-slate-600">{label}</div>
              </div>
            ))}
          </div>

          {/* Кнопки */}
          <div className="mt-8 flex animate-fade-up flex-col gap-4 [animation-delay:150ms] sm:flex-row">
            <Link
              href="/register"
              className="btn-glass-primary rounded-lg px-7 py-4 text-center font-semibold"
            >
              Оставить заявку
            </Link>

            <Link
              href="#contacts"
              className="btn-glass-ghost rounded-lg px-7 py-4 text-center font-semibold"
            >
              Связаться с нами
            </Link>
          </div>

          {/* Преимущества */}
          <div className="mt-8 flex animate-fade-up flex-wrap gap-3 [animation-delay:250ms]">
            {advantages.map((item) => (
              <span
                key={item}
                className="flex items-center rounded-full glass px-4 py-2 text-sm text-slate-700"
              >
                {item}
              </span>
            ))}
          </div>
        </div>

        {/* Фото */}
        <div className="relative mt-2 animate-fade-up [animation-delay:250ms] md:mt-0">
          <div className="absolute -inset-6 hidden animate-float-slow rounded-lg bg-gradient-to-br from-brand-300/40 to-brand-200/30 blur-2xl md:block" />

          <div className="glass relative overflow-hidden rounded-lg md:glass-strong md:rounded-lg md:p-2">
            <div className="relative aspect-[4/3] overflow-hidden rounded-lg md:rounded-lg">
              <Image
                src="/photos/about-pansionat.png"
                alt="Пансионат «Народный» в Нижнем Новгороде"
                fill
                priority
                sizes="(max-width: 768px) 100vw, 50vw"
                className="object-cover"
              />
            </div>
          </div>

          {/* Подпись под фото (на десктопе отступ больше — обходим карточку) */}
          <p className="mt-3 flex items-center justify-center gap-2 text-xs font-medium text-slate-700 md:mt-10 md:justify-start">
            <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-brand shadow-[0_0_8px_rgba(63,105,150,0.9)]" />
            ул. 3-я Озёрная, 2 — Сормовский район
          </p>

          {/* Информационная карточка */}
          <div className="glass-strong absolute -bottom-7 -left-5 hidden w-64 rounded-lg p-6 md:block">
            <div className="text-sm font-semibold text-brand">Акция: 900 ₽ в сутки</div>
            <p className="mt-2 text-sm leading-6 text-slate-700">
              Действует для всех категорий проживания. Приезжайте на
              экскурсию — покажем и расскажем всё сами.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
