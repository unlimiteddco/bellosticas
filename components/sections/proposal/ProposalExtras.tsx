"use client";

import { Check } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import { useProposalExtras } from "./ProposalExtrasContext";

function eur(n: number, locale: string) {
  return new Intl.NumberFormat(locale === "en" ? "en-IE" : "es-ES", {
    style: "currency",
    currency: "EUR",
    minimumFractionDigits: Number.isInteger(n) ? 0 : 2,
    maximumFractionDigits: 2,
  }).format(Number.isFinite(n) ? n : 0);
}

/**
 * Añadidos opcionales. No son planes a elegir: el alcance de arriba ya resuelve
 * su problema, y esto son piezas que puede sumar. Uno va marcado como
 * recomendado, porque sin una recomendación la gente no decide.
 */
export function ProposalExtras() {
  const ctx = useProposalExtras();
  const t = useTranslations("proposalPage");
  const locale = useLocale();
  if (!ctx || ctx.extras.length === 0) return null;

  return (
    <div className="mt-10">
      <p
        className="font-body uppercase text-[11px] text-[var(--color-text-muted)]"
        style={{ letterSpacing: "0.18em" }}
      >
        {t("extras_label")}
      </p>
      <p className="mt-2 font-body text-[15px] leading-[1.55] text-[var(--color-text-muted)] max-w-[620px]">
        {t("extras_intro")}
      </p>

      <div className="mt-5 grid gap-3 sm:grid-cols-2">
        {ctx.extras.map((e) => {
          const on = ctx.seleccion.includes(e.id);
          return (
            <button
              key={e.id}
              type="button"
              role="checkbox"
              aria-checked={on}
              onClick={() => ctx.alternar(e.id)}
              className={`group text-left rounded-2xl border p-5 transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-accent)] ${
                on
                  ? "border-[var(--color-accent)] bg-[var(--color-accent)]/[0.04]"
                  : "border-[var(--color-border)] hover:border-[var(--color-text)]/30"
              }`}
            >
              <span className="flex items-start gap-3">
                <span
                  aria-hidden
                  className={`mt-0.5 shrink-0 grid place-items-center h-5 w-5 rounded-md border transition-colors ${
                    on
                      ? "border-[var(--color-accent)] bg-[var(--color-accent)] text-white"
                      : "border-[var(--color-text)]/25"
                  }`}
                >
                  {on && <Check size={13} strokeWidth={3} />}
                </span>
                <span className="min-w-0 flex-1">
                  <span className="flex flex-wrap items-baseline gap-x-2 gap-y-1">
                    <span className="font-body text-[16px] text-[var(--color-text)]">
                      {e.label}
                    </span>
                    {e.recommended && (
                      <span
                        className="font-body uppercase text-[10px] text-[var(--color-accent)]"
                        style={{ letterSpacing: "0.14em" }}
                      >
                        {t("extras_recommended")}
                      </span>
                    )}
                  </span>
                  {e.description && (
                    <span className="block font-body text-[13px] leading-[1.5] text-[var(--color-text-muted)] mt-1.5">
                      {e.description}
                    </span>
                  )}
                  <span className="block font-body text-[15px] text-[var(--color-text)] tabular-nums mt-2.5">
                    + {eur(Number(e.price) || 0, locale)}
                  </span>
                </span>
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
