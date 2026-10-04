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
        className="group glass flex items-center justify-between gap-5 rounded-2xl px-6 py-5 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_16px_40px_rgba(13,36,74,0.14)]"
      >
        <div>
          <div className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
            Дальше по цепочке
          </div>
          <div className="mt-1.5 text-lg font-semibold text-brand transition-colors group-hover:text-blue-700">
            {next}
          </div>
        </div>

        {hint ? (
          <p className="hidden max-w-xs text-sm leading-6 text-slate-500 lg:block">{hint}</p>
        ) : null}

        <span
          aria-hidden
          className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-blue-600 to-indigo-600 text-white shadow-md shadow-blue-700/25 transition-transform duration-300 group-hover:translate-x-1"
        >
          →
        </span>
      </Link>
    </Reveal>
  );
}
