"use client";

import { motion } from "framer-motion";
import { useTranslations } from "next-intl";
import { EditorialLabel } from "@/components/ui/EditorialLabel";
import { MixedHeadline } from "@/components/ui/MixedHeadline";

type Column = { title: string; items: string[] };

const NS = "studioPage.fuel";

export function StudioFuel() {
  const t = useTranslations(NS);
  const columns = t.raw("columns") as Column[];

  return (
    <section className="relative z-10 max-w-[1280px] mx-auto px-6 lg:px-12 py-20 md:py-28">
      <div className="flex flex-col gap-6 mb-14 md:mb-16 max-w-[820px]">
        <EditorialLabel>{t("label")}</EditorialLabel>
        <MixedHeadline
          className="text-[40px] md:text-[56px]"
          parts={[
            { text: t("title_part1") },
            { text: t("title_emphasis"), accent: true },
            { text: t("title_part2") },
          ]}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 md:gap-10 border-t border-[var(--color-border)] pt-10">
        {columns.map((col, i) => (
          <motion.div
            key={col.title}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.5, delay: i * 0.08, ease: "easeOut" }}
            className="flex flex-col gap-5"
          >
            <span
              className="font-body uppercase text-[11px] text-[var(--color-text-muted)] pb-2 border-b border-[var(--color-border)]"
              style={{ letterSpacing: "0.18em" }}
            >
              {col.title}
            </span>
            <ul className="flex flex-col gap-2.5">
              {col.items.map((item, idx) => (
                <li
                  key={idx}
                  className="font-body text-[14px] leading-snug text-[var(--color-text)]/90"
                >
                  {item}
                </li>
              ))}
            </ul>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
