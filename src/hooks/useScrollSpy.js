import { useEffect, useState } from "react";

/**
 * Tracks which section is currently in the viewport.
 * Uses scroll position rather than IntersectionObserver so that short
 * sections at the very bottom of the page still win the highlight.
 */
export function useScrollSpy(ids, offset = 140) {
  const [active, setActive] = useState(ids[0]);

  useEffect(() => {
    if (!ids.length) return undefined;

    let frame = 0;

    const measure = () => {
      frame = 0;
      const scrollY = window.scrollY;
      const atBottom = window.innerHeight + scrollY >= document.body.scrollHeight - 4;

      if (atBottom) {
        setActive(ids[ids.length - 1]);
        return;
      }

      let current = ids[0];
      for (const id of ids) {
        const el = document.getElementById(id);
        if (!el) continue;
        if (el.getBoundingClientRect().top - offset <= 0) current = id;
      }
      setActive(current);
    };

    const onScroll = () => {
      if (frame) return;
      frame = window.requestAnimationFrame(measure);
    };

    measure();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      if (frame) window.cancelAnimationFrame(frame);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, [ids, offset]);

  return active;
}
