"use client";

import { useEffect, useState } from "react";
import { ArrowRight, ArrowUpRight, Check } from "lucide-react";
import { Link } from "@/navigation";
import { sonarClic, sonarHover } from "@/lib/v2/ui-sound";
import { ICONOS_CATALOGO } from "./iconos-catalogo";

type Destino = React.ComponentProps<typeof Link>["href"];


export type ItemCatalogo = {
  clave: string;
  icono: keyof typeof ICONOS_CATALOGO;
  nombre: string;
  texto: string;
  entregables: string[];
  /** «3.900 €»; con `desde`, va precedido de «Desde». Sin precio: `precioTexto`. */
  precio?: string;
  desde?: boolean;
  sufijo?: string;
  precioTexto?: string;
  plazo?: string;
  /** Su página de servicio, si la tiene. */
  href?: Destino;
  /** Su opción en la página de precios. */
  precios?: Destino;
  media: { video?: string; img?: string };
  caso?: { nombre: string; href: Destino };
};

export type EtiquetasCatalogo = {
  servicios: string;
  entregamos: string;
  desde: string;
  plazo: string;
  verServicio: string;
  verPrecios: string;
  caso: string;
};

/** El precio de una línea: «Desde 3.900 € / mes» o el texto que lo sustituye. */
function precioDe(it: ItemCatalogo, e: EtiquetasCatalogo) {
  if (!it.precio) return it.precioTexto ?? null;
  return `${it.desde ? `${e.desde} ` : ""}${it.precio}${it.sufijo ? ` ${it.sufijo}` : ""}`;
}

/** La pieza visual de un servicio: su vídeo (solo se carga el que está abierto) o su imagen. */
function Pieza({ it, on, className = "" }: { it: ItemCatalogo; on: boolean; className?: string }) {
  return it.media.video ? (
    <video
      src={on ? it.media.video : undefined}
      autoPlay
      muted
      loop
      playsInline
      className={`absolute inset-0 h-full w-full object-cover ${className}`}
    />
  ) : it.media.img ? (
    <img src={it.media.img} alt="" loading="lazy" className={`absolute inset-0 h-full w-full object-cover ${className}`} />
  ) : null;
}

/**
 * Un grupo del catálogo de servicios: cabecera grande («01 · 3 servicios /
 * Diseño y web») y, debajo, los servicios en acordeón a la izquierda con la
 * pieza del abierto a la derecha, fija mientras se baja (como en DesignMe). En
 * móvil la pieza va dentro de cada servicio. El índice de arriba enlaza a
 * #s-clave y aquí se abre ese servicio.
 */
export function GrupoCatalogo({
  id,
  numero,
  nombre,
  texto,
  items,
  etiquetas: e,
  oscuro = false,
}: {
  id: string;
  numero: string;
  nombre: string;
  texto: string;
  items: ItemCatalogo[];
  etiquetas: EtiquetasCatalogo;
  oscuro?: boolean;
}) {
  const [abierto, setAbierto] = useState(0);
  // Con todo cerrado, la pieza se queda en el primero.
  const visible = abierto >= 0 ? abierto : 0;
  const activo = items[visible];

  // Al llegar desde el índice (#s-ecommerce), se abre ese servicio.
  useEffect(() => {
    const abrir = () => {
      const i = items.findIndex((it) => `#s-${it.clave}` === window.location.hash);
      if (i < 0) return;
      setAbierto(i);
      // Al abrirse uno y cerrarse otro, la lista cambia de alto: se vuelve a
      // colocar el servicio arriba cuando termina la animación.
      window.setTimeout(() => document.getElementById(`s-${items[i].clave}`)?.scrollIntoView({ behavior: "smooth", block: "start" }), 480);
    };
    abrir();
    window.addEventListener("hashchange", abrir);
    return () => window.removeEventListener("hashchange", abrir);
  }, [items]);

  return (
    <section
      id={id}
      className={`scroll-mt-20 ${oscuro ? "v2-oscuro" : ""}`}
      {...(oscuro ? { "data-header-tone": "dark" } : {})}
    >
      <div className="v2-frame">
        <div className="v2-rail">
          {!oscuro && <span aria-hidden data-draw className="pointer-events-none absolute left-0 right-0 top-0 h-px bg-[var(--v2-line)]" />}

          <header className="grid grid-cols-1 gap-6 border-b border-[var(--v2-line)] px-6 pb-10 pt-16 md:px-10 lg:grid-cols-12 lg:items-end lg:px-14 lg:pb-14 lg:pt-24">
            <div className="flex flex-col gap-5 lg:col-span-8">
              <span className="v2-label" data-reveal>
                {numero} · {items.length} {e.servicios}
              </span>
              <h2
                className="text-[44px] font-medium leading-[0.98] tracking-[-0.045em] sm:text-[60px] lg:text-[84px]"
                data-reveal
              >
                {nombre}
                <span className="text-[var(--v2-accent)]">.</span>
              </h2>
            </div>
            <p className="max-w-[420px] text-[16px] leading-[1.6] text-[var(--v2-muted)] lg:col-span-4 lg:justify-self-end" data-reveal>
              {texto}
            </p>
          </header>

          <div className="grid grid-cols-1 lg:grid-cols-12">
            <ul className="lg:col-span-6 lg:border-r lg:border-[var(--v2-line)]">
              {items.map((it, i) => {
                const on = abierto === i;
                const Icono = ICONOS_CATALOGO[it.icono];
                const precio = precioDe(it, e);
                return (
                  <li key={it.clave} id={`s-${it.clave}`} className="scroll-mt-24 border-b border-[var(--v2-line)] last:border-b-0" data-reveal>
                    <button
                      type="button"
                      aria-expanded={on}
                      aria-controls={`s-${it.clave}-panel`}
                      onPointerEnter={(ev) => ev.pointerType === "mouse" && sonarHover(i)}
                      onClick={() => {
                        sonarClic(on ? "close" : "open", i);
                        setAbierto(on ? -1 : i);
                      }}
                      className="group flex w-full items-center gap-4 px-6 py-6 text-left md:gap-5 md:px-10 md:py-7"
                    >
                      <span
                        className={`w-7 shrink-0 font-mono text-[13px] transition-colors ${
                          on ? "text-[var(--v2-accent)]" : "text-[var(--v2-muted)] group-hover:text-[var(--v2-accent)]"
                        }`}
                      >
                        {String(i + 1).padStart(2, "0")}
                      </span>
                      <span
                        className={`v2-ico v2-ico--lg transition-colors ${on ? "!bg-[var(--v2-text)] !text-[var(--v2-bg)]" : ""}`}
                      >
                        <Icono size={18} strokeWidth={1.75} />
                      </span>
                      <span className="flex min-w-0 flex-1 flex-col gap-1">
                        <span className="text-[21px] font-medium leading-[1.15] tracking-[-0.02em] md:text-[26px]">{it.nombre}</span>
                        {precio && <span className="text-[13.5px] text-[var(--v2-muted)] md:hidden">{precio}</span>}
                      </span>
                      {precio && (
                        <span className="hidden whitespace-nowrap text-[14px] tabular-nums text-[var(--v2-muted)] md:block">{precio}</span>
                      )}
                      <span
                        aria-hidden
                        className={`relative ml-1 h-4 w-4 shrink-0 transition-transform duration-500 ease-[var(--v2-ease)] ${on ? "rotate-45" : "group-hover:rotate-90"}`}
                      >
                        <span className="absolute left-0 top-1/2 h-px w-full -translate-y-1/2 bg-[var(--v2-accent)]" />
                        <span className="absolute left-1/2 top-0 h-full w-px -translate-x-1/2 bg-[var(--v2-accent)]" />
                      </span>
                    </button>

                    <div
                      id={`s-${it.clave}-panel`}
                      className="grid transition-[grid-template-rows] duration-[450ms] ease-[var(--v2-ease)]"
                      style={{ gridTemplateRows: on ? "1fr" : "0fr" }}
                    >
                      <div className="overflow-hidden" inert={!on}>
                        <div
                          className={`flex flex-col gap-6 px-6 pb-9 transition-[opacity,transform] duration-500 md:px-10 md:pl-[104px] ${
                            on ? "translate-y-0 opacity-100" : "translate-y-1.5 opacity-0"
                          }`}
                        >
                          {/* En móvil, la pieza va aquí; en escritorio, en la columna fija. */}
                          <div className="relative aspect-[16/10] overflow-hidden rounded-[6px] border border-[var(--v2-line)] bg-[var(--v2-bg-2)] lg:hidden">
                            <Pieza it={it} on={on} />
                          </div>
                          <p className="max-w-[520px] text-[16px] leading-[1.6]">{it.texto}</p>
                          <div className="flex flex-col gap-3">
                            <span className="v2-label !text-[10px]">{e.entregamos}</span>
                            <ul className="grid grid-cols-1 gap-x-6 sm:grid-cols-2">
                              {it.entregables.map((x) => (
                                <li key={x} className="flex items-center gap-2.5 border-t border-[var(--v2-line)] py-2.5 text-[14.5px] text-[var(--v2-muted)]">
                                  <Check size={14} strokeWidth={2} className="shrink-0 text-[var(--v2-accent)]" />
                                  {x}
                                </li>
                              ))}
                            </ul>
                          </div>
                          {it.plazo && (
                            <p className="text-[14px] text-[var(--v2-muted)]">
                              <span className="text-[var(--v2-text)]">{e.plazo}:</span> {it.plazo}
                            </p>
                          )}
                          <div className="flex flex-wrap items-center gap-x-5 gap-y-3">
                            {it.href && (
                              <Link href={it.href} className="v2-btn v2-btn--primary v2-btn--sm" onClick={() => sonarClic("select")}>
                                {e.verServicio} <ArrowRight size={14} />
                              </Link>
                            )}
                            {it.precios && (
                              <Link
                                href={it.precios}
                                className={
                                  it.href
                                    ? "v2-link text-[var(--v2-muted)] hover:text-[var(--v2-text)]"
                                    : "v2-btn v2-btn--primary v2-btn--sm"
                                }
                                onClick={() => sonarClic("select")}
                              >
                                {e.verPrecios} <ArrowRight size={13} />
                              </Link>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  </li>
                );
              })}
            </ul>

            {/* La pieza del servicio abierto, fija mientras se recorre la lista. */}
            <div className="hidden p-10 lg:col-span-6 lg:block">
              <div className="sticky top-24 flex flex-col gap-4">
                <div className="relative aspect-[4/3] overflow-hidden rounded-[8px] border border-[var(--v2-line)] bg-[var(--v2-bg-2)]">
                  {items.map((it, i) => (
                    <div
                      key={it.clave}
                      aria-hidden={it !== activo}
                      className={`absolute inset-0 transition-[opacity,transform] duration-700 ease-[var(--v2-ease)] ${
                        it === activo ? "scale-100 opacity-100" : "scale-[1.02] opacity-0"
                      }`}
                    >
                      <Pieza it={it} on={i === visible} />
                    </div>
                  ))}
                  {activo && <span className="v2-tag absolute left-4 top-4 z-10">{activo.nombre}</span>}
                </div>
                {activo?.caso && (
                  <Link href={activo.caso.href} className="v2-link self-start text-[14px]">
                    {e.caso} · {activo.caso.nombre} <ArrowUpRight size={14} className="text-[var(--v2-accent)]" />
                  </Link>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
