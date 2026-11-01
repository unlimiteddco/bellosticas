import { NextResponse } from "next/server";
import { SITE_URL, alCrm } from "@/lib/tienda";

/**
 * Descarga de un archivo comprado: bellostas.studio/descargar/compra/<código>/<archivo>.
 * El CRM comprueba la compra, apunta la descarga y firma un enlace temporal
 * al almacén; aquí se redirige a él. Si algo falla, vuelta a la página de la compra.
 */
export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(_request: Request, { params }: { params: Promise<{ token: string; archivo: string }> }) {
  const { token, archivo } = await params;
  const volver = NextResponse.redirect(`${SITE_URL}/compra/${encodeURIComponent(token)}`);
  if (!/^[A-Za-z0-9_-]{16,64}$/.test(token) || !/^[0-9a-f-]{36}$/.test(archivo)) return volver;
  try {
    const res = await alCrm(`/api/public/tienda/compras/${token}/${archivo}`, {});
    const j = (await res.json().catch(() => ({}))) as { url?: string };
    if (!res.ok || !j.url) return volver;
    return NextResponse.redirect(j.url, { headers: { "Cache-Control": "private, no-store" } });
  } catch {
    return volver;
  }
}
