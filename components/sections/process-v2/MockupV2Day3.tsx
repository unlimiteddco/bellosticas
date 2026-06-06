"use client";

import { motion, useReducedMotion } from "framer-motion";

type Props = { isHovered: boolean };

export function MockupV2Day3({ isHovered }: Props) {
  const reduce = useReducedMotion();
  const animate = isHovered && !reduce;

  return (
    <div className="absolute inset-0">
      {/* Soft radial vignette */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse at center, rgba(244,242,238,0.4) 0%, rgba(229,226,220,0.6) 70%, rgba(205,200,192,0.3) 100%)",
        }}
      />

      <div className="absolute inset-0 flex items-center justify-center px-4 gap-2 pt-7">
        {/* BEFORE — left, smaller */}
        <motion.div
          animate={
            animate
              ? { x: -8, scale: 0.96, opacity: 0.9 }
              : { x: 0, scale: 1, opacity: 1 }
          }
          transition={{ duration: 0.6, ease: [0.4, 0, 0.2, 1] }}
          className="relative"
          style={{ width: "38%" }}
        >
          <span
            className="absolute -top-6 left-1/2 -translate-x-1/2 font-display italic text-[14px] text-[var(--color-text-muted)]"
            style={{ letterSpacing: "0.02em" }}
          >
            antes
          </span>
          <div
            className="aspect-[4/5] rounded-xl overflow-hidden bg-[var(--color-bg)] shadow-[0_15px_30px_-12px_rgba(29,29,27,0.2)]"
            style={{ border: "1px solid var(--color-border)" }}
          >
            <img
              src="/clientes/fada-antes.jpg"
              alt="FADA web anterior"
              className="w-full h-full object-cover object-top"
              loading="lazy"
            />
          </div>
        </motion.div>

        {/* AFTER — right, larger, on top */}
        <motion.div
          animate={
            animate ? { x: 6, scale: 1.04, y: -3 } : { x: 0, scale: 1, y: 0 }
          }
          transition={{ duration: 0.6, ease: [0.4, 0, 0.2, 1] }}
          className="relative"
          style={{ width: "48%" }}
        >
          <span
            className="absolute -top-6 left-1/2 -translate-x-1/2 font-display italic text-[14px] text-[var(--color-text)]"
            style={{ letterSpacing: "0.02em" }}
          >
            después
          </span>
          <div
            className="aspect-[4/5] rounded-xl overflow-hidden bg-[var(--color-bg)] shadow-[0_25px_50px_-12px_rgba(29,29,27,0.4)]"
            style={{ border: "1px solid var(--color-text)" }}
          >
            <img
              src="/clientes/fada-despues.jpg"
              alt="FADA web nueva"
              className="w-full h-full object-cover object-top"
              loading="lazy"
            />
          </div>
        </motion.div>
      </div>
    </div>
  );
}
