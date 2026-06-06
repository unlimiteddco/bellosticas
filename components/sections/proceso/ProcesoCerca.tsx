"use client";

import { motion } from "framer-motion";
import { useTranslations } from "next-intl";
import { EditorialLabel } from "@/components/ui/EditorialLabel";
import { MixedHeadline } from "@/components/ui/MixedHeadline";

type Item = { n: string; title: string; body: string };

export function ProcesoCerca() {
  const t = useTranslations("proceso.cerca");
  const items = t.raw("items") as Item[];

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
        <p className="font-body text-[16px] lg:text-[17px] leading-[1.55] text-[var(--color-text-muted)] max-w-[540px]">
          {t("sub")}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 lg:gap-6">
        {items.map((item, i) => (
          <motion.article
            key={item.n}
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.55, delay: i * 0.05, ease: "easeOut" }}
            className="flex flex-col gap-3 rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] p-6 md:p-7 transition-shadow duration-300 hover:shadow-[0_12px_30px_-15px_rgba(29,29,27,0.18)]"
          >
            <span className="font-mono text-[12px] text-[var(--color-accent)] tabular-nums" style={{ letterSpacing: "0.08em" }}>
              {item.n}
            </span>
            <h3 className="font-body font-semibold text-[17px] text-[var(--color-text)]">
              {item.title}
            </h3>
            <p className="font-body text-[14px] leading-[1.6] text-[var(--color-text-muted)]">
              {item.body}
            </p>
          </motion.article>
        ))}
      </div>
    </section>
  );
}
