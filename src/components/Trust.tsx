import Reveal from "./Reveal";

const items = [
  { number: "01", title: "Люди", text: "Кто будет рядом с вашим близким каждый день." },
  { number: "02", title: "Условия", text: "Где живёт человек и как организован его быт." },
  { number: "03", title: "Открытость", text: "Вы понимаете, что происходит с вашим близким." },
];

export default function Trust() {
  return (
    <section className="border-b border-slate-200/70 bg-gradient-to-b from-white to-blue-50/50">
      <div className="mx-auto grid max-w-7xl gap-4 px-6 py-16 md:grid-cols-3">
        {items.map((item, index) => (
          <Reveal key={item.number} delay={index * 120}>
            <div className="glass h-full rounded-3xl p-8 text-center transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_16px_40px_rgba(11,42,91,0.12)] md:text-left">
              <div className="bg-gradient-to-br from-blue-600 to-indigo-600 bg-clip-text text-3xl font-semibold text-transparent">
                {item.number}
              </div>
              <h3 className="mt-3 font-semibold text-brand">{item.title}</h3>
              <p className="mt-2 text-sm leading-6 text-slate-500">{item.text}</p>
            </div>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
