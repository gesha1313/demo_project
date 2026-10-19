import Reveal from "./Reveal";
import SectionHeading from "./SectionHeading";
import SectionFooter from "./SectionFooter";

type SectionProps = {
  /** Переход к следующему блоку — задаётся страницей, а не секцией */
  footer?: { href: string; next: string; hint?: string };
};

const reviews = [
  {
    text: "Маму приняли быстро и без лишней бюрократии. Уже через неделю она привыкла к распорядку и даже стала ждать утренние прогулки. Отдельное спасибо сиделке Наталье за терпение и чувство юмора.",
    author: "Ирина",
    meta: "дочь Тамары Николаевны, «Комфорт»",
  },
  {
    text: "Бабушка живёт здесь восьмой месяц. Всегда чисто, тепло и пахнет домашней едой. Врача можно позвать в любой момент, а по вечерам мы созваниваемся по видеосвязи. Наконец спим спокойно.",
    author: "Алексей",
    meta: "внук Зинаиды Фёдоровны, «Стандарт»",
  },
  {
    text: "Переживали, как папа перенесёт переезд после инсульта. Сотрудники нашли подход с первого дня: помогали с реабилитацией и не давали унывать. Через три месяца он сам гуляет по саду.",
    author: "Мария",
    meta: "дочь Сергея Павловича, «Премиум»",
  },
  {
    text: "Заказывали патронажную сестру к дедушке два раза в неделю. Давление под контролем, уколы вовремя, а главное — дедушка ждёт её прихода как гостя. Очень тактичный человек.",
    author: "Ольга",
    meta: "внучка Ивана Петровича, патронаж",
  },
  {
    text: "Работаю в другом городе, а мама осталась одна. Ежедневные отчёты с фото снимают всю тревогу: вижу, что она накормлена, в чистой одежде и в хорошем настроении. Спасибо за честность.",
    author: "Дмитрий",
    meta: "сын Валентины Ивановны, домашний уход",
  },
  {
    text: "После перелома шейки бедра бабушке нужна была сиделка на месяц. Подобрали за день, специалист менялся посменно, домой выписались самостоятельно. Срочно и по-человечески.",
    author: "Екатерина",
    meta: "внучка Анны Семёновны, сменный уход",
  },
];

const cases = [
  {
    title: "Восстановление после инсульта",
    situation: "Мужчина 68 лет, после инсульта — слабость правой стороны, нарушена речь.",
    plan: "Индивидуальный план: ежедневная ЛФК с инструктором, занятия с логопедом, контроль лекарств и питания, эмоциональная поддержка семьи.",
    result: "Через 4 месяца самостоятельно передвигается по дому и читает вслух внукам.",
    time: "Срок: 4 месяца",
  },
  {
    title: "Уход за мамой с деменцией",
    situation: "Женщина 82 лет, деменция средней степени, дочь работала и не могла быть рядом днём.",
    plan: "Сиделка с 9 до 19 часов: бытовая помощь, прогулки, занятия на память, ведение дневника наблюдения для врача.",
    result: "Тревожность и срывы снизились, режим дня стабилизировался, дочь продолжает работать спокойно.",
    time: "Срок: постоянный уход, 10 месяцев",
  },
];

export default function Reviews({ footer }: SectionProps) {
  return (
    <section id="reviews" className="relative py-14 md:py-20">
      <div className="mx-auto max-w-7xl px-6">
        <SectionHeading
          eyebrow="Отзывы и кейсы"
          title="Истории семей"
          description="Что говорят родственники тех, кому мы уже помогаем."
        />

        <Reveal className="mt-8 flex w-fit items-center gap-3 rounded-full glass-strong px-5 py-3">
          <span className="text-2xl font-bold text-brand">4.9</span>
          <span className="text-lg tracking-wide text-amber-500">★★★★★</span>
          <span className="text-sm text-slate-700">средняя оценка · 27 отзывов</span>
        </Reveal>

        <div className="mt-8 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {reviews.map((review, index) => (
            <Reveal key={review.author} delay={index * 100}>
              <div className="glass flex h-full flex-col rounded-3xl p-7 transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_16px_40px_rgba(13,36,74,0.13)]">
                <div className="text-3xl leading-none text-sky-700/60">&ldquo;</div>
                <p className="mt-3 leading-7 text-slate-600">{review.text}</p>
                <div className="mt-auto flex items-center gap-3 pt-6">
                  <div className="glass-strong flex h-11 w-11 items-center justify-center rounded-full text-sm font-bold text-brand">
                    {review.author[0]}
                  </div>
                  <div>
                    <div className="text-sm font-medium text-brand">{review.author}</div>
                    <div className="text-xs text-slate-600">{review.meta}</div>
                  </div>
                </div>
              </div>
            </Reveal>
          ))}
        </div>

        <div className="mt-10 grid gap-5 md:grid-cols-2">
          {cases.map((item, index) => (
            <Reveal key={item.title} delay={index * 120}>
              <div className="glass-strong h-full rounded-3xl p-7">
                <div className="flex items-center justify-between gap-3">
                  <h3 className="text-lg font-semibold text-brand">{item.title}</h3>
                  <span className="shrink-0 rounded-full bg-sky-100/80 px-3 py-1 text-xs font-semibold text-sky-700">
                    {item.time}
                  </span>
                </div>
                <div className="mt-4 space-y-3 text-sm leading-6 text-slate-600">
                  <p>
                    <span className="font-semibold text-slate-700">Ситуация:</span>{" "}
                    {item.situation}
                  </p>
                  <p>
                    <span className="font-semibold text-slate-700">План действий:</span>{" "}
                    {item.plan}
                  </p>
                  <p>
                    <span className="font-semibold text-slate-700">Результат:</span>{" "}
                    {item.result}
                  </p>
                </div>
              </div>
            </Reveal>
          ))}
        </div>

        {footer ? <SectionFooter {...footer} /> : null}
      </div>
    </section>
  );
}
