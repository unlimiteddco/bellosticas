import { NextResponse } from "next/server";

/**
 * Sirve el PDF de un lead magnet bajo el dominio de marca:
 *   bellostas.studio/guias/<slug>
 *
 * El PDF lo genera el CRM al vuelo desde su contenido; aquí se pide por detrás
 * con el secreto compartido y se devuelve desde este dominio. Los PDFs
 * estáticos que ya viven en /public/guias/*.pdf siguen sirviéndose solos: los
 * archivos reales tienen prioridad sobre esta ruta.
 */
export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const CRM_BASE_URL = process.env.CRM_BASE_URL ?? "https://admin.bellostas.studio";
const SECRET = process.env.WEB_WEBHOOK_SECRET;

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ slug: string }> },
) {
  const { slug } = await params;

  if (!SECRET || !/^[a-z0-9-]{2,120}$/i.test(slug)) {
    return NextResponse.redirect(new URL("https://bellostas.studio"));
  }

  try {
    const res = await fetch(`${CRM_BASE_URL.replace(/\/+$/, "")}/api/webhooks/web/lead-magnet-pdf`, {
      method: "POST",
      headers: { "Content-Type": "application/json", "x-webhook-secret": SECRET },
      body: JSON.stringify({ slug: slug.replace(/\.pdf$/i, "") }),
      signal: AbortSignal.timeout(30_000),
    });

    if (!res.ok) return NextResponse.redirect(new URL("https://bellostas.studio"));

    return new NextResponse(res.body, {
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": res.headers.get("content-disposition") ?? "inline",
        "Cache-Control": "public, max-age=300",
      },
    });
  } catch {
    return NextResponse.redirect(new URL("https://bellostas.studio"));
  }
}
