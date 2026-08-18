import { Reveal } from "./Reveal";

/** Section wrapper: consistent rhythm, anchor id and scroll offset. */
export function Section({ id, children, className = "", tight = false }) {
  return (
    <section
      id={id}
      className={`relative scroll-mt-24 ${tight ? "py-12 sm:py-16" : "py-18 sm:py-24"} ${className}`}
    >
      <div className="shell">{children}</div>
    </section>
  );
}

/** Eyebrow + title + optional lead paragraph, centred or left aligned. */
export function SectionHeading({ eyebrow, title, lead, align = "center", icon: Icon }) {
  const centered = align === "center";

  return (
    <div className={`${centered ? "mx-auto max-w-2xl text-center" : "max-w-2xl"} mb-12 sm:mb-16`}>
      {eyebrow ? (
        <Reveal from="down" duration={0.5}>
          <span className="chip mb-4">
            {Icon ? <Icon className="h-3.5 w-3.5" strokeWidth={2.2} /> : null}
            {eyebrow}
          </span>
        </Reveal>
      ) : null}

      <Reveal delay={0.06}>
        <h2 className="text-balance text-3xl font-bold leading-tight sm:text-4xl lg:text-[2.75rem]">
          {title}
        </h2>
      </Reveal>

      <Reveal delay={0.12} className={centered ? "flex justify-center" : ""}>
        <div className="rule mt-5 w-28" />
      </Reveal>

      {lead ? (
        <Reveal delay={0.16}>
          <p className="mt-5 text-pretty text-[0.975rem] leading-relaxed text-ink-soft sm:text-base">
            {lead}
          </p>
        </Reveal>
      ) : null}
    </div>
  );
}
