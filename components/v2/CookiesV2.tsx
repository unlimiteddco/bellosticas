"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useTranslations, useLocale } from "next-intl";
import { X } from "lucide-react";
import { useEffect, useState } from "react";
import { useCookieConsent } from "@/components/cookies/CookieProvider";

/*
 * El aviso y el panel de cookies de la V2: los mismos textos y la misma lógica
 * de consentimiento que la V1 (CookieProvider), con el estilo de la V2
 * (tokens --v2-*, líneas, botones .v2-btn, etiqueta .v2-tag). Va dentro de
 * V2Root para heredar el tema claro/oscuro; el de la V1 no se pinta en /v2.
 *
 * «Rechazar» y «Aceptar» con el mismo tamaño, como pide la AEPD. Nada que no
 * sea esencial se carga hasta que la persona decide.
 */

const RETRASO_MS = 1800;
const EASE = [0.22, 1, 0.36, 1] as const;

export function CookiesV2() {
  const t = useTranslations("cookieBanner");
  const locale = useLocale();
  const { hasDecided, ready, modalOpen, openModal, acceptAll, rejectAll } = useCookieConsent();
  const politica = locale === "es" ? "/v2/cookies" : "/en/v2/cookies";

  // Un momento después de cargar, para no tapar el hero al llegar.
  const [listo, setListo] = useState(false);
  useEffect(() => {
    if (!ready || hasDecided) return;
    const id = setTimeout(() => setListo(true), RETRASO_MS);
    return () => clearTimeout(id);
  }, [ready, hasDecided]);

  return (
    <>
      <AnimatePresence>
        {ready && listo && !hasDecided && !modalOpen && (
          <motion.div
            key="cookies-v2"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 16 }}
            transition={{ duration: 0.4, ease: EASE }}
            data-cookie-banner
            role="dialog"
            aria-live="polite"
            aria-label={t("title")}
            className="fixed bottom-4 left-4 right-4 z-[80] overflow-hidden rounded-[8px] border border-[var(--v2-line)] bg-[var(--v2-bg)] text-[var(--v2-text)] shadow-[0_24px_60px_-24px_rgba(0,0,0,0.35)] sm:right-auto sm:w-[400px]"
          >
            <div className="flex flex-col gap-2 p-5">
              <span className="v2-label">{t("title")}</span>
              <p className="text-[13.5px] leading-[1.55] text-[var(--v2-muted)]">
                {t("body")}{" "}
                <a href={politica} className="text-[var(--v2-text)] underline underline-offset-2 hover:text-[var(--v2-accent)]">
                  {t("policyLink")}
                </a>
                .
              </p>
            </div>
            <div className="flex items-center gap-2 border-t border-[var(--v2-line)] px-5 py-3.5">
              <button
                type="button"
                onClick={openModal}
                className="mr-auto text-[13px] text-[var(--v2-muted)] underline-offset-2 hover:text-[var(--v2-text)] hover:underline"
              >
                {t("configure")}
              </button>
              <button type="button" onClick={rejectAll} className="v2-btn v2-btn--ghost v2-btn--sm">
                {t("rejectAll")}
              </button>
              <button type="button" onClick={acceptAll} className="v2-btn v2-btn--primary v2-btn--sm">
                {t("acceptAll")}
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      <PanelCookies />
    </>
  );
}

type Categoria = "necessary" | "analytics" | "marketing";

function PanelCookies() {
  const t = useTranslations("cookieBanner.modal");
  const tb = useTranslations("cookieBanner");
  const { modalOpen, closeModal, consent, setChoices, acceptAll, rejectAll } = useCookieConsent();
  const [borrador, setBorrador] = useState({ analytics: false, marketing: false });

  // Cada vez que se abre, parte de lo que ya había decidido.
  useEffect(() => {
    if (!modalOpen) return;
    setBorrador({ analytics: consent?.choices.analytics ?? false, marketing: consent?.choices.marketing ?? false });
  }, [modalOpen, consent]);

  // Esc cierra y la página de detrás no se mueve.
  useEffect(() => {
    if (!modalOpen) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && closeModal();
    const antes = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = antes;
      window.removeEventListener("keydown", onKey);
    };
  }, [modalOpen, closeModal]);

  return (
    <AnimatePresence>
      {modalOpen && (
        <>
          <motion.div
            key="cookies-v2-fondo"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            onClick={closeModal}
            className="fixed inset-0 z-[90] bg-black/45 backdrop-blur-[2px]"
          />
          <motion.div
            key="cookies-v2-panel"
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 24 }}
            transition={{ duration: 0.4, ease: EASE }}
            role="dialog"
            aria-modal="true"
            aria-labelledby="cookies-v2-titulo"
            className="fixed inset-x-4 bottom-4 z-[91] flex max-h-[90vh] flex-col overflow-hidden rounded-[8px] border border-[var(--v2-line)] bg-[var(--v2-bg)] text-[var(--v2-text)] shadow-[0_40px_80px_-30px_rgba(0,0,0,0.5)] sm:inset-x-auto sm:bottom-auto sm:left-1/2 sm:top-1/2 sm:w-[540px] sm:-translate-x-1/2 sm:-translate-y-1/2"
          >
            <div className="flex items-start justify-between gap-4 border-b border-[var(--v2-line)] px-6 py-5">
              <div className="flex flex-col gap-2">
                <span className="v2-label">Cookies</span>
                <h2 id="cookies-v2-titulo" className="text-[24px] font-medium tracking-[-0.02em]">
                  {t("title")}
                </h2>
              </div>
              <button
                type="button"
                onClick={closeModal}
                aria-label={t("close")}
                className="v2-ico shrink-0 hover:border-[var(--v2-text)] hover:bg-[var(--v2-text)] hover:text-[var(--v2-bg)]"
              >
                <X size={14} strokeWidth={2} />
              </button>
            </div>

            <div className="overflow-y-auto">
              <p className="px-6 py-5 text-[14px] leading-[1.6] text-[var(--v2-muted)]">{t("intro")}</p>
              <div className="border-t border-[var(--v2-line)]">
                <Fila
                  categoria="necessary"
                  titulo={t("categories.necessary.title")}
                  texto={t("categories.necessary.description")}
                  etiqueta={t("categories.necessary.alwaysOn")}
                  activa
                  fija
                />
                <Fila
                  categoria="analytics"
                  titulo={t("categories.analytics.title")}
                  texto={t("categories.analytics.description")}
                  activa={borrador.analytics}
                  alCambiar={(v) => setBorrador((b) => ({ ...b, analytics: v }))}
                />
                <Fila
                  categoria="marketing"
                  titulo={t("categories.marketing.title")}
                  texto={t("categories.marketing.description")}
                  activa={borrador.marketing}
                  alCambiar={(v) => setBorrador((b) => ({ ...b, marketing: v }))}
                />
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-2 border-t border-[var(--v2-line)] px-6 py-4">
              <button
                type="button"
                onClick={() => setChoices(borrador)}
                className="mr-auto text-[13px] text-[var(--v2-muted)] underline-offset-2 hover:text-[var(--v2-text)] hover:underline"
              >
                {t("save")}
              </button>
              <button type="button" onClick={rejectAll} className="v2-btn v2-btn--ghost v2-btn--sm">
                {tb("rejectAll")}
              </button>
              <button type="button" onClick={acceptAll} className="v2-btn v2-btn--primary v2-btn--sm">
                {tb("acceptAll")}
              </button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

function Fila({
  categoria,
  titulo,
  texto,
  etiqueta,
  activa,
  fija,
  alCambiar,
}: {
  categoria: Categoria;
  titulo: string;
  texto: string;
  etiqueta?: string;
  activa: boolean;
  fija?: boolean;
  alCambiar?: (v: boolean) => void;
}) {
  return (
    <div className="flex items-start gap-5 border-b border-[var(--v2-line)] px-6 py-4 last:border-b-0">
      <div className="flex min-w-0 flex-1 flex-col gap-1">
        <span className="flex items-center gap-2">
          <span className="text-[15px] font-medium">{titulo}</span>
          {etiqueta && <span className="v2-tag">{etiqueta}</span>}
        </span>
        <span className="text-[13px] leading-[1.55] text-[var(--v2-muted)]">{texto}</span>
      </div>
      <button
        type="button"
        role="switch"
        aria-checked={activa}
        aria-label={categoria}
        disabled={fija}
        onClick={() => !fija && alCambiar?.(!activa)}
        className={`relative mt-0.5 h-6 w-10 shrink-0 rounded-full transition-colors duration-300 disabled:cursor-not-allowed disabled:opacity-60 ${
          activa ? "bg-[var(--v2-accent)]" : "bg-[var(--v2-line-strong)]"
        }`}
      >
        <span
          className={`absolute left-1 top-1 h-4 w-4 rounded-full bg-white shadow-sm transition-transform duration-300 ease-[var(--v2-ease-out)] ${
            activa ? "translate-x-4" : ""
          }`}
        />
      </button>
    </div>
  );
}
