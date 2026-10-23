import Reveal from "./Reveal";
import SectionHeading from "./SectionHeading";
import SectionFooter from "./SectionFooter";

type SectionProps = {
  /** Переход к следующему блоку — задаётся страницей, а не секцией */
  footer?: { href: string; next: string; hint?: string };
};

const items = [
  {
    title: "Гигиена и чистота",
    text: "Обработка помещений по графику, индивидуальная гигиена.",
  },
  {
    title: "Медицинские протоколы",
    text: "Процедуры — по протоколам и назначению врача.",
  },
  {
    title: "Вакцинация персонала",
    text: "Ежегодная вакцинация и медосмотры, медкнижки у всех.",
  },
  {
    title: "Контроль медикаментов",
    text: "Лекарства — под контролем медсестры, по расписанию.",
  },
];

export default function Safety({ footer }: SectionProps) {
  return (
    <section id="safety" className="section-band relative overflow-hidden py-10 md:py-14">
      <div className="absolute -left-32 bottom-0 h-80 w-80 animate-float-slow rounded-full bg-sky-200/40 blur-3xl" />

      <div className="relative mx-auto max-w-7xl px-6">
        <SectionHeading
          eyebrow="Безопасность и стандарты качества"
          title="Спокойствие родственников тоже важно"
        />

        <div className="mt-10 grid gap-5 md:grid-cols-2 lg:grid-cols-4">
          {items.map((item, index) => (
            <Reveal key={item.title} delay={index * 120}>
              <div className="glass h-full rounded-xl p-7 transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_16px_40px_rgba(13,36,74,0.13)]">
                <h3 className="text-lg font-semibold text-brand">{item.title}</h3>
                <p className="mt-3 leading-7 text-slate-600">{item.text}</p>
              </div>
            </Reveal>
          ))}
        </div>

        <Reveal className="mt-5" delay={200}>
          <div className="glass flex flex-wrap items-center gap-x-6 gap-y-2 rounded-xl px-7 py-5 text-sm text-slate-600">
            <span className="font-semibold text-brand">Сертификаты и проверки:</span>
            <span>Лицензия Минздрава</span>
            <span>Сертификаты сотрудников</span>
            <span>Медосмотры и справки</span>
            <span>Проверка благонадёжности персонала</span>
          </div>
        </Reveal>

        {footer ? <SectionFooter {...footer} /> : null}
      </div>
    </section>
  );
}
