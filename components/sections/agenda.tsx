import { Reveal } from "@/components/abdev/reveal";
import { Scheduler } from "@/components/abdev/scheduler";

export function Agenda() {
  return (
    <section id="agenda" className="sect">
      <div className="frame">
        <Reveal className="sect-head">
          <div>
            <div className="eyebrow">
              <span className="num">06</span> Agenda
            </div>
            <h2 className="h2">Reserva 30 minutos</h2>
          </div>
          <p className="h2-sub">
            Sin Calendly ni terceros — agenda propia, construida con nuestro
            sistema de diseño y guardada en nuestra infraestructura. Elige el día
            y la hora; te confirmamos al instante.
          </p>
        </Reveal>

        <Reveal>
          <Scheduler />
        </Reveal>
      </div>
    </section>
  );
}
