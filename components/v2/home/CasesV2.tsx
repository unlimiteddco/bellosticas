import { ArrowRight, ArrowUpRight } from "lucide-react";
import { getTranslations } from "next-intl/server";
import { Link } from "@/navigation";
import type { ResolvedProject } from "@/lib/cms/types";
import { sinBarras } from "@/lib/v2/texto";

/**
 * Casos en filas con borde: texto a un lado (cliente, categoría, año,
 * descripción) y la portada al otro. En escritorio se alternan (el segundo
 * lleva la portada a la izquierda) para que las filas no parezcan calcadas.
 * Salen del gestor de contenidos: los proyectos con portada, en el orden que
 * tengan allí.
 */
export async function CasesV2({ locale, proyectos }: { locale: string; proyectos: ResolvedProject[] }) {
  const t = await getTranslations({ locale, namespace: "work" });
  const tv = await getTranslations({ locale, namespace: "v2" });
  const casos = proyectos.filter((p) => p.cover && !p.comingSoon).slice(0, 3);
  if (!casos.length) return null;

  return (
    <section className="v2-frame">
      <div className="v2-rail">
        <span aria-hidden data-draw className="pointer-events-none absolute left-0 right-0 top-0 h-px bg-[var(--v2-line)]" />
        <div className="flex flex-col items-center gap-5 px-6 py-20 text-center lg:py-24">
          <span className="v2-label" data-reveal>
            {sinBarras(t("label"))}
          </span>
          <h2 className="v2-h2" data-reveal>
            {t("title_part1")}
            <em className="font-display italic font-semibold text-[var(--v2-accent)]">{t("title_emphasis")}</em>
            {t("title_part2")}
          </h2>
        </div>

        <div className="flex flex-col gap-0 border-t border-[var(--v2-line)]">
          {casos.map((p, i) => (
            <Link
              key={p.slug}
              href={{ pathname: "/v2/work/[slug]", params: { slug: p.slug } }}
              className="group grid grid-cols-1 border-b border-[var(--v2-line)] lg:grid-cols-12"
              data-reveal
            >
              <div className="flex flex-col gap-5 p-6 md:p-10 lg:col-span-5">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="text-[14px] font-medium">{p.client || p.name}</span>
                    {p.category
                      .split("·")
                      .map((c) => c.trim())
                      .filter(Boolean)
                      .map((c) => (
                        <span key={c} className="rounded-[4px] bg-[var(--v2-hover)] px-2 py-0.5 text-[12px] text-[var(--v2-muted)]">
                          {c}
                        </span>
                      ))}
                  </div>
                  {p.year ? <span className="v2-label">{p.year}</span> : null}
                </div>
                <h3 className="text-[22px] font-medium leading-[1.2] tracking-[-0.01em] md:text-[26px]">{p.name}</h3>
                {p.description && <p className="text-[15px] leading-[1.6] text-[var(--v2-muted)] line-clamp-4">{p.description}</p>}
                <span className="v2-link mt-auto self-start">
                  {tv("readCase")} <ArrowUpRight size={14} className="text-[var(--v2-accent)] transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
                </span>
              </div>
              <div
                className={`relative aspect-[16/10] overflow-hidden border-t border-[var(--v2-line)] lg:col-span-7 lg:aspect-auto lg:min-h-[420px] lg:border-t-0 ${
                  i % 2 ? "lg:order-first lg:border-r" : "lg:border-l"
                }`}
                style={{ backgroundColor: p.color }}
              >
                <img
                  src={p.cover}
                  alt=""
                  loading="lazy"
                  className="absolute inset-0 h-full w-full object-cover transition-transform duration-[900ms] ease-[var(--v2-ease)] group-hover:scale-[1.03]"
                />
              </div>
            </Link>
          ))}
        </div>

        <div className="flex justify-center px-6 py-10">
          <Link href="/v2/work" className="v2-btn v2-btn--ghost">
            {t("seeAll")} <ArrowRight size={14} />
          </Link>
        </div>
      </div>
    </section>
  );
}
