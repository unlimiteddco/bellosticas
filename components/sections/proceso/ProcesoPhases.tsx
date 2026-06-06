"use client";

import { motion } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { useTranslations } from "next-intl";
import { EditorialLabel } from "@/components/ui/EditorialLabel";
import { MixedHeadline } from "@/components/ui/MixedHeadline";

type Phase = {
  n: string;
  name: string;
  timeline: string;
  body: string;
  outputs: string[];
};

export function ProcesoPhases() {
  const t = useTranslations("proceso.phases");
  const phases = t.raw("items") as Phase[];
  const [active, setActive] = useState(0);
  const blockRefs = useRef<(HTMLDivElement | null)[]>([]);

  // Highlight the phase whose block is centered in the viewport.
  useEffect(() => {
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const idx = Number((entry.target as HTMLElement).dataset.idx);
            setActive(idx);
          }
        });
      },
      { rootMargin: "-45% 0px -45% 0px", threshold: 0 },
    );
    blockRefs.current.forEach((el) => el && io.observe(el));
    return () => io.disconnect();
  }, []);

  return (
    <section className="relative z-10 max-w-[1280px] mx-auto px-6 lg:px-12 py-20 md:py-28">
      <div className="flex flex-col gap-6 mb-16 max-w-[820px]">
        <EditorialLabel>{t("label")}</EditorialLabel>
        <MixedHeadline
          className="text-[40px] md:text-[56px]"
          parts={[
            { text: t("title_part1") },
            { text: t("title_emphasis"), accent: true },
            { text: t("title_part2") },
          ]}
        />
        <p className="font-body text-[16px] lg:text-[17px] leading-[1.55] text-[var(--color-text-muted)] max-w-[540px]">
          {t("sub")}
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16">
        {/* Sticky rail */}
        <aside className="hidden lg:block lg:col-span-4 lg:sticky lg:top-32 self-start">
          <ul className="flex flex-col">
            {phases.map((p, i) => {
              const isActive = i === active;
              return (
                <li key={p.n}>
                  <button
                    type="button"
                    onClick={() =>
                      blockRefs.current[i]?.scrollIntoView({ behavior: "smooth", block: "center" })
                    }
                    className="group w-full flex items-center gap-4 py-4 text-left border-b border-[var(--color-border)]"
                  >
                    <span
                      className="font-display italic text-[28px] leading-none tabular-nums transition-colors"
                      style={{
                        color: isActive
                          ? "var(--color-accent)"
                          : "var(--color-text-muted)",
                        opacity: isActive ? 1 : 0.4,
                      }}
                    >
                      {p.n}
                    </span>
                    <div className="flex flex-col">
                      <span
                        className="font-body font-medium text-[17px] transition-colors"
                        style={{
                          color: isActive
                            ? "var(--color-text)"
                            : "var(--color-text-muted)",
                        }}
                      >
                        {p.name}
                      </span>
                      <span
                        className="font-mono text-[11px] text-[var(--color-text-muted)]"
                        style={{ letterSpacing: "0.04em" }}
                      >
                        {p.timeline}
                      </span>
                    </div>
                  </button>
                </li>
              );
            })}
          </ul>
        </aside>

        {/* Scrolling phase blocks */}
        <div className="lg:col-span-7 lg:col-start-6 flex flex-col gap-16 lg:gap-28">
          {phases.map((p, i) => (
            <motion.div
              key={p.n}
              data-idx={i}
              ref={(el) => {
                blockRefs.current[i] = el;
              }}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.6, ease: "easeOut" }}
              className="flex flex-col gap-5 scroll-mt-32"
            >
              <div className="flex items-baseline gap-4">
                <span className="font-display italic text-[var(--color-accent)] text-[40px] md:text-[52px] leading-none">
                  {p.n}
                </span>
                <div className="flex flex-col">
                  <h3 className="font-display text-[26px] md:text-[34px] leading-tight text-[var(--color-text)]">
                    {p.name}
                  </h3>
                  <span
                    className="font-mono uppercase text-[11px] text-[var(--color-accent)] mt-1"
                    style={{ letterSpacing: "0.1em" }}
                  >
                    {p.timeline}
                  </span>
                </div>
              </div>

              <p className="font-body text-[16px] md:text-[17px] leading-[1.65] text-[var(--color-text-muted)] max-w-[520px]">
                {p.body}
              </p>

              {/* Outputs */}
              <div className="flex flex-wrap gap-2.5 mt-1">
                {p.outputs.map((o) => (
                  <span
                    key={o}
                    className="inline-flex items-center px-3 py-1.5 rounded-full border border-[var(--color-border)] bg-[var(--color-surface)] font-body text-[12px] text-[var(--color-text)]"
                  >
                    {o}
                  </span>
                ))}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
