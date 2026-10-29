import { site } from "@/lib/site";
import Reveal from "./Reveal";
import SectionHeading from "./SectionHeading";
import LeadForm from "./LeadForm";

export default function Contacts() {
  return (
    <section id="contacts" className="relative py-12 md:py-16">
      <div className="mx-auto max-w-7xl px-6">
        <SectionHeading
          eyebrow="Контакты"
          title="Звоните — будем рады показать и рассказать о пансионате"
          description="Приезжайте на экскурсию или оставьте заявку — ответим сразу."
        />

        <div className="mt-10 grid gap-5 lg:grid-cols-2">
          <Reveal>
            <div className="flex h-full flex-col gap-5">
              <div className="glass rounded-lg p-6">
                <div className="space-y-3 text-sm text-slate-600">
                  <p>
                    <span className="font-semibold text-brand">Адрес:</span> {site.address}
                  </p>
                  <p>
                    <span className="font-semibold text-brand">Рабочие часы:</span> {site.hours}
                  </p>
                  <p>
                    <span className="font-semibold text-brand">Email:</span>{" "}
                    <a href={`mailto:${site.email}`} className="text-brand hover:underline">
                      {site.email}
                    </a>
                  </p>
                </div>
                <a
                  href={site.phoneHref}
                  className="btn-glass-primary mt-6 inline-block rounded-lg px-7 py-3 text-sm font-semibold"
                >
                  {site.phone}
                </a>
                <div className="mt-5 flex flex-wrap gap-2 text-xs">
                  <a href={site.maxChannel} className="glass-strong rounded-lg px-4 py-2 font-semibold text-brand transition-transform">
                    Чат родственников в MAX
                  </a>
                  <a href={site.telegram} className="glass-strong rounded-lg px-4 py-2 font-semibold text-brand transition-transform">
                    Telegram
                  </a>
                  <a href={site.vk} className="glass-strong rounded-lg px-4 py-2 font-semibold text-brand transition-transform">
                    ВКонтакте
                  </a>
                  <a href={site.ok} className="glass-strong rounded-lg px-4 py-2 font-semibold text-brand transition-transform">
                    Одноклассники
                  </a>
                </div>
              </div>

              <div className="glass flex-1 overflow-hidden rounded-lg p-2">
                <iframe
                  title="Пансионат на карте — Нижний Новгород, ул. 3-я Озёрная, 2"
                  src="https://www.openstreetmap.org/export/embed.html?bbox=43.70%2C56.375%2C43.79%2C56.405&layer=mapnik&marker=56.3912%2C43.7432"
                  className="h-64 w-full rounded-lg border-0 md:h-full md:min-h-64"
                  loading="lazy"
                />
              </div>
            </div>
          </Reveal>

          <Reveal delay={120}>
            <LeadForm variant="contact" />
          </Reveal>
        </div>
      </div>
    </section>
  );
}
