import type { Metadata } from "next";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import PageHeader from "@/components/PageHeader";
import Reveal from "@/components/Reveal";

export const metadata: Metadata = {
  title: "Перевозка",
  description: "Транспортировка маломобильных людей — раздел готовится.",
};

export default function TransportPage() {
  return (
    <>
      <Header />
      <main className="flex-1">
        <PageHeader
          eyebrow="Перевозка"
          title="Транспортировка маломобильных людей"
        />
        <section className="py-12 md:py-16">
          <div className="mx-auto max-w-3xl px-6">
            <Reveal>
              <div className="glass rounded-lg p-10 text-center">
                <div className="text-lg font-semibold text-brand">Раздел готовится</div>
                <p className="mt-3 text-sm leading-6 text-slate-600">
                  Скоро здесь появится информация о транспортировке к врачам,
                  в больницу и на реабилитацию с сопровождением.
                </p>
                <p className="mt-2 text-sm text-slate-600">
                  Пока — звоните, договоримся по телефону.
                </p>
              </div>
            </Reveal>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
