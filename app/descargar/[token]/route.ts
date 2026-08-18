import { NextResponse } from "next/server";

/**
 * Entrega de un lead magnet bajo el dominio de marca.
 *
 *   bellostas.studio/descargar/<código>
 *
 * El archivo lo tiene el CRM (que además registra la descarga), pero el
 * suscriptor NUNCA debe ver admin.bellostas.studio: aquí se pide por detrás con
 * el secreto compartido y se devuelven los bytes desde este dominio.
 */
export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const CRM_BASE_URL = process.env.CRM_BASE_URL ?? "https://admin.bellostas.studio";
const SECRET = process.env.WEB_WEBHOOK_SECRET;

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ token: string }> },
) {
  const { token } = await params;

  if (!SECRET || !/^[a-z0-9]{6,64}$/i.test(token)) {
    return NextResponse.redirect(new URL("https://bellostas.studio"));
  }

  try {
    const res = await fetch(`${CRM_BASE_URL.replace(/\/+$/, "")}/api/webhooks/web/download`, {
      method: "POST",
      headers: { "Content-Type": "application/json", "x-webhook-secret": SECRET },
      body: JSON.stringify({ token }),
      signal: AbortSignal.timeout(25_000),
    });

    if (!res.ok) {
      // Enlace caducado, inválido o archivo caído: a la home, sin errores feos.
      return NextResponse.redirect(new URL("https://bellostas.studio"));
    }

    return new NextResponse(res.body, {
      headers: {
        "Content-Type": res.headers.get("content-type") ?? "application/pdf",
        "Content-Disposition": res.headers.get("content-disposition") ?? "inline",
        "Cache-Control": "private, no-store",
      },
    });
  } catch {
    return NextResponse.redirect(new URL("https://bellostas.studio"));
  }
}
