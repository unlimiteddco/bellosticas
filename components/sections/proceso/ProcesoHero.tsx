"use client";

import { motion } from "framer-motion";
import { useTranslations } from "next-intl";
import { EditorialLabel } from "@/components/ui/EditorialLabel";
import { MixedHeadline } from "@/components/ui/MixedHeadline";

export function ProcesoHero() {
  const t = useTranslations("proceso.hero");
  return (
    <section className="relative z-10 max-w-[1280px] mx-auto px-6 lg:px-12 pt-[150px] pb-16 md:pb-20">
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="flex flex-col gap-6 max-w-[900px]"
      >
        <EditorialLabel>{t("label")}</EditorialLabel>
        <MixedHeadline
          className="text-[44px] md:text-[68px] lg:text-[80px]"
          parts={[
            { text: t("title_part1") },
            { text: t("title_emphasis"), accent: true },
            { text: t("title_part2") },
          ]}
        />
        <p className="font-body text-[17px] lg:text-[19px] leading-[1.6] text-[var(--color-text-muted)] max-w-[620px]">
          {t("sub")}
        </p>
      </motion.div>
    </section>
  );
}
