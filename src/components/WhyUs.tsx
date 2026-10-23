import Link from "next/link";
import Reveal from "./Reveal";
import SectionHeading from "./SectionHeading";

const advantages = [
  {
    title: "Квалифицированные медсёстры и сиделки",
    text: "Сертификация, профильное образование и опыт работы от 3 лет.",
  },
  {
    title: "Индивидуальные планы ухода",
    text: "План составляется под состояние и привычки конкретного человека.",
  },
  {
    title: "Гибкие графики и экстренные выезды",
    text: "Почасово, ежедневно, посменно. Подбор за день.",
  },
  {
    title: "Строгий отбор сотрудников",
    text: "Проверка благонадёжности, рекомендации, медосмотр и справки — обязательны.",
  },
  {
    title: "Отчётность семье и родственникам",
    text: "Ежедневные отчёты, фото и записи о состоянии и самочувствии близкого.",
  },
  {
    title: "Гарантия качества",
    text: "Если специалист не подошёл — бесплатно заменим в течение суток.",
  },
];

export default function WhyUs() {
  return (
    <section id="why-us" className="relative py-10 md:py-14">
      <div className="mx-auto max-w-7xl px-6">
        <SectionHeading
          eyebrow="Почему именно мы"
          title="Аргументы, а не обещания"
          description="Мы собрали всё, что снимает главные сомнения родственников, в один список."
        />

        <div className="mt-10 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {advantages.map((item, index) => (
            <Reveal key={item.title} delay={index * 100}>
              <div className="glass h-full rounded-xl p-6 transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_16px_40px_rgba(13,36,74,0.13)]">
                <h3 className="font-semibold text-brand">{item.title}</h3>
                <p className="mt-2 text-sm leading-6 text-slate-600">{item.text}</p>
              </div>
            </Reveal>
          ))}
        </div>

        <Reveal className="mt-10 text-center" delay={150}>
          <Link
            href="/register"
            className="btn-glass-primary inline-block rounded-full px-8 py-3.5 text-sm font-semibold"
          >
            Записаться на консультацию
          </Link>
        </Reveal>
      </div>
    </section>
  );
}
