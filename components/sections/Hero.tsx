"use client";

import { Fragment, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { useTranslations } from "next-intl";
import { gsap } from "gsap";
import { EditorialLabel } from "@/components/ui/EditorialLabel";
import { PrimaryButton } from "@/components/ui/PrimaryButton";
import { GhostButton } from "@/components/ui/GhostButton";
import { GoogleReviewBadge } from "@/components/ui/GoogleReviewBadge";
import { bookingQuarter } from "@/lib/booking";

import { HeroToolsBackdrop } from "./HeroToolsBackdrop";
import { useReducedMotion } from "@/lib/hooks/useReducedMotion";

function renderWords(
  text: string,
  opts?: { italic?: boolean; accent?: boolean; keyPrefix?: string },
) {
  const words = text.split(" ");
  return words.map((word, wi) => (
    <Fragment key={`${opts?.keyPrefix ?? "w"}-${wi}`}>
      <span
        className="inline-block whitespace-nowrap"
        style={{
          fontStyle: opts?.italic ? "italic" : undefined,
          color: opts?.accent ? "var(--color-accent)" : undefined,
        }}
      >
        {word.split("").map((ch, ci) => (
          <span
            key={`${opts?.keyPrefix ?? "w"}-${wi}-${ci}`}
            data-char
            className="inline-block"
          >
            {ch}
          </span>
        ))}
      </span>
      {wi < words.length - 1 ? " " : null}
    </Fragment>
  ));
}

export function Hero() {
  const t = useTranslations("hero");
  const reduced = useReducedMotion();

  const labelRef = useRef<HTMLDivElement>(null);
  const headlineRef = useRef<HTMLHeadingElement>(null);
  const subRef = useRef<HTMLParagraphElement>(null);
  const googleRef = useRef<HTMLDivElement>(null);
  const ctasRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (reduced) return;

    const ctx = gsap.context(() => {
      gsap.from(labelRef.current, {
        opacity: 0,
        y: 10,
        duration: 0.5,
        ease: "power2.out",
        delay: 0.35,
      });

      const chars = headlineRef.current?.querySelectorAll("[data-char]");
      if (chars && chars.length) {
        gsap.from(chars, {
          y: 40,
          opacity: 0,
          duration: 0.6,
          stagger: 0.012,
          ease: "power3.out",
          delay: 0.45,
        });
      }

      gsap.from(subRef.current, {
        opacity: 0,
        y: 20,
        duration: 0.55,
        delay: 0.6,
      });

      gsap.from(ctasRef.current?.children ?? [], {
        opacity: 0,
        y: 20,
        duration: 0.5,
        delay: 0.85,
        stagger: 0.08,
        clearProps: "opacity,transform",
      });
    });

    return () => ctx.revert();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [reduced]);

  const line1 = t("headline_line1");
  const line2pre = t("headline_line2_pre");
  const emphasis = t("headline_emphasis");
  const line2post = t("headline_line2_post");

  return (
    <section className="relative min-h-screen max-h-[900px] overflow-hidden">
      <HeroToolsBackdrop />

      {/* Cream veil — lifts the centred copy off the 3D globe while leaving it
          glowing toward the bottom. */}
      <div
        aria-hidden
        className="absolute inset-0 z-[1] pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse 52% 46% at 50% 42%, var(--color-bg) 0%, rgba(253,253,251,0.62) 36%, rgba(253,253,251,0) 70%)",
        }}
      />

      <div className="relative z-10 min-h-screen max-h-[900px] max-w-[1280px] mx-auto px-6 lg:px-12 pt-[120px] pb-[150px] flex flex-col items-center justify-center text-center">
        <div className="flex flex-col items-center gap-7 w-full">
          <div
            ref={labelRef}
            className="flex items-center justify-center gap-2"
          >
            <span className="booking-dot" aria-hidden />
            <EditorialLabel>{t("booking", { q: bookingQuarter() })}</EditorialLabel>
          </div>

          <h1
            ref={headlineRef}
            className="font-display text-[38px] sm:text-[52px] md:text-[64px] lg:text-[76px] leading-[1.04] md:leading-[1.0] lg:leading-[0.98] text-[var(--color-text)] tracking-tight max-w-[1120px] [text-wrap:balance]"
          >
            <span className="block">
              {renderWords(line1, { keyPrefix: "l1" })}
            </span>
            <span className="block">
              {renderWords(line2pre, { keyPrefix: "l2pre" })}{" "}
              {renderWords(emphasis, {
                italic: true,
                accent: true,
                keyPrefix: "emph",
              })}{" "}
              {renderWords(line2post, { keyPrefix: "l2post" })}
            </span>
          </h1>

          <p
            ref={subRef}
            className="font-body text-[16px] lg:text-[18px] leading-[1.5] text-[var(--color-text-muted)] max-w-[560px] mx-auto"
          >
            {t("sub")}
          </p>

          <motion.div
            ref={googleRef}
            initial={reduced ? false : { opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              duration: 0.5,
              delay: reduced ? 0 : 1.75,
              ease: [0.4, 0, 0.2, 1],
            }}
          >
            <GoogleReviewBadge
              text={t("googleRatingText")}
              ctaText={t("googleRatingCta")}
              href="https://www.google.com/search?q=bellostas+studio+huesca"
            />
          </motion.div>

          <div
            ref={ctasRef}
            className="flex flex-col w-full sm:w-auto sm:flex-row sm:flex-wrap items-stretch sm:items-center justify-center gap-3"
          >
            <PrimaryButton href="/contact" className="w-full sm:w-auto">
              {t("cta_primary")}
            </PrimaryButton>
            <GhostButton href="/work" className="w-full sm:w-auto">
              {t("cta_secondary")}
            </GhostButton>
          </div>
        </div>
      </div>
    </section>
  );
}
