import Link from "next/link";
import Icon from "./Icon";
import Reveal from "./Reveal";
import SectionHeading from "./SectionHeading";
import SectionFooter from "./SectionFooter";

type SectionProps = {
  /** Переход к следующему блоку — задаётся страницей, а не секцией */
  footer?: { href: string; next: string; hint?: string };
};

const services = [
  {
    title: "Патронаж",
    text: "Визиты домой, контроль состояния и лекарств.",
    icon: "person" as const,
    freq: "от 1 раза в неделю",
    price: "от 1 500 ₽/визит",
  },
  {
    title: "Домашний уход",
    text: "Гигиена, кормление, помощь в быту.",
    icon: "home" as const,
    freq: "ежедневно или почасово",
    price: "от 2 500 ₽/день",
  },
  {
    title: "Медицинские процедуры на дому",
    text: "Инъекции, перевязки, контроль давления.",
    icon: "heart" as const,
    freq: "по назначению врача",
    price: "от 900 ₽/процедура",
  },
  {
    title: "Сопровождение к врачам",
    text: "Доставка до врача, помощь на приёме.",
    icon: "calendar" as const,
    freq: "по записи",
    price: "от 2 000 ₽/выезд",
  },
  {
    title: "Социальная адаптация",
    text: "Общение, прогулки, поддержка.",
    icon: "chat" as const,
    freq: "2–3 раза в неделю",
    price: "от 1 200 ₽/визит",
  },
  {
    title: "Сменный уход",
    text: "Круглосуточное наблюдение посменно.",
    icon: "clock" as const,
    freq: "24/7 посменно",
    price: "от 6 500 ₽/сутки",
  },
];

export default function Services({ footer }: SectionProps) {
  return (
    <section id="services" className="section-band relative overflow-hidden py-10 md:py-14">
      <div className="absolute -left-32 top-24 h-80 w-80 animate-float-slow rounded-full bg-sky-200/40 blur-3xl" />

      <div className="relative mx-auto max-w-7xl px-6">
        <SectionHeading
          eyebrow="Услуги"
          title="Помощь, которую можно подобрать под ситуацию"
          description="Каждая услуга — с частотой посещений и ориентировочной стоимостью. Точный план и цену фиксируем в договоре после бесплатной консультации."
        />

        <div className="mt-10 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {services.map((service, index) => (
            <Reveal key={service.title} delay={index * 120}>
              <div className="glass group flex h-full flex-col rounded-xl p-7 transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_16px_40px_rgba(13,36,74,0.13)]">
                <div
                  className={`glass-strong icon-glow ${index === 1 ? "icon-glow-delay-1" : index === 2 ? "icon-glow-delay-2" : ""} flex h-12 w-12 items-center justify-center rounded-xl text-sky-700`}
                >
                  <Icon name={service.icon} className="h-6 w-6" />
                </div>

                <h3 className="mt-6 text-xl font-semibold text-brand">{service.title}</h3>
                <p className="mt-3 leading-7 text-slate-600">{service.text}</p>

                <div className="mt-4 flex flex-wrap items-center gap-2 text-xs">
                  <span className="glass-strong rounded-full px-3 py-1 font-semibold text-sky-700">
                    {service.freq}
                  </span>
                  <span className="glass-strong rounded-full px-3 py-1 font-semibold text-brand">
                    {service.price}
                  </span>
                </div>

                <Link
                  href="#pricing"
                  className="mt-auto inline-block w-fit pt-6 text-sm font-semibold text-sky-700 transition-all duration-200 hover:translate-x-1 hover:text-sky-800"
                >
                  Смотреть прайс-лист →
                </Link>
              </div>
            </Reveal>
          ))}
        </div>

        {footer ? <SectionFooter {...footer} /> : null}
      </div>
    </section>
  );
}
