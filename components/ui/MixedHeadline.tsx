"use client";

import { motion, useReducedMotion } from "framer-motion";

export type HeadlinePart = {
  text: string;
  accent?: boolean;
};

type Props = {
  parts: HeadlinePart[];
  className?: string;
  dark?: boolean;
};

export function MixedHeadline({ parts, className = "", dark = false }: Props) {
  const reduce = useReducedMotion();
  const baseStyles = "tracking-tight leading-[1.05]";
  const normalColor = dark ? "text-[var(--color-bg)]" : "text-[var(--color-text)]";

  return (
    <h2 className={`${baseStyles} ${className}`}>
      {parts.map((part, i) => (
        <motion.span
          key={i}
          initial={{ opacity: 0, y: 20, scale: part.accent ? 0.95 : 1 }}
          whileInView={{ opacity: 1, y: 0, scale: 1 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{
            duration: reduce ? 0 : 0.6,
            delay: reduce ? 0 : i * 0.12,
            ease: [0.4, 0, 0.2, 1],
          }}
          style={{ whiteSpace: "pre-wrap" }}
          className={
            part.accent
              ? "font-display italic font-semibold text-[var(--color-accent)] inline-block"
              : `font-body font-medium ${normalColor}`
          }
        >
          {part.text}
        </motion.span>
      ))}
    </h2>
  );
}
