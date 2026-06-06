"use client";

import { motion } from "framer-motion";
import { useTranslations } from "next-intl";
import { MixedHeadline } from "@/components/ui/MixedHeadline";
import { BrandPattern } from "@/components/ui/BrandPattern";

const NS = "servicePages.whitelabel.pillars";

type Pillar = {
  tag: string;
  metric: string;
  title: string;
  description: string;
};

export function WhiteLabelPillars() {
  const t = useTranslations(NS);
  const items = t.raw("items") as Pillar[];

  return (
    <section className="relative overflow-hidden bg-[var(--color-text)] text-[var(--color-bg)]">
      {/* Faint pattern in background */}
      <BrandPattern asBackground opacity={0.08} size="md" />
      {/* Subtle vignette */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse at center, rgba(29,29,27,0) 0%, rgba(29,29,27,0.55) 90%)",
        }}
      />

      <div className="relative z-10 max-w-[1280px] mx-auto px-6 lg:px-12 py-20 md:py-28">
        <div className="flex flex-col gap-6 mb-14 md:mb-20 max-w-[820px]">
          <span
            className="font-body uppercase text-[11px] text-[#FFFFFF]/70"
            style={{ letterSpacing: "0.18em" }}
          >
            {t("label")}
          </span>
          <MixedHeadline
            dark
            className="text-[40px] md:text-[56px] lg:text-[68px]"
            parts={[
              { text: t("title_part1") },
              { text: t("title_emphasis"), accent: true },
              { text: t("title_part2") },
            ]}
          />
          <p className="font-body text-[16px] lg:text-[18px] leading-[1.55] text-[#FFFFFF]/70 max-w-[540px]">
            {t("sub")}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 md:gap-6">
          {items.map((p, i) => (
            <motion.article
              key={p.tag}
              initial={{ opacity: 0, y: 28 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{
                duration: 0.6,
                delay: i * 0.1,
                ease: [0.4, 0, 0.2, 1],
              }}
              whileHover={{ y: -4 }}
              className="relative rounded-2xl p-7 md:p-8 flex flex-col gap-5 overflow-hidden transition-colors duration-300"
              style={{
                backgroundColor: "rgba(255,255,255,0.04)",
                border: "1px solid rgba(255,255,255,0.12)",
              }}
            >
              <span
                className="font-body uppercase text-[10px] text-[var(--color-accent)]"
                style={{ letterSpacing: "0.22em" }}
              >
                {p.tag}
              </span>

              <span className="font-display italic text-[64px] md:text-[88px] leading-none text-[var(--color-accent)]">
                {p.metric}
              </span>

              <div className="flex flex-col gap-3 mt-auto">
                <h3 className="font-body font-semibold text-[20px] md:text-[22px] leading-tight text-[#FFFFFF]">
                  {p.title}
                </h3>
                <p className="font-body text-[14px] leading-[1.6] text-[#FFFFFF]/65">
                  {p.description}
                </p>
              </div>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
}
