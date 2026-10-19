import { site } from "@/lib/site";
import Reveal from "./Reveal";
import SectionHeading from "./SectionHeading";
import LeadForm from "./LeadForm";

export default function Contacts() {
  return (
    <section id="contacts" className="relative py-14 md:py-20">
      <div className="mx-auto max-w-7xl px-6">
        <SectionHeading
          eyebrow="Контакты"
          title="Мы на связи каждый день"
          description="Позвоните, напишите или оставьте заявку — ответим сразу."
        />

        <div className="mt-10 grid gap-5 lg:grid-cols-2">
          <Reveal>
            <div className="flex h-full flex-col gap-5">
              <div className="glass rounded-3xl p-7">
                <div className="space-y-3 text-sm text-slate-600">
                  <p>
                    <span className="font-semibold text-brand">Адрес:</span> {site.address}
                  </p>
                  <p>
                    <span className="font-semibold text-brand">Рабочие часы:</span> {site.hours}
                  </p>
                  <p>
                    <span className="font-semibold text-brand">Email:</span>{" "}
                    <a href={`mailto:${site.email}`} className="text-sky-700 hover:underline">
                      {site.email}
                    </a>
                  </p>
                </div>
                <a
                  href={site.phoneHref}
                  className="btn-glass-primary mt-6 inline-block rounded-full px-7 py-3 text-sm font-semibold"
                >
                  {site.phone}
                </a>
                <div className="mt-5 flex flex-wrap gap-2 text-xs">
                  <a href={site.maxChannel} className="glass-strong rounded-full px-4 py-2 font-semibold text-brand transition-transform hover:-translate-y-0.5">
                    Чат родственников в MAX
                  </a>
                  <a href={site.telegram} className="glass-strong rounded-full px-4 py-2 font-semibold text-brand transition-transform hover:-translate-y-0.5">
                    Telegram
                  </a>
                  <a href={site.vk} className="glass-strong rounded-full px-4 py-2 font-semibold text-brand transition-transform hover:-translate-y-0.5">
                    ВКонтакте
                  </a>
                  <a href={site.ok} className="glass-strong rounded-full px-4 py-2 font-semibold text-brand transition-transform hover:-translate-y-0.5">
                    Одноклассники
                  </a>
                </div>
              </div>

              <div className="glass flex-1 overflow-hidden rounded-3xl p-2">
                <iframe
                  title="Регион покрытия на карте"
                  src="https://www.openstreetmap.org/export/embed.html?bbox=37.35%2C55.58%2C37.85%2C55.92&layer=mapnik"
                  className="h-64 w-full rounded-[1.3rem] border-0 md:h-full md:min-h-64"
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
