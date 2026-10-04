import Header from "@/components/Header";
import Hero from "@/components/Hero";
import Trust from "@/components/Trust";
import Services from "@/components/Services";
import HowToStart from "@/components/HowToStart";
import CaregiversMap from "@/components/CaregiversMap";
import Reviews from "@/components/Reviews";
import CtaSection from "@/components/CtaSection";
import Footer from "@/components/Footer";

/**
 * Главная — только самое основное: первый экран, принципы,
 * услуги (кратко), как начать, карта свободных сиделок, отзывы
 * и призыв к действию. Подробности живут на своих страницах
 * (/about, /services), каждый блок заканчивается переходом «по смыслу».
 */
export default function Home() {
  return (
    <>
      <Header />
      <main className="flex-1">
        <Hero />
        <Trust />
        <CaregiversMap />
        <Services
          footer={{
            href: "#how",
            next: "Как начинается знакомство",
            hint: "Три шага: разговор, подбор варианта, решение",
          }}
        />
        <HowToStart
          footer={{
            href: "#reviews",
            next: "Истории семей",
            hint: "Отзывы тех, кто уже доверил нам близкого человека",
          }}
        />
        <Reviews
          footer={{
            href: "/services",
            next: "Услуги, условия и стоимость",
            hint: "Подробная информация — на отдельной странице",
          }}
        />
        <CtaSection />
      </main>
      <Footer />
    </>
  );
}
