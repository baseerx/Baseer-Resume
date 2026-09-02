import {
  Brain,
  Building2,
  CircleCheckBig,
  FileCheck2,
  FileText,
  Gauge,
  Landmark,
  Newspaper,
  Quote,
  Radar,
  SearchCheck,
  Sparkles,
  Tags,
  Users,
} from "lucide-react";
import { flagship } from "../data/resume";
import { Section, SectionHeading } from "./ui/Section";
import { Reveal, RevealGroup, RevealItem } from "./ui/Reveal";
import { SpotlightCard } from "./ui/SpotlightCard";

const ICONS = {
  Newspaper,
  Tags,
  Gauge,
  Users,
  Building2,
  SearchCheck,
  FileText,
  Brain,
  Radar,
};

/**
 * Dedicated spotlight for NICE — the flagship agentic AI platform — and for the
 * ISMO Technical Confirmation & Support Letter that independently backs it.
 */
export function Flagship() {
  const { endorsement } = flagship;

  return (
    <Section id="nice">
      <SectionHeading
        eyebrow="Flagship · Agentic AI"
        icon={Sparkles}
        title={
          <>
            NICE — <span className="gradient-text">News Intelligence Collection Exchange</span>
          </>
        }
        lead={flagship.positioning}
      />

      <div className="grid gap-6 lg:grid-cols-[1.05fr_0.95fr] lg:gap-7">
        {/* the platform */}
        <Reveal from="right">
          <SpotlightCard className="h-full p-7 sm:p-9" tilt={false}>
            <div className="flex flex-wrap items-center gap-2">
              <span className="chip">
                <Landmark className="h-3.5 w-3.5" strokeWidth={2.2} />
                {flagship.org}
              </span>
              <span className="chip">{flagship.status}</span>
            </div>

            <p className="mt-6 text-pretty text-[0.95rem] leading-[1.85] text-ink-soft sm:text-[1rem]">
              {flagship.summary}
            </p>

            <div className="mt-7 grid grid-cols-2 gap-x-5 gap-y-5 border-t border-line pt-6 sm:grid-cols-4">
              {flagship.signals.map((signal) => (
                <div className="min-w-0" key={signal.label}>
                  <p className="whitespace-nowrap font-mono text-[1rem] font-semibold leading-none text-ink">
                    {signal.value}
                  </p>
                  <p className="mt-2 text-[0.7rem] leading-snug text-ink-faint">{signal.label}</p>
                </div>
              ))}
            </div>
            <p className="mt-4 text-[0.7rem] italic leading-relaxed text-ink-faint/80">
              {flagship.signalsNote}
            </p>

            <div className="mt-7 border-t border-line pt-6">
              <p className="font-mono text-[0.66rem] uppercase tracking-[0.2em] text-ink-faint">
                My role — {flagship.role}
              </p>
              <div className="mt-4 flex flex-wrap gap-1.5">
                {flagship.tech.map((tech) => (
                  <span
                    key={tech}
                    className="rounded-md bg-line/60 px-2 py-0.5 font-mono text-[0.65rem] text-ink-faint"
                  >
                    {tech}
                  </span>
                ))}
              </div>
            </div>
          </SpotlightCard>
        </Reveal>

        {/* the letter */}
        <Reveal from="left" delay={0.08}>
          <SpotlightCard className="h-full overflow-hidden" tilt={false}>
            <div
              aria-hidden
              className="h-1 w-full bg-gradient-to-r from-brand via-brand-2 to-brand-3"
            />

            <div className="p-7 sm:p-8">
              <div className="flex items-start justify-between gap-4">
                <span className="inline-grid h-11 w-11 shrink-0 place-items-center rounded-xl border border-brand/25 bg-brand/10 text-brand">
                  <FileCheck2 className="h-[1.15rem] w-[1.15rem]" strokeWidth={2} />
                </span>
                <span className="chip shrink-0">
                  <CircleCheckBig className="h-3.5 w-3.5" strokeWidth={2.2} />
                  Verified endorsement
                </span>
              </div>

              <h3 className="mt-5 text-[1.15rem] font-semibold leading-snug text-ink">
                {endorsement.title}
              </h3>
              <p className="mt-2 text-[0.85rem] leading-relaxed text-ink-soft">
                {endorsement.subject}
              </p>

              {/* The reference number is a long unbreakable mono string, so it
                  takes a full row of its own rather than colliding with the
                  date beside it. */}
              <dl className="mt-6 grid gap-x-5 gap-y-4 border-y border-line py-5 sm:grid-cols-2">
                <Meta
                  label="Reference"
                  value={endorsement.reference}
                  mono
                  className="sm:col-span-2"
                />
                <Meta label="Dated" value={endorsement.date} />
                <Meta label="Issued by" value={endorsement.issuer} />
                <Meta label="Organisation" value={endorsement.organisation} className="sm:col-span-2" />
              </dl>

              <p className="mt-3 text-[0.7rem] leading-relaxed text-ink-faint">
                {endorsement.issuerNote}
              </p>

              <ul className="mt-6 space-y-4">
                {endorsement.quotes.map((quote) => (
                  <li key={quote} className="relative pl-7">
                    <Quote
                      aria-hidden
                      className="absolute left-0 top-0.5 h-4 w-4 text-brand/40"
                      strokeWidth={1.8}
                    />
                    <p className="text-pretty text-[0.85rem] italic leading-relaxed text-ink-soft">
                      &ldquo;{quote}&rdquo;
                    </p>
                  </li>
                ))}
              </ul>

              <div className="mt-7 border-t border-line pt-5">
                <p className="font-mono text-[0.66rem] uppercase tracking-[0.2em] text-ink-faint">
                  Contribution confirmed
                </p>
                <ul className="mt-3.5 grid gap-2 sm:grid-cols-2">
                  {endorsement.contributions.map((item) => (
                    <li key={item} className="flex items-start gap-2 text-[0.8rem] text-ink-soft">
                      <CircleCheckBig
                        aria-hidden
                        className="mt-0.5 h-3.5 w-3.5 shrink-0 text-brand"
                        strokeWidth={2.2}
                      />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </SpotlightCard>
        </Reveal>
      </div>

      {/* core functions */}
      <div className="mt-14 sm:mt-18">
        <Reveal className="mb-8 text-center">
          <h3 className="text-xl font-semibold text-ink sm:text-2xl">
            Core functions of the platform
          </h3>
          <p className="mx-auto mt-3 max-w-2xl text-pretty text-[0.9rem] leading-relaxed text-ink-soft">
            {flagship.coreFunctions.length} capabilities that carry raw, unstructured coverage all
            the way through to a verified brief a decision-maker can act on.
          </p>
        </Reveal>

        <RevealGroup className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {flagship.coreFunctions.map((fn) => {
            const Icon = ICONS[fn.icon] ?? Sparkles;
            return (
              <RevealItem key={fn.title}>
                <SpotlightCard className="h-full p-6 sheen">
                  <span className="inline-grid h-11 w-11 place-items-center rounded-xl border border-brand/25 bg-brand/10 text-brand transition-transform duration-500 group-hover:scale-110 group-hover:rotate-3">
                    <Icon className="h-[1.15rem] w-[1.15rem]" strokeWidth={2} />
                  </span>
                  <h4 className="mt-4 text-base font-semibold text-ink">{fn.title}</h4>
                  <p className="mt-2 text-[0.85rem] leading-relaxed text-ink-soft">{fn.body}</p>
                </SpotlightCard>
              </RevealItem>
            );
          })}
        </RevealGroup>
      </div>
    </Section>
  );
}

function Meta({ label, value, mono = false, className = "" }) {
  // `min-w-0` lets the grid cell shrink below its content width, and
  // `[overflow-wrap:anywhere]` lets a long slash-separated reference wrap
  // instead of spilling into the neighbouring cell.
  const valueClass = mono
    ? "mt-1 font-mono text-[0.76rem] font-medium leading-snug text-ink [overflow-wrap:anywhere]"
    : "mt-1 text-[0.82rem] font-medium leading-snug text-ink [overflow-wrap:anywhere]";

  return (
    <div className={`min-w-0 ${className}`}>
      <dt className="font-mono text-[0.62rem] uppercase tracking-[0.2em] text-ink-faint">
        {label}
      </dt>
      <dd className={valueClass}>{value}</dd>
    </div>
  );
}
