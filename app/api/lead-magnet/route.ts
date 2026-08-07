import { NextResponse } from "next/server";
import { getResourceBySlug } from "@/lib/cms/resources";

/**
 * Captura de suscriptores de las landings /g/[slug].
 *
 * Proxy de servidor (Node) hacia el webhook del CRM con el secreto compartido.
 * El recurso (título, PDF) se resuelve AQUÍ desde Payload por slug — nunca se
 * confía en datos del cliente para decidir qué enlace se envía por email.
 */
export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const CRM_BASE_URL = process.env.CRM_BASE_URL ?? "https://admin.bellostas.studio";
const SECRET = process.env.WEB_WEBHOOK_SECRET;
const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://bellostas.studio";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

function absolute(url: string): string {
  if (/^https?:\/\//i.test(url)) return url;
  return `${SITE_URL.replace(/\/+$/, "")}${url.startsWith("/") ? url : `/${url}`}`;
}

export async function POST(request: Request) {
  if (!SECRET) {
    console.error("[/api/lead-magnet] WEB_WEBHOOK_SECRET no configurada");
    return NextResponse.json({ ok: false, error: "Server not configured" }, { status: 500 });
  }

  let body: Record<string, unknown>;
  try {
    body = (await request.json()) as Record<string, unknown>;
  } catch {
    return NextResponse.json({ ok: false, error: "JSON inválido" }, { status: 400 });
  }

  const email = typeof body.email === "string" ? body.email.trim().toLowerCase() : "";
  const slug = typeof body.slug === "string" ? body.slug.trim() : "";
  const consent = body.consent === true;

  if (!EMAIL_RE.test(email) || email.length > 254) {
    return NextResponse.json({ ok: false, error: "Email no válido" }, { status: 400 });
  }
  if (!slug || slug.length > 120 || !consent) {
    return NextResponse.json({ ok: false, error: "Petición no válida" }, { status: 400 });
  }

  // El recurso se resuelve en servidor: si no existe o no tiene PDF, no se envía nada.
  const resource = await getResourceBySlug(slug);
  if (!resource) {
    return NextResponse.json({ ok: false, error: "Este recurso ya no está disponible" }, { status: 404 });
  }
  if (!resource.pdfUrl) {
    console.error(`[/api/lead-magnet] recurso "${slug}" sin PDF`);
    return NextResponse.json(
      { ok: false, error: "Este recurso aún no está listo — inténtalo en un rato" },
      { status: 503 },
    );
  }

  const payload = {
    email,
    consent: true,
    resource_slug: resource.slug,
    resource_title: resource.title,
    keyword: resource.keyword ?? null,
    pdf_url: absolute(resource.pdfUrl),
    landing_url: `${SITE_URL.replace(/\/+$/, "")}/g/${resource.slug}`,
    tracking: body.tracking ?? null,
  };

  try {
    const res = await fetch(`${CRM_BASE_URL.replace(/\/+$/, "")}/api/webhooks/web/lead-magnet`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-webhook-secret": SECRET,
      },
      body: JSON.stringify(payload),
      signal: AbortSignal.timeout(15_000),
    });
    const data = (await res.json().catch(() => null)) as { ok?: boolean; error?: string } | null;
    if (!res.ok || !data?.ok) {
      console.error("[/api/lead-magnet] CRM respondió", res.status, data);
      return NextResponse.json(
        { ok: false, error: "No se pudo completar el envío. Prueba en unos segundos." },
        { status: 502 },
      );
    }
    return NextResponse.json({ ok: true });
  } catch (e) {
    console.error("[/api/lead-magnet] error de red hacia el CRM", e);
    return NextResponse.json(
      { ok: false, error: "No se pudo completar el envío. Prueba en unos segundos." },
      { status: 502 },
    );
  }
}
