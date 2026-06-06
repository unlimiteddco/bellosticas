"use client";

import { AnimatePresence, motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import { useState } from "react";
import { useTranslations } from "next-intl";
import { EditorialLabel } from "@/components/ui/EditorialLabel";
import { MixedHeadline } from "@/components/ui/MixedHeadline";
import { WorkModal } from "@/components/sections/WorkModal";
import type { ResolvedProject } from "@/lib/cms/types";

type Result = {
  metric: string;
  label: string;
  client: string;
  description: string;
  projectSlug: string;
};

const NS = "lovePage.results";

export function LoveResults({ projects }: { projects: ResolvedProject[] }) {
  const t = useTranslations(NS);
  const items = t.raw("items") as Result[];
  const viewCase = t("viewCase");

  const [selected, setSelected] = useState<ResolvedProject | null>(null);

  return (
    <section className="relative z-10 bg-[var(--color-surface-2)]">
      <div className="max-w-[1280px] mx-auto px-6 lg:px-12 py-16 lg:py-24">
        <div className="flex flex-col gap-6 mb-12 max-w-[820px]">
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

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 lg:gap-6">
          {items.map((r, i) => {
            const project = projects.find((p) => p.slug === r.projectSlug);
            return (
              <motion.article
                key={r.client}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-60px" }}
                transition={{ duration: 0.6, delay: i * 0.06, ease: "easeOut" }}
                whileHover={{ y: -3 }}
                className="group relative flex flex-col gap-5 rounded-2xl border border-[var(--color-border)] bg-[var(--color-bg)] p-7 md:p-8 transition-colors duration-300 hover:border-[var(--color-accent)]/50"
              >
                <div className="flex items-baseline justify-between gap-4">
                  <span className="font-display italic text-[56px] md:text-[72px] leading-none text-[var(--color-accent)] tabular-nums">
                    {r.metric}
                  </span>
                  <span
                    className="font-body uppercase text-[10px] text-[var(--color-text-muted)] text-right max-w-[140px]"
                    style={{ letterSpacing: "0.18em" }}
                  >
                    {r.label}
                  </span>
                </div>

                <div className="flex flex-col gap-2.5 mt-2">
                  <h3 className="font-body font-semibold text-[18px] text-[var(--color-text)]">
                    {r.client}
                  </h3>
                  <p className="font-body text-[14px] leading-[1.6] text-[var(--color-text-muted)]">
                    {r.description}
                  </p>
                </div>

                {project && (
                  <button
                    type="button"
                    onClick={() => setSelected(project)}
                    className="self-start inline-flex items-center gap-1.5 mt-2 font-body text-[12px] uppercase text-[var(--color-text)] hover:text-[var(--color-accent)] transition-colors"
                    style={{ letterSpacing: "0.12em" }}
                  >
                    {viewCase}
                    <ArrowUpRight size={12} />
                  </button>
                )}
              </motion.article>
            );
          })}
        </div>
      </div>

      <AnimatePresence>
        {selected && (
          <WorkModal project={selected} onClose={() => setSelected(null)} />
        )}
      </AnimatePresence>
    </section>
  );
}
