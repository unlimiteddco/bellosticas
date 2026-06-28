"use client";

import { motion } from "framer-motion";
import { AsteriskIcon } from "@/components/ui/AsteriskIcon";
import { useReducedMotion } from "@/lib/hooks/useReducedMotion";

/**
 * Decorative brand panel for the studio hero — replaces the "foto pendiente"
 * placeholder. Purely graphic (no text, so nothing duplicates the hero copy and
 * it stays language-agnostic): deep brand gradient, a faded dot grid, the brand
 * asterisk turning slowly behind a soft accent glow, a hairline frame with
 * accent corner ticks, and grain. Reads as an intentional, designed object.
 */
export function StudioHeroVisual() {
  const reduced = useReducedMotion();

  return (
    <div
      className="relative overflow-hidden rounded-lg shadow-[0_30px_70px_-40px_rgba(29,29,27,0.5)]"
      style={{
        aspectRatio: "4 / 5",
        background: "linear-gradient(155deg, #2C2417 0%, #1D1D1B 55%, #14110D 100%)",
      }}
    >
      {/* Dot grid — faded toward the edges so it never reads as flat */}
      <div
        aria-hidden
        className="absolute inset-0"
        style={{
          backgroundImage:
            "radial-gradient(circle, rgba(255,255,255,0.10) 1px, transparent 1.4px)",
          backgroundSize: "22px 22px",
          maskImage: "radial-gradient(ellipse at 50% 46%, #000 30%, transparent 78%)",
          WebkitMaskImage: "radial-gradient(ellipse at 50% 46%, #000 30%, transparent 78%)",
        }}
      />

      {/* Soft accent glow behind the mark */}
      <div
        aria-hidden
        className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"
        style={{
          width: "74%",
          height: "74%",
          background: "radial-gradient(circle, rgba(194,38,58,0.22) 0%, transparent 64%)",
        }}
      />

      {/* Brand asterisk — turns slowly (calm, not gimmicky) */}
      <motion.div
        aria-hidden
        className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"
        style={{ width: "44%", height: "44%", color: "rgba(194,38,58,0.85)" }}
        animate={reduced ? undefined : { rotate: 360 }}
        transition={reduced ? undefined : { duration: 60, repeat: Infinity, ease: "linear" }}
      >
        <AsteriskIcon className="w-full h-full" />
      </motion.div>

      {/* Hairline frame (the "lines") */}
      <div
        aria-hidden
        className="absolute inset-3 rounded-md border"
        style={{ borderColor: "rgba(255,255,255,0.08)" }}
      />

      {/* Accent corner ticks (editorial craft) */}
      <span
        aria-hidden
        className="absolute top-3 left-3 w-3.5 h-3.5 border-t border-l rounded-tl-md"
        style={{ borderColor: "rgba(194,38,58,0.7)" }}
      />
      <span
        aria-hidden
        className="absolute bottom-3 right-3 w-3.5 h-3.5 border-b border-r rounded-br-md"
        style={{ borderColor: "rgba(194,38,58,0.7)" }}
      />

      {/* Brand grain */}
      <span
        aria-hidden
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage: "url(/images/grain.svg)",
          backgroundRepeat: "repeat",
          opacity: 0.12,
          mixBlendMode: "soft-light",
        }}
      />
    </div>
  );
}
