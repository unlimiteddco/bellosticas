import { NextResponse } from "next/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const CRM_BASE_URL = process.env.CRM_BASE_URL ?? "https://admin.bellostas.studio";
const SECRET = process.env.WEB_WEBHOOK_SECRET;

/* Un tope por IP: lo pregunta la página cada pocos segundos mientras enseña
   el QR, y no hace falta más. En memoria: se pierde al reiniciar, y basta. */
const VENTANA_MS = 60_000;
const MAXIMO = 40;
const cuentas = new Map<string, { n: number; desde: number }>();
function demasiadas(ip: string): boolean {
  const ahora = Date.now();
  if (cuentas.size > 5_000) cuentas.clear();
  const c = cuentas.get(ip);
  if (!c || ahora - c.desde > VENTANA_MS) {
    cuentas.set(ip, { n: 1, desde: ahora });
    return false;
  }
  c.n += 1;
  return c.n > MAXIMO;
}

/**
 * En qué está la firma del contrato de una propuesta (solo lee).
 *
 * Lo pregunta el paso de firma mientras enseña el QR de «firmar desde el
 * móvil»: en cuanto se firma en el teléfono, el ordenador pasa solo al pago.
 * El secreto compartido se queda aquí: el navegador nunca habla con el CRM.
 */
export async function GET(request: Request, { params }: { params: Promise<{ token: string }> }) {
  const sinCache = { "Cache-Control": "no-store", "X-Robots-Tag": "noindex, nofollow" };
  const { token } = await params;
  if (!SECRET || !/^[A-Za-z0-9_-]{8,128}$/.test(token)) {
    return NextResponse.json({ ok: false, error: "bad_request" }, { status: 400, headers: sinCache });
  }
  const ip =
    request.headers.get("cf-connecting-ip") ?? request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "anon";
  if (demasiadas(ip)) {
    return NextResponse.json({ ok: false, error: "rate_limited" }, { status: 429, headers: sinCache });
  }

  try {
    const res = await fetch(`${CRM_BASE_URL.replace(/\/+$/, "")}/api/public/proposals/${token}/sign`, {
      headers: { "x-webhook-secret": SECRET },
      cache: "no-store",
      signal: AbortSignal.timeout(10_000),
    });
    const data = (await res.json().catch(() => null)) as {
      signed?: boolean;
      pending?: boolean;
      invoice?: unknown;
    } | null;
    if (!res.ok || !data) {
      return NextResponse.json({ ok: false, signed: false }, { status: res.status === 404 ? 404 : 502, headers: sinCache });
    }
    return NextResponse.json(
      { ok: true, signed: Boolean(data.signed), pending: Boolean(data.pending), invoice: data.invoice ?? null },
      { headers: sinCache },
    );
  } catch {
    return NextResponse.json({ ok: false, signed: false }, { status: 502, headers: sinCache });
  }
}
