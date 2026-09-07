import { NextResponse } from "next/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const CRM_BASE_URL = process.env.CRM_BASE_URL ?? "https://admin.bellostas.studio";
const SECRET = process.env.WEB_WEBHOOK_SECRET;

/** El contrato en PDF, servido bajo el dominio de marca. */
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
      `${CRM_BASE_URL.replace(/\/+$/, "")}/api/public/proposals/${token}/contract-preview`,
      { headers: { "x-webhook-secret": SECRET }, signal: AbortSignal.timeout(45_000) },
    );
    if (!res.ok) {
      return NextResponse.json({ error: "No disponible" }, { status: res.status });
    }
    const pdf = Buffer.from(await res.arrayBuffer());
    return new NextResponse(new Uint8Array(pdf), {
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": "inline; filename=\"contrato.pdf\"",
        "Cache-Control": "private, no-store",
      },
    });
  } catch (e) {
    console.error("[propuestas] contrato no disponible", e);
    return NextResponse.json({ error: "No disponible" }, { status: 502 });
  }
}
