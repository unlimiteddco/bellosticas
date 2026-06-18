export type Project = {
  slug: string;
  name: string;
  category: string;
  year: number;
  client: string;
  stack: string[];
  liveUrl?: string;
  color: string;
  descriptionKey: string;
  /** White SVG logo shown centered on the card by default */
  logo?: string;
  /**
   * Featured screenshot/mockup revealed on hover and used as the BIG hero
   * image at the top of the modal. Recommended: 16:10 or wider, JPG/WEBP,
   * 2000-2400px on the long side.
   */
  cover?: string;
  /**
   * Optional 2-column gallery rendered in the modal below the cover.
   * Each image is shown as a card with rounded corners and consistent height.
   * Recommended: 2-6 images, mostly 4:3 ratio, JPG/WEBP at 1400-1800px wide.
   * If you provide an odd number, the last item spans both columns.
   */
  gallery?: { src: string; alt?: string }[];
  /** Marca el trabajo como "Próximamente" (caso aún sin desarrollar). */
  comingSoon?: boolean;
};

export const projects: Project[] = [
  {
    slug: "seolatte",
    name: "SeoLatte",
    category: "SaaS · Programmatic SEO",
    year: 2026,
    client: "SeoLatte",
    stack: ["Next.js", "Sanity", "OpenAI", "Vercel"],
    liveUrl: "https://seolatte.com",
    color: "#2C2417",
    descriptionKey: "p_seolatte",
  },
  {
    slug: "primex-academy",
    name: "PrimeX Academy",
    category: "LMS · Education",
    year: 2025,
    client: "PrimeX",
    stack: ["Next.js", "Payload", "Stripe"],
    color: "#1A2B3F",
    descriptionKey: "p_primex",
  },
  {
    slug: "voluntariado-aragon",
    name: "Voluntariado de Aragón",
    category: "Migration · Government",
    year: 2025,
    client: "Gobierno de Aragón",
    stack: ["Next.js", "Sanity", "Cloudflare"],
    color: "#3A1F1F",
    descriptionKey: "p_pva",
  },
  {
    slug: "fada",
    name: "FADA",
    category: "Federation · Sport",
    year: 2024,
    client: "Federación Aragonesa de Automovilismo",
    stack: ["Next.js", "Sanity"],
    color: "#1F2E22",
    descriptionKey: "p_fada",
  },
  {
    slug: "gotten-gym",
    name: "Gotten Gym",
    category: "Site + Custom Admin",
    year: 2024,
    client: "Gotten Gym",
    stack: ["Next.js", "Payload", "Tailwind"],
    color: "#0F0F0F",
    descriptionKey: "p_gotten",
    logo: "/clientes/logo-web-svg-white.svg",
    cover: "/clientes/caso-gotten.jpeg",
  },
  {
    slug: "embroidery-download",
    name: "EmbroideryDownload",
    category: "E-commerce · In progress",
    year: 2026,
    client: "Embroidery Download",
    stack: ["Next.js", "Medusa", "Stripe"],
    color: "#2A1F33",
    descriptionKey: "p_embroidery",
  },
];
