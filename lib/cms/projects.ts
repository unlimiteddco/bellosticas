import "server-only";
import { getTranslations } from "next-intl/server";
import { getCMS, cmsLocale } from "./client";
import { projects as staticProjects } from "@/lib/projects";
import type { ResolvedProject } from "./types";

type MediaLike = { url?: string | null } | string | null | undefined;

/** Extract a usable URL from a Payload upload field (depth>=1) or a plain string. */
function mediaUrl(m: MediaLike): string | undefined {
  if (!m) return undefined;
  if (typeof m === "string") return m; // unpopulated relation id — skip
  return m.url ?? undefined;
}

/**
 * Projects for the active locale. Reads from Payload; if the CMS is empty or
 * unavailable, falls back to the static lib/projects.ts list with descriptions
 * resolved from the work.items.* i18n messages.
 */
export async function getProjects(locale: string): Promise<ResolvedProject[]> {
  const cms = await getCMS();

  if (cms) {
    try {
      const res = await cms.find({
        collection: "projects",
        locale: cmsLocale(locale),
        depth: 1,
        limit: 100,
        sort: "order",
      });

      if (res.docs.length > 0) {
        return res.docs.map((doc): ResolvedProject => {
          const d = doc as Record<string, unknown>;
          const gallery = Array.isArray(d.gallery)
            ? (d.gallery as { image?: MediaLike }[])
                .map((g) => {
                  const src = mediaUrl(g.image);
                  return src ? { src, alt: undefined } : null;
                })
                .filter((x): x is { src: string; alt: undefined } => x !== null)
            : undefined;

          return {
            slug: String(d.slug ?? ""),
            name: String(d.name ?? ""),
            category: String(d.category ?? ""),
            year: Number(d.year ?? 0),
            client: String(d.client ?? ""),
            stack: Array.isArray(d.stack) ? (d.stack as string[]) : [],
            liveUrl: (d.liveUrl as string) || undefined,
            color: String(d.color ?? "#1D1D1B"),
            description: String(d.description ?? ""),
            logo: mediaUrl(d.logo as MediaLike),
            cover: mediaUrl(d.cover as MediaLike),
            gallery: gallery && gallery.length > 0 ? gallery : undefined,
            featured: Boolean(d.featured),
            logoScale: typeof d.logoScale === "number" ? d.logoScale : 100,
            comingSoon: Boolean(d.comingSoon),
          };
        });
      }
    } catch (err) {
      console.error("[cms] getProjects failed, using static fallback:", err);
    }
  }

  return staticFallback(locale);
}

/** Static fallback: lib/projects.ts + descriptions from work.items i18n. */
async function staticFallback(locale: string): Promise<ResolvedProject[]> {
  const t = await getTranslations({ locale, namespace: "work.items" });
  return staticProjects.map((p): ResolvedProject => ({
    slug: p.slug,
    name: p.name,
    category: p.category,
    year: p.year,
    client: p.client,
    stack: p.stack,
    liveUrl: p.liveUrl,
    color: p.color,
    description: safeT(t, p.descriptionKey),
    logo: p.logo,
    cover: p.cover,
    gallery: p.gallery,
    // Static list has no explicit featured flag — it's chosen positionally by
    // the Work components (first project with logo+cover).
    featured: undefined,
    comingSoon: p.comingSoon ?? false,
  }));
}

function safeT(
  t: Awaited<ReturnType<typeof getTranslations>>,
  key: string,
): string {
  try {
    return t(key);
  } catch {
    return "";
  }
}
