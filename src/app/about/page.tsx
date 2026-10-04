import type { Metadata } from "next";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import PageHeader from "@/components/PageHeader";
import DailyLife from "@/components/DailyLife";
import About from "@/components/About";
import Safety from "@/components/Safety";

export const metadata: Metadata = {
  title: "О пансионате",
  description:
    "Как устроен обычный день, кто работает в пансионате и как организована безопасность и связь с родственниками.",
};

export default function AboutPage() {
  return (
    <>
      <Header />
      <main className="flex-1">
        <PageHeader
          eyebrow="О пансионате"
          title="Жизнь, люди и безопасность"
          description="Пансионат — это не только уход, но и привычный ритм жизни. Рассказываем, как устроен день, кто рядом с вашими близкими и как вы всегда будете в курсе происходящего."
          links={[
            { href: "#life", label: "Обычный день" },
            { href: "#about", label: "Команда" },
            { href: "#safety", label: "Безопасность" },
          ]}
        />

        <DailyLife
          footer={{
            href: "#about",
            next: "За заботой стоят конкретные люди",
            hint: "Команда, опыт и принципы работы",
          }}
        />

        <About
          footer={{
            href: "#safety",
            next: "Как устроена безопасность",
            hint: "Контроль состояния и связь с родственниками",
          }}
        />

        <Safety
          footer={{
            href: "/services",
            next: "Услуги, условия и стоимость",
            hint: "Форматы помощи, условия и ответы на частые вопросы",
          }}
        />
      </main>
      <Footer />
    </>
  );
}
