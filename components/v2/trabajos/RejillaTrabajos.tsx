"use client";

import { useEffect, useRef, useState } from "react";
import { ArrowRight } from "lucide-react";
import { useTranslations } from "next-intl";
import { Link } from "@/navigation";
import type { ResolvedProject } from "@/lib/cms/types";
import { sonarClic, sonarHover } from "@/lib/v2/ui-sound";

/*
 * La rejilla de la página de Trabajos (al estilo de la de DesignMe): filtros
 * por tipo arriba y tarjetas en tres columnas, cada una con su vídeo o
 * portada enmarcada, cliente, tipo y año, y lo que se hizo.
 *
 * Cada tarjeta lleva a la página del caso (/v2/trabajos/[slug]). Los
 * proyectos «Próximamente» salen al final y sin enlace.
 */

type Filtro = "todos" | "web" | "ecommerce" | "producto";

/** El tipo, a partir de la categoría que tiene cada proyecto en el gestor. */
function tipoDe(p: ResolvedProject): Exclude<Filtro, "todos"> {
  if (/e-?commerce|tienda/i.test(p.category)) return "ecommerce";
  if (/saas|lms|admin|app|producto|product/i.test(p.category)) return "producto";
  return "web";
}

export function RejillaTrabajos({ proyectos, videos }: { proyectos: ResolvedProject[]; videos: Record<string, string> }) {
  const t = useTranslations("v2Trabajos");
  const [filtro, setFiltro] = useState<Filtro>("todos");

  const listos = proyectos.filter((p) => !p.comingSoon);
  const proximos = proyectos.filter((p) => p.comingSoon);
  const visibles = filtro === "todos" ? listos : listos.filter((p) => tipoDe(p) === filtro);
  // Solo los filtros que tienen algo dentro.
  const filtros = (["todos", "web", "ecommerce", "producto"] as const).filter(
    (f) => f === "todos" || listos.some((p) => tipoDe(p) === f),
  );
  const cuenta = (f: Filtro) => (f === "todos" ? listos.length : listos.filter((p) => tipoDe(p) === f).length);

  return (
    <div className="flex flex-col">
      <div role="tablist" aria-label={t("filtrosAria")} className="flex flex-wrap justify-center gap-2 px-6 pb-10">
        {filtros.map((f, i) => {
          const on = f === filtro;
          return (
            <button
              key={f}
              type="button"
              role="tab"
              aria-selected={on}
              onPointerEnter={(e) => e.pointerType === "mouse" && sonarHover(i)}
              onClick={() => {
                if (on) return;
                sonarClic("select", i);
                setFiltro(f);
              }}
              className={`inline-flex items-center gap-2 rounded-[6px] border px-3.5 py-2 text-[14px] font-medium transition-colors ${
                on
                  ? "border-[var(--v2-text)] bg-[var(--v2-text)] text-[var(--v2-bg)]"
                  : "border-[var(--v2-line)] text-[var(--v2-muted)] hover:border-[var(--v2-line-strong)] hover:text-[var(--v2-text)]"
              }`}
            >
              {t(`filtros.${f}`)}
              <span className={`font-mono text-[11px] ${on ? "opacity-70" : "text-[var(--v2-faint)]"}`}>{cuenta(f)}</span>
            </button>
          );
        })}
      </div>

      <div className="v2-rail border-t border-[var(--v2-line)]">
        <ul className="grid grid-cols-1 gap-4 p-4 sm:grid-cols-2 md:gap-5 md:p-8 lg:grid-cols-3">
          {visibles.map((p) => (
            <li key={p.slug} className="flex">
              <TarjetaTrabajo p={p} video={videos[p.slug]} verCaso={t("verCaso")} />
            </li>
          ))}
          {filtro === "todos" &&
            proximos.map((p) => (
              <li key={p.slug} className="flex">
                <TarjetaTrabajo p={p} proximamente={t("proximamente")} />
              </li>
            ))}
        </ul>
      </div>
    </div>
  );
}

/** La tarjeta de un trabajo; también la usan los «más casos» de cada caso. */
export function TarjetaTrabajo({
  p,
  video,
  verCaso,
  proximamente,
}: {
  p: ResolvedProject;
  video?: string;
  verCaso?: string;
  proximamente?: string;
}) {
  const etiqueta = p.category.split("·")[0]?.trim();
  const cuerpo = (
    <>
      {/* La imagen, enmarcada dentro de la tarjeta como en DesignMe. */}
      <span className="block p-2.5">
        <span className="relative block aspect-[4/3] overflow-hidden rounded-[5px]" style={{ backgroundColor: p.color }}>
          <Medio p={p} video={video} />
        </span>
      </span>
      <span className="flex items-center gap-2 border-b border-[var(--v2-line)] px-4 py-3">
        <span className="truncate text-[14.5px] font-medium">{p.name}</span>
        {proximamente ? (
          <span className="v2-tag">{proximamente}</span>
        ) : (
          etiqueta && (
            <span className="shrink-0 rounded-[4px] bg-[var(--v2-hover)] px-2 py-0.5 text-[12px] text-[var(--v2-muted)]">
              {etiqueta}
            </span>
          )
        )}
        {p.year ? <span className="v2-label ml-auto shrink-0">{p.year}</span> : null}
      </span>
      <span className="flex flex-1 items-start gap-4 px-4 py-4">
        <span className="line-clamp-3 flex-1 text-[16px] font-medium leading-[1.35] tracking-[-0.01em]">
          {p.description || p.name}
        </span>
        {!proximamente && (
          <span className="v2-ico shrink-0" aria-hidden>
            <ArrowRight size={14} />
          </span>
        )}
      </span>
    </>
  );

  if (proximamente) {
    return <div className="v2-card flex w-full flex-col opacity-80">{cuerpo}</div>;
  }
  return (
    <Link
      href={{ pathname: "/work/[slug]", params: { slug: p.slug } }}
      aria-label={`${verCaso}: ${p.name}`}
      className="v2-card v2-rel group flex w-full flex-col"
    >
      {cuerpo}
    </Link>
  );
}

/** Vídeo si lo hay (solo se reproduce mientras se ve), si no la portada o el logo. */
function Medio({ p, video }: { p: ResolvedProject; video?: string }) {
  const ref = useRef<HTMLVideoElement>(null);
  useEffect(() => {
    const v = ref.current;
    if (!v) return;
    const io = new IntersectionObserver(([e]) => (e.isIntersecting ? v.play().catch(() => {}) : v.pause()), {
      threshold: 0.25,
    });
    io.observe(v);
    return () => io.disconnect();
  }, []);

  const imagen = p.cover ?? p.gallery?.[0]?.src;
  if (video) {
    return (
      <video
        ref={ref}
        src={video}
        poster={imagen}
        muted
        loop
        playsInline
        preload="metadata"
        className="absolute inset-0 h-full w-full object-cover transition-transform duration-[900ms] ease-[var(--v2-ease)] group-hover:scale-[1.03]"
      />
    );
  }
  if (imagen) {
    return (
      <img
        src={imagen}
        alt=""
        loading="lazy"
        className="absolute inset-0 h-full w-full object-cover object-left-top transition-transform duration-[900ms] ease-[var(--v2-ease)] group-hover:scale-[1.03]"
      />
    );
  }
  if (p.logo) {
    return (
      <span className="absolute inset-0 flex items-center justify-center p-12">
        <img src={p.logo} alt="" loading="lazy" className="max-h-16 w-auto max-w-[70%] object-contain" />
      </span>
    );
  }
  return (
    <span className="absolute inset-0 flex items-center justify-center text-[22px] font-medium text-white/85">{p.name}</span>
  );
}
