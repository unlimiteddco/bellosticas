"use client";

import { useLocale, useTranslations } from "next-intl";
import type { Installment } from "@/lib/proposals";

function eur(n: number, locale: string) {
  return new Intl.NumberFormat(locale === "en" ? "en-IE" : "es-ES", {
    style: "currency",
    currency: "EUR",
    minimumFractionDigits: Number.isInteger(n) ? 0 : 2,
    maximumFractionDigits: 2,
  }).format(Number.isFinite(n) ? n : 0);
}

/**
 * Plan de cobro en tarjetas.
 *
 * Una tabla de plazos parece un cuadro de amortización. Tres tarjetas con el
 * porcentaje en grande dicen otra cosa: el proyecto se paga a medida que se
 * entrega. El mismo dato, leído como reparto y no como deuda.
 *
 * El primer plazo va destacado: es el único que decide hoy.
 */
export function ProposalPaymentPlan({ installments }: { installments: Installment[] }) {
  const t = useTranslations("proposalPage");
  const locale = useLocale();
  if (installments.length === 0) return null;

  const total = installments.reduce((a, i) => a + (Number(i.amount) || 0), 0);
  const pct = (n: number) => (total > 0 ? Math.round((n / total) * 100) : 0);

  return (
    <div className={`grid gap-3 ${installments.length > 2 ? "sm:grid-cols-2 lg:grid-cols-3" : "sm:grid-cols-2"}`}>
      {installments.map((inst, i) => {
        const base = Number(inst.amount) || 0;
        // La etiqueta ya dice cuándo se paga; numerarla hace contar pagos.
        const label = inst.label.replace(/^\s*pago\s*\d+\s*[·:.-]\s*/i, "");
        const destacada = i === 0;
        return (
          <div
            key={inst.id ?? i}
            className={`rounded-2xl border p-6 ${
              destacada
                ? "bg-[var(--color-text)] text-[var(--color-bg)] border-[var(--color-text)]"
                : "border-[var(--color-border)]"
            }`}
          >
            <span
              className={`block font-display italic text-[38px] leading-none tabular-nums ${
                destacada ? "text-[var(--color-bg)]" : "text-[var(--color-text)]"
              }`}
            >
              {pct(base)}%
            </span>
            <p
              className={`mt-4 font-body text-[16px] tabular-nums ${
                destacada ? "text-[var(--color-bg)]" : "text-[var(--color-text)]"
              }`}
            >
              {eur(base, locale)} {t("plan_plus_vat")}
            </p>
            <p
              className={`mt-1.5 font-body text-[13px] leading-[1.5] ${
                destacada ? "text-[var(--color-bg)]/60" : "text-[var(--color-text-muted)]"
              }`}
            >
              {label}
            </p>
          </div>
        );
      })}
    </div>
  );
}
