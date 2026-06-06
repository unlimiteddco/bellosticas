"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { EditorialLabel } from "@/components/ui/EditorialLabel";
import { MixedHeadline } from "@/components/ui/MixedHeadline";
import { FAQItem } from "@/components/sections/FAQItem";

const NS = "servicePages.whitelabel.faq";
const KEYS = ["q1", "q2", "q3", "q4", "q5", "q6"] as const;

export function WhiteLabelFAQ() {
  const t = useTranslations(NS);
  const [open, setOpen] = useState<string | null>("q1");

  return (
    <section className="relative z-10 max-w-[1280px] mx-auto px-6 lg:px-12 py-20 md:py-28">
      <div className="max-w-[880px] mx-auto">
        <div className="flex flex-col items-center text-center gap-6 mb-10 md:mb-12">
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

        <div className="flex flex-col">
          {KEYS.map((k) => (
            <FAQItem
              key={k}
              question={t(`items.${k}.question`)}
              answer={t(`items.${k}.answer`)}
              open={open === k}
              onToggle={() => setOpen(open === k ? null : k)}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
