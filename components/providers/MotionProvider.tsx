"use client";

import { MotionConfig } from "framer-motion";
import { useReducedMotion } from "@/lib/hooks/useReducedMotion";

export function MotionProvider({ children }: { children: React.ReactNode }) {
  const reduced = useReducedMotion();
  return (
    <MotionConfig reducedMotion={reduced ? "always" : "never"}>
      {children}
    </MotionConfig>
  );
}
