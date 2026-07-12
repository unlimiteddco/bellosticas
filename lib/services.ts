export type Service = {
  number: string;
  titleKey: "s01" | "s02" | "s03" | "s04" | "s05" | "s06";
  /** Service landing page slug under /services/[slug] */
  slug: string;
  stack: string[];
  featured?: boolean;
  /** When true, the card links to its dedicated landing page */
  hasPage?: boolean;
};

export const services: Service[] = [
  {
    number: "01",
    titleKey: "s01",
    slug: "desarrollo-web",
    stack: ["Next.js", "Sanity", "Tailwind"],
    hasPage: true,
  },
  {
    number: "02",
    titleKey: "s02",
    slug: "ecommerce",
    stack: ["Shopify", "Next.js", "Stripe", "Klaviyo"],
    hasPage: true,
  },
  {
    number: "03",
    titleKey: "s03",
    slug: "aplicaciones-web",
    stack: ["Next.js", "PostgreSQL", "Clerk"],
    featured: true,
    hasPage: true,
  },
  {
    number: "04",
    titleKey: "s04",
    slug: "automatizaciones",
    stack: ["Typebot", "n8n", "OpenAI", "Resend"],
    hasPage: true,
  },
  {
    number: "05",
    titleKey: "s05",
    slug: "migraciones",
    stack: ["Next.js", "Payload", "Scripts custom"],
    hasPage: true,
  },
  {
    number: "06",
    titleKey: "s06",
    slug: "white-label",
    stack: ["Confidencial", "Reportes", "NDAs"],
    hasPage: true,
  },
];
