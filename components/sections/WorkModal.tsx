"use client";

import { motion } from "framer-motion";
import { X } from "lucide-react";
import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { useTranslations } from "next-intl";
import type { ResolvedProject } from "@/lib/cms/types";

type Props = {
  project: ResolvedProject;
  onClose: () => void;
};

export function WorkModal({ project, onClose }: Props) {
  const t = useTranslations("work");
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);

    // Lock body scroll
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    // Pause Lenis smooth scroll while modal is open
    const lenis = (window as unknown as { __lenis?: { stop: () => void; start: () => void } })
      .__lenis;
    lenis?.stop();

    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = prevOverflow;
      lenis?.start();
    };
  }, [onClose]);

  if (!mounted) return null;

  const gallery = project.gallery ?? [];
  const hasGallery = gallery.length > 0;

  const node = (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.25 }}
      className="fixed inset-0 z-[9999] flex items-center justify-center p-4 md:p-8 bg-[rgba(29,29,27,0.6)] backdrop-blur-md"
      onClick={onClose}
      onWheel={(e) => e.stopPropagation()}
      onTouchMove={(e) => e.stopPropagation()}
      role="dialog"
      aria-modal="true"
      aria-label={project.name}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        transition={{ duration: 0.35, ease: "easeOut" }}
        onClick={(e) => e.stopPropagation()}
        onWheel={(e) => e.stopPropagation()}
        className="relative w-full max-w-[1100px] max-h-[85vh] overflow-y-auto overscroll-contain rounded-3xl bg-[var(--color-bg)]"
      >
        <button
          type="button"
          onClick={onClose}
          aria-label={t("modal.close")}
          className="absolute top-4 right-4 z-10 w-10 h-10 rounded-full bg-[var(--color-text)] text-[var(--color-bg)] flex items-center justify-center hover:bg-[var(--color-accent)] transition-colors"
        >
          <X size={18} />
        </button>

        <div
          className="relative flex items-center justify-center px-12 py-10"
          style={{
            backgroundColor: project.color,
            height: "clamp(140px, 22vh, 220px)",
          }}
        >
          {project.logo ? (
            <img
              src={project.logo}
              alt={project.name}
              className="w-auto h-auto"
              // Per-project size control (logoScale field in the CMS). Base ~84px
              // tall, scaled by the project's logoScale (default 100%).
              style={{
                maxHeight: `${84 * ((project.logoScale ?? 100) / 100)}px`,
                maxWidth: `${360 * ((project.logoScale ?? 100) / 100)}px`,
              }}
            />
          ) : (
            <span className="font-display italic text-[48px] md:text-[64px] text-[var(--color-bg)]/85">
              {project.name}
            </span>
          )}
        </div>

        <div className="px-6 md:px-12 py-10 md:py-14 flex flex-col gap-10">
          <div className="flex flex-col gap-3">
            <span
              className="font-body uppercase text-[11px] text-[var(--color-text-muted)]"
              style={{ letterSpacing: "0.18em" }}
            >
              {project.category}
            </span>
            <h3 className="font-display text-[40px] md:text-[56px] leading-tight text-[var(--color-text)]">
              {project.name}
            </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 border-y border-[var(--color-border)] py-6">
            <div className="flex flex-col gap-1.5">
              <span
                className="font-body uppercase text-[10px] text-[var(--color-text-muted)]"
                style={{ letterSpacing: "0.18em" }}
              >
                {t("modal.client")}
              </span>
              <span className="font-body text-[15px] text-[var(--color-text)]">
                {project.client}
              </span>
            </div>
            <div className="flex flex-col gap-1.5">
              <span
                className="font-body uppercase text-[10px] text-[var(--color-text-muted)]"
                style={{ letterSpacing: "0.18em" }}
              >
                {t("modal.year")}
              </span>
              <span className="font-body text-[15px] text-[var(--color-text)]">
                {project.year}
              </span>
            </div>
            <div className="flex flex-col gap-1.5">
              <span
                className="font-body uppercase text-[10px] text-[var(--color-text-muted)]"
                style={{ letterSpacing: "0.18em" }}
              >
                {t("modal.stack")}
              </span>
              <span className="font-body text-[15px] text-[var(--color-text)]">
                {project.stack.join(" · ")}
              </span>
            </div>
          </div>

          <p className="font-body text-[16px] leading-[1.7] text-[var(--color-text)] max-w-[680px]">
            {project.description}
          </p>

          {project.cover ? (
            <div
              className="relative w-full rounded-2xl overflow-hidden"
              style={{ backgroundColor: project.color }}
            >
              <img
                src={project.cover}
                alt={`${project.name} cover`}
                className="w-full h-auto block"
              />
            </div>
          ) : !hasGallery ? (
            // Placeholders de color SOLO cuando no hay ni cover ni galería.
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div
                className="aspect-[4/3] rounded-2xl"
                style={{ backgroundColor: `${project.color}cc` }}
              />
              <div
                className="aspect-[4/3] rounded-2xl"
                style={{ backgroundColor: `${project.color}99` }}
              />
            </div>
          ) : null}

          {/* Optional 2-column gallery — extras shown below the cover. The
              last image spans both columns when the count is odd so the grid
              stays balanced. */}
          {hasGallery && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-5">
              {gallery.map((shot, i) => {
                const isLastOdd = gallery.length % 2 === 1 && i === gallery.length - 1;
                return (
                  <div
                    key={shot.src}
                    className={`relative rounded-2xl overflow-hidden ${
                      isLastOdd ? "md:col-span-2" : ""
                    }`}
                    style={{ backgroundColor: project.color }}
                  >
                    <img
                      src={shot.src}
                      alt={shot.alt ?? `${project.name} screenshot ${i + 1}`}
                      className="w-full h-auto block"
                      loading="lazy"
                    />
                  </div>
                );
              })}
            </div>
          )}

          {project.liveUrl && (
            <a
              href={project.liveUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="self-start inline-flex items-center gap-2 h-12 px-7 rounded-full bg-[var(--color-text)] text-white text-sm font-medium uppercase tracking-[0.05em] hover:bg-[var(--color-accent)] transition-colors"
            >
              {t("modal.viewLive")} →
            </a>
          )}
        </div>
      </motion.div>
    </motion.div>
  );

  return createPortal(node, document.body);
}
