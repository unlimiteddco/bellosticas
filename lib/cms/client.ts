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
// Tras un fallo de conexión, no reintentar en cada request (cada render
// dispararía un nuevo intento contra Postgres, llenando la consola de
// errores y rejections sueltas del pool de pg). Backoff sencillo.
let lastFailureAt = 0;
const RETRY_AFTER_MS = 60_000;

export function isCMSEnabled(): boolean {
  return Boolean(process.env.DATABASE_URI && process.env.PAYLOAD_SECRET);
}

/**
 * Returns a memoized Payload instance, or null if the CMS is disabled or the
 * connection fails. Never throws — callers fall back to static data on null.
 */
export async function getCMS(): Promise<Payload | null> {
  if (!isCMSEnabled()) return null;
  if (lastFailureAt && Date.now() - lastFailureAt < RETRY_AFTER_MS) return null;
  try {
    if (!cached) {
      // Lazy import so the heavy payload bundle isn't pulled when CMS is off.
      const { getPayload } = await import("payload");
      const configModule = await import("@payload-config");
      cached = getPayload({ config: configModule.default });
      // Marca el promise como manejado también para el que no llegue a await
      // (evita "unhandledRejection" cuando dos renders compiten).
      cached.catch(() => {});
    }
    const payload = await cached;
    lastFailureAt = 0;
    return payload;
  } catch (err) {
    // Reset cache so a later request can retry after the DB recovers.
    cached = null;
    lastFailureAt = Date.now();
    // warn, no error: el fallback a datos estáticos es un estado soportado
    // (p. ej. desarrollo local sin Postgres), no un fallo de la web.
    console.warn("[cms] Payload unavailable, falling back to static data:", err);
    return null;
  }
}

/** Locale guard — Payload only knows "es" | "en". */
export function cmsLocale(locale: string): "es" | "en" {
  return locale === "en" ? "en" : "es";
}
