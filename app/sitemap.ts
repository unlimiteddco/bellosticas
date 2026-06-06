import type { MetadataRoute } from "next";
import { locales, defaultLocale, type Locale } from "@/i18n";
import { pathnames } from "@/navigation";
import { getAllPostSlugs } from "@/lib/cms/posts";

const SITE_URL = (
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://bellostas.studio"
).replace(/\/$/, "");

/** Indexable routes (legal/cookies/privacidad/preview excluded — they're noindex). */
const ROUTE_KEYS = [
  "/",
  "/work",
  "/studio",
  "/love",
  "/blog",
  "/intro",
  "/proceso",
  "/contact",
  "/services/desarrollo-web",
  "/services/aplicaciones-web",
  "/services/ecommerce",
  "/services/migraciones",
  "/services/automatizaciones",
  "/services/white-label",
] as const;

/** Localized, fully-qualified URL for a route key in a given locale (as-needed prefix). */
function urlFor(key: keyof typeof pathnames, locale: Locale): string {
  const value = pathnames[key];
  const path = typeof value === "string" ? value : value[locale];
  const localized =
    locale === defaultLocale ? path : `/${locale}${path === "/" ? "" : path}`;
  return `${SITE_URL}${localized}`;
}

function alternates(key: keyof typeof pathnames) {
  const languages: Record<string, string> = {};
  for (const l of locales) languages[l] = urlFor(key, l);
  return { languages };
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date();

  const staticEntries: MetadataRoute.Sitemap = ROUTE_KEYS.map((key) => ({
    url: urlFor(key, defaultLocale),
    lastModified: now,
    changeFrequency: key === "/" || key === "/blog" ? "weekly" : "monthly",
    priority:
      key === "/"
        ? 1
        : key === "/contact" || key === "/work" || key.startsWith("/services")
          ? 0.8
          : 0.6,
    alternates: alternates(key),
  }));

  // Blog posts — shared "/blog/<slug>" path per locale. Tolerant of an empty/
  // unavailable CMS so the sitemap never breaks the build.
  let postEntries: MetadataRoute.Sitemap = [];
  try {
    const slugs = await getAllPostSlugs();
    postEntries = slugs.map((slug) => ({
      url: `${SITE_URL}/blog/${slug}`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.5,
      alternates: {
        languages: {
          es: `${SITE_URL}/blog/${slug}`,
          en: `${SITE_URL}/en/blog/${slug}`,
        },
      },
    }));
  } catch {
    postEntries = [];
  }

  return [...staticEntries, ...postEntries];
}
