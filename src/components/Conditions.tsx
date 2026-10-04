import Reveal from "./Reveal";
import SectionHeading from "./SectionHeading";
import SectionFooter from "./SectionFooter";

const conditions = [
  "Условия проживания",
  "Питание",
  "Ежедневный уход",
  "Взаимодействие с родственниками",
];

export default function Conditions() {
  return (
    <section id="conditions" className="section-band relative overflow-hidden py-14 md:py-20">
      <div className="absolute -right-32 bottom-10 h-80 w-80 animate-float rounded-full bg-indigo-200/40 blur-3xl" />

      <div className="relative mx-auto max-w-7xl px-6">
        <SectionHeading
          eyebrow="Условия"
          title="Важные вещи должны быть понятны заранее"
          description="Мы считаем важным заранее рассказывать о размещении, уходе, бытовых условиях и взаимодействии с родственниками."
        />

        <div className="mt-10 grid gap-5 md:grid-cols-2 lg:grid-cols-4">
          {conditions.map((condition, index) => (
            <Reveal key={condition} delay={index * 100}>
              <div className="glass h-full rounded-3xl p-6 transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_16px_40px_rgba(13,36,74,0.13)]">
                <div
                  className={`glass-strong icon-glow ${index === 1 ? "icon-glow-delay-1" : index === 2 ? "icon-glow-delay-2" : index === 3 ? "icon-glow-delay-3" : ""} flex h-10 w-10 items-center justify-center rounded-xl text-xl text-blue-700`}
                >
                  +
                </div>
                <h3 className="mt-5 font-semibold text-brand">{condition}</h3>
                <p className="mt-2 text-sm leading-6 text-slate-500">
                  Здесь будет подробная информация.
                </p>
              </div>
            </Reveal>
          ))}
        </div>

        <SectionFooter
          href="/rooms"
          next="Номера и тарифы"
          hint="Три категории проживания — на отдельной странице"
        />
      </div>
    </section>
  );
}
