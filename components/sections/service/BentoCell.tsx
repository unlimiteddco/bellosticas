"use client";

import { motion } from "framer-motion";
import { type ReactNode } from "react";

type Props = {
  title: string;
  description: string;
  visual: ReactNode;
  className?: string;
  index?: number;
};

export function BentoCell({
  title,
  description,
  visual,
  className = "",
  index = 0,
}: Props) {
  return (
    <motion.article
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.6, delay: index * 0.08, ease: "easeOut" }}
      className={`group relative flex flex-col justify-between rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] p-7 md:p-8 overflow-hidden transition-colors duration-300 hover:border-[var(--color-accent)]/60 ${className}`}
    >
      <div className="flex flex-col gap-3 mb-6">
        <h3 className="font-display text-[24px] md:text-[28px] leading-tight text-[var(--color-text)]">
          {title}
        </h3>
        <p className="font-body text-[14px] leading-[1.55] text-[var(--color-text-muted)] max-w-[420px]">
          {description}
        </p>
      </div>
      <div className="relative w-full h-[160px] md:h-[180px] flex items-end justify-center">
        {visual}
      </div>
    </motion.article>
  );
}
