import { Reveal } from "@/components/abdev/reveal";
import { services } from "@/content/services";

export function Services() {
  return (
    <section id="servicios" className="sect">
      <div className="frame">
        <Reveal className="sect-head">
          <div>
            <div className="eyebrow">
              <span className="num">01</span> Servicios
            </div>
            <h2 className="h2">Software que trabaja por tu negocio</h2>
          </div>
          <p className="h2-sub">
            Cada producto se construye con la misma disciplina técnica que un
            equipo grande, sin la fricción ni los tiempos de uno.
          </p>
        </Reveal>

        <Reveal className="svc-grid" stagger>
          {services.map((s, i) => {
            const Icon = s.icon;
            return (
              <div className="svc" key={s.num} style={{ ["--i" as string]: i }}>
                <div className="svc-num">{s.num}</div>
                <div className="svc-icon">
                  <Icon size={20} strokeWidth={1.8} />
                </div>
                <h3>{s.title}</h3>
                <p>{s.desc}</p>
                <div className="svc-tags">
                  {s.tags.map((t) => (
                    <span
                      key={t.label}
                      className={`tag${t.accent ? " accent" : ""}`}
                    >
                      {t.label}
                    </span>
                  ))}
                </div>
              </div>
            );
          })}
        </Reveal>
      </div>
    </section>
  );
}
