"use client";

import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { Check, MousePointer2 } from "lucide-react";

type Props = { isHovered: boolean };

const cursorPath = [
  { x: "20%", y: "30%" },
  { x: "70%", y: "35%" },
  { x: "55%", y: "70%" },
  { x: "85%", y: "85%" },
];

export function MockupDay3({ isHovered }: Props) {
  const reduced = useReducedMotion();
  const animate = isHovered && !reduced;

  return (
    <div className="absolute inset-0 flex flex-col p-3 gap-1.5">
      <div className="flex items-center gap-1.5">
        <div className="w-2 h-2 rounded-full bg-[#E66464]" />
        <div className="w-2 h-2 rounded-full bg-[#E6BB64]" />
        <div className="w-2 h-2 rounded-full bg-[#7BC57B]" />
        <div className="ml-2 flex-1 h-3 rounded-sm bg-[var(--color-bg)] border border-[var(--color-border)]" />
      </div>

      <div className="relative flex-1 rounded-md bg-[var(--color-bg)] border border-[var(--color-border)] p-3 flex flex-col gap-2 overflow-hidden">
        <motion.div
          animate={
            animate
              ? { backgroundColor: "rgba(194, 38, 58, 0.12)" }
              : { backgroundColor: "rgba(29, 29, 27, 0.10)" }
          }
          transition={{ duration: 0.25, delay: 0.05 }}
          className="h-5 w-2/3 rounded"
        />
        <motion.div
          animate={
            animate
              ? { backgroundColor: "rgba(29, 29, 27, 0.18)" }
              : { backgroundColor: "rgba(29, 29, 27, 0.06)" }
          }
          transition={{ duration: 0.25, delay: 0.2 }}
          className="h-2 w-full rounded"
        />
        <motion.div
          animate={
            animate
              ? { backgroundColor: "rgba(29, 29, 27, 0.18)" }
              : { backgroundColor: "rgba(29, 29, 27, 0.06)" }
          }
          transition={{ duration: 0.25, delay: 0.28 }}
          className="h-2 w-4/5 rounded"
        />
        <motion.div
          animate={
            animate
              ? { backgroundColor: "rgba(194, 38, 58, 0.55)" }
              : { backgroundColor: "rgba(194, 38, 58, 0.25)" }
          }
          transition={{ duration: 0.25, delay: 0.4 }}
          className="mt-2 h-7 w-24 rounded-full"
        />

        <AnimatePresence>
          {animate && (
            <motion.div
              key="cursor"
              initial={{ opacity: 0, ...cursorPath[0] }}
              animate={cursorPath.reduce(
                (acc, p) => {
                  acc.x.push(p.x);
                  acc.y.push(p.y);
                  return acc;
                },
                { x: [] as string[], y: [] as string[], opacity: 1 } as {
                  x: string[];
                  y: string[];
                  opacity: number;
                },
              )}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.9, ease: "easeInOut" }}
              className="absolute"
              style={{ pointerEvents: "none" }}
            >
              <MousePointer2
                size={16}
                className="fill-[var(--color-text)] text-[var(--color-text)]"
              />
            </motion.div>
          )}
        </AnimatePresence>

        <AnimatePresence>
          {animate && (
            <motion.div
              key="toast"
              initial={{ opacity: 0, y: -8, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.25, delay: 0.7 }}
              className="absolute top-2 right-2 flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[var(--color-text)] text-[var(--color-bg)] text-[9px] uppercase"
              style={{ letterSpacing: "0.12em" }}
            >
              <Check size={10} className="text-green-400" strokeWidth={3} />
              Updated
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
