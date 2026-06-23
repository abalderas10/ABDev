"use client";

import { useEffect, type RefObject } from "react";

/**
 * Attract an element toward the cursor by `strength` (default 0.28x).
 * Disabled on touch devices and when prefers-reduced-motion is set.
 * Drives `--mx` / `--my` CSS vars consumed by the `.btn-primary`/`.nav-cta` rules.
 */
export function useMagnetic(
  ref: RefObject<HTMLElement | null>,
  strength = 0.28,
) {
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    if (window.matchMedia("(hover: none)").matches) return;
    const onMove = (e: MouseEvent) => {
      const r = el.getBoundingClientRect();
      const dx = e.clientX - (r.left + r.width / 2);
      const dy = e.clientY - (r.top + r.height / 2);
      el.style.setProperty("--mx", `${(dx * strength).toFixed(1)}px`);
      el.style.setProperty("--my", `${(dy * strength).toFixed(1)}px`);
    };
    const onLeave = () => {
      el.style.setProperty("--mx", "0px");
      el.style.setProperty("--my", "0px");
    };
    el.addEventListener("mousemove", onMove);
    el.addEventListener("mouseleave", onLeave);
    return () => {
      el.removeEventListener("mousemove", onMove);
      el.removeEventListener("mouseleave", onLeave);
    };
  }, [ref, strength]);
}
