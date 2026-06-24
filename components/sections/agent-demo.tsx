"use client";

import { useEffect, useRef, useState } from "react";
import {
  BrainCircuit,
  Mic,
  Smartphone,
  Workflow,
  MessageSquare,
  Calendar,
  Database,
  Users,
  Mail,
  CreditCard,
  Phone,
  Check,
  ArrowUp,
} from "lucide-react";
import { Reveal } from "@/components/abdev/reveal";
import { WhatsAppIcon } from "@/components/abdev/icons";
import {
  WA_NUMBER_INTL,
  waLink,
  smsLink,
  mailtoLink,
} from "@/lib/contact";

type View = "chat" | "voice" | "channels" | "systems";

interface ChatMsg {
  role: "user" | "assistant";
  content: string;
  greeting?: boolean;
}

const FEATURES: {
  view: View;
  icon: typeof BrainCircuit;
  title: string;
  desc: string;
}[] = [
  {
    view: "chat",
    icon: BrainCircuit,
    title: "Entrenado con tu negocio",
    desc: "Responde con tus productos, precios, políticas y tono de marca, no con info genérica.",
  },
  {
    view: "voice",
    icon: Mic,
    title: "Chat y voz natural",
    desc: "Conversa por texto o por voz en español, directo en el navegador — sin instalar nada.",
  },
  {
    view: "channels",
    icon: Smartphone,
    title: "Donde están tus clientes",
    desc: "Web, WhatsApp, app móvil o widget embebible. El mismo agente, en cualquier canal.",
  },
  {
    view: "systems",
    icon: Workflow,
    title: "Conectado a tus sistemas",
    desc: "Agenda citas, guarda leads en tu base de datos, manda correos y avisa por WhatsApp. Acciones reales.",
  },
];

const CHIPS = [
  { label: "Ver proyectos", text: "¿Qué proyectos han desarrollado?" },
  { label: "Precios", text: "¿Cuánto cuesta un sitio?" },
  { label: "Agentes AI", text: "¿Cómo funciona un agente AI?" },
  { label: "Iniciar", text: "Quiero iniciar un proyecto" },
];

const SYS_ITEMS = [
  {
    icon: Calendar,
    title: "Cita agendada · mié 28 may, 3:00 pm",
    sub: "Reunión de descubrimiento creada",
    tool: "Agenda propia",
  },
  {
    icon: Database,
    title: "Lead guardado en la base de datos",
    sub: "Contacto + intención + presupuesto registrados",
    tool: "Supabase",
  },
  {
    icon: Mail,
    title: "Email de confirmación enviado",
    sub: "Resumen + liga de la reunión al cliente",
    tool: "Gmail",
  },
  {
    icon: CreditCard,
    title: "Anticipo $7,500 MXN cobrado",
    sub: "Pago seguro, factura emitida",
    tool: "Stripe",
  },
  {
    icon: WhatsAppIcon,
    title: "Confirmación enviada por WhatsApp",
    sub: "El cliente recibe todo en su chat",
    tool: "Twilio",
  },
];

const GREETING: ChatMsg = {
  role: "assistant",
  greeting: true,
  content:
    "Hola, soy el agente de ABDev. Conozco todos los proyectos, paquetes y procesos del estudio. ¿Qué quieres saber?",
};

export function AgentDemo() {
  const [view, setView] = useState<View>("chat");
  const [messages, setMessages] = useState<ChatMsg[]>([GREETING]);
  const [input, setInput] = useState("");
  const [sending, setSending] = useState(false);
  const streamRef = useRef<HTMLDivElement>(null);

  // Voice state
  const [voiceStatus, setVoiceStatus] = useState("Toca para hablar");
  const [voiceTranscript, setVoiceTranscript] = useState("");
  const [listening, setListening] = useState(false);
  const voiceRef = useRef<{ rec: SpeechRecognition | null; on: boolean }>({
    rec: null,
    on: false,
  });
  const demoTimer = useRef<ReturnType<typeof setTimeout>>(null);

  // Channels state
  const [chanPhone, setChanPhone] = useState("");
  const [chanEmail, setChanEmail] = useState("");
  const [chanStatus, setChanStatus] = useState("");

  // Systems feed
  const [sysIn, setSysIn] = useState(0);

  useEffect(() => {
    const el = streamRef.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, [messages]);

  // Stop voice when leaving the voice view.
  useEffect(() => {
    if (view !== "voice") stopVoice();
    if (view === "systems") {
      setSysIn(0);
      const timers = SYS_ITEMS.map((_, i) =>
        setTimeout(() => setSysIn((n) => Math.max(n, i + 1)), 250 + i * 520),
      );
      return () => timers.forEach(clearTimeout);
    }
  }, [view]);

  // ─── Chat ───
  async function send(text: string) {
    const msg = text.trim();
    if (!msg || sending) return;
    setInput("");
    const history = [...messages, { role: "user" as const, content: msg }];
    setMessages(history);
    setSending(true);
    // Append an empty assistant message we stream into.
    setMessages((m) => [...m, { role: "assistant", content: "" }]);

    try {
      const res = await fetch("/api/agent", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: history.map((h) => ({ role: h.role, content: h.content })),
        }),
      });
      if (!res.body) throw new Error("no body");
      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let acc = "";
      for (;;) {
        const { done, value } = await reader.read();
        if (done) break;
        acc += decoder.decode(value, { stream: true });
        setMessages((m) => {
          const copy = [...m];
          copy[copy.length - 1] = { role: "assistant", content: acc };
          return copy;
        });
      }
    } catch {
      setMessages((m) => {
        const copy = [...m];
        copy[copy.length - 1] = {
          role: "assistant",
          content:
            "Hubo un error de conexión. Escríbeme directamente por WhatsApp: wa.me/" +
            WA_NUMBER_INTL,
        };
        return copy;
      });
    } finally {
      setSending(false);
    }
  }

  // ─── Voice ───
  function stopVoice() {
    voiceRef.current.on = false;
    try {
      voiceRef.current.rec?.stop();
    } catch {
      /* noop */
    }
    try {
      window.speechSynthesis?.cancel();
    } catch {
      /* noop */
    }
    if (demoTimer.current) clearTimeout(demoTimer.current);
    setVoiceTranscript("");
    setListening(false);
    setVoiceStatus("Toca para hablar");
  }

  function speak(text: string) {
    try {
      speechSynthesis.cancel();
      const u = new SpeechSynthesisUtterance(text);
      u.lang = "es-MX";
      u.rate = 1.05;
      u.onend = () => {
        setListening(false);
        setVoiceStatus("Toca para hablar");
      };
      speechSynthesis.speak(u);
    } catch {
      setListening(false);
      setVoiceStatus("Toca para hablar");
    }
  }

  async function askVoice(text: string) {
    setVoiceStatus("Pensando…");
    try {
      const res = await fetch("/api/agent", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          mode: "voice",
          messages: [{ role: "user", content: text }],
        }),
      });
      const reply = await res.text();
      setVoiceStatus("Respondiendo…");
      speak(reply);
    } catch {
      speak("Hubo un error de conexión. Escríbeme por WhatsApp.");
    }
  }

  function voiceDemo() {
    if (voiceRef.current.on) {
      stopVoice();
      return;
    }
    voiceRef.current.on = true;
    setListening(true);
    setVoiceStatus("Escuchando… (demo)");
    setVoiceTranscript("“¿Cuánto cuesta un sitio con agente AI?”");
    demoTimer.current = setTimeout(() => {
      setVoiceStatus("Respondiendo…");
      setListening(false);
      speak(
        "Depende del alcance. Un ecosistema completo con agente de inteligencia artificial arranca alrededor de los noventa mil pesos. ¿Quieres que cotice el tuyo?",
      );
      voiceRef.current.on = false;
    }, 1900);
  }

  function toggleVoice() {
    const SR =
      (window as unknown as { SpeechRecognition?: typeof SpeechRecognition })
        .SpeechRecognition ||
      (
        window as unknown as {
          webkitSpeechRecognition?: typeof SpeechRecognition;
        }
      ).webkitSpeechRecognition;
    if (!SR) return voiceDemo();
    if (voiceRef.current.on) {
      stopVoice();
      return;
    }
    const rec = new SR();
    rec.lang = "es-MX";
    rec.interimResults = true;
    rec.continuous = false;
    voiceRef.current = { rec, on: true };
    setVoiceTranscript("");
    setListening(true);
    setVoiceStatus("Escuchando…");
    let finalText = "";
    rec.onresult = (e: SpeechRecognitionEvent) => {
      let s = "";
      for (let i = 0; i < e.results.length; i++) s += e.results[i][0].transcript;
      finalText = s;
      setVoiceTranscript("“" + s + "”");
    };
    rec.onerror = () => {
      voiceRef.current.on = false;
      setListening(false);
      setVoiceStatus("No te escuché, toca para reintentar");
    };
    rec.onend = () => {
      voiceRef.current.on = false;
      setListening(false);
      const text = finalText.trim();
      if (!text) {
        setVoiceStatus("Toca para hablar");
        return;
      }
      askVoice(text);
    };
    try {
      rec.start();
    } catch {
      voiceDemo();
    }
  }

  // ─── Channels ───
  const chanDigits = () => chanPhone.replace(/\D/g, "");
  function chanWhatsApp() {
    window.open(
      waLink(
        "Hola ABDev, vi la demo del agente AI y quiero información del servicio de desarrollo web.",
      ),
      "_blank",
    );
  }
  function chanSMS() {
    window.location.href = smsLink(
      "Hola ABDev, quiero info del servicio de desarrollo web y agente AI.",
    );
  }
  function chanEmailFn() {
    window.location.href = mailtoLink(
      "Quiero un sitio con agente AI — ABDev",
      `Hola Alberto,\n\nVi la demo del agente AI en el sitio de ABDev y me interesa el servicio de desarrollo web.\n\nMi correo: ${chanEmail.trim()}\n`,
    );
  }
  async function chanCall() {
    const phone = chanDigits();
    if (phone.length < 10) {
      setChanStatus("⚠ Escribe tu teléfono a 10 dígitos para que te contactemos.");
      return;
    }
    setChanStatus("📞 Registrando tu solicitud…");
    try {
      const res = await fetch("/api/notify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          phone,
          email: chanEmail.trim() || undefined,
          kind: "Solicita llamada del agente AI",
        }),
      });
      const data = (await res.json().catch(() => ({}))) as { ok?: boolean };
      setChanStatus(
        data?.ok
          ? "✓ Recibido · te contactamos al " + phone + " muy pronto."
          : "✓ Anotado · te contactamos al " + phone + " muy pronto.",
      );
    } catch {
      setChanStatus("✓ Anotado · te contactamos al " + phone + " muy pronto.");
    }
  }

  const SegToggle = ({ active }: { active: View }) => (
    <div className="seg">
      <button
        className={active === "chat" ? "active" : ""}
        onClick={() => setView("chat")}
      >
        <MessageSquare strokeWidth={2} />
        Chat
      </button>
      <button
        className={active === "voice" ? "active" : ""}
        onClick={() => setView("voice")}
      >
        <Mic strokeWidth={2} />
        Voz
      </button>
    </div>
  );

  return (
    <section id="agente" className="sect">
      <div className="frame">
        <Reveal className="sect-head">
          <div>
            <div className="eyebrow">
              <span className="num">05</span> Agente AI en vivo
            </div>
            <h2 className="h2">
              Esto no es una demo.
              <br />
              Es producto real.
            </h2>
          </div>
          <p className="h2-sub">
            El chat de abajo conoce ABDev de memoria. Pregúntale por precios,
            proyectos o cómo construir uno para tu negocio.
          </p>
        </Reveal>

        <Reveal className="agent-layout">
          <div className="agent-pitch">
            {FEATURES.map((f) => {
              const Icon = f.icon;
              return (
                <button
                  key={f.view}
                  className={`agent-feature is-tab${view === f.view ? " active" : ""}`}
                  onClick={() => setView(f.view)}
                >
                  <div className="agent-feature-icon">
                    <Icon size={16} strokeWidth={1.8} />
                  </div>
                  <div>
                    <h4>{f.title}</h4>
                    <p>{f.desc}</p>
                  </div>
                </button>
              );
            })}
          </div>

          <div className="product">
            {/* VIEW 1 · Chat */}
            <div
              className={`agent-view view-split${view === "chat" ? " active" : ""}`}
            >
              <aside className="product-side">
                <div className="product-brand">
                  <span className="product-brand-mark">AB</span>
                  <div className="product-brand-info">
                    <span className="product-brand-name">Agente ABDev</span>
                    <span className="product-brand-tag">v2.1 · sonnet</span>
                  </div>
                </div>
                <div className="side-label">Conversaciones</div>
                <div className="side-item active">
                  <MessageSquare strokeWidth={2} />
                  Demo en vivo
                </div>
                <div className="side-item">
                  <MessageSquare strokeWidth={2} />
                  Casos de éxito
                </div>
                <div className="side-item">
                  <MessageSquare strokeWidth={2} />
                  Cotizar proyecto
                </div>
                <div className="side-label" style={{ marginTop: 14 }}>
                  Capacidades
                </div>
                <div className="side-item">
                  <Calendar strokeWidth={2} />
                  Agendar Cal.com
                  <span className="count">on</span>
                </div>
                <div className="side-item">
                  <Database strokeWidth={2} />
                  Buscar proyectos
                  <span className="count">on</span>
                </div>
                <div className="side-item">
                  <Users strokeWidth={2} />
                  Calificar lead
                  <span className="count">on</span>
                </div>
              </aside>

              <div className="product-main">
                <div className="product-head">
                  <div className="product-head-l">
                    <span className="product-head-title">Demo en vivo</span>
                    <span className="product-head-meta">· conversación #1284</span>
                  </div>
                  <SegToggle active="chat" />
                </div>

                <div className="chat-stream" ref={streamRef}>
                  {messages.map((m, i) => (
                    <div key={i}>
                      <div className={`msg-row${m.role === "user" ? " you" : ""}`}>
                        {m.role === "user" ? (
                          <>
                            <div className="msg-bubble">{m.content}</div>
                            <div className="msg-avatar you">TÚ</div>
                          </>
                        ) : (
                          <>
                            <div className="msg-avatar">AB</div>
                            <div>
                              <div className="msg-bubble">
                                {m.greeting ? (
                                  <>
                                    Hola, soy el agente de{" "}
                                    <strong>ABDev</strong>. Conozco todos los
                                    proyectos, paquetes y procesos del estudio.
                                    ¿Qué quieres saber?
                                  </>
                                ) : m.content ? (
                                  m.content
                                ) : (
                                  <span
                                    style={{
                                      color: "var(--ink-muted)",
                                      letterSpacing: "3px",
                                    }}
                                  >
                                    ···
                                  </span>
                                )}
                              </div>
                              {m.greeting && (
                                <div className="msg-tools">
                                  <span className="msg-tool">
                                    <span className="ok">●</span>knowledge-base
                                  </span>
                                  <span className="msg-tool">
                                    <span className="ok">●</span>cal.com
                                  </span>
                                  <span className="msg-tool">
                                    <span className="ok">●</span>whatsapp
                                  </span>
                                </div>
                              )}
                            </div>
                          </>
                        )}
                      </div>
                      {m.greeting && (
                        <div className="chips-row">
                          {CHIPS.map((c) => (
                            <span
                              key={c.label}
                              className="chip"
                              onClick={() => send(c.text)}
                            >
                              {c.label}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                </div>

                <div className="product-input-area">
                  <div className="product-input-wrap">
                    <input
                      type="text"
                      className="product-input"
                      placeholder="Pregunta lo que quieras…"
                      value={input}
                      onChange={(e) => setInput(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") send(input);
                      }}
                    />
                    <button
                      className="product-send"
                      onClick={() => send(input)}
                      disabled={sending}
                      aria-label="Enviar"
                    >
                      <ArrowUp size={14} strokeWidth={2.4} />
                    </button>
                  </div>
                  <div className="product-foot">
                    <div className="l">
                      <span>↵ Enter para enviar</span>
                      <span>·</span>
                      <span>Sonnet 4 · 64k context</span>
                    </div>
                    <div>Encriptado · MX</div>
                  </div>
                </div>
              </div>
            </div>

            {/* VIEW 2 · Voz */}
            <div
              className={`agent-view view-full${view === "voice" ? " active" : ""}`}
            >
              <div className="av-head">
                <div className="av-head-l">
                  <span className="av-head-title">Agente de voz</span>
                  <span className="av-head-meta">· conversación en tiempo real</span>
                </div>
                <SegToggle active="voice" />
              </div>
              <div className="voice-stage">
                <button
                  className={`voice-orb${listening ? " listening" : ""}`}
                  onClick={toggleVoice}
                  aria-label="Hablar con el agente"
                >
                  <Mic strokeWidth={1.8} />
                </button>
                <div className="voice-status">{voiceStatus}</div>
                <div className="voice-transcript">{voiceTranscript}</div>
                <div className="voice-hint">
                  Presíonalo y pregúntale por precios, proyectos o agenda una
                  llamada. Te responde con voz, en español.
                </div>
              </div>
              <div className="voice-foot">
                <span>Síntesis de voz en el navegador</span>
                <span>es-MX</span>
              </div>
            </div>

            {/* VIEW 3 · Multicanal */}
            <div
              className={`agent-view view-full${view === "channels" ? " active" : ""}`}
            >
              <div className="av-head">
                <div className="av-head-l">
                  <span className="av-head-title">
                    El mismo agente, en todos lados
                  </span>
                </div>
                <span className="live-pill">
                  <span className="d" />
                  Multicanal
                </span>
              </div>
              <div className="chan-stage">
                <p className="chan-intro">
                  Tu cliente elige el canal — el agente es el mismo y conoce todo
                  tu negocio. Deja tus datos y recibe una demostración por donde
                  prefieras.
                </p>
                <div className="chan-tags">
                  {["WhatsApp", "SMS", "Email", "Web widget", "Llamada AI"].map(
                    (t) => (
                      <span className="chan-tag" key={t}>
                        <span className="dot" />
                        {t}
                      </span>
                    ),
                  )}
                </div>
                <div className="chan-fields">
                  <div>
                    <div className="chan-flabel">
                      Teléfono · WhatsApp / SMS / llamada
                    </div>
                    <input
                      className="chan-input"
                      type="tel"
                      inputMode="tel"
                      placeholder="55 1234 5678"
                      value={chanPhone}
                      onChange={(e) => setChanPhone(e.target.value)}
                    />
                  </div>
                  <div>
                    <div className="chan-flabel">Email</div>
                    <input
                      className="chan-input"
                      type="email"
                      placeholder="tu@empresa.com"
                      value={chanEmail}
                      onChange={(e) => setChanEmail(e.target.value)}
                    />
                  </div>
                </div>
                <div className="chan-ctas">
                  <button className="chan-cta wa" onClick={chanWhatsApp}>
                    <WhatsAppIcon />
                    WhatsApp
                  </button>
                  <button className="chan-cta" onClick={chanSMS}>
                    <MessageSquare strokeWidth={1.8} />
                    SMS
                  </button>
                  <button className="chan-cta" onClick={chanEmailFn}>
                    <Mail strokeWidth={1.8} />
                    Email
                  </button>
                  <button className="chan-cta call" onClick={chanCall}>
                    <Phone strokeWidth={1.8} />
                    Recibir llamada del agente AI
                  </button>
                </div>
                <div className="chan-status">{chanStatus}</div>
                <p className="chan-note">
                  Demostración del servicio de desarrollo de ABDev. WhatsApp, SMS
                  y email abren tu app con un mensaje listo; la llamada AI deja tu
                  número en cola para contactarte.
                </p>
              </div>
            </div>

            {/* VIEW 4 · Sistemas */}
            <div
              className={`agent-view view-full${view === "systems" ? " active" : ""}`}
            >
              <div className="av-head">
                <div className="av-head-l">
                  <span className="av-head-title">Acciones reales</span>
                  <span className="av-head-meta">· no solo responde, ejecuta</span>
                </div>
                <span className="live-pill">
                  <span className="d" />
                  Ejemplo
                </span>
              </div>
              <div className="sys-stage">
                <p className="sys-intro">
                  Cuando lo conectamos a tus sistemas, el agente dispara el flujo
                  completo solo. Así se ve un cierre de principio a fin:
                </p>
                <div className="sys-feed">
                  {SYS_ITEMS.map((item, i) => {
                    const Icon = item.icon;
                    return (
                      <div
                        key={i}
                        className={`sys-item${i < sysIn ? " in" : ""}`}
                      >
                        <span className="sys-ico">
                          <Icon strokeWidth={1.8} />
                        </span>
                        <div className="sys-txt">
                          <div className="t">{item.title}</div>
                          <div className="s">{item.sub}</div>
                        </div>
                        <span className="sys-tool">{item.tool}</span>
                        <span className="sys-check">
                          <Check strokeWidth={3} />
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
              <div className="sys-foot">
                {["Supabase", "Gmail", "Twilio", "Next.js", "Vercel", "Stripe"].map(
                  (c) => (
                    <span className="sys-chip" key={c}>
                      {c}
                    </span>
                  ),
                )}
              </div>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
