import {
  Globe,
  LayoutDashboard,
  Bot,
  MessageCircle,
  CreditCard,
  BookOpen,
  type LucideIcon,
} from "lucide-react";

export interface Service {
  num: string;
  icon: LucideIcon;
  title: string;
  desc: string;
  tags: { label: string; accent?: boolean }[];
}

export const services: Service[] = [
  {
    num: "001",
    icon: Globe,
    title: "Sitios & Landing Pages",
    desc: "Páginas que cargan en milisegundos y convierten. Diseño a medida, SEO técnico y métricas que sí mueven la aguja.",
    tags: [
      { label: "Next.js", accent: true },
      { label: "Vercel", accent: true },
      { label: "SEO" },
      { label: "A/B" },
    ],
  },
  {
    num: "002",
    icon: LayoutDashboard,
    title: "Sistemas web & dashboards",
    desc: "CRMs, paneles de admin, catálogos y flujos de operación. Datos en tiempo real, roles, auth y reportes.",
    tags: [
      { label: "Supabase", accent: true },
      { label: "PostgreSQL", accent: true },
      { label: "Auth" },
      { label: "RLS" },
    ],
  },
  {
    num: "003",
    icon: Bot,
    title: "Agentes AI",
    desc: "Asistentes que conocen tu negocio. Califican leads, agendan citas, contestan clientes y se conectan a tus sistemas.",
    tags: [
      { label: "Claude", accent: true },
      { label: "MCP", accent: true },
      { label: "Voz" },
      { label: "RAG" },
    ],
  },
  {
    num: "004",
    icon: MessageCircle,
    title: "Automatización WhatsApp",
    desc: "Pedidos, cotizaciones y atención 24/7 sin intervención humana. Sistema completo conectado a tu base de datos.",
    tags: [
      { label: "WAHA", accent: true },
      { label: "n8n", accent: true },
      { label: "Bot" },
      { label: "CRM" },
    ],
  },
  {
    num: "005",
    icon: CreditCard,
    title: "E-commerce & pagos",
    desc: "Tiendas, reservas y membresías con cobro real. Stripe, Cal.com e inventarios integrados a tu operación diaria.",
    tags: [
      { label: "Stripe", accent: true },
      { label: "Cal.com", accent: true },
      { label: "Memberships" },
    ],
  },
  {
    num: "006",
    icon: BookOpen,
    title: "CMS & contenido",
    desc: "Blogs, galerías y plataformas editoriales con panel para que tu equipo publique sin tocar código.",
    tags: [
      { label: "Wisp CMS", accent: true },
      { label: "Cloudinary", accent: true },
      { label: "Editorial" },
    ],
  },
];
