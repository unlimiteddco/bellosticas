"use client";

import { useEffect, useRef, useState } from "react";
import { useParams } from "next/navigation";
import {
  ArrowRight,
  ArrowRightLeft,
  ArrowUpRight,
  ChartColumn,
  Heart,
  LayoutDashboard,
  LayoutGrid,
  Layers,
  type LucideIcon,
  Monitor,
  PenTool,
  Route,
  Search,
  ShoppingBag,
  Workflow,
} from "lucide-react";
import { useTranslations } from "next-intl";
import { Link, usePathname } from "@/navigation";
import { RECIENTES, VIDEO_DESTACADO, type TrabajoMenu } from "@/components/layout/WorkMegaMenu";
import { sonarClic } from "@/lib/v2/ui-sound";
import { sinBarras } from "@/lib/v2/texto";
import { IdiomaToggle } from "./Toggles";

type Destino = React.ComponentProps<typeof Link>["href"];
type Enlace = { href: Destino; titulo: string; icono: LucideIcon };

/**
 * El menú del móvil: se despliega debajo de la cabecera, que sigue a la vista
 * (el botón de menú se convierte en la X). Entra como una cortina que baja y
 * las filas llegan escalonadas; al cerrar, sube de golpe y sin escalonado.
 *
 * Por dentro, lo mismo que el megamenú de escritorio: Servicios agrupados y
 * con su icono, Trabajos con el caso destacado y los proyectos recientes con
 * su logo, Precios a la vista y, abajo, la tarjeta de «¿No lo tienes claro?»
 * con la llamada. La página en la que estás queda marcada.
 * `arriba`: dónde acaba la cabecera, medido al abrir.
 */
export function MobileMenu({
  abierto,
  alCerrar,
  trabajos,
  arriba,
}: {
  abierto: boolean;
  alCerrar: () => void;
  trabajos: TrabajoMenu[];
  arriba: number;
}) {
  const t = useTranslations("nav");
  const tv = useTranslations("v2");
  const tn = useTranslations("v2Servicios");
  const pathname = usePathname();
  const params = useParams();
  const [seccion, setSeccion] = useState<"services" | "work" | null>(null);
  const navRef = useRef<HTMLElement>(null);
  const filaRefs = useRef<Record<string, HTMLLIElement | null>>({});
  const videoRef = useRef<HTMLVideoElement>(null);

  // Con el menú abierto no se mueve la página de detrás.
  useEffect(() => {
    if (!abierto) {
      const id = window.setTimeout(() => setSeccion(null), 400);
      return () => window.clearTimeout(id);
    }
    const antes = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && alCerrar();
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = antes;
      window.removeEventListener("keydown", onKey);
    };
  }, [abierto, alCerrar]);

  // Al abrir Servicios o Trabajos, el menú baja solo para que se vea entero;
  // el vídeo del caso destacado se carga y suena solo con Trabajos abierto.
  useEffect(() => {
    const v = videoRef.current;
    if (v) {
      if (seccion === "work" && abierto) {
        if (!v.src && v.dataset.src) v.src = v.dataset.src;
        v.play().catch(() => {});
      } else v.pause();
    }
    if (!seccion) return;
    const id = window.setTimeout(() => {
      const fila = filaRefs.current[seccion];
      const nav = navRef.current;
      if (fila && nav) nav.scrollTo({ top: fila.offsetTop - 8, behavior: "smooth" });
    }, 120);
    return () => window.clearTimeout(id);
  }, [seccion, abierto]);

  /* ── Lo que va dentro ── */
  const diseno: Enlace[] = [
    { href: "/services/brand-identity", titulo: tn("marca"), icono: PenTool },
    { href: "/services/desarrollo-web", titulo: tn("s01"), icono: Monitor },
    { href: "/services/ecommerce", titulo: tn("s02"), icono: ShoppingBag },
    { href: "/services/seo-aeo", titulo: tn("seo"), icono: Search },
  ];
  const producto: Enlace[] = [
    { href: "/services/aplicaciones-web", titulo: tn("s03"), icono: LayoutDashboard },
    { href: "/services/automatizaciones", titulo: tn("s04"), icono: Workflow },
    { href: "/services/migraciones", titulo: tn("s05"), icono: ArrowRightLeft },
    { href: "/services/white-label", titulo: tn("s06"), icono: Layers },
  ];
  const paginas: Enlace[] = [
    { href: "/work", titulo: t("wm.work.title"), icono: LayoutGrid },
    { href: "/proceso", titulo: t("wm.process.title"), icono: Route },
    { href: "/clients", titulo: t("wm.clients.title"), icono: Heart },
  ];
  // Los mismos proyectos que el megamenú: los elegidos primero, como mucho cuatro.
  const visibles = trabajos.filter((p) => !p.comingSoon);
  const elegidos = RECIENTES.map((s) => visibles.find((p) => p.slug === s)).filter((p): p is TrabajoMenu => Boolean(p));
  const recientes = [...elegidos, ...visibles.filter((p) => !elegidos.includes(p))].slice(0, 4);
  const destacado = visibles.find((p) => p.cover) ?? visibles[0];
  const video = destacado ? VIDEO_DESTACADO[destacado.slug] : undefined;

  const activo = (href: Destino) => typeof href === "string" && pathname === href;
  const casoActivo = (slug: string) => pathname === "/work/[slug]" && params?.slug === slug;

  const elegir = () => {
    sonarClic("select");
    alCerrar();
  };

  // Cada fila entra un poco después de la anterior (solo al abrir).
  const entrada = (i: number) => ({
    className: `transition-[opacity,transform] duration-500 ease-[var(--v2-ease-out)] ${
      abierto ? "translate-y-0 opacity-100" : "-translate-y-3 opacity-0"
    }`,
    style: { transitionDelay: abierto ? `${120 + i * 55}ms` : "0ms" },
  });

  /** Un enlace con su icono en caja (como en el megamenú). */
  const fila = (l: Enlace) => {
    const on = activo(l.href);
    const Icono = l.icono;
    return (
      <li key={l.titulo}>
        <Link
          href={l.href}
          onClick={elegir}
          aria-current={on ? "page" : undefined}
          className={`v2-mm-link flex items-center gap-3 rounded-[6px] px-2 py-2 text-[15.5px] ${on ? "bg-[var(--v2-hover)]" : ""}`}
        >
          <span className={`v2-ico ${on ? "!bg-[var(--v2-text)] !text-[var(--v2-bg)]" : ""}`}>
            <Icono size={14} strokeWidth={1.75} />
          </span>
          <span className={`flex-1 ${on ? "font-medium" : ""}`}>{l.titulo}</span>
          {on && <span aria-hidden className="h-1.5 w-1.5 rounded-full bg-[var(--v2-accent)]" />}
        </Link>
      </li>
    );
  };

  const grupo = (etiqueta: string, lista: Enlace[]) => (
    <div className="flex flex-col gap-1">
      <span className="v2-label px-2 pb-1 pt-2 !text-[10px]">{etiqueta}</span>
      <ul className="flex flex-col">{lista.map(fila)}</ul>
    </div>
  );

  const acordeon = (clave: "services" | "work", i: number, contenido: React.ReactNode) => {
    const on = seccion === clave;
    const e = entrada(i);
    return (
      <li
        ref={(el) => {
          filaRefs.current[clave] = el;
        }}
        className={`border-b border-[var(--v2-line)] ${e.className}`}
        style={e.style}
      >
        <button
          type="button"
          className="flex w-full items-center justify-between py-4 text-[24px] font-medium tracking-[-0.02em]"
          aria-expanded={on}
          onClick={() => {
            sonarClic(on ? "close" : "open");
            setSeccion(on ? null : clave);
          }}
        >
          {t(clave)}
          <span aria-hidden className={`relative h-4 w-4 transition-transform duration-500 ease-[var(--v2-ease)] ${on ? "rotate-45" : ""}`}>
            <span className="absolute left-0 top-1/2 h-px w-full -translate-y-1/2 bg-[var(--v2-accent)]" />
            <span className="absolute left-1/2 top-0 h-full w-px -translate-x-1/2 bg-[var(--v2-accent)]" />
          </span>
        </button>
        <div className="grid transition-[grid-template-rows] duration-[400ms] ease-[var(--v2-ease)]" style={{ gridTemplateRows: on ? "1fr" : "0fr" }}>
          <div className="overflow-hidden" inert={!on}>
            <div className={`pb-5 transition-opacity duration-300 ${on ? "opacity-100 delay-100" : "opacity-0"}`}>{contenido}</div>
          </div>
        </div>
      </li>
    );
  };

  const servicios = (
    <div className="flex flex-col gap-3">
      {grupo(tv("mm.design"), diseno)}
      {grupo(tv("mm.product"), producto)}
      <Link href="/services" onClick={elegir} className="v2-link mt-1 self-start px-2 text-[14px]">
        {t("mm.viewAll")} <ArrowRight size={13} className="text-[var(--v2-accent)]" />
      </Link>
    </div>
  );

  const trabajo = (
    <div className="flex flex-col gap-4">
      {destacado && (
        <Link
          href={{ pathname: "/work/[slug]", params: { slug: destacado.slug } }}
          onClick={elegir}
          className="group block overflow-hidden rounded-[8px] border border-[var(--v2-line)]"
        >
          <span className="relative block aspect-[16/9]" style={{ backgroundColor: destacado.color }}>
            {video ? (
              <video ref={videoRef} data-src={video} muted loop playsInline className="absolute inset-0 h-full w-full object-cover" />
            ) : destacado.cover ? (
              <img src={destacado.cover} alt="" loading="lazy" className="absolute inset-0 h-full w-full object-cover" />
            ) : null}
            <span className="v2-tag absolute left-3 top-3">{sinBarras(t("wm.featuredLabel"))}</span>
          </span>
          <span className="flex items-center justify-between gap-3 border-t border-[var(--v2-line)] px-3 py-2.5 text-[14px] font-medium">
            <span className="truncate">
              {destacado.name} <span className="font-normal text-[var(--v2-muted)]">· {destacado.category}</span>
            </span>
            <ArrowUpRight size={15} className="shrink-0 text-[var(--v2-accent)]" />
          </span>
        </Link>
      )}
      <ul className="flex flex-col">{paginas.map(fila)}</ul>
      {recientes.length > 0 && (
        <div className="flex flex-col gap-1">
          <span className="v2-label px-2 pb-1 !text-[10px]">{sinBarras(t("wm.recentLabel"))}</span>
          <ul className="flex flex-col">
            {recientes.map((p) => {
              const on = casoActivo(p.slug);
              return (
                <li key={p.slug}>
                  <Link
                    href={{ pathname: "/work/[slug]", params: { slug: p.slug } }}
                    onClick={elegir}
                    aria-current={on ? "page" : undefined}
                    className={`v2-mm-link flex items-center gap-3 rounded-[6px] px-2 py-2 ${on ? "bg-[var(--v2-hover)]" : ""}`}
                  >
                    <span
                      className="flex h-7 w-7 shrink-0 items-center justify-center overflow-hidden rounded-md border border-[var(--v2-line)]"
                      style={{ backgroundColor: p.color }}
                    >
                      {p.logo ? (
                        <img src={p.logo} alt="" className="max-h-[12px] max-w-[20px] object-contain" />
                      ) : (
                        <span className="text-[11px] font-semibold text-white">{p.name.slice(0, 1)}</span>
                      )}
                    </span>
                    <span className="flex min-w-0 flex-1 flex-col">
                      <span className="text-[15px] font-medium">{p.name}</span>
                      <span className="truncate text-[12.5px] text-[var(--v2-muted)]">{p.category}</span>
                    </span>
                    {on && <span aria-hidden className="h-1.5 w-1.5 rounded-full bg-[var(--v2-accent)]" />}
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>
      )}
    </div>
  );

  /** Las filas sin desplegable, con la página actual marcada. */
  const filaSimple = (titulo: string, href: Destino, i: number, extra?: React.ReactNode) => {
    const e = entrada(i);
    const on = activo(href);
    return (
      <li key={titulo} className={`border-b border-[var(--v2-line)] ${e.className}`} style={e.style}>
        <Link
          href={href}
          onClick={elegir}
          aria-current={on ? "page" : undefined}
          className="flex items-center justify-between gap-3 py-4 text-[24px] font-medium tracking-[-0.02em]"
        >
          <span className="flex items-center gap-3">
            {titulo}
            {on && <span aria-hidden className="h-1.5 w-1.5 rounded-full bg-[var(--v2-accent)]" />}
          </span>
          {extra}
        </Link>
      </li>
    );
  };

  const pie = entrada(6);
  return (
    <div
      className="fixed inset-x-0 bottom-0 z-[45] flex flex-col bg-[var(--v2-bg)] lg:hidden"
      style={{
        top: arriba,
        // La cortina: baja al abrir y sube al cerrar, recortando desde arriba.
        clipPath: abierto ? "inset(0 0 0 0)" : "inset(0 0 100% 0)",
        transition: `clip-path ${abierto ? "560ms" : "320ms"} var(--v2-ease-out)`,
      }}
      id="v2-menu-movil"
      role="dialog"
      aria-modal="true"
      aria-label={tv("navLabel")}
      aria-hidden={!abierto}
      inert={!abierto}
    >
      <nav ref={navRef} className="v2-frame relative w-full flex-1 overflow-y-auto overscroll-contain px-5 md:px-0">
        <ul className="pt-2">
          {acordeon("services", 0, servicios)}
          {acordeon("work", 1, trabajo)}
          {/* Precios, a la vista: es de lo que más empuja a llamar. */}
          {filaSimple(
            t("pricing"),
            "/pricing",
            2,
            <span className="v2-ico" aria-hidden>
              <ChartColumn size={14} strokeWidth={1.75} />
            </span>,
          )}
          {filaSimple(t("studio"), "/studio", 3)}
          {filaSimple(t("contact"), "/contact", 4)}
        </ul>
      </nav>

      <div
        className={`v2-frame flex w-full flex-col gap-3 border-t border-[var(--v2-line)] px-5 pb-[max(14px,env(safe-area-inset-bottom))] pt-3.5 md:px-0 ${pie.className}`}
        style={pie.style}
      >
        {/* ¿No lo tienes claro?: tu cara, una frase y la llamada (como en el megamenú). */}
        <div className="flex items-center gap-3">
          <img
            src="/images/antonio-bellostas-hero.jpg"
            alt={t("mm.helpPerson")}
            width={44}
            height={44}
            className="h-11 w-11 shrink-0 rounded-full border border-[var(--v2-line)] object-cover"
          />
          <div className="flex min-w-0 flex-col gap-0.5">
            <span className="v2-label !text-[10px]">{sinBarras(t("mm.helpLabel"))}</span>
            <span className="text-[13.5px] leading-[1.4] text-[var(--v2-muted)]">{tv("menuAyuda")}</span>
          </div>
        </div>
        {/* La llamada y, al lado, el idioma (sonido y tema ya están en la cabecera). */}
        <div className="flex items-center gap-2">
          <Link href="/intro" onClick={elegir} className="v2-btn v2-btn--primary h-12 flex-1">
            {t("mm.helpCta")} <ArrowRight size={15} />
          </Link>
          <IdiomaToggle grande alCambiar={alCerrar} />
        </div>
      </div>
    </div>
  );
}
