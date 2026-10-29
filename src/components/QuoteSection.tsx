import Image from "next/image";
import Reveal from "./Reveal";

/** Эмоциональный пик страницы: тёмная секция с историей про танцы в 101 год */
export default function QuoteSection() {
  return (
    <section className="section-dark relative overflow-hidden py-12 md:py-16">
      <div className="absolute -right-24 -top-20 h-72 w-72 animate-float rounded-full bg-brand/20 blur-3xl" />

      <div className="relative mx-auto grid max-w-7xl items-center gap-10 px-6 md:grid-cols-2 md:gap-14">
        <Reveal>
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-white/70">
            Жизнь в пансионате
          </p>

          <blockquote className="mt-4 text-2xl font-semibold leading-snug text-white md:text-4xl md:leading-snug">
            Танцы в 101 год — у нас это нормально.
          </blockquote>

          <p className="mt-5 max-w-lg text-base leading-7 text-slate-200">
            Возраст — не повод перестать радоваться жизни. Музыкальный час,
            праздники, прогулки и танцы — обычные будни «Народного».
          </p>

          <a
            href="https://youtube.com/shorts/gDwIBg29Avc"
            target="_blank"
            rel="noopener noreferrer"
            className="mt-7 inline-flex items-center gap-2 rounded-lg border border-white/30 px-5 py-3 text-sm font-semibold text-white transition-colors duration-200 hover:bg-white/10"
          >
            ▶ Смотреть видео
          </a>
        </Reveal>

        <Reveal delay={150}>
          <div className="glass-dark mx-auto w-full max-w-sm overflow-hidden rounded-lg p-2 md:max-w-md">
            <div className="relative aspect-[3/4] overflow-hidden rounded-lg">
              <Image
                src="/photos/tancy-101.png"
                alt="Постоялица пансионата танцует в 101 год"
                fill
                sizes="(max-width: 768px) 90vw, 420px"
                className="object-cover"
              />
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
