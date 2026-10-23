import Reveal from "./Reveal";
import SectionHeading from "./SectionHeading";

const items = [
  {
    title: "Условия расторжения договора",
    text: "Расторжение в любой момент, за 3 дня, без штрафов.",
  },
  {
    title: "Гарантия качества услуг",
    text: "Не подошёл специалист — заменим за сутки бесплатно.",
  },
  {
    title: "Возврат средств",
    text: "Неиспользованный аванс возвращаем за 5 рабочих дней.",
  },
];

export default function Guarantees() {
  return (
    <section id="documents" className="relative py-10 md:py-14">
      <div className="mx-auto max-w-7xl px-6">
        <SectionHeading
          eyebrow="Гарантии и документы"
          title="Юридическая прозрачность"
          description="Все условия зафиксированы в договоре — никаких устных обещаний."
        />

        <div className="mt-10 grid gap-5 md:grid-cols-3">
          {items.map((item, index) => (
            <Reveal key={item.title} delay={index * 100}>
              <div className="glass h-full rounded-xl p-7 transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_16px_40px_rgba(13,36,74,0.13)]">
                <h3 className="text-lg font-semibold text-brand">{item.title}</h3>
                <p className="mt-3 leading-7 text-slate-600">{item.text}</p>
              </div>
            </Reveal>
          ))}
        </div>

        <Reveal className="mt-8" delay={150}>
          <div className="glass flex flex-wrap items-center gap-4 rounded-xl px-7 py-5 text-sm">
            <span className="font-semibold text-brand">Документы:</span>
            <a
              href="https://drive.google.com/uc?export=download&id=1oiYP_Hb3tZm9PJ-GmBfVCgdKdAkNpg80"
              target="_blank"
              rel="noopener noreferrer"
              className="text-sky-700 hover:underline"
            >
              Договор оферты (PDF)
            </a>
            <a href="#" className="text-sky-700 hover:underline">
              Политика конфиденциальности (PDF)
            </a>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
