"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { useTranslations } from "next-intl";
import { MixedHeadline } from "@/components/ui/MixedHeadline";
import { BrandPattern } from "@/components/ui/BrandPattern";
import { AsteriskIcon } from "@/components/ui/AsteriskIcon";

const NS = "lovePage.hero";

// Floating quote pills as background decoration — teasers of what's below.
const FLOATING_QUOTES = [
  {
    text: "Entiende nuestro producto.",
    pos: { top: "30%", left: "5%" },
    rotate: -6,
    delay: 1.0,
  },
  {
    text: "Entrega en plazo.",
    pos: { bottom: "22%", left: "10%" },
    rotate: 4,
    delay: 1.2,
  },
  {
    text: "Cero ruido.",
    pos: { top: "28%", right: "6%" },
    rotate: 5,
    delay: 1.4,
  },
  {
    text: "Profesional como pocos.",
    pos: { bottom: "20%", right: "8%" },
    rotate: -3,
    delay: 1.6,
  },
];

function GoogleG({ size = 22 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 48 48" aria-hidden>
      <path
        fill="#FFC107"
        d="M43.611 20.083H42V20H24v8h11.303c-1.649 4.657-6.08 8-11.303 8c-6.627 0-12-5.373-12-12s5.373-12 12-12c3.059 0 5.842 1.154 7.961 3.039l5.657-5.657C34.046 6.053 29.268 4 24 4C12.955 4 4 12.955 4 24s8.955 20 20 20s20-8.955 20-20c0-1.341-.138-2.65-.389-3.917z"
      />
      <path
        fill="#FF3D00"
        d="m6.306 14.691l6.571 4.819C14.655 15.108 18.961 12 24 12c3.059 0 5.842 1.154 7.961 3.039l5.657-5.657C34.046 6.053 29.268 4 24 4C16.318 4 9.656 8.337 6.306 14.691z"
      />
      <path
        fill="#4CAF50"
        d="M24 44c5.166 0 9.86-1.977 13.409-5.192l-6.19-5.238A11.91 11.91 0 0 1 24 36c-5.202 0-9.619-3.317-11.283-7.946l-6.522 5.025C9.505 39.556 16.227 44 24 44z"
      />
      <path
        fill="#1976D2"
        d="M43.611 20.083H42V20H24v8h11.303a12.04 12.04 0 0 1-4.087 5.571l.003-.002l6.19 5.238C36.971 39.205 44 34 44 24c0-1.341-.138-2.65-.389-3.917z"
      />
    </svg>
  );
}

function Star({ size = 14 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" aria-hidden>
      <path
        fill="#FBBC05"
        d="M12 17.27 18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"
      />
    </svg>
  );
}

export function LoveHero() {
  const t = useTranslations(NS);

  return (
    <section className="relative overflow-hidden bg-[var(--color-text)] text-[var(--color-bg)]">
      {/* Pattern bg */}
      <BrandPattern asBackground opacity={0.08} size="lg" />

      {/* Centered aura glow */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse 70% 80% at 50% 45%, rgba(194,38,58,0.22) 0%, rgba(194,38,58,0) 65%)",
        }}
      />

      {/* Top fade for navbar blend */}
      <div
        className="absolute inset-x-0 top-0 h-40 pointer-events-none"
        style={{
          background:
            "linear-gradient(to bottom, rgba(29,29,27,0.7), rgba(29,29,27,0))",
        }}
      />

      {/* Two corner asterisks — balance the centered composition */}
      <motion.div
        initial={{ opacity: 0, scale: 0.6, rotate: 25 }}
        animate={{ opacity: 0.08, scale: 1, rotate: 12 }}
        transition={{ duration: 1.2, delay: 0.5, ease: [0.34, 1.56, 0.64, 1] }}
        className="hidden lg:block absolute top-[110px] left-[40px] xl:left-[80px] w-[280px] h-[280px] text-[var(--color-accent)] pointer-events-none"
      >
        <AsteriskIcon className="w-full h-full" />
      </motion.div>
      <motion.div
        initial={{ opacity: 0, scale: 0.6, rotate: -25 }}
        animate={{ opacity: 0.08, scale: 1, rotate: -10 }}
        transition={{ duration: 1.2, delay: 0.65, ease: [0.34, 1.56, 0.64, 1] }}
        className="hidden lg:block absolute bottom-[60px] right-[40px] xl:right-[80px] w-[280px] h-[280px] text-[var(--color-accent)] pointer-events-none"
      >
        <AsteriskIcon className="w-full h-full" />
      </motion.div>

      {/* Floating quote pills — background teasers */}
      {FLOATING_QUOTES.map((q, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0, y: 10, rotate: q.rotate }}
          animate={{ opacity: 1, y: 0, rotate: q.rotate }}
          transition={{
            duration: 0.7,
            delay: q.delay,
            ease: [0.4, 0, 0.2, 1],
          }}
          className="hidden lg:flex absolute items-center px-4 py-2.5 rounded-full pointer-events-none"
          style={{
            ...q.pos,
            background: "rgba(255,255,255,0.04)",
            border: "1px solid rgba(255,255,255,0.1)",
            backdropFilter: "blur(8px)",
            WebkitBackdropFilter: "blur(8px)",
          }}
        >
          <span
            className="font-display italic text-[13px] md:text-[14px] text-[#FFFFFF]/55 whitespace-nowrap"
            style={{ letterSpacing: "-0.005em" }}
          >
            “{q.text}”
          </span>
        </motion.div>
      ))}

      <div className="relative z-10 max-w-[1280px] mx-auto px-6 lg:px-12 pt-[180px] pb-28 md:pb-36">
        <div className="flex flex-col items-center text-center gap-7 max-w-[960px] mx-auto">
          {/* Google rating badge — top of centered hero */}
          <motion.div
            initial={{ opacity: 0, y: -8, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.15, ease: [0.34, 1.56, 0.64, 1] }}
            className="inline-flex items-center gap-3 px-4 py-2 rounded-full"
            style={{
              background: "rgba(255,255,255,0.06)",
              border: "1px solid rgba(255,255,255,0.12)",
              backdropFilter: "blur(10px)",
              WebkitBackdropFilter: "blur(10px)",
            }}
          >
            <GoogleG size={20} />
            <span className="flex items-center gap-0.5">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star key={i} size={13} />
              ))}
            </span>
            <span className="font-body text-[13px] text-[#FFFFFF] leading-tight">
              {t("googleRating")}
              <Link
                href="https://www.google.com/search?q=bellostas+studio+huesca"
                target="_blank"
                rel="noopener noreferrer"
                className="ml-2 inline-flex items-center gap-1 text-[#FFFFFF]/75 underline underline-offset-[3px] decoration-[#FFFFFF]/30 hover:text-[var(--color-accent)] hover:decoration-[var(--color-accent)] transition-colors"
              >
                {t("googleCta")}
                <ArrowRight size={11} />
              </Link>
            </span>
          </motion.div>

          <motion.span
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.35 }}
            className="font-body uppercase text-[11px] text-[#FFFFFF]/70"
            style={{ letterSpacing: "0.18em" }}
          >
            {t("label")}
          </motion.span>

          <MixedHeadline
            dark
            className="text-[48px] md:text-[72px] lg:text-[96px]"
            parts={[
              { text: t("title_part1") },
              { text: t("title_emphasis"), accent: true },
              { text: t("title_part2") },
            ]}
          />

          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.7 }}
            className="font-body text-[17px] lg:text-[19px] leading-[1.55] text-[#FFFFFF]/75 max-w-[640px]"
          >
            {t("sub")}
          </motion.p>

          <motion.span
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.9 }}
            className="font-body uppercase text-[11px] text-[#FFFFFF]/55 mt-2"
            style={{ letterSpacing: "0.18em" }}
          >
            {t("meta")}
          </motion.span>
        </div>
      </div>
    </section>
  );
}
