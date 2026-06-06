import "server-only";
import type { Payload } from "payload";

/**
 * Local-API access to Payload from server components.
 *
 * The whole CMS layer is OPTIONAL: if Postgres isn't configured or is
 * unreachable, every read falls back to the static data in lib/projects.ts /
 * lib/service-pages.ts. The site therefore renders fine with no database at
 * all (e.g. a fresh clone, or if the DB is down).
 */

let cached: Promise<Payload> | null = null;

export function isCMSEnabled(): boolean {
  return Boolean(process.env.DATABASE_URI && process.env.PAYLOAD_SECRET);
}

/**
 * Returns a memoized Payload instance, or null if the CMS is disabled or the
 * connection fails. Never throws — callers fall back to static data on null.
 */
export async function getCMS(): Promise<Payload | null> {
  if (!isCMSEnabled()) return null;
  try {
    if (!cached) {
      // Lazy import so the heavy payload bundle isn't pulled when CMS is off.
      const { getPayload } = await import("payload");
      const configModule = await import("@payload-config");
      cached = getPayload({ config: configModule.default });
    }
    return await cached;
  } catch (err) {
    // Reset cache so a later request can retry after the DB recovers.
    cached = null;
    console.error("[cms] Payload unavailable, falling back to static data:", err);
    return null;
  }
}

/** Locale guard — Payload only knows "es" | "en". */
export function cmsLocale(locale: string): "es" | "en" {
  return locale === "en" ? "en" : "es";
}
