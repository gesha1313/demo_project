import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import PageHeader from "@/components/PageHeader";
import Reveal from "@/components/Reveal";
import SectionHeading from "@/components/SectionHeading";

export const metadata: Metadata = {
  title: "Пансионат",
  description:
    "Пансионат «Народный» в Нижнем Новгороде (ул. 3-я Озёрная, 2): проживание с уходом и питанием от 900 ₽ в сутки, соцпрограмма «Проживание за пенсию».",
};

const facts = [
  { name: "900 ₽", note: "в сутки — акция для всех категорий" },
  { name: "2–3", note: "места в номерах пансионата" },
  { name: "24/7", note: "медицинское сопровождение и уход" },
];

const places = [
  {
    name: "Пансионат «Народный»",
    price: "от 900 ₽ / сутки",
    photo: "/photos/dosug-veranda.jpg",
    text: "Нижний Новгород, ул. 3-я Озёрная, д. 2 (Сормовский район). Проживание в 2–3-местных номерах, здоровое питание по рекомендациям Роспотребнадзора, медицинское сопровождение, досуг: лото, музыкальный час, прогулки на веранде, ЛФК и тренажёры.",
  },
  {
    name: "Соцпрограмма «Проживание за пенсию»",
    price: "для одиноких",
    photo: "/photos/dosug-loto.jpg",
    text: "Специальная программа для одиноких пожилых людей: проживание и полный уход оформляются через пенсию — без дополнительных платежей родственников. Позвоните, расскажем условия и оформим вместе с вами.",
  },
];

export default function PansionatPage() {
  return (
    <>
      <Header />
      <main className="flex-1">
        <PageHeader
          eyebrow="Пансионат"
          title="Проживание с уходом"
          description="Пансионат «Народный» в Нижнем Новгороде: комфорт, забота, медицинское сопровождение и увлекательная атмосфера."
        />

        <section className="section-band py-10 md:py-14">
          <div className="mx-auto max-w-7xl px-6">
            <SectionHeading eyebrow="Коротко о главном" title="Почему к нам приезжают" />
            <div className="mt-10 grid gap-5 md:grid-cols-3">
              {facts.map((fact, i) => (
                <Reveal key={fact.name} delay={i * 100}>
                  <div className="glass h-full rounded-lg p-8 text-center">
                    <div className="text-3xl font-bold text-brand">{fact.name}</div>
                    <div className="mt-2 text-sm text-slate-600">{fact.note}</div>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        <section id="districts" className="py-10 md:py-14">
          <div className="mx-auto max-w-7xl px-6">
            <SectionHeading
              eyebrow="Нижний Новгород"
              title="Наш пансионат"
              description="Цены указаны за сутки проживания с уходом и питанием."
            />
            <div className="mt-10 grid gap-5 md:grid-cols-2">
              {places.map((d, i) => (
                <Reveal key={d.name} delay={i * 120}>
                  <div className="glass flex h-full flex-col overflow-hidden rounded-lg">
                    <div className="relative aspect-[16/8]">
                      <Image
                        src={d.photo}
                        alt={d.name}
                        fill
                        sizes="(max-width: 768px) 100vw, 500px"
                        className="object-cover"
                      />
                    </div>
                    <div className="flex flex-1 flex-col p-7">
                      <div className="flex flex-wrap items-center justify-between gap-3">
                        <h2 className="text-xl font-semibold text-brand">{d.name}</h2>
                        <span className="glass-strong rounded-lg px-4 py-1.5 text-sm font-bold text-brand">
                          {d.price}
                        </span>
                      </div>
                      <p className="mt-4 leading-7 text-slate-600">{d.text}</p>
                      <Link
                        href="/register"
                        className="btn-glass-primary mt-auto mt-6 w-fit rounded-lg px-6 py-3 text-sm font-semibold"
                      >
                        Оставить заявку
                      </Link>
                    </div>
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
