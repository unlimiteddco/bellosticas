import {
  ArrowRight,
  ArrowRightLeft,
  ArrowUpRight,
  Check,
  Compass,
  LayoutDashboard,
  Layers,
  type LucideIcon,
  Monitor,
  PenTool,
  Search,
  ShoppingBag,
  Workflow,
} from "lucide-react";
import { getTranslations } from "next-intl/server";
import { Link } from "@/navigation";
import { services } from "@/lib/services";
import { TOOL_COLORS, TOOL_LOGOS } from "@/lib/tool-logos";
import type { ResolvedProject } from "@/lib/cms/types";
import { ProofRow } from "@/components/v2/home/ProofRow";
import { ProcesoTabs, type Paso } from "./ProcesoTabs";

/*
 * La plantilla de las páginas de servicio de la V2: una biblioteca de bloques
 * que cada página compone a su manera (no todas llevan los mismos). Cada
 * bloque recibe `ns`, el espacio de textos de la página (v2Brand, v2Webs…), y
 * lee de ahí su parte: `${ns}.hero`, `${ns}.proceso`, etc.
 *
 * Con el marco de líneas de la V2. «Cómo trabajamos» va en una banda negra
 * para intercalar; los casos y los servicios relacionados, en tarjetas
 * sueltas, y estos últimos sobre una banda gris sin marco.
 */

type T = Awaited<ReturnType<typeof getTranslations>>;
type Destino = React.ComponentProps<typeof Link>["href"];

/** Cabecera de sección: etiqueta, titular con la palabra en cursiva roja y entradilla. */
export function Cabecera({ t, centro = true }: { t: T; centro?: boolean }) {
  return (
    <div className={`flex flex-col gap-5 ${centro ? "items-center px-6 py-20 text-center lg:py-24" : ""}`}>
      <span className="v2-label" data-reveal>
        {t("label")}
      </span>
      <h2
        className={`v2-h2 ${centro ? "max-w-[820px]" : ""}`}
        data-reveal
      >
        {t("title_part1")}
        <em className="font-display italic font-semibold text-[var(--v2-accent)]">{t("title_emphasis")}</em>
        {t("title_part2")}
      </h2>
      {t.has("sub") && (
        <p className={`text-[16px] leading-[1.6] text-[var(--v2-muted)] ${centro ? "max-w-[560px]" : "max-w-[440px]"}`} data-reveal>
          {t("sub")}
        </p>
      )}
    </div>
  );
}

/** La línea que se dibuja en lo alto de cada sección con marco. */
export const LineaArriba = () => (
  <span aria-hidden data-draw className="pointer-events-none absolute left-0 right-0 top-0 h-px bg-[var(--v2-line)]" />
);

/* ───────────────────────── Hero ───────────────────────── */

/** `ancla`: a qué sección baja el segundo botón (por defecto, el proceso). */
export async function ServicioHero({ locale, ns, ancla = "proceso" }: { locale: string; ns: string; ancla?: string }) {
  const t = await getTranslations({ locale, namespace: `${ns}.hero` });
  return (
    <section className="v2-frame">
      <div className="flex flex-col items-center gap-7 px-6 pb-16 pt-14 text-center md:px-10 lg:pb-20 lg:pt-24">
        <span className="v2-label v2-hero-in flex items-center gap-2.5">
          <span aria-hidden className="h-1.5 w-1.5 rounded-full bg-[var(--v2-accent)]" />
          {t("label")}
        </span>
        <h1
          className="v2-hero-in v2-h1"
          style={{ animationDelay: "80ms" }}
        >
          <span className="block">{t("line1")}</span>
          <span className="block">
            {t("line2_pre")}
            <em className="font-display italic font-semibold text-[var(--v2-accent)]">{t("line2_em")}</em>
            {t("line2_post")}
          </span>
        </h1>
        <p
          // Tres líneas como mucho en escritorio: ~190 caracteres de texto.
          className="v2-hero-in max-w-[640px] text-[16px] leading-[1.6] text-[var(--v2-muted)] lg:text-[18px]"
          style={{ animationDelay: "160ms" }}
        >
          {t("sub")}
        </p>
        <div
          className="v2-hero-in flex w-full flex-col gap-3 sm:w-auto sm:flex-row sm:justify-center"
          style={{ animationDelay: "240ms" }}
        >
          <Link href="/v2/intro" className="v2-btn v2-btn--primary h-12 w-full sm:h-[46px] sm:w-auto">
            {t("ctaPrimary")}
          </Link>
          <a href={`#${ancla}`} className="v2-btn v2-btn--ghost h-12 w-full sm:h-[46px] sm:w-auto">
            {t("ctaSecondary")}
          </a>
        </div>
        {t.has("note") && (
          <span className="v2-label v2-hero-in" style={{ animationDelay: "280ms" }}>
            {t("note")}
          </span>
        )}
        <ProofRow locale={locale} className="v2-hero-in mt-4 justify-center" style={{ animationDelay: "320ms" }} />
      </div>
    </section>
  );
}

/* ───────────────────────── Casos ───────────────────────── */

export type CasoServicio = {
  proyecto: ResolvedProject;
  /** Vídeo del caso; si no hay, la portada (y si tampoco, el logo). */
  video?: string;
  /** Imagen propia para el caso cuando el proyecto no tiene portada en el
      gestor (p. ej. una captura de la web entera, que se encuadra por arriba). */
  imagen?: string;
  /** Lo que dice el cliente, si lo ha dicho (no nos lo inventamos). */
  testimonio?: { quote: string; name: string; role: string; cara?: string };
};

/**
 * Los casos, cada uno en su tarjeta (como en DesignMe): texto, enlace y la
 * cita del cliente a un lado, el vídeo o la portada al otro. Se alternan.
 */
export async function ServicioCasos({ locale, ns, casos }: { locale: string; ns: string; casos: CasoServicio[] }) {
  if (!casos.length) return null;
  const t = await getTranslations({ locale, namespace: `${ns}.caso` });

  return (
    <section className="v2-frame">
      <div className="v2-rail">
        <LineaArriba />
        <Cabecera t={t} />
        <div className="flex flex-col gap-10 px-6 pb-20 md:px-10 lg:gap-14 lg:pb-24">
          {casos.map(({ proyecto: p, video, imagen: propia, testimonio }, i) => {
            // Sin portada en el gestor: la imagen propia del caso o, si no, la
            // primera captura de su galería (FADA y Voluntariado solo tienen esas).
            const imagen = propia ?? p.gallery?.[0]?.src;
            const etiquetas = p.category
              .split("·")
              .map((c) => c.trim())
              .filter(Boolean);
            const titular = t.has(`headings.${p.slug}`) ? t(`headings.${p.slug}`) : p.name;
            return (
              <article key={p.slug} className="v2-card grid grid-cols-1 overflow-hidden lg:grid-cols-12" data-reveal>
                <div className="flex flex-col gap-5 p-6 md:p-8 lg:col-span-5">
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="text-[14px] font-medium">{p.name}</span>
                      {etiquetas.map((c) => (
                        <span key={c} className="rounded-[4px] bg-[var(--v2-hover)] px-2 py-0.5 text-[12px] text-[var(--v2-muted)]">
                          {c}
                        </span>
                      ))}
                    </div>
                    {p.year ? <span className="v2-label">{p.year}</span> : null}
                  </div>
                  <h3 className="text-[22px] font-medium leading-[1.2] tracking-[-0.015em] md:text-[24px]">{titular}</h3>
                  <p className="text-[15px] leading-[1.65] text-[var(--v2-muted)]">{p.description}</p>
                  <Link href={{ pathname: "/v2/work/[slug]", params: { slug: p.slug } }} className="v2-link self-start">
                    {t("cta")} <ArrowUpRight size={14} className="text-[var(--v2-accent)]" />
                  </Link>
                  {testimonio && (
                    <figure className="mt-auto flex flex-col gap-4 rounded-[6px] bg-[var(--v2-bg-2)] p-5">
                      <blockquote className="text-[14.5px] leading-[1.55]">“{testimonio.quote}”</blockquote>
                      <figcaption className="flex items-center gap-3">
                        {testimonio.cara && (
                          <img src={testimonio.cara} alt="" width={40} height={40} className="h-10 w-10 rounded-full object-cover" />
                        )}
                        <span className="flex flex-col">
                          <span className="text-[14px] font-medium">{testimonio.name}</span>
                          <span className="text-[12.5px] text-[var(--v2-muted)]">{testimonio.role}</span>
                        </span>
                      </figcaption>
                    </figure>
                  )}
                </div>
                <div
                  className={`relative aspect-[16/10] overflow-hidden border-t border-[var(--v2-line)] lg:col-span-7 lg:aspect-auto lg:min-h-[480px] lg:border-t-0 ${
                    i % 2 ? "lg:order-first lg:border-r" : "lg:border-l"
                  }`}
                  style={{ backgroundColor: p.color }}
                >
                  {video ? (
                    <video
                      src={video}
                      poster={p.cover}
                      autoPlay
                      muted
                      loop
                      playsInline
                      className="absolute inset-0 h-full w-full object-cover"
                    />
                  ) : p.cover ? (
                    // Capturas de webs: encuadradas por arriba a la izquierda, donde va el logo.
                    <img src={p.cover} alt="" loading="lazy" className="absolute inset-0 h-full w-full object-cover object-left-top" />
                  ) : imagen ? (
                    <img src={imagen} alt="" loading="lazy" className="absolute inset-0 h-full w-full object-cover object-left-top" />
                  ) : p.logo ? (
                    <span className="absolute inset-0 flex items-center justify-center p-10">
                      <img
                        src={p.logo}
                        alt={p.name}
                        style={{ maxHeight: 84 * ((p.logoScale ?? 100) / 100), maxWidth: 320 * ((p.logoScale ?? 100) / 100) }}
                      />
                    </span>
                  ) : (
                    // Sin imagen ni logo: el nombre, en grande sobre su color.
                    <span className="absolute inset-0 flex items-center justify-center p-10 text-[32px] font-medium tracking-[-0.03em] text-white/90 md:text-[44px]">
                      {p.name}
                    </span>
                  )}
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}

/* ───────────────────────── Proceso (banda negra) ───────────────────────── */

export async function ServicioProceso({ locale, ns }: { locale: string; ns: string }) {
  const t = await getTranslations({ locale, namespace: `${ns}.proceso` });
  return (
    // Banda negra a todo el ancho para intercalar con las secciones claras;
    // la cabecera de la web cambia de tono al pasar por encima.
    <section id="proceso" data-header-tone="dark" className="v2-oscuro scroll-mt-20">
      <div className="v2-frame">
        <div className="v2-rail">
          <Cabecera t={t} />
          <ProcesoTabs pasos={t.raw("steps") as Paso[]} etiquetaSalidas={t("outputsLabel")} />
          {/* Un poco de aire antes de volver a lo claro. */}
          <div className="h-16 lg:h-20" />
        </div>
      </div>
    </section>
  );
}

/* ───────────────────────── Rejilla (qué incluye, revisiones…) ───────────────────────── */

/**
 * Cabecera y una rejilla de celdas con icono, título y texto. Sirve para «Qué
 * incluye», «Antes de publicar» y cualquier lista de puntos parecida: `parte`
 * dice qué trozo de los textos de la página usa.
 */
export async function ServicioRejilla({
  locale,
  ns,
  parte,
  iconos,
  linea = false,
}: {
  locale: string;
  ns: string;
  parte: string;
  iconos: LucideIcon[];
  /** Línea arriba: no hace falta justo después de la banda negra. */
  linea?: boolean;
}) {
  const t = await getTranslations({ locale, namespace: `${ns}.${parte}` });
  const items = t.raw("items") as { title: string; text: string }[];
  return (
    <section className="v2-frame">
      <div className="v2-rail">
        {linea && <LineaArriba />}
        <Cabecera t={t} />
        {/* Celdas: las líneas salen del hueco de 1px de la rejilla. */}
        <div className="grid grid-cols-1 gap-px border-t border-[var(--v2-line)] bg-[var(--v2-line)] sm:grid-cols-2 lg:grid-cols-3">
          {items.map((it, i) => {
            const Icono = iconos[i] ?? Compass;
            return (
              <div key={it.title} className="v2-celda flex flex-col gap-4 bg-[var(--v2-bg)] p-6 md:p-10" data-reveal>
                <span className="v2-ico v2-ico--lg">
                  <Icono size={18} strokeWidth={1.75} />
                </span>
                <h3 className="text-[19px] font-medium tracking-[-0.01em]">{it.title}</h3>
                <p className="text-[15px] leading-[1.6] text-[var(--v2-muted)]">{it.text}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

/* ───────────────────────── Antes y después ───────────────────────── */

/** Dos capturas de una misma web, antes y después, lado a lado (encuadradas por arriba). */
export async function ServicioAntesDespues({
  locale,
  ns,
  antes,
  despues,
}: {
  locale: string;
  ns: string;
  antes: string;
  despues: string;
}) {
  const t = await getTranslations({ locale, namespace: `${ns}.antesDespues` });
  const fotos = [
    { src: antes, etiqueta: t("antes") },
    { src: despues, etiqueta: t("despues") },
  ];
  return (
    <section className="v2-frame">
      <div className="v2-rail">
        <LineaArriba />
        <Cabecera t={t} />
        <div className="grid grid-cols-1 gap-4 border-t border-[var(--v2-line)] p-4 md:grid-cols-2 md:gap-6 md:p-8">
          {fotos.map((f) => (
            <figure key={f.src} className="relative aspect-[4/5] overflow-hidden rounded-[8px] border border-[var(--v2-line)] bg-[var(--v2-bg-2)]" data-reveal>
              <span className="v2-tag absolute left-3 top-3 z-10">{f.etiqueta}</span>
              <img src={f.src} alt={f.etiqueta} loading="lazy" className="absolute inset-0 h-full w-full object-cover object-top" />
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ───────────────────────── Tecnologías ───────────────────────── */

/**
 * «Con qué lo construimos»: la tecnología va dentro de la página del servicio
 * y no en una página por herramienta. Al cliente le importa qué hace su web;
 * aquí se le cuenta cuándo usamos cada una.
 */
export async function ServicioTecnologias({ locale, ns }: { locale: string; ns: string }) {
  const t = await getTranslations({ locale, namespace: `${ns}.tecnologias` });
  const items = t.raw("items") as { name: string; cuando: string; text: string }[];
  return (
    <section className="v2-frame">
      <div className="v2-rail">
        <LineaArriba />
        <Cabecera t={t} />
        <div className="grid grid-cols-1 gap-px border-t border-[var(--v2-line)] bg-[var(--v2-line)] sm:grid-cols-2 lg:grid-cols-4">
          {items.map((it) => {
            const trazo = TOOL_LOGOS[it.name];
            return (
              <div key={it.name} className="flex flex-col gap-5 bg-[var(--v2-bg)] p-6 md:p-8" data-reveal>
                <span className="flex items-center gap-3">
                  <span
                    className="inline-flex h-12 w-12 items-center justify-center rounded-[8px] border border-[var(--v2-line)]"
                    // Un fondo muy suave de su color de marca, si lo tiene.
                    style={TOOL_COLORS[it.name] ? { background: `color-mix(in srgb, ${TOOL_COLORS[it.name]} 9%, transparent)` } : undefined}
                  >
                    {trazo ? (
                      // Con su color de marca; los de marca negra, con el del texto.
                      <svg viewBox="0 0 24 24" className="h-6 w-6" fill={TOOL_COLORS[it.name] ?? "currentColor"} aria-hidden>
                        <path d={trazo} />
                      </svg>
                    ) : (
                      // Sin logo en la lista: la inicial, para que todas lleven su caja.
                      <span aria-hidden className="font-mono text-[15px] font-medium">
                        {it.name.charAt(0)}
                      </span>
                    )}
                  </span>
                  <span className="text-[20px] font-medium tracking-[-0.01em]">{it.name}</span>
                </span>
                <span className="flex flex-col gap-1.5">
                  <span className="v2-label !text-[10px]">{t("cuandoLabel")}</span>
                  <span className="text-[15px] font-medium">{it.cuando}</span>
                </span>
                <p className="text-[14.5px] leading-[1.6] text-[var(--v2-muted)]">{it.text}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

/* ───────────────────────── Formatos ───────────────────────── */

/**
 * `opcion`: la opción de la página de precios a la que lleva «Ver precios» de
 * cada formato (?opcion=ecommerce&nivel=avanzada). Cada formato puede traer su
 * precio y decir cuál va destacado; si ninguno lo dice, el último.
 */
export async function ServicioFormatos({ locale, ns, opcion }: { locale: string; ns: string; opcion?: string }) {
  const t = await getTranslations({ locale, namespace: `${ns}.formatos` });
  // `compromiso`: en las suscripciones, «Ver precios» abre el precio con el
  // descuento por compromiso ya puesto.
  const items = t.raw("items") as {
    title: string;
    text: string;
    points: string[];
    price?: string;
    desde?: boolean;
    destacado?: boolean;
    compromiso?: boolean;
  }[];
  const marcado = Math.max(
    items.findIndex((x) => x.destacado),
    items.some((x) => x.destacado) ? 0 : items.length - 1,
  );
  const nivel = (s: string) =>
    s
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-|-$/g, "");
  return (
    <section className="v2-frame">
      <div className="v2-rail">
        <LineaArriba />
        <Cabecera t={t} />
        <div
          className={`grid grid-cols-1 gap-px border-t border-[var(--v2-line)] bg-[var(--v2-line)] md:grid-cols-2 ${items.length === 3 ? "lg:grid-cols-3" : ""}`}
        >
          {items.map((it, i) => {
            const destacado = i === marcado;
            return (
              <div
                key={it.title}
                className={`flex flex-col gap-6 p-6 md:p-10 lg:p-12 ${destacado ? "bg-[var(--v2-bg-2)]" : "bg-[var(--v2-bg)]"}`}
                data-reveal
              >
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <h3 className="text-[26px] font-medium tracking-[-0.02em] md:text-[30px]">{it.title}</h3>
                  {destacado && (
                    <span className="v2-tag">
                      {t("badge")}
                    </span>
                  )}
                </div>
                {/* El precio en la letra de los titulares; «A presupuesto», más pequeño. */}
                {it.price &&
                  (/\d/.test(it.price) ? (
                    <span className="flex items-baseline gap-2">
                      {it.desde && t.has("desdeLabel") && <span className="text-[15px] text-[var(--v2-muted)]">{t("desdeLabel")}</span>}
                      <span className="whitespace-nowrap font-medium tabular-nums leading-none tracking-[-0.04em] text-[38px] md:text-[44px]">{it.price}</span>
                    </span>
                  ) : (
                    <span className="text-[22px] font-medium tracking-[-0.02em] text-[var(--v2-muted)] md:text-[26px]">{it.price}</span>
                  ))}
                <p className="text-[15px] leading-[1.6] text-[var(--v2-muted)]">{it.text}</p>
                <ul className="flex flex-col border-t border-[var(--v2-line)]">
                  {it.points.map((pt) => (
                    <li key={pt} className="flex items-center gap-3 border-b border-[var(--v2-line)] py-3 text-[15px]">
                      <Check size={15} strokeWidth={2} className="shrink-0 text-[var(--v2-accent)]" />
                      {pt}
                    </li>
                  ))}
                </ul>
                <div className="mt-auto flex flex-wrap items-center gap-x-5 gap-y-3">
                  <Link
                    href={{ pathname: "/v2/intro", query: { interes: t.has("interes") ? `${t("interes")} · ${it.title}` : it.title } }}
                    className={`v2-btn ${destacado ? "v2-btn--primary" : "v2-btn--ghost"}`}
                  >
                    {t("cta")}
                  </Link>
                  {opcion && t.has("precios") && (
                    <Link
                      href={{
                        pathname: "/v2/pricing",
                        query: it.compromiso ? { opcion, compromiso: "1" } : { opcion, nivel: nivel(it.title) },
                      }}
                      className="v2-link text-[var(--v2-muted)] hover:text-[var(--v2-text)]"
                    >
                      {t("precios")} <ArrowRight size={13} />
                    </Link>
                  )}
                </div>
              </div>
            );
          })}
        </div>
        <p className="border-t border-[var(--v2-line)] px-6 py-5 text-center text-[13.5px] text-[var(--v2-muted)]">{t("note")}</p>
      </div>
    </section>
  );
}

/* ───────────────────────── Por qué ───────────────────────── */

export async function ServicioPorQue({ locale, ns }: { locale: string; ns: string }) {
  const t = await getTranslations({ locale, namespace: `${ns}.porque` });
  const items = t.raw("items") as { title: string; text: string }[];
  return (
    <section className="v2-frame">
      <div className="v2-rail grid grid-cols-1 lg:grid-cols-12">
        <LineaArriba />
        <div className="border-b border-[var(--v2-line)] p-6 md:p-10 lg:col-span-5 lg:border-b-0 lg:border-r lg:p-14">
          <div className="lg:sticky lg:top-28">
            <Cabecera t={t} centro={false} />
          </div>
        </div>
        <ol className="lg:col-span-7">
          {items.map((it, i) => (
            <li
              key={it.title}
              className="flex gap-6 border-b border-[var(--v2-line)] p-6 last:border-b-0 md:gap-10 md:p-10"
              data-reveal
            >
              <span className="font-mono text-[12px] text-[var(--v2-accent)]">{String(i + 1).padStart(2, "0")}</span>
              <div className="flex flex-col gap-2">
                <h3 className="text-[20px] font-medium tracking-[-0.01em] md:text-[22px]">{it.title}</h3>
                <p className="max-w-[520px] text-[15px] leading-[1.6] text-[var(--v2-muted)]">{it.text}</p>
              </div>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}

/* ───────────────────────── Cifras ───────────────────────── */

/**
 * Cifras en celdas. Con título (title_part1…) va con su cabecera, como la de
 * plazos de Webs; sin él, solo la etiqueta y las celdas.
 */
export async function ServicioCifras({ locale, ns }: { locale: string; ns: string }) {
  const t = await getTranslations({ locale, namespace: `${ns}.cifras` });
  const items = t.raw("items") as { value: string; text: string }[];
  const conTitulo = t.has("title_part1");
  return (
    <section className="v2-frame">
      <div className="v2-rail">
        <LineaArriba />
        {conTitulo ? (
          <Cabecera t={t} />
        ) : (
          <div className="px-6 py-5 md:px-10">
            <span className="v2-label">{t("label")}</span>
          </div>
        )}
        <div className="grid grid-cols-2 gap-px border-t border-[var(--v2-line)] bg-[var(--v2-line)] lg:grid-cols-4">
          {items.map((it) => (
            <div key={it.text} className="flex flex-col gap-2 bg-[var(--v2-bg)] p-6 md:p-10" data-reveal>
              <span className="text-[44px] font-medium leading-none tracking-[-0.04em] md:text-[56px]">{it.value}</span>
              <span className="max-w-[220px] text-[14px] leading-[1.45] text-[var(--v2-muted)]">{it.text}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ───────────────────────── Servicios relacionados ───────────────────────── */

export type ClaveServicio = "marca" | "seo" | "s01" | "s02" | "s03" | "s04" | "s05" | "s06";

/** El mismo icono que lleva cada servicio en el megamenú. */
const ICONO_SERVICIO: Record<ClaveServicio, LucideIcon> = {
  marca: PenTool,
  seo: Search,
  s01: Monitor,
  s02: ShoppingBag,
  s03: LayoutDashboard,
  s04: Workflow,
  s05: ArrowRightLeft,
  s06: Layers,
};

/** Las que ya tienen página en la V2; el resto, a su página de siempre. */
const PAGINA_V2: Partial<Record<ClaveServicio, Destino>> = {
  marca: "/v2/services/brand-identity",
  seo: "/v2/services/seo-aeo",
  s01: "/v2/services/desarrollo-web",
  s02: "/v2/services/ecommerce",
  s03: "/v2/services/aplicaciones-web",
  s04: "/v2/services/automatizaciones",
  s05: "/v2/services/migraciones",
  s06: "/v2/services/white-label",
};

export async function ServicioRelacionados({ locale, ns, claves }: { locale: string; ns: string; claves: ClaveServicio[] }) {
  const t = await getTranslations({ locale, namespace: `${ns}.relacionados` });
  const ts = await getTranslations({ locale, namespace: "services" });
  const tn = await getTranslations({ locale, namespace: "v2Servicios" });

  type Tarjeta = { k: ClaveServicio; nombre: string; texto: string; href: Destino };
  const tarjetas = claves.flatMap((k): Tarjeta[] => {
    if (k === "marca") return [{ k, nombre: tn("marca"), texto: tn("marcaTexto"), href: PAGINA_V2.marca! }];
    if (k === "seo") return [{ k, nombre: tn("seo"), texto: tn("seoTexto"), href: PAGINA_V2.seo! }];
    const s = services.find((x) => x.titleKey === k);
    if (!s) return [];
    // Nombres cortos (v2Servicios): que cada tarjeta quepa en una línea.
    return [{ k, nombre: tn(k), texto: ts(`items.${k}.description`), href: PAGINA_V2[k] ?? (`/services/${s.slug}` as Destino) }];
  });

  return (
    // Banda gris a todo el ancho y sin el marco de líneas (como en DesignMe):
    // da aire tras los testimonios y las tarjetas blancas destacan encima.
    <section className="bg-[var(--v2-bg-2)]">
      <div className="v2-frame">
        <div className="grid grid-cols-1 gap-12 px-6 py-24 md:px-10 lg:grid-cols-12 lg:gap-10 lg:py-32">
          <div className="flex flex-col gap-6 lg:col-span-5">
            <span className="v2-label" data-reveal>
              {t("label")}
            </span>
            <h2 className="v2-h2" data-reveal>
              {t("title_part1")}
              <em className="font-display italic font-semibold text-[var(--v2-accent)]">{t("title_emphasis")}</em>
              {t("title_part2")}
            </h2>
            <p className="max-w-[440px] text-[17px] leading-[1.55]" data-reveal>
              {t("sub")}
            </p>
            <span aria-hidden className="mt-4 h-px w-40 bg-[var(--v2-line-strong)]" />
            <Link href="/v2/intro" className="v2-link self-start" data-reveal>
              {t("cta")} <ArrowRight size={14} className="text-[var(--v2-accent)]" />
            </Link>
          </div>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:col-span-7 lg:self-center">
            {tarjetas.map(({ k, nombre, texto, href }) => {
              const Icono = ICONO_SERVICIO[k];
              return (
                <Link key={k} href={href} className="v2-card v2-rel flex flex-col" data-reveal>
                  <span className="flex items-center gap-3 border-b border-[var(--v2-line)] px-6 py-5">
                    <span className="v2-ico">
                      <Icono size={14} strokeWidth={1.75} />
                    </span>
                    <span className="flex-1 text-[17px] font-medium tracking-[-0.01em]">{nombre}</span>
                    <ArrowRight size={17} className="v2-mm-flecha" aria-hidden />
                  </span>
                  <span className="px-6 py-5 text-[14.5px] leading-[1.6] text-[var(--v2-muted)]">{texto}</span>
                </Link>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
