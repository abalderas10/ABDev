"use client";

import { useEffect, useRef, useState } from "react";
import { Check } from "lucide-react";
import { waLink, WA_MESSAGES } from "@/lib/contact";
import { useMagnetic } from "@/components/abdev/use-magnetic";
import { WhatsAppIcon } from "@/components/abdev/icons";

const SCENES = [
  {
    pill: "Disponible · Q2 2026",
    meta: "CDMX · MX",
    title: (
      <>
        Ideas que se
        <br />
        <span className="accent">compilan</span>
        <br />
        <em>en negocio.</em>
      </>
    ),
    sub: "Estudio de desarrollo web que diseña, construye y opera productos digitales en producción. Next.js, Supabase, agentes AI y la disciplina técnica para que tu negocio crezca en línea.",
  },
  {
    pill: "Hacemos equipo contigo",
    meta: "De brief a producción",
    title: (
      <>
        Tu visión,
        <br />
        nuestro <span className="accent">código</span>,<br />
        <em>el mismo equipo.</em>
      </>
    ),
    sub: "No somos un proveedor que entrega y desaparece. Entendemos tu negocio, decidimos la arquitectura contigo y operamos el producto después del lanzamiento — porque construimos para que dure.",
  },
  {
    pill: "Tráenos una idea",
    meta: "La aterrizamos contigo",
    title: (
      <>
        Construyamos
        <br />
        lo que <span className="accent">imaginas</span>,<br />
        <em>paso a paso.</em>
      </>
    ),
    sub: "Una idea en servilleta, un brief de veinte páginas o un problema que aún no tiene forma. Lo conversamos, definimos un alcance honesto y arrancamos a iterar en días — no en meses.",
  },
];

const TERM_LINES: { ln: string; html: string }[] = [
  { ln: "1", html: '<span class="cm">// app/page.tsx — production build</span>' },
  {
    ln: "2",
    html: '<span class="kw">import</span> <span class="op">{</span> <span class="nm">Stack</span> <span class="op">}</span> <span class="kw">from</span> <span class="str">\'@abdev/core\'</span>',
  },
  {
    ln: "3",
    html: '<span class="kw">import</span> <span class="op">{</span> <span class="nm">AgentAI</span> <span class="op">}</span> <span class="kw">from</span> <span class="str">\'@abdev/agent\'</span>',
  },
  { ln: "4", html: "&nbsp;" },
  {
    ln: "5",
    html: '<span class="kw">export default</span> <span class="kw">async function</span> <span class="fn">build</span>(<span class="vr">brief</span>) <span class="op">{</span>',
  },
  {
    ln: "6",
    html: '<span class="indent1"><span class="kw">const</span> <span class="vr">stack</span> = <span class="kw">await</span> <span class="fn">Stack</span>.<span class="fn">from</span>(<span class="vr">brief</span>)</span>',
  },
  { ln: "7", html: '<span class="indent1"><span class="kw">return</span> <span class="op">{</span></span>' },
  {
    ln: "8",
    html: '<span class="indent2"><span class="pr">framework</span>: <span class="str">\'Next.js 15\'</span>,</span>',
  },
  {
    ln: "9",
    html: '<span class="indent2"><span class="pr">database</span>:&nbsp; <span class="str">\'Supabase\'</span>,</span>',
  },
  {
    ln: "10",
    html: '<span class="indent2"><span class="pr">agent</span>:&nbsp;&nbsp;&nbsp; <span class="fn">AgentAI</span>(<span class="vr">brief</span>),</span>',
  },
  {
    ln: "11",
    html: '<span class="indent2"><span class="pr">deploy</span>:&nbsp;&nbsp; <span class="str">\'vercel\'</span></span>',
  },
  { ln: "12", html: '<span class="indent1"><span class="op">}</span></span>' },
  { ln: "13", html: '<span class="op">}</span>' },
];

function HeroTerminal() {
  const bodyRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const body = bodyRef.current;
    if (!body) return;

    let currentLine = 0;
    let currentChar = 0;
    let typedHtml = "";
    let timer: ReturnType<typeof setTimeout>;
    let stopped = false;

    const render = () => {
      let out = "";
      for (let i = 0; i < currentLine; i++) {
        out += `<div class="term-line"><span class="ln">${TERM_LINES[i].ln}</span><span>${TERM_LINES[i].html}</span></div>`;
      }
      if (currentLine < TERM_LINES.length) {
        out += `<div class="term-line"><span class="ln">${TERM_LINES[currentLine].ln}</span><span>${typedHtml}<span class="caret"></span></span></div>`;
      }
      body.innerHTML = out;
    };

    const typeNext = () => {
      if (stopped) return;
      if (currentLine >= TERM_LINES.length) {
        timer = setTimeout(() => {
          currentLine = 0;
          currentChar = 0;
          typedHtml = "";
          render();
          timer = setTimeout(typeNext, 600);
        }, 4500);
        return;
      }
      const line = TERM_LINES[currentLine];
      if (currentChar >= line.html.length) {
        currentLine++;
        currentChar = 0;
        typedHtml = "";
        render();
        timer = setTimeout(typeNext, 80 + Math.random() * 80);
        return;
      }
      if (line.html[currentChar] === "<") {
        const end = line.html.indexOf(">", currentChar);
        typedHtml += line.html.substring(currentChar, end + 1);
        currentChar = end + 1;
        render();
        timer = setTimeout(typeNext, 4);
      } else {
        typedHtml += line.html[currentChar];
        currentChar++;
        render();
        const delay = line.html[currentChar - 1] === " " ? 16 : 18 + Math.random() * 30;
        timer = setTimeout(typeNext, delay);
      }
    };

    const obs = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            typeNext();
            obs.disconnect();
          }
        });
      },
      { threshold: 0.2 },
    );
    obs.observe(body);

    return () => {
      stopped = true;
      clearTimeout(timer);
      obs.disconnect();
    };
  }, []);

  return <div className="term-body" ref={bodyRef} />;
}

export function Hero() {
  const [idx, setIdx] = useState(0);
  const heroRef = useRef<HTMLElement>(null);
  const glowRef = useRef<HTMLDivElement>(null);
  const ctaRef = useRef<HTMLAnchorElement>(null);
  const pausedRef = useRef(false);
  useMagnetic(ctaRef);

  // Rotating scenes (7s crossfade, pause on hover, respect reduced-motion).
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const id = setInterval(() => {
      if (!pausedRef.current && !document.hidden) {
        setIdx((i) => (i + 1) % SCENES.length);
      }
    }, 7000);
    return () => clearInterval(id);
  }, []);

  // Aurora glow follows cursor with lerp (only within hero).
  useEffect(() => {
    const hero = heroRef.current;
    const glow = glowRef.current;
    if (!hero || !glow) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const r0 = hero.getBoundingClientRect();
    let mx = r0.width * 0.82;
    let my = r0.height * 0.18;
    let cx = mx;
    let cy = my;
    let raf = 0;
    const onMove = (e: MouseEvent) => {
      const r = hero.getBoundingClientRect();
      mx = e.clientX - r.left;
      my = e.clientY - r.top;
    };
    const onLeave = () => {
      const r = hero.getBoundingClientRect();
      mx = r.width * 0.82;
      my = r.height * 0.18;
    };
    const tick = () => {
      cx += (mx - cx) * 0.05;
      cy += (my - cy) * 0.05;
      glow.style.transform = `translate3d(${cx.toFixed(1)}px, ${cy.toFixed(1)}px, 0) translate(-50%, -50%)`;
      raf = requestAnimationFrame(tick);
    };
    hero.addEventListener("mousemove", onMove);
    hero.addEventListener("mouseleave", onLeave);
    glow.style.transform = `translate3d(${cx}px, ${cy}px, 0) translate(-50%, -50%)`;
    tick();
    return () => {
      cancelAnimationFrame(raf);
      hero.removeEventListener("mousemove", onMove);
      hero.removeEventListener("mouseleave", onLeave);
    };
  }, []);

  return (
    <section
      id="hero"
      ref={heroRef}
      onMouseEnter={() => (pausedRef.current = true)}
      onMouseLeave={() => (pausedRef.current = false)}
    >
      <div className="hero-glow" ref={glowRef} />
      <div className="frame">
        <div className="hero-inner">
          <div>
            <div className="hero-stack">
              {SCENES.map((s, i) => (
                <div
                  key={i}
                  className={`hero-scene${i === idx ? " is-active" : ""}`}
                  data-scene={i}
                >
                  <div className="hero-meta">
                    <span className="pill">
                      <span className="pill-dot" />
                      {s.pill}
                    </span>
                    <span className="hero-meta-sep" />
                    <span>{s.meta}</span>
                  </div>
                  <h1 className="hero-h1">{s.title}</h1>
                  <p className="hero-sub">{s.sub}</p>
                </div>
              ))}
            </div>

            <div className="hero-dots" role="tablist" aria-label="Mensajes del estudio">
              {SCENES.map((_, i) => (
                <button
                  key={i}
                  className={`hero-dot${i === idx ? " is-active" : ""}`}
                  type="button"
                  role="tab"
                  aria-label={`Mensaje ${i + 1}`}
                  aria-selected={i === idx}
                  onClick={() => setIdx(i)}
                />
              ))}
            </div>

            <div className="hero-ctas">
              <a
                ref={ctaRef}
                href={waLink(WA_MESSAGES.startProject)}
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-primary"
              >
                <WhatsAppIcon width={14} height={14} />
                Iniciar proyecto
              </a>
              <a href="#proyectos" className="btn btn-ghost">
                Ver casos
                <span className="arrow">↗</span>
              </a>
            </div>

            <div className="hero-trust">
              <span className="hero-trust-label">Confían</span>
              <span className="hero-trust-item">Capitalta</span>
              <span className="hero-trust-item">Cárnicos Gustavo</span>
              <span className="hero-trust-item">Itzaé Tulum</span>
              <span className="hero-trust-item">Villa Galeón</span>
              <span className="hero-trust-item">Growth BDM</span>
            </div>
          </div>

          <div className="terminal-stack">
            <div className="float-chip chip-1">
              <span style={{ color: "var(--success)", fontSize: "8px" }}>●</span>
              deploy · vercel · prod
            </div>
            <div className="float-chip chip-2">
              <Check size={12} style={{ color: "var(--accent-2)" }} />
              build passed in 12.4s
            </div>

            <div className="terminal">
              <div className="term-bar">
                <span className="term-dot td-r" />
                <span className="term-dot td-y" />
                <span className="term-dot td-g" />
                <span className="term-tab">
                  <span className="term-tab-dot" />
                  app/page.tsx
                  <span className="term-tab-x">×</span>
                </span>
                <span className="term-status">● Auto-save</span>
              </div>
              <HeroTerminal />
            </div>

            <div className="term-output">
              <div className="term-output-head">
                <div className="left">
                  <span className="out-dot" />
                  <span>Production · live</span>
                </div>
                <div>vercel.app · 200 OK</div>
              </div>
              <div className="term-output-body">
                <div className="out-cell">
                  <div className="out-label">Lighthouse</div>
                  <div className="out-value accent">
                    98<span className="unit">/100</span>
                  </div>
                </div>
                <div className="out-cell">
                  <div className="out-label">TTFB</div>
                  <div className="out-value">
                    142<span className="unit">ms</span>
                  </div>
                </div>
                <div className="out-cell">
                  <div className="out-label">Uptime</div>
                  <div className="out-value">
                    99.9<span className="unit">%</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
