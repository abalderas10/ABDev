export interface ProcessStage {
  num: string;
  title: string;
  desc: string;
  time: string;
  deliverables: string[];
  /** Stage 03 renders a mini deploy log. */
  deployLog?: { kind: "ar" | "mut" | "ok"; text: string; lead?: string }[];
}

export const processStages: ProcessStage[] = [
  {
    num: "01",
    title: "Descubrimiento",
    desc: "Sesión de 30 min para entender tu negocio, usuarios y el problema real que vamos a resolver.",
    time: "Semana 0 · 30 min",
    deliverables: [
      "Diagnóstico de tu situación digital actual",
      "Definición clara del objetivo del proyecto",
      "Sin costo y sin compromiso",
    ],
  },
  {
    num: "02",
    title: "Propuesta técnica",
    desc: "Documento con stack, módulos, cronograma y precio. Si lo apruebas, arrancamos. Si no, sin compromiso.",
    time: "Semana 1 · 48 hrs",
    deliverables: [
      "Arquitectura y stack técnico definidos",
      "Cronograma por sprints y precio cerrado",
      "Alcance honesto, sin letras chiquitas",
    ],
  },
  {
    num: "03",
    title: "Desarrollo ágil",
    desc: "Sprints semanales con acceso a staging. Ves el avance en tiempo real y das feedback en cada etapa.",
    time: "Semana 2-6 · iterativo",
    deliverables: [
      "Link de staging actualizado cada sprint",
      "Feedback continuo, sin esperar al final",
    ],
    deployLog: [
      { kind: "ar", text: "git push origin main" },
      { kind: "mut", text: "next build", lead: "building…" },
      { kind: "ar", text: "deploy to staging" },
      { kind: "ok", text: "live in 1.2s", lead: "· preview listo" },
    ],
  },
  {
    num: "04",
    title: "Lanzamiento",
    desc: "Deploy a producción con tu dominio. Capacitación, documentación y soporte post-lanzamiento incluido.",
    time: "Semana final · go-live",
    deliverables: [
      "Producción en tu dominio, con SSL y analytics",
      "Capacitación + documentación de uso",
      "Soporte post-lanzamiento incluido",
    ],
  },
];
