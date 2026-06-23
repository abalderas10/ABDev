export interface Package {
  id: string;
  name: string;
  tag: string;
  /** Fixed-price packages carry numeric strings (formatted). */
  priceOnce?: string;
  priceMonthly?: string;
  /** For the custom "System" plan, a label replaces the price. */
  priceLabel?: string;
  noteOnce?: string;
  noteMonthly?: string;
  note?: string;
  featLabel: string;
  feats: string[];
  badge?: string;
  featured?: boolean;
  /** "cart" packages add to the project cart; "quote" opens WhatsApp. */
  ctaType: "cart" | "quote";
  ctaLabel: string;
}

export const packages: Package[] = [
  {
    id: "launch",
    name: "Launch",
    tag: "Para validar una idea o presentar tu negocio al mundo.",
    priceOnce: "15,000",
    priceMonthly: "1,500",
    noteOnce: "Pago único · entrega en 2 semanas",
    noteMonthly: "/mes durante 12 meses · entrega en 2 semanas",
    featLabel: "Incluye",
    feats: [
      "Landing page de 1 sección, hasta 5 bloques",
      "Diseño a medida (no plantilla)",
      "Formulario de contacto + WhatsApp",
      "SEO básico + Open Graph",
      "Hosting Vercel + dominio 1er año",
      "Analytics + 1 mes de soporte",
    ],
    ctaType: "cart",
    ctaLabel: "Agregar al proyecto",
  },
  {
    id: "studio",
    name: "Studio",
    tag: "El paquete que escogen 7 de cada 10 clientes nuevos.",
    priceOnce: "45,000",
    priceMonthly: "4,200",
    noteOnce: "Pago único · entrega en 4-6 semanas",
    noteMonthly: "/mes durante 12 meses · entrega en 4-6 semanas",
    featLabel: "Todo lo de Launch, más",
    feats: [
      "Sitio multi-página (hasta 8 páginas)",
      "Blog/CMS administrable",
      "Integración Cal.com o reservas",
      "SEO técnico avanzado + schema",
      "Animaciones y micro-interacciones",
      "3 meses de soporte y ajustes",
    ],
    badge: "Más popular",
    featured: true,
    ctaType: "cart",
    ctaLabel: "Agregar al proyecto",
  },
  {
    id: "system",
    name: "System",
    tag: "Ecosistema completo: web + automatización + agente AI.",
    priceLabel: "Hablemos del alcance",
    note: "Cada ecosistema es único · cotización en 24h",
    featLabel: "Todo lo de Studio, más",
    feats: [
      "Sistema/dashboard con base de datos",
      "Agente AI entrenado con tu negocio",
      "Automatización WhatsApp (WAHA + n8n)",
      "Pagos con Stripe / membresías",
      "Roles, auth y panel admin",
      "6 meses de soporte + capacitación",
    ],
    ctaType: "quote",
    ctaLabel: "Solicitar cotización",
  },
];
