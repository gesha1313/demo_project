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
            <div className="mt-4 space-y-2 text-sm">
              <a href={site.maxChannel} className="block w-fit text-slate-300 transition-all duration-200 hover:translate-x-1 hover:text-white">
                MAX — чат родственников
              </a>
              <a href={site.telegram} className="block w-fit text-slate-300 transition-all duration-200 hover:translate-x-1 hover:text-white">
                Telegram
              </a>
              <a href={site.vk} className="block w-fit text-slate-300 transition-all duration-200 hover:translate-x-1 hover:text-white">
                ВКонтакте
              </a>
              <a href={site.ok} className="block w-fit text-slate-300 transition-all duration-200 hover:translate-x-1 hover:text-white">
                Одноклассники
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
