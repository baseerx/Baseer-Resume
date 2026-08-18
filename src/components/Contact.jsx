import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Check, Copy, Download, Mail, MapPin, Phone, Send } from "lucide-react";
import { profile } from "../data/resume";
import { Section, SectionHeading } from "./ui/Section";
import { Reveal, RevealGroup, RevealItem } from "./ui/Reveal";
import { SpotlightCard } from "./ui/SpotlightCard";
import { GithubIcon, LinkedinIcon } from "./ui/BrandIcons";

const CHANNELS = [
  {
    icon: Mail,
    label: "Email",
    value: profile.email,
    href: `mailto:${profile.email}`,
    copyable: true,
  },
  {
    icon: Phone,
    label: "Phone",
    value: profile.phone,
    href: profile.phoneHref,
    copyable: true,
  },
  {
    icon: LinkedinIcon,
    label: "LinkedIn",
    value: "linkedin.com/in/baseerx",
    href: profile.linkedin,
    copyable: false,
  },
  {
    icon: GithubIcon,
    label: "GitHub",
    value: "github.com/baseerx",
    href: profile.github,
    copyable: false,
  },
];

export function Contact() {
  return (
    <Section id="contact">
      <SectionHeading
        eyebrow="Get in touch"
        icon={Send}
        title={
          <>
            Let&apos;s build something <span className="gradient-text">worth shipping</span>
          </>
        }
        lead="Open to doctoral research collaborations, senior engineering roles and applied AI consulting."
      />

      <RevealGroup className="grid gap-4 sm:grid-cols-2">
        {CHANNELS.map((channel) => (
          <RevealItem key={channel.label}>
            <ContactCard channel={channel} />
          </RevealItem>
        ))}
      </RevealGroup>

      {/* location + CTA */}
      <Reveal delay={0.15} className="mt-6">
        <SpotlightCard className="overflow-hidden" tilt={false}>
          <div className="grid gap-8 p-7 sm:p-9 lg:grid-cols-[1fr_auto] lg:items-center">
            <div>
              <span className="chip">
                <MapPin className="h-3.5 w-3.5" />
                Based in {profile.location}
              </span>
              <p className="mt-4 text-[0.95rem] leading-relaxed text-ink-soft">
                {profile.address}
              </p>
              <p className="mt-3 text-[0.85rem] text-ink-faint">
                Available for remote collaboration across US and EU time zones — as delivered for
                clients in Los Angeles and Oregon.
              </p>
            </div>

            <div className="flex flex-wrap gap-3">
              <a href={`mailto:${profile.email}`} className="btn btn-primary group">
                <Send className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                Send an email
              </a>
              <a href={profile.resumeFile} download className="btn btn-ghost group">
                <Download className="h-4 w-4 transition-transform duration-300 group-hover:translate-y-0.5" />
                Résumé (PDF)
              </a>
            </div>
          </div>
        </SpotlightCard>
      </Reveal>
    </Section>
  );
}

function ContactCard({ channel }) {
  const { icon: Icon, label, value, href, copyable } = channel;
  const [copied, setCopied] = useState(false);

  const copy = async (event) => {
    event.preventDefault();
    event.stopPropagation();
    try {
      await navigator.clipboard.writeText(value);
    } catch {
      // clipboard can be blocked (insecure origin / permissions) — fall back quietly
      const area = document.createElement("textarea");
      area.value = value;
      area.style.position = "fixed";
      area.style.opacity = "0";
      document.body.appendChild(area);
      area.select();
      try {
        document.execCommand("copy");
      } catch {
        /* nothing else we can do */
      }
      document.body.removeChild(area);
    }
    setCopied(true);
    setTimeout(() => setCopied(false), 1800);
  };

  return (
    <SpotlightCard className="h-full">
      <a
        href={href}
        target={href.startsWith("http") ? "_blank" : undefined}
        rel={href.startsWith("http") ? "noreferrer noopener" : undefined}
        className="flex h-full items-center gap-4 p-5 sm:p-6"
      >
        <span className="grid h-12 w-12 shrink-0 place-items-center rounded-xl border border-brand/22 bg-brand/8 text-brand transition-transform duration-500 group-hover:scale-110">
          <Icon className="h-[1.15rem] w-[1.15rem]" strokeWidth={1.9} />
        </span>

        <span className="min-w-0 flex-1">
          <span className="block font-mono text-[0.66rem] uppercase tracking-[0.2em] text-ink-faint">
            {label}
          </span>
          <span className="mt-1 block truncate text-[0.92rem] font-medium text-ink transition-colors group-hover:text-brand">
            {value}
          </span>
        </span>

        {copyable ? (
          <button
            type="button"
            onClick={copy}
            aria-label={`Copy ${label.toLowerCase()}`}
            className="relative grid h-9 w-9 shrink-0 place-items-center rounded-lg border border-line-strong text-ink-faint transition-colors hover:border-brand/45 hover:text-brand"
          >
            <AnimatePresence mode="wait" initial={false}>
              <motion.span
                key={copied ? "done" : "copy"}
                initial={{ scale: 0.5, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.5, opacity: 0 }}
                transition={{ duration: 0.18 }}
                className="absolute grid place-items-center"
              >
                {copied ? (
                  <Check className="h-4 w-4 text-emerald-500" />
                ) : (
                  <Copy className="h-4 w-4" />
                )}
              </motion.span>
            </AnimatePresence>
          </button>
        ) : null}
      </a>
    </SpotlightCard>
  );
}
