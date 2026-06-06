"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useTranslations, useLocale } from "next-intl";
import Link from "next/link";
import { Cookie } from "lucide-react";
import { useEffect, useState } from "react";
import { useCookieConsent } from "./CookieProvider";
import { CookieModal } from "./CookieModal";

/**
 * Floating cookie banner — bottom-left, non-blocking.
 *
 * Visible only while the user has not made a decision yet. The "Configure"
 * button opens the granular preferences modal.
 *
 * Delayed by SHOW_DELAY_MS so it doesn't cover hero CTAs on first paint.
 * Legally safe under LSSI-CE / AEPD guidance — no non-essential cookies are
 * loaded until the user explicitly consents through the banner.
 */

const SHOW_DELAY_MS = 1800;

export function CookieBanner() {
  const t = useTranslations("cookieBanner");
  const locale = useLocale();
  const { hasDecided, ready, modalOpen, openModal, acceptAll, rejectAll } =
    useCookieConsent();

  // Cookie policy URL — same slug across locales.
  const cookiesHref = locale === "es" ? "/cookies" : "/en/cookies";

  // Wait a beat after the provider is hydrated before showing the banner.
  // Lets the hero animations settle and avoids covering buttons on load.
  const [delayPassed, setDelayPassed] = useState(false);
  useEffect(() => {
    if (!ready || hasDecided) return;
    const t = setTimeout(() => setDelayPassed(true), SHOW_DELAY_MS);
    return () => clearTimeout(t);
  }, [ready, hasDecided]);

  // Render nothing until we've checked localStorage (avoids SSR/CSR flicker)
  // OR if the user has already decided. The modal can still be opened from
  // elsewhere (e.g. the cookies page button) — it lives at the bottom.
  return (
    <>
      <AnimatePresence>
        {ready && delayPassed && !hasDecided && !modalOpen && (
          <motion.div
            key="cookie-banner"
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 24 }}
            transition={{ duration: 0.35, ease: [0.4, 0, 0.2, 1] }}
            className="fixed z-[80] bottom-4 left-4 right-4 sm:right-auto sm:max-w-[420px] rounded-2xl bg-[var(--color-text)] text-[var(--color-bg)] shadow-[0_30px_60px_-20px_rgba(29,29,27,0.45)] border border-white/5"
            role="dialog"
            aria-live="polite"
            aria-label={t("title")}
          >
            <div className="p-5 flex flex-col gap-4">
              <div className="flex items-start gap-3">
                <span
                  className="shrink-0 w-9 h-9 rounded-full bg-[var(--color-accent)]/15 flex items-center justify-center"
                  aria-hidden
                >
                  <Cookie size={16} className="text-[var(--color-accent)]" />
                </span>
                <div className="flex flex-col gap-1.5">
                  <span
                    className="font-body uppercase text-[10px] text-[var(--color-bg)]/55"
                    style={{ letterSpacing: "0.18em" }}
                  >
                    {t("title")}
                  </span>
                  <p className="font-body text-[13px] leading-[1.55] text-[var(--color-bg)]/85">
                    {t("body")}{" "}
                    <Link
                      href={cookiesHref}
                      className="underline underline-offset-2 text-[var(--color-accent)] hover:opacity-80 transition-opacity"
                    >
                      {t("policyLink")}
                    </Link>
                    .
                  </p>
                </div>
              </div>

              {/* Buttons — Reject ≥ Accept in weight, per GDPR */}
              <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                <button
                  type="button"
                  onClick={openModal}
                  className="font-body text-[12px] text-[var(--color-bg)]/65 hover:text-[var(--color-accent)] transition-colors w-fit"
                  style={{ letterSpacing: "0.06em" }}
                >
                  {t("configure")}
                </button>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={rejectAll}
                    className="px-3.5 py-2 rounded-full bg-white/8 hover:bg-white/15 border border-white/10 font-body text-[12px] text-[var(--color-bg)] transition-colors"
                    style={{ letterSpacing: "0.04em" }}
                  >
                    {t("rejectAll")}
                  </button>
                  <button
                    type="button"
                    onClick={acceptAll}
                    className="px-3.5 py-2 rounded-full bg-[var(--color-accent)] hover:opacity-90 font-body text-[12px] text-white transition-opacity"
                    style={{ letterSpacing: "0.04em" }}
                  >
                    {t("acceptAll")}
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <CookieModal />
    </>
  );
}
