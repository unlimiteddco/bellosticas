import { NextResponse } from "next/server";

/**
 * La propuesta en PDF, bajo el dominio de marca:
 *   bellostas.studio/propuestas/<token>/pdf
 *
 * Lo genera el CRM (que tiene el motor de PDF y las tipografías), pero el
 * cliente nunca debe ver admin.bellostas.studio: se pide por detrás con el
 * secreto compartido y se devuelven los bytes desde aquí.
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

  if (!SECRET || !/^[A-Za-z0-9_-]{8,128}$/.test(token)) {
    return NextResponse.redirect(new URL("https://bellostas.studio"));
  }

  try {
    const res = await fetch(
      `${CRM_BASE_URL.replace(/\/+$/, "")}/api/public/proposals/${token}/pdf`,
      { headers: { "x-webhook-secret": SECRET }, signal: AbortSignal.timeout(30_000) },
    );

    // Caducada, rechazada o inexistente: a la propuesta, que ya explica el estado.
    if (!res.ok) {
      return NextResponse.redirect(new URL(`/propuestas/${token}`, "https://bellostas.studio"));
    }

    return new NextResponse(res.body, {
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": res.headers.get("content-disposition") ?? "inline",
        "Cache-Control": "private, no-store",
      },
    });
  } catch {
    return NextResponse.redirect(new URL(`/propuestas/${token}`, "https://bellostas.studio"));
  }
}
