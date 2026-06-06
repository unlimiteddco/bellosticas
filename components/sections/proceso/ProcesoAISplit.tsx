"use client";

import { motion } from "framer-motion";
import { Sparkles, Check } from "lucide-react";
import { useTranslations } from "next-intl";
import { MixedHeadline } from "@/components/ui/MixedHeadline";

export function ProcesoAISplit() {
  const t = useTranslations("proceso.ai");
  const accelerates = t.raw("accelerates") as string[];
  const human = t.raw("human") as string[];

  return (
    <section className="relative overflow-hidden bg-[var(--color-text)] text-[var(--color-bg)] py-20 md:py-28">
      <div
        aria-hidden
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse at top left, rgba(194,38,58,0.12) 0%, rgba(29,29,27,0) 55%)",
        }}
      />
      <div className="relative z-10 max-w-[1280px] mx-auto px-6 lg:px-12">
        <div className="flex flex-col gap-5 max-w-[760px] mb-14">
          <span
            className="font-body uppercase text-[11px] text-[var(--color-bg)]/55"
            style={{ letterSpacing: "0.2em" }}
          >
            {t("label")}
          </span>
          <MixedHeadline
            dark
            className="text-[36px] md:text-[52px]"
            parts={[
              { text: t("title_part1") },
              { text: t("title_emphasis"), accent: true },
              { text: t("title_part2") },
            ]}
          />
          <p className="font-body text-[16px] md:text-[17px] leading-[1.6] text-[var(--color-bg)]/65 max-w-[480px]">
            {t("sub")}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 lg:gap-6">
          {/* AI accelerates — muted, technical */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="rounded-2xl p-7 md:p-9"
            style={{
              backgroundColor: "rgba(255,255,255,0.03)",
              border: "1px dashed rgba(255,255,255,0.18)",
            }}
          >
            <div className="flex items-center gap-2.5 mb-6">
              <Sparkles size={16} className="text-[var(--color-bg)]/60" />
              <span
                className="font-mono uppercase text-[11px] text-[var(--color-bg)]/60"
                style={{ letterSpacing: "0.1em" }}
              >
                {t("accelerates_label")}
              </span>
            </div>
            <ul className="flex flex-col gap-3.5">
              {accelerates.map((item, i) => (
                <li
                  key={i}
                  className="flex items-start gap-3 font-body text-[15px] md:text-[16px] leading-[1.5] text-[var(--color-bg)]/75"
                >
                  <span className="mt-2 w-1 h-1 rounded-full bg-[var(--color-bg)]/40 shrink-0" />
                  {item}
                </li>
              ))}
            </ul>
          </motion.div>

          {/* Human — prominent, carmín */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.6, delay: 0.1, ease: "easeOut" }}
            className="rounded-2xl p-7 md:p-9"
            style={{
              backgroundColor: "rgba(194,38,58,0.08)",
              border: "1px solid rgba(194,38,58,0.45)",
            }}
          >
            <div className="flex items-center gap-2.5 mb-6">
              <span className="flex items-center justify-center w-5 h-5 rounded-full bg-[var(--color-accent)]">
                <Check size={12} className="text-[var(--color-bg)]" strokeWidth={3} />
              </span>
              <span
                className="font-mono uppercase text-[11px] text-[var(--color-accent)]"
                style={{ letterSpacing: "0.1em" }}
              >
                {t("human_label")}
              </span>
            </div>
            <ul className="flex flex-col gap-3.5">
              {human.map((item, i) => (
                <li
                  key={i}
                  className="flex items-start gap-3 font-body text-[15px] md:text-[16px] leading-[1.5] text-[var(--color-bg)]"
                >
                  <Check
                    size={15}
                    className="text-[var(--color-accent)] mt-1 shrink-0"
                    strokeWidth={2.5}
                  />
                  {item}
                </li>
              ))}
            </ul>
          </motion.div>
        </div>

        <p className="font-display italic text-[20px] md:text-[26px] leading-[1.35] text-[var(--color-accent)] max-w-[620px] mt-12">
          {t("punch")}
        </p>
      </div>
    </section>
  );
}
