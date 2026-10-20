/** «12 may 2026» (es) / «12 May 2026» (en). Vacío si no hay fecha o no se entiende. */
export function fechaPost(iso: string | undefined, locale: string, larga = false): string {
  if (!iso) return "";
  try {
    return new Intl.DateTimeFormat(locale === "en" ? "en-GB" : "es-ES", {
      day: "numeric",
      month: larga ? "long" : "short",
      year: "numeric",
    })
      .format(new Date(iso))
      .replace(".", "");
  } catch {
    return "";
  }
}
