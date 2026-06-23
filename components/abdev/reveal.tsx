"use client";

import { type ElementType, type ReactNode } from "react";
import { useReveal } from "./use-reveal";

interface RevealProps {
  children: ReactNode;
  /** Add the stagger behavior to direct children. */
  stagger?: boolean;
  className?: string;
  as?: ElementType;
  style?: React.CSSProperties;
  threshold?: number;
}

/**
 * Wraps content in a `.reveal` container that fades/rises into view.
 * When `stagger` is set, direct children cascade in (the `--i` index var is
 * applied per-child by the parent below).
 */
export function Reveal({
  children,
  stagger = false,
  className = "",
  as: Tag = "div",
  style,
  threshold = 0.1,
}: RevealProps) {
  const { ref, visible } = useReveal<HTMLElement>(threshold);
  const cls = [
    "reveal",
    stagger ? "reveal-stagger" : "",
    visible ? "visible" : "",
    className,
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <Tag ref={ref} className={cls} style={style}>
      {children}
    </Tag>
  );
}
