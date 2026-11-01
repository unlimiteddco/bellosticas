import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Check } from "lucide-react";
import { V2Root } from "@/components/v2/V2Root";
import { BotonComprar } from "@/components/sections/tienda/BotonComprar";
import { CabeceraTienda } from "@/components/sections/tienda/MarcoTienda";
import { fichaProducto } from "@/lib/tienda";
import { CONTENIDO, T, euros, idiomaDe } from "@/lib/tienda-textos";

/*
 * Landing de venta de un producto digital (bellostas.studio/tienda/<slug>).
 * Mismo planteamiento que las de los lead magnets (/g/…): sin menú, móvil
 * primero (casi todo llega del navegador de Instagram) y un solo objetivo,
 * comprar. El precio sale del CRM, que es quien cobra; los textos, en
 * español e inglés, de lib/tienda-textos.ts.
 */
export const dynamic = "force-dynamic";

export async function generateMetadata({ params }: { params: Promise<{ slug: string; locale: string }> }): Promise<Metadata> {
  const { slug, locale } = await params;
  const c = CONTENIDO[slug]?.[idiomaDe(locale)];
  return {
    title: c ? `${c.titulo} · Bellostas Studio` : "Bellostas Studio",
    description: c?.subtitulo,
    robots: { index: false, follow: false },
  };
}

export default async function ProductoPage({ params }: { params: Promise<{ slug: string; locale: string }> }) {
  const { slug, locale } = await params;
  const idioma = idiomaDe(locale);
  const c = CONTENIDO[slug]?.[idioma];
  if (!c) notFound();
  const t = T[idioma];
  const ficha = await fichaProducto(slug);
  const precio = ficha ? euros(ficha.importe, idioma) : null;
  const hasta = ficha?.lanzamientoHasta
    ? new Intl.DateTimeFormat(idioma === "en" ? "en-GB" : "es-ES", { day: "numeric", month: "long", timeZone: "Europe/Madrid" }).format(
        new Date(ficha.lanzamientoHasta),
      )
    : null;

  const compra = (
    <div className="v2-card flex flex-col gap-4 p-5 lg:p-6">
      <div className="flex items-end justify-between gap-3">
        <div>
          <p className="v2-label">{t.pagoUnico}</p>
          <p className="mt-1 flex items-baseline gap-2">
            <span className="text-[44px] font-medium leading-none tracking-[-0.03em]">{precio ?? "—"}</span>
            {ficha && ficha.normal > ficha.importe && (
              <span className="text-[18px] text-[var(--v2-faint)] line-through">{euros(ficha.normal, idioma)}</span>
            )}
          </p>
        </div>
        <span className="pb-1 text-right text-[12.5px] text-[var(--v2-muted)]">{t.iva}</span>
      </div>
      {hasta && (
        <p className="border-l-2 border-[var(--v2-accent)] pl-3 text-[14px] leading-[1.45]">
          {t.lanzamiento(hasta, euros(ficha!.normal, idioma))}
        </p>
      )}
      <BotonComprar producto={slug} precio={precio ?? ""} disponible={Boolean(ficha?.disponible && precio)} idioma={idioma} />
    </div>
  );

  return (
    <V2Root>
      <div className="flex min-h-dvh flex-col">
        <CabeceraTienda />

        <main className="v2-frame flex-1">
          {/* ── Qué es, la imagen y la compra ── */}
          <div className="v2-rail grid grid-cols-1 lg:grid-cols-12">
            <div className="flex flex-col gap-6 px-6 pb-8 pt-10 text-center lg:col-span-7 lg:border-r lg:border-[var(--v2-line)] lg:px-12 lg:pb-14 lg:pt-16 lg:text-left">
              <div className="v2-hero-in flex justify-center lg:justify-start">
                <span className="v2-tag">{c.etiqueta}</span>
              </div>
              <h1 className="v2-hero-in v2-h1 v2-h1--doc" style={{ animationDelay: "80ms" }}>
                {c.titulo}
              </h1>
              <p
                className="v2-hero-in mx-auto max-w-[560px] text-[16px] leading-[1.6] text-[var(--v2-muted)] lg:mx-0 lg:text-[18px]"
                style={{ animationDelay: "160ms" }}
              >
                {c.subtitulo}
              </p>
              <div
                className="v2-hero-in overflow-hidden rounded-[8px] border border-[var(--v2-line)] bg-[#070504] shadow-[0_30px_60px_-40px_rgba(29,29,27,0.45)]"
                style={{ animationDelay: "220ms" }}
              >
                <img src={c.capturas[0].src} alt={c.capturas[0].alt} width={1600} height={1000} className="block h-auto w-full" />
              </div>
            </div>

            <div className="px-6 pb-12 lg:col-span-5 lg:px-10 lg:pb-14 lg:pt-16">
              <div className="v2-hero-in flex flex-col gap-6 lg:sticky lg:top-8" style={{ animationDelay: "260ms" }}>
                {compra}
                <div>
                  <p className="v2-label mb-2">{t.queIncluye}</p>
                  <ul className="flex flex-col border-t border-[var(--v2-line)]">
                    {c.incluye.map((b, i) => (
                      <li key={b} className="flex items-start gap-4 border-b border-[var(--v2-line)] py-3">
                        <span className="mt-[3px] font-mono text-[11px] text-[var(--v2-accent)]">{String(i + 1).padStart(2, "0")}</span>
                        <span className="flex-1 text-[15px] leading-[1.5]">{b}</span>
                        <Check size={15} strokeWidth={2} className="mt-[3px] shrink-0 text-[var(--v2-accent)]" />
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </div>

          {/* ── Más capturas ── */}
          <div className="v2-sep" />
          <section className="grid grid-cols-2 gap-3 px-6 py-10 lg:grid-cols-4 lg:gap-4 lg:px-10">
            {c.capturas.slice(1).map((s) => (
              <figure
                key={s.src}
                className={`overflow-hidden rounded-[8px] border border-[var(--v2-line)] bg-[#070504] ${s.movil ? "" : "col-span-2"}`}
              >
                <img src={s.src} alt={s.alt} loading="lazy" className="block h-full w-full object-cover object-top" />
              </figure>
            ))}
          </section>

          {/* ── Qué necesitas y preguntas ── */}
          <div className="v2-sep" />
          <section className="grid grid-cols-1 lg:grid-cols-12">
            <div className="px-6 py-10 lg:col-span-5 lg:border-r lg:border-[var(--v2-line)] lg:px-10">
              <h2 className="v2-label mb-4">{t.queNecesitas}</h2>
              <ul className="flex flex-col gap-3 text-[15px] leading-[1.55]">
                {c.necesitas.map((n) => (
                  <li key={n} className="flex gap-3">
                    <span className="mt-[9px] h-[5px] w-[5px] shrink-0 bg-[var(--v2-accent)]" />
                    {n}
                  </li>
                ))}
              </ul>
            </div>
            <div className="px-6 pb-10 lg:col-span-7 lg:px-10 lg:pt-10">
              <h2 className="v2-label mb-2">{t.preguntas}</h2>
              <div className="border-t border-[var(--v2-line)]">
                {c.faq.map((f) => (
                  <details key={f.p} className="group border-b border-[var(--v2-line)]">
                    <summary className="flex cursor-pointer list-none items-center justify-between gap-4 py-4 text-[16px] font-medium">
                      {f.p}
                      <span className="text-[20px] leading-none text-[var(--v2-accent)] transition-transform group-open:rotate-45">+</span>
                    </summary>
                    <p className="pb-4 text-[15px] leading-[1.6] text-[var(--v2-muted)]">
                      {f.r}
                      {f.contacto && (
                        <>
                          {" "}
                          <a href={t.contacto} className="text-[var(--v2-text)] underline underline-offset-2">
                            {t.irContacto}
                          </a>
                        </>
                      )}
                    </p>
                  </details>
                ))}
              </div>
            </div>
          </section>

          {/* ── Otra vez la compra, al final, para quien lo ha leído todo ── */}
          <div className="v2-sep" />
          <section className="mx-auto max-w-[520px] px-6 py-10">{compra}</section>

          {/* ── Condiciones de venta ── */}
          <div className="v2-sep" />
          <section id="condiciones" className="px-6 py-10 text-[13.5px] leading-[1.6] text-[var(--v2-muted)] lg:px-10">
            <h2 className="v2-label mb-3">{t.condiciones}</h2>
            <div className="max-w-[760px] space-y-2">
              {t.condicionesTexto.map((parrafo) => (
                <p key={parrafo[0]}>
                  {parrafo.length === 3 ? (
                    <>
                      {parrafo[0]}
                      <a href={t.legal} className="underline underline-offset-2">
                        {parrafo[1]}
                      </a>
                      {parrafo[2]}
                    </>
                  ) : (
                    parrafo[0]
                  )}
                </p>
              ))}
            </div>
          </section>
        </main>

        <footer className="border-t border-[var(--v2-line)]">
          <div className="v2-frame">
            <p className="flex flex-wrap items-center justify-center gap-x-4 px-6 py-5 text-[12.5px] text-[var(--v2-muted)] lg:justify-between lg:px-10">
              <span>© {new Date().getFullYear()} Bellostas Studio</span>
              <span className="flex gap-4">
                <a href={t.legal} className="underline-offset-2 hover:text-[var(--v2-text)] hover:underline">
                  {t.avisoLegal}
                </a>
                <a href={idioma === "en" ? "/en/privacidad" : "/privacidad"} className="underline-offset-2 hover:text-[var(--v2-text)] hover:underline">
                  {t.privacidad}
                </a>
              </span>
            </p>
          </div>
        </footer>
      </div>
    </V2Root>
  );
}
