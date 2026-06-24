import { ArrowUpRight, Calendar } from "lucide-react";
import { Reveal } from "@/components/abdev/reveal";
import { WhatsAppIcon } from "@/components/abdev/icons";
import { waLink, WA_MESSAGES } from "@/lib/contact";

export function Contact() {
  return (
    <section id="contacto" className="sect">
      <div className="frame">
        <Reveal className="sect-head center">
          <div className="eyebrow">
            <span className="num">07</span> Empezar
          </div>
          <h2 className="h2">¿Tu próximo proyecto?</h2>
          <p className="h2-sub">
            La mejor forma de saber si encajamos es una conversación de 30
            minutos. Sin compromiso, sin presentaciones eternas.
          </p>
        </Reveal>

        <Reveal className="contact-grid" stagger>
          <a
            href={waLink(WA_MESSAGES.talkProject)}
            target="_blank"
            rel="noopener noreferrer"
            className="contact-card"
            style={{ ["--i" as string]: 0 }}
          >
            <span className="arrow-top">
              <ArrowUpRight size={14} strokeWidth={2} />
            </span>
            <div className="contact-icon wa">
              <WhatsAppIcon width={22} height={22} />
            </div>
            <h3>WhatsApp directo</h3>
            <p>
              La forma más rápida. Cuéntame tu idea y te respondo el mismo día
              con preguntas concretas.
            </p>
            <span className="contact-availability">
              <span className="d" />
              Respondo en &lt; 2 horas hábiles
            </span>
          </a>

          <a
            href="#agenda"
            className="contact-card"
            style={{ ["--i" as string]: 1 }}
          >
            <span className="arrow-top">
              <ArrowUpRight size={14} strokeWidth={2} />
            </span>
            <div className="contact-icon cal">
              <Calendar size={22} strokeWidth={2} />
            </div>
            <h3>Agendar 30 min</h3>
            <p>
              Sesión de descubrimiento. Analizamos tu negocio y definimos juntos
              la mejor solución técnica.
            </p>
            <span className="contact-availability">
              <span className="d" />
              Lun – Vie · 10:00 – 18:00 CDMX
            </span>
          </a>
        </Reveal>
      </div>
    </section>
  );
}
