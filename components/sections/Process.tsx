import { useTranslations } from "next-intl";
import { EditorialLabel } from "@/components/ui/EditorialLabel";
import { MixedHeadline } from "@/components/ui/MixedHeadline";
import { ProcessCard } from "./ProcessCard";

export function Process() {
  const t = useTranslations("process");

  const days = [
    {
      day: 1 as const,
      tag: t("days.d1.tag"),
      title: t("days.d1.title"),
      description: t("days.d1.description"),
    },
    {
      day: 2 as const,
      tag: t("days.d2.tag"),
      title: t("days.d2.title"),
      description: t("days.d2.description"),
    },
    {
      day: 3 as const,
      tag: t("days.d3.tag"),
      title: t("days.d3.title"),
      description: t("days.d3.description"),
    },
  ];

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
        <p className="font-body text-[16px] lg:text-[18px] leading-[1.5] text-[var(--color-text-muted)] max-w-[540px]">
          {t("sub")}
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {days.map((d, i) => (
          <ProcessCard
            key={d.day}
            index={i}
            day={d.day}
            tag={d.tag}
            title={d.title}
            description={d.description}
          />
        ))}
      </div>
    </section>
  );
}
