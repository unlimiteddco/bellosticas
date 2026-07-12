import { NextRequest, NextResponse } from "next/server";

/**
 * Proxy del configurador de SEO local → CRM.
 *
 * El wizard hace POST aquí y este route (Node, server-side) reenvía al webhook
 * del CRM firmando con el shared secret — el secret jamás toca el cliente.
 * Mismo contrato que /api/contact.
 */

const CRM_BASE_URL = process.env.CRM_BASE_URL ?? "https://admin.bellostas.studio";
const SECRET = process.env.WEB_WEBHOOK_SECRET;

export async function POST(request: NextRequest) {
  if (!SECRET) {
    console.error("[/api/seo-quote] WEB_WEBHOOK_SECRET is not configured");
    return NextResponse.json({ error: "Server misconfigured" }, { status: 500 });
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  try {
    const res = await fetch(`${CRM_BASE_URL}/api/webhooks/web/seo-quote`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-webhook-secret": SECRET,
      },
      body: JSON.stringify(body),
      // El CRM responde rápido; no dejamos al visitante colgado si no.
      signal: AbortSignal.timeout(8000),
    });
    const data = await res.json().catch(() => ({}));
    if (!res.ok) {
      console.error("[/api/seo-quote] CRM error", res.status, data);
      return NextResponse.json({ error: "Upstream error" }, { status: 502 });
    }
    return NextResponse.json(data);
  } catch (err) {
    console.error("[/api/seo-quote] forward failed", err);
    return NextResponse.json({ error: "Upstream unreachable" }, { status: 502 });
  }
}
