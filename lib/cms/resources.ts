import { getCMS } from "@/lib/cms/client";

/**
 * Lectura de recursos (lead magnets) desde Payload para las landings /g/[slug].
 *
 * Como el resto de la capa CMS, nunca lanza: si Payload no está disponible
 * devuelve null (la landing hace notFound), salvo el recurso "demo", que
 * existe en estático para poder previsualizar el diseño sin base de datos.
 */

export type ResolvedResource = {
  slug: string;
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

/** Vista previa de diseño cuando la CMS no está disponible (solo /g/demo). */
const demoResource: ResolvedResource = {
  slug: "demo",
  title: "Las herramientas de IA con las que llevo mi estudio",
  subtitle:
    "La guía que uso de verdad: qué herramienta para qué tarea, cuánto cuesta cada una y cómo las conecto entre sí.",
  bullets: [
    "Las 12 herramientas exactas (con precios)",
    "Cómo uso Claude Code para desarrollar webs",
    "Mi flujo de contenido: de idea a reel en 30 min",
    "Las 3 automatizaciones que más tiempo me ahorran",
  ],
  ctaLabel: "Quiero la guía",
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

    return {
      slug: String(doc.slug),
      title: String(doc.title),
      subtitle: typeof doc.subtitle === "string" ? doc.subtitle : undefined,
      bullets,
      coverUrl: mediaUrl(doc.coverImage),
      pdfUrl: mediaUrl(doc.pdf),
      keyword: typeof doc.keyword === "string" ? doc.keyword : undefined,
      ctaLabel:
        typeof doc.ctaLabel === "string" && doc.ctaLabel
          ? doc.ctaLabel
          : "Quiero la guía",
    };
  } catch (err) {
    console.warn("[cms] resources unavailable:", err);
    return slug === "demo" ? demoResource : null;
  }
}
