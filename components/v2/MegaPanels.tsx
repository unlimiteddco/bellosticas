"use client";

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
import { sonarClic, sonarHover } from "@/lib/v2/ui-sound";
import { sinBarras } from "@/lib/v2/texto";

type Destino = React.ComponentProps<typeof Link>["href"];

/** Un enlace del megamenú: icono en caja + título (+ una línea opcional). */
function EnlaceMM({
  href,
  icono: Icono,
  titulo,
  sub,
  i,
  alElegir,
}: {
  href: Destino;
  icono: LucideIcon;
  titulo: string;
  sub?: string;
  i: number;
  alElegir: () => void;
}) {
  return (
    <Link
      href={href}
      className="v2-mm-link group flex items-center gap-3 px-5 py-2.5 transition-colors"
      onPointerEnter={(e) => e.pointerType === "mouse" && sonarHover(i + 2)}
      onClick={() => {
        sonarClic("select", i + 2);
        alElegir();
      }}
    >
      <span className="v2-ico">
        <Icono size={14} strokeWidth={1.75} />
      </span>
      <span className="flex min-w-0 flex-col">
        <span className="text-[14px] font-medium text-[var(--v2-text)]">{titulo}</span>
        {sub && <span className="truncate text-[12.5px] text-[var(--v2-muted)]">{sub}</span>}
      </span>
      <ArrowRight size={15} className="v2-mm-flecha" aria-hidden />
    </Link>
  );
}

function Columna({ etiqueta, children, borde = true }: { etiqueta: string; children: React.ReactNode; borde?: boolean }) {
  return (
    <div className={`flex flex-col ${borde ? "border-r border-[var(--v2-line)]" : ""}`}>
      <div className="v2-label border-b border-[var(--v2-line)] px-5 py-3">{etiqueta}</div>
      {/* Sin margen lateral: la fila al pasar el ratón se tiñe de borde a borde. */}
      <div className="flex flex-col py-2">{children}</div>
    </div>
  );
}

function FilaInferior({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex flex-wrap items-center gap-x-1 border-t border-[var(--v2-line)] px-2.5 py-2">{children}</div>
  );
}

function Acceso({ href, children, alElegir, i }: { href: Destino; children: React.ReactNode; alElegir: () => void; i: number }) {
  // La página en la que ya estás se queda marcada, como al pasar el ratón.
  const pathname = usePathname();
  const activo = typeof href === "string" && (pathname === href || pathname.startsWith(`${href}-`));
  return (
    <Link
      href={href}
      aria-current={activo ? "page" : undefined}
      className={`group/acceso inline-flex items-center gap-1.5 rounded-md px-2.5 py-1.5 text-[13px] transition-colors hover:bg-[var(--v2-hover)] hover:text-[var(--v2-text)] ${
        activo ? "bg-[var(--v2-hover)] text-[var(--v2-text)]" : "text-[var(--v2-muted)]"
      }`}
      onPointerEnter={(e) => e.pointerType === "mouse" && sonarHover(i + 10)}
      onClick={() => {
        sonarClic("select", i + 10);
        alElegir();
      }}
    >
      {children}
    </Link>
  );
}

/* ───────────────────────── Servicios ───────────────────────── */

export function PanelServicios({ alElegir }: { alElegir: () => void }) {
  const t = useTranslations("nav");
  const ts = useTranslations("services");
  const tv = useTranslations("v2");
  const tv2 = useTranslations("v2Servicios");

  const diseno = [
    { href: "/v2/services/brand-identity" as Destino, icono: PenTool, titulo: ts("acc.brand.title") },
    { href: "/v2/services/desarrollo-web" as Destino, icono: Monitor, titulo: ts("items.s01.title") },
    { href: "/v2/services/ecommerce" as Destino, icono: ShoppingBag, titulo: ts("items.s02.title") },
    { href: "/v2/services/seo-aeo" as Destino, icono: Search, titulo: tv2("seo") },
  ];
  const producto = [
    { href: "/v2/services/aplicaciones-web" as Destino, icono: LayoutDashboard, titulo: ts("items.s03.title") },
    { href: "/v2/services/automatizaciones" as Destino, icono: Workflow, titulo: ts("items.s04.title") },
    { href: "/v2/services/migraciones" as Destino, icono: ArrowRightLeft, titulo: ts("items.s05.title") },
    { href: "/v2/services/white-label" as Destino, icono: Layers, titulo: ts("items.s06.title") },
  ];

  return (
    <>
      <div className="grid grid-cols-3">
        <Columna etiqueta={tv("mm.design")}>
          {diseno.map((l, i) => (
            <EnlaceMM key={l.titulo} {...l} i={i} alElegir={alElegir} />
          ))}
        </Columna>
        <Columna etiqueta={tv("mm.product")}>
          {producto.map((l, i) => (
            <EnlaceMM key={l.titulo} {...l} i={i + 3} alElegir={alElegir} />
          ))}
        </Columna>

        {/* La columna de ayuda, con la foto del estudio: aquí se decide llamar. */}
        <div className="relative flex min-h-[260px] flex-col justify-end overflow-hidden bg-[#121211] p-5">
          <img
            src="/images/estudio-espaldas.webp"
            alt={t("mm.helpPerson")}
            className="absolute inset-0 h-full w-full object-cover opacity-90"
            style={{ objectPosition: "44% 30%" }}
          />
          <div aria-hidden className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/35 to-transparent" />
          <div className="relative flex flex-col gap-3">
            <span className="v2-label !text-white/70">{sinBarras(t("mm.helpLabel"))}</span>
            <p className="text-[14px] leading-[1.45] text-white/90">{t("mm.helpText")}</p>
            <div className="flex items-center gap-3">
              <Link
                href="/v2/intro"
                className="v2-btn v2-btn--primary v2-btn--sm"
                onClick={() => {
                  sonarClic("select");
                  alElegir();
                }}
              >
                {t("mm.helpCta")}
              </Link>
              <span className="text-[12px] text-white/65">{t("mm.helpPerson")}</span>
            </div>
          </div>
        </div>
      </div>
      <FilaInferior>
        <Acceso href="/v2/services" alElegir={alElegir} i={0}>
          <LayoutGrid size={13} strokeWidth={1.75} /> {t("mm.viewAll")} <ArrowRight size={12} />
        </Acceso>
        <Acceso href="/v2/pricing" alElegir={alElegir} i={1}>
          {/* Icono en caja negra solo estando en Precios. */}
          <span className="-ml-0.5 inline-flex h-5 w-5 items-center justify-center rounded-[4px] group-aria-[current=page]/acceso:bg-[var(--v2-text)] group-aria-[current=page]/acceso:text-[var(--v2-bg)]">
            <ChartColumn size={12} strokeWidth={1.9} />
          </span>
          {t("pricing")}
        </Acceso>
        <Acceso href="/v2/proceso" alElegir={alElegir} i={2}>
          <Route size={13} strokeWidth={1.75} /> {t("wm.process.title")}
        </Acceso>
      </FilaInferior>
    </>
  );
}

/* ───────────────────────── Trabajos ───────────────────────── */

export function PanelTrabajos({ trabajos, alElegir }: { trabajos: TrabajoMenu[]; alElegir: () => void }) {
  const t = useTranslations("nav");
  const tv = useTranslations("v2");

  const visibles = trabajos.filter((p) => !p.comingSoon);
  const elegidos = RECIENTES.map((slug) => visibles.find((p) => p.slug === slug)).filter(
    (p): p is TrabajoMenu => Boolean(p),
  );
  const recientes = [...elegidos, ...visibles.filter((p) => !elegidos.includes(p))].slice(0, 4);
  const destacado = visibles.find((p) => p.cover) ?? visibles[0];
  const video = destacado ? VIDEO_DESTACADO[destacado.slug] : undefined;

  const paginas = [
    { href: "/v2/work" as Destino, icono: LayoutGrid, titulo: t("wm.work.title"), sub: t("wm.work.sub") },
    { href: "/v2/proceso" as Destino, icono: Route, titulo: t("wm.process.title"), sub: t("wm.process.sub") },
    { href: "/v2/clients" as Destino, icono: Heart, titulo: t("wm.clients.title"), sub: t("wm.clients.sub") },
  ];

  return (
    <div className="grid grid-cols-3">
      <Columna etiqueta={sinBarras(t("wm.pagesLabel"))}>
        {paginas.map((l, i) => (
          <EnlaceMM key={l.titulo} {...l} i={i} alElegir={alElegir} />
        ))}
      </Columna>

      <Columna etiqueta={sinBarras(t("wm.recentLabel"))}>
        {recientes.map((p, i) => (
          <Link
            key={p.slug}
            href={{ pathname: "/v2/work/[slug]", params: { slug: p.slug } }}
            className="v2-mm-link flex items-center gap-3 px-5 py-2.5 transition-colors"
            onPointerEnter={(e) => e.pointerType === "mouse" && sonarHover(i + 5)}
            onClick={() => {
              sonarClic("select", i + 5);
              alElegir();
            }}
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
            <span className="flex min-w-0 flex-col">
              <span className="text-[14px] font-medium text-[var(--v2-text)]">{p.name}</span>
              <span className="truncate text-[12.5px] text-[var(--v2-muted)]">{p.category}</span>
            </span>
            <ArrowRight size={15} className="v2-mm-flecha" aria-hidden />
          </Link>
        ))}
      </Columna>

      <div className="flex flex-col">
        <div className="v2-label border-b border-[var(--v2-line)] px-5 py-3">{sinBarras(t("wm.featuredLabel"))}</div>
        {destacado ? (
          <Link
            href={{ pathname: "/v2/work/[slug]", params: { slug: destacado.slug } }}
            className="group flex flex-1 flex-col"
            onClick={() => {
              sonarClic("select");
              alElegir();
            }}
          >
            <div className="relative aspect-[16/9] overflow-hidden" style={{ backgroundColor: destacado.color }}>
              {video ? (
                <video data-src={video} muted loop playsInline className="absolute inset-0 h-full w-full object-cover" />
              ) : destacado.cover ? (
                <img src={destacado.cover} alt="" className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.03]" />
              ) : null}
            </div>
            <div className="flex items-center justify-between gap-3 border-t border-[var(--v2-line)] px-5 py-3">
              <span className="text-[14px] font-medium">
                {destacado.name} <span className="text-[var(--v2-muted)]">· {destacado.category}</span>
              </span>
              <ArrowUpRight size={15} className="shrink-0 text-[var(--v2-accent)] transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
            </div>
          </Link>
        ) : (
          <p className="p-5 text-[13px] text-[var(--v2-muted)]">{tv("mm.noFeatured")}</p>
        )}
      </div>
    </div>
  );
}
