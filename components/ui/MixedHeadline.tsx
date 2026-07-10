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
  /** Heading tag. Landing heroes should pass "h1" (SEO); default keeps "h2". */
  as?: "h1" | "h2" | "h3";
};

/** Una parte que es solo puntuación (".", "?", "…") no debe caer sola de línea. */
const isPunctOnly = (s: string) => /^[.,!?;:…]+$/.test(s.trim());

export function MixedHeadline({ parts, className = "", dark = false, as: Tag = "h2" }: Props) {
  const reduce = useReducedMotion();
  const baseStyles = "tracking-tight leading-[1.05]";
  const normalColor = dark ? "text-[var(--color-bg)]" : "text-[var(--color-text)]";

  const renderPart = (part: HeadlinePart, i: number) => (
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
  );

  // Los trozos con acento son inline-block (para animar la escala), lo que abre
  // una oportunidad de salto justo después. Si la siguiente parte es solo
  // puntuación, se agrupan en un nowrap para que el punto no quede huérfano.
  const nodes: React.ReactNode[] = [];
  for (let i = 0; i < parts.length; i++) {
    const current = parts[i];
    const next = parts[i + 1];
    if (next && isPunctOnly(next.text) && !isPunctOnly(current.text)) {
      nodes.push(
        <span key={`g${i}`} className="whitespace-nowrap">
          {renderPart(current, i)}
          {renderPart(next, i + 1)}
        </span>,
      );
      i++;
    } else {
      nodes.push(renderPart(current, i));
    }
  }

  return <Tag className={`${baseStyles} ${className}`}>{nodes}</Tag>;
}
