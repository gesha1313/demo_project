import Reveal from "./Reveal";
import SectionHeading from "./SectionHeading";
import SectionFooter from "./SectionFooter";

const reviews = [
  { text: "Здесь будет настоящий отзыв клиента.", author: "Имя клиента" },
  { text: "Здесь будет настоящий отзыв клиента.", author: "Имя клиента" },
  { text: "Здесь будет настоящий отзыв клиента.", author: "Имя клиента" },
];

export default function Reviews() {
  return (
    <section id="reviews" className="relative py-14 md:py-20">
      <div className="mx-auto max-w-7xl px-6">
        <SectionHeading eyebrow="Отзывы" title="Истории семей" />

        <div className="mt-10 grid gap-5 md:grid-cols-3">
          {reviews.map((review, index) => (
            <Reveal key={index} delay={index * 120}>
              <div className="glass flex h-full flex-col rounded-3xl p-7 transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_16px_40px_rgba(13,36,74,0.13)]">
                <div className="text-3xl leading-none text-blue-700/60">&ldquo;</div>
                <p className="mt-3 leading-7 text-slate-600">{review.text}</p>
                <div className="mt-auto pt-6">
                  <div className="glass-strong w-fit rounded-full px-4 py-2 text-sm font-medium text-brand">
                    {review.author}
                  </div>
                </div>
              </div>
            </Reveal>
          ))}
        </div>

        <SectionFooter
          href="#pricing"
          next="Условия и стоимость"
          hint="Прозрачный расчёт — что входит в оплату"
        />
      </div>
    </section>
  );
}
