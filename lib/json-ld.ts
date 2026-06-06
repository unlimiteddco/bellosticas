/**
 * Schema.org JSON-LD helpers for SEO rich snippets.
 *
 * Every service landing emits:
 *   - `Service` schema (Google can show rich results for the offering)
 *   - `FAQPage` schema (FAQ accordion eligible for "People also ask" boxes)
 *   - `BreadcrumbList` (breadcrumb in SERPs)
 *
 * Each helper returns a plain object. Render it inline as:
 *   <script type="application/ld+json"
 *     dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
 *   />
 *
 * The Organization + LocalBusiness schemas live in `app/[locale]/layout.tsx`
 * and are emitted on EVERY page — these per-page helpers add page-specific
 * structured data on top of those.
 */

const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://bellostas.studio";

type JsonLd = Record<string, unknown>;

/* -------------------------------------------------------------------------- */
/*  Service                                                                   */
/* -------------------------------------------------------------------------- */

export type ServiceSchemaInput = {
  /** Service name, e.g. "Diseño y desarrollo web" */
  name: string;
  /** One-paragraph description (≤ 300 chars ideal) */
  description: string;
  /** URL of the service landing, e.g. "/services/desarrollo-web" */
  url: string;
  /** Service area, e.g. "ES" / "Worldwide" */
  areaServed?: string[];
  /** Specific service type bucket (Schema.org enum-ish) */
  serviceType?: string;
};

export function serviceSchema(input: ServiceSchemaInput): JsonLd {
  return {
    "@context": "https://schema.org",
    "@type": "Service",
    name: input.name,
    description: input.description,
    url: absoluteUrl(input.url),
    serviceType: input.serviceType ?? input.name,
    provider: {
      "@type": "Organization",
      name: "Bellostas Studio",
      url: SITE_URL,
    },
    areaServed: input.areaServed ?? ["ES", "Worldwide"],
  };
}

/* -------------------------------------------------------------------------- */
/*  FAQPage                                                                   */
/* -------------------------------------------------------------------------- */

export type FaqItem = {
  question: string;
  answer: string;
};

export function faqSchema(items: FaqItem[]): JsonLd | null {
  if (!items.length) return null;
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: items.map((it) => ({
      "@type": "Question",
      name: it.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: it.answer,
      },
    })),
  };
}

/* -------------------------------------------------------------------------- */
/*  BreadcrumbList                                                            */
/* -------------------------------------------------------------------------- */

export type Crumb = {
  name: string;
  /** Relative or absolute URL */
  url: string;
};

export function breadcrumbSchema(crumbs: Crumb[]): JsonLd {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: crumbs.map((c, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: c.name,
      item: absoluteUrl(c.url),
    })),
  };
}

/* -------------------------------------------------------------------------- */
/*  Helpers                                                                   */
/* -------------------------------------------------------------------------- */

function absoluteUrl(path: string): string {
  if (path.startsWith("http://") || path.startsWith("https://")) return path;
  const clean = path.startsWith("/") ? path : `/${path}`;
  return `${SITE_URL}${clean}`;
}

/**
 * Convenience: render multiple JSON-LD blobs as <script> tags in a single
 * call. Drop the returned array into your component's JSX.
 *
 * Skips null entries (so you can `[schema1, maybeSchema2, schema3]`).
 */
export function jsonLdScripts(schemas: (JsonLd | null | undefined)[]) {
  return schemas
    .filter((s): s is JsonLd => s !== null && s !== undefined)
    .map((schema, i) => ({
      key: `ld-${i}`,
      __html: JSON.stringify(schema),
    }));
}
