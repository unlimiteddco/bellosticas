/**
 * Per-service-page configuration.
 *
 * Adding a new service page is now:
 *   1. Add an entry below with the slug, hero mockup paths and bento visuals.
 *   2. Add a `servicePages.{slug}` namespace to messages/{es,en}.json with the
 *      same structure as `servicePages.web` (hero, manifesto, bento.items, faq).
 *   3. Create `app/[locale]/services/{slug}/page.tsx` (5 lines, see desarrollo-web).
 *   4. Flip `hasPage: true` in lib/services.ts for that slug.
 */

import type { BentoVisualKey } from "@/components/sections/service/BentoVisuals";
import type { ManifestoVariant } from "@/components/sections/service/ServiceManifesto";

export type ServicePageConfig = {
  /** URL slug — must match the folder name under /app/[locale]/services/ */
  slug: string;
  /** Namespace used to look up translation strings (servicePages.{slug}) */
  i18nNamespace: string;
  hero: {
    /** Up to 2 mockup images shown on the right of the hero (stacked at angles) */
    mockups: { src: string; alt: string }[];
    /** Small floating tech badge overlaid on the mockups */
    techBadge?: {
      label: string;
      bg: string;
      color?: string;
    };
  };
  /** Optional manifesto-section visualization variant. Default 'code'. */
  manifesto?: {
    variant: ManifestoVariant;
  };
  bento: {
    /** Ordered list of 5 visual keys, in the order they appear in the bento */
    visuals: BentoVisualKey[];
  };
  projects: {
    /** Stack keyword used to filter lib/projects.ts; empty = all */
    stackFilter?: string;
    limit?: number;
  };
  faq: {
    /** Translation keys for each question, e.g. ["q1","q2"] */
    questionKeys: string[];
  };
};

export const servicePages: Record<string, ServicePageConfig> = {
  automatizaciones: {
    slug: "automatizaciones",
    i18nNamespace: "servicePages.automatizaciones",
    hero: {
      mockups: [
        { src: "/clientes/caso-gotten.jpeg", alt: "Gotten Gym — admin panel" },
        { src: "/clientes/fada-despues.jpg", alt: "FADA — platform" },
      ],
      techBadge: { label: "⚡", bg: "#1D1D1B", color: "#C2263A" },
    },
    manifesto: { variant: "workflow" },
    bento: {
      // Visuals mapped to automation types:
      // f1 Bots WhatsApp/chat   → headless    (chat flow: user → bot → response)
      // f2 Lead qualification   → typescript  (code-y, agentes con lógica)
      // f3 App integrations     → edge        (multi-app global connection)
      // f4 Email marketing      → seo         (chart up = conversions)
      // f5 Internal workflows   → performance (efficiency gauge)
      visuals: ["headless", "typescript", "edge", "seo", "performance"],
    },
    projects: { limit: 4 },
    faq: { questionKeys: ["q1", "q2", "q3", "q4", "q5", "q6"] },
  },
  ecommerce: {
    slug: "ecommerce",
    i18nNamespace: "servicePages.ecommerce",
    hero: {
      mockups: [
        {
          src: "/images/hero-ecommerce-clean.png",
          alt: "Tienda e-commerce — mockups móviles",
        },
      ],
      techBadge: { label: "$", bg: "#1D1D1B", color: "#C2263A" },
    },
    manifesto: { variant: "orders" },
    bento: {
      // Visuals mapped to e-commerce features:
      // f1 Shopify avanzado  → headless    (3 connected blocks = app → store → checkout)
      // f2 Custom e-commerce → typescript  (structured code / DB-driven)
      // f3 Email marketing   → seo         (chart up = conversion / open rates)
      // f4 Migraciones SEO   → edge        (multiple paths converging globally)
      // f5 UX & conversion   → performance (gauge = optimization metric)
      visuals: ["headless", "typescript", "seo", "edge", "performance"],
    },
    projects: { limit: 4 },
    faq: { questionKeys: ["q1", "q2", "q3", "q4", "q5", "q6"] },
  },
  "aplicaciones-web": {
    slug: "aplicaciones-web",
    i18nNamespace: "servicePages.apps",
    hero: {
      mockups: [
        { src: "/clientes/caso-gotten.jpeg", alt: "Gotten Gym — custom admin panel" },
        { src: "/clientes/fada-despues.jpg", alt: "FADA — institutional platform" },
      ],
      techBadge: { label: "{ }", bg: "#1D1D1B", color: "#C2263A" },
    },
    bento: {
      // Visuals mapped to app types:
      // f1 SaaS multi-tenant   → edge        (globe + nodes = distributed / multi)
      // f2 Dashboards admin    → seo         (chart up = KPIs / analytics)
      // f3 LMS / educación     → headless    (3 connected blocks = student → course → progress)
      // f4 Portales de cliente → typescript  (structured fields / data flow)
      // f5 Internal tools      → performance (efficiency gauge)
      visuals: ["edge", "seo", "headless", "typescript", "performance"],
    },
    projects: { limit: 4 },
    faq: { questionKeys: ["q1", "q2", "q3", "q4", "q5", "q6"] },
  },
  migraciones: {
    slug: "migraciones",
    i18nNamespace: "servicePages.migraciones",
    hero: {
      mockups: [
        { src: "/clientes/fada-antes.jpg", alt: "FADA — antes de la migración" },
        { src: "/clientes/fada-despues.jpg", alt: "FADA — después de la migración" },
      ],
      techBadge: { label: "→", bg: "#1D1D1B", color: "#C2263A" },
    },
    manifesto: { variant: "migration" },
    bento: {
      // Visuals mapped to migration types:
      // f1 WordPress → Next.js + Sanity   → headless    (CMS headless flow)
      // f2 Wix/Squarespace → modern stack → performance (gauge = speed recovery)
      // f3 Shopify legacy → Hydrogen      → typescript  (structured code rewrite)
      // f4 WooCommerce → Shopify          → edge        (multi-source data migration)
      // f5 Custom legacy → Next.js + PG   → seo         (chart up = scale recovery)
      visuals: ["headless", "performance", "typescript", "edge", "seo"],
    },
    projects: { limit: 4 },
    faq: { questionKeys: ["q1", "q2", "q3", "q4", "q5", "q6"] },
  },
  "desarrollo-web": {
    slug: "desarrollo-web",
    i18nNamespace: "servicePages.web",
    hero: {
      mockups: [
        { src: "/clientes/fada-despues.jpg", alt: "FADA — Next.js site" },
        { src: "/clientes/caso-gotten.jpeg", alt: "Gotten Gym — Next.js site" },
      ],
      techBadge: { label: "N", bg: "#000000", color: "#FFFFFF" },
    },
    bento: {
      visuals: ["performance", "seo", "headless", "edge", "typescript"],
    },
    projects: { stackFilter: "next.js", limit: 4 },
    faq: { questionKeys: ["q1", "q2", "q3", "q4", "q5"] },
  },
};

export function getServicePage(slug: string): ServicePageConfig | undefined {
  return servicePages[slug];
}
