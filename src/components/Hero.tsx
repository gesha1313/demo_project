import Link from "next/link";
import Image from "next/image";

const advantages = ["Круглосуточный уход", "Опытные специалисты", "Индивидуальный подход"];

const chain = [
  { href: "/about", label: "О пансионате" },
  { href: "/services", label: "Услуги и условия" },
  { href: "/services#pricing", label: "Стоимость" },
  { href: "/services#faq", label: "Частые вопросы" },
];

export default function Hero() {
  return (
    <section className="relative overflow-hidden py-14 md:py-20">
      {/* Декоративные световые пятна */}
      <div className="absolute -right-32 -top-32 h-96 w-96 animate-float rounded-full bg-blue-300/35 blur-3xl" />
      <div className="absolute -left-24 bottom-0 h-80 w-80 animate-float-slow rounded-full bg-indigo-200/45 blur-3xl" />

      <div className="relative mx-auto grid max-w-7xl items-center gap-10 px-6 md:grid-cols-2 md:gap-14">
        {/* Текст */}
        <div>
          <div className="mb-6 inline-flex animate-fade-up items-center gap-2 rounded-full glass px-4 py-2 text-sm font-medium text-blue-700">
            <span className="h-1.5 w-1.5 rounded-full bg-blue-500 shadow-[0_0_8px_rgba(59,130,246,0.9)]" />
            Забота о близких
          </div>

          <h1 className="max-w-2xl animate-fade-up text-4xl font-semibold leading-[1.08] tracking-tight text-brand [animation-delay:50ms] md:text-5xl">
            Место, где о ваших близких заботятся каждый день
          </h1>

          <p className="mt-6 max-w-xl animate-fade-up text-lg leading-8 text-slate-600 [animation-delay:100ms]">
            Помогаем пожилым людям и людям с ограниченной мобильностью получать
            необходимый уход, внимание и комфорт в безопасных условиях.
          </p>

          {/* Кнопки */}
          <div className="mt-8 flex animate-fade-up flex-col gap-4 [animation-delay:150ms] sm:flex-row">
            <Link
              href="/register"
              className="btn-glass-primary rounded-full px-7 py-4 text-center font-semibold"
            >
              Получить консультацию
            </Link>

            <Link
              href="/about"
              className="btn-glass-ghost rounded-full px-7 py-4 text-center font-semibold"
            >
              Как устроен день
            </Link>
          </div>

          {/* Цепочка знакомства с сайтом */}
          <div className="mt-8 animate-fade-up [animation-delay:200ms]">
            <div className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
              Знакомство с пансионатом
            </div>
            <div className="mt-3 flex flex-wrap gap-x-5 gap-y-2">
              {chain.map((item) => (
                <Link
                  key={item.label}
                  href={item.href}
                  className="text-sm font-semibold text-slate-600 transition-all duration-200 hover:translate-x-0.5 hover:text-blue-700"
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
                className="flex items-center gap-2 rounded-full glass px-4 py-2 text-sm text-slate-700"
              >
                <span className="text-blue-700">✓</span>
                {item}
              </span>
            ))}
          </div>
        </div>

        {/* Фото */}
        <div className="relative mt-2 animate-fade-up [animation-delay:250ms] md:mt-0">
          <div className="absolute -inset-6 hidden animate-float-slow rounded-[3rem] bg-gradient-to-br from-blue-300/40 to-indigo-300/40 blur-2xl md:block" />

          <div className="glass relative overflow-hidden rounded-[1.5rem] md:glass-strong md:rounded-[2rem] md:p-2">
            <div className="relative aspect-[4/3] overflow-hidden rounded-[1.4rem] md:rounded-[1.7rem]">
              <Image
                src="/photos/hero.jpg"
                alt="Сиделка и пожилая женщина рассматривают семейные фотографии в светлом уютном зале"
                fill
                priority
                sizes="(max-width: 768px) 100vw, 50vw"
                className="object-cover"
              />
            </div>
          </div>

          {/* Подпись под фото (на десктопе отступ больше — обходим карточку) */}
          <p className="mt-3 flex items-center justify-center gap-2 text-xs font-medium text-slate-500 md:mt-10 md:justify-start">
            <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.9)]" />
            Забота и внимание — каждый день
          </p>

          {/* Информационная карточка */}
          <div className="glass-strong absolute -bottom-7 -left-5 hidden w-64 animate-float rounded-2xl p-5 md:block">
            <div className="text-sm font-semibold text-brand">Забота начинается с доверия</div>
            <p className="mt-2 text-sm leading-6 text-slate-500">
              Здесь будет короткая информация о вашем подходе к работе.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
