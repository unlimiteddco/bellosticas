/**
 * Motor de precios y estimaciones del configurador de SEO local (/seo-local).
 *
 * ⚙️ TODO ES AJUSTABLE AQUÍ SIN TOCAR CÓDIGO:
 *  - BASE_MONTHLY / TIERS / MIN_MONTHLY → la cuota mensual.
 *  - NICHES → añade/quita nichos, su competencia, ticket medio y leads
 *    esperados por localidad al mes (en madurez).
 *  - MONTHS_BY_COMPETITION → meses hasta ver resultados.
 *
 * Las estimaciones son horquillas orientativas y así se comunican en la UI.
 */

/** "aragon" | "espana" | clave de comunidad autónoma (p. ej. "cataluna") */
export type Scope = string;
export type Competition = "baja" | "media" | "alta";

/** Comunidades autónomas para el buscador del paso "¿Dónde quieres aparecer?" */
export const REGIONS: { key: string; label: string }[] = [
  { key: "andalucia", label: "Andalucía" },
  { key: "cataluna", label: "Cataluña" },
  { key: "madrid", label: "Comunidad de Madrid" },
  { key: "valencia", label: "Comunidad Valenciana" },
  { key: "galicia", label: "Galicia" },
  { key: "castilla-leon", label: "Castilla y León" },
  { key: "castilla-la-mancha", label: "Castilla-La Mancha" },
  { key: "pais-vasco", label: "País Vasco" },
  { key: "canarias", label: "Canarias" },
  { key: "murcia", label: "Región de Murcia" },
  { key: "baleares", label: "Islas Baleares" },
  { key: "extremadura", label: "Extremadura" },
  { key: "asturias", label: "Asturias" },
  { key: "navarra", label: "Navarra" },
  { key: "cantabria", label: "Cantabria" },
  { key: "la-rioja", label: "La Rioja" },
];

/** Etiqueta humana del ámbito (para guardar y mostrar). */
export function scopeLabel(scope: Scope): string {
  if (scope === "aragon") return "Aragón";
  if (scope === "espana") return "Toda España";
  return REGIONS.find((r) => r.key === scope)?.label ?? scope;
}

/** Guía del selector de localidades: qué significa cada cantidad. */
export const LOCALITY_HINTS: Record<number, string> = {
  15: "Para empezar",
  25: "Tu provincia",
  40: "Varias provincias",
  60: "Región completa",
};
export const RECOMMENDED_LOCALITIES = 25;

export type Niche = {
  key: string;
  label: string;
  /** Emoji del selector (visual, sin assets) */
  emoji: string;
  competition: Competition;
  /** Ticket medio de un trabajo/cliente del nicho (€) — para la amortización */
  avgTicket: number;
  /** Leads/mes esperados POR LOCALIDAD una vez posicionado [min, max] */
  leadsPerLocality: [number, number];
};

export const NICHES: Niche[] = [
  { key: "cerrajero", label: "Cerrajería", emoji: "🔑", competition: "alta", avgTicket: 120, leadsPerLocality: [1, 3] },
  { key: "desatascos", label: "Desatascos", emoji: "🚿", competition: "alta", avgTicket: 180, leadsPerLocality: [1, 3] },
  { key: "reformas", label: "Reformas", emoji: "🧱", competition: "media", avgTicket: 2500, leadsPerLocality: [0.3, 1] },
  { key: "fontaneria", label: "Fontanería", emoji: "🔧", competition: "media", avgTicket: 150, leadsPerLocality: [1, 2.5] },
  { key: "electricista", label: "Electricistas", emoji: "⚡", competition: "media", avgTicket: 140, leadsPerLocality: [1, 2.5] },
  { key: "clinica-dental", label: "Clínica dental", emoji: "🦷", competition: "alta", avgTicket: 400, leadsPerLocality: [0.5, 1.5] },
  { key: "fisioterapia", label: "Fisioterapia", emoji: "💆", competition: "baja", avgTicket: 60, leadsPerLocality: [0.5, 2] },
  { key: "abogados", label: "Abogados", emoji: "⚖️", competition: "alta", avgTicket: 600, leadsPerLocality: [0.3, 1] },
  { key: "mudanzas", label: "Mudanzas", emoji: "📦", competition: "media", avgTicket: 450, leadsPerLocality: [0.5, 1.5] },
  { key: "otro", label: "Otro nicho", emoji: "✳️", competition: "media", avgTicket: 200, leadsPerLocality: [0.5, 1.5] },
];

/**
 * Tabla de precios por nº de localidades — ambos números explícitos para
 * control total del "acabado" de marketing (99, 159… nada de redondos).
 *
 * `launch` = cuota de los primeros meses (oferta de lanzamiento, el precio
 * gancho que se muestra en grande). `monthly` = cuota a partir del 3er mes.
 * Calibrada con cliente real: 60 localidades top de Aragón ≈ 300 €/mes.
 */
const PRICING: Record<number, { launch: number; monthly: number }> = {
  15: { launch: 79, monthly: 99 },
  25: { launch: 129, monthly: 159 },
  40: { launch: 179, monthly: 229 },
  60: { launch: 239, monthly: 299 },
};

/** Meses que dura la cuota de lanzamiento. */
export const LAUNCH_MONTHS = 2;

/** Meses hasta ver resultados según competencia del nicho [min, max] */
const MONTHS_BY_COMPETITION: Record<Competition, [number, number]> = {
  baja: [3, 5],
  media: [4, 7],
  alta: [6, 9],
};

export const LOCALITY_OPTIONS = [15, 25, 40, 60] as const;

export type QuoteInput = {
  nicheKey: string;
  scope: Scope;
  localities: number;
};

export type QuoteResult = {
  niche: Niche;
  scope: Scope;
  localities: number;
  monthlyPrice: number;
  /** Cuota de los primeros meses (oferta de lanzamiento) */
  launchPrice: number;
  discountMonths: number;
  discountPercent: number;
  monthsToResultsMin: number;
  monthsToResultsMax: number;
  leadsMin: number;
  leadsMax: number;
  /** Trabajos/mes del nicho necesarios para cubrir la cuota */
  breakEvenJobs: number;
};

export function calcQuote(input: QuoteInput): QuoteResult {
  const niche = NICHES.find((n) => n.key === input.nicheKey) ?? NICHES[NICHES.length - 1];
  const localities = Math.max(1, Math.round(input.localities));

  // Cuota por tabla; si llegara un valor fuera de las opciones, se usa el
  // escalón inmediatamente superior (o el máximo).
  const steps = Object.keys(PRICING)
    .map(Number)
    .sort((a, b) => a - b);
  const step = steps.find((v) => localities <= v) ?? steps[steps.length - 1];
  const { monthly: monthlyPrice, launch: launchPrice } = PRICING[step];

  const [mMin, mMax] = MONTHS_BY_COMPETITION[niche.competition];
  // A escala nacional el abanico de dificultad se abre un poco
  const monthsToResultsMax = input.scope === "espana" ? mMax + 1 : mMax;

  const leadsMin = Math.max(1, Math.round(niche.leadsPerLocality[0] * localities));
  const leadsMax = Math.max(leadsMin + 1, Math.round(niche.leadsPerLocality[1] * localities));

  const breakEvenJobs = Math.max(1, Math.ceil(monthlyPrice / niche.avgTicket));

  return {
    niche,
    scope: input.scope,
    localities,
    monthlyPrice,
    launchPrice,
    discountMonths: LAUNCH_MONTHS,
    discountPercent: Math.round((1 - launchPrice / monthlyPrice) * 100),
    monthsToResultsMin: mMin,
    monthsToResultsMax,
    leadsMin,
    leadsMax,
    breakEvenJobs,
  };
}
