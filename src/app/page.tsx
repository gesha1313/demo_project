import Header from "@/components/Header";
import Hero from "@/components/Hero";
import Trust from "@/components/Trust";
import DailyLife from "@/components/DailyLife";
import Services from "@/components/Services";
import HowToStart from "@/components/HowToStart";
import Conditions from "@/components/Conditions";
import About from "@/components/About";
import Safety from "@/components/Safety";
import Reviews from "@/components/Reviews";
import Pricing from "@/components/Pricing";
import Faq from "@/components/Faq";
import CtaSection from "@/components/CtaSection";
import Footer from "@/components/Footer";

/**
 * Главная — «цепочка знакомства» с пансионатом:
 * Hero → принципы (тёмная полоса) → жизнь → услуги → как начать →
 * условия → люди → безопасность → отзывы → стоимость → FAQ → CTA.
 * Каждый блок заканчивается переходом к следующему (SectionFooter).
 */
export default function Home() {
  return (
    <>
      <Header />
      <main className="flex-1">
        <Hero />
        <Trust />
        <DailyLife />
        <Services />
        <HowToStart />
        <Conditions />
        <About />
        <Safety />
        <Reviews />
        <Pricing />
        <Faq />
        <CtaSection />
      </main>
      <Footer />
    </>
  );
}
