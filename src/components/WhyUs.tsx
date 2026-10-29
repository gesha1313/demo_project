import Link from "next/link";
import Reveal from "./Reveal";
import SectionHeading from "./SectionHeading";

const advantages = [
  {
    title: "Проживание в 2–3-местных номерах",
    text: "Уютные комнаты с всем необходимым для комфортной жизни.",
  },
  {
    title: "Здоровое питание",
    text: "Меню по рекомендациям Роспотребнадзора, пятиразовый режим.",
  },
  {
    title: "Медицинское сопровождение",
    text: "Ежедневный контроль состояния здоровья постояльцев.",
  },
  {
    title: "Гигиенические процедуры",
    text: "Помощь в самообслуживании и индивидуальная гигиена.",
  },
  {
    title: "Все досуговые мероприятия",
    text: "Лото, музыкальный час, прогулки, ЛФК, игры и развлечения.",
  },
  {
    title: "Уборка и смена белья",
    text: "Регулярная уборка номеров и свежее бельё — без доплат.",
  },
  {
    title: "Смехотерапия",
    text: "Хорошие эмоции — часть заботы о здоровье и настроении.",
  },
  {
    title: "Массажная техника",
    text: "Массажное оборудование для здоровья и самочувствия.",
  },
  {
    title: "Восстановительные тренажёры",
    text: "Занятия для подвижности и сохранения активности.",
  },
];

export default function WhyUs() {
  return (
    <section id="why-us" className="relative py-10 md:py-14">
      <div className="mx-auto max-w-7xl px-6">
        <SectionHeading
          eyebrow="Почему именно мы"
          title="Всё это уже входит в стоимость"
          description="Проживание, питание, уход и досуг — один тариф без скрытых доплат."
        />

        <div className="mt-10 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {advantages.map((item, index) => (
            <Reveal key={item.title} delay={index * 100} className="lg:col-span-1">
              <div className="glass h-full rounded-lg p-6 transition-all duration-300 hover:shadow-[0_16px_40px_rgba(13,36,74,0.13)]">
                <h3 className="font-semibold text-brand">{item.title}</h3>
                <p className="mt-2 text-sm leading-6 text-slate-600">{item.text}</p>
              </div>
            </Reveal>
          ))}
        </div>

        <Reveal className="mt-10 text-center" delay={150}>
          <Link
            href="/register"
            className="btn-glass-primary inline-block rounded-lg px-8 py-3.5 text-sm font-semibold"
          >
            Записаться на экскурсию
          </Link>
        </Reveal>
      </div>
    </section>
  );
}
