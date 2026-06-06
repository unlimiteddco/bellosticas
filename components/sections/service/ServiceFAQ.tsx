"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { EditorialLabel } from "@/components/ui/EditorialLabel";
import { MixedHeadline } from "@/components/ui/MixedHeadline";
import { FAQItem } from "@/components/sections/FAQItem";

type Props = {
  namespace: string; // e.g. "servicePages.web.faq"
  questionKeys: string[]; // e.g. ["q1","q2","q3","q4","q5"]
};

export function ServiceFAQ({ namespace, questionKeys }: Props) {
  const t = useTranslations(namespace);
  const [open, setOpen] = useState<string | null>(questionKeys[0] ?? null);

  return (
    <section className="relative z-10 max-w-[1280px] mx-auto px-6 lg:px-12 py-16 lg:py-24">
      <div className="max-w-[880px] mx-auto">
        <div className="flex flex-col items-center text-center gap-6 mb-10">
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

        <div className="flex flex-col">
          {questionKeys.map((k) => (
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
