"use client";

import { motion } from "framer-motion";
import { useTranslations } from "next-intl";
import { BrandPattern } from "@/components/ui/BrandPattern";
import { MixedHeadline } from "@/components/ui/MixedHeadline";
import { PrimaryButton } from "@/components/ui/PrimaryButton";
import { AsteriskIcon } from "@/components/ui/AsteriskIcon";
import { bookingQuarter } from "@/lib/booking";

const NS = "servicePages.whitelabel.cta";

export function WhiteLabelCTA() {
  const t = useTranslations(NS);

  return (
    <section className="relative overflow-hidden bg-[var(--color-text)] py-24 md:py-36 lg:py-40">
      {/* Pattern at low opacity */}
      <BrandPattern asBackground opacity={0.14} size="md" />

      {/* Aura glow */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse 70% 60% at 50% 50%, rgba(194,38,58,0.22) 0%, rgba(29,29,27,0) 70%)",
        }}
      />

      {/* Vignette for legibility */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse 60% 60% at 50% 55%, rgba(29,29,27,0.5) 0%, rgba(29,29,27,0) 75%)",
        }}
      />

      {/* Decorative asterisks corners */}
      <motion.div
        initial={{ opacity: 0, rotate: -25 }}
        whileInView={{ opacity: 0.12, rotate: -10 }}
        viewport={{ once: true }}
        transition={{ duration: 1, ease: [0.34, 1.56, 0.64, 1] }}
        className="hidden md:block absolute top-12 left-12 w-32 h-32 text-[var(--color-accent)] pointer-events-none"
      >
        <AsteriskIcon className="w-full h-full" />
      </motion.div>
      <motion.div
        initial={{ opacity: 0, rotate: 25 }}
        whileInView={{ opacity: 0.12, rotate: 10 }}
        viewport={{ once: true }}
        transition={{ duration: 1, delay: 0.15, ease: [0.34, 1.56, 0.64, 1] }}
        className="hidden md:block absolute bottom-12 right-12 w-40 h-40 text-[var(--color-accent)] pointer-events-none"
      >
        <AsteriskIcon className="w-full h-full" />
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="relative z-10 max-w-[1280px] mx-auto px-6 lg:px-12 text-center flex flex-col items-center gap-7 md:gap-8"
      >
        <span
          className="font-body uppercase text-[11px] text-[#FFFFFF]/80"
          style={{ letterSpacing: "0.18em" }}
        >
          {t("label")}
        </span>

        <MixedHeadline
          dark
          className="text-[44px] md:text-[72px] lg:text-[96px] max-w-[1000px]"
          parts={[
            { text: t("title_part1") },
            { text: t("title_emphasis"), accent: true },
            { text: t("title_part2") },
          ]}
        />

        <p className="font-body text-[16px] md:text-[18px] leading-[1.55] text-[#FFFFFF]/70 max-w-[520px]">
          {t("sub")}
        </p>

        <PrimaryButton href="/intro" variant="inverse">
          {t("button")}
        </PrimaryButton>

        <span
          className="font-body uppercase text-[11px] text-[#FFFFFF]/60 mt-2"
          style={{ letterSpacing: "0.18em" }}
        >
          {t("footnote", { q: bookingQuarter() })}
        </span>
      </motion.div>
    </section>
  );
}
