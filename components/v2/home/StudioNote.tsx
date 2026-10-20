import { getTranslations } from "next-intl/server";
import { Link } from "@/navigation";
import { sinBarras } from "@/lib/v2/texto";

/**
 * El estudio. Donde DesignMe enseña a su equipo, aquí va la verdad de un
 * estudio pequeño: hablas con Antonio. Textos de studio.* e introPage.host.
 */
export async function StudioNote({ locale }: { locale: string }) {
  const t = await getTranslations({ locale, namespace: "studio" });
  const ti = await getTranslations({ locale, namespace: "introPage" });
  const fuel = t.raw("fuel") as string[];

  return (
    <section className="v2-frame">
      <div className="v2-rail grid grid-cols-1 lg:grid-cols-12">
        <span aria-hidden data-draw className="pointer-events-none absolute left-0 right-0 top-0 h-px bg-[var(--v2-line)]" />
        <div className="relative min-h-[420px] overflow-hidden border-b border-[var(--v2-line)] lg:col-span-5 lg:border-b-0 lg:border-r" data-reveal="fade">
          {/* Trabajando en la mesa del estudio, no el retrato de estudio: a
              este tamaño la cara llenaba media sección. */}
          <img
            src="/images/estudio-trabajando.webp"
            alt={ti("host.name")}
            loading="lazy"
            className="absolute inset-0 h-full w-full object-cover"
            style={{ objectPosition: "30% 50%" }}
          />
          <span className="absolute bottom-0 left-0 right-0 flex items-center justify-between bg-gradient-to-t from-black/70 to-transparent px-6 pb-5 pt-16 text-white">
            <span className="text-[14px] font-medium">{ti("host.name")}</span>
            <span className="font-mono text-[10px] uppercase tracking-[0.14em] text-white/75">{ti("host.note")}</span>
          </span>
        </div>

        <div className="flex flex-col gap-7 p-6 md:p-10 lg:col-span-7 lg:p-14">
          <span className="v2-label" data-reveal>
            {sinBarras(t("label"))}
          </span>
          <h2 className="v2-h2" data-reveal>
            {t("title_part1")}
            <em className="font-display italic font-semibold text-[var(--v2-accent)]">{t("title_emphasis")}</em>
            {t("title_part2")}
          </h2>
          <p className="max-w-[560px] text-[17px] leading-[1.6]" data-reveal>
            {t("body")}
          </p>
          <div className="flex flex-col gap-3" data-reveal>
            <span className="v2-label">{sinBarras(t("fuelLabel"))}</span>
            <ul className="flex flex-wrap gap-2">
              {fuel.map((f) => (
                <li key={f} className="border border-[var(--v2-line)] px-3 py-1.5 text-[13px] text-[var(--v2-muted)]">
                  {f}
                </li>
              ))}
            </ul>
          </div>
          <div className="mt-auto flex flex-wrap items-center gap-3 border-t border-[var(--v2-line)] pt-6" data-reveal>
            <Link href="/studio" className="v2-btn v2-btn--ghost">
              {t("panelTag")}
            </Link>
            <span className="v2-label">{t("panelMeta")}</span>
          </div>
        </div>
      </div>
    </section>
  );
}
