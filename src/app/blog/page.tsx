import type { Metadata } from "next";
import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import PageHeader from "@/components/PageHeader";
import Reveal from "@/components/Reveal";

export const metadata: Metadata = {
  title: "Блог и поддержка родственников",
  description:
    "Полезные статьи об уходе за пожилыми, советы по выбору сиделки и реабилитации, а также психологическая поддержка для родственников.",
};

const posts = [
  {
    title: "Как выбрать сиделку: 7 признаков надёжного специалиста",
    excerpt:
      "На что смотреть кроме опыта: документы, рекомендации, личная совместимость и пробный визит. Чек-лист для первой встречи.",
    tag: "Выбор сиделки",
    date: "12 октября 2026",
    href: "#",
  },
  {
    title: "Уход за лежачим больным: базовые правила и профилактика пролежней",
    excerpt:
      "Положение в кровати, обработка кожи, смены белья и питание — понятная инструкция для родственников, которые ухаживают сами.",
    tag: "Советы по уходу",
    date: "28 сентября 2026",
    href: "#",
  },
  {
    title: "Реабилитация после инсульта: чего ждать и как помогать",
    excerpt:
      "Этапы восстановления, реалистичные сроки, роль семьи и специалистов. Что можно делать дома, а что только с врачом.",
    tag: "Реабилитация",
    date: "10 сентября 2026",
    href: "#",
  },
];

export default function BlogPage() {
  return (
    <>
      <Header />
      <main className="flex-1">
        <PageHeader
          eyebrow="Блог"
          title="Полезные статьи и поддержка"
          description="Материалы, которые помогают родственникам понимать уход, реабилитацию и свои силы."
          links={[{ href: "#posts", label: "Статьи" }, { href: "#psychology", label: "Психологическая помощь" }]}
        />

        <section id="posts" className="relative py-12 md:py-16">
          <div className="mx-auto max-w-7xl px-6">
            <div className="grid gap-5 md:grid-cols-3">
              {posts.map((post, index) => (
                <Reveal key={post.title} delay={index * 100}>
                  <article className="glass flex h-full flex-col rounded-lg p-6 transition-all duration-300 hover:shadow-[0_16px_40px_rgba(13,36,74,0.13)]">
                    <div className="flex items-center gap-2 text-xs">
                      <span className="glass-strong rounded-lg px-3 py-1 font-semibold text-brand">
                        {post.tag}
                      </span>
                      <span className="text-slate-600">{post.date}</span>
                    </div>
                    <h2 className="mt-4 text-lg font-semibold leading-7 text-brand">{post.title}</h2>
                    <p className="mt-3 text-sm leading-6 text-slate-600">{post.excerpt}</p>
                    <Link
                      href={post.href}
                      className="mt-auto w-fit pt-5 text-sm font-semibold text-brand transition-all duration-200 hover:text-brand-dark"
                    >
                      Читать статью →
                    </Link>
                  </article>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        <section id="psychology" className="section-band relative py-12 md:py-16">
          <div className="mx-auto max-w-4xl px-6">
            <Reveal>
              <div className="glass-strong rounded-lg p-6 md:p-8 md:p-12">
                <div className="text-xs font-semibold uppercase tracking-widest text-brand">
                  Психологическая помощь и поддержка родственников
                </div>
                <h2 className="mt-4 text-2xl font-bold text-brand md:text-3xl">
                  Заботиться — это тяжело. Вы не одни
                </h2>
                <div className="mt-5 space-y-4 leading-8 text-slate-600">
                  <p>
                    Чувство вины, усталость и страх ошибиться — почти неизбежные спутники того,
                    кто ухаживает за близким. Это нормально, и с этим можно работать.
                  </p>
                  <p>
                    Наш психолог проводит бесплатные консультации для родственников
                    постояльцев: помогает выстроить границы, справиться с выгоранием и
                    наладить отношения с близким в новых условиях.
                  </p>
                </div>
                <Link
                  href="/#contacts"
                  className="btn-glass-primary mt-8 inline-block rounded-lg px-8 py-3.5 text-sm font-semibold"
                >
                  Записаться на консультацию психолога
                </Link>
              </div>
            </Reveal>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
