"use client";

import { motion } from "framer-motion";
import { useTranslations } from "next-intl";
import { BrandPattern } from "@/components/ui/BrandPattern";
import { AsteriskIcon } from "@/components/ui/AsteriskIcon";

const NS = "studioPage.quote";

export function StudioQuote() {
  const t = useTranslations(NS);

  return (
    <section className="relative overflow-hidden bg-[var(--color-text)] py-24 md:py-32 lg:py-36">
      <BrandPattern asBackground opacity={0.08} size="md" />
      {/* Center vignette keeps the copy readable over the pattern */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse 65% 65% at 50% 50%, rgba(29,29,27,0.6) 0%, rgba(29,29,27,0) 78%)",
        }}
      />

      {/* Soft corner asterisk, very subtle */}
      <motion.div
        initial={{ opacity: 0, rotate: 25 }}
        whileInView={{ opacity: 0.07, rotate: 10 }}
        viewport={{ once: true }}
        transition={{ duration: 1, delay: 0.15, ease: [0.34, 1.56, 0.64, 1] }}
        className="hidden md:block absolute bottom-12 right-12 w-36 h-36 text-[var(--color-accent)] pointer-events-none"
      >
        <AsteriskIcon className="w-full h-full" />
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.9, ease: "easeOut" }}
        className="relative z-10 max-w-[1000px] mx-auto px-6 lg:px-12 text-center flex flex-col items-center gap-8"
      >
        {/* Antonio — circular portrait, so it reads as a personal note */}
        <div className="relative">
          <span
            aria-hidden
            className="absolute -inset-4 rounded-full"
            style={{
              background:
                "radial-gradient(circle, rgba(194,38,58,0.45) 0%, rgba(194,38,58,0) 70%)",
            }}
          />
          <img
            src="/images/antonio-bellostas-hero-grain.jpg"
            alt="Antonio Bellostas"
            className="relative w-[88px] h-[88px] md:w-[104px] md:h-[104px] rounded-full object-cover ring-2 ring-[var(--color-accent)]/60"
            style={{
              objectPosition: "center 25%",
              boxShadow: "0 18px 40px -16px rgba(0,0,0,0.6)",
            }}
          />
        </div>

        {/* The quote */}
        <p
          className="font-display italic text-[#FFFFFF] leading-[1.06]"
          style={{
            fontSize: "clamp(36px, 6vw, 82px)",
            letterSpacing: "-0.01em",
          }}
        >
          <span className="text-[var(--color-accent)]">“</span>
          {t("text")}
          <span className="text-[var(--color-accent)]">”</span>
        </p>

        {/* Signature */}
        <div className="flex flex-col items-center gap-3 mt-1">
          <span className="w-9 h-px bg-[var(--color-accent)]/70" aria-hidden />
          <span className="font-body text-[15px] text-[#FFFFFF] font-medium">
            Antonio Bellostas
          </span>
          <span
            className="font-body uppercase text-[10px] text-[#FFFFFF]/55"
            style={{ letterSpacing: "0.22em" }}
          >
            {t("signature")}
          </span>
        </div>
      </motion.div>
    </section>
  );
}
