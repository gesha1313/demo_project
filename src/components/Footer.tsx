import { navLinks, quickLinks, site } from "@/lib/site";

export default function Footer() {
  return (
    <footer className="bg-brand-dark text-white">
      <div className="mx-auto max-w-7xl px-6 py-14">
        <div className="grid gap-10 md:grid-cols-4">
          <div>
            <div className="text-xl font-bold">{site.name}</div>
            <p className="mt-3 max-w-sm text-sm leading-6 text-slate-300">
              Забота и поддержка для пожилых людей и людей с ограниченной мобильностью.
            </p>
            <div className="mt-4 flex flex-wrap gap-2 text-xs">
              {site.payments.map((p) => (
                <span key={p} className="rounded-md border border-white/15 px-2.5 py-1 text-slate-300">
                  {p}
                </span>
              ))}
            </div>
          </div>

          <div>
            <div className="font-semibold">Контакты</div>
            <div className="mt-4 space-y-2 text-sm text-slate-300">
              <a href={site.phoneHref} className="block transition-colors duration-200 hover:text-white">
                {site.phone}
              </a>
              <a href={`mailto:${site.email}`} className="block transition-colors duration-200 hover:text-white">
                {site.email}
              </a>
              <p>{site.address}</p>
              <p>{site.hours}</p>
            </div>
          </div>

          <div>
            <div className="font-semibold">Быстрые ссылки</div>
            <div className="mt-4 space-y-2 text-sm">
              {quickLinks.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  className="block w-fit text-slate-300 transition-all duration-200 hover:translate-x-1 hover:text-white"
                >
                  {link.label}
                </a>
              ))}
              <a
                href="/blog"
                className="block w-fit text-slate-300 transition-all duration-200 hover:translate-x-1 hover:text-white"
              >
                Блог
              </a>
            </div>
          </div>

          <div>
            <div className="font-semibold">Социальные сети</div>
            <div className="mt-4 flex gap-2">
              <a
                href={site.maxChannel}
                aria-label="MAX — чат родственников"
                title="MAX — чат родственников"
                className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/10 text-xs font-bold text-white transition-colors hover:bg-white/20"
              >
                MAX
              </a>
              <a
                href={site.telegram}
                aria-label="Telegram"
                className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/10 text-white transition-colors hover:bg-white/20"
              >
                <svg viewBox="0 0 24 24" fill="currentColor" className="h-5 w-5" aria-hidden="true">
                  <path d="M21.9 4.6c.2-1.1-.8-2-1.9-1.6L2.7 9.7c-1.2.5-1.1 2.2.1 2.6l4.4 1.4 1.7 5.3c.3 1 1.6 1.3 2.3.5l2.4-2.5 4.3 3.2c.8.6 2 .2 2.2-.9l3.8-14.7ZM8.6 13.2l8.9-5.6-6.9 6.5-.2 3.3-1.8-4.2Z" />
                </svg>
              </a>
              <a
                href={site.vk}
                aria-label="ВКонтакте"
                className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/10 text-white transition-colors hover:bg-white/20"
              >
                <svg viewBox="0 0 24 24" fill="currentColor" className="h-5 w-5" aria-hidden="true">
                  <path d="M12.8 17.3c-5.4 0-8.7-3.8-8.8-10h2.8c.1 4.6 2.2 6.5 3.7 6.9V7.3h2.7v4c1.5-.2 3-1.8 3.6-4h2.6c-.4 2.7-2 4.3-3.1 5 1.1.5 2.9 2 3.6 4.7h-2.9c-.5-1.9-1.9-3.4-3.8-3.6v3.6h-.4Z" />
                </svg>
              </a>
              <a
                href={site.ok}
                aria-label="Одноклассники"
                className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/10 text-white transition-colors hover:bg-white/20"
              >
                <svg viewBox="0 0 24 24" fill="currentColor" className="h-5 w-5" aria-hidden="true">
                  <path d="M12 2a5 5 0 1 0 0 10 5 5 0 0 0 0-10Zm0 7.5a2.5 2.5 0 1 1 0-5 2.5 2.5 0 0 1 0 5Zm7.2 2.4a1.4 1.4 0 0 0-2-2 8.6 8.6 0 0 1-10.4 0 1.4 1.4 0 0 0-2 2 11.3 11.3 0 0 0 5.8 2.7l-3.3 3.3a1.4 1.4 0 0 0 2 2L12 18.2l2.7 2.7a1.4 1.4 0 0 0 2-2l-3.3-3.3a11.3 11.3 0 0 0 5.8-2.7Z" />
                </svg>
              </a>
            </div>
            <div className="mt-4 space-y-2">
              {navLinks.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  className="block w-fit text-xs text-slate-300 transition-all duration-200 hover:translate-x-1 hover:text-white"
                >
                  {link.label}
                </a>
              ))}
              <a href="/cabinet" className="block w-fit text-xs text-slate-300 transition-all duration-200 hover:translate-x-1 hover:text-white">
                Личный кабинет
              </a>
            </div>
          </div>
        </div>

        <div className="mt-12 flex flex-wrap items-center justify-between gap-4 border-t border-white/10 pt-6 text-sm text-slate-300">
          <div>
            © {new Date().getFullYear()} {site.name}. Все права защищены.
            <div className="mt-1 text-xs">
              ИНН {site.inn} · ОГРН {site.ogrn} · Лицензия {site.license}
            </div>
          </div>
          <a
            href="#top"
            className="glass-dark rounded-full px-5 py-2.5 text-sm font-semibold text-white transition-transform duration-200 hover:-translate-y-0.5"
          >
            ↑ Наверх
          </a>
        </div>
      </div>
    </footer>
  );
}
