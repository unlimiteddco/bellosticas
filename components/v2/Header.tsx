"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useTranslations } from "next-intl";
import { Link, usePathname } from "@/navigation";
import { Grip, Plus } from "lucide-react";
import { AsteriskIcon } from "@/components/ui/AsteriskIcon";
import { Logo } from "@/components/ui/Logo";
import type { TrabajoMenu } from "@/components/layout/WorkMegaMenu";
import { sonarClic, sonarHover } from "@/lib/v2/ui-sound";
import { PanelServicios, PanelTrabajos } from "./MegaPanels";
import { MobileMenu } from "./MobileMenu";
import { SoundToggle, ThemeToggle } from "./Toggles";

/*
 * La cabecera de la V2, con dos megamenús (Servicios y Trabajos).
 *
 * Cómo se mueve, en tiempos:
 *   - Abrir: 90 ms de espera al pasar el ratón (para que cruzar la barra no
 *     dispare menús), 450 ms de animación.
 *   - Cambiar de un menú a otro: 60 ms de espera; el panel que sale se va hacia
 *     un lado y el que entra llega desde el otro, según hacia dónde se mueva el
 *     ratón (±48 px).
 *   - Cerrar: 220 ms de margen al salir (para poder bajar en diagonal al panel)
 *     y 380 ms de animación.
 * El alto del contenedor se anima al alto del panel activo (--mm-h), y una
 * píldora de fondo sigue al ratón por la navegación.
 *
 * Los paneles se manejan con clases y variables CSS, no con estado de React:
 * así cada transición arranca desde donde está, aunque se interrumpa.
 */

const ESPERA_ABRIR = 90;
const ESPERA_CAMBIAR = 60;
const ESPERA_CERRAR = 220;
const DUR_ABRIR = 450;
const DUR_CERRAR = 380;
const DESPLAZAMIENTO = 48;

type Item =
  | { tipo: "menu"; clave: "services" | "work" }
  | { tipo: "enlace"; clave: "studio" | "contact"; href: "/studio" | "/contact" };

const ITEMS: Item[] = [
  { tipo: "menu", clave: "services" },
  { tipo: "menu", clave: "work" },
  { tipo: "enlace", clave: "studio", href: "/studio" },
  { tipo: "enlace", clave: "contact", href: "/contact" },
];

export function Header({ trabajos }: { trabajos: TrabajoMenu[] }) {
  const t = useTranslations("nav");
  const tv = useTranslations("v2");
  const pathname = usePathname();

  const [abierto, setAbierto] = useState(-1);
  const [movilAbierto, setMovilAbierto] = useState(false);
  const [tono, setTono] = useState<"claro" | "oscuro">("claro");

  const headerRef = useRef<HTMLElement>(null);
  const navRef = useRef<HTMLUListElement>(null);
  const pillRef = useRef<HTMLSpanElement>(null);
  const mmRef = useRef<HTMLDivElement>(null);
  const panelRefs = useRef<(HTMLDivElement | null)[]>([]);
  const triggerRefs = useRef<(HTMLElement | null)[]>([]);
  const actual = useRef(-1);
  const sobreNav = useRef(false);
  const tAbrir = useRef<number | undefined>(undefined);
  const tCerrar = useRef<number | undefined>(undefined);

  const limpiar = () => {
    window.clearTimeout(tAbrir.current);
    window.clearTimeout(tCerrar.current);
  };

  /* ── Píldora ── */
  const moverPildora = useCallback((el: HTMLElement | null) => {
    const pill = pillRef.current;
    const nav = navRef.current;
    if (!pill || !nav || !el) return;
    const r = el.getBoundingClientRect();
    const x = r.left - nav.getBoundingClientRect().left;
    const nueva = !pill.classList.contains("is-visible");
    if (nueva) pill.classList.add("is-placing");
    pill.style.setProperty("--pill-x", `${x}px`);
    pill.style.setProperty("--pill-w", `${r.width}px`);
    if (nueva) {
      void pill.offsetWidth;
      pill.classList.remove("is-placing");
    }
    pill.classList.add("is-visible");
  }, []);
  const ocultarPildora = () => pillRef.current?.classList.remove("is-visible");

  /* ── Paneles ── */
  const colocar = (p: HTMLDivElement, x: number, y: number) => {
    p.style.setProperty("--mm-x", `${x}px`);
    p.style.setProperty("--mm-y", `${y}px`);
  };
  const mostrarPanel = (i: number, x: number, y: number) => {
    const p = panelRefs.current[i];
    if (!p) return;
    p.classList.add("no-anim");
    colocar(p, x, y);
    void p.offsetWidth;
    p.classList.remove("no-anim");
    p.classList.add("is-active");
    p.inert = false;
    p.querySelectorAll<HTMLVideoElement>("video[data-src]").forEach((v) => {
      if (!v.src) v.src = v.dataset.src ?? "";
      v.play().catch(() => {});
    });
  };
  const esconderPanel = (i: number, x: number, y: number) => {
    const p = panelRefs.current[i];
    if (!p) return;
    colocar(p, x, y);
    p.classList.remove("is-active");
    p.inert = true;
    p.querySelectorAll<HTMLVideoElement>("video").forEach((v) => v.pause());
  };
  const ajustarAlto = (i: number) => {
    const mm = mmRef.current;
    const p = panelRefs.current[i];
    if (mm) mm.style.setProperty("--mm-h", p ? `${p.offsetHeight}px` : "0px");
  };

  const reducirMovimiento = () => window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  const abrir = useCallback(
    (i: number) => {
      limpiar();
      const antes = actual.current;
      if (i === antes) return;
      actual.current = i;
      const mm = mmRef.current;
      mm?.style.setProperty("--mm-dur", `${DUR_ABRIR}ms`);
      mm?.classList.add("is-open");
      if (antes < 0) {
        mostrarPanel(i, 0, -8);
        sonarClic("open", i);
      } else {
        const dir = i > antes ? 1 : -1;
        const d = reducirMovimiento() ? 0 : DESPLAZAMIENTO;
        esconderPanel(antes, -dir * d, 0);
        mostrarPanel(i, dir * d, 0);
        sonarHover(i);
      }
      ajustarAlto(i);
      moverPildora(triggerRefs.current[i]);
      setAbierto(i);
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [moverPildora],
  );

  const cerrar = useCallback(() => {
    limpiar();
    const antes = actual.current;
    if (antes < 0) return;
    actual.current = -1;
    const mm = mmRef.current;
    mm?.style.setProperty("--mm-dur", `${DUR_CERRAR}ms`);
    esconderPanel(antes, 0, -8);
    mm?.style.setProperty("--mm-h", "0px");
    mm?.classList.remove("is-open");
    sonarClic("close");
    if (!sobreNav.current) ocultarPildora();
    setAbierto(-1);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const programarAbrir = (i: number) => {
    window.clearTimeout(tCerrar.current);
    window.clearTimeout(tAbrir.current);
    if (actual.current === i) return;
    tAbrir.current = window.setTimeout(() => abrir(i), actual.current < 0 ? ESPERA_ABRIR : ESPERA_CAMBIAR);
  };
  const programarCerrar = () => {
    window.clearTimeout(tAbrir.current);
    if (actual.current < 0) return;
    window.clearTimeout(tCerrar.current);
    tCerrar.current = window.setTimeout(cerrar, ESPERA_CERRAR);
  };

  // Paneles cerrados: fuera del foco y del lector de pantalla.
  useEffect(() => {
    panelRefs.current.forEach((p) => {
      if (p) p.inert = true;
    });
  }, []);

  // Escape cierra; cambiar de página cierra.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape" && actual.current >= 0) {
        const i = actual.current;
        cerrar();
        triggerRefs.current[i]?.focus();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [cerrar]);
  useEffect(() => {
    cerrar();
    setMovilAbierto(false);
  }, [pathname, cerrar]);

  // Si cambia el ancho (o la fuente termina de cargar), el alto del panel abierto se recalcula.
  useEffect(() => {
    const ro = new ResizeObserver(() => {
      if (actual.current >= 0) ajustarAlto(actual.current);
    });
    panelRefs.current.forEach((p) => p && ro.observe(p));
    return () => ro.disconnect();
  }, []);

  // Sobre una banda oscura (data-header-tone="dark"), la cabecera pasa a oscuro.
  useEffect(() => {
    const bandas = [...document.querySelectorAll<HTMLElement>('[data-header-tone="dark"]')];
    if (!bandas.length || !headerRef.current) return;
    const alto = headerRef.current.offsetHeight;
    const dentro = new Set<Element>();
    const io = new IntersectionObserver(
      (es) => {
        es.forEach((e) => (e.isIntersecting ? dentro.add(e.target) : dentro.delete(e.target)));
        setTono(dentro.size ? "oscuro" : "claro");
      },
      { rootMargin: `-${alto}px 0px -${Math.max(0, window.innerHeight - alto - 1)}px 0px` },
    );
    bandas.forEach((b) => io.observe(b));
    return () => io.disconnect();
  }, []);

  return (
    <>
      <header
        ref={headerRef}
        className="v2-header"
        data-tone={tono === "oscuro" && abierto < 0 ? "dark" : undefined}
      >
        <div className="v2-frame">
          <div className="relative flex h-[60px] items-center justify-between gap-6 px-5 md:px-0">
            <Link href="/v2" className="flex items-center shrink-0" aria-label="Bellostas Studio">
              {/* En el móvil, solo el símbolo: deja sitio a sonido, tema y menú. */}
              <AsteriskIcon className="h-7 w-7 text-[var(--v2-accent)] sm:hidden" />
              <span className="hidden sm:inline">
                <span className="v2-solo-claro">
                  <Logo variant="black" height={20} priority />
                </span>
                <span className="v2-solo-oscuro">
                  <Logo variant="white-red" height={20} priority />
                </span>
              </span>
            </Link>

            {/* Navegación (escritorio) */}
            <nav
              aria-label={tv("navLabel")}
              className="absolute left-1/2 -translate-x-1/2 hidden lg:block"
              onPointerEnter={() => (sobreNav.current = true)}
              onPointerLeave={() => {
                sobreNav.current = false;
                if (actual.current >= 0) moverPildora(triggerRefs.current[actual.current]);
                else ocultarPildora();
              }}
            >
              <ul ref={navRef} className="relative flex items-center gap-1">
                <span ref={pillRef} aria-hidden className="v2-pill" />
                {ITEMS.map((it, i) => {
                  const cls =
                    "relative z-[1] inline-flex h-8 items-center gap-1.5 rounded-md px-3 text-[14px] font-medium text-[var(--v2-text)]";
                  if (it.tipo === "menu") {
                    const idx = it.clave === "services" ? 0 : 1;
                    return (
                      <li
                        key={it.clave}
                        onPointerEnter={(e) => {
                          if (e.pointerType !== "mouse") return;
                          moverPildora(triggerRefs.current[idx]);
                          sonarHover(i);
                          programarAbrir(idx);
                        }}
                        onPointerLeave={(e) => {
                          if (e.pointerType === "mouse") programarCerrar();
                        }}
                      >
                        <button
                          ref={(el) => {
                            triggerRefs.current[idx] = el;
                          }}
                          type="button"
                          className={cls}
                          aria-expanded={abierto === idx}
                          aria-controls={`v2-panel-${idx}`}
                          onClick={() => (actual.current === idx ? cerrar() : abrir(idx))}
                        >
                          {t(it.clave)}
                          <span aria-hidden className="v2-plus text-[var(--v2-muted)]">
                            <Plus size={15} strokeWidth={1.75} className="block" />
                          </span>
                        </button>
                      </li>
                    );
                  }
                  return (
                    <li
                      key={it.clave}
                      onPointerEnter={(e) => {
                        if (e.pointerType !== "mouse") return;
                        moverPildora(e.currentTarget.firstElementChild as HTMLElement);
                        sonarHover(i);
                        programarCerrar();
                      }}
                    >
                      <Link href={it.href} className={cls} onClick={() => sonarClic("select", i)}>
                        {t(it.clave)}
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </nav>

            <div className="flex items-center gap-1">
              <div className="flex items-center gap-0.5">
                <SoundToggle />
                <ThemeToggle />
              </div>
              <Link
                href="/intro"
                className="v2-btn v2-btn--primary v2-btn--sm ml-2 hidden sm:inline-flex"
                onClick={() => sonarClic("select")}
              >
                {t("cta")}
              </Link>
              <button
                type="button"
                className="ml-1 inline-flex h-9 w-9 items-center justify-center rounded-md lg:hidden hover:bg-[var(--v2-hover)]"
                aria-label={t("openMenu")}
                aria-expanded={movilAbierto}
                onClick={() => {
                  sonarClic("open");
                  setMovilAbierto(true);
                }}
              >
                <Grip size={20} strokeWidth={1.75} />
              </button>
            </div>
          </div>
        </div>

        {/* Megamenú: pegado a la cabecera, del ancho del contenedor */}
        <div
          ref={mmRef}
          className="v2-mm hidden lg:block"
          onPointerEnter={(e) => {
            if (e.pointerType === "mouse") window.clearTimeout(tCerrar.current);
          }}
          onPointerLeave={(e) => {
            if (e.pointerType === "mouse") programarCerrar();
          }}
        >
          <div className="v2-frame">
            <div className="relative">
              {[0, 1].map((i) => (
                <div
                  key={i}
                  id={`v2-panel-${i}`}
                  ref={(el) => {
                    panelRefs.current[i] = el;
                  }}
                  className="v2-mm-panel"
                >
                  <div className="v2-mm-box">
                    {i === 0 ? (
                      <PanelServicios alElegir={cerrar} />
                    ) : (
                      <PanelTrabajos trabajos={trabajos} alElegir={cerrar} />
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </header>

      <div className={`v2-veil hidden lg:block ${abierto >= 0 ? "is-on" : ""}`} aria-hidden onClick={cerrar} />

      <MobileMenu abierto={movilAbierto} alCerrar={() => setMovilAbierto(false)} trabajos={trabajos} />

      {/* Para leerlo en voz alta cuando se abre o cierra un menú. */}
      <span className="sr-only" aria-live="polite">
        {abierto === 0 ? t("services") : abierto === 1 ? t("work") : ""}
      </span>
    </>
  );
}
