"use client";

import { ArrowRight } from "lucide-react";
import { useTranslations } from "next-intl";
import { Link } from "@/navigation";
import { sonarClic } from "@/lib/v2/ui-sound";

/**
 * El cierre de cada página de la V2: claro, centrado y con mucho aire. El
 * mensaje es el del manifiesto (una marca que dure, no una web para salir del
 * paso), una frase y la llamada. Va justo antes del footer negro, y ese
 * contraste es lo que marca el final. Textos en messages → v2Cierre (los de la
 * V1, ctaFinal, no se tocan).
 */
export function ClosingBand() {
  const t = useTranslations("v2Cierre");
  return (
    <section className="v2-frame">
      <div className="v2-rail">
        <span aria-hidden data-draw className="pointer-events-none absolute left-0 right-0 top-0 h-px bg-[var(--v2-line)]" />
        <div className="flex flex-col items-center gap-7 px-6 py-24 text-center md:py-32 lg:py-40">
          <h2
            className="max-w-[900px] text-[clamp(36px,9vw,46px)] font-medium leading-[1.02] tracking-[-0.04em] sm:text-[56px] lg:text-[70px]"
            data-reveal
          >
            {t("title_part1")}
            {/* «que perdure.» siempre junto. */}
            <span className="whitespace-nowrap">
              <em className="font-display italic font-semibold text-[var(--v2-accent)]">{t("title_emphasis")}</em>
              {t("title_part2")}
            </span>
          </h2>
          <p className="max-w-[460px] text-[17px] leading-[1.55] text-[var(--v2-muted)]" data-reveal>
            {t("sub")}
          </p>
          <div className="mt-2 flex flex-col items-center gap-3 sm:flex-row" data-reveal>
            <Link href="/v2/intro" className="v2-btn v2-btn--primary" onClick={() => sonarClic("select")}>
              {t("cta")} <ArrowRight size={15} />
            </Link>
            <Link href="/v2/contact" className="v2-btn v2-btn--ghost">
              {t("ctaSecundario")}
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
