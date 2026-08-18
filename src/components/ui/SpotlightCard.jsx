import { useRef } from "react";
import { motion, useMotionTemplate, useMotionValue, useReducedMotion, useSpring } from "framer-motion";
import { useMediaQuery } from "../../hooks/useMediaQuery";

/**
 * Glass card with a pointer-tracking spotlight, a gradient border that lights
 * up on hover, and an optional subtle 3D tilt. Falls back to a static card on
 * touch devices and for reduced-motion visitors.
 */
export function SpotlightCard({ children, className = "", tilt = true, radius = 340 }) {
  const ref = useRef(null);
  const reduced = useReducedMotion();
  const finePointer = useMediaQuery("(hover: hover) and (pointer: fine)");
  const interactive = finePointer && !reduced;

  const mx = useMotionValue(-9999);
  const my = useMotionValue(-9999);

  const rx = useSpring(useMotionValue(0), { stiffness: 180, damping: 18, mass: 0.4 });
  const ry = useSpring(useMotionValue(0), { stiffness: 180, damping: 18, mass: 0.4 });

  const spotlight = useMotionTemplate`radial-gradient(${radius}px circle at ${mx}px ${my}px, color-mix(in oklab, var(--brand) 16%, transparent), transparent 72%)`;
  const border = useMotionTemplate`radial-gradient(${radius}px circle at ${mx}px ${my}px, color-mix(in oklab, var(--brand) 62%, transparent), transparent 68%)`;

  const handleMove = (event) => {
    if (!interactive || !ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;
    mx.set(x);
    my.set(y);
    if (tilt) {
      rx.set(((y / rect.height) * 2 - 1) * -4.5);
      ry.set(((x / rect.width) * 2 - 1) * 4.5);
    }
  };

  const handleLeave = () => {
    mx.set(-9999);
    my.set(-9999);
    rx.set(0);
    ry.set(0);
  };

  return (
    <motion.div
      ref={ref}
      onMouseMove={handleMove}
      onMouseLeave={handleLeave}
      style={
        interactive && tilt
          ? { rotateX: rx, rotateY: ry, transformPerspective: 1100, transformStyle: "preserve-3d" }
          : undefined
      }
      whileHover={interactive ? { y: -5 } : undefined}
      transition={{ type: "spring", stiffness: 260, damping: 22 }}
      className={`card group relative overflow-hidden ${className}`}
    >
      {/* gradient border highlight */}
      <motion.span
        aria-hidden
        className="pointer-events-none absolute inset-0 rounded-[inherit] opacity-0 transition-opacity duration-300 group-hover:opacity-100"
        style={{
          background: border,
          WebkitMask:
            "linear-gradient(#000 0 0) content-box, linear-gradient(#000 0 0)",
          WebkitMaskComposite: "xor",
          maskComposite: "exclude",
          padding: 1,
        }}
      />
      {/* interior spotlight */}
      <motion.span
        aria-hidden
        className="pointer-events-none absolute inset-0 rounded-[inherit] opacity-0 transition-opacity duration-300 group-hover:opacity-100"
        style={{ background: spotlight }}
      />
      <div className="relative">{children}</div>
    </motion.div>
  );
}
