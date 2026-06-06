"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useTranslations } from "next-intl";
import { EditorialLabel } from "@/components/ui/EditorialLabel";
import { MixedHeadline } from "@/components/ui/MixedHeadline";
import { PrimaryButton } from "@/components/ui/PrimaryButton";
import { PatternDivider } from "@/components/sections/PatternDivider";
import { WorkCard } from "@/components/sections/WorkCard";
import { WorkModal } from "@/components/sections/WorkModal";
import type { ResolvedProject } from "@/lib/cms/types";

export function WorkPageContent({ projects }: { projects: ResolvedProject[] }) {
  const t = useTranslations("workPage");
  const [selected, setSelected] = useState<ResolvedProject | null>(null);

  // Featured = an explicitly-featured project (CMS checkbox), else the first
  // with both logo + cover, else the first project.
  const featured =
    projects.find((p) => p.featured) ??
    projects.find((p) => p.logo && p.cover) ??
    projects[0];
  const rest = projects.filter((p) => p.slug !== featured?.slug);

  return (
    <>
      {/* Hero */}
      <section className="relative z-10 max-w-[1280px] mx-auto px-6 lg:px-12 pt-[160px] pb-10 md:pb-16">
        <div className="flex flex-col gap-6 max-w-[840px]">
          <EditorialLabel>{t("label")}</EditorialLabel>
          <MixedHeadline
            className="text-[48px] md:text-[72px] lg:text-[88px]"
            parts={[
              { text: t("title_part1") },
              { text: t("title_emphasis"), accent: true },
              { text: t("title_part2") },
            ]}
          />
          <p className="font-body text-[17px] lg:text-[19px] leading-[1.55] text-[var(--color-text-muted)] max-w-[640px]">
            {t("sub")}
          </p>

          {/* Stats inline */}
          <div
            className="flex flex-wrap items-center gap-x-3 gap-y-1 mt-2 font-body uppercase text-[11px] text-[var(--color-text-muted)]"
            style={{ letterSpacing: "0.18em" }}
          >
            <span>{t("stats.projects")}</span>
            <span aria-hidden>·</span>
            <span>{t("stats.since")}</span>
            <span aria-hidden>·</span>
            <span>{t("stats.ontime")}</span>
          </div>
        </div>
      </section>

      {/* Featured project (full-width) */}
      {featured && (
        <section className="relative z-10 max-w-[1280px] mx-auto px-6 lg:px-12 pb-10">
          <WorkCard
            project={featured}
            onClick={() => setSelected(featured)}
            index={0}
            featured
            viewCaseLabel={t("viewCase")}
            featuredLabel={t("featured")}
          />
        </section>
      )}

      <PatternDivider height={36} size="xs" />

      {/* Rest of projects — 2-col grid */}
      <section
        data-video-trigger
        className="relative z-10 max-w-[1280px] mx-auto px-6 lg:px-12 py-12 lg:py-16"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
          {rest.map((p, i) => (
            <WorkCard
              key={p.slug}
              project={p}
              index={i + 1}
              onClick={() => setSelected(p)}
              viewCaseLabel={t("viewCase")}
            />
          ))}
        </div>
      </section>

      {/* Mini-CTA */}
      <section className="relative z-10 max-w-[1280px] mx-auto px-6 lg:px-12 py-16 lg:py-24">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="relative overflow-hidden rounded-3xl bg-[var(--color-surface-2)] px-6 md:px-12 py-12 md:py-14 flex flex-col md:flex-row md:items-center md:justify-between gap-8"
        >
          <div className="flex flex-col gap-3 max-w-[640px]">
            <EditorialLabel>{t("cta.label")}</EditorialLabel>
            <MixedHeadline
              className="text-[32px] md:text-[44px]"
              parts={[
                { text: t("cta.title_part1") },
                { text: t("cta.title_emphasis"), accent: true },
                { text: t("cta.title_part2") },
              ]}
            />
            <p className="font-body text-[15px] text-[var(--color-text-muted)] max-w-[480px]">
              {t("cta.sub")}
            </p>
          </div>

          <div className="shrink-0">
            <PrimaryButton href="/contact">{t("cta.button")}</PrimaryButton>
          </div>
        </motion.div>
      </section>

      <AnimatePresence>
        {selected && (
          <WorkModal project={selected} onClose={() => setSelected(null)} />
        )}
      </AnimatePresence>
    </>
  );
}
