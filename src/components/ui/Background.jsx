import { useEffect, useState } from "react";
import { useReducedMotion } from "framer-motion";
import { useMediaQuery } from "../../hooks/useMediaQuery";

/** Slow-drifting aurora blobs, a masked grid and a fine noise layer. */
export function Background() {
  return (
    <div aria-hidden className="no-print pointer-events-none fixed inset-0 -z-10 overflow-hidden">
      <div className="absolute inset-0 bg-bg" />

      <div
        className="absolute -left-[18%] -top-[22%] h-[46rem] w-[46rem] rounded-full blur-[110px] animate-aurora"
        style={{ background: "radial-gradient(circle, var(--glow-1), transparent 66%)" }}
      />
      <div
        className="absolute -right-[16%] top-[8%] h-[38rem] w-[38rem] rounded-full blur-[120px] animate-aurora"
        style={{
          background: "radial-gradient(circle, var(--glow-3), transparent 66%)",
          animationDelay: "-7s",
        }}
      />
      <div
        className="absolute bottom-[-18%] left-[24%] h-[42rem] w-[42rem] rounded-full blur-[130px] animate-aurora"
        style={{
          background: "radial-gradient(circle, var(--glow-2), transparent 66%)",
          animationDelay: "-14s",
        }}
      />

      <div className="grid-bg absolute inset-0" />

      <div
        className="absolute inset-0 opacity-[0.5] mix-blend-overlay dark:opacity-[0.35]"
        style={{
          backgroundImage:
            "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='160' height='160'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='3'/%3E%3C/filter%3E%3Crect width='160' height='160' filter='url(%23n)' opacity='0.32'/%3E%3C/svg%3E\")",
        }}
      />
    </div>
  );
}

/** A soft glow that trails the cursor. Desktop + motion-enabled only. */
export function CursorGlow() {
  const reduced = useReducedMotion();
  const finePointer = useMediaQuery("(hover: hover) and (pointer: fine)");
  const [pos, setPos] = useState({ x: -500, y: -500 });

  useEffect(() => {
    if (reduced || !finePointer) return undefined;
    let frame = 0;
    const onMove = (event) => {
      if (frame) return;
      frame = requestAnimationFrame(() => {
        frame = 0;
        setPos({ x: event.clientX, y: event.clientY });
      });
    };
    window.addEventListener("pointermove", onMove, { passive: true });
    return () => {
      if (frame) cancelAnimationFrame(frame);
      window.removeEventListener("pointermove", onMove);
    };
  }, [reduced, finePointer]);

  if (reduced || !finePointer) return null;

  return (
    <div
      aria-hidden
      className="no-print pointer-events-none fixed inset-0 -z-10 transition-opacity duration-500"
      style={{
        background: `radial-gradient(420px circle at ${pos.x}px ${pos.y}px, color-mix(in oklab, var(--brand) 9%, transparent), transparent 68%)`,
      }}
    />
  );
}
