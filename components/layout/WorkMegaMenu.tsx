"use client";

import { useRef, useState, useEffect } from "react";
import { createPortal } from "react-dom";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowUpRight, ArrowRight, Heart, LayoutGrid, Route } from "lucide-react";
import { useTranslations } from "next-intl";

const CLOSE_DELAY_MS = 160;

/** Lo justo de un proyecto para enseñarlo en el menú. Lo resuelve el layout en servidor. */
export type TrabajoMenu = {
  slug: string;
  name: string;
  category: string;
  color: string;
  cover?: string;
  logo?: string;
  comingSoon?: boolean;
};

/** Los proyectos de la columna «recientes», por slug y en este orden. */
const RECIENTES = ["noal-design", "fada", "voluntariado-aragon", "teleadhesivo"];

/** Proyectos cuyo hueco de «caso destacado» lleva un vídeo en vez de su portada. */
const VIDEO_DESTACADO: Record<string, string> = {
  flylead: "/videos/marca.mp4",
};

const PAGINAS = [
  { key: "work", href: "/work", Icono: LayoutGrid },
  { key: "process", href: "/proceso", Icono: Route },
  { key: "clients", href: "/love", Icono: Heart },
] as const;

/**
 * «Trabajos» en el menú, con su desplegable (solo escritorio).
 *
 * Tres columnas: las páginas (trabajos, proceso, clientes), los proyectos
 * recientes y el caso destacado. Misma mecánica que ServicesMegaMenu: se abre
 * al pasar o enfocar, se cierra al salir (con un margen), con Escape o al
 * hacer clic, y el panel se monta por portal fuera de la barra para que su
 * desenfoque de fondo no se rompa.
 */
export function WorkMegaMenu({
  panelHost,
  trabajos,
}: {
  panelHost?: React.RefObject<HTMLDivElement | null>;
  trabajos: TrabajoMenu[];
}) {
  const t = useTranslations("nav");
  const [open, setOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const closeTimer = useRef<number | null>(null);

  useEffect(() => setMounted(true), []);

  const enter = () => {
    if (closeTimer.current) window.clearTimeout(closeTimer.current);
    setOpen(true);
  };
  const leave = () => {
    if (closeTimer.current) window.clearTimeout(closeTimer.current);
    closeTimer.current = window.setTimeout(() => setOpen(false), CLOSE_DELAY_MS);
  };

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  // El destacado es el primero con imagen. Los recientes los elige Antonio a
  // mano (RECIENTES): no son los cuatro primeros del gestor, sino los casos que
  // quiere tener a un clic. Si alguno no llega, se completa con los siguientes.
  const visibles = trabajos.filter((p) => !p.comingSoon);
  const destacado = visibles.find((p) => p.cover) ?? visibles[0];
  const elegidos = RECIENTES.map((slug) => visibles.find((p) => p.slug === slug)).filter(
    (p): p is (typeof visibles)[number] => Boolean(p),
  );
  const recientes = [...elegidos, ...visibles.filter((p) => !elegidos.includes(p))].slice(0, 4);
  const etiqueta = "block font-body uppercase text-[10px] text-[var(--color-text-muted)] mb-4 pl-3";

  const panel = (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0, y: 10, scale: 0.99 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 8, scale: 0.99 }}
          transition={{ duration: 0.22, ease: [0.4, 0, 0.2, 1] }}
          onMouseEnter={enter}
          onMouseLeave={leave}
          className="absolute left-0 right-0 top-[calc(100%+12px)] hidden lg:block"
        >
          <div
            className="rounded-3xl overflow-hidden"
            style={{
              background: "rgba(253, 253, 251, 0.97)",
              backdropFilter: "blur(28px) saturate(160%)",
              WebkitBackdropFilter: "blur(28px) saturate(160%)",
              border: "1px solid rgba(229, 226, 220, 0.9)",
              boxShadow: "0 40px 90px -20px rgba(29, 29, 27, 0.35)",
            }}
          >
            <div className="grid grid-cols-12">
              {/* ── Las páginas ── */}
              <div className="col-span-4 p-6 lg:p-7">
                <span className={etiqueta} style={{ letterSpacing: "0.18em" }}>
                  {t("wm.pagesLabel")}
                </span>
                <div className="flex flex-col gap-1">
                  {PAGINAS.map(({ key, href, Icono }) => (
                    <Link
                      key={key}
                      href={href}
                      onClick={() => setOpen(false)}
                      className="group/item flex items-start gap-3.5 rounded-2xl p-3 hover:bg-[var(--color-surface-2)] transition-colors"
                    >
                      <Icono size={17} strokeWidth={1.6} className="mt-[2px] shrink-0 text-[var(--color-accent)]" />
                      <span className="flex flex-col gap-0.5 min-w-0">
                        <span className="flex items-center gap-1.5 font-body text-[14px] font-medium text-[var(--color-text)] group-hover/item:text-[var(--color-accent)] transition-colors">
                          {t(`wm.${key}.title`)}
                          <ArrowUpRight
                            size={13}
                            className="opacity-0 -translate-x-0.5 group-hover/item:opacity-100 group-hover/item:translate-x-0 transition-all text-[var(--color-accent)] shrink-0"
                          />
                        </span>
                        <span className="font-body text-[12.5px] leading-[1.45] text-[var(--color-text-muted)]">
                          {t(`wm.${key}.sub`)}
                        </span>
                      </span>
                    </Link>
                  ))}
                </div>
              </div>

              {/* ── Proyectos recientes ── */}
              <div className="col-span-4 border-l border-[var(--color-border)] p-6 lg:p-7">
                <span className={etiqueta} style={{ letterSpacing: "0.18em" }}>
                  {t("wm.recentLabel")}
                </span>
                <div className="flex flex-col gap-1">
                  {recientes.map((p) => (
                    <Link
                      key={p.slug}
                      href={`/work?caso=${p.slug}`}
                      onClick={() => setOpen(false)}
                      className="group/item flex items-center gap-3.5 rounded-2xl p-3 hover:bg-[var(--color-surface-2)] transition-colors"
                    >
                      {/* El color de marca del proyecto, como en su tarjeta. */}
                      <span
                        className="flex h-9 w-12 shrink-0 items-center justify-center rounded-lg overflow-hidden"
                        style={{ backgroundColor: p.color }}
                      >
                        {p.logo && <img src={p.logo} alt="" className="max-h-[14px] max-w-[34px] object-contain" />}
                      </span>
                      <span className="flex flex-col gap-0.5 min-w-0">
                        <span className="font-body text-[14px] font-medium text-[var(--color-text)] group-hover/item:text-[var(--color-accent)] transition-colors truncate">
                          {p.name}
                        </span>
                        <span className="font-body text-[12.5px] text-[var(--color-text-muted)] truncate">{p.category}</span>
                      </span>
                    </Link>
                  ))}
                </div>
              </div>

              {/* ── Caso destacado ── */}
              <div className="col-span-4 border-l border-[var(--color-border)] bg-[var(--color-surface-2)]/60 p-6 lg:p-7 flex flex-col">
                <span className={etiqueta.replace(" pl-3", "")} style={{ letterSpacing: "0.18em" }}>
                  {t("wm.featuredLabel")}
                </span>
                {destacado && (
                  <Link
                    href={`/work?caso=${destacado.slug}`}
                    onClick={() => setOpen(false)}
                    className="group/caso flex flex-1 flex-col gap-3"
                  >
                    <span
                      className="relative block flex-1 min-h-[150px] rounded-2xl overflow-hidden"
                      style={{ backgroundColor: destacado.color }}
                    >
                      {VIDEO_DESTACADO[destacado.slug] ? (
                        // Sin sonido y en bucle: solo se reproduce mientras el
                        // menú está abierto, porque el panel no existe cerrado.
                        <video
                          src={VIDEO_DESTACADO[destacado.slug]}
                          autoPlay
                          muted
                          loop
                          playsInline
                          className="absolute inset-0 h-full w-full object-cover"
                        />
                      ) : destacado.cover ? (
                        <img
                          src={destacado.cover}
                          alt=""
                          className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 group-hover/caso:scale-[1.04]"
                        />
                      ) : (
                        destacado.logo && (
                          <img src={destacado.logo} alt="" className="absolute inset-0 m-auto max-h-[28px] max-w-[45%] object-contain" />
                        )
                      )}
                    </span>
                    <span className="flex items-start justify-between gap-3">
                      <span className="flex flex-col gap-0.5 min-w-0">
                        <span className="font-body text-[14px] font-medium text-[var(--color-text)] group-hover/caso:text-[var(--color-accent)] transition-colors">
                          {destacado.name}
                        </span>
                        <span className="font-body text-[12.5px] text-[var(--color-text-muted)] truncate">{destacado.category}</span>
                      </span>
                      <ArrowUpRight size={15} className="mt-0.5 shrink-0 text-[var(--color-accent)]" />
                    </span>
                  </Link>
                )}
              </div>
            </div>

            <div className="flex items-center justify-end px-6 lg:px-7 py-3.5 border-t border-[var(--color-border)]">
              <Link
                href="/work"
                onClick={() => setOpen(false)}
                className="inline-flex items-center gap-1.5 font-body text-[12.5px] text-[var(--color-text)] hover:text-[var(--color-accent)] transition-colors shrink-0"
              >
                {t("wm.viewAll")}
                <ArrowRight size={13} />
              </Link>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );

  return (
    <span onMouseEnter={enter} onMouseLeave={leave} className="contents">
      <Link
        href="/work"
        onMouseEnter={enter}
        onMouseLeave={leave}
        onFocus={enter}
        onClick={() => setOpen(false)}
        aria-haspopup="true"
        aria-expanded={open}
        className={`group relative font-body text-[14px] transition-colors ${
          open ? "text-[var(--color-accent)]" : "text-[var(--color-text)] hover:text-[var(--color-accent)]"
        }`}
      >
        {t("work")}
        <span
          className={`absolute left-0 -bottom-1 h-px bg-[var(--color-accent)] transition-[width] duration-300 ${
            open ? "w-full" : "w-0 group-hover:w-full"
          }`}
        />
      </Link>
      {mounted && panelHost?.current ? createPortal(panel, panelHost.current) : panel}
    </span>
  );
}
