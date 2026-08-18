import { useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowUpRight, Lock, Rocket, Star } from "lucide-react";
import { projects } from "../data/resume";
import { Section, SectionHeading } from "./ui/Section";
import { Reveal } from "./ui/Reveal";
import { SpotlightCard } from "./ui/SpotlightCard";

export function Projects() {
  const categories = useMemo(
    () => ["All", ...Array.from(new Set(projects.map((p) => p.category)))],
    [],
  );
  const [category, setCategory] = useState("All");

  const visible =
    category === "All" ? projects : projects.filter((p) => p.category === category);

  return (
    <Section id="projects">
      <SectionHeading
        eyebrow="Projects delivered"
        icon={Rocket}
        title={
          <>
            Fourteen products, <span className="gradient-text">live in the wild</span>
          </>
        }
        lead="National-scale utility platforms, AI-first products and a portfolio of high-performance marketing sites."
      />

      <Reveal className="mb-10 flex justify-center">
        <div className="glass inline-flex flex-wrap justify-center gap-1 rounded-2xl p-1.5">
          {categories.map((option) => {
            const isActive = category === option;
            return (
              <button
                key={option}
                type="button"
                onClick={() => setCategory(option)}
                className={`relative rounded-xl px-4 py-2 text-[0.8rem] font-medium transition-colors duration-300 ${
                  isActive ? "text-white" : "text-ink-faint hover:text-ink"
                }`}
              >
                {isActive ? (
                  <motion.span
                    layoutId="proj-filter"
                    className="absolute inset-0 rounded-xl bg-gradient-to-r from-brand to-brand-3 shadow-lg shadow-brand/25"
                    transition={{ type: "spring", stiffness: 380, damping: 32 }}
                  />
                ) : null}
                <span className="relative">{option}</span>
              </button>
            );
          })}
        </div>
      </Reveal>

      <motion.ul layout className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        <AnimatePresence mode="popLayout">
          {visible.map((project, index) => (
            <motion.li
              key={project.name}
              layout
              initial={{ opacity: 0, y: 24, scale: 0.97 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -12, scale: 0.96 }}
              transition={{
                duration: 0.42,
                delay: Math.min(index * 0.045, 0.35),
                ease: [0.22, 1, 0.36, 1],
                layout: { duration: 0.38 },
              }}
            >
              <ProjectCard project={project} />
            </motion.li>
          ))}
        </AnimatePresence>
      </motion.ul>
    </Section>
  );
}

function ProjectCard({ project }) {
  const external = Boolean(project.url);
  const host = external ? project.url.replace(/^https?:\/\/(www\.)?/, "").replace(/\/$/, "") : null;

  const Wrapper = external ? "a" : "div";
  const wrapperProps = external
    ? { href: project.url, target: "_blank", rel: "noreferrer noopener" }
    : {};

  return (
    <SpotlightCard className="h-full">
      <Wrapper {...wrapperProps} className="flex h-full flex-col p-6">
        <div className="flex items-start justify-between gap-3">
          <span className="chip">{project.category}</span>

          <span
            className={`grid h-9 w-9 shrink-0 place-items-center rounded-lg border transition-all duration-300 ${
              external
                ? "border-line-strong text-ink-faint group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:border-brand/50 group-hover:bg-brand/10 group-hover:text-brand"
                : "border-line text-ink-faint/60"
            }`}
            title={external ? "Open live site" : "Internal / enterprise system"}
          >
            {external ? <ArrowUpRight className="h-4 w-4" /> : <Lock className="h-3.5 w-3.5" />}
          </span>
        </div>

        <h3 className="mt-4 text-[1.02rem] font-semibold leading-snug text-ink transition-colors duration-300 group-hover:text-brand">
          {project.name}
        </h3>

        {project.featured ? (
          <span className="mt-1.5 inline-flex w-fit items-center gap-1 text-[0.68rem] font-semibold uppercase tracking-wider text-amber-500">
            <Star className="h-3 w-3 fill-current" />
            Featured
          </span>
        ) : null}

        <p className="mt-2.5 flex-1 text-pretty text-[0.85rem] leading-relaxed text-ink-soft">
          {project.description}
        </p>

        <div className="mt-4 flex flex-wrap gap-1.5">
          {project.tech.map((tech) => (
            <span
              key={tech}
              className="rounded-md bg-line/60 px-2 py-0.5 font-mono text-[0.65rem] text-ink-faint"
            >
              {tech}
            </span>
          ))}
        </div>

        <div className="mt-4 flex items-center justify-between border-t border-line pt-3.5">
          <span className="font-mono text-[0.68rem] uppercase tracking-wider text-ink-faint">
            {project.org}
          </span>
          {host ? (
            <span className="max-w-[58%] truncate font-mono text-[0.68rem] text-brand/80">
              {host}
            </span>
          ) : null}
        </div>
      </Wrapper>
    </SpotlightCard>
  );
}
