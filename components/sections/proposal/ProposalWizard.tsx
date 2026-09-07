"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Check, FileText, Landmark, Loader2 } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import { PrimaryButton } from "@/components/ui/PrimaryButton";
import type { ProposalPrefill } from "@/lib/proposals";
import { useProposalExtras } from "./ProposalExtrasContext";
import { SignaturePad } from "./SignaturePad";
import { ContractReader } from "./ContractReader";

type Paso = 1 | 2 | 3;

type AcceptResponse = {
  ok: boolean;
  error?: string;
  alreadyAccepted?: boolean;
  invoice?: {
    number: string;
    total: number;
    netAmount: number;
    iban: string | null;
    installmentLabel?: string;
    installmentsCount?: number;
  } | null;
  portalLoginUrl?: string;
};

function eur(n: number, locale: string) {
  return new Intl.NumberFormat(locale === "en" ? "en-IE" : "es-ES", {
    style: "currency",
    currency: "EUR",
  }).format(Number.isFinite(n) ? n : 0);
}

/**
 * Aceptar la propuesta en tres pasos: datos, firma y pago.
 *
 * Un único formulario largo con la firma dentro asusta; tres pasos cortos con
 * el recorrido a la vista se completan. Y la firma va en el momento en que
 * está más dispuesto a firmar — recién aceptado —, no tres días después en un
 * email que no abre.
 *
 * La firma es DocuSeal incrustado, no un garabato en un canvas: sello de
 * tiempo, IP y PDF firmado. Si no hay contrato configurado, el paso se salta
 * en vez de fingir una firma.
 */
export function ProposalWizard({
  token,
  prefill,
  totalBase,
  taxRate,
  firstInstallmentLabel,
}: {
  token: string;
  prefill?: ProposalPrefill | null;
  totalBase: number;
  taxRate: number;
  firstInstallmentLabel?: string | null;
}) {
  const t = useTranslations("proposalPage");
  const locale = useLocale();
  const extrasCtx = useProposalExtras();

  const [paso, setPaso] = useState<Paso>(1);
  const [enviando, setEnviando] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [resultado, setResultado] = useState<AcceptResponse | null>(null);
  const [firmado, setFirmado] = useState(false);
  const [rubrica, setRubrica] = useState<string | null>(null);
  const [firmanteNombre, setFirmanteNombre] = useState(prefill?.contactName ?? "");
  const [firmando, setFirmando] = useState(false);
  const [errorFirma, setErrorFirma] = useState<string | null>(null);
  const [contrato, setContrato] = useState<{
    title: string;
    date: string;
    clauses: { titulo: string; parrafos: string[] }[];
  } | null>(null);

  const [fiscalName, setFiscalName] = useState(prefill?.fiscalName ?? "");
  const [vatNumber, setVatNumber] = useState(prefill?.vatNumber ?? "");
  const [fiscalAddress, setFiscalAddress] = useState(prefill?.fiscalAddress ?? "");
  const [contactName, setContactName] = useState(prefill?.contactName ?? "");
  const [contactEmail, setContactEmail] = useState(prefill?.contactEmail ?? "");
  const [phone, setPhone] = useState(prefill?.phone ?? "");

  const honeypot = useRef<HTMLInputElement>(null);
  const montadoEn = useRef(0);
  useEffect(() => {
    montadoEn.current = Date.now();
  }, []);

  const base = totalBase + (extrasCtx?.extrasBase ?? 0);
  const conIva = base * (1 + taxRate);

  /* Paso 1 → aceptar y preparar el contrato. */
  const continuarAFirma = async (e: React.FormEvent) => {
    e.preventDefault();
    if (enviando) return;
    const transcurrido = montadoEn.current ? Date.now() - montadoEn.current : 0;
    if (honeypot.current?.value || transcurrido < 2000) return;

    setEnviando(true);
    setError(null);
    try {
      const res = await fetch(`/api/propuestas/${encodeURIComponent(token)}/accept`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          fiscal_name: fiscalName.trim(),
          vat_number: vatNumber.trim(),
          fiscal_address: fiscalAddress.trim(),
          contact_name: contactName.trim() || undefined,
          contact_email: contactEmail.trim(),
          phone: phone.trim() || undefined,
          payment_method: "transfer",
          extra_ids: extrasCtx?.seleccion ?? [],
        }),
      });
      const data = (await res.json().catch(() => null)) as AcceptResponse | null;
      if (!((res.ok && data?.ok) || data?.alreadyAccepted)) {
        setError(data?.error ?? `HTTP ${res.status}`);
        setEnviando(false);
        return;
      }
      setResultado(data);

      // La firma es siempre el paso siguiente: el contrato se genera aquí
      // mismo con lo que acaba de contratar.
      setPaso(2);
    } catch (err) {
      setError(err instanceof Error ? err.message : "network");
    } finally {
      setEnviando(false);
    }
  };

  // El contrato se pide al llegar al paso 2: sale del mismo sitio que el PDF.
  useEffect(() => {
    if (paso !== 2 || contrato) return;
    fetch(`/api/propuestas/${encodeURIComponent(token)}/contrato/texto`)
      .then((r) => r.json())
      .then((d) => {
        if (d?.available && Array.isArray(d.clauses)) setContrato(d);
      })
      .catch(() => {});
  }, [paso, contrato, token]);

  /**
   * Firma el contrato.
   *
   * La rúbrica viaja como PNG; la IP y el navegador los añade el servidor, no
   * el navegador: un dato que envía el propio firmante no prueba nada.
   */
  const firmar = async () => {
    if (!rubrica || firmando) return;
    setFirmando(true);
    setErrorFirma(null);
    try {
      const r = await fetch(`/api/propuestas/${encodeURIComponent(token)}/firmar`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ signature: rubrica, signer_name: firmanteNombre.trim() }),
      });
      const d = await r.json().catch(() => null);
      if (!r.ok || !d?.signed) {
        setErrorFirma(d?.error ?? t("wizard_sign_error"));
        return;
      }
      setFirmado(true);
      if (d.invoice) setResultado((x) => ({ ...(x ?? { ok: true }), invoice: d.invoice }));
      setPaso(3);
    } catch {
      setErrorFirma(t("wizard_sign_error"));
    } finally {
      setFirmando(false);
    }
  };

  const pasos = [
    { n: 1 as Paso, label: t("wizard_step_data") },
    { n: 2 as Paso, label: t("wizard_step_sign") },
    { n: 3 as Paso, label: t("wizard_step_pay") },
  ];

  return (
    <div id="aceptar-wizard">
      {/* Recorrido a la vista: saber cuánto queda es la mitad de terminarlo. */}
      <nav
        aria-label={t("wizard_nav")}
        className="flex flex-wrap items-center gap-3 pb-6 mb-8 border-b border-[var(--color-border)]"
      >
        {pasos.map((p, i) => {
          const hecho = paso > p.n;
          const activo = paso === p.n;
          return (
            <div key={p.n} className="flex items-center gap-3 flex-1 min-w-[92px]">
              <span
                className={`grid place-items-center h-[22px] w-[22px] shrink-0 rounded-full border text-[11px] tabular-nums ${
                  hecho || activo
                    ? "bg-[var(--color-text)] border-[var(--color-text)] text-[var(--color-bg)]"
                    : "border-[var(--color-border)] text-[var(--color-text-muted)]"
                }`}
              >
                {hecho ? <Check size={12} strokeWidth={3} /> : p.n}
              </span>
              <span
                className={`font-body uppercase text-[12px] ${
                  activo ? "text-[var(--color-text)]" : "text-[var(--color-text-muted)]"
                }`}
                style={{ letterSpacing: "0.1em" }}
              >
                {p.label}
              </span>
              {i < pasos.length - 1 && (
                <span className="hidden sm:block flex-1 h-px min-w-[12px] bg-[var(--color-border)]" />
              )}
            </div>
          );
        })}
      </nav>

      <AnimatePresence mode="wait">
        {paso === 1 && (
          <motion.form
            key="datos"
            onSubmit={continuarAFirma}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.28 }}
            className="flex flex-col gap-5"
          >
            <div>
              <h3 className="font-display text-[24px] md:text-[28px] leading-tight text-[var(--color-text)]">
                {prefill?.fiscalName ? t("wizard_data_title_known") : t("wizard_data_title")}
              </h3>
              <p className="mt-2 font-body text-[15px] leading-[1.55] text-[var(--color-text-muted)] max-w-[540px]">
                {t("wizard_data_sub")}
              </p>
            </div>

            <input
              ref={honeypot}
              type="text"
              name="website"
              tabIndex={-1}
              autoComplete="off"
              aria-hidden
              className="absolute left-[-9999px] w-px h-px opacity-0"
            />

            <div className="grid gap-4 md:grid-cols-2">
              <Campo label={t("fiscal.name")} value={fiscalName} onChange={setFiscalName} required />
              <Campo label={t("fiscal.vat")} value={vatNumber} onChange={setVatNumber} required />
            </div>
            <Campo label={t("fiscal.address")} value={fiscalAddress} onChange={setFiscalAddress} required />
            <div className="grid gap-4 md:grid-cols-2">
              <Campo label={t("fiscal.contactName")} value={contactName} onChange={setContactName} autoComplete="name" />
              <Campo label={t("fiscal.contactEmail")} type="email" value={contactEmail} onChange={setContactEmail} autoComplete="email" required />
            </div>
            <Campo label={t("fiscal.phone")} type="tel" value={phone} onChange={setPhone} autoComplete="tel" />

            {prefill?.contactEmail && (
              <p className="font-body text-[13px] text-[var(--color-text-muted)]">
                {t("prefill_note")}
              </p>
            )}

            {/* Qué contrata y qué paga, a la vista antes de comprometerse. */}
            <div className="mt-2 grid gap-4 sm:grid-cols-2 rounded-2xl border border-[var(--color-border)] p-5">
              <Dato label={t("wizard_total_vat")} value={eur(conIva, locale)} />
              <Dato
                label={t("wizard_first_payment")}
                value={firstInstallmentLabel ?? t("wizard_after_signing")}
              />
            </div>

            {error && (
              <p className="font-body text-[14px] text-[var(--color-accent)]">
                {t("error")} {error}
              </p>
            )}

            <div className="flex flex-wrap items-center gap-4">
              <PrimaryButton disabled={enviando} aria-busy={enviando}>
                {enviando ? (
                  <span className="inline-flex items-center gap-2">
                    <Loader2 size={15} className="animate-spin" /> {t("sending")}
                  </span>
                ) : (
                  t("wizard_cta_sign")
                )}
              </PrimaryButton>
              <span className="font-body text-[12px] text-[var(--color-text-muted)]">
                {t("consent")}
              </span>
            </div>
          </motion.form>
        )}

        {paso === 2 && (
          <motion.div
            key="firma"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.28 }}
          >
            <h3 className="font-display text-[24px] md:text-[28px] leading-tight text-[var(--color-text)]">
              {t("wizard_sign_title")}
            </h3>
            <p className="mt-2 font-body text-[15px] leading-[1.55] text-[var(--color-text-muted)] max-w-[560px]">
              {t("wizard_sign_sub")}
            </p>

            <div className="mt-6 rounded-2xl border border-[var(--color-border)] p-6 md:p-8">
              {contrato ? (
                <ContractReader
                  clausulas={contrato.clauses}
                  titulo={contrato.title}
                  fecha={contrato.date}
                  expandLabel={t("wizard_sign_expand")}
                  closeLabel={t("extras_close")}
                />
              ) : (
                <p className="font-body text-[14px] text-[var(--color-text-muted)]">
                  {t("sending")}
                </p>
              )}

              <a
                href={`/api/propuestas/${encodeURIComponent(token)}/contrato/pdf`}
                target="_blank"
                rel="noopener"
                className="mt-4 inline-flex items-center gap-2 font-body text-[13px] text-[var(--color-text-muted)] hover:text-[var(--color-text)] transition-colors"
              >
                <FileText size={14} />
                {t("wizard_sign_read")}
              </a>

              <p className="mt-6 font-body uppercase text-[10px] text-[var(--color-text-muted)]" style={{ letterSpacing: "0.2em" }}>
                {t("wizard_sign_your")}
              </p>
              <div className="mt-3">
                <SignaturePad
                  onChange={setRubrica}
                  clearLabel={t("wizard_sign_clear")}
                  hint={t("wizard_sign_hint")}
                  drawLabel={t("wizard_sign_draw")}
                  typeLabel={t("wizard_sign_type")}
                  typePlaceholder={t("wizard_sign_type_hint")}
                  typedName={firmanteNombre}
                />
              </div>

              <div className="mt-5 max-w-[380px]">
                <Campo
                  label={t("wizard_sign_name")}
                  value={firmanteNombre}
                  onChange={setFirmanteNombre}
                  required
                />
              </div>

              <p className="mt-5 font-body text-[12px] leading-[1.6] text-[var(--color-text-muted)] max-w-[560px]">
                {t("wizard_sign_evidence")}
              </p>

              {errorFirma && (
                <p className="mt-4 font-body text-[14px] text-[var(--color-accent)]">{errorFirma}</p>
              )}
            </div>

            <div className="mt-6 flex flex-wrap items-center gap-4">
              <PrimaryButton
                onClick={firmar}
                disabled={firmando || !rubrica || firmanteNombre.trim().length < 3}
                aria-busy={firmando}
              >
                {firmando ? (
                  <span className="inline-flex items-center gap-2">
                    <Loader2 size={15} className="animate-spin" /> {t("sending")}
                  </span>
                ) : (
                  t("wizard_cta_signnow")
                )}
              </PrimaryButton>
            </div>
          </motion.div>
        )}

        {paso === 3 && (
          <motion.div
            key="pago"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.28 }}
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

            {resultado?.invoice && (
              <div className="mt-7 rounded-2xl border border-[var(--color-border)] p-6">
                <p className="font-body text-[14px] text-[var(--color-text)]">
                  {(resultado.invoice.installmentsCount ?? 2) === 1
                    ? t("success.reserve_note_single")
                    : t("success.reserve_note")}
                </p>
                <div className="mt-5 grid gap-4 sm:grid-cols-3">
                  <Dato label={t("success.invoice_label")} value={resultado.invoice.number} />
                  <Dato label={t("success.amount_label")} value={eur(resultado.invoice.total, locale)} />
                  {resultado.invoice.iban && (
                    <Dato label={t("success.iban_label")} value={resultado.invoice.iban} />
                  )}
                </div>
                <p className="mt-5 inline-flex items-center gap-2 font-body text-[13px] text-[var(--color-text-muted)]">
                  <Landmark size={15} /> {t("plan_note")}
                </p>
              </div>
            )}

            {resultado?.portalLoginUrl && (
              <a
                href={resultado.portalLoginUrl}
                className="mt-7 inline-flex items-center gap-2 font-body text-[15px] text-[var(--color-text)] border-b border-[var(--color-accent)] pb-0.5"
              >
                {t("success.portal_title")}
              </a>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function Campo({
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
    <label className="flex flex-col gap-2">
      <span
        className="font-body uppercase text-[11px] text-[var(--color-text-muted)]"
        style={{ letterSpacing: "0.14em" }}
      >
        {label}
        {required && <span className="text-[var(--color-accent)]"> *</span>}
      </span>
      <input
        type={type}
        value={value}
        required={required}
        autoComplete={autoComplete}
        onChange={(e) => onChange(e.target.value)}
        /* 16px en móvil: por debajo, iOS hace zoom al enfocar. */
        className="w-full h-11 px-3 rounded-md bg-transparent border border-[var(--color-border)] text-[16px] sm:text-[15px] font-body text-[var(--color-text)] focus:border-[var(--color-text)] focus:outline-none transition-colors"
      />
    </label>
  );
}

function Dato({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <span
        className="block font-body uppercase text-[10px] text-[var(--color-text-muted)]"
        style={{ letterSpacing: "0.16em" }}
      >
        {label}
      </span>
      <span className="block mt-1 font-body text-[16px] text-[var(--color-text)] tabular-nums">
        {value}
      </span>
    </div>
  );
}
