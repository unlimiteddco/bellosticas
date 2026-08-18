import { getCMS } from "@/lib/cms/client";
import { withArticle, type ResourceType } from "@/lib/resource-type";

/**
 * Lectura de recursos (lead magnets) desde Payload para las landings /g/[slug].
 *
 * Como el resto de la capa CMS, nunca lanza: si Payload no está disponible
 * devuelve null (la landing hace notFound), salvo el recurso "demo", que
 * existe en estático para poder previsualizar el diseño sin base de datos.
 */

export type ResolvedResource = {
  slug: string;
  type: ResourceType;
  title: string;
  subtitle?: string;
  bullets: string[];
  coverUrl?: string;
  pdfUrl?: string;
  keyword?: string;
  ctaLabel: string;
};

function mediaUrl(value: unknown): string | undefined {
  if (value && typeof value === "object" && "url" in value) {
    const url = (value as { url?: unknown }).url;
    if (typeof url === "string" && url) return url;
  }
  return undefined;
}

/**
 * Recurso de respaldo cuando la CMS no está disponible (solo /g/demo).
 * Usa una guía real (assets en public/guias/) para que la landing sea
 * funcional de punta a punta incluso sin Payload.
 */
const DEMO_TYPE: ResourceType = "guia";

const demoResource: ResolvedResource = {
  slug: "demo",
  type: DEMO_TYPE,
  title: "Las primeras 24 horas después del «sí»",
  subtitle:
    "Cerrar el proyecto no es el final de la venta: es cuando el cliente empieza a preguntarse si ha acertado. Este es el sistema de onboarding que sigo yo, en cuatro pasos.",
  bullets: [
    "Contrato personalizado y firmado en 15 min",
    "Factura emitida al momento (pagar tiene que ser lo más fácil)",
    "Acceso a su portal de cliente desde el día uno",
    "La llamada de arranque que alinea objetivos antes de tocar nada",
  ],
  coverUrl: "/guias/primeras-24-horas-cover.png",
  pdfUrl: "/guias/primeras-24-horas.pdf",
  keyword: "24HORAS",
  ctaLabel: `Quiero ${withArticle(DEMO_TYPE)}`,
};

export async function getResourceBySlug(
  slug: string,
): Promise<ResolvedResource | null> {
  const cms = await getCMS();
  if (!cms) return slug === "demo" ? demoResource : null;

  try {
    const res = await cms.find({
      collection: "resources",
      where: {
        and: [{ slug: { equals: slug } }, { active: { equals: true } }],
      },
      depth: 1,
      limit: 1,
    });
    const doc = res.docs[0];
    if (!doc) return slug === "demo" ? demoResource : null;

    const bullets = Array.isArray(doc.bullets)
      ? (doc.bullets as { text?: unknown }[])
          .map((b) => (typeof b.text === "string" ? b.text : ""))
          .filter(Boolean)
      : [];

    const type = (typeof doc.type === "string" ? doc.type : "guia") as ResourceType;

    return {
      slug: String(doc.slug),
      type,
      title: String(doc.title),
      subtitle: typeof doc.subtitle === "string" ? doc.subtitle : undefined,
      bullets,
      coverUrl: mediaUrl(doc.coverImage),
      // Preferimos el PDF generado en el CRM; si no, el subido a mano.
      pdfUrl:
        (typeof doc.pdfUrl === "string" && doc.pdfUrl ? doc.pdfUrl : undefined) ??
        mediaUrl(doc.pdf),
      keyword: typeof doc.keyword === "string" ? doc.keyword : undefined,
      // Si no se define, el CTA se deriva del tipo: "Quiero la guía / el proceso…"
      ctaLabel:
        typeof doc.ctaLabel === "string" && doc.ctaLabel.trim()
          ? doc.ctaLabel.trim()
          : `Quiero ${withArticle(type)}`,
    };
  } catch (err) {
    console.warn("[cms] resources unavailable:", err);
    return slug === "demo" ? demoResource : null;
  }
}
