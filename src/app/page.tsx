import Header from "@/components/Header";
import Hero from "@/components/Hero";
import Trust from "@/components/Trust";
import About from "@/components/About";
import DailyLife from "@/components/DailyLife";
import Safety from "@/components/Safety";
import WhyUs from "@/components/WhyUs";
import Services from "@/components/Services";
import HowToStart from "@/components/HowToStart";
import Team from "@/components/Team";
import Reviews from "@/components/Reviews";
import Pricing from "@/components/Pricing";
import Faq from "@/components/Faq";
import Contacts from "@/components/Contacts";
import QuickForm from "@/components/QuickForm";
import StickyNav from "@/components/StickyNav";
import Guarantees from "@/components/Guarantees";
import Footer from "@/components/Footer";

/** Структурированные данные для поисковых систем: организация и рейтинг отзывов */
const JSON_LD = JSON.stringify({
  "@context": "https://schema.org",
  "@type": "LocalBusiness",
  name: "Патронаж",
  telephone: "+7 (999) 139-39-04",
  email: "sarkana999@gmail.com",
  address: "г. Москва, ул. Тихая, 12",
  aggregateRating: { "@type": "AggregateRating", ratingValue: "4.9", reviewCount: "27" },
});

/**
 * Главная — одностраничный сайт по пути клиента:
 * Главная → Проблемы → О пансионате → Услуги → Как мы работаем →
 * Команда → Отзывы → Тарифы → FAQ → Контакты → Форма заявки.
 */
export default function Home() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON_LD }} />
      <Header />
      <main className="flex-1">
        <Hero />
        <QuickForm />
        <StickyNav />
        <Trust />
        <About />
        <DailyLife />
        <Safety />
        <WhyUs />
        <Services
          footer={{
            href: "#how",
            next: "Как мы работаем",
            hint: "Прозрачные шаги от заявки до начала ухода",
          }}
        />
        <HowToStart
          footer={{
            href: "#team",
            next: "Наша команда",
            hint: "Люди, которые будут заботиться о близком",
          }}
        />
        <Team />
        <Reviews
          footer={{
            href: "#pricing",
            next: "Тарифы и стоимость",
            hint: "Понятные цены без скрытых доплат",
          }}
        />
        <Pricing
          footer={{
            href: "#faq",
            next: "Частые вопросы",
            hint: "Ответы на то, что чаще всего спрашивают родственники",
          }}
        />
        <Faq
          footer={{
            href: "#contacts",
            next: "Контакты и заявка",
            hint: "Позвоните или оставьте заявку — ответим сразу",
          }}
        />
        <Contacts />
        <Guarantees />
      </main>
      <Footer />
    </>
  );
}
