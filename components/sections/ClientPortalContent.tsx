"use client";

import { motion } from "framer-motion";
import { Check } from "lucide-react";
import { useTranslations } from "next-intl";
import { EditorialLabel } from "@/components/ui/EditorialLabel";
import { MixedHeadline } from "@/components/ui/MixedHeadline";

const bullets = ["b1", "b2", "b3", "b4"] as const;

export function ClientPortalContent() {
  const t = useTranslations("clientPortal");

  return (
    <div className="lg:col-span-5 flex flex-col gap-6">
      <EditorialLabel>{t("label")}</EditorialLabel>

      <MixedHeadline
        className="text-[40px] md:text-[56px]"
        parts={[
          { text: t("title_part1") },
          { text: t("title_emphasis"), accent: true },
          { text: t("title_part2") },
        ]}
      />
      <p className="font-body text-[16px] lg:text-[18px] leading-[1.5] text-[var(--color-text-muted)] max-w-[480px]">
        {t("sub")}
      </p>

      <ul className="flex flex-col gap-3 mt-4">
        {bullets.map((b, i) => (
          <motion.li
            key={b}
            initial={{ opacity: 0, x: -10 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.4, delay: 0.3 + i * 0.1 }}
            className="flex items-center gap-3 font-body text-[14px] text-[var(--color-text)]"
          >
            <span className="w-5 h-5 rounded-full bg-[var(--color-accent)]/15 flex items-center justify-center shrink-0">
              <Check size={12} className="text-[var(--color-accent)]" strokeWidth={2.5} />
            </span>
            {t(`bullets.${b}`)}
          </motion.li>
        ))}
      </ul>
    </div>
  );
}
