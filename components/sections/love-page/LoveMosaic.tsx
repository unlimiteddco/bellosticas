"use client";

import { motion } from "framer-motion";
import { useTranslations } from "next-intl";
import { EditorialLabel } from "@/components/ui/EditorialLabel";
import { MixedHeadline } from "@/components/ui/MixedHeadline";
import { InitialsAvatar } from "@/components/ui/InitialsAvatar";

const NS = "lovePage.mosaic";
const KEYS = ["t1", "t2", "t3", "t4", "t5", "t6", "t7", "t8"] as const;

// Masonry — sizes per index. Mix tall and standard cards.
const SIZES: Array<{ col: string; tall?: boolean }> = [
  { col: "md:col-span-2", tall: true }, // t1 — Javier (largo)
  { col: "md:col-span-2" }, // t2
  { col: "md:col-span-2" }, // t3
  { col: "md:col-span-2", tall: true }, // t4 — Diego (largo)
  { col: "md:col-span-2", tall: true }, // t5 — Carlos (largo)
  { col: "md:col-span-2" }, // t6 — Diego Plana corto
  { col: "md:col-span-2", tall: true }, // t7 — Pablo (largo)
  { col: "md:col-span-2" }, // t8 — Sofía corto
];

export function LoveMosaic() {
  const t = useTranslations(NS);
  const preposition = t("rolePreposition");

  return (
    <section className="relative z-10 max-w-[1280px] mx-auto px-6 lg:px-12 py-16 lg:py-24">
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

      <div className="grid grid-cols-1 md:grid-cols-6 gap-5 lg:gap-6">
        {KEYS.map((k, i) => {
          const name = t(`items.${k}.name`);
          const role = t(`items.${k}.role`);
          const company = t(`items.${k}.company`);
          const quote = t(`items.${k}.quote`);
          const layout = SIZES[i] ?? SIZES[0];

          return (
            <motion.article
              key={k}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{
                duration: 0.6,
                delay: i * 0.05,
                ease: "easeOut",
              }}
              whileHover={{ y: -2 }}
              className={`relative ${layout.col} flex flex-col gap-5 rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] p-6 md:p-7 transition-shadow duration-300 hover:shadow-[0_12px_30px_-15px_rgba(29,29,27,0.18)]`}
            >
              {/* Decorative quote mark */}
              <span
                className="absolute top-4 right-5 font-display italic font-semibold text-[40px] leading-none text-[var(--color-accent)]/35 pointer-events-none select-none"
                aria-hidden
              >
                ”
              </span>

              <p
                className={`font-display italic text-[var(--color-text)] leading-[1.45] ${
                  layout.tall ? "text-[18px] md:text-[20px]" : "text-[17px]"
                }`}
              >
                “{quote}”
              </p>

              <div className="flex items-center gap-3 mt-auto">
                <InitialsAvatar name={name} size={40} />
                <div className="flex flex-col leading-tight min-w-0">
                  <span className="font-body text-[14px] font-semibold text-[var(--color-text)]">
                    {name}
                  </span>
                  <span className="font-body text-[12px] text-[var(--color-text-muted)] leading-tight truncate">
                    {role}{" "}
                    <span className="text-[var(--color-text-muted)]/70">
                      {preposition}
                    </span>{" "}
                    <span className="text-[var(--color-text)] font-medium">
                      {company}
                    </span>
                  </span>
                </div>
              </div>
            </motion.article>
          );
        })}
      </div>
    </section>
  );
}
