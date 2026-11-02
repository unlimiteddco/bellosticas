"use client";

import { useLocale, useTranslations } from "next-intl";
import { useMonedaPropuesta, useProposalExtras } from "./ProposalExtrasContext";
import { eur } from "@/lib/eur";

/**
 * La cifra, a tamaño de titular.
 *
 * Una tabla comunica "aquí tienes el desglose"; un número enorme comunica
 * "esto es lo que cuesta, y no me tiembla el pulso al decirlo". A la derecha,
 * lo que se lleva por ese dinero — para que la cifra nunca se lea sola.
 *
 * Es cliente porque se mueve con los añadidos que marque.
 */
export function ProposalPrice({
  baseSum,
  taxRate,
  entregables,
}: {
  baseSum: number;
  taxRate: number;
  entregables: string[];
}) {
  const ctx = useProposalExtras();
  const moneda = useMonedaPropuesta();
  const t = useTranslations("proposalPage");
  const locale = useLocale();

  const base = baseSum + (ctx?.extrasBase ?? 0);
  const iva = base * taxRate;
  const sinIva = taxRate === 0;

  return (
    <div className="rounded-2xl bg-[var(--color-text)] text-[var(--color-bg)] p-7 md:p-10">
      <div className="grid gap-10 lg:grid-cols-[1fr_1fr] lg:gap-14">
        <div>
          {/* Sin etiqueta propia: la sección ya se titula "Inversión" justo
              encima y repetirlo es ruido. */}
          <p className="font-display text-[40px] md:text-[52px] leading-[1] tracking-[-0.02em] tabular-nums">
            {eur(base, locale, false, moneda)}
          </p>
          <p className="mt-2 font-body text-[14px] text-[var(--color-bg)]/65">
            {t(sinIva ? "price_base_note_novat" : "price_base_note")}
          </p>
          <p className="mt-5 font-body text-[13px] leading-[1.65] text-[var(--color-bg)]/55 max-w-[380px]">
            {t("price_closed")}
          </p>
          <p className="mt-4 font-body text-[13px] text-[var(--color-bg)]/45 tabular-nums">
            {sinIva
              ? t("total_novat_note")
              : t("total_vat_note", { iva: eur(iva, locale, false, moneda), total: eur(base + iva, locale, false, moneda) })}
          </p>
        </div>

        {entregables.length > 0 && (
          <div>
            <span
              className="block font-body uppercase text-[10px] text-[var(--color-bg)]/45 pb-4 border-b border-[var(--color-bg)]/20"
              style={{ letterSpacing: "0.22em" }}
            >
              {t("price_you_get")}
            </span>
            <ul>
              {entregables.map((e, i) => (
                <li
                  key={i}
                  className="py-3.5 border-b border-[var(--color-bg)]/12 font-body text-[15px] leading-[1.45] text-[var(--color-bg)]/90"
                >
                  {e}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}
