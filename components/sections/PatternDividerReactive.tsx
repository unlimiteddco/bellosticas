"use client";

import {
  motion,
  useAnimationFrame,
  useMotionValue,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
  useVelocity,
  wrap,
} from "framer-motion";
import { useRef } from "react";
import { useTranslations } from "next-intl";
import { AsteriskIcon } from "@/components/ui/AsteriskIcon";

/**
 * Option C — Editorial marquee + scroll-velocity reactive.
 *
 * Same visual as Option B, but the marquee speed reacts to how fast the user
 * is scrolling. Scroll up → marquee slows or reverses direction. Scroll down
 * fast → it accelerates. When idle, it cruises at `baseVelocity`.
 *
 * Implementation:
 *   - `useScroll` + `useVelocity` give us the user's scroll speed per second
 *   - `useSpring` smooths it so spikes don't make the strip jitter
 *   - `useTransform` maps a [-1000, 1000] velocity window to a multiplier
 *   - On each animation frame we add `baseVelocity * dt + velocityFactor * dt`
 *     to a motion value, then wrap it modulo (the width of one row in %)
 *     so the loop is seamless.
 */

type Props = {
  height?: number;
  /** % per second the strip moves when scroll is idle. Default -3 (left). */
  baseVelocity?: number;
};

const TOKEN_WIDTH_PERCENT = 50; // each TokenRow takes 50% of the doubled container

export function PatternDividerReactive({
  height = 90,
  baseVelocity = -3,
}: Props) {
  const reduced = useReducedMotion();
  const t = useTranslations("marqueeDivider");
  const tokens = (t.raw("tokens") as string[]) ?? [];

  // Track scroll velocity and smooth it
  const { scrollY } = useScroll();
  const scrollVelocity = useVelocity(scrollY);
  const smoothVelocity = useSpring(scrollVelocity, {
    damping: 50,
    stiffness: 400,
  });
  // Map [-1000, 1000] px/s to [-3, 3] multiplier — scrolling fast boosts move 4x
  const velocityFactor = useTransform(smoothVelocity, [-1000, 1000], [-3, 3], {
    clamp: false,
  });

  // The percentage offset of the marquee row; wrapped so it loops cleanly
  const x = useMotionValue(0);
  const directionRef = useRef(1);

  useAnimationFrame((_t, delta) => {
    if (reduced) return;
    // Direction follows current velocity sign (or stays at base when idle)
    const v = velocityFactor.get();
    if (v < 0) directionRef.current = -1;
    else if (v > 0) directionRef.current = 1;

    // dt in seconds; baseVelocity is in %/s
    const dt = delta / 1000;
    let moveBy = baseVelocity * dt;
    // Velocity boost
    moveBy += directionRef.current * Math.abs(v) * dt;

    x.set(x.get() + moveBy);
  });

  // Wrap modulo TOKEN_WIDTH_PERCENT so x always stays in [-50, 0]
  const wrappedX = useTransform(x, (val) => `${wrap(-TOKEN_WIDTH_PERCENT, 0, val)}%`);

  if (reduced) {
    // Reduced motion: static row
    return (
      <div
        className="relative w-full overflow-hidden flex items-center justify-center"
        style={{ height, backgroundColor: "#1D1D1B" }}
      >
        <TokenRow tokens={tokens} />
      </div>
    );
  }

  return (
    <div
      className="relative w-full overflow-hidden"
      style={{ height, backgroundColor: "#1D1D1B" }}
      role="presentation"
    >
      <motion.div
        className="absolute inset-0 flex items-center"
        style={{ x: wrappedX, width: "max-content" }}
      >
        <TokenRow tokens={tokens} />
        <TokenRow tokens={tokens} aria-hidden />
      </motion.div>
    </div>
  );
}

function TokenRow({
  tokens,
  ...rest
}: { tokens: string[] } & React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div className="flex items-center shrink-0" {...rest}>
      {tokens.map((token, i) => (
        <span key={i} className="flex items-center">
          <AsteriskIcon className="w-6 h-6 mx-7 text-[var(--color-accent)] shrink-0" />
          <span
            className="font-body uppercase text-[13px] md:text-[14px] text-[var(--color-bg)] whitespace-nowrap"
            style={{ letterSpacing: "0.22em" }}
          >
            {token}
          </span>
        </span>
      ))}
      <AsteriskIcon className="w-6 h-6 mx-7 text-[var(--color-accent)] shrink-0" />
    </div>
  );
}
