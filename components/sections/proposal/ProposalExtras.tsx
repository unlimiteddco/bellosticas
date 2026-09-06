"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Check, Info, X } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import type { ProposalExtra } from "@/lib/proposals";
import { useProposalExtras } from "./ProposalExtrasContext";

function eur(n: number, locale: string) {
  return new Intl.NumberFormat(locale === "en" ? "en-IE" : "es-ES", {
    style: "currency",
    currency: "EUR",
    minimumFractionDigits: Number.isInteger(n) ? 0 : 2,
    maximumFractionDigits: 2,
  }).format(Number.isFinite(n) ? n : 0);
}

/** Popup de "ver más". Cierra con Escape y con clic fuera, y bloquea el scroll. */
function DetalleModal({
  extra,
  onClose,
  cerrarLabel,
}: {
  extra: ProposalExtra;
  onClose: () => void;
  cerrarLabel: string;
}) {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    document.addEventListener("keydown", onKey);
    const previo = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = previo;
    };
  }, [onClose]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.18 }}
      className="fixed inset-0 z-[60] flex items-end sm:items-center justify-center p-0 sm:p-6"
      style={{ background: "rgba(20,19,17,0.45)", backdropFilter: "blur(3px)" }}
      onClick={onClose}
    >
      <motion.div
        role="dialog"
        aria-modal="true"
        aria-label={extra.label}
        initial={{ y: 24, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 16, opacity: 0 }}
        transition={{ duration: 0.24, ease: [0.22, 1, 0.36, 1] }}
        onClick={(e) => e.stopPropagation()}
        className="w-full sm:max-w-[560px] max-h-[85vh] overflow-y-auto rounded-t-2xl sm:rounded-2xl bg-[var(--color-surface)] border border-[var(--color-border)] p-7 sm:p-9"
      >
        <div className="flex items-start justify-between gap-4">
          <h3 className="font-display text-[24px] sm:text-[28px] leading-tight text-[var(--color-text)]">
            {extra.label}
          </h3>
          <button
            type="button"
            onClick={onClose}
            aria-label={cerrarLabel}
            className="shrink-0 -mr-2 -mt-1 p-2 rounded-full text-[var(--color-text-muted)] hover:text-[var(--color-text)] hover:bg-[var(--color-text)]/[0.06] transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        {extra.details?.trim() ? (
          <div className="mt-4 flex flex-col gap-3">
            {extra.details.split(/\n{2,}|\n/).filter(Boolean).map((p, i) => (
              <p
                key={i}
                className="font-body text-[15px] leading-[1.65] text-[var(--color-text-muted)]"
              >
                {p}
              </p>
            ))}
          </div>
        ) : (
          extra.description && (
            <p className="mt-4 font-body text-[15px] leading-[1.65] text-[var(--color-text-muted)]">
              {extra.description}
            </p>
          )
        )}

        <p className="mt-6 pt-5 border-t border-[var(--color-border)] font-body text-[17px] text-[var(--color-text)] tabular-nums">
          + {eur(Number(extra.price) || 0, "es")}
        </p>
      </motion.div>
    </motion.div>
  );
}

/**
 * Añadidos opcionales. No son planes a elegir: el alcance de arriba ya resuelve
 * su problema, y esto son piezas que puede sumar. Uno va marcado como
 * recomendado, porque sin una recomendación la gente no decide.
 *
 * La tarjeta es un div con role=checkbox y no un <button>, porque dentro lleva
 * otro botón (el de "ver más") y un botón dentro de otro es HTML inválido: el
 * navegador lo reordena y el clic deja de funcionar.
 */
export function ProposalExtras() {
  const ctx = useProposalExtras();
  const t = useTranslations("proposalPage");
  const locale = useLocale();
  const [abierto, setAbierto] = useState<ProposalExtra | null>(null);

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
          const hayDetalle = Boolean(e.details?.trim() || e.description);
          return (
            <div
              key={e.id}
              role="checkbox"
              aria-checked={on}
              tabIndex={0}
              onClick={() => ctx.alternar(e.id)}
              onKeyDown={(ev) => {
                if (ev.key === " " || ev.key === "Enter") {
                  ev.preventDefault();
                  ctx.alternar(e.id);
                }
              }}
              className={`group cursor-pointer rounded-2xl border p-5 transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-accent)] ${
                on
                  ? "border-[var(--color-accent)] bg-[var(--color-accent)]/[0.04]"
                  : "border-[var(--color-border)] hover:border-[var(--color-text)]/30"
              }`}
            >
              <div className="flex items-start gap-3">
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
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-baseline gap-x-2 gap-y-1">
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
                  </div>
                  {e.description && (
                    <p className="font-body text-[13px] leading-[1.5] text-[var(--color-text-muted)] mt-1.5">
                      {e.description}
                    </p>
                  )}
                  <div className="flex items-center justify-between gap-3 mt-2.5">
                    <span className="font-body text-[15px] text-[var(--color-text)] tabular-nums">
                      + {eur(Number(e.price) || 0, locale)}
                    </span>
                    {hayDetalle && (
                      <button
                        type="button"
                        // Sin esto, pedir información marcaría el añadido.
                        onClick={(ev) => {
                          ev.stopPropagation();
                          setAbierto(e);
                        }}
                        className="inline-flex items-center gap-1.5 font-body text-[12px] text-[var(--color-text-muted)] hover:text-[var(--color-accent)] transition-colors rounded-full focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-accent)]"
                      >
                        <Info size={13} />
                        {t("extras_more")}
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <AnimatePresence>
        {abierto && (
          <DetalleModal
            extra={abierto}
            onClose={() => setAbierto(null)}
            cerrarLabel={t("extras_close")}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
