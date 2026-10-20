/**
 * Quita el «// » con el que empiezan las etiquetas de la V1 («// 01 — SERVICIOS»).
 * La V2 reutiliza esos textos, pero sus etiquetas van sin barras.
 */
export const sinBarras = (s: string) => s.replace(/^\/\/\s*/, "");
