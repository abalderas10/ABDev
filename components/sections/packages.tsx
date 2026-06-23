"use client";

import { useState, type FormEvent, type ReactNode } from "react";
import {
  Bot,
  CalendarCheck,
  CreditCard,
  KeyRound,
  LayoutDashboard,
  ShoppingBag,
  Zap,
} from "lucide-react";
import { Reveal } from "@/components/abdev/reveal";
import { WhatsAppIcon } from "@/components/abdev/icons";
import { waLink } from "@/lib/contact";

interface Capability {
  id: string;
  label: string;
  desc: string;
  icon: ReactNode;
}

const CAPABILITIES: Capability[] = [
  {
    id: "whatsapp-lead",
    label: "Contacto por WhatsApp",
    desc: "Captura de leads directo a tu base de datos.",
    icon: <WhatsAppIcon width={20} height={20} />,
  },
  {
    id: "auth",
    label: "Login social",
    desc: "Acceso con Google, Apple, correo y más.",
    icon: <KeyRound size={20} strokeWidth={1.8} />,
  },
  {
    id: "ai-agent",
    label: "Agente AI",
    desc: "Atiende y responde a tus clientes por ti.",
    icon: <Bot size={20} strokeWidth={1.8} />,
  },
  {
    id: "realtime-edge",
    label: "Realtime + Edge",
    desc: "Datos en vivo y baja latencia global.",
    icon: <Zap size={20} strokeWidth={1.8} />,
  },
  {
    id: "store",
    label: "Tienda en línea",
    desc: "Catálogo, carrito y gestión de pedidos.",
    icon: <ShoppingBag size={20} strokeWidth={1.8} />,
  },
  {
    id: "payments",
    label: "Pagos / Stripe",
    desc: "Cobra en línea, suscripciones y membresías.",
    icon: <CreditCard size={20} strokeWidth={1.8} />,
  },
  {
    id: "scheduling",
    label: "Agendar citas",
    desc: "Reservas, calendario y recordatorios.",
    icon: <CalendarCheck size={20} strokeWidth={1.8} />,
  },
  {
    id: "dashboard",
    label: "Panel / Dashboard",
    desc: "Administra tu operación desde un solo lugar.",
    icon: <LayoutDashboard size={20} strokeWidth={1.8} />,
  },
];

export function Packages() {
  const [name, setName] = useState("");
  const [contact, setContact] = useState("");
  const [project, setProject] = useState("");
  const [kind, setKind] = useState("");
  const [selected, setSelected] = useState<string[]>([]);
  const [status, setStatus] = useState<"idle" | "sending" | "done">("idle");

  const canSend =
    name.trim() !== "" && contact.trim() !== "" && project.trim() !== "";

  function toggle(id: string) {
    setSelected((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id],
    );
  }

  function reset() {
    setName("");
    setContact("");
    setProject("");
    setKind("");
    setSelected([]);
    setStatus("idle");
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!canSend || status === "sending") return;
    setStatus("sending");

    const capLabels = CAPABILITIES.filter((c) => selected.includes(c.id)).map(
      (c) => c.label,
    );

    // 1) Best-effort: save the lead to Supabase. Never blocks the UX —
    // WhatsApp below is the guaranteed channel.
    try {
      await fetch("/api/quote", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          contact,
          project,
          budget: kind,
          capabilities: capLabels,
        }),
      });
    } catch {
      // ignore network/config errors — we still open WhatsApp
    }

    // 2) Open a pre-filled WhatsApp so the conversation starts immediately.
    const msg =
      "Hola Alberto, quiero una cotización para mi proyecto.\n\n" +
      `▸ Proyecto: ${project.trim()}\n` +
      (kind ? `▸ Tipo: ${kind}\n` : "") +
      (capLabels.length
        ? `▸ Capacidades de interés: ${capLabels.join(", ")}\n`
        : "") +
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
            Marca las capacidades que te interesan, cuéntanos tu idea y te
            enviamos una propuesta con alcance y precio — normalmente en menos de
            24 horas.
          </p>
        </Reveal>

        {status !== "done" && (
          <Reveal>
            <div className="cap-head">
              ¿Qué capacidades te interesan?{" "}
              <span className="cap-hint">
                Toca las que te gusten — se marcan con ✓
              </span>
            </div>
            <div className="cap-grid" role="group" aria-label="Capacidades">
              {CAPABILITIES.map((c) => {
                const on = selected.includes(c.id);
                return (
                  <button
                    type="button"
                    key={c.id}
                    className={`cap-card${on ? " on" : ""}`}
                    aria-pressed={on}
                    onClick={() => toggle(c.id)}
                  >
                    <span className="cap-check" aria-hidden={!on}>
                      ✓
                    </span>
                    <span className="cap-icon">{c.icon}</span>
                    <span className="cap-title">{c.label}</span>
                    <span className="cap-desc">{c.desc}</span>
                  </button>
                );
              })}
            </div>
            {selected.length > 0 && (
              <div className="cap-count">
                <span className="d" />
                {selected.length}{" "}
                {selected.length === 1
                  ? "capacidad seleccionada"
                  : "capacidades seleccionadas"}
              </div>
            )}
          </Reveal>
        )}

        <Reveal className="quote-wrap">
          {status === "done" ? (
            <div className="quote-card quote-success">
              <span className="quote-success-mark">✓</span>
              <h3>¡Listo, lo recibimos!</h3>
              <p>
                Abrimos WhatsApp para que termines de enviarlo. Te respondemos
                con una cotización a la medida lo antes posible.
              </p>
              <button type="button" className="quote-reset" onClick={reset}>
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
                  <option value="No estoy seguro / quiero asesoría">
                    No estoy seguro / quiero asesoría
                  </option>
                  <option value="Landing o sitio sencillo">
                    Landing o sitio sencillo
                  </option>
                  <option value="Sitio multi-página + blog/CMS">
                    Sitio multi-página + blog/CMS
                  </option>
                  <option value="Sistema/dashboard con base de datos">
                    Sistema/dashboard con base de datos
                  </option>
                  <option value="Ecosistema completo (web + automatización + agente AI)">
                    Ecosistema completo (web + automatización + agente AI)
                  </option>
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
