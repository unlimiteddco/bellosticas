"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useReducedMotion } from "framer-motion";

type Props = { isHovered: boolean };

export function MockupDay1({ isHovered }: Props) {
  const reduced = useReducedMotion();
  const animateAvatar = isHovered && !reduced;

  return (
    <div className="absolute inset-0 flex items-center justify-center gap-6 p-8">
      <motion.div
        animate={animateAvatar ? { scale: [1, 1.05, 1] } : { scale: 1 }}
        transition={{
          duration: 0.9,
          repeat: animateAvatar ? Infinity : 0,
          ease: "easeInOut",
        }}
        className="flex flex-col items-center gap-2"
      >
        <div className="w-20 h-20 rounded-full bg-[var(--color-text)]/10 flex items-center justify-center">
          <div className="w-12 h-12 rounded-full bg-[var(--color-text)]/30" />
        </div>
        <span
          className="text-[10px] uppercase text-[var(--color-text-muted)]"
          style={{ letterSpacing: "0.18em" }}
        >
          You
        </span>
      </motion.div>

      <div className="font-display text-[32px] text-[var(--color-text-muted)] w-8 text-center">
        <AnimatePresence mode="wait" initial={false}>
          {animateAvatar ? (
            <motion.span
              key="bidir"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="block"
            >
              ↔
            </motion.span>
          ) : (
            <motion.span
              key="unidir"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="block"
            >
              →
            </motion.span>
          )}
        </AnimatePresence>
      </div>

      <motion.div
        animate={animateAvatar ? { scale: [1, 1.05, 1] } : { scale: 1 }}
        transition={{
          duration: 0.9,
          repeat: animateAvatar ? Infinity : 0,
          ease: "easeInOut",
          delay: 0.18,
        }}
        className="flex flex-col items-center gap-2"
      >
        <div className="relative">
          <div className="w-20 h-20 rounded-full bg-[var(--color-accent)]/15 flex items-center justify-center">
            <div className="w-12 h-12 rounded-full bg-[var(--color-accent)]/40" />
          </div>
          <AnimatePresence>
            {animateAvatar && (
              <motion.span
                key="online"
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0 }}
                transition={{ duration: 0.25 }}
                className="absolute top-1 right-1 w-3 h-3 rounded-full bg-green-500 ring-2 ring-[var(--color-surface-2)]"
                style={{ animation: "booking-pulse 1.6s ease-in-out infinite" }}
                aria-hidden
              />
            )}
          </AnimatePresence>
        </div>
        <span
          className="text-[10px] uppercase text-[var(--color-text-muted)]"
          style={{ letterSpacing: "0.18em" }}
        >
          Antonio
        </span>
      </motion.div>
    </div>
  );
}
