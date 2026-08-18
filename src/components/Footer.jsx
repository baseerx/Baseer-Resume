import { Heart, Printer } from "lucide-react";
import { navLinks, profile } from "../data/resume";
import { GithubIcon, LinkedinIcon } from "./ui/BrandIcons";

export function Footer() {
  const year = new Date().getFullYear();

  const go = (event, id) => {
    event.preventDefault();
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <footer className="relative mt-8 border-t border-line py-12">
      <div className="shell">
        <div className="flex flex-col items-center gap-8 lg:flex-row lg:items-start lg:justify-between">
          <div className="text-center lg:text-left">
            <a href="#home" onClick={(e) => go(e, "home")} className="inline-flex items-center gap-2.5">
              <span className="grid h-9 w-9 place-items-center rounded-xl bg-gradient-to-br from-brand to-brand-3 text-[0.72rem] font-bold text-white">
                {profile.initials}
              </span>
              <span className="text-sm font-semibold">{profile.name}</span>
            </a>
            <p className="mt-3 max-w-sm text-[0.82rem] leading-relaxed text-ink-faint">
              {profile.tagline}
            </p>
          </div>

          <nav className="no-print">
            <ul className="flex flex-wrap justify-center gap-x-5 gap-y-2">
              {navLinks.map((link) => (
                <li key={link.id}>
                  <a
                    href={`#${link.id}`}
                    onClick={(e) => go(e, link.id)}
                    className="text-[0.82rem] text-ink-faint transition-colors hover:text-brand"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          <div className="no-print flex items-center gap-2">
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
                className="grid h-10 w-10 place-items-center rounded-xl border border-line-strong bg-surface text-ink-soft transition-all duration-300 hover:-translate-y-0.5 hover:border-brand/50 hover:text-brand"
              >
                <Icon className="h-4 w-4" />
              </a>
            ))}
            {/* Opens the generated résumé PDF rather than printing the marketing
                page — the PDF is the typeset document meant for paper. */}
            <a
              href={profile.resumeFile}
              target="_blank"
              rel="noreferrer noopener"
              aria-label="Open the résumé PDF to print"
              className="grid h-10 w-10 place-items-center rounded-xl border border-line-strong bg-surface text-ink-soft transition-all duration-300 hover:-translate-y-0.5 hover:border-brand/50 hover:text-brand"
            >
              <Printer className="h-4 w-4" />
            </a>
          </div>
        </div>

        <div className="rule my-8" />

        <div className="flex flex-col items-center justify-between gap-3 text-[0.76rem] text-ink-faint sm:flex-row">
          <p>
            © {year} {profile.name}. All rights reserved.
          </p>
          {/* <p className="inline-flex items-center gap-1.5">
            Built with React, Vite &amp; Tailwind CSS
            <Heart className="h-3.5 w-3.5 fill-current text-rose-500" />
          </p> */}
        </div>
      </div>
    </footer>
  );
}
