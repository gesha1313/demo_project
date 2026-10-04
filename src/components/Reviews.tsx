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
];

export default function Reviews({ footer }: SectionProps) {
  return (
    <section id="reviews" className="relative py-14 md:py-20">
      <div className="mx-auto max-w-7xl px-6">
        <SectionHeading
          eyebrow="Отзывы"
          title="Истории семей"
          description="Что говорят родственники тех, кто уже живёт у нас."
        />

        <div className="mt-10 grid gap-5 md:grid-cols-3">
          {reviews.map((review, index) => (
            <Reveal key={review.author} delay={index * 120}>
              <div className="glass flex h-full flex-col rounded-3xl p-7 transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_16px_40px_rgba(13,36,74,0.13)]">
                <div className="text-3xl leading-none text-blue-700/60">&ldquo;</div>
                <p className="mt-3 leading-7 text-slate-600">{review.text}</p>
                <div className="mt-auto pt-6">
                  <div className="glass-strong w-fit rounded-full px-4 py-2 text-sm font-medium text-brand">
                    {review.author}
                  </div>
                  <div className="mt-2 pl-1 text-xs text-slate-400">{review.meta}</div>
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
