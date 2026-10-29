import type { Metadata } from "next";
import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import PageHeader from "@/components/PageHeader";
import Reveal from "@/components/Reveal";
import SectionHeading from "@/components/SectionHeading";

export const metadata: Metadata = {
  title: "Услуга сиделки",
  description:
    "Сиделки на 2 часа, 12 часов и сутки: цены, что входит в уход, оформление за один звонок.",
};

const tariffs = [
  {
    title: "Сиделка на 2 часа",
    time: "утро или вечер",
    price: "от 5 000 ₽",
    text: "Помощь по утрам или вечерам: гигиена, завтрак или ужин, приём лекарств, короткая прогулка, уборка и общение.",
    items: ["Гигиена и кормление", "Контроль лекарств", "Прогулка и общение"],
  },
  {
    title: "Сиделка на 12 часов",
    time: "день или ночь",
    price: "от 10 000 ₽",
    text: "Полный дневной или ночной присмотр: все бытовые вопросы, процедуры по назначению врача, наблюдение за состоянием.",
    items: ["Всё из тарифа «2 часа»", "Медпроцедуры по назначению", "Отчёт семье за смену"],
  },
  {
    title: "Сиделка на сутки",
    time: "24 часа",
    price: "от 20 000 ₽",
    text: "Круглосуточное сопровождение для лежачих и маломобильных подопечных, когда нельзя оставлять одного ни на час.",
    items: ["Всё из тарифа «12 часов»", "Ночное наблюдение", "Профилактика пролежней"],
  },
];

export default function SidelkiPage() {
  return (
    <>
      <Header />
      <main className="flex-1">
        <PageHeader
          eyebrow="Услуга сиделки"
          title="Сиделка на нужный вам срок"
          description="Проверенные специалисты с опытом и медицинской подготовкой. Подбираем под характер и привычки человека — если не подошло, заменим бесплатно в течение суток."
        />

        <section className="section-band py-12 md:py-16">
          <div className="mx-auto max-w-7xl px-6">
            <SectionHeading
              eyebrow="Тарифы"
              title="Форматы и цены"
              description="Оплата за смену, без скрытых доплат. Итоговая стоимость фиксируется в договоре."
            />
            <div className="mt-10 grid gap-5 md:grid-cols-3">
              {tariffs.map((t, i) => (
                <Reveal key={t.title} delay={i * 100}>
                  <div className="glass relative flex h-full flex-col rounded-lg p-6 transition-transform duration-300">
                    <span className="glass-strong w-fit rounded-lg px-3 py-1 text-xs font-semibold text-brand">
                      {t.time}
                    </span>
                    <h2 className="mt-4 text-lg font-semibold text-brand">{t.title}</h2>
                    <div className="mt-2 text-2xl font-bold text-brand">{t.price}</div>
                    <p className="mt-3 text-sm leading-6 text-slate-600">{t.text}</p>
                    <ul className="mt-4 space-y-2 text-sm text-slate-600">
                      {t.items.map((item) => (
                        <li key={item} className="flex gap-2">
                          <span className="text-brand">—</span>
                          {item}
                        </li>
                      ))}
                    </ul>
                    <Link
                      href="/register"
                      className="btn-glass-primary mt-auto mt-6 w-full rounded-lg px-6 py-3 text-center text-sm font-semibold"
                    >
                      Заказать
                    </Link>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
