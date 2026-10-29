import Link from "next/link";
import Reveal from "./Reveal";

type SectionFooterProps = {
  href: string;
  next: string;
  hint?: string;
};

/**
 * Переход к следующему блоку «по смыслу»: каждый раздел заканчивается
 * ссылкой на следующий шаг знакомства с пансионатом — контент читается
 * как цепочка, а не как длинная простыня.
 */
export default function SectionFooter({ href, next, hint }: SectionFooterProps) {
  return (
    <Reveal className="mt-12">
      <Link
        href={href}
        className="group glass flex items-center justify-between gap-5 rounded-lg px-6 py-5 transition-all duration-300 hover:shadow-[0_16px_40px_rgba(13,36,74,0.14)]"
      >
        <div>
          <div className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-700">
            Дальше по цепочке
          </div>
          <div className="mt-1.5 text-lg font-semibold text-brand transition-colors group-hover:text-brand">
            {next}
          </div>
        </div>

        {hint ? (
          <p className="hidden max-w-xs text-sm leading-6 text-slate-700 lg:block">{hint}</p>
        ) : null}

        <span
          aria-hidden
          className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-brand text-white shadow-md shadow-brand/25 transition-transform duration-300"
        >
          →
        </span>
      </Link>
    </Reveal>
  );
}
