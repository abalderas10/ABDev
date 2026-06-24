"use client";

import { useRef } from "react";
import { waLink, WA_MESSAGES } from "@/lib/contact";
import { useMagnetic } from "@/components/abdev/use-magnetic";

const LINKS = [
  { href: "#servicios", label: "Servicios" },
  { href: "#proyectos", label: "Proyectos" },
  { href: "#paquetes", label: "Paquetes" },
  { href: "#proceso", label: "Proceso" },
  { href: "#agente", label: "Agente AI" },
  { href: "#agenda", label: "Agenda" },
];

export function SiteNav() {
  const ctaRef = useRef<HTMLAnchorElement>(null);
  useMagnetic(ctaRef);

  return (
    <nav>
      <div className="nav-inner">
        <a href="#" className="logo" aria-label="ABDev">
          <span className="logo-mark" aria-hidden="true" />
          <span className="logo-word">
            <span className="logo-ab">AB</span>
            <span className="logo-dev">Dev</span>
          </span>
        </a>
        <ul className="nav-links">
          {LINKS.map((l) => (
            <li key={l.href}>
              <a href={l.href}>{l.label}</a>
            </li>
          ))}
        </ul>
        <a
          ref={ctaRef}
          href={waLink(WA_MESSAGES.startProject)}
          target="_blank"
          rel="noopener noreferrer"
          className="nav-cta"
        >
          Empezar proyecto
          <span className="arrow">→</span>
        </a>
      </div>
    </nav>
  );
}
