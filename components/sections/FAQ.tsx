"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { EditorialLabel } from "@/components/ui/EditorialLabel";
import { MixedHeadline } from "@/components/ui/MixedHeadline";
import { Reveal } from "@/components/ui/Reveal";
import { FAQItem } from "./FAQItem";
import { faqKeys } from "@/lib/faqs";

export function FAQ() {
  const t = useTranslations("faq");
  const [open, setOpen] = useState<string | null>("q1");

  return (
    <section className="relative z-10 max-w-[1280px] mx-auto px-6 lg:px-12 py-16 lg:py-24">
      <div className="max-w-[880px] mx-auto">
        <Reveal className="flex flex-col items-center text-center gap-6 mb-12">
          <EditorialLabel>{t("label")}</EditorialLabel>
          <MixedHeadline
            className="text-[40px] md:text-[56px]"
            parts={[
              { text: t("title_part1") },
              { text: t("title_emphasis"), accent: true },
              { text: t("title_part2") },
            ]}
          />
        </Reveal>

        <div className="flex flex-col">
          {faqKeys.map((k, i) => (
            <Reveal key={k} delay={i * 0.06} y={16}>
              <FAQItem
                question={t(`items.${k}.question`)}
                answer={t(`items.${k}.answer`)}
                open={open === k}
                onToggle={() => setOpen(open === k ? null : k)}
              />
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
