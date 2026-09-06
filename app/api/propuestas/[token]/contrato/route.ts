import { NextResponse } from "next/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const CRM_BASE_URL = process.env.CRM_BASE_URL ?? "https://admin.bellostas.studio";
const SECRET = process.env.WEB_WEBHOOK_SECRET;

/**
 * Prepara el contrato para firmarlo dentro de la propia propuesta.
 *
 * El secreto compartido se queda aquí: el navegador del cliente nunca habla
 * con el CRM ni ve admin.bellostas.studio.
 */
export async function POST(
  _request: Request,
  { params }: { params: Promise<{ token: string }> },
) {
  const { token } = await params;
  if (!SECRET || !/^[A-Za-z0-9_-]{8,128}$/.test(token)) {
    return NextResponse.json({ ok: false, error: "bad_request" }, { status: 400 });
  }

  try {
    const res = await fetch(
      `${CRM_BASE_URL.replace(/\/+$/, "")}/api/public/proposals/${token}/contract`,
      {
        method: "POST",
        headers: { "x-webhook-secret": SECRET, "Content-Type": "application/json" },
        signal: AbortSignal.timeout(25_000),
      },
    );
    const data = await res.json().catch(() => null);
    if (!res.ok || !data) {
      // Sin contrato, el paso de firma se salta: no se bloquea al cliente por
      // algo que no depende de él.
      return NextResponse.json({ ok: true, available: false });
    }
    return NextResponse.json(data, { status: 200 });
  } catch (e) {
    console.error("[propuestas] contrato no disponible", e);
    return NextResponse.json({ ok: true, available: false });
  }
}
