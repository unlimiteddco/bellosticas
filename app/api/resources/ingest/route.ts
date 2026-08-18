import { NextResponse } from "next/server";
import { getCMS } from "@/lib/cms/client";

/**
 * Ingesta de lead magnets desde el CRM.
 *
 * El CRM es el taller (allí se crean, se editan y se iteran los títulos); esta
 * ruta crea o actualiza el recurso en Payload para que exista la landing
 * /g/<slug>. El PDF no viaja: se referencia por URL y la web lo sirve desde
 * /guias/<slug>, pidiéndoselo al CRM por detrás.
 *
 * Auth: shared secret (`x-webhook-secret`), igual que el resto de la integración.
 */
export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const SECRET = process.env.WEB_WEBHOOK_SECRET;

export async function POST(request: Request) {
  if (!SECRET) {
    return NextResponse.json({ ok: false, error: "Server not configured" }, { status: 500 });
  }
  const provided =
    request.headers.get("x-webhook-secret") ??
    request.headers.get("authorization")?.replace(/^Bearer\s+/i, "");
  if (provided !== SECRET) {
    return NextResponse.json({ ok: false, error: "Unauthorized" }, { status: 401 });
  }

  let body: Record<string, unknown>;
  try {
    body = (await request.json()) as Record<string, unknown>;
  } catch {
    return NextResponse.json({ ok: false, error: "JSON inválido" }, { status: 400 });
  }

  const slug = typeof body.slug === "string" ? body.slug.trim() : "";
  const title = typeof body.title === "string" ? body.title.trim() : "";
  const pdfUrl = typeof body.pdfUrl === "string" ? body.pdfUrl.trim() : "";
  if (!slug || !title || !pdfUrl) {
    return NextResponse.json({ ok: false, error: "Faltan slug, title o pdfUrl" }, { status: 400 });
  }

  const cms = await getCMS();
  if (!cms) {
    return NextResponse.json(
      { ok: false, error: "Payload no disponible (revisa DATABASE_URI / PAYLOAD_SECRET en la web)" },
      { status: 503 },
    );
  }

  const bullets = Array.isArray(body.bullets)
    ? (body.bullets as unknown[])
        .map((b) => (typeof b === "string" ? b.trim() : ""))
        .filter(Boolean)
        .map((text) => ({ text }))
    : [];

  const data: Record<string, unknown> = {
    slug,
    title,
    type: typeof body.type === "string" ? body.type : "guia",
    subtitle: typeof body.subtitle === "string" ? body.subtitle : undefined,
    bullets,
    keyword: typeof body.keyword === "string" ? body.keyword : undefined,
    pdfUrl,
    active: body.active !== false,
  };

  try {
    const existing = await cms.find({
      collection: "resources",
      where: { slug: { equals: slug } },
      limit: 1,
      depth: 0,
      overrideAccess: true,
    });

    const doc = existing.docs.length
      ? await cms.update({
          collection: "resources",
          id: String(existing.docs[0].id),
          data,
          overrideAccess: true,
        })
      : await cms.create({ collection: "resources", data, overrideAccess: true });

    return NextResponse.json({
      ok: true,
      id: String(doc.id),
      url: `https://bellostas.studio/g/${slug}`,
    });
  } catch (e) {
    console.error("[/api/resources/ingest]", e);
    return NextResponse.json(
      { ok: false, error: e instanceof Error ? e.message : "Error creando el recurso" },
      { status: 500 },
    );
  }
}
