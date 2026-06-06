"use client";

import { motion, useReducedMotion } from "framer-motion";
import { useState } from "react";
import { MockupDay1 } from "./process/MockupDay1";
import { MockupDay2 } from "./process/MockupDay2";
import { MockupDay3 } from "./process/MockupDay3";

type Props = {
  index: number;
  day: 1 | 2 | 3;
  tag: string;
  title: string;
  description: string;
};

export function ProcessCard({ index, day, tag, title, description }: Props) {
  const reduced = useReducedMotion();
  const [hover, setHover] = useState(false);

  const Mockup =
    day === 1 ? MockupDay1 : day === 2 ? MockupDay2 : MockupDay3;

  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.7, delay: index * 0.15, ease: "easeOut" }}
      onHoverStart={() => setHover(true)}
      onHoverEnd={() => setHover(false)}
      className="flex flex-col gap-6"
    >
      <motion.div
        animate={
          reduced
            ? {}
            : {
                y: hover ? -6 : 0,
                boxShadow: hover
                  ? "0 20px 40px -20px rgba(29,29,27,0.18)"
                  : "0 0 0 rgba(0,0,0,0)",
              }
        }
        transition={{ duration: 0.4, ease: "easeOut" }}
        className={`relative aspect-[4/3] rounded-2xl overflow-hidden border bg-[var(--color-surface-2)] transition-colors duration-300 ${
          hover
            ? "border-[var(--color-accent)]/50"
            : "border-[var(--color-border)]"
        }`}
      >
        <Mockup isHovered={hover} />
      </motion.div>

      <div className="flex flex-col gap-3">
        <span
          className="relative inline-block w-fit font-body uppercase text-[11px] text-[var(--color-accent)]"
          style={{ letterSpacing: "0.18em" }}
        >
          {tag}
          <span
            className="absolute left-0 -bottom-1 h-px bg-[var(--color-accent)] transition-[width] duration-500"
            style={{ width: hover ? "100%" : "0%" }}
          />
        </span>
        <h3 className="font-display text-[24px] leading-tight text-[var(--color-text)]">
          {title}
        </h3>
        <p className="font-body text-[14px] leading-[1.6] text-[var(--color-text-muted)] max-w-[360px]">
          {description}
        </p>
      </div>
    </motion.div>
  );
}
