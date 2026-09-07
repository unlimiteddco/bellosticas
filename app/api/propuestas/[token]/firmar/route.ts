import { NextResponse } from "next/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const maxDuration = 60;

const CRM_BASE_URL = process.env.CRM_BASE_URL ?? "https://admin.bellostas.studio";
const SECRET = process.env.WEB_WEBHOOK_SECRET;

/**
 * Firma del contrato.
 *
 * La IP y el navegador se leen AQUÍ, de las cabeceras de la petición, y no se
 * aceptan del cuerpo: son la prueba de quién firmó y desde dónde, y un dato
 * que envía el propio firmante no prueba nada.
 */
export async function POST(
  request: Request,
  { params }: { params: Promise<{ token: string }> },
) {
  const { token } = await params;
  if (!SECRET || !/^[A-Za-z0-9_-]{8,128}$/.test(token)) {
    return NextResponse.json({ ok: false, error: "bad_request" }, { status: 400 });
  }

  const body = await request.json().catch(() => null);
  if (!body?.signature || !body?.signer_name) {
    return NextResponse.json({ ok: false, error: "missing_signature" }, { status: 400 });
  }

  // Cloudflare va por delante: su cabecera es la fiable.
  const ip =
    request.headers.get("cf-connecting-ip") ??
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ??
    null;

  try {
    const res = await fetch(
      `${CRM_BASE_URL.replace(/\/+$/, "")}/api/public/proposals/${token}/sign`,
      {
        method: "POST",
        headers: { "x-webhook-secret": SECRET, "Content-Type": "application/json" },
        body: JSON.stringify({
          signature: body.signature,
          signer_name: body.signer_name,
          ip,
          user_agent: request.headers.get("user-agent"),
        }),
        signal: AbortSignal.timeout(55_000),
      },
    );
    const data = await res.json().catch(() => null);
    if (!res.ok || !data) {
      return NextResponse.json(
        { ok: false, error: data?.error ?? `HTTP ${res.status}` },
        { status: res.status || 502 },
      );
    }
    return NextResponse.json(data, { status: 200 });
  } catch (e) {
    console.error("[propuestas] no se pudo firmar", e);
    return NextResponse.json({ ok: false, error: "network" }, { status: 502 });
  }
}
