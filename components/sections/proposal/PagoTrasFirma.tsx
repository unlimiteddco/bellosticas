"use client";

import { Check, Landmark } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import { eur } from "@/lib/eur";
import { useMonedaPropuesta } from "./ProposalExtrasContext";

/** La factura del primer plazo, como la devuelve el CRM al firmar. */
export type FacturaTrasFirma = {
  number: string;
  total: number;
  netAmount: number;
  iban: string | null;
  installmentLabel?: string;
  installmentsCount?: number;
};

/** IBAN en grupos de cuatro: así se copia sin equivocarse. */
export function iban(v: string) {
  return v.replace(/\s+/g, "").replace(/(.{4})/g, "$1 ").trim();
}

/**
 * Lo que se ve al firmar el contrato: que ya está, y cómo pagar el primer
 * plazo. Lo usan el paso 3 de la propuesta y la página de firma suelta (la de
 * quien aceptó, cerró la pestaña y vuelve a firmar).
 */
export function PagoTrasFirma({
  factura,
  portalLoginUrl,
}: {
  factura?: FacturaTrasFirma | null;
  portalLoginUrl?: string;
}) {
  const t = useTranslations("proposalPage");
  const locale = useLocale();
  const moneda = useMonedaPropuesta();
  return (
    <>
      <span className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-[var(--color-accent)]/12">
        <Check size={22} className="text-[var(--color-accent)]" strokeWidth={2.5} />
      </span>
      <h3 className="mt-5 font-display text-[28px] md:text-[34px] leading-tight text-[var(--color-text)]">
        {t("done_title")}
      </h3>
      <p className="mt-2 font-body text-[16px] leading-[1.6] text-[var(--color-text)]/85 max-w-[540px]">
        {t("done_body")}
      </p>

      {factura && (
        <div className="mt-7 rounded-2xl border border-[var(--color-border)] p-6">
          <p className="font-body text-[15px] leading-[1.55] text-[var(--color-text)]">{t("done_payment_note")}</p>
          <div className="mt-5 grid gap-4 sm:grid-cols-3">
            <Dato label={t("success.invoice_label")} value={factura.number} />
            <Dato label={t("success.amount_label")} value={eur(factura.total, locale, true, moneda)} />
            {factura.iban && <Dato label={t("success.iban_label")} value={iban(factura.iban)} />}
          </div>
          <p className="mt-5 inline-flex items-start gap-2 font-body text-[13px] leading-[1.55] text-[var(--color-text-muted)]">
            <Landmark size={15} className="shrink-0 mt-0.5" /> {t("done_transfer_hint")}
          </p>
        </div>
      )}

      {portalLoginUrl && (
        <a
          href={portalLoginUrl}
          className="mt-7 inline-flex items-center gap-2 font-body text-[15px] text-[var(--color-text)] border-b border-[var(--color-accent)] pb-0.5"
        >
          {t("success.portal_title")}
        </a>
      )}
    </>
  );
}

export function Dato({
  label,
  value,
  sufijo,
  sub,
  destacado = false,
}: {
  label: string;
  value: string;
  /** «+ IVA»: va pegado a la cifra, pero en pequeño y apagado. */
  sufijo?: string;
  sub?: string;
  /** La cifra a la que tiene que ir el ojo: una por caja. */
  destacado?: boolean;
}) {
  return (
    <div>
      <span
        className="block font-body uppercase text-[10px] text-[var(--color-text-muted)]"
        style={{ letterSpacing: "0.16em" }}
      >
        {label}
      </span>
      <span
        className={`block mt-1 font-body tabular-nums ${
          destacado ? "text-[24px] leading-tight text-[var(--color-text)]" : "text-[16px] text-[var(--color-text)]"
        }`}
      >
        {value}
        {sufijo && (
          <span className="ml-1.5 font-body text-[13px] text-[var(--color-text-muted)] whitespace-nowrap">{sufijo}</span>
        )}
      </span>
      {sub && <span className="block mt-1 font-body text-[13px] leading-snug text-[var(--color-text-muted)]">{sub}</span>}
    </div>
  );
}
