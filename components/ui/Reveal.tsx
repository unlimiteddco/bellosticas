"use client";

import { motion, useReducedMotion } from "framer-motion";
import type { ReactNode } from "react";

type Props = {
  children: ReactNode;
  /** Delay before the reveal starts (seconds). */
  delay?: number;
  /** Vertical travel distance (px). */
  y?: number;
  className?: string;
  /** Animate as soon as mounted instead of on scroll-into-view. */
  immediate?: boolean;
};

/**
 * Reveal — lightweight fade-up wrapper. Drop it around any element (server or
 * client children welcome) to get a consistent entrance animation. Respects
 * reduce-motion (renders instantly).
 */
export function Reveal({
  children,
  delay = 0,
  y = 22,
  className,
  immediate = false,
}: Props) {
  const reduce = useReducedMotion();
  const hidden = { opacity: 0, y: reduce ? 0 : y };
  const shown = { opacity: 1, y: 0 };

  return (
    <motion.div
      className={className}
      initial={hidden}
      {...(immediate
        ? { animate: shown }
        : { whileInView: shown, viewport: { once: true, margin: "-60px" } })}
      transition={{
        duration: reduce ? 0 : 0.6,
        delay: reduce ? 0 : delay,
        ease: [0.22, 1, 0.36, 1],
      }}
    >
      {children}
    </motion.div>
  );
}
