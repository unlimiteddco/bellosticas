"use client";

import { useState } from "react";
import { AnimatePresence } from "framer-motion";
import { useTranslations } from "next-intl";
import { EditorialLabel } from "@/components/ui/EditorialLabel";
import { MixedHeadline } from "@/components/ui/MixedHeadline";
import { WorkCard } from "@/components/sections/WorkCard";
import { WorkModal } from "@/components/sections/WorkModal";
import type { ResolvedProject } from "@/lib/cms/types";

type Props = {
  namespace: string; // e.g. "servicePages.web.projects"
  /** All resolved projects (CMS or static), fetched by the server page. */
  projects: ResolvedProject[];
  /** Filter projects by stack keyword (case-insensitive). Empty = all. */
  stackFilter?: string;
  /** Max number to show. */
  limit?: number;
};

export function ServiceProjects({
  namespace,
  projects,
  stackFilter,
  limit = 4,
}: Props) {
  const t = useTranslations(namespace);
  const [selected, setSelected] = useState<ResolvedProject | null>(null);

  const filtered = stackFilter
    ? projects.filter((p) =>
        p.stack.some((s) =>
          s.toLowerCase().includes(stackFilter.toLowerCase()),
        ),
      )
    : projects;

  const shown = filtered.slice(0, limit);

  return (
    <section
      id="cases"
      className="relative z-10 max-w-[1280px] mx-auto px-6 lg:px-12 py-16 lg:py-24 scroll-mt-24"
    >
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
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
        {shown.map((p, i) => (
          <WorkCard
            key={p.slug}
            project={p}
            index={i}
            onClick={() => setSelected(p)}
          />
        ))}
      </div>

      <AnimatePresence>
        {selected && (
          <WorkModal project={selected} onClose={() => setSelected(null)} />
        )}
      </AnimatePresence>
    </section>
  );
}
