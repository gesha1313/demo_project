import Reveal from "./Reveal";

type SectionHeadingProps = {
  eyebrow: string;
  title: string;
  description?: string;
  align?: "left" | "center";
};

export default function SectionHeading({
  eyebrow,
  title,
  description,
  align = "left",
}: SectionHeadingProps) {
  return (
    <Reveal className={align === "center" ? "mx-auto max-w-2xl text-center" : "max-w-2xl"}>
      <span className="inline-block rounded-full glass px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.18em] text-brand">
        {eyebrow}
      </span>
      <h2 className="mt-4 text-2xl font-semibold tracking-tight text-brand md:text-3xl">
        {title}
      </h2>
      {/* Тёплый акцент: короткая янтарная черта под заголовком */}
      <span aria-hidden className="mt-3 block h-[3px] w-10 rounded-full bg-amber-500/70" />
      {description ? (
        <p className="mt-3 text-base leading-7 text-slate-600">{description}</p>
      ) : null}
    </Reveal>
  );
}
