import { useTranslations } from "next-intl";
import { EditorialLabel } from "@/components/ui/EditorialLabel";
import { MixedHeadline } from "@/components/ui/MixedHeadline";
import { Reveal } from "@/components/ui/Reveal";
import { ServiceCard } from "./ServiceCard";
import { services } from "@/lib/services";

export function Services() {
  const t = useTranslations("services");

  return (
    <section
      id="services"
      data-video-trigger
      className="relative z-10 max-w-[1280px] mx-auto px-6 lg:px-12 py-16 lg:py-24 scroll-mt-24"
    >
      <Reveal className="flex flex-col gap-6 mb-16 max-w-[820px]">
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
      </Reveal>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {services.map((s, i) => (
          <ServiceCard key={s.number} service={s} index={i} />
        ))}
      </div>
    </section>
  );
}
