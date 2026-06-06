"use client";

import { motion } from "framer-motion";
import { useTranslations } from "next-intl";
import { EditorialLabel } from "@/components/ui/EditorialLabel";
import { MixedHeadline } from "@/components/ui/MixedHeadline";

export function ProcesoStack() {
  const t = useTranslations("proceso.stack");
  const tools = t.raw("tools") as string[];

  return (
    <section className="relative z-10 bg-[var(--color-surface-2)]">
      <div className="max-w-[1280px] mx-auto px-6 lg:px-12 py-20 md:py-28">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 lg:items-center">
          <div className="lg:col-span-5 flex flex-col gap-6">
            <EditorialLabel>{t("label")}</EditorialLabel>
            <MixedHeadline
              className="text-[40px] md:text-[52px]"
              parts={[
                { text: t("title_part1") },
                { text: t("title_emphasis"), accent: true },
                { text: t("title_part2") },
              ]}
            />
            <p className="font-body text-[16px] lg:text-[17px] leading-[1.55] text-[var(--color-text-muted)] max-w-[420px]">
              {t("sub")}
            </p>
          </div>

          <div className="lg:col-span-7">
            <div className="flex flex-wrap gap-3">
              {tools.map((tool, i) => (
                <motion.span
                  key={tool}
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true, margin: "-40px" }}
                  transition={{ duration: 0.4, delay: i * 0.03, ease: "easeOut" }}
                  className="inline-flex items-center px-4 py-2.5 rounded-full border border-[var(--color-border)] bg-[var(--color-bg)] font-body text-[14px] text-[var(--color-text)]"
                >
                  {tool}
                </motion.span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
