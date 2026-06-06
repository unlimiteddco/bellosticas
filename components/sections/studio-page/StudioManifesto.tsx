"use client";

import { motion } from "framer-motion";
import { useTranslations } from "next-intl";
import { MixedHeadline } from "@/components/ui/MixedHeadline";
import { BrandPattern } from "@/components/ui/BrandPattern";

const NS = "studioPage.manifesto";

export function StudioManifesto() {
  const t = useTranslations(NS);
  const body = t.raw("body") as string[];

  return (
    <section
      id="manifesto"
      className="relative overflow-hidden bg-[var(--color-text)] text-[var(--color-bg)] scroll-mt-24"
    >
      <BrandPattern asBackground opacity={0.06} size="md" />
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse at center, rgba(29,29,27,0) 0%, rgba(29,29,27,0.55) 90%)",
        }}
      />

      <div className="relative z-10 max-w-[1280px] mx-auto px-6 lg:px-12 py-20 md:py-32">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16">
          {/* Left — manifesto text */}
          <div className="lg:col-span-7 flex flex-col gap-6">
            <span
              className="font-body uppercase text-[11px] text-[#FFFFFF]/70"
              style={{ letterSpacing: "0.18em" }}
            >
              {t("label")}
            </span>
            <MixedHeadline
              dark
              className="text-[44px] md:text-[64px] lg:text-[72px]"
              parts={[
                { text: t("title_part1") },
                { text: t("title_emphasis"), accent: true },
                { text: t("title_part2") },
              ]}
            />

            <div className="flex flex-col gap-5 mt-4 max-w-[560px]">
              {body.map((p, i) => (
                <motion.p
                  key={i}
                  initial={{ opacity: 0, y: 18 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-80px" }}
                  transition={{ duration: 0.6, delay: 0.1 + i * 0.08 }}
                  className="font-body text-[16px] lg:text-[17px] leading-[1.7] text-[#FFFFFF]/80"
                >
                  {p}
                </motion.p>
              ))}
            </div>
          </div>

          {/* Right — pull quote */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8, ease: [0.4, 0, 0.2, 1] }}
            className="lg:col-span-5 relative flex items-center justify-center min-h-[280px]"
          >
            <span
              className="font-display italic font-semibold text-[var(--color-accent)] leading-[0.95] text-center lg:text-left"
              style={{
                fontSize: "clamp(72px, 9vw, 132px)",
                letterSpacing: "-0.02em",
              }}
            >
              {t("pullQuote")}
            </span>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
