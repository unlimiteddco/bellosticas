/**
 * "Resolved" shapes — what the frontend actually consumes. Server components
 * fetch from Payload (or fall back to static data), normalize to these shapes,
 * and pass them to client components as props. Image fields are plain URL
 * strings; localized fields are already resolved to the active locale.
 *
 * Plain types (no "server-only") so client components can import them.
 */

export type ResolvedProject = {
  slug: string;
  name: string;
  category: string;
  year: number;
  client: string;
  stack: string[];
  liveUrl?: string;
  color: string;
  description: string;
  logo?: string;
  cover?: string;
  gallery?: { src: string; alt?: string }[];
  featured?: boolean;
  /** Logo display size as a percentage (100 = default). */
  logoScale?: number;
  /** Trabajo hecho pero con el caso aún sin desarrollar → se muestra como "Próximamente". */
  comingSoon?: boolean;
};

export type ResolvedServiceHero = {
  mode: "single" | "stacked";
  mockups: { src: string; alt: string }[];
  techBadge?: { label: string; bg: string; color?: string };
};

export type ResolvedPostSummary = {
  slug: string;
  title: string;
  excerpt?: string;
  coverImage?: string;
  author?: string;
  tags?: string[];
  publishedAt?: string;
};

export type ResolvedPost = ResolvedPostSummary & {
  /** Lexical rich-text JSON, rendered on the post page. */
  content: unknown;
  seo?: {
    metaTitle?: string;
    metaDescription?: string;
  };
};
