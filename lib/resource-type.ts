/**
 * Tipos de lead magnet. No todo son guías: puede ser un proceso, una
 * plantilla, un checklist… El tipo decide cómo se nombra el recurso en TODA
 * la landing y en el email ("Quiero la guía" / "Quiero el proceso"…), para
 * que el copy nunca suene genérico ni equivocado.
 *
 * El CRM tiene la misma tabla (repos separados, duplicación mínima a propósito).
 */

export const RESOURCE_TYPES = [
  { value: "guia", label: "Guía", article: "la", noun: "guía" },
  { value: "proceso", label: "Proceso / cómo lo hago", article: "el", noun: "proceso" },
  { value: "plantilla", label: "Plantilla", article: "la", noun: "plantilla" },
  { value: "checklist", label: "Checklist", article: "el", noun: "checklist" },
  { value: "kit", label: "Kit de recursos", article: "el", noun: "kit" },
  { value: "video", label: "Vídeo / formación", article: "el", noun: "vídeo" },
] as const;

export type ResourceType = (typeof RESOURCE_TYPES)[number]["value"];

const DEFAULT = RESOURCE_TYPES[0];

function entry(type?: string | null) {
  return RESOURCE_TYPES.find((t) => t.value === type) ?? DEFAULT;
}

/** "la guía" · "el proceso" — para frases como "Quiero {…}". */
export function withArticle(type?: string | null): string {
  const t = entry(type);
  return `${t.article} ${t.noun}`;
}

/** "guía" · "proceso" — el sustantivo suelto. */
export function noun(type?: string | null): string {
  return entry(type).noun;
}

/** "Te la acabo de enviar" vs "Te lo acabo de enviar". */
export function pronoun(type?: string | null): "la" | "lo" {
  return entry(type).article === "la" ? "la" : "lo";
}
