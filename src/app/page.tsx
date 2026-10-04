import Header from "@/components/Header";
import Hero from "@/components/Hero";
import DailyLife from "@/components/DailyLife";
import Trust from "@/components/Trust";
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

export default function Home() {
  return (
    <>
      <Header />
      <main className="flex-1">
        <Hero />
        <DailyLife />
        <Trust />
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
