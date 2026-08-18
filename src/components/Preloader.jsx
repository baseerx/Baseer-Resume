import { AnimatePresence, motion } from "framer-motion";
import { profile } from "../data/resume";

/** Brief brand curtain that lifts once the app has mounted. */
export function Preloader({ done }) {
  return (
    <AnimatePresence>
      {!done ? (
        <motion.div
          key="preloader"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, y: "-100%" }}
          transition={{ duration: 0.7, ease: [0.76, 0, 0.24, 1] }}
          className="no-print fixed inset-0 z-[100] grid place-items-center bg-bg"
        >
          <div className="flex flex-col items-center gap-5">
            <motion.div
              initial={{ scale: 0.7, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
              className="relative grid h-16 w-16 place-items-center rounded-2xl bg-gradient-to-br from-brand to-brand-3 text-base font-bold text-white shadow-2xl shadow-brand/35"
            >
              {profile.initials}
              <motion.span
                animate={{ rotate: 360 }}
                transition={{ duration: 2.4, repeat: Infinity, ease: "linear" }}
                className="absolute -inset-3 rounded-[1.4rem] border border-dashed border-brand/40"
              />
            </motion.div>

            <div className="h-[2px] w-40 overflow-hidden rounded-full bg-line">
              <motion.div
                initial={{ x: "-100%" }}
                animate={{ x: "100%" }}
                transition={{ duration: 1.1, repeat: Infinity, ease: "easeInOut" }}
                className="h-full w-1/2 rounded-full bg-gradient-to-r from-transparent via-brand to-transparent"
              />
            </div>

            <p className="font-mono text-[0.68rem] uppercase tracking-[0.3em] text-ink-faint">
              {profile.shortName}
            </p>
          </div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
