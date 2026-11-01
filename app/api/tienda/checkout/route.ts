import { NextResponse } from "next/server";
import { SITE_URL, alCrm } from "@/lib/tienda";

/**
 * «Comprar» en una landing de la tienda: pide al CRM la sesión de Stripe
 * Checkout y devuelve su URL. El precio lo pone el CRM; de aquí solo sale el
 * producto, la aceptación de las condiciones y la atribución (UTM).
 */
export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const intentos = new Map<string, { n: number; desde: number }>();

export async function POST(request: Request) {
  if (!process.env.WEB_WEBHOOK_SECRET) {
    console.error("[/api/tienda/checkout] WEB_WEBHOOK_SECRET no configurada");
    return NextResponse.json({ ok: false, error: "No se puede comprar ahora mismo" }, { status: 500 });
  }
  // Freno sencillo por IP: nadie necesita abrir 20 pagos por minuto.
  const ip = request.headers.get("x-forwarded-for")?.split(",")[0].trim() ?? "local";
  const ahora = Date.now();
  const r = intentos.get(ip);
  if (r && ahora - r.desde < 60_000 && r.n >= 20) {
    return NextResponse.json({ ok: false, error: "Demasiados intentos, espera un minuto" }, { status: 429 });
  }
  intentos.set(ip, r && ahora - r.desde < 60_000 ? { n: r.n + 1, desde: r.desde } : { n: 1, desde: ahora });

  const body = (await request.json().catch(() => ({}))) as {
    producto?: unknown;
    acepta?: unknown;
    atribucion?: unknown;
    idioma?: unknown;
  };
  const idioma = body.idioma === "en" ? "en" : "es";
  const prefijo = idioma === "en" ? "/en" : "";
  const producto = typeof body.producto === "string" && /^[a-z0-9-]{1,60}$/.test(body.producto) ? body.producto : "";
  if (!producto || body.acepta !== true) {
    return NextResponse.json(
      { ok: false, error: idioma === "en" ? "Accept the terms to continue" : "Acepta las condiciones para seguir" },
      { status: 400 },
    );
  }

  try {
    const res = await alCrm(`/api/public/tienda/${producto}/checkout`, {
      renunciaDesistimiento: true,
      idioma,
      successUrl: `${SITE_URL}${prefijo}/tienda/gracias`,
      cancelUrl: `${SITE_URL}${prefijo}/tienda/${producto}`,
      atribucion: body.atribucion && typeof body.atribucion === "object" ? body.atribucion : undefined,
    });
    const j = (await res.json().catch(() => ({}))) as { ok?: boolean; url?: string; error?: string };
    if (!res.ok || !j.url) {
      const error = idioma === "en" ? "Couldn't start the payment" : (j.error ?? "No se pudo iniciar el pago");
      return NextResponse.json({ ok: false, error }, { status: res.status === 503 ? 503 : 502 });
    }
    return NextResponse.json({ ok: true, url: j.url });
  } catch {
    const error = idioma === "en" ? "Couldn't start the payment" : "No se pudo iniciar el pago";
    return NextResponse.json({ ok: false, error }, { status: 502 });
  }
}
