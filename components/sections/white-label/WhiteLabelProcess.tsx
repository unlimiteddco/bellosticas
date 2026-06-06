"use client";

import { motion } from "framer-motion";
import { useTranslations } from "next-intl";
import { EditorialLabel } from "@/components/ui/EditorialLabel";
import { MixedHeadline } from "@/components/ui/MixedHeadline";

const NS = "servicePages.whitelabel.process";

type Step = { n: string; title: string; description: string };

export function WhiteLabelProcess() {
  const t = useTranslations(NS);
  const steps = t.raw("steps") as Step[];

  return (
    <section
      id="process"
      className="relative z-10 max-w-[1280px] mx-auto px-6 lg:px-12 py-20 md:py-28 scroll-mt-24"
    >
      <div className="flex flex-col gap-6 mb-12 md:mb-16 max-w-[820px]">
        <EditorialLabel>{t("label")}</EditorialLabel>
        <MixedHeadline
          className="text-[36px] md:text-[52px] lg:text-[60px]"
          parts={[
            { text: t("title_part1") },
            { text: t("title_emphasis"), accent: true },
            { text: t("title_part2") },
          ]}
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 lg:gap-5">
        {steps.map((step, i) => (
          <motion.article
            key={step.n}
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.6, delay: i * 0.08, ease: [0.4, 0, 0.2, 1] }}
            whileHover={{ y: -4 }}
            className="group relative flex flex-col gap-5 rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] p-6 transition-colors duration-300 hover:border-[var(--color-accent)] hover:shadow-[0_24px_50px_-28px_rgba(29,29,27,0.28)]"
          >
            {/* Big editorial step number */}
            <div className="flex items-center justify-between">
              <span className="font-display italic text-[44px] leading-none text-[var(--color-accent)]">
                {step.n}
              </span>
              {/* Tiny progress ticks — fill up to the current step */}
              <span className="flex items-center gap-1" aria-hidden>
                {steps.map((_, j) => (
                  <span
                    key={j}
                    className={`block h-1 w-1 rounded-full ${
                      j <= i
                        ? "bg-[var(--color-accent)]"
                        : "bg-[var(--color-border)]"
                    }`}
                  />
                ))}
              </span>
            </div>

            <div className="flex flex-col gap-2">
              <h3 className="font-display text-[20px] md:text-[21px] leading-tight text-[var(--color-text)] transition-colors group-hover:text-[var(--color-accent)]">
                {step.title}
              </h3>
              <p className="font-body text-[14px] leading-[1.6] text-[var(--color-text-muted)]">
                {step.description}
              </p>
            </div>
          </motion.article>
        ))}
      </div>
    </section>
  );
}
