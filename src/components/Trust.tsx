import Reveal from "./Reveal";

const items = [
  {
    number: "01",
    title: "Комфорт",
    text: "Уютные 2–3-местные номера, регулярная уборка и смена белья.",
  },
  {
    number: "02",
    title: "Забота",
    text: "Гигиенические процедуры, здоровое питание и внимание к каждому постояльцу.",
  },
  {
    number: "03",
    title: "Сопровождение",
    text: "Медицинское сопровождение, массажная техника и восстановительные тренажёры.",
  },
];

export default function Trust() {
  return (
    <section className="section-dark relative overflow-hidden py-14">
      <div className="absolute -right-24 -top-20 h-72 w-72 animate-float rounded-full bg-brand/20 blur-3xl" />
      <div className="absolute -left-24 bottom-0 h-72 w-72 animate-float-slow rounded-full bg-brand-300/15 blur-3xl" />

      <div className="relative mx-auto grid max-w-7xl gap-4 px-6 md:grid-cols-3">
        {items.map((item, index) => (
          <Reveal key={item.number} delay={index * 120}>
            <div className="glass-dark h-full rounded-lg p-6 transition-all duration-300">
              <div className="text-2xl font-semibold text-white/80">{item.number}</div>
              <h3 className="mt-3 text-lg font-semibold text-white">{item.title}</h3>
              <p className="mt-2 text-base leading-7 text-slate-300">{item.text}</p>
            </div>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
