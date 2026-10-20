import { ArrowRight, Check, Minus } from "lucide-react";
import { getTranslations } from "next-intl/server";
import { Link } from "@/navigation";
import { Cabecera, LineaArriba } from "@/components/v2/servicio/Secciones";

/*
 * Versión A de la página de Precios de la V2, guardada: packs en tarjetas,
 * servicios por grupos con la tabla de niveles (esencial / avanzada / a medida)
 * y el bloque de agencias. La que se usa es la del selector (Secciones.tsx);
 * esta se puede ver en /v2/precios-a. Mismos textos: messages → v2Precios.
 */

const NS = "v2Precios";

/** El precio, en la letra de los titulares (la Crimson recta no sale en ningún otro sitio de la V2). */
function Cifra({ valor, grande = false }: { valor: string; grande?: boolean }) {
  return (
    <span
      className={`whitespace-nowrap font-medium tabular-nums leading-none tracking-[-0.04em] ${grande ? "text-[56px] md:text-[68px]" : "text-[30px] md:text-[34px]"}`}
    >
      {valor}
    </span>
  );
}

/* ───────────────────────── Packs ───────────────────────── */

type Pack = { nombre: string; texto: string; precio: string; separado: string; destacado?: boolean; incluye: string[] };

export async function PreciosPacks({ locale }: { locale: string }) {
  const t = await getTranslations({ locale, namespace: `${NS}.packs` });
  const packs = t.raw("items") as Pack[];
  return (
    <section id="packs" className="v2-frame scroll-mt-20">
      <div className="v2-rail">
        <LineaArriba />
        <Cabecera t={t} />
        <div className="grid grid-cols-1 gap-px border-t border-[var(--v2-line)] bg-[var(--v2-line)] lg:grid-cols-2">
          {packs.map((p) => (
            <article
              key={p.nombre}
              className={`flex flex-col gap-8 p-6 md:p-10 lg:p-14 ${p.destacado ? "v2-oscuro" : "bg-[var(--v2-bg)]"}`}
              data-reveal
            >
              <div className="flex flex-col gap-3">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <h3 className="text-[24px] font-medium tracking-[-0.02em] md:text-[28px]">{p.nombre}</h3>
                  {p.destacado && (
                    <span className="v2-tag">
                      {t("estrella")}
                    </span>
                  )}
                </div>
                <p className="max-w-[440px] text-[15.5px] leading-[1.55] text-[var(--v2-muted)]">{p.texto}</p>
              </div>

              <div className="flex flex-col gap-2">
                <span className="flex items-baseline gap-2.5">
                  <Cifra valor={p.precio} grande />
                  <span className="text-[13px] text-[var(--v2-muted)]">{t("sinIva")}</span>
                </span>
                <span className="text-[13.5px] text-[var(--v2-muted)]">
                  {t("separado")} <s className="decoration-[var(--v2-accent)]">{p.separado}</s>
                </span>
              </div>

              <ul className="flex flex-col border-t border-[var(--v2-line)]">
                {p.incluye.map((x) => (
                  <li key={x} className="flex items-start gap-3 border-b border-[var(--v2-line)] py-3.5 text-[15px] leading-[1.45]">
                    <Check size={15} strokeWidth={2} className="mt-[3px] shrink-0 text-[var(--v2-accent)]" />
                    {x}
                  </li>
                ))}
              </ul>

              <Link
                href="/intro"
                className={`v2-btn mt-auto self-start ${p.destacado ? "v2-btn--primary" : "v2-btn--ghost"}`}
              >
                {t("cta")}
              </Link>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ───────────────────────── Servicios ───────────────────────── */

type Servicio = {
  nombre: string;
  precio: string;
  texto: string;
  incluye: string[];
  desde?: boolean;
  consultar?: boolean;
  sufijo?: string;
  plazo?: string;
};
type Niveles = {
  nombre: string;
  texto?: string;
  plazo: string;
  columnas: { nombre: string; precio?: string }[];
  filas: { nombre: string; valores: string[] }[];
};
type Grupo = { nombre: string; texto: string; items: Servicio[]; niveles?: Niveles[] };

/** Un valor de la tabla de niveles: ✓ y — se pintan como iconos. */
function Valor({ v }: { v: string }) {
  if (v === "✓") return <Check size={16} strokeWidth={2} className="text-[var(--v2-accent)]" aria-label="Sí" />;
  if (v === "—") return <Minus size={16} strokeWidth={1.5} className="text-[var(--v2-faint)]" aria-label="No" />;
  return <>{v}</>;
}

function Plazo({ etiqueta, valor }: { etiqueta: string; valor: string }) {
  return (
    <span className="font-mono text-[11px] uppercase tracking-[0.1em] text-[var(--v2-faint)]">
      {etiqueta} · <span className="text-[var(--v2-muted)]">{valor}</span>
    </span>
  );
}

export async function PreciosServicios({ locale }: { locale: string }) {
  const t = await getTranslations({ locale, namespace: `${NS}.servicios` });
  const grupos = t.raw("grupos") as Grupo[];
  return (
    <section id="servicios" className="v2-frame scroll-mt-20">
      <div className="v2-rail">
        <LineaArriba />
        <Cabecera t={t} />
        {grupos.map((g, gi) => (
          <div key={g.nombre} className="grid grid-cols-1 border-t border-[var(--v2-line)] lg:grid-cols-12">
            {/* El grupo a la izquierda; se queda a la vista mientras bajas por sus servicios. */}
            <div className="border-b border-[var(--v2-line)] p-6 md:p-10 lg:col-span-4 lg:border-b-0 lg:border-r">
              <div className="flex flex-col gap-3 lg:sticky lg:top-28">
                <span className="font-mono text-[11px] text-[var(--v2-accent)]">{String(gi + 1).padStart(2, "0")}</span>
                <h3 className="text-[28px] font-medium tracking-[-0.025em] md:text-[34px]">{g.nombre}</h3>
                <p className="max-w-[340px] text-[15px] leading-[1.55] text-[var(--v2-muted)]">{g.texto}</p>
              </div>
            </div>

            <div className="lg:col-span-8">
              {g.items.map((s) => (
                <div
                  key={s.nombre}
                  className="flex flex-col gap-4 border-b border-[var(--v2-line)] p-6 last:border-b-0 md:p-10"
                  data-reveal
                >
                  <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between sm:gap-8">
                    <div className="flex flex-col gap-1.5">
                      <h4 className="text-[20px] font-medium tracking-[-0.015em]">{s.nombre}</h4>
                      <p className="max-w-[420px] text-[15px] leading-[1.55] text-[var(--v2-muted)]">{s.texto}</p>
                    </div>
                    <span className="flex shrink-0 items-baseline gap-2 sm:flex-col sm:items-end sm:gap-1">
                      {s.desde && <span className="text-[13px] text-[var(--v2-muted)]">{t("desde")}</span>}
                      <Cifra valor={s.precio} />
                      {s.sufijo && <span className="text-[13px] text-[var(--v2-muted)]">{s.sufijo}</span>}
                    </span>
                  </div>
                  <ul className="flex flex-wrap gap-x-5 gap-y-2">
                    {s.incluye.map((x) => (
                      <li key={x} className="flex items-center gap-2 text-[14px]">
                        <Check size={13} strokeWidth={2} className="shrink-0 text-[var(--v2-accent)]" />
                        {x}
                      </li>
                    ))}
                  </ul>
                  {s.plazo && <Plazo etiqueta={t("plazo")} valor={s.plazo} />}
                </div>
              ))}

              {g.niveles?.map((n) => (
                <div key={n.nombre} className="flex flex-col gap-5 border-t border-[var(--v2-line)] p-6 md:p-10" data-reveal>
                  <div className="flex flex-wrap items-baseline justify-between gap-3">
                    <h4 className="text-[20px] font-medium tracking-[-0.015em]">{n.nombre}</h4>
                    <Plazo etiqueta={t("plazo")} valor={n.plazo} />
                  </div>
                  {/* En el móvil, un bloque por nivel en vez de la tabla. */}
                  <div className="flex flex-col gap-px border-y border-[var(--v2-line)] bg-[var(--v2-line)] md:hidden">
                    {n.columnas.map((c, ci) => (
                      <div key={c.nombre} className={`flex flex-col gap-4 py-5 ${ci === 1 ? "bg-[var(--v2-hover)] -mx-6 px-6" : "bg-[var(--v2-bg)]"}`}>
                        <div className="flex items-baseline justify-between gap-4">
                          <span className="v2-label">{c.nombre}</span>
                          {c.precio ? (
                            <Cifra valor={c.precio} />
                          ) : (
                            <span className="text-[15px] text-[var(--v2-muted)]">{t("aPresupuesto")}</span>
                          )}
                        </div>
                        <ul className="flex flex-col gap-2 text-[14.5px]">
                          {n.filas.map((f) => {
                            const v = f.valores[ci];
                            if (v === "—") return null;
                            return (
                              <li key={f.nombre} className="flex items-start gap-2.5">
                                <Check size={14} strokeWidth={2} className="mt-[3px] shrink-0 text-[var(--v2-accent)]" />
                                {v === "✓" ? f.nombre : `${f.nombre}: ${v}`}
                              </li>
                            );
                          })}
                        </ul>
                      </div>
                    ))}
                  </div>
                  <div className="hidden md:block">
                    <table className="w-full border-collapse text-left text-[14.5px]">
                      <thead>
                        <tr className="border-y border-[var(--v2-line)]">
                          <th className="w-[38%] py-4 pr-4 font-normal" />
                          {n.columnas.map((c, ci) => (
                            <th
                              key={c.nombre}
                              scope="col"
                              className={`px-4 py-4 align-bottom font-normal ${ci === 1 ? "bg-[var(--v2-hover)]" : ""}`}
                            >
                              <span className="v2-label block pb-2">{c.nombre}</span>
                              {c.precio ? (
                                <Cifra valor={c.precio} />
                              ) : (
                                <span className="text-[15px] text-[var(--v2-muted)]">{t("aPresupuesto")}</span>
                              )}
                            </th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {n.filas.map((f) => (
                          <tr key={f.nombre} className="border-b border-[var(--v2-line)]">
                            <th scope="row" className="py-3.5 pr-4 font-normal text-[var(--v2-muted)]">
                              {f.nombre}
                            </th>
                            {f.valores.map((v, vi) => (
                              <td key={vi} className={`px-4 py-3.5 ${vi === 1 ? "bg-[var(--v2-hover)]" : ""}`}>
                                <Valor v={v} />
                              </td>
                            ))}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

/* ───────────────────────── Agencias ───────────────────────── */

export async function PreciosAgencias({ locale }: { locale: string }) {
  const t = await getTranslations({ locale, namespace: `${NS}.agencias` });
  return (
    <section className="v2-frame">
      <div className="v2-rail">
        <LineaArriba />
        <div className="flex flex-col gap-6 p-6 md:p-10 lg:flex-row lg:items-center lg:justify-between lg:gap-12 lg:p-14" data-reveal>
          <div className="flex flex-col gap-3">
            <span className="v2-label">{t("label")}</span>
            <h2 className="text-[28px] font-medium tracking-[-0.025em] md:text-[36px]">{t("title")}</h2>
            <p className="max-w-[560px] text-[15.5px] leading-[1.6] text-[var(--v2-muted)]">{t("texto")}</p>
          </div>
          <Link href="/services/white-label" className="v2-btn v2-btn--ghost shrink-0 self-start lg:self-center">
            {t("cta")} <ArrowRight size={14} />
          </Link>
        </div>
      </div>
    </section>
  );
}
