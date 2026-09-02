import { Award, BadgeCheck, GraduationCap, Medal, Sparkles, Trophy } from "lucide-react";
import { achievements, education } from "../data/resume";
import { Section, SectionHeading } from "./ui/Section";
import { Reveal, RevealGroup, RevealItem } from "./ui/Reveal";
import { SpotlightCard } from "./ui/SpotlightCard";

const ICONS = { Trophy, Medal, BadgeCheck, Award };

export function Education() {
  return (
    <Section id="education">
      <SectionHeading
        eyebrow="Education & recognition"
        icon={GraduationCap}
        title={
          <>
            Doctoral research atop{" "}
            <span className="gradient-text">two master&apos;s degrees</span>
          </>
        }
        lead="Formal grounding in data science and computer science — now extending into a PhD — alongside a silver medal and recognition earned on the job."
      />

      <div className="grid gap-6 lg:grid-cols-[1.02fr_0.98fr] lg:gap-8">
        {/* degrees */}
        <div className="space-y-5">
          {education.map((item, i) => (
            <Reveal key={item.degree} delay={i * 0.1} from="right">
              <SpotlightCard className="p-6 sm:p-7 sheen">
                <div className="flex items-start gap-4">
                  <span className="grid h-12 w-12 shrink-0 place-items-center rounded-xl bg-gradient-to-br from-brand to-brand-3 text-white shadow-lg shadow-brand/25">
                    <GraduationCap className="h-5 w-5" strokeWidth={1.9} />
                  </span>

                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <h3 className="text-[1.05rem] font-semibold leading-snug text-ink">
                        {item.degree}
                      </h3>
                      {item.inProgress ? (
                        <span className="inline-flex items-center gap-1.5 rounded-full border border-brand/30 bg-brand/10 px-2.5 py-0.5 text-[0.65rem] font-semibold uppercase tracking-wider text-brand">
                          <span className="relative flex h-1.5 w-1.5">
                            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-brand/70" />
                            <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-brand" />
                          </span>
                          In progress
                        </span>
                      ) : null}
                      {item.honour ? (
                        <span className="inline-flex items-center gap-1 rounded-full border border-amber-400/35 bg-amber-400/12 px-2.5 py-0.5 text-[0.65rem] font-semibold uppercase tracking-wider text-amber-500">
                          <Sparkles className="h-3 w-3" />
                          {item.honour}
                        </span>
                      ) : null}
                    </div>

                    {item.institution ? (
                      <p className="mt-1 text-[0.9rem] font-medium text-brand">{item.institution}</p>
                    ) : null}

                    <p className="mt-1.5 font-mono text-[0.72rem] uppercase tracking-wider text-ink-faint">
                      {[item.period, item.location].filter(Boolean).join(" · ")}
                    </p>

                    <p className="mt-3 text-pretty text-[0.85rem] leading-relaxed text-ink-soft">
                      {item.note}
                    </p>
                  </div>
                </div>
              </SpotlightCard>
            </Reveal>
          ))}
        </div>

        {/* achievements */}
        <RevealGroup className="grid gap-4 sm:grid-cols-2">
          {achievements.map((item) => {
            const Icon = ICONS[item.icon] ?? Award;
            return (
              <RevealItem key={`${item.title}-${item.year}`} from="left">
                <SpotlightCard className="h-full p-5 sheen">
                  <div className="flex items-start justify-between gap-3">
                    <span className="grid h-11 w-11 place-items-center rounded-xl border border-amber-400/28 bg-amber-400/10 text-amber-500 transition-transform duration-500 group-hover:scale-110 group-hover:-rotate-6">
                      <Icon className="h-[1.15rem] w-[1.15rem]" strokeWidth={1.9} />
                    </span>
                    <span className="font-mono text-[0.72rem] font-semibold text-ink-faint">
                      {item.year}
                    </span>
                  </div>
                  <h3 className="mt-4 text-[0.94rem] font-semibold leading-snug text-ink">
                    {item.title}
                  </h3>
                  <p className="mt-1.5 text-[0.78rem] leading-relaxed text-ink-faint">
                    {item.issuer}
                  </p>
                </SpotlightCard>
              </RevealItem>
            );
          })}
        </RevealGroup>
      </div>
    </Section>
  );
}
