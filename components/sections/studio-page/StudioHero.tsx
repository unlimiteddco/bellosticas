"use client";

import { motion } from "framer-motion";
import { ArrowDown } from "lucide-react";
import { useTranslations } from "next-intl";
import { EditorialLabel } from "@/components/ui/EditorialLabel";
import { MixedHeadline } from "@/components/ui/MixedHeadline";
import { PrimaryButton } from "@/components/ui/PrimaryButton";
import { StudioHeroVisual } from "./StudioHeroVisual";

const NS = "studioPage.hero";

export function StudioHero() {
  const t = useTranslations(NS);

  return (
    <section className="relative z-10 max-w-[1280px] mx-auto px-6 lg:px-12 pt-[160px] pb-16 md:pb-24">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 items-center">
        <div className="lg:col-span-7 flex flex-col gap-6">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <EditorialLabel>{t("label")}</EditorialLabel>
          </motion.div>

          <MixedHeadline
            className="text-[44px] md:text-[64px] lg:text-[84px]"
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
            className="font-body text-[17px] lg:text-[19px] leading-[1.6] text-[var(--color-text-muted)] max-w-[640px]"
          >
            {t("sub")}
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.75 }}
            className="flex flex-wrap items-center gap-3 mt-2"
          >
            <PrimaryButton href="/intro">{t("cta_primary")}</PrimaryButton>
            <a
              href="#manifesto"
              className="inline-flex items-center gap-1.5 px-4 h-12 font-body text-[13px] uppercase text-[var(--color-text-muted)] hover:text-[var(--color-accent)] transition-colors"
              style={{ letterSpacing: "0.18em" }}
            >
              {t("cta_secondary")}
              <ArrowDown size={14} />
            </a>
          </motion.div>

          <motion.span
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.95 }}
            className="font-body uppercase text-[11px] text-[var(--color-text-muted)] mt-4"
            style={{ letterSpacing: "0.18em" }}
          >
            {t("meta")}
          </motion.span>
        </div>

        {/* Photo column */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4, ease: [0.4, 0, 0.2, 1] }}
          className="lg:col-span-5"
        >
          <div className="relative max-w-[420px] ml-auto">
            <StudioHeroVisual />
          </div>
        </motion.div>
      </div>
    </section>
  );
}
