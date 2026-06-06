"use client";

import { motion } from "framer-motion";
import { useTranslations } from "next-intl";
import { EditorialLabel } from "@/components/ui/EditorialLabel";

const NS = "servicePages.whitelabel.stats";

type Stat = { value: string; label: string };

export function WhiteLabelStats() {
  const t = useTranslations(NS);
  const items = t.raw("items") as Stat[];

  return (
    <section className="relative z-10 bg-[var(--color-surface-2)] border-y border-[var(--color-border)]">
      <div className="max-w-[1280px] mx-auto px-6 lg:px-12 py-10 md:py-12">
        <EditorialLabel className="block mb-6">{t("label")}</EditorialLabel>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-4">
          {items.map((item, i) => (
            <motion.div
              key={item.label}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-30px" }}
              transition={{ duration: 0.5, delay: i * 0.08, ease: "easeOut" }}
              className="flex flex-col gap-1.5"
            >
              <span className="font-display text-[40px] md:text-[56px] leading-none text-[var(--color-text)] tabular-nums">
                {item.value}
              </span>
              <span
                className="font-body uppercase text-[11px] text-[var(--color-text-muted)]"
                style={{ letterSpacing: "0.18em" }}
              >
                {item.label}
              </span>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
