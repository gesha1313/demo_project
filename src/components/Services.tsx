import Link from "next/link";
import Reveal from "./Reveal";
import SectionHeading from "./SectionHeading";
import SectionFooter from "./SectionFooter";

const services = [
  {
    title: "Постоянный уход",
    text: "Ежедневная помощь, наблюдение и поддержка.",
  },
  {
    title: "Временное размещение",
    text: "Решение на период восстановления или отсутствия родственников.",
  },
  {
    title: "Индивидуальная помощь",
    text: "Формат под конкретные потребности человека.",
  },
];

export default function Services() {
  return (
    <section id="services" className="section-band relative overflow-hidden py-14 md:py-20">
      <div className="absolute -left-32 top-24 h-80 w-80 animate-float-slow rounded-full bg-blue-200/40 blur-3xl" />

      <div className="relative mx-auto max-w-7xl px-6">
        <SectionHeading
          eyebrow="Наши услуги"
          title="Помощь, которую можно подобрать под ситуацию"
          description="Подбираем формат ухода и поддержки в зависимости от состояния, образа жизни и потребностей человека."
        />

        <div className="mt-10 grid gap-5 md:grid-cols-3">
          {services.map((service, index) => (
            <Reveal key={service.title} delay={index * 120}>
              <div className="glass group flex h-full flex-col rounded-3xl p-7 transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_16px_40px_rgba(13,36,74,0.13)]">
                <div
                  className={`glass-strong icon-glow ${index === 1 ? "icon-glow-delay-1" : index === 2 ? "icon-glow-delay-2" : ""} flex h-12 w-12 items-center justify-center rounded-2xl text-xl font-semibold text-blue-700`}
                >
                  +
                </div>

                <h3 className="mt-6 text-xl font-semibold text-brand">{service.title}</h3>
                <p className="mt-3 leading-7 text-slate-600">{service.text}</p>

                <Link
                  href="/register"
                  className="mt-auto inline-block w-fit pt-6 text-sm font-semibold text-blue-700 transition-all duration-200 hover:translate-x-1 hover:text-blue-800"
                >
                  Узнать подробнее →
                </Link>
              </div>
            </Reveal>
          ))}
        </div>

        <SectionFooter
          href="#how"
          next="Как начинается знакомство"
          hint="Три шага: разговор, подбор варианта, решение"
        />
      </div>
    </section>
  );
}
