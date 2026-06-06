"use client";

import { useReducedMotion } from "framer-motion";
import { BrandPattern } from "@/components/ui/BrandPattern";

/**
 * Option A — Infinite asterisk marquee.
 *
 * Same visual language as `PatternDivider`, but the strip moves slowly to the
 * left in a seamless loop. Two pattern slabs sit side-by-side and we translate
 * the whole row by -50% (one slab's width) over the duration — when the loop
 * resets at -50%, the second slab has just taken the first slab's position,
 * so the seam is invisible.
 *
 * Respects `prefers-reduced-motion`: if the user opted in, we render the
 * static `PatternDivider` shape — no animation.
 */

type Props = {
  height?: number;
  size?: "xs" | "sm" | "md" | "lg";
  /** Seconds per full cycle. Lower = faster. Default 28. */
  duration?: number;
};

export function PatternDividerMarquee({
  height = 70,
  size = "sm",
  duration = 28,
}: Props) {
  const reduced = useReducedMotion();

  return (
    <div
      className="relative w-full overflow-hidden"
      style={{ height, backgroundColor: "#1D1D1B" }}
    >
      {reduced ? (
        <BrandPattern size={size} asBackground />
      ) : (
        <div
          className="absolute inset-0 flex"
          style={{
            width: "200%",
            animation: `bp-marquee ${duration}s linear infinite`,
          }}
        >
          <div className="relative w-1/2 h-full">
            <BrandPattern size={size} asBackground />
          </div>
          <div className="relative w-1/2 h-full" aria-hidden>
            <BrandPattern size={size} asBackground />
          </div>
        </div>
      )}

      <style jsx>{`
        @keyframes bp-marquee {
          0% {
            transform: translateX(0%);
          }
          100% {
            transform: translateX(-50%);
          }
        }
      `}</style>
    </div>
  );
}
