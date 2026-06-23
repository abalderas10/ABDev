"use client";

import { Reveal } from "@/components/abdev/reveal";
import { packages } from "@/content/packages";
import { useCart } from "@/components/abdev/cart-context";
import { waLink, WA_MESSAGES } from "@/lib/contact";

export function Packages() {
  const { billing, setBilling, addItem } = useCart();

  return (
    <section id="paquetes" className="sect">
      <div className="frame">
        <Reveal className="sect-head">
          <div>
            <div className="eyebrow">
              <span className="num">03</span> Paquetes
            </div>
            <h2 className="h2">Inversión transparente</h2>
          </div>
          <p className="h2-sub">
            Tres puntos de entrada según tu etapa. Sin letra chica, sin
            sorpresas. Todos incluyen dominio, hosting el primer año y soporte.
          </p>
        </Reveal>

        <Reveal style={{ textAlign: "center" }}>
          <div className="pkg-toggle">
            <button
              className={`pkg-toggle-btn${billing === "once" ? " active" : ""}`}
              onClick={() => setBilling("once")}
            >
              Pago único
            </button>
            <button
              className={`pkg-toggle-btn${billing === "monthly" ? " active" : ""}`}
              onClick={() => setBilling("monthly")}
            >
              Mensualidad · 12 meses
            </button>
          </div>
        </Reveal>

        <Reveal className="pkg-grid" stagger>
          {packages.map((p, i) => (
            <div
              key={p.id}
              className={`pkg-card${p.featured ? " featured" : ""}`}
              style={{ ["--i" as string]: i }}
            >
              {p.badge && <span className="pkg-badge">{p.badge}</span>}
              <div className="pkg-name">{p.name}</div>
              <div className="pkg-tag">{p.tag}</div>
              <div className="pkg-price">
                {p.priceLabel ? (
                  <span className="pkg-amount quote">{p.priceLabel}</span>
                ) : (
                  <>
                    <span className="pkg-curr">MX$</span>
                    <span className="pkg-amount">
                      {billing === "monthly" ? p.priceMonthly : p.priceOnce}
                    </span>
                  </>
                )}
              </div>
              <div className="pkg-note">
                {p.note ??
                  (billing === "monthly" ? p.noteMonthly : p.noteOnce)}
              </div>
              <div className="pkg-divider" />
              <div className="pkg-feat-label">{p.featLabel}</div>
              <ul className="pkg-feats">
                {p.feats.map((f) => (
                  <li className="pkg-feat" key={f}>
                    <span className="pkg-check">✓</span>
                    {f}
                  </li>
                ))}
              </ul>
              {p.ctaType === "cart" ? (
                <button
                  className={`pkg-cta ${p.featured ? "pkg-cta-fill" : "pkg-cta-out"}`}
                  onClick={() =>
                    addItem({
                      id: p.id,
                      name: p.name,
                      priceOnce: p.priceOnce!,
                      priceMonthly: p.priceMonthly!,
                    })
                  }
                >
                  {p.ctaLabel}
                  <span style={{ fontFamily: "var(--mono)" }}>→</span>
                </button>
              ) : (
                <a
                  className="pkg-cta pkg-cta-out"
                  href={waLink(WA_MESSAGES.systemQuote)}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {p.ctaLabel}
                  <span style={{ fontFamily: "var(--mono)" }}>→</span>
                </a>
              )}
            </div>
          ))}
        </Reveal>
      </div>
    </section>
  );
}
