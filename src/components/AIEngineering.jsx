import { motion, useReducedMotion } from "framer-motion";
import {
  ArrowUpRight,
  Bot,
  BrainCircuit,
  Database,
  Plug,
  Rocket,
  ScanEye,
  Sparkles,
} from "lucide-react";
import { aiEngineering } from "../data/resume";
import { Section, SectionHeading } from "./ui/Section";
import { Reveal, RevealGroup, RevealItem } from "./ui/Reveal";
import { SpotlightCard } from "./ui/SpotlightCard";

const ICONS = { Sparkles, Bot, Database, Plug, ScanEye, Rocket };

/**
 * AI Engineering — the LLM / agentic / retrieval capability map: a pipeline
 * strip showing how the pieces connect, the six pillars with their stacks,
 * and the shipped systems that back each claim.
 */
export function AIEngineering() {
  const { lead, pipeline, pillars, proof } = aiEngineering;

  return (
    <Section id="ai">
      <SectionHeading
        eyebrow="AI Engineering"
        icon={BrainCircuit}
        title={
          <>
            From full-stack systems to <span className="gradient-text">production AI</span>
          </>
        }
        lead={lead}
      />

      <Pipeline steps={pipeline} />

      {/* pillars */}
      <RevealGroup className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {pillars.map((pillar, i) => {
          const Icon = ICONS[pillar.icon] ?? Sparkles;
          return (
            <RevealItem key={pillar.id} className="h-full">
              <SpotlightCard className="h-full p-6 sheen">
                <div className="flex items-start justify-between gap-3">
                  <span className="inline-grid h-11 w-11 place-items-center rounded-xl bg-gradient-to-br from-brand to-brand-3 text-white shadow-lg shadow-brand/25 transition-transform duration-500 group-hover:rotate-3 group-hover:scale-110">
                    <Icon className="h-[1.15rem] w-[1.15rem]" strokeWidth={2} />
                  </span>
                  <span aria-hidden className="font-mono text-[0.68rem] text-ink-faint">
                    0{i + 1}
                  </span>
                </div>
                <h3 className="mt-4 text-base font-semibold text-ink">{pillar.title}</h3>
                <p className="mt-2 text-[0.865rem] leading-relaxed text-ink-soft">{pillar.body}</p>
                <ul className="mt-4 flex flex-wrap gap-1.5" aria-label={`${pillar.title} stack`}>
                  {pillar.tags.map((tag) => (
                    <li
                      key={tag}
                      className="rounded-md border border-brand/20 bg-brand/8 px-2 py-0.5 font-mono text-[0.65rem] text-ink-soft"
                    >
                      {tag}
                    </li>
                  ))}
                </ul>
              </SpotlightCard>
            </RevealItem>
          );
        })}
      </RevealGroup>

      {/* proof */}
      <Reveal className="mt-12">
        <p className="text-center font-mono text-[0.68rem] uppercase tracking-[0.22em] text-ink-faint">
          Where this runs today
        </p>
      </Reveal>
      <RevealGroup className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {proof.map((item) => (
          <RevealItem key={item.name} className="h-full">
            <a
              href={item.href}
              className="card group flex h-full flex-col p-5 transition-all duration-300 hover:-translate-y-1 hover:border-brand/40"
            >
              <div className="flex items-center justify-between gap-2">
                <span className="text-[0.95rem] font-semibold text-ink transition-colors group-hover:text-brand">
                  {item.name}
                </span>
                <ArrowUpRight className="h-4 w-4 shrink-0 text-ink-faint transition-all duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-brand" />
              </div>
              <span className="mt-1 font-mono text-[0.66rem] uppercase tracking-wider text-brand-2">
                {item.where}
              </span>
              <p className="mt-2.5 text-[0.82rem] leading-relaxed text-ink-soft">{item.body}</p>
            </a>
          </RevealItem>
        ))}
      </RevealGroup>
    </Section>
  );
}

/** The retrieval → reasoning → action loop as a connected strip of stages. */
function Pipeline({ steps }) {
  const reduced = useReducedMotion();

  return (
    <Reveal>
      <div className="glass relative overflow-hidden rounded-2xl p-4 sm:p-5">
        {/* travelling pulse along the strip */}
        {!reduced ? (
          <motion.span
            aria-hidden
            className="no-print pointer-events-none absolute inset-y-0 w-1/4 bg-gradient-to-r from-transparent via-brand/12 to-transparent"
            animate={{ left: ["-25%", "100%"] }}
            transition={{ duration: 5.5, repeat: Infinity, ease: "linear" }}
          />
        ) : null}

        <p className="relative mb-4 flex items-center gap-2 font-mono text-[0.66rem] uppercase tracking-[0.22em] text-ink-faint">
          <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
          Agentic RAG pipeline
        </p>

        <ol className="relative grid grid-cols-2 gap-2 sm:grid-cols-4 lg:grid-cols-8">
          {steps.map((s, i) => (
            <li
              key={s.step}
              className="relative min-w-0 rounded-xl border border-line-strong bg-surface px-3 py-2.5"
            >
              <span className="font-mono text-[0.6rem] text-brand">{String(i + 1).padStart(2, "0")}</span>
              <p className="text-[0.84rem] font-semibold text-ink">{s.step}</p>
              <p className="mt-0.5 text-[0.68rem] leading-snug text-ink-faint">{s.detail}</p>
            </li>
          ))}
        </ol>
      </div>
    </Reveal>
  );
}
