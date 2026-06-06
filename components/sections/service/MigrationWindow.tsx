"use client";

import { AnimatePresence, motion } from "framer-motion";
import { ArrowRight, Check, FileText, Image as ImageIcon, Link2, Tag } from "lucide-react";
import { useEffect, useState } from "react";

/**
 * Live "migration in progress" panel for the migraciones service manifesto.
 *
 * Phases advance once per second. Each phase completes one task and bumps the
 * Lighthouse score one tier. After the last phase the panel pauses, bumps a
 * counter and resets — continuous loop without layout shift.
 */

type Task = {
  icon: typeof FileText;
  label: string;
  finalValue: string;
};

const TASKS: Task[] = [
  { icon: FileText, label: "Páginas migradas", finalValue: "124 / 124" },
  { icon: Link2, label: "301 redirects", finalValue: "118 / 118" },
  { icon: ImageIcon, label: "Media transferida", finalValue: "2.847 archivos" },
  { icon: Tag, label: "Metadatos & OG", finalValue: "Exactos" },
];

/** Lighthouse score after each phase (0 = pre-launch baseline). */
const SCORE_TIERS = [32, 48, 67, 84, 100];

const PHASE_MS = 1100;
const RESET_PAUSE_MS = 1400;

function scoreColor(score: number): string {
  if (score >= 90) return "#7BC57B";
  if (score >= 50) return "#E6BB64";
  return "#E66464";
}

export function MigrationWindow() {
  const [counter, setCounter] = useState(312);
  // 0..TASKS.length. At phase = TASKS.length, all tasks are done (final state).
  const [phase, setPhase] = useState(0);

  useEffect(() => {
    if (phase < TASKS.length) {
      const t = setTimeout(() => setPhase((p) => p + 1), PHASE_MS);
      return () => clearTimeout(t);
    }
    const t = setTimeout(() => {
      setCounter((c) => c + 1);
      setPhase(0);
    }, RESET_PAUSE_MS);
    return () => clearTimeout(t);
  }, [phase]);

  const score = SCORE_TIERS[phase];

  return (
    <div
      className="relative rounded-2xl overflow-hidden bg-[var(--color-text)] shadow-[0_30px_60px_-20px_rgba(29,29,27,0.45)]"
      style={{ transformStyle: "preserve-3d" }}
    >
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-2.5 border-b border-[var(--color-bg)]/10">
        <div className="flex items-center gap-2">
          <span className="relative flex h-1.5 w-1.5" aria-hidden>
            <span className="absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75 animate-ping" />
            <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-green-400" />
          </span>
          <span
            className="font-body uppercase text-[10px] text-[var(--color-bg)]/70"
            style={{ letterSpacing: "0.16em" }}
          >
            MIGRATING · stack.move
          </span>
        </div>
        <span
          className="font-body text-[10px] text-[var(--color-bg)]/40"
          style={{ letterSpacing: "0.04em" }}
        >
          tienda.es / deploy
        </span>
      </div>

      {/* Counter row */}
      <div className="flex items-baseline justify-between px-4 py-3 border-b border-[var(--color-bg)]/10">
        <div className="flex items-baseline gap-2">
          <motion.span
            key={counter}
            initial={{ opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            className="font-display italic text-[var(--color-accent)] text-[28px] md:text-[32px] leading-none tabular-nums"
          >
            {counter}
          </motion.span>
          <span
            className="font-body uppercase text-[10px] text-[var(--color-bg)]/55"
            style={{ letterSpacing: "0.18em" }}
          >
            sitios migrados
          </span>
        </div>
        <span
          className="font-body text-[10px] text-[var(--color-bg)]/35"
          style={{ letterSpacing: "0.04em" }}
        >
          0% rankings perdidos
        </span>
      </div>

      {/* Stack from → to */}
      <div className="flex items-center justify-between gap-3 px-4 py-3.5 border-b border-[var(--color-bg)]/10">
        <StackBadge
          name="WordPress"
          version="6.4"
          dim
          tag="legacy"
          tagColor="rgba(230,100,100,0.7)"
        />
        <motion.span
          animate={{ x: [0, 4, 0] }}
          transition={{ duration: 1.4, repeat: Infinity, ease: "easeInOut" }}
          className="shrink-0"
        >
          <ArrowRight
            size={18}
            className="text-[var(--color-accent)]"
            strokeWidth={2.2}
          />
        </motion.span>
        <StackBadge
          name="Next.js"
          version="15 · Sanity"
          tag="new"
          tagColor="#7BC57B"
        />
      </div>

      {/* Tasks list — fixed height to prevent layout shift */}
      <div className="px-5 py-4 flex flex-col gap-3" style={{ height: 170 }}>
        {TASKS.map((task, i) => {
          const isDone = phase > i;
          const isActive = phase === i;
          const isPending = phase < i;
          const Icon = task.icon;

          return (
            <div key={i} className="flex items-center gap-3">
              <motion.span
                animate={{
                  backgroundColor: isDone
                    ? "rgba(123,197,123,0.18)"
                    : isActive
                      ? "rgba(194,38,58,0.18)"
                      : "rgba(255,255,255,0.04)",
                  borderColor: isDone
                    ? "rgba(123,197,123,0.6)"
                    : isActive
                      ? "rgba(194,38,58,0.7)"
                      : "rgba(255,255,255,0.1)",
                }}
                transition={{ duration: 0.3 }}
                className="relative flex items-center justify-center w-7 h-7 rounded-md border shrink-0"
              >
                {isDone ? (
                  <motion.span
                    key="done"
                    initial={{ scale: 0, rotate: -10 }}
                    animate={{ scale: 1, rotate: 0 }}
                    transition={{ duration: 0.3, ease: [0.34, 1.56, 0.64, 1] }}
                  >
                    <Check size={12} className="text-green-400" strokeWidth={3} />
                  </motion.span>
                ) : (
                  <Icon
                    size={12}
                    className={
                      isActive
                        ? "text-[var(--color-accent)]"
                        : "text-[var(--color-bg)]/40"
                    }
                    strokeWidth={2}
                  />
                )}
              </motion.span>

              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-3">
                  <motion.span
                    animate={{ opacity: isPending ? 0.4 : 1 }}
                    transition={{ duration: 0.3 }}
                    className="font-body text-[12px] text-[var(--color-bg)] truncate"
                  >
                    {task.label}
                  </motion.span>
                  <span
                    className="font-body text-[10px] tabular-nums shrink-0"
                    style={{
                      letterSpacing: "0.04em",
                      color: isDone
                        ? "#7BC57B"
                        : isActive
                          ? "#C2263A"
                          : "rgba(253,253,251,0.3)",
                    }}
                  >
                    {isDone ? `✓ ${task.finalValue}` : isActive ? "running…" : "—"}
                  </span>
                </div>
                {/* Progress bar */}
                <div className="mt-1 h-[3px] rounded-full bg-white/5 overflow-hidden">
                  <motion.div
                    animate={{
                      width: isDone ? "100%" : isActive ? "65%" : "0%",
                      backgroundColor: isDone ? "#7BC57B" : "#C2263A",
                    }}
                    transition={{
                      duration: isActive ? PHASE_MS / 1000 : 0.3,
                      ease: "easeOut",
                    }}
                    className="h-full"
                  />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Lighthouse gauge */}
      <div className="flex items-center gap-4 px-4 py-3.5 border-t border-[var(--color-bg)]/10 bg-white/[0.015]">
        <LighthouseGauge score={score} />
        <div className="flex flex-col flex-1 min-w-0">
          <span
            className="font-body uppercase text-[9px] text-[var(--color-bg)]/45"
            style={{ letterSpacing: "0.16em" }}
          >
            Lighthouse · Performance
          </span>
          <div className="flex items-baseline gap-2 mt-0.5">
            <AnimatePresence mode="popLayout">
              <motion.span
                key={score}
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -6 }}
                transition={{ duration: 0.3, ease: "easeOut" }}
                className="font-display italic text-[26px] leading-none tabular-nums"
                style={{ color: scoreColor(score) }}
              >
                {score}
              </motion.span>
            </AnimatePresence>
            <span
              className="font-body text-[10px] text-[var(--color-bg)]/40"
              style={{ letterSpacing: "0.04em" }}
            >
              / 100
            </span>
            {phase > 0 && (
              <span
                className="ml-auto font-body text-[9px] tabular-nums"
                style={{
                  color: "#7BC57B",
                  letterSpacing: "0.04em",
                }}
              >
                ▲ +{score - SCORE_TIERS[0]}
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function StackBadge({
  name,
  version,
  tag,
  tagColor,
  dim,
}: {
  name: string;
  version: string;
  tag: string;
  tagColor: string;
  dim?: boolean;
}) {
  return (
    <div
      className="flex items-center gap-2.5 px-3 py-2 rounded-lg flex-1 min-w-0"
      style={{
        background: dim ? "rgba(255,255,255,0.025)" : "rgba(255,255,255,0.05)",
        border: `1px solid ${dim ? "rgba(255,255,255,0.06)" : "rgba(255,255,255,0.12)"}`,
        opacity: dim ? 0.7 : 1,
      }}
    >
      <span
        className="w-1.5 h-1.5 rounded-full shrink-0"
        style={{ background: tagColor }}
      />
      <div className="flex flex-col min-w-0">
        <span className="font-body text-[12px] text-[var(--color-bg)] font-medium truncate">
          {name}
        </span>
        <span
          className="font-body text-[9px] text-[var(--color-bg)]/45 truncate"
          style={{ letterSpacing: "0.04em" }}
        >
          {version}
        </span>
      </div>
      <span
        className="ml-auto font-body uppercase text-[8px] px-1.5 py-0.5 rounded-full shrink-0"
        style={{
          background: `${tagColor}22`,
          color: tagColor,
          letterSpacing: "0.14em",
        }}
      >
        {tag}
      </span>
    </div>
  );
}

/** Circular gauge — single arc that fills as the score climbs. */
function LighthouseGauge({ score }: { score: number }) {
  const radius = 18;
  const circumference = 2 * Math.PI * radius;
  const target = (score / 100) * circumference;

  return (
    <div className="relative w-12 h-12 shrink-0">
      <svg viewBox="0 0 48 48" width="48" height="48" className="-rotate-90">
        {/* Track */}
        <circle
          cx="24"
          cy="24"
          r={radius}
          fill="none"
          stroke="rgba(255,255,255,0.08)"
          strokeWidth="3"
        />
        {/* Score arc */}
        <motion.circle
          cx="24"
          cy="24"
          r={radius}
          fill="none"
          stroke={scoreColor(score)}
          strokeWidth="3"
          strokeLinecap="round"
          strokeDasharray={circumference}
          animate={{ strokeDashoffset: circumference - target }}
          transition={{ duration: 0.6, ease: "easeOut" }}
        />
      </svg>
    </div>
  );
}
