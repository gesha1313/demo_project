import Reveal from "./Reveal";
import SectionHeading from "./SectionHeading";

const partsOfDay = [
  {
    time: "Утро",
    title: "Спокойное начало дня",
    text: "Завтрак, привычный распорядок и помощь в тех вещах, которые человеку сложно выполнять самостоятельно.",
  },
  {
    time: "Днём",
    title: "Общение и занятия",
    text: "Общение, отдых, прогулки и другие занятия в зависимости от возможностей и привычек человека.",
  },
  {
    time: "Вечером",
    title: "Тишина и отдых",
    text: "Спокойная атмосфера, привычный ритм и возможность провести вечер без спешки.",
  },
];

export default function DailyLife() {
  return (
    <section className="relative bg-white py-24">
      <div className="mx-auto max-w-7xl px-6">
        <SectionHeading
          eyebrow="Обычный день"
          title="Здесь живут, а не просто получают уход"
          description="Нам важно, чтобы каждый день состоял не только из необходимых процедур, но и из привычных вещей: общения, отдыха, прогулок, спокойного утра и ощущения домашнего пространства."
        />

        {/* Большая фотография */}
        <Reveal className="mt-12" delay={150}>
          <div className="glass-strong overflow-hidden rounded-[2rem] p-2 transition-shadow duration-300 hover:shadow-[0_18px_48px_rgba(11,42,91,0.14)]">
            <div className="flex aspect-[16/7] items-center justify-center overflow-hidden rounded-[1.7rem] bg-gradient-to-br from-blue-50 via-slate-100 to-blue-100">
              <div className="text-center">
                <div className="icon-glow mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-white/80 text-2xl text-blue-700 shadow-lg">
                  +
                </div>
                <span className="text-sm text-slate-500">Здесь будет фотография общей зоны</span>
              </div>
            </div>
          </div>
        </Reveal>

        {/* Сценарии дня */}
        <div className="mt-6 grid gap-6 md:grid-cols-3">
          {partsOfDay.map((part, index) => (
            <Reveal key={part.time} delay={index * 120}>
              <div className="glass h-full rounded-3xl p-7 transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_16px_40px_rgba(11,42,91,0.12)]">
                <span className="inline-block rounded-full bg-blue-100/80 px-3 py-1 text-xs font-semibold text-blue-700">
                  {part.time}
                </span>
                <h3 className="mt-4 text-xl font-semibold text-brand">{part.title}</h3>
                <p className="mt-3 leading-7 text-slate-600">{part.text}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
