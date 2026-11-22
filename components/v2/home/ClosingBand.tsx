"use client";

import { ArrowRight } from "lucide-react";
import { useTranslations } from "next-intl";
import { Link } from "@/navigation";
import { sonarClic } from "@/lib/v2/ui-sound";
import { bookingQuarter, huecosLibres } from "@/lib/booking";
import { projects } from "@/lib/projects";

/**
 * El cierre de cada página de la V2, justo antes del footer. Una tarjeta clara
 * de línea fina, como el resto de la web (el footer negro que viene después es
 * el contraste que marca el final), y dentro lo que empuja a decidir:
 * el mensaje del manifiesto (una marca que dure), la llamada, los huecos que
 * quedan este trimestre y, abajo, una tira de casos que pasa sola como última
 * prueba. Textos en messages → v2Cierre (los de la
 * V1, ctaFinal, no se tocan).
 */

// Los casos con portada que ya se pueden enseñar.
const CASOS = projects.filter((p) => p.cover && !p.comingSoon);

export function ClosingBand() {
  const t = useTranslations("v2Cierre");
  const tv = useTranslations("v2");
  const trimestre = bookingQuarter().split(" ")[0];

  return (
    <section className="v2-frame">
      <div className="v2-rail">
        <span aria-hidden data-draw className="pointer-events-none absolute left-0 right-0 top-0 h-px bg-[var(--v2-line)]" />
        <div className="px-3 py-14 md:px-8 md:py-20">
          <div className="cierre-tarjeta">

            <div className="relative z-[1] flex flex-col items-center gap-7 px-6 pt-16 text-center md:pt-24">
              <h2
                className="max-w-[900px] text-[clamp(34px,8.5vw,44px)] font-medium leading-[1.04] tracking-[-0.04em] sm:text-[48px] lg:text-[56px]"
                data-reveal
              >
                {t("title_part1")}
                {/* «que perdure.» siempre junto. */}
                <span className="whitespace-nowrap">
                  <em className="font-display italic font-semibold text-[var(--cierre-acento)]">{t("title_emphasis")}</em>
                  {t("title_part2")}
                </span>
              </h2>
              <p className="max-w-[460px] text-[17px] leading-[1.55] text-[var(--cierre-tenue)]" data-reveal>
                {t("sub")}
              </p>

              <div className="mt-1 flex flex-col items-center gap-3 sm:flex-row" data-reveal>
                <Link href="/intro" className="v2-btn v2-btn--primary" onClick={() => sonarClic("select")}>
                  {t("cta")} <ArrowRight size={15} />
                </Link>
                <Link href="/contact" className="v2-btn v2-btn--ghost">
                  {t("ctaSecundario")}
                </Link>
              </div>

              <span className="flex items-center gap-2.5 font-mono text-[11px] uppercase tracking-[0.1em] text-[var(--cierre-tenue)]" data-reveal>
                <span className="booking-dot" aria-hidden />
                {tv("heroLabel", { q: trimestre, n: huecosLibres() })}
              </span>
            </div>

            {/* La tira de casos: pasa sola, se para al pasar el ratón. */}
            {CASOS.length > 0 && (
              <div className="cierre-tira relative z-[1] mt-14 md:mt-20" aria-label={t("casosLabel")}>
                <div className="cierre-tira-pista">
                  {[...CASOS, ...CASOS].map((p, i) => (
                    <Link
                      key={`${p.slug}-${i}`}
                      href={{ pathname: "/work/[slug]", params: { slug: p.slug } }}
                      className="cierre-caso"
                      aria-hidden={i >= CASOS.length ? true : undefined}
                      tabIndex={i >= CASOS.length ? -1 : undefined}
                    >
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={p.cover} alt={p.name} loading="lazy" draggable={false} />
                      <span className="cierre-caso-nombre">{p.name}</span>
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
