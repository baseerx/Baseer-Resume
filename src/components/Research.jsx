import { FlaskConical, GraduationCap, LineChart, Microscope, ScanEye } from "lucide-react";
import { research } from "../data/resume";
import { Section, SectionHeading } from "./ui/Section";
import { RevealGroup, RevealItem } from "./ui/Reveal";
import { SpotlightCard } from "./ui/SpotlightCard";

const ICONS = { GraduationCap, ScanEye, LineChart };

/** Research threads: doctoral work and applied deep-learning projects. */
export function Research() {
  return (
    <Section id="research">
      <SectionHeading
        eyebrow="Research"
        icon={Microscope}
        title={
          <>
            Research that feeds <span className="gradient-text">the engineering</span>
          </>
        }
        lead="Doctoral study, deep learning for medical imaging and forecasting with foundation models — the research side of the same AI work."
      />

      <RevealGroup className="grid gap-5 md:grid-cols-3">
        {research.map((item) => {
          const Icon = ICONS[item.icon] ?? FlaskConical;
          return (
            <RevealItem key={item.title} className="h-full">
              <SpotlightCard className="h-full overflow-hidden" tilt={false}>
                <div aria-hidden className="h-1 w-full bg-gradient-to-r from-brand via-brand-2 to-brand-3" />
                <div className="flex h-full flex-col p-6">
                  <div className="flex items-start justify-between gap-3">
                    <span className="inline-grid h-11 w-11 shrink-0 place-items-center rounded-xl border border-brand/25 bg-brand/10 text-brand">
                      <Icon className="h-[1.15rem] w-[1.15rem]" strokeWidth={2} />
                    </span>
                    <span className="chip shrink-0">{item.status}</span>
                  </div>
                  <h3 className="mt-4 text-[1.02rem] font-semibold leading-snug text-ink">{item.title}</h3>
                  <p className="mt-1 font-mono text-[0.68rem] uppercase tracking-wider text-ink-faint">
                    {item.org}
                  </p>
                  <p className="mt-3 text-[0.865rem] leading-relaxed text-ink-soft">{item.body}</p>
                  <div className="mt-4 flex flex-wrap gap-1.5">
                    {item.tags.map((tag) => (
                      <span
                        key={tag}
                        className="rounded-md bg-line/60 px-2 py-0.5 font-mono text-[0.65rem] text-ink-faint"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </SpotlightCard>
            </RevealItem>
          );
        })}
      </RevealGroup>
    </Section>
  );
}
