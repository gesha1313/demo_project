import Reveal from "./Reveal";
import SectionHeading from "./SectionHeading";

const team = [
  {
    name: "Наталья Ковалёва",
    role: "Старшая медицинская сестра",
    exp: "Опыт 14 лет",
    spec: "Лежачие больные, паллиативный уход",
    docs: "Сертификат «Сестринское дело», медкнижка, ежегодная вакцинация",
  },
  {
    name: "Ирина Соколова",
    role: "Патронажная сестра",
    exp: "Опыт 9 лет",
    spec: "Инъекции, перевязки, контроль давления",
    docs: "Сертификат по процедурной сестринской работе, справка об отсутствии судимости",
  },
  {
    name: "Анна Морозова",
    role: "Сиделка с медицинским образованием",
    exp: "Опыт 6 лет",
    spec: "Деменция и болезнь Альцгеймера",
    docs: "Курсы по уходу за людьми с деменцией, медкнижка",
  },
  {
    name: "Дмитрий Лебедев",
    role: "Сиделка, сопровождение",
    exp: "Опыт 5 лет",
    spec: "Сопровождение, транспортировка, ЛФК",
    docs: "Сертификат бакалавра адаптивной физкультуры, проверка благонадёжности",
  },
];

export default function Team() {
  return (
    <section id="team" className="section-band relative py-10 md:py-14">
      <div className="mx-auto max-w-7xl px-6">
        <SectionHeading
          eyebrow="Команда"
          title="Люди, которым вы доверите близкого"
          description="Краткие профили сотрудников: квалификация, опыт и обязательные проверки."
        />

        <div className="mt-10 grid gap-5 md:grid-cols-2 lg:grid-cols-4">
          {team.map((person, index) => (
            <Reveal key={person.name} delay={index * 100}>
              <div className="glass flex h-full flex-col rounded-lg p-7 transition-all duration-300 hover:shadow-[0_16px_40px_rgba(13,36,74,0.13)]">
                <div className="glass-strong icon-glow flex h-14 w-14 items-center justify-center rounded-full text-lg font-bold text-brand">
                  {person.name.split(" ").map((w) => w[0]).join("")}
                </div>
                <h3 className="mt-5 text-lg font-semibold text-brand">{person.name}</h3>
                <p className="mt-1 text-sm font-medium text-brand">{person.role}</p>
                <p className="mt-3 text-sm text-slate-700">{person.exp}</p>
                <p className="mt-2 text-sm leading-6 text-slate-600">{person.spec}</p>
                <p className="mt-auto pt-4 text-xs leading-5 text-slate-600">{person.docs}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
