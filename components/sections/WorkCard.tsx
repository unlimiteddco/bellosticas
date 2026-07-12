"use client";

import { motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import { useTranslations } from "next-intl";
import type { ResolvedProject } from "@/lib/cms/types";

type Props = {
  project: ResolvedProject;
  onClick: () => void;
  index: number;
  /** When true, renders a wider banner-style card (for full-width featured row). */
  featured?: boolean;
  /** Optional "View case" caption shown as a chip on hover */
  viewCaseLabel?: string;
  featuredLabel?: string;
};

export function WorkCard({
  project,
  onClick,
  index,
  featured = false,
  viewCaseLabel,
  featuredLabel,
}: Props) {
  const t = useTranslations("workPage");
  const comingSoon = Boolean(project.comingSoon);
  const hasLogo = Boolean(project.logo);
  // Imagen del hover: la cover o, si el proyecto no tiene, la primera de la galería.
  const hoverImage = project.cover ?? project.gallery?.[0]?.src;
  const hasCover = Boolean(hoverImage) && !comingSoon;
  const logoScale = project.logoScale ?? 100;
  // Base max-width of the logo within the card, scaled per-project.
  const logoMaxW = (featured ? 32 : 55) * (logoScale / 100);

  const entry = {
    initial: { opacity: 0, y: 24 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true, margin: "-80px" },
    transition: { duration: 0.6, delay: index * 0.08, ease: "easeOut" },
  } as const;

  // ── Bloque visual (la "card" con color de marca) ──
  const visual = (
    <div
      className={`relative ${
        featured ? "aspect-[21/9]" : "aspect-[16/10]"
      } rounded-2xl overflow-hidden flex items-center justify-center transition-shadow duration-500 ${
        comingSoon ? "" : "group-hover:shadow-[0_30px_60px_-30px_rgba(29,29,27,0.3)]"
      }`}
      style={{ backgroundColor: project.color }}
    >
      {/* Featured badge (solo si no es próximamente) */}
      {featured && featuredLabel && !comingSoon && (
        <span
          className="absolute top-4 left-4 z-20 flex items-center gap-1.5 font-body uppercase text-[10px] text-[var(--color-bg)]"
          style={{ letterSpacing: "0.18em" }}
        >
          <span className="inline-block w-1.5 h-1.5 rounded-full bg-[var(--color-accent)]" />
          {featuredLabel}
        </span>
      )}

      {/* Cover (revealed on hover) — only when a cover exists and NOT coming soon */}
      {hasCover && (
        <>
          <img
            src={hoverImage}
            alt={`${project.name} mockup`}
            className="absolute inset-0 w-full h-full object-cover opacity-0 group-hover:opacity-100 transition-opacity duration-[600ms] ease-out"
          />
          <div className="absolute inset-0 bg-[var(--color-text)]/0 group-hover:bg-[var(--color-text)]/10 transition-colors duration-[600ms] pointer-events-none" />
        </>
      )}

      {/* Logo o nombre (atenuado cuando es próximamente, para que destaque la etiqueta) */}
      {hasLogo ? (
        <div
          className={`relative z-10 ${featured ? "px-12" : "px-8"} ${
            hasCover ? "transition-opacity duration-[600ms] ease-out group-hover:opacity-0" : ""
          } ${comingSoon ? "opacity-25" : ""}`}
          style={{ maxWidth: `${logoMaxW}%` }}
        >
          <img src={project.logo} alt={project.name} className="w-full h-auto" />
        </div>
      ) : (
        <span
          className={`font-display italic ${
            featured ? "text-[72px] md:text-[96px]" : "text-[40px]"
          } text-[var(--color-bg)]/80 transition-transform duration-500 ${
            comingSoon ? "opacity-25" : "group-hover:scale-[1.02]"
          }`}
        >
          {project.name}
        </span>
      )}

      {/* ── Tratamiento "Próximamente" ── */}
      {comingSoon && (
        <>
          {/* Velo suave para dar el aire de "aún no disponible" */}
          <div
            className="absolute inset-0 pointer-events-none"
            style={{ background: "rgba(0,0,0,0.28)" }}
          />
          {/* Shimmer: barrido de luz diagonal en bucle */}
          <motion.span
            aria-hidden
            className="absolute inset-0 pointer-events-none"
            style={{
              background:
                "linear-gradient(110deg, transparent 35%, rgba(255,255,255,0.18) 50%, transparent 65%)",
            }}
            initial={{ x: "-120%" }}
            animate={{ x: "120%" }}
            transition={{
              duration: 2.2,
              repeat: Infinity,
              ease: "easeInOut",
              repeatDelay: 1.4,
            }}
          />
          {/* Pastilla central */}
          <span
            className="relative z-20 inline-flex items-center gap-2.5 rounded-full bg-[var(--color-bg)]/95 backdrop-blur-md px-5 py-2.5 font-body uppercase text-[11px] font-medium text-[var(--color-text)] shadow-[0_8px_24px_-8px_rgba(0,0,0,0.4)]"
            style={{ letterSpacing: "0.16em" }}
          >
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full rounded-full bg-[var(--color-accent)] opacity-60 animate-ping" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-[var(--color-accent)]" />
            </span>
            {t("comingSoon")}
          </span>
        </>
      )}

      {/* View case chip on hover (solo si no es próximamente) */}
      {viewCaseLabel && !comingSoon && (
        <span
          className="absolute bottom-4 right-4 z-20 flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[var(--color-bg)]/95 backdrop-blur-md font-body uppercase text-[10px] text-[var(--color-text)] opacity-0 group-hover:opacity-100 transition-opacity duration-300"
          style={{ letterSpacing: "0.12em" }}
        >
          {viewCaseLabel}
          <ArrowUpRight size={12} className="text-[var(--color-accent)]" />
        </span>
      )}
    </div>
  );

  // ── Pie: nombre + categoría/año, o "Próximamente" en acento ──
  const meta = (
    <div className="flex items-center justify-between gap-4 mt-0.5">
      <span
        className={`font-body text-[17px] md:text-[18px] font-medium tracking-tight text-[var(--color-text)] shrink-0 ${
          comingSoon ? "" : "group-hover:text-[var(--color-accent)]"
        } transition-colors`}
      >
        {project.name}
      </span>
      <span
        className="font-body uppercase text-[12px] md:text-[12.5px] text-right truncate min-w-0"
        style={{ letterSpacing: "0.13em" }}
      >
        {comingSoon ? (
          <span className="text-[var(--color-accent)]">{t("comingSoon")}</span>
        ) : (
          <span className="text-[var(--color-text-muted)]">
            {project.category} · {project.year}
          </span>
        )}
      </span>
    </div>
  );

  // Próximamente → no abre modal, sin cursor pointer ni hover lift.
  if (comingSoon) {
    return (
      <motion.div
        {...entry}
        className="text-left flex flex-col gap-4 w-full cursor-default select-none"
        aria-label={`${project.name} — ${t("comingSoon")}`}
      >
        {visual}
        {meta}
      </motion.div>
    );
  }

  return (
    <motion.button
      type="button"
      onClick={onClick}
      {...entry}
      whileHover={{ y: -4 }}
      className="group text-left flex flex-col gap-4 cursor-pointer w-full"
    >
      {visual}
      {meta}
    </motion.button>
  );
}
