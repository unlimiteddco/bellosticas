"use client";

import { AnimatePresence, motion } from "framer-motion";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { ArrowUpRight } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import { BrandPattern } from "@/components/ui/BrandPattern";
import { EditorialLabel } from "@/components/ui/EditorialLabel";
import { MixedHeadline } from "@/components/ui/MixedHeadline";

/**
 * Editorial 404 — bilingual via next-intl when locale is valid.
 *
 * Visuals:
 *  - Subtle brand pattern background.
 *  - Big "404" in Crimson italic carmín, with a periodic RGB-split glitch
 *    (two offset copies of the digit animated every few seconds).
 *  - Terminal line that types out the requested pathname character by character.
 *  - MixedHeadline + body.
 *  - 4 numbered editorial tiles (Home / Work / Contact / Portal).
 *
 * The Footer is intentionally NOT mounted: the page sits between the navbar
 * (rendered by the locale layout) and a minimal in-page footnote.
 */

export default function NotFound() {
  const t = useTranslations("notFound");
  const locale = useLocale();
  const pathname = usePathname() || "/";

  // Trim the leading locale prefix so the "shown path" matches what the user typed.
  const displayPath = useMemo(() => {
    const trimmed = pathname.replace(new RegExp(`^/${locale}(?=/|$)`), "");
    return trimmed === "" ? "/" : trimmed;
  }, [pathname, locale]);

  // Typewriter: types the displayed path character by character.
  const [typed, setTyped] = useState("");
  useEffect(() => {
    setTyped("");
    let i = 0;
    const id = setInterval(() => {
      i += 1;
      setTyped(displayPath.slice(0, i));
      if (i >= displayPath.length) clearInterval(id);
    }, 55);
    return () => clearInterval(id);
  }, [displayPath]);

  // Periodic glitch trigger — the offset copies pulse for ~250 ms every 4 s.
  const [glitching, setGlitching] = useState(false);
  useEffect(() => {
    const trigger = () => {
      setGlitching(true);
      setTimeout(() => setGlitching(false), 260);
    };
    const id = setInterval(trigger, 4200);
    // Fire once on mount so the user sees it on first paint.
    const first = setTimeout(trigger, 900);
    return () => {
      clearInterval(id);
      clearTimeout(first);
    };
  }, []);

  const tiles = [
    {
      n: "01",
      titleKey: "home" as const,
      href: "/",
      external: false,
    },
    {
      n: "02",
      titleKey: "work" as const,
      href: "/work",
      external: false,
    },
    {
      n: "03",
      titleKey: "contact" as const,
      href: "/contact",
      external: false,
    },
    {
      n: "04",
      titleKey: "portal" as const,
      href: "https://portal.bellostas.studio",
      external: true,
    },
  ];

  return (
    <main className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden pt-[160px] pb-20 px-6">
      <BrandPattern asBackground opacity={0.08} size="md" />

      {/* Soft radial vignette */}
      <div
        aria-hidden
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(circle at 50% 40%, transparent 0%, rgba(29,29,27,0.06) 100%)",
        }}
      />

      <div className="relative z-10 w-full max-w-[920px] flex flex-col items-center text-center gap-9">
        <motion.div
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <EditorialLabel>{t("label")}</EditorialLabel>
        </motion.div>

        {/* Big 404 with periodic RGB-split glitch */}
        <div className="relative" aria-hidden>
          <motion.h1
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, ease: [0.4, 0, 0.2, 1] }}
            className="font-display italic text-[var(--color-text)] leading-none select-none"
            style={{
              fontSize: "clamp(140px, 22vw, 280px)",
              letterSpacing: "-0.02em",
            }}
          >
            404
          </motion.h1>

          {/* Glitch layers */}
          <AnimatePresence>
            {glitching && (
              <>
                <motion.span
                  key="g-cyan"
                  initial={{ opacity: 0, x: 0 }}
                  animate={{ opacity: 0.85, x: [-4, 3, -2, 0] }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.26, ease: "easeInOut" }}
                  className="absolute inset-0 font-display italic leading-none select-none pointer-events-none"
                  style={{
                    fontSize: "clamp(140px, 22vw, 280px)",
                    letterSpacing: "-0.02em",
                    color: "#5BB0C2",
                    mixBlendMode: "multiply",
                  }}
                >
                  404
                </motion.span>
                <motion.span
                  key="g-red"
                  initial={{ opacity: 0, x: 0 }}
                  animate={{ opacity: 0.85, x: [4, -3, 2, 0] }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.26, ease: "easeInOut" }}
                  className="absolute inset-0 font-display italic leading-none select-none pointer-events-none"
                  style={{
                    fontSize: "clamp(140px, 22vw, 280px)",
                    letterSpacing: "-0.02em",
                    color: "var(--color-accent)",
                    mixBlendMode: "multiply",
                  }}
                >
                  404
                </motion.span>
              </>
            )}
          </AnimatePresence>
        </div>

        {/* Terminal-style path */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="font-mono text-[12px] md:text-[13px] text-[var(--color-text-muted)] tracking-tight flex flex-wrap items-center justify-center gap-x-1.5 gap-y-1 max-w-full"
        >
          <span className="opacity-60">{t("command")}</span>
          <span className="text-[var(--color-text)]">
            &quot;{typed}
            <BlinkingCursor />&quot;
          </span>
          <span className="opacity-60">→</span>
          <span className="text-[var(--color-accent)]">{t("notInRegistry")}</span>
        </motion.div>

        {/* Headline */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.45 }}
          className="mt-2"
        >
          <MixedHeadline
            className="text-[32px] md:text-[44px] lg:text-[52px]"
            parts={[
              { text: t("title_part1") },
              { text: t("title_emphasis"), accent: true },
              { text: t("title_part2") },
            ]}
          />
        </motion.div>

        <motion.p
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.6 }}
          className="font-body text-[15px] md:text-[16px] leading-[1.65] text-[var(--color-text-muted)] max-w-[560px]"
        >
          {t("body")}
        </motion.p>

        {/* 4 editorial tiles */}
        <motion.ul
          initial="hidden"
          animate="visible"
          variants={{
            hidden: {},
            visible: { transition: { staggerChildren: 0.08, delayChildren: 0.75 } },
          }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 w-full mt-2"
        >
          {tiles.map((tile) => (
            <motion.li
              key={tile.titleKey}
              variants={{
                hidden: { opacity: 0, y: 14 },
                visible: { opacity: 1, y: 0, transition: { duration: 0.45 } },
              }}
            >
              <TileLink
                n={tile.n}
                href={tile.href}
                external={tile.external}
                title={t(`links.${tile.titleKey}`)}
                sub={t(`links.${tile.titleKey}Sub`)}
              />
            </motion.li>
          ))}
        </motion.ul>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 1.4 }}
          className="font-body uppercase text-[10px] text-[var(--color-text-muted)] mt-6"
          style={{ letterSpacing: "0.18em" }}
        >
          {t("footnote")}
        </motion.div>
      </div>
    </main>
  );
}

function BlinkingCursor() {
  return (
    <motion.span
      aria-hidden
      animate={{ opacity: [1, 1, 0, 0] }}
      transition={{ duration: 1, repeat: Infinity, ease: "linear", times: [0, 0.5, 0.5, 1] }}
      className="inline-block ml-px text-[var(--color-accent)]"
    >
      ▍
    </motion.span>
  );
}

function TileLink({
  n,
  href,
  external,
  title,
  sub,
}: {
  n: string;
  href: string;
  external: boolean;
  title: string;
  sub: string;
}) {
  const className =
    "group relative flex flex-col gap-2 px-4 py-4 rounded-xl border border-[var(--color-text)]/12 bg-[var(--color-bg)]/65 backdrop-blur-sm hover:border-[var(--color-accent)] hover:-translate-y-0.5 transition-all text-left";

  const content = (
    <>
      <div className="flex items-center justify-between">
        <span
          className="font-body uppercase text-[10px] text-[var(--color-text-muted)] tabular-nums"
          style={{ letterSpacing: "0.18em" }}
        >
          {n}
        </span>
        <ArrowUpRight
          size={14}
          className="text-[var(--color-text-muted)] group-hover:text-[var(--color-accent)] group-hover:-translate-y-0.5 group-hover:translate-x-0.5 transition-all"
        />
      </div>
      <span className="font-body text-[14px] font-medium text-[var(--color-text)] group-hover:text-[var(--color-accent)] transition-colors">
        {title}
      </span>
      <span
        className="font-body text-[11px] text-[var(--color-text-muted)] uppercase"
        style={{ letterSpacing: "0.1em" }}
      >
        {sub}
      </span>
    </>
  );

  if (external) {
    return (
      <a href={href} target="_blank" rel="noopener noreferrer" className={className}>
        {content}
      </a>
    );
  }
  return (
    <Link href={href} className={className}>
      {content}
    </Link>
  );
}
