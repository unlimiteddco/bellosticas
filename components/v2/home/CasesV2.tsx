import { ArrowRight, ArrowUpRight } from "lucide-react";
import { getTranslations } from "next-intl/server";
import { Link } from "@/navigation";
import type { ResolvedProject } from "@/lib/cms/types";
import { sinBarras } from "@/lib/v2/texto";
import { PORTADA_MOVIL } from "@/lib/v2/videos-casos";
import { TESTIMONIO_CASO } from "@/lib/v2/testimonios-casos";

type Cita = { quote: string; name: string; role: string; company: string; cara?: string };

/**
 * Casos en tarjetas sueltas, con aire entre ellas: a un lado el cliente con
 * sus etiquetas y el año, el titular del caso, la descripción, «Ver el caso»
 * y, si el cliente lo dijo, su cita; al otro, la portada a toda la altura.
 * En escritorio se alternan (la segunda lleva la portada a la izquierda).
 * Salen del gestor de contenidos: los proyectos con portada, en el orden que
 * tengan allí. El titular y la intro, de messages → v2Casos.casos.[slug].
 */
export async function CasesV2({ locale, proyectos }: { locale: string; proyectos: ResolvedProject[] }) {
  const t = await getTranslations({ locale, namespace: "work" });
  const tv = await getTranslations({ locale, namespace: "v2" });
  const tc = await getTranslations({ locale, namespace: "v2Casos" });
  const casos = proyectos.filter((p) => p.cover && !p.comingSoon).slice(0, 3);
  if (!casos.length) return null;

  // El titular y la intro propios del caso, y lo que dijo el cliente.
  const datos = await Promise.all(
    casos.map(async (p) => {
      const extra = tc.has(`casos.${p.slug}`) ? (tc.raw(`casos.${p.slug}`) as { titular?: string; intro?: string }) : {};
      let cita: Cita | null = null;
      const ref = TESTIMONIO_CASO[p.slug];
      if (ref) {
        const tt = await getTranslations({ locale, namespace: ref.ns });
        if (tt.has(`${ref.clave}.quote`)) {
          cita = {
            quote: tt(`${ref.clave}.quote`),
            name: tt(`${ref.clave}.name`),
            role: tt(`${ref.clave}.role`),
            company: tt(`${ref.clave}.company`),
            cara: ref.cara,
          };
        }
      }
      return { p, titular: extra.titular ?? p.name, texto: extra.intro ?? p.description, cita };
    }),
  );

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

        <div className="flex flex-col gap-10 px-4 md:gap-16 md:px-8 lg:gap-24">
          {datos.map(({ p, titular, texto, cita }, i) => {
            const etiquetas = p.category
              .split("·")
              .map((c) => c.trim())
              .filter((c) => c && c !== (p.client || p.name));
            return (
              <Link
                key={p.slug}
                href={{ pathname: "/work/[slug]", params: { slug: p.slug } }}
                className="group grid grid-cols-1 overflow-hidden rounded-[6px] border border-[var(--v2-line)] bg-[var(--v2-bg)] lg:grid-cols-12"
                data-reveal
              >
                <div className="flex flex-col gap-6 p-6 md:p-10 lg:col-span-5 lg:py-12">
                  <div className="flex flex-wrap items-center justify-between gap-x-4 gap-y-3">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="mr-1 text-[15px] font-semibold tracking-[-0.01em]">{p.client || p.name}</span>
                      {etiquetas.map((c, k) => (
                        <span
                          key={c}
                          className={`rounded-[4px] px-2 py-0.5 text-[12.5px] ${
                            k === 0 ? "text-[var(--v2-accent)]" : "bg-[var(--v2-hover)] text-[var(--v2-muted)]"
                          }`}
                          style={k === 0 ? { backgroundColor: "color-mix(in srgb, var(--v2-accent) 9%, transparent)" } : undefined}
                        >
                          {c}
                        </span>
                      ))}
                    </div>
                    {p.year ? <span className="v2-label">{p.year}</span> : null}
                  </div>
                  <h3 className="text-[24px] font-semibold leading-[1.18] tracking-[-0.025em] md:text-[30px]">{titular}</h3>
                  {texto && <p className="line-clamp-4 text-[16px] leading-[1.6] text-[var(--v2-muted)]">{texto}</p>}
                  <span className="v2-link self-start">
                    {tv("readCase")}{" "}
                    <ArrowUpRight
                      size={14}
                      className="text-[var(--v2-accent)] transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                    />
                  </span>
                  {cita && (
                    <figure className="mt-auto flex flex-col gap-5 rounded-[6px] bg-[var(--v2-bg-2)] p-5 md:p-6">
                      <blockquote className="line-clamp-4 text-[15.5px] leading-[1.55]">“{cita.quote}”</blockquote>
                      <figcaption className="flex items-center gap-3">
                        {cita.cara ? (
                          <img src={cita.cara} alt="" width={44} height={44} loading="lazy" className="h-11 w-11 rounded-full object-cover" />
                        ) : (
                          <span aria-hidden className="flex h-11 w-11 items-center justify-center rounded-full bg-[var(--v2-hover)] text-[15px] font-medium">
                            {cita.name.charAt(0)}
                          </span>
                        )}
                        <span className="flex flex-col">
                          <span className="text-[15px] font-medium">{cita.name}</span>
                          <span className="text-[13.5px] text-[var(--v2-muted)]">
                            {cita.role} · {cita.company}
                          </span>
                        </span>
                      </figcaption>
                    </figure>
                  )}
                </div>
                <div
                  className={`relative aspect-[16/11] overflow-hidden border-t border-[var(--v2-line)] lg:col-span-7 lg:aspect-auto lg:min-h-[560px] lg:border-t-0 ${
                    i % 2 ? "lg:order-first lg:border-r" : "lg:border-l"
                  }`}
                  style={{ backgroundColor: p.color }}
                >
                  {/* En el móvil, la portada pensada para él si la tiene (el
                      vestuario: sus tres pantallas de móvil). */}
                  <picture>
                    {PORTADA_MOVIL[p.slug] && <source media="(max-width: 1023px)" srcSet={PORTADA_MOVIL[p.slug]} />}
                    <img
                      src={p.cover}
                      alt=""
                      loading="lazy"
                      className="absolute inset-0 h-full w-full object-cover transition-transform duration-[900ms] ease-[var(--v2-ease)] group-hover:scale-[1.03]"
                    />
                  </picture>
                </div>
              </Link>
            );
          })}
        </div>

        <div className="flex justify-center px-6 pb-20 pt-12 md:pt-16">
          <Link href="/work" className="v2-btn v2-btn--ghost">
            {t("seeAll")} <ArrowRight size={14} />
          </Link>
        </div>
      </div>
    </section>
  );
}
