import type { Metadata } from "next";
import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import PageHeader from "@/components/PageHeader";
import Reveal from "@/components/Reveal";
import SectionHeading from "@/components/SectionHeading";

export const metadata: Metadata = {
  title: "Пансионат",
  description:
    "Пансионаты для пожилых в Нижнем Новгороде: Сормовский и Приокский районы. Размещение с уходом от 1 100 ₽ в сутки.",
};

const cities = [
  { name: "Нижний Новгород", active: true, href: "#districts" },
  { name: "Москва", active: false },
  { name: "Санкт-Петербург", active: false },
];

const districts = [
  {
    name: "Сормовский район",
    price: "от 1 100 ₽ / сутки",
    text: "Тихий зелёный район рядом с парком. Одноместные и двухместные комнаты, круглосуточная сиделка, пятиразовое питание, ежедневные прогулки.",
  },
  {
    name: "Приокский район",
    price: "от 1 100 ₽ / сутки",
    text: "Рядом с набережной и поликлиникой. Просторные светлые комнаты, медицинское наблюдение, занятия и общение, видеосвязь с родственниками.",
  },
];

export default function PansionatPage() {
  return (
    <>
      <Header />
      <main className="flex-1">
        <PageHeader
          eyebrow="Пансионат"
          title="Проживание с уходом"
          description="Выберите город — расскажем о пансионатах, ценах и условиях размещения."
        />

        <section className="section-band py-14 md:py-20">
          <div className="mx-auto max-w-7xl px-6">
            <SectionHeading eyebrow="Города" title="Где мы работаем" />
            <div className="mt-10 grid gap-5 md:grid-cols-3">
              {cities.map((city, i) => (
                <Reveal key={city.name} delay={i * 100}>
                  {city.active ? (
                    <Link
                      href={city.href ?? "#districts"}
                      className="glass block h-full rounded-3xl p-8 text-center transition-transform duration-300 hover:-translate-y-1"
                    >
                      <div className="text-xl font-semibold text-brand">{city.name}</div>
                      <div className="mt-2 text-sm text-sky-700">Выбрать район →</div>
                    </Link>
                  ) : (
                    <div className="glass h-full cursor-not-allowed rounded-3xl p-8 text-center opacity-60">
                      <div className="text-xl font-semibold text-slate-600">{city.name}</div>
                      <div className="glass-strong mt-3 w-fit mx-auto rounded-full px-3 py-1 text-xs font-semibold text-slate-600">
                        Скоро
                      </div>
                    </div>
                  )}
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        <section id="districts" className="py-14 md:py-20">
          <div className="mx-auto max-w-7xl px-6">
            <SectionHeading
              eyebrow="Нижний Новгород"
              title="Наши пансионаты"
              description="Цены указаны за сутки проживания с уходом и питанием."
            />
            <div className="mt-10 grid gap-5 md:grid-cols-2">
              {districts.map((d, i) => (
                <Reveal key={d.name} delay={i * 120}>
                  <div className="glass flex h-full flex-col rounded-3xl p-8">
                    <div className="flex flex-wrap items-center justify-between gap-3">
                      <h2 className="text-xl font-semibold text-brand">{d.name}</h2>
                      <span className="glass-strong rounded-full px-4 py-1.5 text-sm font-bold text-brand">
                        {d.price}
                      </span>
                    </div>
                    <p className="mt-4 leading-7 text-slate-600">{d.text}</p>
                    <Link
                      href="/register"
                      className="btn-glass-primary mt-auto mt-6 w-fit rounded-full px-6 py-3 text-sm font-semibold"
                    >
                      Оставить заявку
                    </Link>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
