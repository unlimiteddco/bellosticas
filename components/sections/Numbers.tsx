import { useTranslations } from "next-intl";
import { EditorialLabel } from "@/components/ui/EditorialLabel";
import { MixedHeadline } from "@/components/ui/MixedHeadline";
import { Reveal } from "@/components/ui/Reveal";
import { Dato } from "@/components/ui/Dato";

type Resultado = { metric: string; label: string; client: string; description: string };

/**
 * Resultados con nombre.
 *
 * Sustituye a las tres cifras sueltas («70+ proyectos», «17M+ impresiones»):
 * un número sin cliente al lado no lo puede comprobar nadie, y a un cliente
 * exigente le resta más que le suma. Aquí cada cifra lleva de quién es y qué
 * se hizo. Los datos son los de la página de Love (`lovePage.results.items`):
 * se cambian allí y cambian en los dos sitios.
 */
export function Numbers() {
  const t = useTranslations("numbers");
  const tr = useTranslations("lovePage.results");
  const items = tr.raw("items") as Resultado[];

  return (
    <section className="relative bg-[var(--color-text)] overflow-hidden">
      <div className="relative z-10 max-w-[1280px] mx-auto px-6 lg:px-12 py-20 lg:py-28">
        <Reveal className="flex flex-col gap-6 max-w-[760px] mb-14 lg:mb-20">
          <EditorialLabel className="text-[var(--color-bg)]/70">{t("label")}</EditorialLabel>
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

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
          {items.map((r, i) => (
            <Reveal
              key={r.client}
              delay={i * 0.08}
              className="flex flex-col gap-3 sm:gap-4 rounded-2xl border border-[var(--color-bg)]/12 bg-[var(--color-bg)]/[0.04] p-5 sm:p-7"
            >
              <Dato className="text-[var(--color-bg)]/55">{r.client}</Dato>
              <span className="font-display text-[40px] sm:text-[56px] lg:text-[64px] leading-none text-[var(--color-bg)]">{r.metric}</span>
              <span className="font-body text-[15px] sm:text-[17px] font-medium text-[var(--color-bg)]">{r.label}</span>
              <p className="font-body text-[13px] sm:text-[14.5px] leading-[1.55] text-[var(--color-bg)]/60">{r.description}</p>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
