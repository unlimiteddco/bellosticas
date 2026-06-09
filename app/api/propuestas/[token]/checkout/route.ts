import { NextResponse } from "next/server";

// Proxy: pide al CRM la sesión de Stripe Checkout del anticipo (paso 2 del pago).
export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const CRM_BASE_URL = process.env.CRM_BASE_URL ?? "https://admin.bellostas.studio";
const SECRET = process.env.WEB_WEBHOOK_SECRET;

export async function POST(
  _request: Request,
  { params }: { params: Promise<{ token: string }> },
) {
  if (!SECRET) {
    return NextResponse.json({ ok: false, error: "Server is not configured" }, { status: 500 });
  }
  const { token } = await params;
  if (!token || token.length < 8) {
    return NextResponse.json({ ok: false, error: "Invalid token" }, { status: 400 });
  }

  const url = `${CRM_BASE_URL.replace(/\/+$/, "")}/api/public/proposals/${encodeURIComponent(token)}/checkout`;
  try {
    const resp = await fetch(url, {
      method: "POST",
      headers: { "X-Webhook-Secret": SECRET },
      signal: AbortSignal.timeout(15_000),
    });
    const data = await resp.json().catch(() => null);
    return NextResponse.json(data ?? { ok: false, error: "Empty response" }, {
      status: resp.status,
    });
  } catch {
    return NextResponse.json(
      { ok: false, error: "No se pudo conectar con el pago" },
      { status: 502 },
    );
  }
}
