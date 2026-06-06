"use client";

import { AnimatePresence, motion } from "framer-motion";
import { Check, Loader2 } from "lucide-react";
import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import { EditorialLabel } from "@/components/ui/EditorialLabel";
import { MixedHeadline } from "@/components/ui/MixedHeadline";
import { PrimaryButton } from "@/components/ui/PrimaryButton";
import { submitForm, type Budget, type ServiceInterest } from "@/lib/web-form";

type Status = "idle" | "sending" | "sent" | "error";

/**
 * Service options exposed by the form. Keys match the CRM enum
 * (`ServiceInterest`) so we don't need a translation table.
 */
const SERVICE_KEYS: ServiceInterest[] = [
  "web_design",
  "ecommerce",
  "web_app",
  "automation",
  "migration",
  "white_label",
  "other",
];

const BUDGET_KEYS: Budget[] = [
  "under_3k",
  "3k_7k",
  "7k_15k",
  "15k_plus",
  "not_sure",
];

type Props = { hideHeader?: boolean };

export function ContactForm({ hideHeader = false }: Props) {
  const t = useTranslations("contact");
  const locale = useLocale() as "es" | "en";
  const budgetLabels = t.raw("budgetOptions") as Record<Budget, string>;

  const [services, setServices] = useState<Set<ServiceInterest>>(new Set());
  const [budget, setBudget] = useState<Budget | "">("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [company, setCompany] = useState("");
  const [message, setMessage] = useState("");
  const [status, setStatus] = useState<Status>("idle");
  const [errorDetail, setErrorDetail] = useState<string | null>(null);

  // Anti-spam: a hidden honeypot field that only bots fill in.
  const honeypotRef = useRef<HTMLInputElement>(null);

  // Capture page-load time for the time-trap (bots submit almost instantly).
  const mountedAt = useRef<number>(0);
  useEffect(() => {
    mountedAt.current = Date.now();
  }, []);

  const toggleService = (s: ServiceInterest) => {
    setServices((prev) => {
      const next = new Set(prev);
      if (next.has(s)) next.delete(s);
      else next.add(s);
      return next;
    });
  };

  const privacyHref = useMemo(
    () => (locale === "es" ? "/privacidad" : "/en/privacidad"),
    [locale],
  );

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (status === "sending") return;

    // --- Anti-spam guards ---
    // 1) Honeypot: real users never see/fill this field.
    // 2) Time-trap: a genuine person can't fill name + email + message in <2s.
    // On a hit we silently show "sent" without contacting the CRM so bots get
    // no signal that they were blocked.
    const elapsed = mountedAt.current ? Date.now() - mountedAt.current : 0;
    if (honeypotRef.current?.value || elapsed < 2000) {
      setStatus("sent");
      return;
    }

    setStatus("sending");
    setErrorDetail(null);

    // The CRM contract expects a single enum for `service_interest`. We keep
    // the multi-select UX (friendlier) and pass the FIRST selection as the
    // enum value, prepending the full list to the `message` so the admin
    // email keeps the complete picture.
    const selectedServices = Array.from(services);
    const primaryService: ServiceInterest | null = selectedServices[0] ?? null;
    const messageWithContext =
      selectedServices.length > 1
        ? `${t("services.label")}: ${selectedServices.join(", ")}\n\n${message}`
        : message;

    const time_on_page_ms = mountedAt.current
      ? Date.now() - mountedAt.current
      : undefined;

    const result = await submitForm({
      form_id: "contact_main",
      form_type: "contact",
      name,
      email,
      phone: phone || undefined,
      company: company || undefined,
      message: messageWithContext || undefined,
      service_interest: primaryService,
      budget: budget || null,
      locale,
      consent_marketing: false,
      time_on_page_ms,
    });

    if (result.ok) {
      setStatus("sent");
    } else {
      setErrorDetail(result.error);
      setStatus("error");
    }
  };

  return (
    <div className="relative flex flex-col gap-6">
      {!hideHeader && (
        <>
          <EditorialLabel>{t("label")}</EditorialLabel>
          <MixedHeadline
            className="text-[36px] md:text-[44px]"
            parts={[
              { text: t("title_part1") },
              { text: t("title_emphasis"), accent: true },
              { text: t("title_part2") },
            ]}
          />
          <p className="font-body text-[15px] leading-[1.55] text-[var(--color-text-muted)] max-w-[480px]">
            {t("sub")}
          </p>
        </>
      )}

      <form onSubmit={onSubmit} className="flex flex-col gap-5">
        {/* Honeypot — hidden from users (off-screen + aria-hidden), bots fill it */}
        <div
          aria-hidden
          className="absolute -left-[9999px] top-0 w-px h-px overflow-hidden"
        >
          <label>
            Website
            <input
              ref={honeypotRef}
              type="text"
              name="website"
              tabIndex={-1}
              autoComplete="off"
            />
          </label>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <Field
            label={t("fields.name")}
            value={name}
            onChange={setName}
            required
            autoComplete="name"
          />
          <Field
            label={t("fields.email")}
            type="email"
            value={email}
            onChange={setEmail}
            required
            autoComplete="email"
          />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <Field
            label={t("fields.phone")}
            type="tel"
            value={phone}
            onChange={setPhone}
            autoComplete="tel"
          />
          <Field
            label={t("fields.company")}
            value={company}
            onChange={setCompany}
            autoComplete="organization"
          />
        </div>

        {/* Services of interest (multi-select pills) */}
        <fieldset className="flex flex-col gap-2.5 mt-1">
          <legend className="flex items-baseline gap-2 mb-1">
            <span
              className="font-body uppercase text-[10px] text-[var(--color-text-muted)]"
              style={{ letterSpacing: "0.18em" }}
            >
              {t("services.label")}
            </span>
            <span className="font-body text-[11px] text-[var(--color-text-muted)]/70">
              {t("services.hint")}
            </span>
          </legend>
          <div className="flex flex-wrap gap-2">
            {SERVICE_KEYS.map((s) => {
              const active = services.has(s);
              return (
                <button
                  type="button"
                  key={s}
                  role="checkbox"
                  aria-checked={active}
                  onClick={() => toggleService(s)}
                  className={`h-9 px-3.5 rounded-full border text-[12px] transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-accent)] focus-visible:ring-offset-2 ${
                    active
                      ? "border-[var(--color-text)]"
                      : "border-[var(--color-border)] hover:border-[var(--color-text)]"
                  }`}
                  style={{
                    backgroundColor: active ? "var(--color-text)" : "transparent",
                    color: active ? "#FFFFFF" : "var(--color-text)",
                  }}
                >
                  {t(`services.options.${s}`)}
                </button>
              );
            })}
          </div>
        </fieldset>

        {/* Budget pills — keyed by enum value */}
        <fieldset className="flex flex-col gap-2.5">
          <legend
            className="font-body uppercase text-[10px] text-[var(--color-text-muted)] mb-1"
            style={{ letterSpacing: "0.18em" }}
          >
            {t("fields.budget")}
          </legend>
          <div className="flex flex-wrap gap-2">
            {BUDGET_KEYS.map((key) => {
              const active = budget === key;
              return (
                <button
                  type="button"
                  key={key}
                  onClick={() => setBudget(active ? "" : key)}
                  className={`h-9 px-3 rounded-full border text-[12px] transition-all duration-200 ${
                    active
                      ? "border-[var(--color-accent)]"
                      : "border-[var(--color-border)] hover:border-[var(--color-text)] hover:text-[var(--color-text)]"
                  }`}
                  style={{
                    backgroundColor: active ? "var(--color-accent)" : "transparent",
                    color: active ? "#FFFFFF" : "var(--color-text-muted)",
                  }}
                >
                  {budgetLabels[key]}
                </button>
              );
            })}
          </div>
        </fieldset>

        <TextareaField
          label={t("fields.message")}
          value={message}
          onChange={setMessage}
          required
        />

        {/* Privacy notice */}
        <div className="flex flex-col gap-2.5 mt-1">
          <p className="font-body text-[11px] leading-[1.5] text-[var(--color-text-muted)]/80">
            {t("consent.privacyPrefix")}{" "}
            <Link
              href={privacyHref}
              className="underline underline-offset-2 hover:text-[var(--color-accent)] transition-colors"
            >
              {t("consent.privacyLink")}
            </Link>
            .
          </p>
        </div>

        <div className="flex items-center gap-4 mt-2 flex-wrap">
          <PrimaryButton>
            {status === "sending" ? (
              <span className="inline-flex items-center gap-2">
                <Loader2 size={14} className="animate-spin" />
                {t("sending")}
              </span>
            ) : (
              t("submit")
            )}
          </PrimaryButton>

          <AnimatePresence>
            {status === "sent" && (
              <motion.div
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
                className="flex items-center gap-2 font-body text-[13px] text-[var(--color-text)]"
              >
                <span className="w-6 h-6 rounded-full bg-[var(--color-accent)]/15 flex items-center justify-center">
                  <Check
                    size={14}
                    className="text-[var(--color-accent)]"
                    strokeWidth={2.5}
                  />
                </span>
                <span>
                  <strong className="font-semibold">{t("successTitle")}</strong>{" "}
                  <span className="text-[var(--color-text-muted)]">
                    {t("successBody")}
                  </span>
                </span>
              </motion.div>
            )}
            {status === "error" && (
              <motion.div
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                className="flex items-center gap-2 font-body text-[13px] text-[var(--color-accent)]"
              >
                <span>{t("errorBody")}</span>
                {errorDetail && process.env.NODE_ENV === "development" && (
                  <span className="font-mono text-[11px] opacity-60">
                    ({errorDetail})
                  </span>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </form>
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

function TextareaField({
  label,
  value,
  onChange,
  required,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  required?: boolean;
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
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        required={required}
        rows={4}
        className="w-full px-3 py-2.5 rounded-md bg-transparent border border-[var(--color-border)] text-[15px] font-body text-[var(--color-text)] placeholder:text-[var(--color-text-muted)]/60 focus:border-[var(--color-text)] focus:outline-none transition-colors resize-none"
      />
    </label>
  );
}
