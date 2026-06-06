"use client";

import { useState } from "react";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowRight, ChevronDown } from "lucide-react";
import { useTranslations } from "next-intl";
import { EditorialLabel } from "@/components/ui/EditorialLabel";
import { MixedHeadline } from "@/components/ui/MixedHeadline";
import { WorkCard } from "./WorkCard";
import { WorkModal } from "./WorkModal";
import type { ResolvedProject } from "@/lib/cms/types";

const INITIAL_COUNT = 4;

export function Work({ projects }: { projects: ResolvedProject[] }) {
  const t = useTranslations("work");
  const [selected, setSelected] = useState<ResolvedProject | null>(null);
  const [expanded, setExpanded] = useState(false);

  const visible = projects.slice(0, INITIAL_COUNT);
  const hidden = projects.slice(INITIAL_COUNT);
  const hasHidden = hidden.length > 0;

  return (
    <section className="relative z-10 max-w-[1280px] mx-auto px-6 lg:px-12 py-16 lg:py-24">
      <div className="flex flex-col gap-6 mb-16 max-w-[820px]">
        <EditorialLabel>{t("label")}</EditorialLabel>
        <MixedHeadline
          className="text-[44px] md:text-[64px]"
          parts={[
            { text: t("title_part1") },
            { text: t("title_emphasis"), accent: true },
            { text: t("title_part2") },
          ]}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {visible.map((p, i) => (
          <WorkCard
            key={p.slug}
            project={p}
            index={i}
            onClick={() => setSelected(p)}
          />
        ))}

        <AnimatePresence initial={false}>
          {expanded &&
            hidden.map((p, i) => (
              <motion.div
                key={p.slug}
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 24 }}
                transition={{
                  duration: 0.5,
                  delay: i * 0.08,
                  ease: [0.4, 0, 0.2, 1],
                }}
              >
                <WorkCard
                  project={p}
                  index={INITIAL_COUNT + i}
                  onClick={() => setSelected(p)}
                />
              </motion.div>
            ))}
        </AnimatePresence>
      </div>

      {hasHidden && (
        <div className="mt-12 flex flex-col items-center gap-4">
          <button
            type="button"
            onClick={() => setExpanded((v) => !v)}
            aria-expanded={expanded}
            className="group inline-flex items-center gap-2 h-12 px-6 rounded-full border border-[var(--color-text)] text-[var(--color-text)] text-[13px] font-medium uppercase tracking-[0.05em] transition-colors duration-300 hover:bg-[var(--color-text)] hover:text-[#FFFFFF]"
          >
            <span>{expanded ? t("showLess") : t("showMore")}</span>
            <motion.span
              animate={{ rotate: expanded ? 180 : 0 }}
              transition={{ duration: 0.3, ease: "easeOut" }}
              className="inline-flex"
            >
              <ChevronDown size={14} />
            </motion.span>
          </button>

          {!expanded && (
            <Link
              href="/work"
              className="inline-flex items-center gap-1.5 font-body text-[12px] text-[var(--color-text-muted)] hover:text-[var(--color-accent)] transition-colors"
            >
              {t("seeAll")}
              <ArrowRight size={11} />
            </Link>
          )}
        </div>
      )}

      <AnimatePresence>
        {selected && (
          <WorkModal project={selected} onClose={() => setSelected(null)} />
        )}
      </AnimatePresence>
    </section>
  );
}
