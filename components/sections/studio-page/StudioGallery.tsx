"use client";

import { motion } from "framer-motion";
import { useTranslations } from "next-intl";
import { useEffect, useRef } from "react";
import { EditorialLabel } from "@/components/ui/EditorialLabel";
import { MixedHeadline } from "@/components/ui/MixedHeadline";

const NS = "studioPage.gallery";

/** Delay (ms) after the section enters view before the timelapse starts. The
 *  first frame (Antonio) shows as a poster until then. */
const PLAY_DELAY_MS = 1200;

/**
 * "El espacio" — instead of a grid of stock-ish photos, we feature the real
 * 9s timelapse of the studio sign going up. One honest asset > six placeholders.
 */
export function StudioGallery() {
  const t = useTranslations(NS);
  const videoRef = useRef<HTMLVideoElement | null>(null);

  // Start playback a beat after the section is visible (poster = first frame).
  useEffect(() => {
    const v = videoRef.current;
    if (!v) return;
    let timer: number | undefined;
    const io = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          timer = window.setTimeout(() => v.play().catch(() => {}), PLAY_DELAY_MS);
          io.disconnect();
        }
      },
      { threshold: 0.5 },
    );
    io.observe(v);
    return () => {
      io.disconnect();
      if (timer) window.clearTimeout(timer);
    };
  }, []);

  return (
    <section className="relative z-10 bg-[var(--color-surface-2)]">
      <div className="max-w-[1280px] mx-auto px-6 lg:px-12 py-20 md:py-28">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 items-center">
          {/* Left — heading */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.7, ease: "easeOut" }}
            className="lg:col-span-6 flex flex-col gap-6"
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
            <p className="font-body text-[16px] lg:text-[17px] leading-[1.55] text-[var(--color-text-muted)] max-w-[460px]">
              {t("sub")}
            </p>
            <span
              className="font-mono text-[11px] text-[var(--color-text-muted)] mt-1"
              style={{ letterSpacing: "0.08em" }}
            >
              // {t("videoCaption")}
            </span>
          </motion.div>

          {/* Right — sign-mounting timelapse */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.7, delay: 0.1, ease: "easeOut" }}
            className="lg:col-span-6 flex justify-center"
          >
            <div
              className="relative w-full max-w-[400px] aspect-[9/16] rounded-2xl overflow-hidden bg-[var(--color-text)]"
              style={{ boxShadow: "0 30px 70px -30px rgba(29,29,27,0.4)" }}
            >
              <video
                ref={videoRef}
                src="/studio/sign-timelapse.mp4"
                poster="/studio/sign-timelapse-poster.jpg"
                muted
                loop
                playsInline
                preload="auto"
                className="absolute inset-0 w-full h-full object-cover"
              />
              {/* Subtle bottom gradient + caption */}
              <div
                className="absolute inset-x-0 bottom-0 h-24 pointer-events-none"
                style={{
                  background:
                    "linear-gradient(to top, rgba(0,0,0,0.55), rgba(0,0,0,0))",
                }}
              />
              <span
                className="absolute bottom-4 left-4 font-mono uppercase text-[10px] text-[#FFFFFF]/90"
                style={{ letterSpacing: "0.16em" }}
              >
                // {t("videoBadge")}
              </span>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
