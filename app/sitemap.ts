import type { MetadataRoute } from "next";
import { locales, defaultLocale, type Locale } from "@/i18n";
import { pathnames } from "@/navigation";
import { getAllPostSlugs } from "@/lib/cms/posts";
import { getProjects } from "@/lib/cms/projects";

const SITE_URL = (
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://bellostas.studio"
).replace(/\/$/, "");

/** Indexable routes (legal/cookies/privacidad, recursos, propuestas y la versión A de precios van sin indexar). */
const ROUTE_KEYS = [
  "/",
  "/services",
  "/services/brand-identity",
  "/services/desarrollo-web",
  "/services/ecommerce",
  "/services/seo-aeo",
  "/services/aplicaciones-web",
  "/services/automatizaciones",
  "/services/migraciones",
  "/services/white-label",
  "/pricing",
  "/work",
  "/clients",
  "/studio",
  "/proceso",
  "/blog",
  "/intro",
  "/contact",
  "/diseno-web-zaragoza",
  "/diseno-web-huesca",
  "/diseno-web-teruel",
] as const;

/**
 * Landings de SEO local: solo existen en español (la keyword es española y en
 * inglés no hay demanda de búsqueda). /en/diseno-web-* redirige a la versión
 * ES, así que no emitimos alternates hreflang para ellas.
 */
const ES_ONLY_ROUTES: readonly string[] = [
  "/diseno-web-zaragoza",
  "/diseno-web-huesca",
  "/diseno-web-teruel",
];

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
        : key === "/contact" || key === "/work" || key === "/pricing" || key.startsWith("/services")
          ? 0.8
          : 0.6,
    // Las landings locales son solo-ES: sin hreflang alternates.
    ...(ES_ONLY_ROUTES.includes(key) ? {} : { alternates: alternates(key) }),
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

  // Casos de éxito: /trabajos/<slug> (ES) y /en/work/<slug>. Los «próximamente»
  // no tienen página propia todavía.
  let caseEntries: MetadataRoute.Sitemap = [];
  try {
    const proyectos = await getProjects(defaultLocale);
    caseEntries = proyectos
      .filter((p) => !p.comingSoon)
      .map((p) => ({
        url: `${SITE_URL}/trabajos/${p.slug}`,
        lastModified: now,
        changeFrequency: "monthly",
        priority: 0.6,
        alternates: {
          languages: {
            es: `${SITE_URL}/trabajos/${p.slug}`,
            en: `${SITE_URL}/en/work/${p.slug}`,
          },
        },
      }));
  } catch {
    caseEntries = [];
  }

  return [...staticEntries, ...caseEntries, ...postEntries];
}
