import type { Metadata } from "next";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import PageHeader from "@/components/PageHeader";
import Services from "@/components/Services";
import Conditions from "@/components/Conditions";
import Pricing from "@/components/Pricing";
import Faq from "@/components/Faq";

export const metadata: Metadata = {
  title: "Услуги и условия",
  description:
    "Форматы ухода, что входит в проживание, стоимость и ответы на частые вопросы о пансионате.",
};

export default function ServicesPage() {
  return (
    <>
      <Header />
      <main className="flex-1">
        <PageHeader
          eyebrow="Услуги и условия"
          title="Помощь, условия и стоимость"
          description="Подбираем формат ухода под ситуацию человека. Здесь же — что входит в проживание, как формируется стоимость и ответы на частые вопросы."
          links={[
            { href: "#services", label: "Услуги" },
            { href: "#conditions", label: "Условия" },
            { href: "#pricing", label: "Стоимость" },
            { href: "#faq", label: "Частые вопросы" },
          ]}
        />

        <Services
          footer={{
            href: "#conditions",
            next: "Что входит в проживание",
            hint: "Заранее понятные условия — без скрытых деталей",
          }}
        />

        <Conditions
          footer={{
            href: "#pricing",
            next: "Условия и стоимость",
            hint: "Прозрачный расчёт — что входит в оплату",
          }}
        />

        <Pricing
          footer={{
            href: "#faq",
            next: "Частые вопросы",
            hint: "Короткие ответы о первом обращении, питании и связи",
          }}
        />

        <Faq
          footer={{
            href: "/register",
            next: "Получить консультацию",
            hint: "Оставьте заявку — перезвоним в течение рабочего дня",
          }}
        />
      </main>
      <Footer />
    </>
  );
}
