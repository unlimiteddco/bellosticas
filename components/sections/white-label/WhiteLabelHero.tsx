"use client";

import { motion } from "framer-motion";
import { useState } from "react";
import { useTranslations } from "next-intl";
import { Play } from "lucide-react";
import { MixedHeadline } from "@/components/ui/MixedHeadline";
import { PrimaryButton } from "@/components/ui/PrimaryButton";
import { AsteriskIcon } from "@/components/ui/AsteriskIcon";
import { InitialsAvatar } from "@/components/ui/InitialsAvatar";
import {
  TestimonialLightbox,
  type LightboxVideo,
} from "@/components/sections/TestimonialLightbox";
import { TESTIMONIAL_MEDIA } from "@/lib/testimonial-media";
import { bookingQuarter } from "@/lib/booking";

const NS = "servicePages.whitelabel.hero";

export function WhiteLabelHero() {
  const t = useTranslations(NS);
  const [open, setOpen] = useState(false);

  const javierVideo: LightboxVideo = {
    videoSrc: TESTIMONIAL_MEDIA.javier.video,
    posterSrc: TESTIMONIAL_MEDIA.javier.poster,
    name: t("video_name"),
    role: "Director",
    company: "Social11",
    chapters: TESTIMONIAL_MEDIA.javier.chapters,
  };

  return (
    <section className="relative overflow-hidden bg-[var(--color-text)] text-[var(--color-bg)]">
      {/* Aura glow radial — premium feel */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse 80% 60% at 70% 40%, rgba(194,38,58,0.18) 0%, rgba(194,38,58,0) 60%)",
        }}
      />
      {/* Soft top fade so the navbar blends */}
      <div
        className="absolute inset-x-0 top-0 h-32 pointer-events-none"
        style={{
          background:
            "linear-gradient(to bottom, rgba(29,29,27,0.6), rgba(29,29,27,0))",
        }}
      />
      {/* Decorative asterisk — subtle, behind the video */}
      <motion.div
        initial={{ opacity: 0, scale: 0.7, rotate: -25 }}
        animate={{ opacity: 0.06, scale: 1, rotate: -10 }}
        transition={{ duration: 1, delay: 0.4, ease: [0.34, 1.56, 0.64, 1] }}
        className="hidden lg:block absolute top-[110px] right-[40px] w-[280px] h-[280px] text-[var(--color-accent)] pointer-events-none"
      >
        <AsteriskIcon className="w-full h-full" />
      </motion.div>

      <div className="relative z-10 max-w-[1280px] mx-auto px-6 lg:px-12 pt-[150px] lg:pt-[170px] pb-24 lg:pb-28">
        <div className="grid lg:grid-cols-12 gap-10 lg:gap-12 items-center">
          {/* Left — copy */}
          <div className="lg:col-span-7 flex flex-col gap-7">
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <span
                className="font-body uppercase text-[11px] text-[#FFFFFF]/70"
                style={{ letterSpacing: "0.18em" }}
              >
                {t("label")}
              </span>
            </motion.div>

            <MixedHeadline
              dark
              className="text-[40px] md:text-[58px] lg:text-[68px]"
              parts={[
                { text: t("title_part1") },
                { text: t("title_emphasis"), accent: true },
                { text: t("title_part2") },
              ]}
            />

            <motion.p
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.55 }}
              className="font-body text-[17px] lg:text-[19px] leading-[1.55] text-[#FFFFFF]/75 max-w-[560px]"
            >
              {t("sub")}
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.75 }}
              className="flex flex-wrap items-center gap-3 mt-2"
            >
              <PrimaryButton href="/intro" variant="inverse">
                {t("cta_primary")}
              </PrimaryButton>
              <GhostButtonDark href="#process">
                {t("cta_secondary")}
              </GhostButtonDark>
            </motion.div>

            <motion.span
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.95 }}
              className="font-body uppercase text-[11px] text-[#FFFFFF]/55 mt-3"
              style={{ letterSpacing: "0.18em" }}
            >
              {t("metaStrip", { q: bookingQuarter() })}
            </motion.span>
          </div>

          {/* Right — agency video testimonial */}
          <motion.div
            initial={{ opacity: 0, y: 28, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.7, delay: 0.5, ease: [0.22, 1, 0.36, 1] }}
            className="lg:col-span-5"
          >
            <button
              type="button"
              aria-label={t("video_watch")}
              onClick={() => setOpen(true)}
              className="group relative block w-full aspect-[4/5] overflow-hidden rounded-[20px] border border-white/12 bg-black cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-accent)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--color-text)]"
              style={{ boxShadow: "0 40px 80px -32px rgba(0,0,0,0.7)" }}
            >
              <img
                src={TESTIMONIAL_MEDIA.javier.poster}
                alt={t("video_name")}
                className="absolute inset-0 w-full h-full object-cover object-center transition-transform duration-[700ms] ease-out group-hover:scale-[1.04]"
              />

              {/* Top gradient + identity pill */}
              <div
                className="absolute inset-x-0 top-0 h-28 pointer-events-none"
                style={{
                  background:
                    "linear-gradient(to bottom, rgba(0,0,0,0.5), rgba(0,0,0,0))",
                }}
              />
              <div className="absolute top-3.5 left-3.5 right-3.5 flex items-center gap-2.5 rounded-full bg-[var(--color-bg)]/95 backdrop-blur-md p-1.5 pr-4">
                <InitialsAvatar name={t("video_name")} size={32} />
                <div className="flex flex-col leading-tight text-left min-w-0">
                  <span className="font-body text-[13px] font-semibold text-[var(--color-text)] truncate">
                    {t("video_name")}
                  </span>
                  <span className="font-body text-[11px] text-[var(--color-text-muted)] truncate">
                    {t("video_role")}
                  </span>
                </div>
              </div>

              {/* Center play */}
              <span className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 flex h-16 w-16 items-center justify-center rounded-full bg-[var(--color-bg)]/95 shadow-[0_8px_28px_-6px_rgba(0,0,0,0.6)] transition-transform duration-300 group-hover:scale-110">
                <Play
                  size={22}
                  className="ml-0.5 text-[var(--color-text)]"
                  fill="currentColor"
                />
              </span>

              {/* Bottom gradient + caption badge */}
              <div
                className="absolute inset-x-0 bottom-0 h-28 pointer-events-none"
                style={{
                  background:
                    "linear-gradient(to top, rgba(0,0,0,0.6), rgba(0,0,0,0))",
                }}
              />
              <span
                className="absolute bottom-3.5 left-3.5 inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[var(--color-accent)] font-body uppercase text-[10px] font-medium text-[var(--color-bg)]"
                style={{ letterSpacing: "0.12em" }}
              >
                <Play size={9} fill="currentColor" />
                {t("video_caption")}
              </span>
            </button>
          </motion.div>
        </div>
      </div>

      <TestimonialLightbox
        video={open ? javierVideo : null}
        onClose={() => setOpen(false)}
      />
    </section>
  );
}

/** Dark variant of GhostButton — transparent w/ cream border, hover cream bg + dark text */
function GhostButtonDark({
  href,
  children,
}: {
  href: string;
  children: React.ReactNode;
}) {
  return (
    <a
      href={href}
      className="group inline-flex items-center gap-2 h-12 px-7 rounded-full border text-sm font-medium uppercase tracking-[0.05em] transition-all duration-300 hover:scale-[1.02] active:scale-[0.98]"
      style={{
        borderColor: "rgba(255,255,255,0.4)",
        color: "#FFFFFF",
        backgroundColor: "transparent",
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.backgroundColor = "#FFFFFF";
        e.currentTarget.style.color = "var(--color-text)";
        e.currentTarget.style.borderColor = "#FFFFFF";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.backgroundColor = "transparent";
        e.currentTarget.style.color = "#FFFFFF";
        e.currentTarget.style.borderColor = "rgba(255,255,255,0.4)";
      }}
    >
      <span>{children}</span>
      <svg
        width="14"
        height="14"
        viewBox="0 0 14 14"
        fill="none"
        className="transition-transform duration-300 group-hover:translate-x-1"
        aria-hidden
      >
        <path
          d="M1 7H13M13 7L7 1M13 7L7 13"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </a>
  );
}
