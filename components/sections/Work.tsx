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

/** Cuántos proyectos se ven al llegar, y cuántos añade cada «Ver más». */
const PASO = 4;

export function Work({ projects }: { projects: ResolvedProject[] }) {
  const t = useTranslations("work");
  const [selected, setSelected] = useState<ResolvedProject | null>(null);
  // De cuatro en cuatro: enseñarlos todos de golpe convertía la home en la
  // página de Trabajos. Cuando ya no quedan, el botón recoge la lista.
  const [mostrados, setMostrados] = useState(PASO);

  const visible = projects.slice(0, PASO);
  const extra = projects.slice(PASO, mostrados);
  const hayMas = mostrados < projects.length;
  const desplegado = mostrados > PASO;

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
          {extra.map((p, i) => (
            <motion.div
              key={p.slug}
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 24 }}
              transition={{
                duration: 0.5,
                // El escalonado se cuenta dentro de cada tanda de cuatro.
                delay: (i % PASO) * 0.08,
                ease: [0.4, 0, 0.2, 1],
              }}
            >
              <WorkCard project={p} index={PASO + i} onClick={() => setSelected(p)} />
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {projects.length > PASO && (
        <div className="mt-12 flex flex-col items-center gap-4">
          <button
            type="button"
            onClick={() => setMostrados(hayMas ? mostrados + PASO : PASO)}
            aria-expanded={desplegado}
            className="group inline-flex items-center gap-2 h-12 px-6 rounded-full border border-[var(--color-text)] text-[var(--color-text)] text-[13px] font-medium uppercase tracking-[0.05em] transition-colors duration-300 hover:bg-[var(--color-text)] hover:text-[#FFFFFF]"
          >
            <span>{hayMas ? t("showMore") : t("showLess")}</span>
            <motion.span
              animate={{ rotate: hayMas ? 0 : 180 }}
              transition={{ duration: 0.3, ease: "easeOut" }}
              className="inline-flex"
            >
              <ChevronDown size={14} />
            </motion.span>
          </button>

          <Link
            href="/work"
            className="inline-flex items-center gap-1.5 font-body text-[12px] text-[var(--color-text-muted)] hover:text-[var(--color-accent)] transition-colors"
          >
            {t("seeAll")}
            <ArrowRight size={11} />
          </Link>
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
