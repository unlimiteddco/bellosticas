import { NextResponse } from "next/server";
import { getCMS } from "@/lib/cms/client";
import { markdownToLexical } from "@/lib/cms/markdown-to-lexical";

/**
 * Ingesta de posts del blog desde el CRM.
 *
 * El CRM (admin.bellostas.studio) genera y edita los borradores; al publicar,
 * llama aquí con el secreto compartido `WEB_WEBHOOK_SECRET` (cabecera
 * `x-webhook-secret`, igual que el resto de la integración web↔CRM). Esta ruta
 * crea/actualiza el post en Payload por la Local API — así el CRM no necesita
 * credenciales de Payload.
 *
 * El contenido se guarda en la locale por defecto (es); el blog /en cae a ella
 * por fallback, de modo que un post nunca sale con el título vacío.
 */
export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const SECRET = process.env.WEB_WEBHOOK_SECRET;
const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://bellostas.studio";

interface IngestBody {
  language?: "es" | "en";
  title?: string;
  slug?: string;
  excerpt?: string | null;
  metaTitle?: string | null;
  metaDescription?: string | null;
  tags?: string[];
  bodyMarkdown?: string;
  publishedAt?: string | null;
  payloadId?: string | null;
}

export async function POST(request: Request) {
  // Auth por secreto compartido
  if (!SECRET) {
    console.error("[/api/blog/ingest] WEB_WEBHOOK_SECRET no configurada");
    return NextResponse.json({ ok: false, error: "Server not configured" }, { status: 500 });
  }
  const provided =
    request.headers.get("x-webhook-secret") ??
    request.headers.get("authorization")?.replace(/^Bearer\s+/i, "");
  if (provided !== SECRET) {
    return NextResponse.json({ ok: false, error: "Unauthorized" }, { status: 401 });
  }

  let body: IngestBody;
  try {
    body = (await request.json()) as IngestBody;
  } catch {
    return NextResponse.json({ ok: false, error: "JSON inválido" }, { status: 400 });
  }

  const title = (body.title ?? "").trim();
  const slug = (body.slug ?? "").trim();
  const bodyMarkdown = (body.bodyMarkdown ?? "").trim();
  if (!title || !slug || !bodyMarkdown) {
    return NextResponse.json(
      { ok: false, error: "Faltan title, slug o bodyMarkdown" },
      { status: 400 },
    );
  }

  const cms = await getCMS();
  if (!cms) {
    return NextResponse.json(
      { ok: false, error: "Payload no disponible (revisa DATABASE_URI / PAYLOAD_SECRET en la web)" },
      { status: 503 },
    );
  }

  const content = markdownToLexical(bodyMarkdown);
  const publishedAt = body.publishedAt ?? new Date().toISOString();

  const data: Record<string, unknown> = {
    title,
    slug,
    excerpt: body.excerpt ?? undefined,
    content,
    tags: Array.isArray(body.tags) ? body.tags : [],
    publishedAt,
    _status: "published",
    seo: {
      metaTitle: body.metaTitle ?? undefined,
      metaDescription: body.metaDescription ?? undefined,
    },
  };

  try {
    // Determina si actualizar (por payloadId, o por slug existente) o crear.
    let id = body.payloadId ?? null;
    if (!id) {
      const existing = await cms.find({
        collection: "posts",
        where: { slug: { equals: slug } },
        limit: 1,
        depth: 0,
        overrideAccess: true,
      });
      if (existing.docs.length) id = String(existing.docs[0].id);
    }

    let doc;
    if (id) {
      doc = await cms.update({
        collection: "posts",
        id,
        data,
        overrideAccess: true,
      });
    } else {
      doc = await cms.create({
        collection: "posts",
        data,
        overrideAccess: true,
      });
    }

    return NextResponse.json({
      ok: true,
      payloadId: String(doc.id),
      url: `${SITE_URL.replace(/\/+$/, "")}/blog/${slug}`,
    });
  } catch (e) {
    console.error("[/api/blog/ingest] error creando/actualizando post", e);
    return NextResponse.json(
      { ok: false, error: e instanceof Error ? e.message : "Error creando el post en Payload" },
      { status: 500 },
    );
  }
}
