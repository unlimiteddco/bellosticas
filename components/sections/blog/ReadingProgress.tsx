"use client";

import { motion, useScroll, useSpring } from "framer-motion";

/**
 * Thin reading-progress bar fixed at the very top of a blog post. Fills carmín
 * as the reader scrolls through the document — a small tech touch that also
 * makes scroll feedback explicit.
 */
export function ReadingProgress() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 120,
    damping: 30,
    restDelta: 0.001,
  });

  return (
    <motion.div
      aria-hidden
      style={{ scaleX }}
      className="fixed top-0 left-0 right-0 z-[60] h-[3px] origin-left bg-[var(--color-accent)]"
    />
  );
}
