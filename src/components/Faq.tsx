"use client";

import { useState } from "react";
import Reveal from "./Reveal";
import SectionHeading from "./SectionHeading";

const faqs = [
  {
    question: "Как проходит первое обращение?",
    answer:
      "Вы звоните или оставляете заявку — мы обсуждаем ситуацию, отвечаем на первые вопросы и приглашаем вас на знакомство с пансионатом.",
  },
  {
    question: "Можно ли приехать и посмотреть условия?",
    answer:
      "Да, мы открытые для визитов родственников. Договоритесь о удобном времени — мы проведём экскурсию и покажем, как устроен быт.",
  },
  {
    question: "Как организовано питание?",
    answer:
      "Питание регулярное, с учётом рекомендаций врача и привычек человека. Здесь будет подробное описание рациона и режима.",
  },
  {
    question: "Как родственники получают информацию?",
    answer:
      "Мы на связи: рассказываем о самочувствии и прошедшем дне по телефону или при личных встречах в согласованном формате.",
  },
  {
    question: "Что входит в стоимость?",
    answer:
      "В стоимость входят проживание, питание, повседневный уход и бытовое сопровождение. Точный состав услуг зависит от выбранного формата.",
  },
];

export default function Faq() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <section className="relative bg-white py-24">
      <div className="mx-auto max-w-4xl px-6">
        <SectionHeading eyebrow="FAQ" title="Частые вопросы" align="center" />

        <div className="mt-12 space-y-4">
          {faqs.map((faq, index) => {
            const isOpen = openIndex === index;

            return (
              <Reveal key={faq.question} delay={index * 80}>
                <div
                  className={`rounded-2xl p-6 transition-all duration-300 ${
                    isOpen
                      ? "glass-strong shadow-[0_16px_40px_rgba(11,42,91,0.12)]"
                      : "glass hover:shadow-[0_10px_28px_rgba(11,42,91,0.08)]"
                  }`}
                >
                  <button
                    type="button"
                    onClick={() => setOpenIndex(isOpen ? null : index)}
                    aria-expanded={isOpen}
                    className="flex w-full items-center justify-between gap-5 text-left"
                  >
                    <span className="font-semibold text-brand">{faq.question}</span>

                    <span
                      className={`icon-glow flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-xl transition-all duration-300 ${
                        isOpen
                          ? "rotate-45 bg-gradient-to-br from-blue-600 to-indigo-600 text-white shadow-md"
                          : "bg-white/70 text-blue-700"
                      }`}
                    >
                      +
                    </span>
                  </button>

                  <div
                    className={`grid transition-all duration-300 ease-out ${
                      isOpen ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
                    }`}
                  >
                    <div className="overflow-hidden">
                      <p className="pt-4 leading-7 text-slate-600">{faq.answer}</p>
                    </div>
                  </div>
                </div>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}
