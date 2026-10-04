import Reveal from "./Reveal";
import SectionHeading from "./SectionHeading";

const items = ["Контроль состояния", "Организация ухода", "Связь с родственниками"];

export default function Safety() {
  return (
    <section className="relative overflow-hidden bg-surface py-24">
      <div className="absolute -left-32 bottom-0 h-80 w-80 animate-float-slow rounded-full bg-blue-200/40 blur-3xl" />

      <div className="relative mx-auto max-w-7xl px-6">
        <SectionHeading eyebrow="Безопасность" title="Спокойствие родственников тоже важно" />

        <div className="mt-12 grid gap-6 md:grid-cols-3">
          {items.map((item, index) => (
            <Reveal key={item} delay={index * 120}>
              <div className="glass h-full rounded-3xl p-7 transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_16px_40px_rgba(11,42,91,0.12)]">
                <div
                  className={`glass-strong icon-glow ${index === 1 ? "icon-glow-delay-1" : index === 2 ? "icon-glow-delay-2" : ""} flex h-12 w-12 items-center justify-center rounded-2xl text-blue-700`}
                >
                  ✓
                </div>
                <h3 className="mt-6 text-lg font-semibold text-brand">{item}</h3>
                <p className="mt-3 leading-7 text-slate-600">
                  Здесь будет конкретная информация о том, как это организовано у вас.
                </p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
