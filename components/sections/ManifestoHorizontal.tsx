"use client";

import { ArrowLeft, ArrowRight } from "lucide-react";
import Link from "next/link";
import { useCallback, useRef, useState } from "react";
import { useTranslations } from "next-intl";
import { BrandPattern } from "@/components/ui/BrandPattern";

type Rule = {
  n: string;
  title: string;
  body: string[];
  punch: string | null;
};

const NS = "manifesto";

/**
 * Brand manifesto as a contained HORIZONTAL scroll — lives inside the studio
 * "cómo trabajo" section. Drag / arrows / scrollbar move through the rules.
 * Dark, editorial. Keeps the page from getting super tall.
 */
export function ManifestoHorizontal() {
  const t = useTranslations(NS);
  const rules = t.raw("rules") as Rule[];
  const scrollerRef = useRef<HTMLDivElement | null>(null);
  const [progress, setProgress] = useState(0);

  const onScroll = useCallback(() => {
    const el = scrollerRef.current;
    if (!el) return;
    const max = el.scrollWidth - el.clientWidth;
    setProgress(max > 0 ? el.scrollLeft / max : 0);
  }, []);

  const scrollByCard = useCallback((dir: 1 | -1) => {
    const el = scrollerRef.current;
    if (!el) return;
    const card = el.querySelector("[data-card]") as HTMLElement | null;
    const amount = card ? card.offsetWidth + 20 : el.clientWidth * 0.8;
    el.scrollBy({ left: dir * amount, behavior: "smooth" });
  }, []);

  return (
    <section id="manifesto" className="relative overflow-hidden bg-[var(--color-text)] text-[var(--color-bg)] py-20 md:py-28 scroll-mt-24">
      <BrandPattern asBackground opacity={0.05} size="md" />
      <div
        aria-hidden
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse at top right, rgba(194,38,58,0.12) 0%, rgba(29,29,27,0) 60%)",
        }}
      />

      <div className="relative z-10">
        {/* Heading */}
        <div className="max-w-[1280px] mx-auto px-6 lg:px-12">
          <div className="flex flex-col gap-5 max-w-[680px]">
            <span
              className="font-body uppercase text-[11px] text-[var(--color-bg)]/60"
              style={{ letterSpacing: "0.2em" }}
            >
              {t("label")}
            </span>
            <h2 className="font-body font-medium tracking-tight leading-[1.06] text-[34px] md:text-[48px] text-[var(--color-bg)] mt-1">
              {t("intro_title_part1")}
              <span className="font-display italic font-semibold text-[var(--color-accent)]">
                {t("intro_title_emphasis")}
              </span>
              {t("intro_title_part2")}
            </h2>
            <p className="font-body text-[15px] md:text-[16px] leading-[1.6] text-[var(--color-bg)]/65 max-w-[440px]">
              {t("intro_sub")}
            </p>
          </div>

          {/* Controls */}
          <div className="flex items-center gap-4 mt-10">
            <button
              type="button"
              onClick={() => scrollByCard(-1)}
              aria-label="Anterior"
              className="w-10 h-10 rounded-full border border-[var(--color-bg)]/25 flex items-center justify-center text-[var(--color-bg)] hover:bg-[var(--color-bg)] hover:text-[var(--color-text)] transition-colors"
            >
              <ArrowLeft size={16} />
            </button>
            <button
              type="button"
              onClick={() => scrollByCard(1)}
              aria-label="Siguiente"
              className="w-10 h-10 rounded-full border border-[var(--color-bg)]/25 flex items-center justify-center text-[var(--color-bg)] hover:bg-[var(--color-bg)] hover:text-[var(--color-text)] transition-colors"
            >
              <ArrowRight size={16} />
            </button>
            {/* Progress bar */}
            <div className="relative flex-1 max-w-[260px] h-px bg-[var(--color-bg)]/20">
              <div
                className="absolute left-0 top-0 h-px bg-[var(--color-accent)] transition-[width] duration-150"
                style={{ width: `${Math.max(8, progress * 100)}%` }}
              />
            </div>
            <span
              className="font-mono text-[10px] text-[var(--color-bg)]/45 uppercase hidden sm:inline"
              style={{ letterSpacing: "0.14em" }}
            >
              arrastra →
            </span>
          </div>
        </div>

        {/* Horizontal scroller — constrained to the same centred container as
            the heading so the first card lines up (doesn't hug the viewport). */}
        <div className="max-w-[1280px] mx-auto px-6 lg:px-12 mt-8">
        <div
          ref={scrollerRef}
          onScroll={onScroll}
          className="flex gap-5 overflow-x-auto snap-x snap-mandatory scroll-smooth pb-4 [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden"
        >
          {rules.map((rule, i) => (
            <article
              key={rule.n}
              data-card
              className="snap-start shrink-0 w-[300px] sm:w-[360px] min-h-[420px] flex flex-col gap-5 rounded-2xl p-7 md:p-8"
              style={{
                backgroundColor: "rgba(255,255,255,0.04)",
                border: "1px solid rgba(255,255,255,0.12)",
              }}
            >
              <div className="flex flex-col">
                <span className="font-display italic text-[var(--color-accent)] text-[40px] leading-none">
                  {rule.n}.
                </span>
                <h3 className="font-display italic text-[var(--color-accent)] text-[26px] md:text-[30px] leading-tight mt-1">
                  {rule.title}
                </h3>
              </div>

              <div className="flex flex-col gap-3">
                {rule.body.map((line, j) => (
                  <p
                    key={j}
                    className="font-body text-[15px] md:text-[16px] leading-[1.5] text-[var(--color-bg)]/90"
                  >
                    {line}
                  </p>
                ))}
              </div>

              {rule.punch && (
                <p className="font-display italic text-[18px] md:text-[20px] leading-[1.3] text-[var(--color-accent)] mt-auto">
                  {rule.punch}
                </p>
              )}

              {/* CTA on the last card */}
              {i === rules.length - 1 && (
                <Link
                  href="/contact"
                  className="group mt-auto inline-flex items-center gap-2 h-11 px-5 rounded-full bg-[#FDFDFB] text-[#1D1D1B] font-body text-[12px] font-medium uppercase tracking-[0.05em] hover:bg-[var(--color-accent)] hover:text-[#FDFDFB] transition-colors w-fit"
                >
                  {t("cta")}
                  <ArrowRight
                    size={14}
                    className="transition-transform group-hover:translate-x-0.5"
                  />
                </Link>
              )}
            </article>
          ))}

          {/* Trailing spacer so the last card can snap fully into view */}
          <div className="shrink-0 w-1" aria-hidden />
        </div>
        </div>
      </div>
    </section>
  );
}
