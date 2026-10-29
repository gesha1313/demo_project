import Link from "next/link";
import Reveal from "./Reveal";
import SectionHeading from "./SectionHeading";
import SectionFooter from "./SectionFooter";

type SectionProps = {
  /** Переход к следующему блоку — задаётся страницей, а не секцией */
  footer?: { href: string; next: string; hint?: string };
};

/** Категории размещения пансионата «Народный» */
const categories = [
  {
    name: "1-я категория",
    note: "Полная способность к самообслуживанию",
    price: "900 ₽",
    unit: "в сутки",
    features: ["Комфортный номер", "Питание и досуг", "Медицинское сопровождение"],
  },
  {
    name: "2-я категория",
    note: "Частичная способность к самообслуживанию",
    price: "900 ₽",
    unit: "в сутки",
    features: ["Всё из 1-й категории", "Помощь в гигиене", "Контроль самочувствия"],
  },
  {
    name: "3-я категория",
    note: "Полная потеря способности к самообслуживанию",
    price: "900 ₽",
    unit: "в сутки",
    features: ["Всё из 2-й категории", "Полный уход 24/7", "Профилактика пролежней"],
  },
];

export default function Pricing({ footer }: SectionProps) {
  return (
    <section id="pricing" className="section-band relative overflow-hidden py-12 md:py-16">
      <div className="absolute -right-32 top-16 h-80 w-80 animate-float rounded-full bg-brand-200/40 blur-3xl" />

      <div className="relative mx-auto max-w-7xl px-6">
        <SectionHeading
          eyebrow="Стоимость размещения"
          title="Акция: 900 ₽ в сутки — для всех категорий"
          description="Категория зависит от способности человека к самообслуживанию. Проживание, питание, уход и досуг уже включены."
        />

        <div className="mt-10 grid gap-5 md:grid-cols-3">
          {categories.map((category, index) => (
            <Reveal key={category.name} delay={index * 120}>
              <div
                className={`relative h-full rounded-lg p-6 transition-all duration-300 ${
                  index === 1
                    ? "glass-strong border-2 border-brand shadow-[0_10px_30px -12px_rgba(47,85,120,0.35)]"
                    : "glass"
                }`}
              >
                {index === 1 ? (
                  <span className="absolute -top-3 left-1/2 w-max -translate-x-1/2 rounded-lg bg-brand px-3 py-1 text-xs font-semibold text-white">
                    Чаще всего выбирают
                  </span>
                ) : null}
                <span className="inline-block rounded-lg bg-brand-100/80 px-3 py-1 text-xs font-semibold text-brand">
                  {category.name}
                </span>
                <p className="mt-3 text-sm text-slate-600">{category.note}</p>
                <div className="mt-4 text-3xl font-bold text-brand">
                  {category.price}
                  <span className="ml-1 text-sm font-medium text-slate-600">{category.unit}</span>
                </div>
                <ul className="mt-4 space-y-2 text-sm text-slate-700">
                  {category.features.map((feature) => (
                    <li key={feature} className="flex gap-2">
                      <span className="mt-0.5 text-brand">✓</span>
                      {feature}
                    </li>
                  ))}
                </ul>
              </div>
            </Reveal>
          ))}
        </div>

        {/* Социальная программа */}
        <Reveal className="mt-5" delay={200}>
          <div className="glass-strong flex flex-col gap-6 rounded-lg p-6 md:p-8 md:flex-row md:items-center md:justify-between">
            <div>
              <h3 className="text-lg font-semibold text-brand">
                Соц. программа «Проживание за пенсию»
              </h3>
              <p className="mt-2 text-slate-700">
                Для одиноких пожилых людей: проживание и уход оформляется
                через пенсию — без дополнительных платежей родственников.
              </p>
            </div>

            <div className="flex flex-col gap-4 sm:flex-row">
              <Link
                href="/register"
                className="btn-glass-primary rounded-lg px-7 py-4 text-center font-semibold"
              >
                Узнать подробнее
              </Link>

              <Link
                href="#faq"
                className="btn-glass-ghost rounded-lg px-7 py-4 text-center font-semibold"
              >
                Частые вопросы
              </Link>
            </div>
          </div>
        </Reveal>

        {footer ? <SectionFooter {...footer} /> : null}
      </div>
    </section>
  );
}
