import { useEffect, useMemo, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { ArrowUpRight, Download, Mail, MapPin, MousePointer2, Phone, Sparkles } from "lucide-react";
import { profile, stats } from "../data/resume";
import { Counter } from "./ui/Counter";
import { GithubIcon, LinkedinIcon } from "./ui/BrandIcons";

/** Types the roles out one character at a time, then deletes and moves on. */
function Typewriter({ words, className = "" }) {
  const reduced = useReducedMotion();
  const [index, setIndex] = useState(0);
  const [text, setText] = useState("");
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    if (reduced) return undefined;
    const word = words[index % words.length];
    const done = !deleting && text === word;
    const cleared = deleting && text === "";

    const delay = done ? 1900 : cleared ? 240 : deleting ? 34 : 68;

    const timer = setTimeout(() => {
      if (done) {
        setDeleting(true);
      } else if (cleared) {
        setDeleting(false);
        setIndex((i) => (i + 1) % words.length);
      } else {
        setText(word.slice(0, text.length + (deleting ? -1 : 1)));
      }
    }, delay);

    return () => clearTimeout(timer);
  }, [text, deleting, index, words, reduced]);

  if (reduced) {
    return <span className={className}>{words[0]}</span>;
  }

  return (
    <span className={className}>
      {text}
      <motion.span
        aria-hidden
        animate={{ opacity: [1, 1, 0, 0] }}
        transition={{ duration: 1, repeat: Infinity, times: [0, 0.5, 0.5, 1] }}
        className="ml-0.5 inline-block h-[0.95em] w-[3px] translate-y-[0.12em] rounded-full bg-brand-2"
      />
    </span>
  );
}

const AI_STACK = ["LLMs", "LangGraph", "Google ADK", "RAG", "MCP", "Vector DBs", "PyTorch"];

const CONTACT_CHIPS = [
  { icon: MapPin, label: profile.location, href: null },
  { icon: Mail, label: profile.email, href: `mailto:${profile.email}` },
  { icon: Phone, label: profile.phone, href: profile.phoneHref },
];

export function Hero() {
  const reduced = useReducedMotion();
  const roles = useMemo(() => profile.roles, []);

  const fade = (delay = 0) => ({
    initial: reduced ? { opacity: 0 } : { opacity: 0, y: 22, filter: "blur(6px)" },
    animate: { opacity: 1, y: 0, filter: "blur(0px)" },
    transition: { duration: 0.75, delay, ease: [0.22, 1, 0.36, 1] },
  });

  return (
    <section id="home" className="relative scroll-mt-24 pb-16 pt-28 sm:pb-20 sm:pt-32 lg:pt-40">
      <div className="shell">
        <div className="grid items-center gap-12 lg:grid-cols-[1.15fr_0.85fr] lg:gap-16">
          {/* ---------------------------------------------------------- text */}
          <div className="order-2 text-center lg:order-1 lg:text-left">
            {profile.available ? (
              <motion.div {...fade(0)} className="inline-flex">
                <span className="chip">
                  <span className="relative flex h-2 w-2">
                    <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-70" />
                    <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-400" />
                  </span>
                  Open to senior AI engineering roles &amp; doctoral research
                </span>
              </motion.div>
            ) : null}

            <motion.p
              {...fade(0.08)}
              className="mt-6 font-mono text-xs uppercase tracking-[0.32em] text-ink-faint sm:text-[0.78rem]"
            >
              Hello, I&apos;m
            </motion.p>

            <motion.h1
              {...fade(0.14)}
              className="mt-3 text-4xl font-extrabold leading-[1.05] tracking-tight sm:text-5xl lg:text-[3.9rem]"
            >
              Muhammad
              <br className="hidden sm:block" /> <span className="gradient-text">Baseer Khan</span>
            </motion.h1>

            <motion.div
              {...fade(0.2)}
              className="mt-4 flex min-h-[2.1rem] items-center justify-center gap-2 text-lg font-semibold text-ink-soft sm:text-xl lg:justify-start"
            >
              <Sparkles className="h-4 w-4 shrink-0 text-brand-2 print:hidden" />
              <span className="print:hidden">
                <Typewriter words={roles} className="text-ink" />
              </span>
              {/* the typewriter freezes mid-word on paper, so print a static line */}
              <span className="hidden text-ink print:inline">{profile.tagline}</span>
            </motion.div>

            <motion.p
              {...fade(0.26)}
              className="mx-auto mt-5 max-w-xl text-pretty text-[0.96rem] leading-relaxed text-ink-soft lg:mx-0 sm:text-base"
            >
              {profile.experienceYears} years building production systems across power-sector
              enterprise platforms and US product teams — now engineering{" "}
              <span className="font-semibold text-ink">LLM applications</span>,{" "}
              <span className="font-semibold text-ink">multi-agent systems</span> and{" "}
              <span className="font-semibold text-ink">Retrieval-Augmented Generation</span> that run in
              production.
            </motion.p>

            {/* AI stack at a glance */}
            <motion.ul
              {...fade(0.29)}
              aria-label="Core AI stack"
              className="mt-5 flex flex-wrap justify-center gap-1.5 lg:justify-start"
            >
              {AI_STACK.map((tech) => (
                <li
                  key={tech}
                  className="rounded-lg border border-line-strong bg-surface px-2.5 py-1 font-mono text-[0.68rem] text-ink-soft"
                >
                  {tech}
                </li>
              ))}
            </motion.ul>

            {/* quick contact */}
            <motion.ul
              {...fade(0.32)}
              className="mt-6 flex flex-wrap items-center justify-center gap-x-5 gap-y-2 text-[0.82rem] text-ink-faint lg:justify-start"
            >
              {CONTACT_CHIPS.map(({ icon: Icon, label, href }) => {
                const body = (
                  <span className="inline-flex items-center gap-1.5 transition-colors hover:text-brand">
                    <Icon className="h-3.5 w-3.5" />
                    {label}
                  </span>
                );
                return (
                  <li key={label}>{href ? <a href={href}>{body}</a> : body}</li>
                );
              })}
            </motion.ul>

            {/* actions */}
            <motion.div
              {...fade(0.38)}
              className="mt-8 flex flex-wrap items-center justify-center gap-3 lg:justify-start"
            >
              <a href={profile.resumeFile} download className="btn btn-primary group">
                <Download className="h-4 w-4 transition-transform duration-300 group-hover:translate-y-0.5" />
                Download Résumé
              </a>
              <a
                href="#contact"
                onClick={(e) => {
                  e.preventDefault();
                  document.getElementById("contact")?.scrollIntoView({ behavior: "smooth" });
                }}
                className="btn btn-ghost group"
              >
                Let&apos;s talk
                <ArrowUpRight className="h-4 w-4 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
              </a>

              <div className="ml-1 flex items-center gap-2">
                {[
                  { href: profile.github, Icon: GithubIcon, label: "GitHub" },
                  { href: profile.linkedin, Icon: LinkedinIcon, label: "LinkedIn" },
                ].map(({ href, Icon, label }) => (
                  <a
                    key={label}
                    href={href}
                    target="_blank"
                    rel="noreferrer noopener"
                    aria-label={label}
                    className="grid h-11 w-11 place-items-center rounded-xl border border-line-strong bg-surface text-ink-soft transition-all duration-300 hover:-translate-y-0.5 hover:border-brand/50 hover:text-brand"
                  >
                    <Icon className="h-[1.15rem] w-[1.15rem]" />
                  </a>
                ))}
              </div>
            </motion.div>
          </div>

          {/* ------------------------------------------------------- portrait */}
          <motion.div
            initial={reduced ? { opacity: 0 } : { opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
            className="order-1 flex justify-center lg:order-2"
          >
            <div className="relative w-[16.5rem] sm:w-[19rem] lg:w-[21rem]">
              {/* halo */}
              <div
                aria-hidden
                className="no-print absolute -inset-8 rounded-full opacity-70 blur-3xl"
                style={{
                  background:
                    "conic-gradient(from 140deg, var(--glow-1), var(--glow-3), var(--glow-2), var(--glow-1))",
                }}
              />

              {/* rotating dashed ring */}
              <motion.div
                aria-hidden
                animate={reduced ? undefined : { rotate: 360 }}
                transition={{ duration: 44, repeat: Infinity, ease: "linear" }}
                className="no-print absolute -inset-3 rounded-full border border-dashed border-brand/25 sm:-inset-5"
              />
              <motion.div
                aria-hidden
                animate={reduced ? undefined : { rotate: -360 }}
                transition={{ duration: 68, repeat: Infinity, ease: "linear" }}
                className="no-print absolute -inset-6 rounded-full border border-brand-3/15 sm:-inset-10"
              />

              {/* orbiting dot */}
              {!reduced ? (
                <motion.div
                  aria-hidden
                  animate={{ rotate: 360 }}
                  transition={{ duration: 14, repeat: Infinity, ease: "linear" }}
                  className="no-print absolute -inset-3 sm:-inset-5"
                >
                  <span className="absolute left-1/2 top-0 h-2.5 w-2.5 -translate-x-1/2 rounded-full bg-brand-2 shadow-[0_0_18px_4px] shadow-brand-2/50" />
                </motion.div>
              ) : null}

              {/* photo plate */}
              <div className="glass relative overflow-hidden rounded-[2rem] p-[3px]">
                <div className="relative overflow-hidden rounded-[1.85rem] bg-gradient-to-b from-brand/12 via-transparent to-brand-3/14">
                  <img
                    src={profile.photo}
                    alt={`${profile.name}, ${profile.title}`}
                    width={450}
                    height={600}
                    loading="eager"
                    className="portrait-mask relative z-10 w-full select-none object-cover"
                    draggable={false}
                  />
                  <div
                    aria-hidden
                    className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-bg/85 to-transparent"
                  />
                </div>
              </div>

              {/* floating badges — hung off the plate edges so they never
                  sit on top of the face */}
              <motion.div
                animate={reduced ? undefined : { y: [0, -11, 0] }}
                transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
                className="no-print badge-float absolute z-20 left-0 top-[14%] -translate-x-[16%] rounded-xl px-2.5 py-1.5 shadow-xl sm:-translate-x-[62%] sm:px-3.5 sm:py-2 lg:-translate-x-[34%] xl:-translate-x-[62%]"
              >
                <p className="font-mono text-[0.55rem] uppercase tracking-widest text-ink-faint sm:text-[0.62rem]">
                  Experience
                </p>
                <p className="text-[0.72rem] font-bold text-ink sm:text-sm">{profile.experienceYears} Years</p>
              </motion.div>

              <motion.div
                animate={reduced ? undefined : { y: [0, 12, 0] }}
                transition={{ duration: 7.5, repeat: Infinity, ease: "easeInOut", delay: 0.6 }}
                className="no-print badge-float absolute z-20 right-0 top-[46%] translate-x-[16%] rounded-xl px-2.5 py-1.5 shadow-xl sm:translate-x-[62%] sm:px-3.5 sm:py-2 lg:translate-x-[34%] xl:translate-x-[62%]"
              >
                <p className="font-mono text-[0.55rem] uppercase tracking-widest text-ink-faint sm:text-[0.62rem]">
                  MS Data Science
                </p>
                <p className="gradient-text text-[0.72rem] font-bold sm:text-sm">Silver Medalist</p>
              </motion.div>

              <motion.div
                animate={reduced ? undefined : { y: [0, -8, 0] }}
                transition={{ duration: 5.4, repeat: Infinity, ease: "easeInOut", delay: 1.2 }}
                className="no-print badge-float absolute z-20 bottom-[3%] left-1/2 -translate-x-1/2 rounded-xl px-3 py-1.5 text-center shadow-xl sm:px-4 sm:py-2"
              >
                <p className="text-[0.72rem] font-bold text-ink sm:text-sm">AI Engineer</p>
                <p className="font-mono text-[0.55rem] text-ink-faint sm:text-[0.62rem]">LLMs · RAG · Agents</p>
              </motion.div>
            </div>
          </motion.div>
        </div>

        {/* ------------------------------------------------------------ stats */}
        <motion.div
          initial={{ opacity: 0, y: 26 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.55, ease: [0.22, 1, 0.36, 1] }}
          className="card mt-16 grid grid-cols-2 divide-line lg:mt-20 lg:grid-cols-4 lg:divide-x"
        >
          {stats.map((stat) => (
            <div key={stat.label} className="px-3 py-6 text-center sm:px-5 sm:py-7">
              <p className="font-display text-3xl font-extrabold tracking-tight sm:text-4xl">
                <span className="gradient-text">
                  <Counter value={stat.value} suffix={stat.suffix} />
                </span>
              </p>
              <p className="mt-1.5 text-[0.62rem] font-medium uppercase tracking-[0.06em] text-ink-faint sm:text-xs sm:tracking-[0.14em]">
                {stat.label}
              </p>
            </div>
          ))}
        </motion.div>

        {/* scroll cue */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2 }}
          className="no-print mt-10 flex justify-center sm:mt-12"
        >
          <motion.span
            animate={reduced ? undefined : { y: [0, 7, 0] }}
            transition={{ duration: 1.9, repeat: Infinity, ease: "easeInOut" }}
            className="inline-flex items-center gap-2 font-mono text-[0.68rem] uppercase tracking-[0.28em] text-ink-faint"
          >
            <MousePointer2 className="h-3.5 w-3.5" />
            Scroll to explore
          </motion.span>
        </motion.div>
      </div>
    </section>
  );
}
