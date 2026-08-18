"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { useTranslations } from "next-intl";
import { EditorialLabel } from "@/components/ui/EditorialLabel";
import { MixedHeadline } from "@/components/ui/MixedHeadline";
import { AsteriskIcon } from "@/components/ui/AsteriskIcon";
import { useReducedMotion } from "@/lib/hooks/useReducedMotion";

/**
 * Left-column brand panel — the real sign-mounting timelapse running behind the
 * studio tagline, dimmed by a black veil so the type stays legible while the
 * footage still reads through.
 *
 * Performance: the video (and its poster) are only mounted once the panel is
 * near the viewport, so the 2.7 MB clip never weighs on initial page load. On
 * mobile the panel is taller and the secondary mono labels are dropped to keep
 * it from feeling crowded. Reduced-motion users keep the still poster.
 */
function StudioPanel() {
  const t = useTranslations("studio");
  const reduced = useReducedMotion();
  const containerRef = useRef<HTMLDivElement | null>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [active, setActive] = useState(false);

  // Lazy-mount: don't fetch the poster/video until the panel is near view.
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const io = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setActive(true);
          io.disconnect();
        }
      },
      { rootMargin: "200px" },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  // Play once mounted and on screen — unless reduced motion is preferred.
  useEffect(() => {
    if (active && !reduced && videoRef.current) {
      videoRef.current.play().catch(() => {});
    }
  }, [active, reduced]);

  return (
    <div
      ref={containerRef}
      className="relative aspect-[4/5] md:aspect-[8/5] rounded-lg overflow-hidden bg-[var(--color-text)] flex flex-col justify-between p-6 md:p-7 lg:p-9 shadow-[0_24px_60px_-30px_rgba(29,29,27,0.3)]"
    >
      {/* Fondo — el estudio de verdad, trabajando (montaje diferido) */}
      {active && (
        <video
          ref={videoRef}
          src="/studio/oficina.mp4"
          poster="/studio/oficina-poster.jpg"
          muted
          loop
          playsInline
          preload={reduced ? "none" : "auto"}
          aria-hidden
          className="absolute inset-0 w-full h-full object-cover"
          style={{ objectPosition: "50% 35%" }}
        />
      )}

      {/* Black veil — darker behind the type (left), lighter on the right so the
          footage still breathes. */}
      <div
        aria-hidden
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "linear-gradient(100deg, rgba(0,0,0,0.66) 0%, rgba(0,0,0,0.42) 55%, rgba(0,0,0,0.26) 100%)",
        }}
      />

      {/* Top row — asterisk mark + tag (tag hidden on mobile to declutter) */}
      <div className="relative z-10 flex items-center justify-between">
        <AsteriskIcon className="w-6 h-6 md:w-7 md:h-7 text-[var(--color-accent)]" />
        <span
          className="hidden md:inline-block font-mono uppercase text-[10px] text-[var(--color-bg)]/70"
          style={{ letterSpacing: "0.16em" }}
        >
          {t("panelTag")}
        </span>
      </div>

      {/* Centerpiece — the tagline, big and editorial */}
      <div className="relative z-10">
        <span
          aria-hidden
          className="block w-10 h-px bg-[var(--color-accent)] mb-3 md:mb-4"
        />
        <p className="font-display italic text-[var(--color-bg)] text-[21px] md:text-[26px] lg:text-[32px] leading-[1.15] max-w-[18ch] drop-shadow-[0_2px_12px_rgba(0,0,0,0.4)]">
          {t("tagline").replace(/^\/\/\s*/, "")}
        </p>
      </div>

      {/* Bottom — signature + place/volume (volume hidden on mobile) */}
      <div className="relative z-10 flex items-end justify-between gap-4">
        <span className="font-display text-[var(--color-bg)] text-[16px] md:text-[17px] lg:text-[19px] tracking-tight drop-shadow-[0_2px_10px_rgba(0,0,0,0.4)]">
          Antonio Bellostas
        </span>
        <span
          className="hidden md:block font-mono uppercase text-[10px] text-[var(--color-bg)]/70 text-right"
          style={{ letterSpacing: "0.14em" }}
        >
          {t("panelMeta")}
        </span>
      </div>

      {/* Brand grain — unifies the panel with the rest of the site */}
      <span
        aria-hidden
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage: "url(/images/grain.svg)",
          backgroundRepeat: "repeat",
          opacity: 0.12,
          mixBlendMode: "soft-light",
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
            <StudioPanel />
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
        </motion.div>
      </div>
    </section>
  );
}
