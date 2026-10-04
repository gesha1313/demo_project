import Link from "next/link";

const advantages = ["Круглосуточный уход", "Опытные специалисты", "Индивидуальный подход"];

export default function Hero() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-white via-blue-50 to-indigo-100">
      {/* Декоративные световые пятна */}
      <div className="absolute -right-32 -top-32 h-96 w-96 animate-float rounded-full bg-blue-300/40 blur-3xl" />
      <div className="absolute -left-24 bottom-0 h-80 w-80 animate-float-slow rounded-full bg-indigo-200/50 blur-3xl" />

      <div className="relative mx-auto grid min-h-[680px] max-w-7xl items-center gap-14 px-6 py-20 md:grid-cols-2">
        {/* Текст */}
        <div>
          <div className="mb-6 inline-flex animate-fade-up items-center gap-2 rounded-full glass px-4 py-2 text-sm font-medium text-blue-700">
            <span className="h-1.5 w-1.5 rounded-full bg-blue-500 shadow-[0_0_8px_rgba(59,130,246,0.9)]" />
            Забота о близких
          </div>

          <h1 className="max-w-2xl animate-fade-up bg-gradient-to-br from-[#0b2a5b] via-[#1d4ed8] to-[#4338ca] bg-clip-text text-4xl font-semibold leading-[1.08] tracking-tight text-transparent [animation-delay:100ms] md:text-6xl">
            Место, где о ваших близких заботятся каждый день
          </h1>

          <p className="mt-7 max-w-xl animate-fade-up text-lg leading-8 text-slate-600 [animation-delay:200ms]">
            Помогаем пожилым людям и людям с ограниченной мобильностью получать
            необходимый уход, внимание и комфорт в безопасных условиях.
          </p>

          {/* Кнопки */}
          <div className="mt-9 flex animate-fade-up flex-col gap-4 [animation-delay:300ms] sm:flex-row">
            <Link
              href="/register"
              className="btn-glass-primary rounded-full px-7 py-4 text-center font-semibold"
            >
              Получить консультацию
            </Link>

            <Link
              href="#services"
              className="btn-glass-ghost rounded-full px-7 py-4 text-center font-semibold"
            >
              Узнать больше
            </Link>
          </div>

          {/* Преимущества */}
          <div className="mt-9 flex animate-fade-up flex-wrap gap-3 [animation-delay:400ms]">
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
        <div className="relative animate-fade-up [animation-delay:500ms]">
          <div className="absolute -inset-6 animate-float-slow rounded-[3rem] bg-gradient-to-br from-blue-300/50 to-indigo-300/50 blur-2xl" />

          <div className="glass-strong relative overflow-hidden rounded-[2rem] p-2">
            <div className="flex aspect-[4/3] items-center justify-center overflow-hidden rounded-[1.7rem] bg-gradient-to-br from-slate-100 to-blue-100">
              <div className="text-center">
                <div className="icon-glow mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-white/80 text-2xl text-blue-700 shadow-lg">
                  +
                </div>
                <span className="text-sm text-slate-500">Здесь будет фотография</span>
              </div>
            </div>
          </div>

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
