/**
 * Local-SEO landing pages ("diseño web en {ciudad}").
 *
 * Adding a new city:
 *   1. Add an entry below.
 *   2. Add a `localPages.{key}` namespace to messages/{es,en}.json (same shape
 *      as `localPages.zaragoza`: metaTitle, metaDescription, hero, projects,
 *      why.items, faq.items q1-q4).
 *   3. Create `app/(frontend)/[locale]/{slug}/page.tsx` (copy zaragoza's).
 *   4. Register the route in navigation.ts pathnames + app/sitemap.ts.
 *
 * Content per city is intentionally DIFFERENT (angle, FAQ, copy) — three
 * near-identical pages would read as doorway pages to Google and rank worse.
 */

export type LocalPageConfig = {
  /** Route folder + URL slug, e.g. "diseno-web-zaragoza" */
  slug: string;
  /** City display name */
  city: string;
  /** i18n namespace: localPages.{key} */
  i18nNamespace: string;
  /** Project slugs shown as local proof (matched against resolved projects) */
  projectSlugs: string[];
  /** FAQ item keys (translation keys under {ns}.faq.items) */
  faqKeys: string[];
};

export const localPages: Record<string, LocalPageConfig> = {
  zaragoza: {
    slug: "diseno-web-zaragoza",
    city: "Zaragoza",
    i18nNamespace: "localPages.zaragoza",
    projectSlugs: ["noal-design", "voluntariado-aragon", "fada", "gotten-gym"],
    faqKeys: ["q1", "q2", "q3", "q4", "q5", "q6"],
  },
  huesca: {
    slug: "diseno-web-huesca",
    city: "Huesca",
    i18nNamespace: "localPages.huesca",
    projectSlugs: ["voluntariado-aragon", "fada", "gotten-gym", "seolatte"],
    faqKeys: ["q1", "q2", "q3", "q4", "q5", "q6"],
  },
  teruel: {
    slug: "diseno-web-teruel",
    city: "Teruel",
    i18nNamespace: "localPages.teruel",
    projectSlugs: ["voluntariado-aragon", "fada", "primex-academy", "gotten-gym"],
    faqKeys: ["q1", "q2", "q3", "q4", "q5", "q6"],
  },
};

export function getLocalPage(key: string): LocalPageConfig | undefined {
  return localPages[key];
}
