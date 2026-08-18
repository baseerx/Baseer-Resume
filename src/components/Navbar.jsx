import { useEffect, useState } from "react";
import { AnimatePresence, motion, useMotionValueEvent, useScroll } from "framer-motion";
import { Download, Menu, Moon, Sun, X } from "lucide-react";
import { navLinks, profile } from "../data/resume";
import { useScrollSpy } from "../hooks/useScrollSpy";

const IDS = navLinks.map((l) => l.id);

export function Navbar({ isDark, onToggleTheme }) {
  const [scrolled, setScrolled] = useState(false);
  const [hidden, setHidden] = useState(false);
  const [open, setOpen] = useState(false);
  const active = useScrollSpy(IDS);
  const { scrollY } = useScroll();

  useMotionValueEvent(scrollY, "change", (latest) => {
    const previous = scrollY.getPrevious() ?? 0;
    setScrolled(latest > 24);
    setHidden(latest > 420 && latest > previous && !open);
  });

  // lock body scroll while the mobile sheet is open
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  const go = (event, id) => {
    event.preventDefault();
    setOpen(false);
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
    window.history.replaceState(null, "", `#${id}`);
  };

  return (
    <>
      <motion.header
        initial={{ y: -90, opacity: 0 }}
        animate={{ y: hidden ? -110 : 0, opacity: 1 }}
        transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
        className="no-print fixed inset-x-0 top-0 z-50"
      >
        <nav className="shell pt-3 sm:pt-4">
          <div
            className={`flex items-center justify-between rounded-2xl px-3 py-2.5 transition-all duration-500 sm:px-4 ${
              scrolled ? "glass shadow-lg shadow-black/5" : "border border-transparent"
            }`}
          >
            {/* brand */}
            <a
              href="#home"
              onClick={(e) => go(e, "home")}
              className="group flex items-center gap-2.5 pl-1"
            >
              <span className="relative grid h-9 w-9 place-items-center overflow-hidden rounded-xl bg-gradient-to-br from-brand to-brand-3 text-[0.72rem] font-bold tracking-tight text-white shadow-lg shadow-brand/25">
                {profile.initials}
                <span className="absolute inset-0 translate-x-[-120%] bg-white/25 transition-transform duration-700 group-hover:translate-x-[120%]" />
              </span>
              <span className="hidden text-sm font-semibold tracking-tight sm:block">
                {profile.shortName}
                <span className="ml-1.5 font-mono text-[0.65rem] font-normal text-ink-faint">
                  /dev
                </span>
              </span>
            </a>

            {/* desktop links */}
            <ul className="hidden items-center gap-1 lg:flex">
              {navLinks.map((link) => {
                const isActive = active === link.id;
                return (
                  <li key={link.id}>
                    <a
                      href={`#${link.id}`}
                      onClick={(e) => go(e, link.id)}
                      className={`relative block whitespace-nowrap rounded-lg px-2.5 py-2 text-[0.78rem] font-medium transition-colors duration-300 xl:px-3.5 xl:text-[0.82rem] ${
                        isActive ? "text-ink" : "text-ink-faint hover:text-ink"
                      }`}
                    >
                      {isActive ? (
                        <motion.span
                          layoutId="nav-pill"
                          className="absolute inset-0 rounded-lg border border-brand/25 bg-brand/10"
                          transition={{ type: "spring", stiffness: 380, damping: 32 }}
                        />
                      ) : null}
                      <span className="relative">{link.label}</span>
                    </a>
                  </li>
                );
              })}
            </ul>

            {/* actions */}
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={onToggleTheme}
                aria-label={isDark ? "Switch to light theme" : "Switch to dark theme"}
                className="relative grid h-9 w-9 place-items-center overflow-hidden rounded-xl border border-line-strong bg-surface text-ink-soft transition-colors hover:text-brand"
              >
                <AnimatePresence mode="wait" initial={false}>
                  <motion.span
                    key={isDark ? "moon" : "sun"}
                    initial={{ y: -16, opacity: 0, rotate: -70 }}
                    animate={{ y: 0, opacity: 1, rotate: 0 }}
                    exit={{ y: 16, opacity: 0, rotate: 70 }}
                    transition={{ duration: 0.28, ease: "easeOut" }}
                    className="absolute grid place-items-center"
                  >
                    {isDark ? <Moon className="h-[1.05rem] w-[1.05rem]" /> : <Sun className="h-[1.05rem] w-[1.05rem]" />}
                  </motion.span>
                </AnimatePresence>
              </button>

              <a
                href={profile.resumeFile}
                download
                className="hidden items-center gap-2 rounded-xl bg-gradient-to-r from-brand to-brand-3 px-4 py-2 text-[0.8rem] font-semibold text-white shadow-lg shadow-brand/25 transition-transform duration-300 hover:-translate-y-0.5 sm:inline-flex"
              >
                <Download className="h-4 w-4" />
                Résumé
              </a>

              <button
                type="button"
                onClick={() => setOpen((v) => !v)}
                aria-label={open ? "Close menu" : "Open menu"}
                aria-expanded={open}
                className="grid h-9 w-9 place-items-center rounded-xl border border-line-strong bg-surface text-ink-soft lg:hidden"
              >
                {open ? <X className="h-[1.05rem] w-[1.05rem]" /> : <Menu className="h-[1.05rem] w-[1.05rem]" />}
              </button>
            </div>
          </div>
        </nav>
      </motion.header>

      {/* mobile sheet */}
      <AnimatePresence>
        {open ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="no-print fixed inset-0 z-40 lg:hidden"
          >
            <div
              className="absolute inset-0 bg-black/45 backdrop-blur-sm"
              onClick={() => setOpen(false)}
            />
            <motion.div
              initial={{ y: -28, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: -28, opacity: 0 }}
              transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
              className="sheet absolute inset-x-4 top-20 rounded-2xl p-3 shadow-2xl"
            >
              <ul className="flex flex-col">
                {navLinks.map((link, i) => (
                  <motion.li
                    key={link.id}
                    initial={{ opacity: 0, x: -14 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.05 + i * 0.04 }}
                  >
                    <a
                      href={`#${link.id}`}
                      onClick={(e) => go(e, link.id)}
                      className={`flex items-center justify-between rounded-xl px-4 py-3 text-sm font-medium transition-colors ${
                        active === link.id
                          ? "bg-brand/12 text-brand"
                          : "text-ink-soft hover:bg-brand/8 hover:text-ink"
                      }`}
                    >
                      {link.label}
                      <span className="font-mono text-[0.65rem] text-ink-faint">
                        0{i + 1}
                      </span>
                    </a>
                  </motion.li>
                ))}
              </ul>
              <a
                href={profile.resumeFile}
                download
                className="btn btn-primary mt-3 w-full"
                onClick={() => setOpen(false)}
              >
                <Download className="h-4 w-4" />
                Download Résumé
              </a>
            </motion.div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </>
  );
}
