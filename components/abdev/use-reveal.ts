"use client";

import { useEffect, useRef, useState } from "react";

/**
 * IntersectionObserver-based reveal-on-scroll. Adds `visible` once the element
 * scrolls into view (one-shot). Respects prefers-reduced-motion via CSS.
 */
export function useReveal<T extends HTMLElement = HTMLDivElement>(
  threshold = 0.1,
) {
  const ref = useRef<T>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            setVisible(true);
            obs.unobserve(e.target);
          }
        });
      },
      { threshold },
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [threshold]);

  return { ref, visible };
}
