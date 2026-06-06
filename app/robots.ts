import type { MetadataRoute } from "next";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://bellostas.studio";

/**
 * robots.txt — generated at /robots.txt.
 * Legal pages are NOT disallowed here (they carry a `noindex` meta tag instead,
 * so crawlers can still reach them and honour the directive). The CMS admin,
 * internal API and preview routes are blocked outright.
 */
export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/admin", "/payload-api", "/api", "/preview", "/en/preview"],
      },
    ],
    sitemap: `${SITE_URL}/sitemap.xml`,
    host: SITE_URL,
  };
}
