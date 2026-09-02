import { useRef, useState } from "react";
import { AnimatePresence, motion, useScroll, useSpring } from "framer-motion";
import { Briefcase, Building2, CalendarDays, ChevronDown, MapPin } from "lucide-react";
import { experience, profile } from "../data/resume";
import { Section, SectionHeading } from "./ui/Section";
import { Reveal } from "./ui/Reveal";
import { SpotlightCard } from "./ui/SpotlightCard";

const FILTERS = ["All", "Full-time", "Contract", "Part-time"];

export function Experience() {
  const [filter, setFilter] = useState("All");
  const trackRef = useRef(null);

  const { scrollYProgress } = useScroll({
    target: trackRef,
    offset: ["start 78%", "end 62%"],
  });
  const lineScale = useSpring(scrollYProgress, { stiffness: 90, damping: 26, restDelta: 0.001 });

  const visible =
    filter === "All" ? experience : experience.filter((job) => job.type === filter);

  return (
    <Section id="experience">
      <SectionHeading
        eyebrow="Career path"
        icon={Briefcase}
        title={
          <>
            {profile.experienceYears} years of <span className="gradient-text">shipping systems</span>{" "}
            that matter
          </>
        }
        lead="From national grid platforms to US product teams — full-time leadership alongside contract work delivered in parallel."
      />

      {/* filters */}
      <Reveal className="mb-12 flex justify-center">
        <div className="glass inline-flex flex-wrap justify-center gap-1 rounded-2xl p-1.5">
          {FILTERS.map((option) => {
            const count =
              option === "All"
                ? experience.length
                : experience.filter((job) => job.type === option).length;
            const isActive = filter === option;
            return (
              <button
                key={option}
                type="button"
                onClick={() => setFilter(option)}
                className={`relative rounded-xl px-4 py-2 text-[0.8rem] font-medium transition-colors duration-300 ${
                  isActive ? "text-white" : "text-ink-faint hover:text-ink"
                }`}
              >
                {isActive ? (
                  <motion.span
                    layoutId="exp-filter"
                    className="absolute inset-0 rounded-xl bg-gradient-to-r from-brand to-brand-3 shadow-lg shadow-brand/25"
                    transition={{ type: "spring", stiffness: 380, damping: 32 }}
                  />
                ) : null}
                <span className="relative">
                  {option}
                  <span className={`ml-1.5 font-mono text-[0.65rem] ${isActive ? "text-white/70" : "text-ink-faint"}`}>
                    {count}
                  </span>
                </span>
              </button>
            );
          })}
        </div>
      </Reveal>

      {/* timeline */}
      <div ref={trackRef} className="relative">
        {/* rail */}
        <div className="absolute left-[9px] top-2 h-full w-px bg-line sm:left-[15px]" aria-hidden />
        <motion.div
          aria-hidden
          style={{ scaleY: lineScale }}
          className="absolute left-[9px] top-2 h-full w-px origin-top bg-gradient-to-b from-brand via-brand-2 to-brand-3 sm:left-[15px]"
        />

        <ul className="space-y-6">
          <AnimatePresence mode="popLayout" initial={false}>
            {visible.map((job, index) => (
              <motion.li
                key={job.id}
                layout
                initial={{ opacity: 0, y: 26 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -14, scale: 0.98 }}
                transition={{
                  duration: 0.5,
                  delay: index * 0.06,
                  ease: [0.22, 1, 0.36, 1],
                  layout: { duration: 0.4 },
                }}
                className="relative pl-10 sm:pl-16"
              >
                {/* node */}
                <span className="absolute left-0 top-6 grid h-[19px] w-[19px] place-items-center sm:left-[6px]">
                  <span
                    className={`h-[11px] w-[11px] rounded-full border-2 ${
                      job.current
                        ? "border-brand bg-brand shadow-[0_0_0_5px] shadow-brand/18"
                        : "border-brand/50 bg-bg"
                    }`}
                  />
                  {job.current ? (
                    <span className="absolute h-[19px] w-[19px] animate-pulse-ring rounded-full bg-brand/45" />
                  ) : null}
                </span>

                <JobCard job={job} defaultOpen={index === 0} />
              </motion.li>
            ))}
          </AnimatePresence>
        </ul>
      </div>
    </Section>
  );
}

function JobCard({ job, defaultOpen }) {
  const [open, setOpen] = useState(defaultOpen);

  return (
    <SpotlightCard className="overflow-hidden" tilt={false}>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        className="flex w-full items-start gap-4 p-5 text-left sm:p-6"
      >
        <span className="hidden h-12 w-12 shrink-0 place-items-center rounded-xl border border-brand/22 bg-brand/8 text-brand sm:grid">
          <Building2 className="h-5 w-5" strokeWidth={1.9} />
        </span>

        <span className="min-w-0 flex-1">
          <span className="flex flex-wrap items-center gap-2">
            <h3 className="text-[1.05rem] font-semibold leading-snug text-ink sm:text-lg">
              {job.role}
            </h3>
            {job.current ? (
              <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/12 px-2.5 py-0.5 text-[0.65rem] font-semibold uppercase tracking-wider text-emerald-500 ring-1 ring-emerald-500/25">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                Current
              </span>
            ) : (
              <span className="rounded-full border border-line-strong px-2.5 py-0.5 text-[0.65rem] font-medium uppercase tracking-wider text-ink-faint">
                {job.type}
              </span>
            )}
          </span>

          <p className="mt-1 text-[0.92rem] font-medium text-brand">{job.company}</p>

          <span className="mt-2.5 flex flex-wrap items-center gap-x-4 gap-y-1 text-[0.78rem] text-ink-faint">
            <span className="inline-flex items-center gap-1.5">
              <CalendarDays className="h-3.5 w-3.5" />
              {job.period}
            </span>
            <span className="inline-flex items-center gap-1.5">
              <MapPin className="h-3.5 w-3.5" />
              {job.location}
            </span>
          </span>

          <p className="mt-3 text-pretty text-[0.875rem] leading-relaxed text-ink-soft">
            {job.blurb}
          </p>
        </span>

        <motion.span
          animate={{ rotate: open ? 180 : 0 }}
          transition={{ duration: 0.3 }}
          className="mt-1 grid h-8 w-8 shrink-0 place-items-center rounded-lg border border-line-strong text-ink-faint"
        >
          <ChevronDown className="h-4 w-4" />
        </motion.span>
      </button>

      {/* The panel stays mounted and is height-animated instead of unmounted,
          so `print-expand` can force every entry open on paper. */}
      <motion.div
        initial={false}
        animate={{ height: open ? "auto" : 0, opacity: open ? 1 : 0 }}
        transition={{ duration: 0.42, ease: [0.22, 1, 0.36, 1] }}
        className="print-expand overflow-hidden"
      >
        <div className="border-t border-line px-5 pb-6 pt-5 sm:px-6 sm:pl-[5.5rem]">
          <ul className="space-y-2.5">
            {job.points.map((point) => (
              <li
                key={point}
                className="flex gap-3 text-[0.875rem] leading-relaxed text-ink-soft"
              >
                <span className="mt-[0.55rem] h-1.5 w-1.5 shrink-0 rotate-45 rounded-[2px] bg-gradient-to-br from-brand to-brand-2" />
                <span className="text-pretty">{point}</span>
              </li>
            ))}
          </ul>

          <div className="mt-5 flex flex-wrap gap-2">
            {job.tech.map((tech) => (
              <span
                key={tech}
                className="rounded-lg border border-line-strong bg-surface px-2.5 py-1 font-mono text-[0.68rem] text-ink-soft transition-colors hover:border-brand/45 hover:text-brand"
              >
                {tech}
              </span>
            ))}
          </div>
        </div>
      </motion.div>
    </SpotlightCard>
  );
}
