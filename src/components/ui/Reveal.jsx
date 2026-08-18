import { motion, useReducedMotion } from "framer-motion";

const OFFSETS = {
  up: { y: 28, x: 0 },
  down: { y: -28, x: 0 },
  left: { x: 34, y: 0 },
  right: { x: -34, y: 0 },
  none: { x: 0, y: 0 },
};

/**
 * Scroll-triggered entrance. Collapses to a plain fade (or nothing at all)
 * when the visitor prefers reduced motion.
 */
export function Reveal({
  children,
  delay = 0,
  duration = 0.65,
  from = "up",
  amount = 0.25,
  once = true,
  className = "",
  as = "div",
}) {
  const reduced = useReducedMotion();
  const MotionTag = motion[as] ?? motion.div;
  const offset = OFFSETS[from] ?? OFFSETS.up;

  return (
    <MotionTag
      className={className}
      initial={reduced ? { opacity: 0 } : { opacity: 0, ...offset, filter: "blur(6px)" }}
      whileInView={reduced ? { opacity: 1 } : { opacity: 1, x: 0, y: 0, filter: "blur(0px)" }}
      viewport={{ once, amount }}
      transition={{
        duration: reduced ? 0.2 : duration,
        delay: reduced ? 0 : delay,
        ease: [0.22, 1, 0.36, 1],
      }}
    >
      {children}
    </MotionTag>
  );
}

/** Container that staggers the entrance of its `RevealItem` children. */
export function RevealGroup({ children, className = "", stagger = 0.08, delay = 0, amount = 0.2 }) {
  return (
    <motion.div
      className={className}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, amount }}
      variants={{
        hidden: {},
        show: { transition: { staggerChildren: stagger, delayChildren: delay } },
      }}
    >
      {children}
    </motion.div>
  );
}

export function RevealItem({ children, className = "", from = "up" }) {
  const reduced = useReducedMotion();
  const offset = OFFSETS[from] ?? OFFSETS.up;

  return (
    // `min-w-0` because these are nearly always grid items: without it the
    // default `min-width: auto` lets long unbreakable content (an email
    // address, a URL) inflate the track and overflow the row.
    <motion.div
      className={`min-w-0 ${className}`}
      variants={{
        hidden: reduced ? { opacity: 0 } : { opacity: 0, ...offset, filter: "blur(5px)" },
        show: {
          opacity: 1,
          x: 0,
          y: 0,
          filter: "blur(0px)",
          transition: { duration: reduced ? 0.2 : 0.6, ease: [0.22, 1, 0.36, 1] },
        },
      }}
    >
      {children}
    </motion.div>
  );
}
