"use client";

import { motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
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
  const hasLogo = Boolean(project.logo);
  const hasCover = Boolean(project.cover);
  const logoScale = project.logoScale ?? 100;
  // Base max-width of the logo within the card, scaled per-project.
  const logoMaxW = (featured ? 32 : 55) * (logoScale / 100);

  return (
    <motion.button
      type="button"
      onClick={onClick}
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.6, delay: index * 0.08, ease: "easeOut" }}
      whileHover={{ y: -4 }}
      className="group text-left flex flex-col gap-4 cursor-pointer w-full"
    >
      <div
        className={`relative ${
          featured ? "aspect-[21/9]" : "aspect-[16/10]"
        } rounded-2xl overflow-hidden flex items-center justify-center transition-shadow duration-500 group-hover:shadow-[0_30px_60px_-30px_rgba(29,29,27,0.3)]`}
        style={{ backgroundColor: project.color }}
      >
        {/* Featured badge */}
        {featured && featuredLabel && (
          <span
            className="absolute top-4 left-4 z-20 flex items-center gap-1.5 font-body uppercase text-[10px] text-[var(--color-bg)]"
            style={{ letterSpacing: "0.18em" }}
          >
            <span className="inline-block w-1.5 h-1.5 rounded-full bg-[var(--color-accent)]" />
            {featuredLabel}
          </span>
        )}

        {/* Cover (revealed on hover) — only when a cover exists */}
        {hasCover && (
          <>
            <img
              src={project.cover}
              alt={`${project.name} mockup`}
              className="absolute inset-0 w-full h-full object-cover opacity-0 group-hover:opacity-100 transition-opacity duration-[600ms] ease-out"
            />
            <div className="absolute inset-0 bg-[var(--color-text)]/0 group-hover:bg-[var(--color-text)]/10 transition-colors duration-[600ms] pointer-events-none" />
          </>
        )}

        {/* Logo (shown whenever there is one, with or without a cover) */}
        {hasLogo ? (
          <div
            className={`relative z-10 ${featured ? "px-12" : "px-8"} ${
              hasCover
                ? "transition-opacity duration-[600ms] ease-out group-hover:opacity-0"
                : ""
            }`}
            style={{ maxWidth: `${logoMaxW}%` }}
          >
            <img
              src={project.logo}
              alt={project.name}
              className="w-full h-auto"
            />
          </div>
        ) : (
          <span
            className={`font-display italic ${
              featured ? "text-[72px] md:text-[96px]" : "text-[40px]"
            } text-[var(--color-bg)]/80 transition-transform duration-500 group-hover:scale-[1.02]`}
          >
            {project.name}
          </span>
        )}

        {/* View case chip on hover */}
        {viewCaseLabel && (
          <span
            className="absolute bottom-4 right-4 z-20 flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[var(--color-bg)]/95 backdrop-blur-md font-body uppercase text-[10px] text-[var(--color-text)] opacity-0 group-hover:opacity-100 transition-opacity duration-300"
            style={{ letterSpacing: "0.12em" }}
          >
            {viewCaseLabel}
            <ArrowUpRight size={12} className="text-[var(--color-accent)]" />
          </span>
        )}
      </div>

      <div className="flex items-center justify-between gap-4">
        <span className="font-body text-[14px] text-[var(--color-text)] group-hover:text-[var(--color-accent)] transition-colors">
          {project.name}
        </span>
        <span
          className="font-body uppercase text-[11px] text-[var(--color-text-muted)] text-right truncate"
          style={{ letterSpacing: "0.18em" }}
        >
          {project.category} · {project.year}
        </span>
      </div>
    </motion.button>
  );
}
