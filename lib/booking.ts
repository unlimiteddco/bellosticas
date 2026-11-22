/**
 * Booking quarter label, auto-derived from today's date so the "Booking · Q2
 * 2026" tags never need manual updates. Returns e.g. "Q2 2026".
 *
 * Used via next-intl's ICU interpolation: messages hold "Booking · {q}" and the
 * consuming component passes `{ q: bookingQuarter() }`.
 */
export function bookingQuarter(date: Date = new Date()): string {
  const quarter = Math.floor(date.getMonth() / 3) + 1; // Jan-Mar→1 … Oct-Dec→4
  return `Q${quarter} ${date.getFullYear()}`;
}

/**
 * Huecos libres que se anuncian en la frase de disponibilidad («Solo 1 hueco
 * libre para el Q4»), por trimestre. Para cambiarlo, se toca aquí: un
 * trimestre que no esté en la lista anuncia HUECOS_POR_DEFECTO.
 */
const HUECOS: Record<string, number> = {
  "Q4 2026": 1,
};
const HUECOS_POR_DEFECTO = 3;

export function huecosLibres(date: Date = new Date()): number {
  return HUECOS[bookingQuarter(date)] ?? HUECOS_POR_DEFECTO;
}
