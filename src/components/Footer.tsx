import { navLinks, site } from "@/lib/site";

export default function Footer() {
  return (
    <footer id="contacts" className="bg-brand-dark text-white">
      <div className="mx-auto max-w-7xl px-6 py-14">
        <div className="grid gap-10 md:grid-cols-3">
          <div>
            <div className="text-xl font-bold">{site.name}</div>
            <p className="mt-3 max-w-sm text-sm leading-6 text-slate-400">
              Забота и поддержка для пожилых людей и людей с ограниченной мобильностью.
            </p>
          </div>

          <div>
            <div className="font-semibold">Контакты</div>
            <div className="mt-4 space-y-2 text-sm text-slate-400">
              <a
                href={site.phoneHref}
                className="block transition-colors duration-200 hover:text-white"
              >
                {site.phone}
              </a>
              <a
                href={`mailto:${site.email}`}
                className="block transition-colors duration-200 hover:text-white"
              >
                {site.email}
              </a>
            </div>
          </div>

          <div>
            <div className="font-semibold">Навигация</div>
            <div className="mt-4 space-y-2 text-sm">
              {navLinks.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  className="block w-fit text-slate-400 transition-all duration-200 hover:translate-x-1 hover:text-white"
                >
                  {link.label}
                </a>
              ))}
              <a
                href="/cabinet"
                className="block w-fit text-slate-400 transition-all duration-200 hover:translate-x-1 hover:text-white"
              >
                Личный кабинет
              </a>
            </div>
          </div>
        </div>

        <div className="mt-12 border-t border-white/10 pt-6 text-sm text-slate-500">
          © {new Date().getFullYear()} {site.name}. Все права защищены.
        </div>
      </div>
    </footer>
  );
}
