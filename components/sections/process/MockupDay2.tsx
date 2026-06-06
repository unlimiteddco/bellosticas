"use client";

import { motion, useReducedMotion } from "framer-motion";
import { useEffect, useState } from "react";

type Props = { isHovered: boolean };

type Card = { id: string; tone: "muted" | "accent" };

const initial: Record<"backlog" | "active" | "done", Card[]> = {
  backlog: [
    { id: "c1", tone: "muted" },
    { id: "c2", tone: "muted" },
    { id: "c3", tone: "muted" },
  ],
  active: [{ id: "cA", tone: "accent" }],
  done: [],
};

function shiftOnce(state: typeof initial): typeof initial {
  const next = {
    backlog: [...state.backlog],
    active: [...state.active],
    done: [...state.done],
  };
  if (next.active.length) next.done = [...next.done, next.active[0]];
  next.active = next.backlog.length ? [next.backlog[0]] : [];
  next.backlog = next.backlog.slice(1);
  return next;
}

export function MockupDay2({ isHovered }: Props) {
  const reduced = useReducedMotion();
  const [state, setState] = useState(initial);

  useEffect(() => {
    if (!isHovered || reduced) {
      setState(initial);
      return;
    }
    const interval = setInterval(() => {
      setState((s) => {
        if (!s.backlog.length && !s.active.length) return initial;
        return shiftOnce(s);
      });
    }, 800);
    return () => clearInterval(interval);
  }, [isHovered, reduced]);

  const columns = [
    { key: "backlog" as const, label: "Backlog" },
    { key: "active" as const, label: "Active" },
    { key: "done" as const, label: "Done" },
  ];

  return (
    <div className="absolute inset-0 flex gap-2 p-4">
      {columns.map((col) => (
        <div key={col.key} className="flex-1 flex flex-col gap-2 min-w-0">
          <span
            className="text-[9px] uppercase text-[var(--color-text-muted)] mb-1"
            style={{ letterSpacing: "0.18em" }}
          >
            {col.label}
          </span>
          <div className="flex flex-col gap-2 min-h-0">
            {state[col.key].map((card) => (
              <motion.div
                key={card.id}
                layout
                layoutId={card.id}
                transition={{
                  type: "spring",
                  stiffness: 380,
                  damping: 26,
                }}
                className={`h-6 rounded-md border ${
                  card.tone === "accent"
                    ? "bg-[var(--color-accent)]/15 border-[var(--color-accent)]/40"
                    : "bg-[var(--color-bg)] border-[var(--color-border)]"
                }`}
              />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
