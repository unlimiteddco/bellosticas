"use client";

import { motion } from "framer-motion";
import { useTranslations } from "next-intl";
import { EditorialLabel } from "@/components/ui/EditorialLabel";
import { MixedHeadline } from "@/components/ui/MixedHeadline";
import { PrimaryButton } from "@/components/ui/PrimaryButton";
import { GhostButton } from "@/components/ui/GhostButton";
import { ServiceHeroMockup } from "./ServiceHeroMockup";

type Props = {
  namespace: string; // e.g. "servicePages.web.hero"
  mockups?: { src: string; alt: string }[];
  techBadge?: { label: string; bg: string; color?: string };
};

export function ServiceHero({ namespace, mockups = [], techBadge }: Props) {
  const t = useTranslations(namespace);
  const hasMockup = mockups.length > 0;

  return (
    <section className="relative z-10 max-w-[1280px] mx-auto px-6 lg:px-12 pt-[160px] pb-12 md:pb-16">
      <div
        className={`grid grid-cols-1 ${
          hasMockup ? "lg:grid-cols-12" : ""
        } gap-10 lg:gap-12 items-center`}
      >
        {/* Text column */}
        <div
          className={`flex flex-col gap-6 ${
            hasMockup ? "lg:col-span-7" : "max-w-[920px]"
          }`}
        >
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <EditorialLabel>{t("label")}</EditorialLabel>
          </motion.div>

          <MixedHeadline
            className="text-[40px] md:text-[56px] lg:text-[64px]"
            parts={[
              { text: t("title_part1") },
              { text: t("title_emphasis"), accent: true },
              { text: t("title_part2") },
            ]}
          />

          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.5 }}
            className="font-body text-[16px] lg:text-[18px] leading-[1.55] text-[var(--color-text-muted)] max-w-[560px]"
          >
            {t("sub")}
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.7 }}
            className="flex flex-wrap items-center gap-3 mt-2"
          >
            <PrimaryButton href="/contact">{t("cta_primary")}</PrimaryButton>
            <GhostButton href="#cases">{t("cta_secondary")}</GhostButton>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.9 }}
            className="flex flex-wrap items-center gap-x-3 gap-y-1 mt-4 font-body uppercase text-[11px] text-[var(--color-text-muted)]"
            style={{ letterSpacing: "0.18em" }}
          >
            <span>{t("stats.lcp")}</span>
            <span aria-hidden>·</span>
            <span>{t("stats.lighthouse")}</span>
            <span aria-hidden>·</span>
            <span>{t("stats.uptime")}</span>
          </motion.div>
        </div>

        {/* Mockup column — hidden on mobile */}
        {hasMockup && (
          <div className="lg:col-span-5">
            <ServiceHeroMockup mockups={mockups} techBadge={techBadge} />
          </div>
        )}
      </div>
    </section>
  );
}
