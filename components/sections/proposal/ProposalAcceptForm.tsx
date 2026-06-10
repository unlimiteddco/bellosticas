"use client";

import { AnimatePresence, motion } from "framer-motion";
import { Check, Loader2, Building2, Landmark, ArrowRight } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import { PrimaryButton } from "@/components/ui/PrimaryButton";

type Status = "idle" | "sending" | "sent" | "error";

type AcceptResponse = {
  ok: boolean;
  error?: string;
  invoice?: {
    number: string;
    total: number;
    netAmount: number;
    iban: string | null;
    /** Etiqueta real del plazo facturado ("Pago único", "Anticipo 50%"…). */
    installmentLabel?: string;
    /** Nº de plazos del plan — 1 = pago único. */
    installmentsCount?: number;
  } | null;
  portalLoginUrl?: string;
};

function formatEUR(amount: number, locale: string): string {
  return new Intl.NumberFormat(locale === "en" ? "en-IE" : "es-ES", {
    style: "currency",
    currency: "EUR",
  }).format(Number.isFinite(amount) ? amount : 0);
}

export function ProposalAcceptForm({ token }: { token: string }) {
  const t = useTranslations("proposalPage");
  const locale = useLocale();

  const [fiscalName, setFiscalName] = useState("");
  const [vatNumber, setVatNumber] = useState("");
  const [fiscalAddress, setFiscalAddress] = useState("");
  const [contactName, setContactName] = useState("");
  const [contactEmail, setContactEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [status, setStatus] = useState<Status>("idle");
  const [errorDetail, setErrorDetail] = useState<string | null>(null);
  const [result, setResult] = useState<AcceptResponse | null>(null);

  const honeypotRef = useRef<HTMLInputElement>(null);
  const mountedAt = useRef<number>(0);
  useEffect(() => {
    mountedAt.current = Date.now();
  }, []);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (status === "sending") return;

    // Anti-spam: honeypot + time-trap (igual que el formulario de contacto).
    const elapsed = mountedAt.current ? Date.now() - mountedAt.current : 0;
    if (honeypotRef.current?.value || elapsed < 2000) return;

    setStatus("sending");
    setErrorDetail(null);

    try {
      const res = await fetch(`/api/propuestas/${encodeURIComponent(token)}/accept`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          fiscal_name: fiscalName.trim(),
          vat_number: vatNumber.trim(),
          fiscal_address: fiscalAddress.trim(),
          contact_name: contactName.trim() || undefined,
          contact_email: contactEmail.trim() || undefined,
          phone: phone.trim() || undefined,
          payment_method: "transfer",
        }),
      });
      const data = (await res.json().catch(() => null)) as AcceptResponse | null;

      if (res.ok && data?.ok) {
        setResult(data);
        setStatus("sent");
      } else {
        setErrorDetail(data?.error ?? `HTTP ${res.status}`);
        setStatus("error");
      }
    } catch (err) {
      setErrorDetail(err instanceof Error ? err.message : "network");
      setStatus("error");
    }
  };

  /* ── Success ── */
  if (status === "sent") {
    const invoice = result?.invoice ?? null;
    return (
      <motion.div
        initial={{ opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface-2)] p-8 md:p-10"
      >
        <span className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-[var(--color-accent)]/12">
          <Check size={22} className="text-[var(--color-accent)]" strokeWidth={2.5} />
        </span>
        <h3 className="mt-5 font-display text-[28px] md:text-[34px] leading-tight text-[var(--color-text)]">
          {t("success.title")}
        </h3>
        <p className="mt-2 font-body text-[15px] leading-[1.55] text-[var(--color-text-muted)] max-w-[520px]">
          {t("success.body")}
        </p>

        {invoice ? (
          <div className="mt-7 space-y-6">
            <p className="font-body text-[14px] text-[var(--color-text)]">
              {(invoice.installmentsCount ?? 2) === 1
                ? t("success.reserve_note_single")
                : t("success.reserve_note")}
            </p>

            {/* Transferencia — el bloque protagonista */}
            <div className="rounded-2xl border border-[var(--color-accent)]/25 bg-[var(--color-bg)] p-6">
              <p className="font-body text-[13px] font-medium text-[var(--color-text)] flex items-center gap-2">
                <Landmark size={15} className="text-[var(--color-accent)]" />
                {t("success.transfer_title")}
              </p>

              <div className="mt-4 flex items-baseline justify-between gap-3 pb-4 border-b border-[var(--color-border)]">
                <span
                  className="font-body uppercase text-[10px] text-[var(--color-text-muted)]"
                  style={{ letterSpacing: "0.18em" }}
                >
                  {invoice.installmentLabel || t("success.amount_label")}
                </span>
                <span className="font-display text-[32px] text-[var(--color-text)] tabular-nums">
                  {formatEUR(invoice.total, locale)}
                </span>
              </div>

              <div className="mt-5 grid grid-cols-1 sm:grid-cols-2 gap-5">
                {invoice.iban && <DataBlock label={t("success.iban_label")} value={invoice.iban} mono />}
                <DataBlock
                  label={t("success.concept_label")}
                  value={invoice.number}
                  mono
                  note={t("success.concept_note")}
                />
              </div>
            </div>

            {/* Tu portal, ya en marcha */}
            <div className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-bg)] p-6">
              <p className="font-body text-[13px] font-medium text-[var(--color-text)]">
                {t("success.portal_title")}
              </p>
              <p className="mt-1 font-body text-[13px] leading-[1.55] text-[var(--color-text-muted)] max-w-[460px]">
                {t("success.portal_note")}
              </p>
              {result?.portalLoginUrl && (
                <a
                  href={result.portalLoginUrl}
                  className="mt-4 inline-flex items-center gap-2 rounded-full bg-[var(--color-text)] hover:bg-[var(--color-accent)] px-6 py-3 font-body text-[14px] font-medium text-white transition-colors"
                >
                  {t("success.portal_cta")}
                  <ArrowRight size={15} />
                </a>
              )}
            </div>
          </div>
        ) : (
          <p className="mt-6 font-body text-[14px] text-[var(--color-text-muted)]">
            {t("success.pending_note")}
          </p>
        )}
      </motion.div>
    );
  }

  /* ── Form ── */
  return (
    <form
      onSubmit={onSubmit}
      className="rounded-2xl border border-[var(--color-border)] p-7 md:p-9 flex flex-col gap-5"
    >
      {/* Honeypot */}
      <div aria-hidden className="absolute -left-[9999px] top-0 h-px w-px overflow-hidden">
        <label>
          Website
          <input ref={honeypotRef} type="text" name="website" tabIndex={-1} autoComplete="off" />
        </label>
      </div>

      <div className="flex items-center gap-2 text-[var(--color-text-muted)]">
        <Building2 size={15} />
        <span className="font-body uppercase text-[10px]" style={{ letterSpacing: "0.18em" }}>
          {t("fiscal.name")} · {t("fiscal.vat")}
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <Field label={t("fiscal.name")} value={fiscalName} onChange={setFiscalName} required autoComplete="organization" />
        <Field label={t("fiscal.vat")} value={vatNumber} onChange={setVatNumber} required />
      </div>
      <Field label={t("fiscal.address")} value={fiscalAddress} onChange={setFiscalAddress} required autoComplete="street-address" />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <Field label={t("fiscal.contactName")} value={contactName} onChange={setContactName} autoComplete="name" />
        <Field label={t("fiscal.contactEmail")} type="email" value={contactEmail} onChange={setContactEmail} autoComplete="email" />
      </div>
      <Field label={t("fiscal.phone")} type="tel" value={phone} onChange={setPhone} autoComplete="tel" />


      <p className="font-body text-[11px] leading-[1.5] text-[var(--color-text-muted)]/80">
        {t("consent")}
      </p>

      <div className="flex items-center gap-4 mt-1 flex-wrap">
        <PrimaryButton>
          {status === "sending" ? (
            <span className="inline-flex items-center gap-2">
              <Loader2 size={14} className="animate-spin" />
              {t("sending")}
            </span>
          ) : (
            t("cta")
          )}
        </PrimaryButton>

        <AnimatePresence>
          {status === "error" && (
            <motion.span
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              className="font-body text-[13px] text-[var(--color-accent)]"
            >
              {t("error")}
              {errorDetail && process.env.NODE_ENV === "development" && (
                <span className="font-mono text-[11px] opacity-60"> ({errorDetail})</span>
              )}
            </motion.span>
          )}
        </AnimatePresence>
      </div>
    </form>
  );
}

function DataBlock({
  label,
  value,
  mono,
  strong,
  note,
}: {
  label: string;
  value: string;
  mono?: boolean;
  strong?: boolean;
  note?: string;
}) {
  return (
    <div className="flex flex-col gap-1">
      <span className="font-body uppercase text-[10px] text-[var(--color-text-muted)]" style={{ letterSpacing: "0.18em" }}>
        {label}
      </span>
      <span
        className={`text-[var(--color-text)] ${mono ? "font-mono text-[14px]" : "font-body"} ${
          strong ? "text-[22px] font-semibold" : "text-[15px]"
        }`}
      >
        {value}
      </span>
      {note && <span className="font-body text-[11px] text-[var(--color-text-muted)]/80">{note}</span>}
    </div>
  );
}

function Field({
  label,
  value,
  onChange,
  type = "text",
  required,
  autoComplete,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  type?: string;
  required?: boolean;
  autoComplete?: string;
}) {
  return (
    <label className="group flex flex-col gap-1.5">
      <span
        className="font-body uppercase text-[10px] text-[var(--color-text-muted)] group-focus-within:text-[var(--color-accent)] transition-colors"
        style={{ letterSpacing: "0.18em" }}
      >
        {label}
        {required && <span className="text-[var(--color-accent)] ml-1">*</span>}
      </span>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        required={required}
        autoComplete={autoComplete}
        className="w-full h-11 px-3 rounded-md bg-transparent border border-[var(--color-border)] text-[15px] font-body text-[var(--color-text)] placeholder:text-[var(--color-text-muted)]/60 focus:border-[var(--color-text)] focus:outline-none transition-colors"
      />
    </label>
  );
}
