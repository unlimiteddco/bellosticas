"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { Link } from "@/navigation";
import { sonarClic, sonarHover } from "@/lib/v2/ui-sound";
import { sinBarras } from "@/lib/v2/texto";

const PREGUNTAS = ["q1", "q2", "q3", "q4", "q5", "q6"];

/**
 * FAQ: título y llamada a la izquierda, preguntas en acordeón con líneas a la
 * derecha. Por defecto las de la home («faq»); una página de servicio pasa su
 * propio espacio de textos con la misma forma (label, title_*, items.qN).
 */
export function FaqV2({ ns = "faq" }: { ns?: string }) {
  const t = useTranslations(ns);
  const tv = useTranslations("v2");
  const tn = useTranslations("nav");
  const [abierta, setAbierta] = useState<string | null>("q1");

  return (
    <section className="v2-frame">
      <div className="v2-rail grid grid-cols-1 lg:grid-cols-12">
        <span aria-hidden data-draw className="pointer-events-none absolute left-0 right-0 top-0 h-px bg-[var(--v2-line)]" />
        <div className="flex flex-col gap-5 border-b border-[var(--v2-line)] p-6 md:p-10 lg:col-span-5 lg:border-b-0 lg:border-r lg:p-14">
          <span className="v2-label" data-reveal>
            {sinBarras(t("label"))}
          </span>
          <h2 className="v2-h2" data-reveal>
            {/* La parte en cursiva, siempre en su propia línea: «Dudas sobre / tu web.» */}
            <span className="block">{t("title_part1").trim()}</span>
            <span className="block">
              <em className="font-display italic font-semibold text-[var(--v2-accent)]">{t("title_emphasis")}</em>
              {t("title_part2")}
            </span>
          </h2>
          <div className="mt-4 flex flex-col gap-3 lg:mt-auto" data-reveal>
            <p className="text-[15px] text-[var(--v2-muted)]">
              {tv("faqAsk")} {tv("faqAskSub")}
            </p>
            <Link href="/v2/intro" className="v2-btn v2-btn--primary self-start" onClick={() => sonarClic("select")}>
              {tn("cta")}
            </Link>
          </div>
        </div>

        <ul className="lg:col-span-7">
          {PREGUNTAS.map((k, i) => {
            const on = abierta === k;
            return (
              <li key={k} className="border-b border-[var(--v2-line)] last:border-b-0" data-reveal>
                <button
                  type="button"
                  aria-expanded={on}
                  onPointerEnter={(e) => e.pointerType === "mouse" && sonarHover(i)}
                  onClick={() => {
                    sonarClic(on ? "close" : "open", i);
                    setAbierta(on ? null : k);
                  }}
                  className="group flex w-full items-center justify-between gap-6 px-6 py-6 text-left md:px-10"
                >
                  <span className="text-[17px] font-medium md:text-[19px]">{t(`items.${k}.question`)}</span>
                  <span aria-hidden className={`relative h-4 w-4 shrink-0 transition-transform duration-500 ${on ? "rotate-45" : ""}`}>
                    <span className="absolute left-0 top-1/2 h-px w-full -translate-y-1/2 bg-[var(--v2-accent)]" />
                    <span className="absolute left-1/2 top-0 h-full w-px -translate-x-1/2 bg-[var(--v2-accent)]" />
                  </span>
                </button>
                <div className="grid transition-[grid-template-rows] duration-[380ms] ease-[var(--v2-ease)]" style={{ gridTemplateRows: on ? "1fr" : "0fr" }}>
                  <div className="overflow-hidden" inert={!on}>
                    <p
                      className={`max-w-[620px] px-6 pb-7 text-[15.5px] leading-[1.6] text-[var(--v2-muted)] transition-[opacity,transform] duration-500 md:px-10 ${
                        on ? "translate-y-0 opacity-100" : "translate-y-1.5 opacity-0"
                      }`}
                    >
                      {t(`items.${k}.answer`)}
                    </p>
                  </div>
                </div>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
