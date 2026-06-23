import {
  waLink,
  WA_NUMBER_INTL,
  WA_MESSAGES,
  CAL_LINK,
  PERSONAL_EMAIL,
} from "@/lib/contact";

export function SiteFooter() {
  return (
    <footer>
      <div className="frame">
        <div className="footer-grid">
          <div className="footer-brand">
            <h4>
              Hagamos algo
              <br />
              que valga la pena.
            </h4>
            <p>
              ABDEV es el estudio de Alberto Balderas. Desarrollo web, sistemas y
              agentes AI desde Ciudad de México.
            </p>
            <a
              href={waLink(WA_MESSAGES.startProject)}
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-light"
              style={{ fontSize: "13px", padding: "10px 18px" }}
            >
              Empezar conversación
              <span className="arrow">→</span>
            </a>
          </div>
          <div className="footer-col">
            <div className="footer-col-label">Estudio</div>
            <ul>
              <li>
                <a href="#servicios">Servicios</a>
              </li>
              <li>
                <a href="#proyectos">Proyectos</a>
              </li>
              <li>
                <a href="#paquetes">Paquetes</a>
              </li>
              <li>
                <a href="#proceso">Proceso</a>
              </li>
            </ul>
          </div>
          <div className="footer-col">
            <div className="footer-col-label">Contacto</div>
            <ul>
              <li>
                <a
                  href={`https://wa.me/${WA_NUMBER_INTL}`}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  WhatsApp
                </a>
              </li>
              <li>
                <a href={CAL_LINK} target="_blank" rel="noopener noreferrer">
                  Agendar 30 min
                </a>
              </li>
              <li>
                <a href={`mailto:${PERSONAL_EMAIL}`}>{PERSONAL_EMAIL}</a>
              </li>
            </ul>
          </div>
          <div className="footer-col footer-col-extra">
            <div className="footer-col-label">Redes</div>
            <ul>
              <li>
                <a
                  href="https://www.linkedin.com/in/abalderas10/"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  LinkedIn
                </a>
              </li>
              <li>
                <a
                  href="https://github.com/abalderas10"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  GitHub
                </a>
              </li>
            </ul>
          </div>
        </div>
        <div className="footer-bottom">
          <span>© 2026 ABDEV · Alberto Balderas</span>
          <span>Hecho en CDMX · Powered by café y Next.js</span>
        </div>
      </div>
    </footer>
  );
}
