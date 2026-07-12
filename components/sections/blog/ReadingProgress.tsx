"use client";

import { useEffect } from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";

/**
 * Thin reading-progress bar fixed at the very top of a blog post. Fills carmín
 * as the reader scrolls through the article — a small tech touch that makes
 * scroll feedback explicit.
 *
 * The progress is bound to the END of the article (the element with `targetId`),
 * NOT the whole document: it reaches 100% when the bottom of the post content
 * meets the bottom of the viewport, so it completes right when the article ends
 * and does not keep crawling while the reader is on the FAQ / related posts.
 */
export function ReadingProgress({ targetId }: { targetId?: string }) {
  const progress = useMotionValue(0);
  const scaleX = useSpring(progress, {
    stiffness: 120,
    damping: 30,
    restDelta: 0.001,
  });

  useEffect(() => {
    const update = () => {
      const el = targetId ? document.getElementById(targetId) : null;
      const end = el
        ? el.offsetTop + el.offsetHeight
        : document.documentElement.scrollHeight;
      const denom = Math.max(1, end - window.innerHeight);
      const p = Math.min(1, Math.max(0, window.scrollY / denom));
      progress.set(p);
    };

    update();
    window.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    return () => {
      window.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
    };
  }, [targetId, progress]);

  return (
    <motion.div
      aria-hidden
      style={{ scaleX }}
      className="fixed top-0 left-0 right-0 z-[60] h-[3px] origin-left bg-[var(--color-accent)]"
    />
  );
}
