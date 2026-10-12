import { useTranslations } from "next-intl";
import { EditorialLabel } from "@/components/ui/EditorialLabel";
import { MixedHeadline } from "@/components/ui/MixedHeadline";
import { Reveal } from "@/components/ui/Reveal";
import { ProcessV2Card } from "./ProcessV2Card";

export function ProcessV2() {
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
      <Reveal className="flex flex-col items-center gap-6 mb-12 lg:mb-20 text-center">
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

      {/* En el móvil van en fila y se deslizan con el dedo: apilados eran tres
          pantallas de scroll. El siguiente asoma por la derecha para que se
          vea que hay más. En escritorio, las tres columnas de siempre. */}
      <div className="flex lg:grid lg:grid-cols-3 gap-4 lg:gap-8 overflow-x-auto lg:overflow-visible snap-x snap-mandatory scroll-pl-6 -mx-6 px-6 lg:mx-0 lg:px-0 pb-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        {days.map((d, i) => (
          <div key={d.day} className="w-[72%] sm:w-[52%] lg:w-auto shrink-0 snap-start">
            <ProcessV2Card index={i} day={d.day} tag={d.tag} title={d.title} description={d.description} />
          </div>
        ))}
      </div>
      {/* Solo en el móvil: que quede dicho que hay más a la derecha. */}
      <p
        className="lg:hidden mt-5 flex items-center justify-center gap-2 font-mono uppercase text-[10.5px] text-[var(--color-text-muted)]"
        style={{ letterSpacing: "0.14em" }}
      >
        {t("swipe")} <span aria-hidden>→</span>
      </p>
    </section>
  );
}
