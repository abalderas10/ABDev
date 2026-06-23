// Portfolio data for the Projects (bento) section + modal.
// Copy and stack are reproduced verbatim from the design prototype.

export type ProjectId =
  | "carnicos"
  | "capitalta"
  | "villagaleon"
  | "itzae"
  | "urban"
  | "growth";

export type IndustryKey =
  | "fintech"
  | "distribucion"
  | "salud"
  | "hospitality"
  | "inmobiliario"
  | "bdm";

export interface Project {
  id: ProjectId;
  /** Short tag shown on the card label (e.g. "Fintech"). */
  label: string;
  /** Longer industry name shown in the modal. */
  industry: string;
  industryKey: IndustryKey;
  name: string;
  /** Domain shown in the mock browser bar. */
  url: string;
  /** Short blurb on the card. */
  short: string;
  /** Full description (modal). */
  desc: string;
  /** "El reto" — the problem solved (modal). */
  problem: string;
  tech: string[];
  features: string;
  /** Live site link. */
  link: string;
  /** Image path under /public. */
  image: string;
  /** Featured spans the large bento cell. */
  featured?: boolean;
  /** Bento size: feat | md | sm. */
  size: "feat" | "md" | "sm";
}

export const projects: Project[] = [
  {
    id: "carnicos",
    label: "Featured · 2026",
    industry: "Distribución B2B",
    industryKey: "distribucion",
    name: "Cárnicos Gustavo",
    url: "carnicosgustavo.com",
    short:
      "Ecosistema digital completo para distribuidor B2B de cárnicos: sitio CEDIS, catálogo de 77 cortes con tiers de precio y agente AI que recibe pedidos por WhatsApp.",
    desc: "Ecosistema digital completo para Centro de Distribución de Cárnicos (CEDIS) mayorista especializado en productos de cerdo. Abarca desde el sitio institucional hasta automatización de pedidos por WhatsApp con inteligencia artificial.",
    problem:
      "El negocio recibía pedidos por WhatsApp de forma caótica y manual. Necesitaban un sistema que automatizara la recepción de pedidos, mantuviera lista de precios actualizada por tiers (Mayoreo / Menudeo / Premium) y liberara tiempo operativo.",
    tech: [
      "Next.js 15",
      "Supabase",
      "WAHA",
      "n8n",
      "DigitalOcean",
      "PostgreSQL",
      "TypeScript",
      "Vercel",
    ],
    features:
      "Sitio CEDIS institucional, catálogo de 77 cortes de cerdo con 3 tiers de precio, automatización WhatsApp con n8n para recepción de pedidos, base de datos en tiempo real con Supabase, agente AI conversacional.",
    link: "https://carnicosgustavo.com",
    image: "/projects/carnicos.png",
    featured: true,
    size: "feat",
  },
  {
    id: "capitalta",
    label: "Fintech",
    industry: "Fintech",
    industryKey: "fintech",
    name: "Capitalta.mx",
    url: "capitalta.mx",
    short:
      "Plataforma corporativa de soluciones de crédito con diseño enterprise y arquitectura de conversión.",
    desc: "Plataforma corporativa de soluciones de crédito ágiles y transparentes para personas y empresas en México. Diseño enterprise con enfoque en conversión y credibilidad institucional.",
    problem:
      "Una institución financiera necesitaba una presencia digital que transmitiera confianza, transparencia y agilidad al mismo tiempo. El reto: comunicar productos financieros complejos de forma clara para el usuario final.",
    tech: [
      "Next.js 14",
      "Vercel",
      "TypeScript",
      "Tailwind CSS",
      "SEO técnico",
      "OG Images dinámicas",
      "Analytics",
    ],
    features:
      "Landing page con arquitectura de conversión, SEO técnico avanzado con metadatos dinámicos, diseño responsive con identidad financiera premium, integración de imágenes Open Graph para redes sociales.",
    link: "https://capitalta.mx",
    image: "/projects/capitalta.png",
    size: "md",
  },
  {
    id: "villagaleon",
    label: "Hospitality",
    industry: "Hospitality",
    industryKey: "hospitality",
    name: "Villa Galeón",
    url: "villagaleon.com",
    short:
      "Sistema propio de reservas con Stripe y agente AI para huéspedes en Riviera Maya.",
    desc: "Plataforma completa para villa turística náutica en Cancún / Riviera Maya. Sistema de reservas con pagos en línea, agente AI para atención y blog de contenidos.",
    problem:
      "Un negocio de renta vacacional premium necesitaba un sistema propio de reservas (sin depender de plataformas como Airbnb) con control total de pagos, disponibilidad y comunicación con huéspedes.",
    tech: [
      "Next.js 15",
      "Stripe",
      "Cal.com",
      "Claude AI",
      "Cloudinary",
      "Wisp CMS",
      "TypeScript",
      "Vercel",
    ],
    features:
      "Sistema de reservas personalizado con Stripe, agente AI para preguntas frecuentes y asistencia de reserva, galería de imágenes con Cloudinary, blog de la Riviera Maya, integración de pagos segura.",
    link: "https://villagaleon.com",
    image: "/projects/villagaleon.png",
    size: "md",
  },
  {
    id: "itzae",
    label: "Real Estate",
    industry: "Real Estate Premium",
    industryKey: "inmobiliario",
    name: "Itzaé Tulum",
    url: "itzae.vercel.app",
    short:
      "Landing premium para desarrollo inmobiliario autofinanciado en La Veleta, Tulum.",
    desc: "Landing de inversión inmobiliaria premium en La Veleta, Tulum. El único desarrollo 100% autofinanciado de la zona, con 5 tipologías diseñadas para renta vacacional y ROI proyectado del 15% anual.",
    problem:
      "Un desarrollo inmobiliario necesitaba una presencia digital que transmitiera exclusividad, seguridad de inversión y transparencia financiera para captar inversionistas desde $2.5 MDP con información clara y persuasiva.",
    tech: [
      "Next.js 15",
      "Vercel",
      "TypeScript",
      "Tailwind CSS",
      "Animaciones CSS",
      "SEO Local",
      "Meta OG",
    ],
    features:
      "Landing orientada a inversión con métricas financieras claras, galería de 5 tipologías, sección de ROI proyectado, llamadas a la acción estratégicas, diseño premium que refleja el posicionamiento del desarrollo.",
    link: "https://itzae.vercel.app",
    image: "/projects/itzae.png",
    size: "sm",
  },
  {
    id: "urban",
    label: "Salud",
    industry: "Salud",
    industryKey: "salud",
    name: "Urban Sonríe",
    url: "urban-sonrie.abdev.click",
    short:
      "Clínica dental con membresías, blog, agendamiento y SEO técnico avanzado.",
    desc: "Sitio web completo para clínica dental de vanguardia en Tlalnepantla, CDMX. Incluye servicios especializados, sistema de membresías, blog, SEO avanzado y agendamiento en línea.",
    problem:
      "Una clínica dental necesitaba digitalizar su operación completa: captar pacientes en línea, ofrecer membresías de mantenimiento, publicar contenido de valor y permitir agendamiento sin depender de llamadas telefónicas.",
    tech: [
      "Next.js 14",
      "Cal.com",
      "Wisp CMS",
      "TypeScript",
      "Tailwind CSS",
      "SEO técnico",
      "Schema Markup",
    ],
    features:
      "Catálogo de 6 especialidades dentales con páginas individuales SEO, sistema de membresías y planes de pago, blog con CMS administrable, botón WhatsApp y agendar en línea, páginas legales.",
    link: "https://urban-sonrie.abdev.click",
    image: "/projects/urban.png",
    size: "sm",
  },
  {
    id: "growth",
    label: "Business Dev",
    industry: "Business Dev",
    industryKey: "bdm",
    name: "Growth BDM",
    url: "growthbdm.com",
    short:
      "Plataforma para business development inmobiliario: blog, consultas, RSS y pagos.",
    desc: "Plataforma digital para Business Development Management en el sector inmobiliario. Estrategias de crecimiento, networking, alianzas estratégicas y blog de publicaciones profesionales.",
    problem:
      "Una profesional de business development necesitaba una plataforma para posicionarse como experta, generar leads calificados en el sector inmobiliario y monetizar consultas estratégicas.",
    tech: [
      "Next.js 15",
      "Stripe",
      "Cal.com",
      "Cloudinary",
      "Wisp CMS",
      "TypeScript",
      "Vercel",
      "RSS",
    ],
    features:
      "Blog profesional con CMS, sistema de agendamiento de consultas estratégicas, integración de cobros por Stripe, galería de eventos con Cloudinary, sección de alianzas, feed RSS.",
    link: "https://growthbdm.com",
    image: "/projects/growth.png",
    size: "sm",
  },
];

export const projectsById: Record<ProjectId, Project> = projects.reduce(
  (acc, p) => {
    acc[p.id] = p;
    return acc;
  },
  {} as Record<ProjectId, Project>,
);
