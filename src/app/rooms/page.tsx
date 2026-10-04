import type { Metadata } from "next";
import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Reveal from "@/components/Reveal";

export const metadata: Metadata = {
  title: "Номера и тарифы",
  description:
    "Категории номеров пансионата и то, что входит в стоимость проживания и ухода.",
};

const included = [
  "Проживание и питание",
  "Круглосуточный уход",
  "Врачебное наблюдение",
  "Бытовое сопровождение",
];

const rooms = [
  {
    name: "Одноместный номер",
    note: "Тишина и личное пространство",
    features: [
      "Отдельная комната",
      "Санузел с поручнями",
      "Кнопка вызова персонала",
      "Ежедневная уборка",
    ],
  },
  {
    name: "Двухместный номер",
    note: "Общение и доступная цена",
    features: [
      "Просторная комната на двоих",
      "Санузел с поручнями",
      "Кнопка вызова персонала",
      "Ежедневная уборка",
    ],
  },
  {
    name: "Повышенной комфортности",
    note: "Максимум удобства",
    features: [
      "Увеличенная площадь",
      "Отдельная зона отдыха",
      "Индивидуальное меню",
      "Приоритетный уход",
    ],
  },
];

export default function RoomsPage() {
  return (
    <>
      <Header />
      <main className="relative flex-1 overflow-hidden">
        {/* Шапка страницы */}
        <section className="relative overflow-hidden bg-gradient-to-br from-white via-blue-50 to-indigo-100 py-16 md:py-20">
          <div className="absolute -right-32 -top-24 h-96 w-96 animate-float rounded-full bg-blue-300/40 blur-3xl" />
          <div className="absolute -left-28 bottom-0 h-80 w-80 animate-float-slow rounded-full bg-indigo-200/50 blur-3xl" />

          <div className="relative mx-auto max-w-7xl px-6">
            <div className="max-w-2xl animate-fade-up">
              <span className="inline-flex items-center gap-2 rounded-full glass px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.18em] text-blue-700">
                <span className="h-1.5 w-1.5 rounded-full bg-blue-500 shadow-[0_0_8px_rgba(59,130,246,0.9)]" />
                Проживание
              </span>

              <h1 className="mt-4 bg-gradient-to-br from-[#0b2a5b] via-[#1d4ed8] to-[#4338ca] bg-clip-text text-4xl font-semibold leading-[1.1] tracking-tight text-transparent md:text-5xl">
                Номера и тарифы
              </h1>

              <p className="mt-5 text-lg leading-8 text-slate-600">
                Три категории проживания — от спокойного одноместного номера
                до комнаты повышенной комфортности. Во все тарифы входит уход,
                питание и наблюдение специалистов.
              </p>
            </div>

            {/* Что входит в любой тариф */}
            <div className="mt-9 flex animate-fade-up flex-wrap gap-3 [animation-delay:200ms]">
              {included.map((item) => (
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
        </section>

        {/* Карточки номеров */}
        <section className="relative bg-white py-20">
          <div className="mx-auto max-w-7xl px-6">
            <div className="grid gap-6 md:grid-cols-3">
              {rooms.map((room, index) => (
                <Reveal key={room.name} delay={index * 120}>
                  <div className="glass group flex h-full flex-col overflow-hidden rounded-[2rem] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_18px_44px_rgba(11,42,91,0.14)]">
                    {/* Фото номера */}
                    <div className="relative m-2 overflow-hidden rounded-[1.6rem]">
                      <div className="flex aspect-[4/3] items-center justify-center bg-gradient-to-br from-blue-50 via-slate-100 to-indigo-100 transition-transform duration-500 group-hover:scale-[1.03]">
                        <div className="text-center">
                          <div
                            className={`icon-glow ${index === 1 ? "icon-glow-delay-1" : index === 2 ? "icon-glow-delay-2" : ""} mx-auto mb-3 flex h-14 w-14 items-center justify-center rounded-2xl bg-white/80 text-xl text-blue-700 shadow-lg`}
                          >
                            +
                          </div>
                          <span className="text-sm text-slate-500">Фото номера</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex flex-1 flex-col p-7 pt-5">
                      <h2 className="text-xl font-semibold text-brand">{room.name}</h2>
                      <p className="mt-1 text-sm text-slate-500">{room.note}</p>

                      <div className="mt-4 inline-block w-fit rounded-full bg-blue-100/70 px-4 py-1.5 text-sm font-semibold text-blue-700">
                        Здесь будет цена · ₽/мес
                      </div>

                      <ul className="mt-5 space-y-2.5">
                        {room.features.map((feature) => (
                          <li key={feature} className="flex items-start gap-2.5 text-sm text-slate-600">
                            <span className="glass-strong icon-glow flex h-5 w-5 shrink-0 items-center justify-center rounded-full text-[10px] text-blue-700">
                              ✓
                            </span>
                            {feature}
                          </li>
                        ))}
                      </ul>

                      <div className="mt-auto pt-7">
                        <Link
                          href="/register"
                          className="btn-glass-ghost block rounded-full px-6 py-3.5 text-center text-sm font-semibold"
                        >
                          Забронировать
                        </Link>
                      </div>
                    </div>
                  </div>
                </Reveal>
              ))}
            </div>

            {/* Индивидуальный расчёт */}
            <Reveal className="mt-14" delay={150}>
              <div className="relative overflow-hidden rounded-[2.5rem] bg-gradient-to-br from-[#0b2a5b] via-[#122f63] to-[#1e3a8a] px-8 py-12 text-center text-white shadow-2xl shadow-blue-900/30 md:px-16">
                <div className="absolute -right-20 -top-20 h-64 w-64 animate-float rounded-full bg-blue-500/30 blur-3xl" />
                <div className="absolute -bottom-24 -left-16 h-64 w-64 animate-float-slow rounded-full bg-indigo-400/25 blur-3xl" />

                <div className="glass-dark relative mx-auto max-w-2xl rounded-[2rem] px-8 py-10">
                  <h2 className="text-2xl font-semibold md:text-3xl">
                    Не нашли подходящий вариант?
                  </h2>
                  <p className="mx-auto mt-3 max-w-lg leading-7 text-blue-100">
                    Расскажите о ситуации — подберём формат ухода
                    и рассчитаем стоимость индивидуально.
                  </p>
                  <Link
                    href="/register"
                    className="mt-7 inline-block rounded-full bg-white px-7 py-4 font-semibold text-brand shadow-[0_10px_30px_rgba(255,255,255,0.25)] transition-all duration-200 hover:-translate-y-0.5 hover:shadow-[0_14px_36px_rgba(255,255,255,0.35)] active:scale-[0.98]"
                  >
                    Получить расчёт
                  </Link>
                </div>
              </div>
            </Reveal>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
