"use client";

import { useState } from "react";
import { ArrowRight, ArrowUpRight } from "lucide-react";
import { useTranslations } from "next-intl";
import { Link } from "@/navigation";
import { AsteriskIcon } from "@/components/ui/AsteriskIcon";
import { sonarClic, sonarHover } from "@/lib/v2/ui-sound";

/** Lo que necesita una tarjeta (la fecha ya viene formateada del servidor). */
export type PostTarjeta = {
  slug: string;
  title: string;
  excerpt?: string;
  coverImage?: string;
  tags?: string[];
  fecha: string;
};

/** La portada del artículo o, si no tiene, el asterisco de la marca sobre negro. */
export function PortadaPost({ post, className = "" }: { post: PostTarjeta; className?: string }) {
  return (
    <div className={`relative overflow-hidden bg-[#121211] ${className}`}>
      {post.coverImage ? (
        <img
          src={post.coverImage}
          alt=""
          loading="lazy"
          className="absolute inset-0 h-full w-full object-cover transition-transform duration-[900ms] ease-[var(--v2-ease)] group-hover:scale-[1.03]"
        />
      ) : (
        <span aria-hidden className="absolute inset-0 flex items-center justify-center">
          <span
            className="absolute inset-0 opacity-60"
            style={{
              backgroundImage: "radial-gradient(circle, rgba(255,255,255,0.09) 1px, transparent 1.4px)",
              backgroundSize: "18px 18px",
              maskImage: "radial-gradient(ellipse at 50% 50%, #000 25%, transparent 75%)",
              WebkitMaskImage: "radial-gradient(ellipse at 50% 50%, #000 25%, transparent 75%)",
            }}
          />
          <AsteriskIcon className="relative h-12 w-12 text-[var(--v2-accent)] transition-transform duration-700 ease-[var(--v2-ease)] group-hover:rotate-45" />
        </span>
      )}
    </div>
  );
}

/** Una tarjeta del blog, en celda (para las rejillas con líneas). */
export function TarjetaPost({ post, i = 0, leer }: { post: PostTarjeta; i?: number; leer: string }) {
  return (
    <Link
      href={{ pathname: "/v2/blog/[slug]", params: { slug: post.slug } }}
      className="group flex flex-col bg-[var(--v2-bg)] transition-colors hover:bg-[var(--v2-bg-2)]"
      onPointerEnter={(e) => e.pointerType === "mouse" && sonarHover(i)}
      onClick={() => sonarClic("select", i)}
      data-reveal
    >
      <div className="p-4 pb-0 md:p-5 md:pb-0">
        <PortadaPost post={post} className="aspect-[16/10] rounded-[6px] border border-[var(--v2-line)]" />
      </div>
      <div className="flex flex-1 flex-col gap-3 p-6 md:p-7">
        <span className="v2-label flex flex-wrap items-center gap-x-2">
          <span>{post.fecha}</span>
          {post.tags?.[0] && <span className="text-[var(--v2-accent)]">· {post.tags[0]}</span>}
        </span>
        <h3 className="text-[20px] font-medium leading-[1.25] tracking-[-0.015em] md:text-[22px]">{post.title}</h3>
        {post.excerpt && <p className="line-clamp-2 text-[14.5px] leading-[1.6] text-[var(--v2-muted)]">{post.excerpt}</p>}
        <span className="mt-auto inline-flex items-center gap-1.5 pt-2 text-[14px] font-medium">
          {leer}
          <ArrowRight size={14} className="text-[var(--v2-accent)] transition-transform duration-300 group-hover:translate-x-1" />
        </span>
      </div>
    </Link>
  );
}

/**
 * El listado del blog: filtros por etiqueta, el último artículo destacado en
 * grande y el resto en una rejilla de celdas con líneas. Con un filtro puesto
 * no hay destacado: todo va en la rejilla.
 */
export function ListaBlog({ posts }: { posts: PostTarjeta[] }) {
  const t = useTranslations("v2Blog");
  const [etiqueta, setEtiqueta] = useState<string | null>(null);

  // Las etiquetas por uso, las más repetidas primero (como mucho seis).
  const usos = new Map<string, number>();
  posts.forEach((p) => p.tags?.forEach((x) => usos.set(x, (usos.get(x) ?? 0) + 1)));
  const etiquetas = [...usos.entries()]
    .sort((a, b) => b[1] - a[1])
    .slice(0, 6)
    .map(([x]) => x);

  const visibles = etiqueta ? posts.filter((p) => p.tags?.includes(etiqueta)) : posts;
  const [destacado, ...resto] = etiqueta ? [undefined, ...visibles] : visibles;

  if (!posts.length) {
    return <p className="border-t border-[var(--v2-line)] px-6 py-24 text-center text-[15px] text-[var(--v2-muted)]">{t("vacioTodo")}</p>;
  }

  return (
    <div className="flex flex-col">
      {etiquetas.length > 1 && (
        <div role="tablist" className="flex flex-wrap justify-center gap-2 px-6 pb-10">
          {[null, ...etiquetas].map((x, i) => {
            const on = x === etiqueta;
            return (
              <button
                key={x ?? "todos"}
                type="button"
                role="tab"
                aria-selected={on}
                onPointerEnter={(e) => e.pointerType === "mouse" && sonarHover(i)}
                onClick={() => {
                  if (on) return;
                  sonarClic("select", i);
                  setEtiqueta(x);
                }}
                className={`inline-flex items-center gap-2 rounded-[6px] border px-3.5 py-2 text-[14px] font-medium transition-colors ${
                  on
                    ? "border-[var(--v2-text)] bg-[var(--v2-text)] text-[var(--v2-bg)]"
                    : "border-[var(--v2-line)] text-[var(--v2-muted)] hover:border-[var(--v2-line-strong)] hover:text-[var(--v2-text)]"
                }`}
              >
                {x ?? t("todos")}
                <span className={`font-mono text-[11px] ${on ? "opacity-70" : "opacity-60"}`}>
                  {x ? usos.get(x) : posts.length}
                </span>
              </button>
            );
          })}
        </div>
      )}

      {destacado && (
        <Link
          href={{ pathname: "/v2/blog/[slug]", params: { slug: destacado.slug } }}
          className="group grid grid-cols-1 border-t border-[var(--v2-line)] transition-colors hover:bg-[var(--v2-bg-2)] lg:grid-cols-12"
          onClick={() => sonarClic("select")}
          data-reveal
        >
          <div className="p-4 md:p-6 lg:col-span-7 lg:border-r lg:border-[var(--v2-line)] lg:p-8">
            <PortadaPost post={destacado} className="aspect-[16/10] rounded-[8px] border border-[var(--v2-line)]" />
          </div>
          <div className="flex flex-col gap-5 px-6 pb-8 md:px-10 lg:col-span-5 lg:justify-center lg:py-10">
            <div className="flex flex-wrap items-center gap-2">
              <span className="v2-tag">{t("destacado")}</span>
              <span className="v2-label">{destacado.fecha}</span>
            </div>
            <h2 className="text-[28px] font-medium leading-[1.12] tracking-[-0.025em] md:text-[38px]">{destacado.title}</h2>
            {destacado.excerpt && <p className="line-clamp-4 text-[16px] leading-[1.6] text-[var(--v2-muted)]">{destacado.excerpt}</p>}
            {destacado.tags && destacado.tags.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {destacado.tags.slice(0, 3).map((x) => (
                  <span key={x} className="rounded-[4px] bg-[var(--v2-hover)] px-2 py-0.5 text-[12px] text-[var(--v2-muted)]">
                    {x}
                  </span>
                ))}
              </div>
            )}
            <span className="v2-link mt-2 self-start">
              {t("leer")} <ArrowUpRight size={14} className="text-[var(--v2-accent)]" />
            </span>
          </div>
        </Link>
      )}

      {resto.length > 0 && (
        <div className="grid grid-cols-1 gap-px border-t border-[var(--v2-line)] bg-[var(--v2-line)] md:grid-cols-2 lg:grid-cols-3">
          {resto.map((p, i) => (
            <TarjetaPost key={p!.slug} post={p!} i={i} leer={t("leer")} />
          ))}
          {/* Celdas vacías para cerrar la última fila sin huecos grises. */}
          {Array.from({ length: (3 - (resto.length % 3)) % 3 }).map((_, i) => (
            <div key={`hueco-${i}`} aria-hidden className="hidden bg-[var(--v2-bg)] lg:block" />
          ))}
        </div>
      )}

      {etiqueta && visibles.length === 0 && (
        <p className="border-t border-[var(--v2-line)] px-6 py-16 text-center text-[15px] text-[var(--v2-muted)]">{t("vacio")}</p>
      )}
    </div>
  );
}
