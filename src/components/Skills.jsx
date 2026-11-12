import { useRef } from "react";
import { motion, useInView, useReducedMotion } from "framer-motion";
import { Brain, Cpu, Database, Palette, Wrench } from "lucide-react";
import { skillGroups, tools } from "../data/resume";
import { Section, SectionHeading } from "./ui/Section";
import { Reveal } from "./ui/Reveal";
import { SpotlightCard } from "./ui/SpotlightCard";

const ICONS = { Brain, Palette, Cpu, Database };

const ACCENTS = {
  brand: "from-brand to-brand-2",
  "brand-2": "from-brand-2 to-brand",
  "brand-3": "from-brand-3 to-brand",
};

export function Skills() {
  return (
    <Section id="skills">
      <SectionHeading
        eyebrow="Technical stack"
        icon={Wrench}
        title={
          <>
            The toolkit behind the <span className="gradient-text">delivery</span>
          </>
        }
        lead="AI and LLM engineering on top of depth across the full stack and the data layer underneath it."
      />

      <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
        {skillGroups.map((group, gi) => {
          const Icon = ICONS[group.icon] ?? Cpu;
          return (
            <Reveal key={group.title} delay={gi * 0.1} className="h-full">
              <SpotlightCard className="h-full p-6 sm:p-7" tilt={false}>
                <div className="flex items-center gap-3">
                  <span
                    className={`grid h-11 w-11 place-items-center rounded-xl bg-gradient-to-br ${
                      ACCENTS[group.accent] ?? ACCENTS.brand
                    } text-white shadow-lg shadow-brand/22`}
                  >
                    <Icon className="h-[1.15rem] w-[1.15rem]" strokeWidth={2} />
                  </span>
                  <div>
                    <h3 className="text-base font-semibold text-ink">{group.title}</h3>
                    <p className="font-mono text-[0.68rem] text-ink-faint">
                      {group.skills.length} competencies
                    </p>
                  </div>
                </div>

                <div className="mt-6 space-y-4">
                  {group.skills.map((skill, i) => (
                    <SkillBar
                      key={skill.name}
                      skill={skill}
                      delay={i * 0.07}
                      accent={ACCENTS[group.accent] ?? ACCENTS.brand}
                    />
                  ))}
                </div>
              </SpotlightCard>
            </Reveal>
          );
        })}
      </div>

      {/* tools marquee */}
      <Reveal delay={0.1} className="mt-12">
        <div className="glass marquee relative overflow-hidden rounded-2xl py-5">
          <div
            aria-hidden
            className="pointer-events-none absolute inset-y-0 left-0 z-10 w-24 bg-gradient-to-r from-bg to-transparent"
          />
          <div
            aria-hidden
            className="pointer-events-none absolute inset-y-0 right-0 z-10 w-24 bg-gradient-to-l from-bg to-transparent"
          />
          <div className="marquee-track flex w-max gap-3">
            {[...tools, ...tools].map((tool, i) => (
              <span
                key={`${tool}-${i}`}
                className="flex shrink-0 items-center gap-2 rounded-xl border border-line-strong bg-surface px-4 py-2 text-[0.82rem] font-medium text-ink-soft"
              >
                <span className="h-1.5 w-1.5 rounded-full bg-gradient-to-br from-brand to-brand-2" />
                {tool}
              </span>
            ))}
          </div>
        </div>
        <p className="mt-3 text-center font-mono text-[0.68rem] uppercase tracking-[0.22em] text-ink-faint">
          Daily drivers &amp; environments
        </p>
      </Reveal>
    </Section>
  );
}

function SkillBar({ skill, delay, accent }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, amount: 0.5 });
  const reduced = useReducedMotion();

  return (
    <div ref={ref}>
      <div className="mb-1.5 flex items-baseline justify-between">
        <span className="text-[0.85rem] font-medium text-ink">{skill.name}</span>
        <span className="font-mono text-[0.68rem] text-ink-faint">{skill.level}%</span>
      </div>
      <div className="h-2 overflow-hidden rounded-full bg-line">
        <motion.div
          initial={{ width: 0 }}
          animate={inView ? { width: `${skill.level}%` } : { width: 0 }}
          transition={{
            duration: reduced ? 0.2 : 1.15,
            delay: reduced ? 0 : delay,
            ease: [0.22, 1, 0.36, 1],
          }}
          style={{ "--fill": `${skill.level}%` }}
          className={`meter-fill relative h-full rounded-full bg-gradient-to-r ${accent}`}
        >
          <span className="absolute inset-y-0 right-0 w-6 bg-white/25 blur-[3px]" />
        </motion.div>
      </div>
    </div>
  );
}
