"use client";

import { motion } from "framer-motion";
import { useTranslations } from "next-intl";
import { BrandPattern } from "@/components/ui/BrandPattern";
import { MixedHeadline } from "@/components/ui/MixedHeadline";
import { PrimaryButton } from "@/components/ui/PrimaryButton";
import { AsteriskIcon } from "@/components/ui/AsteriskIcon";
import { bookingQuarter } from "@/lib/booking";

const NS = "lovePage.cta";

export function LoveCTA() {
  const t = useTranslations(NS);

  return (
    <section className="relative overflow-hidden bg-[var(--color-text)] py-24 md:py-32">
      <BrandPattern asBackground opacity={0.16} size="md" />

      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse 60% 60% at 50% 55%, rgba(29,29,27,0.55) 0%, rgba(29,29,27,0) 75%)",
        }}
      />

      <motion.div
        initial={{ opacity: 0, rotate: -25 }}
        whileInView={{ opacity: 0.1, rotate: -8 }}
        viewport={{ once: true }}
        transition={{ duration: 1, ease: [0.34, 1.56, 0.64, 1] }}
        className="hidden md:block absolute top-10 left-10 w-28 h-28 text-[var(--color-accent)] pointer-events-none"
      >
        <AsteriskIcon className="w-full h-full" />
      </motion.div>
      <motion.div
        initial={{ opacity: 0, rotate: 25 }}
        whileInView={{ opacity: 0.1, rotate: 8 }}
        viewport={{ once: true }}
        transition={{ duration: 1, delay: 0.15, ease: [0.34, 1.56, 0.64, 1] }}
        className="hidden md:block absolute bottom-10 right-10 w-32 h-32 text-[var(--color-accent)] pointer-events-none"
      >
        <AsteriskIcon className="w-full h-full" />
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="relative z-10 max-w-[1100px] mx-auto px-6 lg:px-12 text-center flex flex-col items-center gap-7"
      >
        <span
          className="font-body uppercase text-[11px] text-[#FFFFFF]/80"
          style={{ letterSpacing: "0.18em" }}
        >
          {t("label")}
        </span>

        <MixedHeadline
          dark
          className="text-[44px] md:text-[64px] lg:text-[80px]"
          parts={[
            { text: t("title_part1") },
            { text: t("title_emphasis"), accent: true },
            { text: t("title_part2") },
          ]}
        />

        <p className="font-body text-[16px] md:text-[17px] leading-[1.55] text-[#FFFFFF]/70 max-w-[480px]">
          {t("sub")}
        </p>

        <PrimaryButton href="/intro" variant="inverse">
          {t("button")}
        </PrimaryButton>

        <span
          className="font-body uppercase text-[11px] text-[#FFFFFF]/60 mt-1"
          style={{ letterSpacing: "0.18em" }}
        >
          {t("footnote", { q: bookingQuarter() })}
        </span>
      </motion.div>
    </section>
  );
}
