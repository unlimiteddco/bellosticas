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
  // Producto propio: no es un encargo, es nuestro. Va primero mientras sea novedad.
  {
    slug: "flylead",
    name: "FlyLead",
    category: "Producto propio · SaaS",
    year: 2026,
    client: "Bellostas Studio",
    stack: ["Astro"],
    liveUrl: "https://flylead.es",
    color: "#14161A",
    descriptionKey: "p_flylead",
    logo: "/clientes/flylead-logo.svg",
    // La portada es la textura de marca: es lo que sale al pasar por la
    // tarjeta. Dentro de la ficha van las dos fotos, una al lado de la otra.
    cover: "/clientes/flylead-textura.jpg",
    gallery: [
      { src: "/clientes/flylead-agencia.jpg", alt: "FlyLead Real Estate en el portátil de una agencia inmobiliaria" },
      { src: "/clientes/flylead-valla.jpg", alt: "Valla de FlyLead: «Tu negocio, conectado. Tu equipo, un paso por delante.»" },
    ],
  },
  // Cliente bajo confidencialidad: se anuncia sin nombre. Cuando se pueda
  // decir quién es, se cambia el nombre, se le pone logo y se quita comingSoon.
  {
    slug: "partner-google",
    name: "El mayor partner de Google en España",
    category: "Nuevo cliente",
    year: 2026,
    client: "Confidencial",
    stack: [],
    color: "#16181D",
    descriptionKey: "p_partner",
    comingSoon: true,
  },
  {
    slug: "teleadhesivo",
    name: "TeleAdhesivo",
    category: "E-commerce · Vinilos a medida",
    year: 2026,
    client: "Banner Imagen",
    stack: [],
    liveUrl: "https://www.teleadhesivo.com",
    color: "#1B2A2F",
    descriptionKey: "p_teleadhesivo",
    cover: "/clientes/teleadhesivo-cover.png",
  },
  {
    slug: "borrell-pinol",
    name: "Borrell & Piñol",
    category: "Web · Correduría de seguros",
    year: 2026,
    client: "Borrell & Piñol Associats",
    stack: ["WordPress"],
    liveUrl: "https://www.borrellpinyol.com",
    color: "#14233A",
    descriptionKey: "p_borrell",
    // Capturas de su web en producción: la portada para la tarjeta y dos
    // secciones para la ficha.
    cover: "/clientes/borrell-portada.webp",
    gallery: [
      { src: "/clientes/borrell-nosotros.webp", alt: "Borrell & Piñol — sección «Sobre nosotros»" },
      { src: "/clientes/borrell-productos.webp", alt: "Borrell & Piñol — seguros por producto" },
    ],
  },
  {
    slug: "obra-partner",
    name: "Obra Partner",
    category: "E-commerce · Azulejos y construcción",
    year: 2026,
    client: "Obra Partner Azulejos",
    stack: ["WordPress", "WooCommerce"],
    liveUrl: "https://obrapartner.es",
    color: "#3A2A1C",
    descriptionKey: "p_obrapartner",
  },
  // Sin web publicada todavía: se anuncian, y la ficha llegará con el lanzamiento.
  {
    slug: "tajoh-guapo",
    name: "Tajoh Guapo",
    category: "Web · Estudio creativo",
    year: 2026,
    client: "Tajoh Guapo Studio",
    stack: [],
    color: "#2B2B2B",
    descriptionKey: "p_tajoh",
    comingSoon: true,
  },
  {
    slug: "fabb-brand",
    name: "FABB Brand",
    category: "Web",
    year: 2026,
    client: "FABB Brand",
    stack: [],
    color: "#33202A",
    descriptionKey: "p_fabb",
    comingSoon: true,
  },
  // PENDIENTE — Lacía (agencia de packaging, Madrid): hecho pero aún no se
  // puede publicar. No añadir aquí ni en el gestor hasta que Antonio lo diga.
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
