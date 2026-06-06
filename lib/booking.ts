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
