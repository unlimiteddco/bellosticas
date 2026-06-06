"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useTranslations } from "next-intl";
import { useReducedMotion } from "@/lib/hooks/useReducedMotion";
import { Logo } from "@/components/ui/Logo";

const SESSION_KEY = "bs:preloader-shown";
const TOTAL_DURATION = 700;

export function Preloader() {
  const t = useTranslations("preloader");
  const phrases = (t.raw("phrases") as string[]) ?? [];
  const location = t("location");
  const reduced = useReducedMotion();

  const [visible, setVisible] = useState(true);
  const [progress, setProgress] = useState(0);
  const [phraseIndex, setPhraseIndex] = useState(0);
  const [time, setTime] = useState("");

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (sessionStorage.getItem(SESSION_KEY)) {
      setVisible(false);
      return;
    }

    document.body.setAttribute("aria-busy", "true");

    const start = performance.now();
    let raf = 0;
    const tick = (now: number) => {
      const elapsed = now - start;
      const p = Math.min(100, (elapsed / TOTAL_DURATION) * 100);
      setProgress(p);
      if (elapsed < TOTAL_DURATION) {
        raf = requestAnimationFrame(tick);
      } else {
        sessionStorage.setItem(SESSION_KEY, "1");
        setVisible(false);
        document.body.removeAttribute("aria-busy");
      }
    };
    raf = requestAnimationFrame(tick);

    const phraseTimer = setInterval(
      () => setPhraseIndex((i) => (i + 1) % phrases.length),
      400,
    );

    const updateTime = () => {
      const d = new Date();
      const hh = d.getHours().toString().padStart(2, "0");
      const mm = d.getMinutes().toString().padStart(2, "0");
      setTime(`${hh}:${mm}`);
    };
    updateTime();
    const timeTimer = setInterval(updateTime, 30_000);

    return () => {
      cancelAnimationFrame(raf);
      clearInterval(phraseTimer);
      clearInterval(timeTimer);
      document.body.removeAttribute("aria-busy");
    };
  }, [phrases.length]);

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          key="preloader"
          initial={{ clipPath: "inset(0 0 0 0)" }}
          exit={{ clipPath: "inset(0 0 100% 0)" }}
          transition={{
            duration: reduced ? 0 : 0.5,
            ease: [0.4, 0, 0.2, 1],
          }}
          className="fixed inset-0 z-[9999] flex items-center justify-center bg-[var(--color-bg)]"
          aria-hidden={!visible}
        >
          <div className="flex flex-col items-center gap-4">
            <Logo variant="black" height={48} priority />
            <span
              className="font-body uppercase text-[11px] text-[var(--color-text-muted)]"
              style={{ letterSpacing: "0.18em" }}
            >
              {phrases[phraseIndex] ?? ""}
            </span>
          </div>

          <div
            className="absolute bottom-6 left-6 font-body uppercase text-[11px] text-[var(--color-text-muted)]"
            style={{ letterSpacing: "0.18em" }}
          >
            {location} · {time} GMT+1
          </div>
          <div
            className="absolute bottom-6 right-6 font-body text-[11px] uppercase text-[var(--color-text-muted)]"
            style={{ letterSpacing: "0.18em" }}
          >
            {Math.floor(progress).toString().padStart(3, "0")}%
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
