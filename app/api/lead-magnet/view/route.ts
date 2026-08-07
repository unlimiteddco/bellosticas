import { NextResponse } from "next/server";

/**
 * Registro de visitas a las landings /g/[slug].
 *
 * Proxy ligero hacia el CRM con el secreto compartido. Responde 204 siempre
 * que la petición sea válida: una métrica nunca debe hacer ruido en el cliente.
 */
export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const CRM_BASE_URL = process.env.CRM_BASE_URL ?? "https://admin.bellostas.studio";
const SECRET = process.env.WEB_WEBHOOK_SECRET;

export async function POST(request: Request) {
  if (!SECRET) return new NextResponse(null, { status: 204 });

  let body: Record<string, unknown>;
  try {
    body = (await request.json()) as Record<string, unknown>;
  } catch {
    return new NextResponse(null, { status: 204 });
  }

  const slug = typeof body.slug === "string" ? body.slug.trim().slice(0, 120) : "";
  if (!slug) return new NextResponse(null, { status: 204 });

  const payload = {
    resource_slug: slug,
    resource_title: typeof body.title === "string" ? body.title.slice(0, 300) : null,
    resource_type: typeof body.type === "string" ? body.type.slice(0, 40) : null,
    tracking: body.tracking ?? null,
  };

  try {
    await fetch(`${CRM_BASE_URL.replace(/\/+$/, "")}/api/webhooks/web/lead-magnet-view`, {
      method: "POST",
      headers: { "Content-Type": "application/json", "x-webhook-secret": SECRET },
      body: JSON.stringify(payload),
      signal: AbortSignal.timeout(8_000),
    });
  } catch {
    /* la visita se pierde, la landing sigue funcionando */
  }

  return new NextResponse(null, { status: 204 });
}
