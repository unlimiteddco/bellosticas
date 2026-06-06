"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { useState, useRef } from "react";
import { useTranslations } from "next-intl";
import { EditorialLabel } from "@/components/ui/EditorialLabel";
import { MixedHeadline } from "@/components/ui/MixedHeadline";
import { AsteriskIcon } from "@/components/ui/AsteriskIcon";
import { useReducedMotion } from "@/lib/hooks/useReducedMotion";

/**
 * A single diptych photo — forced to brand B&W + grain so even casual phone
 * shots read as intentional editorial. Falls back to a tasteful placeholder
 * panel if the image is missing (e.g. the working photo isn't uploaded yet).
 */
function StudioPhoto({
  src,
  alt,
  placeholderLabel,
}: {
  src: string;
  alt: string;
  placeholderLabel?: string;
}) {
  const [errored, setErrored] = useState(false);

  return (
    <div className="group relative aspect-[4/5] overflow-hidden bg-[var(--color-text)]">
      {!errored ? (
        <img
          src={src}
          alt={alt}
          onError={() => setErrored(true)}
          className="absolute inset-0 w-full h-full object-cover object-center transition-transform duration-[700ms] ease-out group-hover:scale-[1.04]"
          style={{ filter: "grayscale(1) contrast(1.04) brightness(0.98)" }}
        />
      ) : (
        // Placeholder until the working photo is dropped at the configured path
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-4">
          <AsteriskIcon className="w-14 h-14 text-[var(--color-accent)]/50" />
          {placeholderLabel && (
            <span
              className="font-mono uppercase text-[10px] text-[var(--color-bg)]/55"
              style={{ letterSpacing: "0.16em" }}
            >
              {placeholderLabel}
            </span>
          )}
        </div>
      )}

      {/* Per-photo grain overlay — unifies both shots with the brand texture */}
      <span
        aria-hidden
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage: "url(/images/grain.svg)",
          backgroundRepeat: "repeat",
          opacity: 0.1,
          mixBlendMode: "multiply",
        }}
      />
    </div>
  );
}

export function Studio() {
  const t = useTranslations("studio");
  const fuel = (t.raw("fuel") as string[]) ?? [];
  const reduced = useReducedMotion();
  const ref = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });
  const y = useTransform(scrollYProgress, [0, 1], [-10, 30]);

  return (
    <section className="relative z-10 max-w-[1280px] mx-auto px-6 lg:px-12 py-16 lg:py-24">
      <div className="grid grid-cols-1 md:grid-cols-12 gap-10 lg:gap-16 items-center">
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.7, ease: "easeOut" }}
          className="md:col-span-6 relative"
        >
          <motion.div style={{ y: reduced ? 0 : y }}>
            {/* Diptych — two equal photos with a hairline divider between */}
            <div className="relative grid grid-cols-2 rounded-lg overflow-hidden shadow-[0_24px_60px_-30px_rgba(29,29,27,0.3)]">
              <StudioPhoto
                src="/images/antonio-bellostas-hero-grain.jpg"
                alt="Antonio Bellostas"
              />
              <StudioPhoto
                src="/images/antonio-trabajando.jpg"
                alt="Antonio trabajando"
                placeholderLabel={t("imageCaption").replace(/^\/\/\s*/, "").split(" · ")[0]}
              />
              {/* Hairline divider with corner ticks */}
              <span
                aria-hidden
                className="absolute top-0 bottom-0 left-1/2 -translate-x-1/2 w-[3px] bg-[var(--color-bg)] z-10"
              >
                <span className="absolute top-0 left-1/2 -translate-x-1/2 w-px h-3 bg-[var(--color-accent)]" />
                <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-px h-3 bg-[var(--color-accent)]" />
              </span>
            </div>

            {/* Mono caption */}
            <span
              className="block mt-3 font-mono uppercase text-[10px] text-[var(--color-text-muted)]"
              style={{ letterSpacing: "0.16em" }}
            >
              {t("imageCaption")}
            </span>
          </motion.div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.7, delay: 0.15, ease: "easeOut" }}
          className="md:col-span-6 flex flex-col gap-6"
        >
          <EditorialLabel>{t("label")}</EditorialLabel>
          <MixedHeadline
            className="text-[40px] md:text-[56px]"
            parts={[
              { text: t("title_part1") },
              { text: t("title_emphasis"), accent: true },
              { text: t("title_part2") },
            ]}
          />
          <p className="font-body text-[16px] lg:text-[17px] leading-[1.6] text-[var(--color-text)] max-w-[540px]">
            {t("body")}
          </p>

          <div className="flex flex-col gap-3 mt-6">
            <EditorialLabel>{t("fuelLabel")}</EditorialLabel>
            <div className="flex flex-wrap gap-2">
              {fuel.map((tag) => (
                <span
                  key={tag}
                  className="inline-flex items-center px-3 py-1.5 rounded-full border border-[var(--color-border)] font-body text-[12px] text-[var(--color-text)]"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>

          <p
            className="font-display italic text-[16px] text-[var(--color-text-muted)] mt-6"
            style={{ letterSpacing: "0.02em" }}
          >
            {t("tagline")}
          </p>
        </motion.div>
      </div>
    </section>
  );
}
