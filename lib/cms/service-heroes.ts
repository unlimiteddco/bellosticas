import "server-only";
import { getCMS } from "./client";
import type { ResolvedServiceHero } from "./types";

type MediaLike = { url?: string | null; alt?: string | null } | string | null | undefined;

function media(m: MediaLike): { src: string; alt: string } | null {
  if (!m || typeof m === "string") return null;
  if (!m.url) return null;
  return { src: m.url, alt: m.alt ?? "" };
}

/**
 * Hero images for a service landing, from Payload. Returns null when the CMS
 * has no entry for this service (or is unavailable) — the caller then uses the
 * static mockups in lib/service-pages.ts.
 */
export async function getServiceHero(
  serviceSlug: string,
): Promise<ResolvedServiceHero | null> {
  const cms = await getCMS();
  if (!cms) return null;

  try {
    const res = await cms.find({
      collection: "service-heroes",
      where: { service: { equals: serviceSlug } },
      depth: 1,
      limit: 1,
    });
    if (res.docs.length === 0) return null;

    const d = res.docs[0] as Record<string, unknown>;
    const mode = d.mode === "single" ? "single" : "stacked";

    const mockups: { src: string; alt: string }[] = [];
    const m1 = media(d.image1 as MediaLike);
    if (m1) mockups.push(m1);
    if (mode === "stacked") {
      const m2 = media(d.image2 as MediaLike);
      if (m2) mockups.push(m2);
    }

    if (mockups.length === 0) return null;

    const badgeLabel = (d.techBadge as string) || "";

    return {
      mode,
      mockups,
      techBadge: badgeLabel
        ? { label: badgeLabel, bg: "#1D1D1B", color: "#C2263A" }
        : undefined,
    };
  } catch (err) {
    console.error("[cms] getServiceHero failed, using static fallback:", err);
    return null;
  }
}
