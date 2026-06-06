import { useTranslations } from "next-intl";
import { EditorialLabel } from "@/components/ui/EditorialLabel";
import { MixedHeadline } from "@/components/ui/MixedHeadline";
import { Reveal } from "@/components/ui/Reveal";
import { NumberCounter } from "./NumberCounter";

const keys = ["n1", "n2", "n3"] as const;

export function Numbers() {
  const t = useTranslations("numbers");

  return (
    <section className="relative bg-[var(--color-text)] overflow-hidden">
      <div className="relative z-10 max-w-[1280px] mx-auto px-6 lg:px-12 py-20 lg:py-28">
        {/* Header */}
        <Reveal className="flex flex-col gap-6 max-w-[760px] mb-14 lg:mb-20">
          <EditorialLabel className="text-[var(--color-bg)]/70">
            {t("label")}
          </EditorialLabel>
          <MixedHeadline
            dark
            className="text-[40px] md:text-[60px] lg:text-[68px]"
            parts={[
              { text: t("title_part1") },
              { text: t("title_emphasis"), accent: true },
              { text: t("title_part2") },
            ]}
          />
          <p className="font-body text-[16px] lg:text-[18px] leading-[1.55] text-[var(--color-bg)]/65 max-w-[560px]">
            {t("sub")}
          </p>
        </Reveal>

        {/* Stats — number + label + description, split by dividers */}
        <div className="grid grid-cols-1 md:grid-cols-3 border-t border-[var(--color-bg)]/15">
          {keys.map((k, i) => (
            <Reveal
              key={k}
              delay={i * 0.12}
              className={[
                "py-8 md:py-12",
                i > 0
                  ? "md:border-l md:border-[var(--color-bg)]/15 md:pl-10"
                  : "",
                i < keys.length - 1 ? "md:pr-10" : "",
                i < keys.length - 1
                  ? "border-b md:border-b-0 border-[var(--color-bg)]/10"
                  : "",
              ].join(" ")}
            >
              <NumberCounter
                value={t(`items.${k}.value`)}
                label={t(`items.${k}.label`)}
                description={t(`items.${k}.desc`)}
                dark
              />
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
