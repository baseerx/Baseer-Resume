import { motion } from "framer-motion";
import { Brain, Cpu, Layers, LineChart, Quote, Server, User } from "lucide-react";
import { highlights, languages, profile } from "../data/resume";
import { Section, SectionHeading } from "./ui/Section";
import { Reveal, RevealGroup, RevealItem } from "./ui/Reveal";
import { SpotlightCard } from "./ui/SpotlightCard";

const ICONS = { Brain, LineChart, Layers, Server, Cpu };

export function About() {
  return (
    <Section id="about">
      <SectionHeading
        eyebrow="About me"
        icon={User}
        title={
          <>
            Engineering that reaches from <span className="gradient-text">data to delivery</span>
          </>
        }
        lead="A senior full-stack engineer who moved from enterprise portals into applied AI — and kept the discipline of shipping systems that people depend on every day."
      />

      <div className="grid gap-6 lg:grid-cols-[1.05fr_0.95fr] lg:gap-8">
        {/* summary */}
        <Reveal from="right">
          <SpotlightCard className="h-full p-7 sm:p-9" tilt={false}>
            <Quote className="h-8 w-8 text-brand/35" strokeWidth={1.6} />
            <p className="mt-4 text-pretty text-[0.98rem] leading-[1.85] text-ink-soft sm:text-[1.02rem]">
              {profile.summary}
            </p>

            <div className="mt-7 grid gap-3 border-t border-line pt-6 sm:grid-cols-2">
              <Detail label="Based in" value={profile.location} />
              <Detail label="Experience" value={`${profile.experienceYears} years`} />
              <Detail label="Focus" value="AI Engineering · Agentic AI · RAG" />
              <Detail label="Education" value="MS Data Science — Silver Medalist" />
            </div>

            <div className="mt-7 border-t border-line pt-6">
              <p className="font-mono text-[0.68rem] uppercase tracking-[0.22em] text-ink-faint">
                Languages
              </p>
              <div className="mt-4 space-y-3.5">
                {languages.map((lang) => (
                  <div key={lang.name}>
                    <div className="flex items-baseline justify-between text-sm">
                      <span className="font-medium text-ink">{lang.name}</span>
                      <span className="text-xs text-ink-faint">{lang.level}</span>
                    </div>
                    <div className="mt-1.5 h-1.5 overflow-hidden rounded-full bg-line">
                      <motion.div
                        initial={{ width: 0 }}
                        whileInView={{ width: `${lang.value}%` }}
                        viewport={{ once: true, amount: 0.8 }}
                        transition={{ duration: 1.05, ease: [0.22, 1, 0.36, 1] }}
                        style={{ "--fill": `${lang.value}%` }}
                        className="meter-fill h-full rounded-full bg-gradient-to-r from-brand to-brand-2"
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </SpotlightCard>
        </Reveal>

        {/* what I do */}
        <RevealGroup className="grid gap-5 sm:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2">
          {highlights.map((item) => {
            const Icon = ICONS[item.icon] ?? Layers;
            return (
              <RevealItem key={item.title} from="left">
                <SpotlightCard className="h-full p-6 sheen">
                  <span className="inline-grid h-11 w-11 place-items-center rounded-xl border border-brand/25 bg-brand/10 text-brand transition-transform duration-500 group-hover:scale-110 group-hover:rotate-3">
                    <Icon className="h-[1.15rem] w-[1.15rem]" strokeWidth={2} />
                  </span>
                  <h3 className="mt-4 text-base font-semibold text-ink">{item.title}</h3>
                  <p className="mt-2 text-[0.875rem] leading-relaxed text-ink-soft">{item.body}</p>
                </SpotlightCard>
              </RevealItem>
            );
          })}
        </RevealGroup>
      </div>
    </Section>
  );
}

function Detail({ label, value }) {
  return (
    <div>
      <p className="font-mono text-[0.66rem] uppercase tracking-[0.2em] text-ink-faint">{label}</p>
      <p className="mt-1 text-[0.9rem] font-medium text-ink">{value}</p>
    </div>
  );
}
