"use client";

import { motion, useReducedMotion } from "framer-motion";
import { useState } from "react";
import { MockupV2Day1 } from "./process-v2/MockupV2Day1";
import { MockupV2Day2 } from "./process-v2/MockupV2Day2";
import { MockupV2Day3 } from "./process-v2/MockupV2Day3";

type Props = {
  index: number;
  day: 1 | 2 | 3;
  tag: string;
  title: string;
  description: string;
};

export function ProcessV2Card({ index, day, tag, title, description }: Props) {
  const reduce = useReducedMotion();
  const [hover, setHover] = useState(false);

  const Mockup =
    day === 1 ? MockupV2Day1 : day === 2 ? MockupV2Day2 : MockupV2Day3;

  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.7, delay: index * 0.15, ease: "easeOut" }}
      onHoverStart={() => setHover(true)}
      onHoverEnd={() => setHover(false)}
      className="flex flex-col items-center gap-7 text-center"
    >
      {/* Mockup area — no border, soft ambient shadow */}
      <motion.div
        animate={reduce ? {} : { scale: hover ? 1.01 : 1 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="relative w-full aspect-[5/4] rounded-3xl overflow-hidden"
        style={{
          boxShadow: hover
            ? "0 40px 80px -30px rgba(29,29,27,0.25), 0 0 0 1px rgba(229,226,220,0.6)"
            : "0 25px 50px -25px rgba(29,29,27,0.18), 0 0 0 1px rgba(229,226,220,0.5)",
          transition: "box-shadow 400ms ease-out",
        }}
      >
        <Mockup isHovered={hover} />
      </motion.div>

      {/* Centered text below */}
      <div className="flex flex-col items-center gap-4 max-w-[380px]">
        <span
          className="font-body uppercase text-[12px] text-[var(--color-accent)]"
          style={{ letterSpacing: "0.18em" }}
        >
          {tag}
        </span>
        <h3 className="font-display text-[26px] md:text-[30px] leading-[1.2] text-[var(--color-text)]">
          {title}
        </h3>
        <p className="font-body text-[15px] leading-[1.6] text-[var(--color-text-muted)]">
          {description}
        </p>
      </div>
    </motion.div>
  );
}
