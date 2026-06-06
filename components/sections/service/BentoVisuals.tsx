"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";

export type BentoVisualKey =
  | "performance"
  | "seo"
  | "headless"
  | "edge"
  | "typescript";

/** Lighthouse-style score gauge */
export function PerformanceVisual() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-50px" });
  // 100 / 100 score
  const target = 100;
  return (
    <div ref={ref} className="relative w-full h-full flex items-center justify-center">
      <svg viewBox="0 0 200 120" className="w-full max-w-[220px] h-auto">
        <defs>
          <linearGradient id="gauge-grad" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="#C2263A" />
            <stop offset="100%" stopColor="#1D1D1B" />
          </linearGradient>
        </defs>
        {/* Track */}
        <path
          d="M 20 100 A 80 80 0 0 1 180 100"
          fill="none"
          stroke="rgba(29,29,27,0.08)"
          strokeWidth="10"
          strokeLinecap="round"
        />
        {/* Arc */}
        <motion.path
          d="M 20 100 A 80 80 0 0 1 180 100"
          fill="none"
          stroke="url(#gauge-grad)"
          strokeWidth="10"
          strokeLinecap="round"
          pathLength={1}
          initial={{ pathLength: 0 }}
          animate={inView ? { pathLength: 1 } : { pathLength: 0 }}
          transition={{ duration: 1.4, ease: [0.4, 0, 0.2, 1] }}
        />
      </svg>
      <motion.span
        className="absolute font-display text-[40px] md:text-[48px] text-[var(--color-text)] tabular-nums"
        initial={{ opacity: 0 }}
        animate={inView ? { opacity: 1 } : { opacity: 0 }}
        transition={{ duration: 0.6, delay: 1.2 }}
        style={{ bottom: "20%" }}
      >
        {inView ? target : 0}
      </motion.span>
    </div>
  );
}

/** SEO chart — bars rising up */
export function SEOVisual() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-50px" });
  const heights = [30, 50, 45, 70, 60, 90];
  return (
    <div
      ref={ref}
      className="relative w-full h-full flex items-end justify-center gap-2"
    >
      {heights.map((h, i) => (
        <motion.div
          key={i}
          className="w-6 md:w-8 rounded-t-md"
          style={{
            background:
              i === heights.length - 1
                ? "var(--color-accent)"
                : "rgba(29,29,27,0.12)",
          }}
          initial={{ height: 0 }}
          animate={inView ? { height: h + "%" } : { height: 0 }}
          transition={{
            duration: 0.8,
            delay: i * 0.08,
            ease: [0.4, 0, 0.2, 1],
          }}
        />
      ))}
      {/* Trend line dots */}
      <svg
        viewBox="0 0 200 100"
        className="absolute inset-0 w-full h-full pointer-events-none"
        preserveAspectRatio="none"
      >
        <motion.path
          d="M 20 70 L 50 50 L 80 55 L 110 30 L 140 40 L 175 10"
          fill="none"
          stroke="var(--color-accent)"
          strokeWidth="1.5"
          strokeDasharray="4 4"
          initial={{ pathLength: 0, opacity: 0 }}
          animate={inView ? { pathLength: 1, opacity: 1 } : { pathLength: 0 }}
          transition={{ duration: 1.4, delay: 0.6, ease: "easeOut" }}
        />
      </svg>
    </div>
  );
}

/** Headless CMS — 3 connected blocks (CMS → API → Site) */
export function HeadlessVisual() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-50px" });

  const blocks = ["CMS", "API", "Web"];

  return (
    <div ref={ref} className="relative w-full h-full flex items-center justify-center gap-2">
      {blocks.map((label, i) => (
        <motion.div
          key={label}
          className={`relative flex flex-col items-center justify-center w-16 h-16 md:w-[72px] md:h-[72px] rounded-xl border ${
            i === 1
              ? "border-[var(--color-accent)] bg-[var(--color-accent)]/10"
              : "border-[var(--color-border)] bg-[var(--color-bg)]"
          }`}
          initial={{ opacity: 0, y: 10 }}
          animate={inView ? { opacity: 1, y: 0 } : { opacity: 0 }}
          transition={{ duration: 0.5, delay: i * 0.2, ease: "easeOut" }}
        >
          <span
            className={`font-body text-[10px] uppercase font-semibold ${
              i === 1
                ? "text-[var(--color-accent)]"
                : "text-[var(--color-text-muted)]"
            }`}
            style={{ letterSpacing: "0.12em" }}
          >
            {label}
          </span>
        </motion.div>
      ))}
      {/* Connection lines with data pulse */}
      <svg
        viewBox="0 0 300 100"
        className="absolute inset-0 w-full h-full pointer-events-none"
        preserveAspectRatio="none"
      >
        {[80, 215].map((x, i) => (
          <g key={i}>
            <line
              x1={x}
              y1="50"
              x2={x + 20}
              y2="50"
              stroke="var(--color-border)"
              strokeWidth="1"
            />
            <motion.circle
              r="2.5"
              fill="var(--color-accent)"
              cx={x}
              cy={50}
              initial={{ opacity: 0 }}
              animate={
                inView
                  ? {
                      cx: [x, x + 20, x + 20],
                      opacity: [0, 1, 0],
                    }
                  : { opacity: 0 }
              }
              transition={{
                duration: 1.2,
                repeat: inView ? Infinity : 0,
                repeatDelay: 0.6,
                delay: 0.8 + i * 0.4,
                ease: "easeInOut",
              }}
            />
          </g>
        ))}
      </svg>
    </div>
  );
}

/** Edge — globe with pulsing nodes */
export function EdgeVisual() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-50px" });

  const nodes = [
    { cx: 100, cy: 40 },
    { cx: 60, cy: 80 },
    { cx: 140, cy: 80 },
    { cx: 80, cy: 120 },
    { cx: 120, cy: 120 },
  ];

  return (
    <div ref={ref} className="relative w-full h-full flex items-center justify-center">
      <svg viewBox="0 0 200 160" className="w-full max-w-[200px] h-auto">
        {/* Globe outline */}
        <circle
          cx="100"
          cy="80"
          r="60"
          fill="none"
          stroke="rgba(29,29,27,0.1)"
          strokeWidth="1"
        />
        <ellipse
          cx="100"
          cy="80"
          rx="60"
          ry="20"
          fill="none"
          stroke="rgba(29,29,27,0.08)"
          strokeWidth="1"
        />
        <ellipse
          cx="100"
          cy="80"
          rx="30"
          ry="60"
          fill="none"
          stroke="rgba(29,29,27,0.08)"
          strokeWidth="1"
        />
        {/* Nodes */}
        {nodes.map((n, i) => (
          <g key={i}>
            <motion.circle
              cx={n.cx}
              cy={n.cy}
              r="3"
              fill="var(--color-accent)"
              initial={{ opacity: 0, scale: 0 }}
              animate={
                inView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0 }
              }
              transition={{
                duration: 0.4,
                delay: 0.2 + i * 0.1,
                ease: "easeOut",
              }}
            />
            <motion.circle
              cx={n.cx}
              cy={n.cy}
              r="3"
              fill="var(--color-accent)"
              initial={{ opacity: 0 }}
              animate={inView ? { opacity: [0.6, 0], scale: [1, 3] } : { opacity: 0 }}
              transition={{
                duration: 1.5,
                repeat: inView ? Infinity : 0,
                repeatDelay: i * 0.3,
                delay: 0.6 + i * 0.1,
                ease: "easeOut",
              }}
            />
          </g>
        ))}
      </svg>
    </div>
  );
}

/** TypeScript — lines of code with checks */
export function TypeScriptVisual() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-50px" });

  const lines = [
    { w: "60%", check: true },
    { w: "75%", check: true },
    { w: "45%", check: true },
    { w: "85%", check: true },
    { w: "55%", check: true },
  ];

  return (
    <div ref={ref} className="relative w-full h-full flex items-center justify-center">
      <div className="w-full max-w-[240px] rounded-md bg-[var(--color-text)] p-3 flex flex-col gap-1.5">
        {lines.map((l, i) => (
          <motion.div
            key={i}
            className="flex items-center gap-1.5"
            initial={{ opacity: 0, x: -8 }}
            animate={inView ? { opacity: 1, x: 0 } : { opacity: 0 }}
            transition={{ duration: 0.35, delay: 0.15 + i * 0.12 }}
          >
            <span className="text-[9px] text-[var(--color-bg)]/40 tabular-nums w-3 text-right">
              {i + 1}
            </span>
            <div
              className="h-[6px] rounded-sm bg-[var(--color-bg)]/30"
              style={{ width: l.w }}
            />
            <motion.svg
              width="10"
              height="10"
              viewBox="0 0 24 24"
              initial={{ opacity: 0, scale: 0 }}
              animate={
                inView
                  ? { opacity: 1, scale: 1 }
                  : { opacity: 0 }
              }
              transition={{
                duration: 0.3,
                delay: 0.4 + i * 0.12,
                ease: "easeOut",
              }}
            >
              <path
                d="M5 13l4 4L19 7"
                fill="none"
                stroke="#7BC57B"
                strokeWidth="3"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </motion.svg>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

export function BentoVisual({ kind }: { kind: BentoVisualKey }) {
  switch (kind) {
    case "performance":
      return <PerformanceVisual />;
    case "seo":
      return <SEOVisual />;
    case "headless":
      return <HeadlessVisual />;
    case "edge":
      return <EdgeVisual />;
    case "typescript":
      return <TypeScriptVisual />;
    default:
      return null;
  }
}
