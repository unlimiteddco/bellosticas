"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import { useTranslations } from "next-intl";
import { useReducedMotion } from "@/lib/hooks/useReducedMotion";

export function ClientPortalMockup() {
  const t = useTranslations("clientPortal.mockup");
  const reduced = useReducedMotion();
  const ref = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });
  const y = useTransform(scrollYProgress, [0, 1], [40, -40]);

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, scale: 0.95, y: 60 }}
      whileInView={{ opacity: 1, scale: 1, y: 0 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ duration: 0.8, ease: "easeOut" }}
      style={{ y: reduced ? 0 : y }}
      className="lg:col-span-7 relative"
    >
      <div
        className="rounded-2xl overflow-hidden border border-[var(--color-text)]/30 shadow-[0_30px_60px_-30px_rgba(29,29,27,0.25)]"
        style={{ aspectRatio: "16 / 11" }}
      >
        <div className="grid grid-cols-[180px_1fr] h-full bg-[var(--color-bg)]">
          <aside className="bg-[var(--color-text)] text-[var(--color-bg)] p-4 flex flex-col gap-4">
            <span className="font-display italic text-[14px]">Bellostas</span>
            <span
              className="text-[9px] uppercase opacity-60"
              style={{ letterSpacing: "0.18em" }}
            >
              CLIENT PORTAL
            </span>
            <nav className="flex flex-col gap-2 mt-2">
              {["Overview", "Phases", "Files", "Comms", "Invoices"].map((it, i) => (
                <span
                  key={it}
                  className={`text-[12px] py-1.5 px-2 rounded ${
                    i === 1 ? "bg-[var(--color-bg)]/10" : "opacity-70"
                  }`}
                >
                  {it}
                </span>
              ))}
            </nav>
            <div className="mt-auto flex items-center gap-2">
              <div className="w-7 h-7 rounded-full bg-[var(--color-bg)]/20" />
              <span className="text-[10px] opacity-70">Antonio</span>
            </div>
          </aside>

          <main className="p-5 flex flex-col gap-4 overflow-hidden">
            <div className="flex items-center justify-between">
              <div className="flex flex-col gap-1">
                <span
                  className="text-[9px] uppercase text-[var(--color-text-muted)]"
                  style={{ letterSpacing: "0.18em" }}
                >
                  {t("phase")}
                </span>
                <span className="font-display text-[18px] text-[var(--color-text)]">
                  {t("project")}
                </span>
              </div>
              <span className="text-[10px] uppercase text-[var(--color-accent)] flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-[var(--color-accent)] animate-pulse" />
                LIVE
              </span>
            </div>

            <div className="flex flex-col gap-1.5">
              <div className="flex items-center justify-between text-[10px] text-[var(--color-text-muted)]">
                <span>Progress</span>
                <span className="font-semibold text-[var(--color-text)]">
                  {t("progress")}
                </span>
              </div>
              <div className="h-1.5 rounded-full bg-[var(--color-border)] overflow-hidden">
                <div
                  className="h-full bg-[var(--color-accent)]"
                  style={{ width: t("progress") }}
                />
              </div>
            </div>

            <div className="grid grid-cols-3 gap-3 flex-1">
              {[
                { phase: "01", label: "Discovery", state: "done" },
                { phase: "02", label: "Wireframes", state: "done" },
                { phase: "03", label: "Design", state: "active" },
              ].map((p) => (
                <div
                  key={p.phase}
                  className={`rounded-lg p-3 border ${
                    p.state === "active"
                      ? "bg-[var(--color-accent)]/10 border-[var(--color-accent)]/40"
                      : "bg-[var(--color-surface-2)] border-[var(--color-border)]"
                  }`}
                >
                  <span
                    className={`text-[9px] uppercase ${
                      p.state === "active"
                        ? "text-[var(--color-accent)]"
                        : "text-[var(--color-text-muted)]"
                    }`}
                    style={{ letterSpacing: "0.18em" }}
                  >
                    PHASE {p.phase}
                  </span>
                  <p className="font-display text-[13px] mt-1 text-[var(--color-text)]">
                    {p.label}
                  </p>
                  <span className="text-[9px] text-[var(--color-text-muted)] mt-2 block">
                    {p.state === "done" ? "✓ Completed" : "In progress"}
                  </span>
                </div>
              ))}
            </div>

            <div className="rounded-lg border border-[var(--color-border)] p-3 flex items-center justify-between">
              <span className="text-[11px] text-[var(--color-text-muted)]">
                {t("next")}
              </span>
              <span className="text-[10px] uppercase text-[var(--color-text)]" style={{ letterSpacing: "0.12em" }}>
                Mar 14, 16:00
              </span>
            </div>
          </main>
        </div>
      </div>
    </motion.div>
  );
}
