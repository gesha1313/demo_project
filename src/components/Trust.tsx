import Reveal from "./Reveal";

const items = [
  { number: "01", title: "Люди", text: "Кто будет рядом с вашим близким каждый день." },
  { number: "02", title: "Условия", text: "Где живёт человек и как организован его быт." },
  { number: "03", title: "Открытость", text: "Вы понимаете, что происходит с вашим близким." },
];

export default function Trust() {
  return (
    <section className="section-dark relative overflow-hidden py-14">
      <div className="absolute -right-24 -top-20 h-72 w-72 animate-float rounded-full bg-blue-500/20 blur-3xl" />
      <div className="absolute -left-24 bottom-0 h-72 w-72 animate-float-slow rounded-full bg-indigo-400/15 blur-3xl" />

      <div className="relative mx-auto grid max-w-7xl gap-4 px-6 md:grid-cols-3">
        {items.map((item, index) => (
          <Reveal key={item.number} delay={index * 120}>
            <div className="glass-dark h-full rounded-3xl p-7 transition-all duration-300 hover:-translate-y-1">
              <div className="text-3xl font-semibold text-blue-200">{item.number}</div>
              <h3 className="mt-3 font-semibold text-white">{item.title}</h3>
              <p className="mt-2 text-sm leading-6 text-blue-100/75">{item.text}</p>
            </div>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
