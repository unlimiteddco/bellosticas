"use client";

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
 * Total del proyecto. Es cliente y no servidor porque tiene que moverse al
 * instante cuando marca un añadido: si el precio no cambia al pulsar, no se
 * entiende que lo esté sumando.
 */
export function ProposalTotalBar({
  baseSum,
  taxRate,
}: {
  baseSum: number;
  taxRate: number;
}) {
  const ctx = useProposalExtras();
  const t = useTranslations("proposalPage");
  const locale = useLocale();

  const base = baseSum + (ctx?.extrasBase ?? 0);
  const iva = base * taxRate;

  return (
    <div className="mt-4 flex flex-wrap items-center justify-between gap-3 rounded-xl bg-[var(--color-accent)] text-white px-5 py-4">
      <span className="font-body text-[14px] font-medium">{t("table_grand_total")}</span>
      <div className="flex flex-col items-end tabular-nums">
        <span className="font-display text-[26px] leading-none">{eur(base, locale)}</span>
        <span className="font-body text-[12px] text-white/75 mt-1">
          {t("total_vat_note", { iva: eur(iva, locale), total: eur(base + iva, locale) })}
        </span>
      </div>
    </div>
  );
}
