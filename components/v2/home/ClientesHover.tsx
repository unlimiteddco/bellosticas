"use client";

import { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import { Link } from "@/navigation";
import { sonarHover } from "@/lib/v2/ui-sound";

/*
 * BORRADOR. Los clientes en celdas fijas (con las líneas de la V2) y, al pasar
 * el ratón (o al tocar, en el móvil), una tarjeta que dice quiénes son y qué
 * les hicimos. Una sola tarjeta que se desliza de un logo a otro, como la
 * píldora del menú: se lee como un recorrido, no como ocho avisos sueltos.
 *
 * Los textos marcados «por completar» no se pueden publicar así: son huecos
 * que tiene que rellenar Antonio. Nada aquí se inventa.
 */

type Texto = { es: string; en: string };
type Cliente = {
  nombre: string;
  /** null = sin logo todavía: sale el nombre escrito */
  logo: string | null;
  /**
   * Cliente que aún no se puede enseñar: logo ya emborronado (la web no lleva
   * el de verdad), etiqueta «Próximamente» y tarjeta sin nombre.
   */
  pronto?: boolean;
  /** En modo oscuro, ¿se ve bien en su color? Los de tinta oscura se quedan en blanco. */
  colorEnOscuro?: boolean;
  alto: number;
  /** Ancho / alto del logo: para darle width y height y que no salte al cargar. */
  ratio?: number;
  quien: Texto | null;
  /** Lo que les hicimos, en tarjetitas como las etiquetas de los casos. */
  hicimos: Texto[] | null;
  /** caso publicado en /work */
  caso?: string;
};

const CLIENTES: Cliente[] = [
  {
    // De momento sin nombre ni logo legible: se anuncia como «Próximamente».
    nombre: "Nuevo cliente",
    logo: "/client-logos/digital-green-pronto.png",
    ratio: 4.562,
    pronto: true,
    alto: 48,
    quien: {
      es: "El mayor partner de Google en España ya trabaja con nosotros. Muy pronto podremos enseñarlo.",
      en: "Google's largest partner in Spain already works with us. We'll be able to show it very soon.",
    },
    hicimos: [
      { es: "Branding", en: "Branding" },
      { es: "Web", en: "Website" },
      { es: "Vídeo", en: "Video" },
    ],
  },
  {
    nombre: "Social11",
    logo: "/client-logos/logo-social11-footer.svg",
    ratio: 3.897,
    alto: 28,
    quien: {
      es: "Agencia de más de 20 personas que nos confía sus proyectos web.",
      en: "A 20+ person agency that trusts us with its web projects.",
    },
    hicimos: [{ es: "Marca blanca", en: "White label" }],
  },
  {
    nombre: "Lacía",
    logo: "/client-logos/lacia.svg",
    ratio: 2.855,
    colorEnOscuro: true,
    alto: 25,
    quien: {
      es: "Agencia de branding de Madrid que trabaja para Nestlé, Granini o Almax.",
      en: "Madrid branding agency working for Nestlé, Granini and Almax.",
    },
    hicimos: [
      { es: "Desarrollo a medida", en: "Custom development" },
      { es: "3D", en: "3D" },
    ],
  },
  {
    nombre: "Teleadhesivo",
    logo: "/client-logos/logo-teleadhesivo-tablet.svg",
    ratio: 2.066,
    colorEnOscuro: true,
    alto: 40,
    quien: { es: "E-commerce de vinilos a medida con más de medio millón de clientes.", en: "Custom vinyl e-commerce with over half a million customers." },
    hicimos: [{ es: "Rediseño web", en: "Website redesign" }],
    caso: "teleadhesivo",
  },
  {
    nombre: "FADA",
    logo: "/client-logos/fada-web.svg",
    ratio: 2.602,
    alto: 36,
    quien: { es: "Federación Aragonesa de Automovilismo.", en: "Aragon's motorsport federation." },
    hicimos: [
      { es: "Web institucional", en: "Institutional site" },
      { es: "Competiciones y federados", en: "Events and members" },
    ],
    caso: "fada",
  },
  {
    nombre: "Embroidery Download",
    logo: "/client-logos/embroideydownload.svg",
    ratio: 7.888,
    alto: 22,
    quien: { es: "E-commerce con más de 40.000 pedidos y en 5 idiomas.", en: "E-commerce with 40,000+ orders in 5 languages." },
    hicimos: [
      { es: "E-commerce", en: "E-commerce" },
      { es: "Migración", en: "Migration" },
    ],
    caso: "embroidery-download",
  },
  {
    nombre: "Noal Design",
    logo: "/client-logos/noal-design-hero-1.svg",
    ratio: 2.586,
    alto: 32,
    quien: { es: "Grupo Noal, que trabaja para Adidas, Nike o Würth.", en: "Grupo Noal, working for Adidas, Nike and Würth." },
    hicimos: [{ es: "Rediseño web", en: "Website redesign" }],
  },
  {
    nombre: "GottenGym",
    logo: "/client-logos/gottengym.svg",
    ratio: 4.848,
    alto: 24,
    quien: { es: "Gimnasio deportivo premium en Huesca.", en: "Premium sports gym in Huesca." },
    hicimos: [{ es: "Rediseño web", en: "Website redesign" }],
    caso: "gotten-gym",
  },
];

const ANCHO_TARJETA = 300;

export function ClientesHover() {
  const t = useTranslations("logos");
  const locale = useLocale() === "en" ? "en" : "es";
  const caja = useRef<HTMLDivElement>(null);
  const celdas = useRef<(HTMLButtonElement | null)[]>([]);
  const [activo, setActivo] = useState<number | null>(null);
  const [pos, setPos] = useState<{ x: number; y: number; flecha: number; abajo: boolean } | null>(null);
  const cierre = useRef<number | undefined>(undefined);
  // Con qué se ha tocado la celda (mouse, touch, pen). Al tocar con el dedo,
  // Chrome da primero el foco y luego el clic: si el foco abría y el clic
  // cerraba, el primer toque no hacía nada.
  const puntero = useRef<string>("");
  const apertura = useRef<number | undefined>(undefined);

  // Dónde va la tarjeta: encima de la celda, centrada, sin salirse del marco.
  const colocar = useCallback((i: number) => {
    const c = celdas.current[i];
    const k = caja.current;
    if (!c || !k) return;
    const rc = c.getBoundingClientRect();
    const rk = k.getBoundingClientRect();
    const centro = rc.left - rk.left + rc.width / 2;
    const ancho = Math.min(ANCHO_TARJETA, rk.width - 16);
    const x = Math.max(8, Math.min(rk.width - ancho - 8, centro - ancho / 2));
    // Encima si cabe; si no (la cabecera fija la taparía, sobre todo en el
    // móvil), debajo del logo.
    const abajo = rc.top < 280;
    setPos({ x, y: abajo ? rc.bottom - rk.top : rc.top - rk.top, flecha: centro - x, abajo });
  }, []);

  const abrir = useCallback(
    (i: number, ya = false) => {
      window.clearTimeout(cierre.current);
      window.clearTimeout(apertura.current);
      const ir = () => {
        setActivo((prev) => {
          if (prev !== i) sonarHover(i);
          return i;
        });
        colocar(i);
      };
      // Un respiro antes de abrir (pasar de largo no la enseña); de un logo a
      // otro ya abierta, al momento.
      if (ya || activo !== null) ir();
      else apertura.current = window.setTimeout(ir, 90);
    },
    [activo, colocar],
  );

  const cerrar = useCallback(() => {
    window.clearTimeout(apertura.current);
    window.clearTimeout(cierre.current);
    cierre.current = window.setTimeout(() => setActivo(null), 180);
  }, []);

  // Si cambia el ancho (girar el móvil), la tarjeta se recoloca.
  useLayoutEffect(() => {
    if (activo === null) return;
    const r = () => colocar(activo);
    addEventListener("resize", r);
    return () => removeEventListener("resize", r);
  }, [activo, colocar]);

  // En el móvil se abre tocando: tocar fuera o Esc la cierra.
  useEffect(() => {
    if (activo === null) return;
    const fuera = (e: PointerEvent) => {
      if (!caja.current?.contains(e.target as Node)) setActivo(null);
    };
    const esc = (e: KeyboardEvent) => e.key === "Escape" && setActivo(null);
    document.addEventListener("pointerdown", fuera);
    document.addEventListener("keydown", esc);
    return () => {
      document.removeEventListener("pointerdown", fuera);
      document.removeEventListener("keydown", esc);
    };
  }, [activo]);

  const c = activo !== null ? CLIENTES[activo] : null;

  return (
    <section className="v2-frame">
      <div className="v2-rail border-t border-[var(--v2-line)]">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[var(--v2-line)] px-6 py-3 md:px-10">
          <span className="v2-label">{t("label").replace(/^\/\/\s*/, "")}</span>
          <span className="v2-label hidden md:inline">{locale === "en" ? "Hover a logo" : "Pasa por un logo"}</span>
          <span className="v2-label md:hidden">{locale === "en" ? "Tap a logo" : "Toca un logo"}</span>
        </div>

        <div ref={caja} className="cli-rejilla relative" onPointerLeave={(e) => e.pointerType === "mouse" && cerrar()}>
          {CLIENTES.map((cl, i) => (
            <button
              key={cl.nombre}
              ref={(el) => {
                celdas.current[i] = el;
              }}
              type="button"
              className={`cli-celda${cl.colorEnOscuro ? " cli-color" : ""}${activo === i ? " is-on" : ""}${activo !== null && activo !== i ? " is-apagada" : ""}`}
              aria-describedby={activo === i ? "cli-tarjeta" : undefined}
              aria-expanded={activo === i}
              onPointerEnter={(e) => e.pointerType === "mouse" && abrir(i)}
              onPointerDown={(e) => {
                puntero.current = e.pointerType;
              }}
              onFocus={(e) => {
                // Solo con el teclado: con el dedo o el ratón decide el clic.
                if (!puntero.current && e.currentTarget.matches(":focus-visible")) abrir(i, true);
              }}
              onClick={() => {
                const tipo = puntero.current;
                puntero.current = "";
                // Con el ratón ya se abrió al pasar; con el teclado, al llegar con el foco.
                if (tipo === "mouse" || !tipo) return;
                // Con el dedo: tocar abre; tocar la misma otra vez, cierra.
                if (activo === i) setActivo(null);
                else abrir(i, true);
              }}
            >
              {cl.pronto && (
                <span className="cli-pronto-tag">
                  <span className="cli-pronto-punto" aria-hidden />
                  {locale === "en" ? "Coming soon" : "Próximamente"}
                </span>
              )}
              {cl.logo ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={cl.logo}
                  alt={cl.pronto ? (locale === "en" ? "New client, coming soon" : "Nuevo cliente, próximamente") : cl.nombre}
                  width={cl.ratio ? Math.round(cl.alto * cl.ratio) : undefined}
                  height={cl.alto}
                  style={{ height: cl.alto }}
                  className="cli-logo"
                  draggable={false}
                />
              ) : (
                <span className="cli-nombre">{cl.nombre}</span>
              )}
            </button>
          ))}

          {/* La tarjeta: una sola, que viaja de un logo a otro. */}
          <div
            id="cli-tarjeta"
            role={c ? "tooltip" : undefined}
            className={`cli-tarjeta${c ? " is-on" : ""}${pos?.abajo ? " is-abajo" : ""}`}
            style={
              pos
                ? ({
                    transform: `translate(${pos.x}px, ${pos.y}px)${pos.abajo ? "" : " translateY(-100%)"}`,
                    width: Math.min(ANCHO_TARJETA, (caja.current?.clientWidth ?? ANCHO_TARJETA) - 16),
                    ["--flecha" as string]: `${pos.flecha}px`,
                  } as React.CSSProperties)
                : undefined
            }
            onPointerEnter={() => window.clearTimeout(cierre.current)}
            onPointerLeave={(e) => e.pointerType === "mouse" && cerrar()}
          >
            {c && (
              <div key={c.nombre} className="cli-tarjeta-in">
                <div className="flex items-center justify-between gap-3">
                  {c.pronto ? (
                    <span className="flex items-center gap-2.5">
                      <span className="text-[15px] font-medium">{locale === "en" ? "New client" : "Nuevo cliente"}</span>
                      <span className="cli-pronto-tag cli-pronto-tag--tarjeta">
                        <span className="cli-pronto-punto" aria-hidden />
                        {locale === "en" ? "Coming soon" : "Próximamente"}
                      </span>
                    </span>
                  ) : c.logo ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={c.logo}
                      alt=""
                      style={{ height: Math.min(c.alto, 24) }}
                      className={`cli-tarjeta-logo${c.colorEnOscuro ? " cli-color" : ""}`}
                    />
                  ) : (
                    <span className="text-[15px] font-medium">{c.nombre}</span>
                  )}
                  {!c.logo && <span className="v2-tag">{locale === "en" ? "Logo pending" : "Falta el logo"}</span>}
                </div>
                <p className={`cli-quien${c.quien ? "" : " is-falta"}`}>
                  {c.quien ? c.quien[locale] : locale === "en" ? "To fill in: who they are." : "Por completar: quiénes son."}
                </p>
                <div className="cli-pie">
                  {c.hicimos ? (
                    <span className="cli-servicios">
                      {c.hicimos.map((h) => (
                        <span key={h.es} className="cli-servicio">
                          {h[locale]}
                        </span>
                      ))}
                    </span>
                  ) : (
                    <span className="v2-label is-falta">{locale === "en" ? "To fill in: what we did" : "Por completar: qué hicimos"}</span>
                  )}
                  {c.caso && (
                    <Link
                      href={{ pathname: "/work/[slug]", params: { slug: c.caso } }}
                      className="v2-link shrink-0 text-[13px]"
                      tabIndex={-1}
                    >
                      {locale === "en" ? "See case" : "Ver caso"} <span aria-hidden>→</span>
                    </Link>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
