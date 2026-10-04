import Link from "next/link";

type PageHeaderProps = {
  eyebrow: string;
  title: string;
  description?: string;
  /** Быстрые переходы к блокам этой страницы «по смыслу» */
  links?: { href: string; label: string }[];
};

export default function PageHeader({ eyebrow, title, description, links }: PageHeaderProps) {
  return (
    <section className="relative overflow-hidden py-12 md:py-16">
      <div className="absolute -right-32 -top-24 h-80 w-80 animate-float rounded-full bg-blue-300/30 blur-3xl" />
      <div className="absolute -left-24 bottom-0 h-72 w-72 animate-float-slow rounded-full bg-indigo-200/40 blur-3xl" />

      <div className="relative mx-auto max-w-7xl px-6">
        <div className="max-w-2xl animate-fade-up">
          <span className="inline-flex items-center gap-2 rounded-full glass px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.18em] text-blue-700">
            <span className="h-1.5 w-1.5 rounded-full bg-blue-500 shadow-[0_0_8px_rgba(59,130,246,0.9)]" />
            {eyebrow}
          </span>

          <h1 className="mt-4 text-4xl font-semibold leading-[1.1] tracking-tight text-brand md:text-5xl">
            {title}
          </h1>

          {description ? (
            <p className="mt-5 text-lg leading-8 text-slate-600">{description}</p>
          ) : null}
        </div>

        {links?.length ? (
          <div className="mt-8 flex animate-fade-up flex-wrap gap-3 [animation-delay:200ms]">
            {links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="rounded-full glass px-4 py-2 text-sm font-semibold text-slate-700 transition-all duration-200 hover:bg-white/70 hover:text-blue-700"
              >
                {link.label} →
              </Link>
            ))}
          </div>
        ) : null}
      </div>
    </section>
  );
}
