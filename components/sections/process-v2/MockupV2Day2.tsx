"use client";

import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { MousePointer2 } from "lucide-react";
import { useEffect, useState } from "react";

type Props = { isHovered: boolean };

type Position = "backlog" | "active" | "completed";

export function MockupV2Day2({ isHovered }: Props) {
  const reduce = useReducedMotion();
  const animate = isHovered && !reduce;
  const [movingPos, setMovingPos] = useState<Position>("backlog");

  useEffect(() => {
    if (!animate) {
      setMovingPos("backlog");
      return;
    }
    const timers = [
      setTimeout(() => setMovingPos("active"), 600),
      setTimeout(() => setMovingPos("completed"), 1400),
      setTimeout(() => setMovingPos("backlog"), 2200),
    ];
    const loop = setInterval(() => {
      setMovingPos((p) =>
        p === "backlog" ? "active" : p === "active" ? "completed" : "backlog",
      );
    }, 1200);
    return () => {
      timers.forEach(clearTimeout);
      clearInterval(loop);
    };
  }, [animate]);

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

      {/* Kanban board */}
      <div className="absolute inset-0 flex items-start justify-center pt-8 px-4">
        <div className="w-full max-w-[420px] grid grid-cols-3 gap-2">
          {/* Column: Pendiente */}
          <Column label="Pendiente" count={1}>
            {movingPos === "backlog" && <MovingCard pos="backlog" />}
            <Card label="Instrucciones" sub="1 0/1" subdued />
          </Column>

          {/* Column: En curso */}
          <Column label="En curso" count={movingPos === "active" ? 2 : 1}>
            {movingPos === "active" && <MovingCard pos="active" />}
            <Card label="Activos marketing" sub="1" />
          </Column>

          {/* Column: Completado */}
          <Column label="Completado" count={movingPos === "completed" ? 2 : 1} done>
            {movingPos === "completed" && <MovingCard pos="completed" />}
            <Card label="Pantalla splash" sub="1" />
            <Card label="Onboarding app" sub="1" />
          </Column>
        </div>
      </div>

      {/* Animated cursor with "client" label */}
      <AnimatePresence>
        {animate && (
          <motion.div
            key="cursor"
            initial={{ opacity: 0 }}
            animate={{
              opacity: 1,
              left:
                movingPos === "backlog"
                  ? "20%"
                  : movingPos === "active"
                    ? "50%"
                    : "78%",
              top: movingPos === "completed" ? "62%" : "44%",
            }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.7, ease: [0.4, 0, 0.2, 1] }}
            className="absolute pointer-events-none flex items-center gap-1.5"
            style={{ transform: "translate(-50%, -50%)" }}
          >
            <MousePointer2
              size={16}
              className="fill-[var(--color-text)] text-[var(--color-text)]"
              style={{ transform: "rotate(-15deg)" }}
            />
            <span className="px-2 py-0.5 rounded-full bg-[var(--color-text)] text-[var(--color-bg)] text-[9px] font-medium">
              cliente
            </span>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function Column({
  label,
  count,
  done,
  children,
}: {
  label: string;
  count: number;
  done?: boolean;
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-1.5 min-w-0">
      <div className="flex items-center gap-1 text-[7px] mb-0.5">
        {done && <span className="text-green-600">✓</span>}
        <span className="font-body uppercase text-[var(--color-text)] truncate" style={{ letterSpacing: "0.05em" }}>
          {label}
        </span>
        <span className="text-[var(--color-text-muted)]">({count})</span>
      </div>
      <div className="flex flex-col gap-1 min-h-0">{children}</div>
    </div>
  );
}

function Card({
  label,
  sub,
  subdued,
}: {
  label: string;
  sub?: string;
  subdued?: boolean;
}) {
  return (
    <div
      className={`rounded-md p-1.5 border bg-[var(--color-bg)] ${
        subdued ? "border-[var(--color-border)]" : "border-[var(--color-border)]"
      }`}
    >
      <div className="text-[7px] text-[var(--color-text)] truncate">{label}</div>
      {sub && (
        <div className="text-[6px] text-[var(--color-text-muted)] mt-0.5">
          {sub}
        </div>
      )}
    </div>
  );
}

function MovingCard({ pos }: { pos: Position }) {
  return (
    <motion.div
      layout
      layoutId="movingCard"
      transition={{ type: "spring", stiffness: 300, damping: 28 }}
      className="rounded-md p-1.5 shadow-[0_4px_12px_-2px_rgba(29,29,27,0.25)]"
      style={{
        background:
          pos === "completed"
            ? "rgba(123, 197, 123, 0.25)"
            : "rgba(85, 154, 230, 0.85)",
        color: pos === "completed" ? "#1f5d1f" : "#ffffff",
      }}
    >
      <div className="text-[7px] truncate font-medium">Web & Mobile</div>
      <div className="text-[6px] opacity-70 mt-0.5">1</div>
    </motion.div>
  );
}
