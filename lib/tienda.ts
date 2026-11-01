/**
 * Tienda de productos digitales. Quien cobra y entrega es el CRM
 * (src/lib/tienda en bepartners): aquí solo se lee el precio para enseñarlo y
 * se hacen de puente las peticiones de pago y descarga, con el secreto
 * compartido. El comprador nunca ve admin.bellostas.studio.
 */
export const CRM_BASE_URL = (process.env.CRM_BASE_URL ?? "https://admin.bellostas.studio").replace(/\/+$/, "");
export const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL ?? "https://bellostas.studio").replace(/\/+$/, "");

export interface FichaProducto {
  slug: string;
  nombre: string;
  /** céntimos, IVA incluido */
  importe: number;
  normal: number;
  lanzamientoHasta: string | null;
  disponible: boolean;
}

/** Nombre y precio de ahora, del CRM. null si no existe o el CRM no responde. */
export async function fichaProducto(slug: string): Promise<FichaProducto | null> {
  try {
    const r = await fetch(`${CRM_BASE_URL}/api/public/tienda/${encodeURIComponent(slug)}`, {
      next: { revalidate: 60 },
      signal: AbortSignal.timeout(8000),
    });
    if (!r.ok) return null;
    return (await r.json()) as FichaProducto;
  } catch {
    return null;
  }
}

/** POST al CRM con el secreto compartido (solo desde el servidor). */
export async function alCrm(path: string, body: unknown): Promise<Response> {
  return fetch(`${CRM_BASE_URL}${path}`, {
    method: "POST",
    headers: { "Content-Type": "application/json", "x-webhook-secret": process.env.WEB_WEBHOOK_SECRET ?? "" },
    body: JSON.stringify(body),
    cache: "no-store",
    signal: AbortSignal.timeout(20_000),
  });
}
