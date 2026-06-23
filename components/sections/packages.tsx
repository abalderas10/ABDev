"use client";

import { useState, type FormEvent } from "react";
import { Reveal } from "@/components/abdev/reveal";
import { waLink } from "@/lib/contact";

const PROJECT_TYPES = [
  "No estoy seguro / quiero asesoría",
  "Landing o sitio sencillo",
  "Sitio multi-página + blog/CMS",
  "Sistema/dashboard con base de datos",
  "Ecosistema completo (web + automatización + agente AI)",
];

export function Packages() {
  const [name, setName] = useState("");
  const [contact, setContact] = useState("");
  const [project, setProject] = useState("");
  const [kind, setKind] = useState("");
  const [status, setStatus] = useState<"idle" | "sending" | "done">("idle");

  const canSend =
    name.trim() !== "" && contact.trim() !== "" && project.trim() !== "";

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!canSend || status === "sending") return;
    setStatus("sending");

    // 1) Best-effort: save the lead to Supabase. Never blocks the UX —
    // WhatsApp below is the guaranteed channel.
    try {
      await fetch("/api/quote", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, contact, project, budget: kind }),
      });
    } catch {
      // ignore network/config errors — we still open WhatsApp
    }

    // 2) Open a pre-filled WhatsApp so the conversation starts immediately.
    const msg =
      "Hola Alberto, quiero una cotización para mi proyecto.\n\n" +
      `▸ Proyecto: ${project.trim()}\n` +
      (kind ? `▸ Tipo: ${kind}\n` : "") +
      `▸ Nombre: ${name.trim()}\n` +
      `▸ Contacto: ${contact.trim()}`;
    window.open(waLink(msg), "_blank", "noopener,noreferrer");

    setStatus("done");
  }

  return (
    <section id="paquetes" className="sect">
      <div className="frame">
        <Reveal className="sect-head">
          <div>
            <div className="eyebrow">
              <span className="num">03</span> Paquetes
            </div>
            <h2 className="h2">Cotización a tu medida</h2>
          </div>
          <p className="h2-sub">
            Cada proyecto es distinto, así que no vendemos precios de catálogo.
            Cuéntanos de qué trata, déjanos tus datos y te enviamos una propuesta
            con alcance y precio — normalmente en menos de 24 horas.
          </p>
        </Reveal>

        <Reveal className="quote-wrap">
          {status === "done" ? (
            <div className="quote-card quote-success">
              <span className="quote-success-mark">✓</span>
              <h3>¡Listo, lo recibimos!</h3>
              <p>
                Abrimos WhatsApp para que termines de enviarlo. Te respondemos
                con una cotización a la medida lo antes posible.
              </p>
              <button
                type="button"
                className="quote-reset"
                onClick={() => {
                  setName("");
                  setContact("");
                  setProject("");
                  setKind("");
                  setStatus("idle");
                }}
              >
                Enviar otro proyecto
              </button>
            </div>
          ) : (
            <form className="quote-card" onSubmit={handleSubmit}>
              <div className="quote-field">
                <label className="quote-label" htmlFor="q-project">
                  ¿De qué trata tu proyecto?
                </label>
                <textarea
                  id="q-project"
                  className="cart-textarea"
                  placeholder="Cuéntanos tu idea: industria, qué necesitas, si ya tienes logo o dominio, funcionalidades…"
                  value={project}
                  onChange={(e) => setProject(e.target.value)}
                  required
                />
              </div>

              <div className="quote-field">
                <label className="quote-label" htmlFor="q-kind">
                  Tipo de proyecto <span className="quote-opt">(opcional)</span>
                </label>
                <select
                  id="q-kind"
                  className="cart-input quote-select"
                  value={kind}
                  onChange={(e) => setKind(e.target.value)}
                >
                  <option value="">Elige una opción…</option>
                  {PROJECT_TYPES.map((t) => (
                    <option key={t} value={t}>
                      {t}
                    </option>
                  ))}
                </select>
              </div>

              <div className="quote-field">
                <label className="quote-label">Tus datos</label>
                <div className="cart-row">
                  <input
                    type="text"
                    className="cart-input"
                    placeholder="Tu nombre"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                  />
                  <input
                    type="text"
                    className="cart-input"
                    placeholder="Email o WhatsApp"
                    value={contact}
                    onChange={(e) => setContact(e.target.value)}
                    required
                  />
                </div>
              </div>

              <button
                type="submit"
                className="quote-submit"
                disabled={!canSend || status === "sending"}
              >
                {status === "sending"
                  ? "Enviando…"
                  : "Enviar y recibir cotización"}
                <span style={{ fontFamily: "var(--mono)" }}>→</span>
              </button>

              <p className="quote-meta">
                Sin compromiso. Respondemos con alcance y precio en &lt; 24 h.
              </p>
            </form>
          )}
        </Reveal>
      </div>
    </section>
  );
}
