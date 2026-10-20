import Link from "next/link";
import Image from "next/image";

const advantages = ["Проверенные сиделки", "Медсёстры с сертификатами", "Уход на дому 24/7"];

const chain = [
  { href: "/caretaker", label: "Услуга сиделки" },
  { href: "#services", label: "Услуги и цены" },
  { href: "/about", label: "О пансионате" },
  { href: "#faq", label: "Частые вопросы" },
];

export default function Hero() {
  return (
    <section id="top" className="relative overflow-hidden py-14 md:py-20">
      {/* Декоративные световые пятна */}
      <div className="absolute -right-32 -top-32 h-96 w-96 animate-float rounded-full bg-sky-300/35 blur-3xl" />
      <div className="absolute -left-24 bottom-0 h-80 w-80 animate-float-slow rounded-full bg-amber-200/45 blur-3xl" />

      <div className="relative mx-auto grid max-w-7xl items-center gap-10 px-6 md:grid-cols-2 md:gap-14">
        {/* Текст */}
        <div>
          <div className="mb-6 inline-flex animate-fade-up items-center gap-2 rounded-full glass px-4 py-2 text-sm font-medium text-sky-700">
            <span className="h-1.5 w-1.5 rounded-full bg-sky-500 shadow-[0_0_8px_rgba(59,130,246,0.9)]" />
            Сиделки и патронаж на дому
          </div>

          <h1 className="max-w-2xl animate-fade-up text-4xl font-semibold leading-[1.08] tracking-tight text-brand [animation-delay:50ms] md:text-5xl">
            Сиделки, которым можно доверить заботу о близком
          </h1>

          <p className="mt-6 max-w-xl animate-fade-up text-lg leading-8 text-slate-600 [animation-delay:100ms]">
            Подбираем проверенных сиделок и патронажных сестёр: уход на дому,
            медицинские процедуры, сопровождение и ежедневные отчёты семье.
            Если человеку комфортнее в пансионате — подберём и это.
          </p>

          {/* Кнопки */}
          <div className="mt-8 flex animate-fade-up flex-col gap-4 [animation-delay:150ms] sm:flex-row">
            <Link
              href="/sidelki"
              className="btn-glass-primary rounded-full px-7 py-4 text-center font-semibold"
            >
              Подобрать сиделку
            </Link>

            <Link
              href="/register"
              className="btn-glass-ghost rounded-full px-7 py-4 text-center font-semibold"
            >
              Получить консультацию
            </Link>
          </div>

          {/* Цепочка знакомства с сайтом */}
          <div className="mt-8 animate-fade-up [animation-delay:200ms]">
            <div className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-700">
              Знакомство с сервисом ухода
            </div>
            <div className="mt-3 flex flex-wrap gap-x-5 gap-y-2">
              {chain.map((item) => (
                <Link
                  key={item.label}
                  href={item.href}
                  className="text-sm font-semibold text-slate-600 transition-all duration-200 hover:translate-x-0.5 hover:text-sky-700"
                >
                  {item.label} →
                </Link>
              ))}
            </div>
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
          <div className="absolute -inset-6 hidden animate-float-slow rounded-[3rem] bg-gradient-to-br from-sky-300/40 to-amber-300/40 blur-2xl md:block" />

          <div className="glass relative overflow-hidden rounded-[1.5rem] md:glass-strong md:rounded-[2rem] md:p-2">
            <div className="relative aspect-[4/3] overflow-hidden rounded-[1.4rem] md:rounded-[1.7rem]">
              <Image
                src="/photos/hero.jpg"
                alt="Сиделка тепло обнимает улыбающуюся пожилую женщину в инвалидном кресле"
                fill
                priority
                sizes="(max-width: 768px) 100vw, 50vw"
                className="object-cover"
              />
            </div>
          </div>

          {/* Подпись под фото (на десктопе отступ больше — обходим карточку) */}
          <p className="mt-3 flex items-center justify-center gap-2 text-xs font-medium text-slate-700 md:mt-10 md:justify-start">
            <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-sky-500 shadow-[0_0_8px_rgba(16,185,129,0.9)]" />
            Забота и внимание — каждый день
          </p>

          {/* Информационная карточка */}
          <div className="glass-strong absolute -bottom-7 -left-5 hidden w-64 rounded-2xl p-5 md:block">
            <div className="text-sm font-semibold text-brand">Забота начинается с доверия</div>
            <p className="mt-2 text-sm leading-6 text-slate-700">
              Подбираем сиделку под характер и привычки человека. Не подошло —
              заменим бесплатно в течение суток.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
