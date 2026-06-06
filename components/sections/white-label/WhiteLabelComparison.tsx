"use client";

import { motion } from "framer-motion";
import { Check, X } from "lucide-react";
import { useTranslations } from "next-intl";
import { EditorialLabel } from "@/components/ui/EditorialLabel";
import { MixedHeadline } from "@/components/ui/MixedHeadline";

const NS = "servicePages.whitelabel.comparison";

type Row = { label: string; a: string; b: string };

export function WhiteLabelComparison() {
  const t = useTranslations(NS);
  const rows = t.raw("rows") as Row[];

  return (
    <section className="relative z-10 max-w-[1280px] mx-auto px-6 lg:px-12 py-20 md:py-28">
      <div className="flex flex-col gap-6 mb-12 md:mb-16 max-w-[820px]">
        <EditorialLabel>{t("label")}</EditorialLabel>
        <MixedHeadline
          className="text-[36px] md:text-[52px] lg:text-[60px]"
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

      <motion.div
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-80px" }}
        transition={{ duration: 0.7, ease: "easeOut" }}
        className="rounded-2xl border border-[var(--color-border)] overflow-hidden"
      >
        {/* Header */}
        <div className="grid grid-cols-[1.4fr_1fr_1fr] bg-[var(--color-surface-2)]">
          <div className="px-5 md:px-7 py-5 font-body uppercase text-[10px] text-[var(--color-text-muted)]" style={{ letterSpacing: "0.18em" }}>
            &nbsp;
          </div>
          <div className="px-3 md:px-5 py-5 text-center border-l border-[var(--color-border)]">
            <span
              className="font-body uppercase text-[10px] text-[var(--color-text-muted)]"
              style={{ letterSpacing: "0.18em" }}
            >
              {t("colA")}
            </span>
          </div>
          <div
            className="px-3 md:px-5 py-5 text-center border-l"
            style={{
              borderColor: "rgba(194,38,58,0.4)",
              backgroundColor: "rgba(194,38,58,0.06)",
            }}
          >
            <span
              className="font-body uppercase text-[10px] font-semibold text-[var(--color-accent)] flex items-center justify-center gap-1.5"
              style={{ letterSpacing: "0.18em" }}
            >
              <span className="inline-block w-1.5 h-1.5 rounded-full bg-[var(--color-accent)]" />
              {t("colB")}
            </span>
          </div>
        </div>

        {/* Rows */}
        {rows.map((row, i) => (
          <motion.div
            key={row.label}
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true, margin: "-40px" }}
            transition={{ duration: 0.4, delay: i * 0.05 }}
            className="grid grid-cols-[1.4fr_1fr_1fr] border-t border-[var(--color-border)]"
          >
            <div className="px-5 md:px-7 py-5 flex items-center font-body text-[13px] md:text-[14px] text-[var(--color-text)] font-medium">
              {row.label}
            </div>
            <div className="px-3 md:px-5 py-5 flex items-center justify-center gap-2 border-l border-[var(--color-border)] text-center">
              <X
                size={14}
                className="shrink-0 text-[var(--color-text-muted)]/60"
                strokeWidth={2.5}
              />
              <span className="font-body text-[13px] md:text-[14px] text-[var(--color-text-muted)] leading-snug">
                {row.a}
              </span>
            </div>
            <div
              className="px-3 md:px-5 py-5 flex items-center justify-center gap-2 border-l text-center"
              style={{
                borderColor: "rgba(194,38,58,0.25)",
                backgroundColor: "rgba(194,38,58,0.03)",
              }}
            >
              <Check
                size={14}
                className="shrink-0 text-[var(--color-accent)]"
                strokeWidth={2.8}
              />
              <span className="font-body text-[13px] md:text-[14px] text-[var(--color-text)] leading-snug font-medium">
                {row.b}
              </span>
            </div>
          </motion.div>
        ))}
      </motion.div>
    </section>
  );
}
