"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowLeft, ArrowRight, Check, X } from "lucide-react";
import { useTranslations } from "next-intl";
import {
  NICHES,
  REGIONS,
  LOCALITY_OPTIONS,
  LOCALITY_HINTS,
  RECOMMENDED_LOCALITIES,
  calcQuote,
  scopeLabel,
  type QuoteResult,
  type Scope,
} from "@/lib/seo-local";
import { getTrackingContext } from "@/lib/tracking";

/** Evento global para abrir el wizard desde cualquier CTA de la landing. */
export const OPEN_WIZARD_EVENT = "seo-wizard:open";

export function OpenWizardButton({
  label,
  className = "",
}: {
  label: string;
  className?: string;
}) {
  return (
    <button
      type="button"
      onClick={() => window.dispatchEvent(new CustomEvent(OPEN_WIZARD_EVENT))}
      className={`inline-flex items-center justify-center gap-2 h-13 px-8 rounded-full bg-[var(--color-accent)] text-white font-body text-[14px] font-medium uppercase tracking-[0.05em] hover:bg-[var(--color-accent-hover)] hover:-translate-y-0.5 transition-all shadow-[0_16px_40px_-16px_rgba(194,38,58,0.6)] ${className}`}
      style={{ height: "52px" }}
    >
      {label}
      <ArrowRight size={16} />
    </button>
  );
}

type Step = "niche" | "scope" | "localities" | "result";

export function SeoWizardHost() {
  const t = useTranslations("seoLocal.wizard");
  const [open, setOpen] = useState(false);
  const [step, setStep] = useState<Step>("niche");
  const [nicheKey, setNicheKey] = useState<string | null>(null);
  const [scope, setScope] = useState<Scope | null>(null);
  const [regionQuery, setRegionQuery] = useState("");
  const [localities, setLocalities] = useState<number | null>(null);
  const [quote, setQuote] = useState<QuoteResult | null>(null);
  const [quoteNumber, setQuoteNumber] = useState<string | null>(null);
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);
  const savedRef = useRef(false);

  // Abrir desde cualquier CTA de la página
  useEffect(() => {
    const onOpen = () => {
      setOpen(true);
      setStep("niche");
      setNicheKey(null);
      setScope(null);
      setLocalities(null);
      setQuote(null);
      setQuoteNumber(null);
      setSent(false);
      setRegionQuery("");
      savedRef.current = false;
    };
    window.addEventListener(OPEN_WIZARD_EVENT, onOpen);
    return () => window.removeEventListener(OPEN_WIZARD_EVENT, onOpen);
  }, []);

  // Escape + scroll lock
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
    };
  }, [open]);

  /** Guarda el presupuesto en el CRM (con o sin contacto). */
  const persist = useCallback(
    async (q: QuoteResult, contact?: { name: string; email: string; phone: string; message: string }) => {
      const tracking = getTrackingContext();
      // attribution plano y sin undefined (utm + click ids + página de origen)
      const attribution: Record<string, string> = {};
      for (const [k, v] of Object.entries({
        ...tracking.utm,
        ...tracking.click_ids,
        page_url: tracking.page_url,
        referrer: tracking.referrer,
      })) {
        if (typeof v === "string" && v) attribution[k] = v;
      }
      const payload: Record<string, unknown> = {
        niche: q.niche.key,
        nicheLabel: q.niche.label,
        scope: scopeLabel(q.scope),
        localities: q.localities,
        monthlyPrice: q.monthlyPrice,
        launchPrice: q.launchPrice,
        discountMonths: q.discountMonths,
        discountPercent: q.discountPercent,
        monthsToResultsMin: q.monthsToResultsMin,
        monthsToResultsMax: q.monthsToResultsMax,
        leadsMin: q.leadsMin,
        leadsMax: q.leadsMax,
        breakEvenJobs: q.breakEvenJobs,
        visitorId: tracking.visitor_id,
        attribution,
      };
      if (contact) {
        payload.updateNumber = quoteNumber;
        payload.contactName = contact.name;
        payload.contactEmail = contact.email;
        payload.contactPhone = contact.phone;
        payload.message = contact.message;
      }
      const res = await fetch("/api/seo-quote", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) throw new Error("save failed");
      const data = (await res.json()) as { number?: string };
      return data.number ?? null;
    },
    [quoteNumber],
  );

  // Al llegar al resultado: calcular y guardar (aunque no deje contacto)
  const goToResult = useCallback(
    (loc: number) => {
      if (!nicheKey || !scope) return;
      const q = calcQuote({ nicheKey, scope, localities: loc });
      setQuote(q);
      setStep("result");
      if (!savedRef.current) {
        savedRef.current = true;
        persist(q)
          .then((num) => setQuoteNumber(num))
          .catch(() => {
            // Sin red o CRM caído: la estimación sigue siendo útil sin número.
            savedRef.current = false;
          });
      }
    },
    [nicheKey, scope, persist],
  );

  async function submitContact(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!quote) return;
    const fd = new FormData(e.currentTarget);
    setSending(true);
    try {
      const num = await persist(quote, {
        name: String(fd.get("name") ?? ""),
        email: String(fd.get("email") ?? ""),
        phone: String(fd.get("phone") ?? ""),
        message: String(fd.get("message") ?? ""),
      });
      if (num) setQuoteNumber(num);
      setSent(true);
    } catch {
      setSent(false);
      alert(t("errorSend"));
    } finally {
      setSending(false);
    }
  }

  const stepIndex = { niche: 0, scope: 1, localities: 2, result: 3 }[step];

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.25 }}
          className="fixed inset-0 z-[9999] flex items-center justify-center p-4 md:p-8 bg-[rgba(29,29,27,0.6)] backdrop-blur-md overflow-y-auto"
          onClick={() => setOpen(false)}
          role="dialog"
          aria-modal="true"
          aria-label={t("ariaLabel")}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.96, y: 16 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: 16 }}
            transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
            onClick={(e) => e.stopPropagation()}
            className="relative w-full max-w-[640px] rounded-3xl bg-[var(--color-bg)] p-6 md:p-10 my-auto"
          >
            {/* Cerrar */}
            <button
              type="button"
              onClick={() => setOpen(false)}
              aria-label={t("close")}
              className="absolute top-4 right-4 w-10 h-10 rounded-full bg-[var(--color-surface-2)] text-[var(--color-text)] flex items-center justify-center hover:bg-[var(--color-text)] hover:text-[var(--color-bg)] transition-colors"
            >
              <X size={17} />
            </button>

            {/* Progreso */}
            <div className="flex items-center gap-1.5 mb-8" aria-hidden>
              {[0, 1, 2, 3].map((i) => (
                <span
                  key={i}
                  className="h-1 rounded-full transition-all duration-300"
                  style={{
                    width: i === stepIndex ? 28 : 14,
                    background: i <= stepIndex ? "var(--color-accent)" : "var(--color-border)",
                  }}
                />
              ))}
            </div>

            <div>
              {/* ── PASO 1: nicho ── */}
              {step === "niche" && (
                <StepShell key="niche" title={t("nicheTitle")} sub={t("nicheSub")}>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                    {NICHES.map((n) => (
                      <button
                        key={n.key}
                        type="button"
                        onClick={() => {
                          setNicheKey(n.key);
                          setStep("scope");
                        }}
                        className={`flex flex-col items-start gap-1.5 rounded-2xl border p-4 text-left transition-all hover:-translate-y-0.5 ${
                          nicheKey === n.key
                            ? "border-[var(--color-accent)] bg-[var(--color-accent)]/5"
                            : "border-[var(--color-border)] hover:border-[var(--color-accent)]/50"
                        }`}
                      >
                        <span className="text-[22px]" aria-hidden>{n.emoji}</span>
                        <span className="font-body text-[13.5px] font-medium text-[var(--color-text)]">
                          {n.label}
                        </span>
                      </button>
                    ))}
                  </div>
                </StepShell>
              )}

              {/* ── PASO 2: ámbito ── */}
              {step === "scope" && (
                <StepShell key="scope" title={t("scopeTitle")} sub={t("scopeSub")} onBack={() => setStep("niche")} backLabel={t("back")}>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {(
                      [
                        { key: "aragon", emoji: "🏔️", title: t("scopeAragon"), desc: t("scopeAragonDesc") },
                        { key: "espana", emoji: "🇪🇸", title: t("scopeEspana"), desc: t("scopeEspanaDesc") },
                      ] as const
                    ).map((o) => (
                      <button
                        key={o.key}
                        type="button"
                        onClick={() => {
                          setScope(o.key);
                          setStep("localities");
                        }}
                        className="flex flex-col items-start gap-2 rounded-2xl border border-[var(--color-border)] p-5 text-left hover:border-[var(--color-accent)]/60 hover:-translate-y-0.5 transition-all"
                      >
                        <span className="text-[26px]" aria-hidden>{o.emoji}</span>
                        <span className="font-body text-[15px] font-semibold text-[var(--color-text)]">{o.title}</span>
                        <span className="font-body text-[13px] leading-[1.5] text-[var(--color-text-muted)]">{o.desc}</span>
                      </button>
                    ))}
                  </div>

                  {/* ¿De otra zona? Buscador de comunidades */}
                  <div className="mt-5 border-t border-[var(--color-border)] pt-5">
                    <label className="block font-body text-[13px] font-medium text-[var(--color-text)] mb-2.5">
                      {t("scopeOtherLabel")}
                    </label>
                    <input
                      type="text"
                      value={regionQuery}
                      onChange={(e) => setRegionQuery(e.target.value)}
                      placeholder={t("scopeOtherPlaceholder")}
                      className={inputCls}
                    />
                    <div className="mt-2.5 flex flex-wrap gap-2 max-h-[120px] overflow-y-auto">
                      {REGIONS.filter((r) =>
                        r.label
                          .toLowerCase()
                          .normalize("NFD")
                          .replace(/[̀-ͯ]/g, "")
                          .includes(
                            regionQuery
                              .toLowerCase()
                              .normalize("NFD")
                              .replace(/[̀-ͯ]/g, ""),
                          ),
                      ).map((r) => (
                        <button
                          key={r.key}
                          type="button"
                          onClick={() => {
                            setScope(r.key);
                            setStep("localities");
                          }}
                          className="rounded-full border border-[var(--color-border)] px-3.5 py-1.5 font-body text-[13px] text-[var(--color-text)] hover:border-[var(--color-accent)]/60 hover:text-[var(--color-accent)] transition-colors"
                        >
                          {r.label}
                        </button>
                      ))}
                    </div>
                  </div>
                </StepShell>
              )}

              {/* ── PASO 3: localidades ── */}
              {step === "localities" && (
                <StepShell key="localities" title={t("localitiesTitle")} sub={t("localitiesSub")} onBack={() => setStep("scope")} backLabel={t("back")}>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                    {LOCALITY_OPTIONS.map((n) => {
                      const recommended = n === RECOMMENDED_LOCALITIES;
                      return (
                        <button
                          key={n}
                          type="button"
                          onClick={() => {
                            setLocalities(n);
                            goToResult(n);
                          }}
                          className={`relative rounded-2xl border py-5 font-body hover:-translate-y-0.5 transition-all ${
                            recommended
                              ? "border-[var(--color-accent)] bg-[var(--color-accent)]/5"
                              : "border-[var(--color-border)] hover:border-[var(--color-accent)]/60"
                          }`}
                        >
                          {recommended && (
                            <span
                              className="absolute -top-2.5 left-1/2 -translate-x-1/2 rounded-full bg-[var(--color-accent)] text-white px-2.5 py-0.5 font-body text-[9.5px] uppercase whitespace-nowrap"
                              style={{ letterSpacing: "0.1em" }}
                            >
                              {t("recommended")}
                            </span>
                          )}
                          <span className="block text-[24px] font-semibold text-[var(--color-text)] tabular-nums">{n}</span>
                          <span className="block text-[12px] text-[var(--color-text-muted)] mt-0.5">
                            {LOCALITY_HINTS[n]}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                  <p className="font-body text-[12px] text-[var(--color-text-muted)] mt-4">
                    {t("localitiesNote")}
                  </p>
                </StepShell>
              )}

              {/* ── PASO 4: resultado ── */}
              {step === "result" && quote && (
                <motion.div
                  key="result"
                  initial={{ opacity: 0, x: 16 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.25 }}
                >
                  <button
                    type="button"
                    onClick={() => setStep("localities")}
                    className="inline-flex items-center gap-1.5 font-body text-[12px] uppercase text-[var(--color-text-muted)] hover:text-[var(--color-accent)] transition-colors mb-4"
                    style={{ letterSpacing: "0.14em" }}
                  >
                    <ArrowLeft size={13} />
                    {t("edit")}
                  </button>

                  <div className="flex items-baseline justify-between gap-4 flex-wrap">
                    <h3 className="font-display text-[26px] md:text-[30px] leading-tight text-[var(--color-text)]">
                      {quote.niche.emoji} {quote.niche.label} · {quote.localities} {t("localitiesUnit")}
                    </h3>
                    {quoteNumber && (
                      <span className="font-mono text-[12px] text-[var(--color-text-muted)]">
                        {t("quoteLabel")} <span className="text-[var(--color-accent)] font-semibold">{quoteNumber}</span>
                      </span>
                    )}
                  </div>

                  {/* Precio — gancho de lanzamiento arriba, cuota normal debajo */}
                  <div className="mt-5 rounded-2xl bg-[var(--color-text)] text-[var(--color-bg)] p-6">
                    <div className="flex items-end justify-between gap-4 flex-wrap">
                      <div>
                        <span className="flex items-center gap-2 mb-1">
                          <span
                            className="font-body uppercase text-[10px] text-[var(--color-bg)]/60"
                            style={{ letterSpacing: "0.16em" }}
                          >
                            {t("launchLabel", { months: quote.discountMonths })}
                          </span>
                          <span
                            className="rounded-full bg-[var(--color-accent)] text-white px-2 py-0.5 font-body text-[9.5px] uppercase font-medium"
                            style={{ letterSpacing: "0.08em" }}
                          >
                            {t("launchBadge")}
                          </span>
                        </span>
                        <span className="font-display text-[44px] leading-none">
                          {quote.launchPrice.toLocaleString("es")} €<span className="text-[18px] text-[var(--color-bg)]/70">/mes</span>
                        </span>
                      </div>
                      <span className="font-body text-[12px] text-[var(--color-bg)]/60 max-w-[200px]">
                        {t("monthlyNote")}
                      </span>
                    </div>
                    <div className="mt-4 pt-3.5 border-t border-white/10">
                      <span className="font-body text-[13.5px] text-[var(--color-bg)]/85">
                        {t("afterLaunch", {
                          month: quote.discountMonths + 1,
                          price: quote.monthlyPrice.toLocaleString("es"),
                        })}
                      </span>
                    </div>
                  </div>

                  {/* Estimaciones */}
                  <div className="mt-3 grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                    <Stat label={t("resultsLabel")} value={`${quote.monthsToResultsMin}–${quote.monthsToResultsMax} ${t("months")}`} />
                    <Stat label={t("leadsLabel")} value={`${quote.leadsMin}–${quote.leadsMax}/mes`} />
                    <Stat label={t("breakEvenLabel")} value={t("breakEvenValue", { n: quote.breakEvenJobs })} />
                  </div>

                  <p className="font-body text-[11.5px] text-[var(--color-text-muted)] mt-3 leading-[1.5]">
                    {t("disclaimer")}
                  </p>

                  {/* Contacto */}
                  {sent ? (
                    <div className="mt-6 rounded-2xl border border-[#10B981]/30 bg-[#10B981]/5 p-5 flex items-start gap-3">
                      <span className="w-8 h-8 rounded-full bg-[#10B981] text-white flex items-center justify-center shrink-0">
                        <Check size={16} />
                      </span>
                      <div>
                        <p className="font-body text-[15px] font-semibold text-[var(--color-text)]">{t("sentTitle")}</p>
                        <p className="font-body text-[13.5px] text-[var(--color-text-muted)] mt-1">
                          {t("sentBody", { number: quoteNumber ?? "—" })}
                        </p>
                      </div>
                    </div>
                  ) : (
                    <form onSubmit={submitContact} className="mt-6 border-t border-[var(--color-border)] pt-5">
                      <p className="font-body text-[14px] font-semibold text-[var(--color-text)]">{t("contactTitle")}</p>
                      <div className="mt-3 grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                        <input name="name" required placeholder={t("name")} className={inputCls} />
                        <input name="email" type="email" required placeholder={t("email")} className={inputCls} />
                        <input name="phone" placeholder={t("phone")} className={inputCls} />
                      </div>
                      <div className="mt-2.5 flex flex-col sm:flex-row gap-2.5">
                        <input name="message" placeholder={t("message")} className={`${inputCls} flex-1`} />
                        <button
                          type="submit"
                          disabled={sending}
                          className="inline-flex items-center justify-center gap-2 h-12 px-6 rounded-full bg-[var(--color-accent)] text-white font-body text-[13px] font-medium uppercase tracking-[0.05em] hover:bg-[var(--color-accent-hover)] transition-colors disabled:opacity-60 shrink-0"
                        >
                          {sending ? t("sending") : t("send")}
                          {!sending && <ArrowRight size={14} />}
                        </button>
                      </div>
                    </form>
                  )}
                </motion.div>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

const inputCls =
  "h-12 rounded-xl border border-[var(--color-border)] bg-[var(--color-bg)] px-4 font-body text-[14px] text-[var(--color-text)] placeholder:text-[var(--color-text-muted)]/60 focus:outline-none focus:border-[var(--color-accent)]/60 w-full";

function StepShell({
  title,
  sub,
  children,
  onBack,
  backLabel,
}: {
  title: string;
  sub: string;
  children: React.ReactNode;
  onBack?: () => void;
  backLabel?: string;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, x: 16 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.25 }}
    >
      {onBack && (
        <button
          type="button"
          onClick={onBack}
          className="inline-flex items-center gap-1.5 font-body text-[12px] uppercase text-[var(--color-text-muted)] hover:text-[var(--color-accent)] transition-colors mb-4"
          style={{ letterSpacing: "0.14em" }}
        >
          <ArrowLeft size={13} />
          {backLabel}
        </button>
      )}
      <h3 className="font-display text-[26px] md:text-[30px] leading-tight text-[var(--color-text)]">{title}</h3>
      <p className="font-body text-[14px] text-[var(--color-text-muted)] mt-1.5 mb-6">{sub}</p>
      {children}
    </motion.div>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface-2)] p-4">
      <span className="block font-body uppercase text-[10px] text-[var(--color-text-muted)]" style={{ letterSpacing: "0.14em" }}>
        {label}
      </span>
      <span className="block font-body text-[17px] font-semibold text-[var(--color-text)] mt-1 tabular-nums">{value}</span>
    </div>
  );
}
