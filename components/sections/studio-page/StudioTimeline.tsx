"use client";

import { motion } from "framer-motion";
import { useTranslations } from "next-intl";
import { EditorialLabel } from "@/components/ui/EditorialLabel";
import { MixedHeadline } from "@/components/ui/MixedHeadline";
import { StudioPhoto } from "./StudioPhoto";

type Milestone = {
  year: string;
  title: string;
  body: string;
  photoLabel: string;
};

const NS = "studioPage.timeline";

export function StudioTimeline() {
  const t = useTranslations(NS);
  const milestones = t.raw("milestones") as Milestone[];

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
      </div>

      <div className="relative flex flex-col gap-14 md:gap-20">
        {/* Vertical guide line */}
        <div
          className="hidden md:block absolute left-1/2 top-2 bottom-2 w-px -translate-x-1/2"
          style={{
            background:
              "linear-gradient(to bottom, transparent 0%, var(--color-border) 8%, var(--color-border) 92%, transparent 100%)",
          }}
          aria-hidden
        />

        {milestones.map((m, i) => {
          const isRight = i % 2 === 1;
          return (
            <motion.article
              key={m.year}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.7, delay: i * 0.05, ease: "easeOut" }}
              className={`relative grid grid-cols-1 md:grid-cols-12 gap-6 md:gap-10 items-center ${
                isRight ? "md:[direction:rtl]" : ""
              }`}
            >
              {/* Text block */}
              <div
                className="md:col-span-6 flex flex-col gap-4"
                style={{ direction: "ltr" }}
              >
                <span className="font-display italic text-[var(--color-accent)] leading-none text-[64px] md:text-[88px] lg:text-[104px]">
                  {m.year}
                </span>
                <h3 className="font-display text-[24px] md:text-[28px] leading-tight text-[var(--color-text)]">
                  {m.title}
                </h3>
                <p className="font-body text-[15px] md:text-[16px] leading-[1.65] text-[var(--color-text-muted)] max-w-[440px]">
                  {m.body}
                </p>
              </div>

              {/* Photo */}
              <div
                className="md:col-span-5 md:col-start-8"
                style={{ direction: "ltr" }}
              >
                <div
                  className={`relative ${
                    isRight ? "md:ml-0 md:mr-auto" : "md:ml-auto md:mr-0"
                  } max-w-[360px]`}
                >
                  <StudioPhoto
                    src={`/studio/timeline-${m.year}.jpg`}
                    alt={`${m.year} — ${m.title}`}
                    label={m.photoLabel}
                    aspect="4 / 3"
                    tone="warm"
                    objectPosition="top"
                  />
                </div>
              </div>

              {/* Center dot on the timeline line */}
              <span
                aria-hidden
                className="hidden md:block absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-3 h-3 rounded-full bg-[var(--color-bg)] border-2 border-[var(--color-accent)] z-10"
              />
            </motion.article>
          );
        })}
      </div>
    </section>
  );
}
