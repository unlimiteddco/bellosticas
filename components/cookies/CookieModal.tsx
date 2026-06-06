"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useTranslations } from "next-intl";
import { X } from "lucide-react";
import { useEffect, useState } from "react";
import { useCookieConsent } from "./CookieProvider";

type Category = "necessary" | "analytics" | "marketing";

export function CookieModal() {
  const t = useTranslations("cookieBanner.modal");
  const tBanner = useTranslations("cookieBanner");
  const { modalOpen, closeModal, consent, setChoices, acceptAll, rejectAll } =
    useCookieConsent();

  // Local draft state — only persisted on "Save"
  const [draft, setDraft] = useState({
    analytics: false,
    marketing: false,
  });

  // Sync draft from current consent every time the modal opens.
  useEffect(() => {
    if (!modalOpen) return;
    setDraft({
      analytics: consent?.choices.analytics ?? false,
      marketing: consent?.choices.marketing ?? false,
    });
  }, [modalOpen, consent]);

  // Close on Esc
  useEffect(() => {
    if (!modalOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") closeModal();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [modalOpen, closeModal]);

  // Lock body scroll while modal open
  useEffect(() => {
    if (!modalOpen) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [modalOpen]);

  const handleSave = () => {
    setChoices({ analytics: draft.analytics, marketing: draft.marketing });
  };

  return (
    <AnimatePresence>
      {modalOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            key="cookie-modal-backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={closeModal}
            className="fixed inset-0 z-[90] bg-[var(--color-text)]/55 backdrop-blur-sm"
          />

          {/* Panel */}
          <motion.div
            key="cookie-modal-panel"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 30 }}
            transition={{ duration: 0.35, ease: [0.4, 0, 0.2, 1] }}
            className="fixed z-[91] inset-x-4 bottom-4 sm:inset-x-auto sm:left-1/2 sm:-translate-x-1/2 sm:bottom-auto sm:top-1/2 sm:-translate-y-1/2 sm:w-[560px] max-h-[90vh] rounded-2xl bg-[var(--color-bg)] text-[var(--color-text)] shadow-[0_40px_80px_-20px_rgba(29,29,27,0.55)] border border-[var(--color-text)]/8 overflow-hidden flex flex-col"
            role="dialog"
            aria-modal="true"
            aria-labelledby="cookie-modal-title"
          >
            {/* Header */}
            <div className="flex items-start justify-between gap-4 px-6 pt-6 pb-4 border-b border-[var(--color-text)]/8">
              <div className="flex flex-col gap-1.5">
                <span
                  className="font-body uppercase text-[10px] text-[var(--color-text-muted)]"
                  style={{ letterSpacing: "0.18em" }}
                >
                  // COOKIES
                </span>
                <h2
                  id="cookie-modal-title"
                  className="font-display italic text-[24px] md:text-[28px] leading-tight text-[var(--color-text)]"
                >
                  {t("title")}
                </h2>
              </div>
              <button
                type="button"
                onClick={closeModal}
                aria-label={t("close")}
                className="shrink-0 w-9 h-9 rounded-full border border-[var(--color-text)]/15 flex items-center justify-center hover:bg-[var(--color-text)]/5 transition-colors"
              >
                <X size={16} strokeWidth={2} />
              </button>
            </div>

            {/* Body */}
            <div className="px-6 py-5 flex flex-col gap-5 overflow-y-auto">
              <p className="font-body text-[14px] leading-[1.6] text-[var(--color-text-muted)]">
                {t("intro")}
              </p>

              <div className="flex flex-col gap-3">
                <CategoryRow
                  category="necessary"
                  title={t("categories.necessary.title")}
                  description={t("categories.necessary.description")}
                  badge={t("categories.necessary.alwaysOn")}
                  checked
                  disabled
                />
                <CategoryRow
                  category="analytics"
                  title={t("categories.analytics.title")}
                  description={t("categories.analytics.description")}
                  checked={draft.analytics}
                  onChange={(next) => setDraft((d) => ({ ...d, analytics: next }))}
                />
                <CategoryRow
                  category="marketing"
                  title={t("categories.marketing.title")}
                  description={t("categories.marketing.description")}
                  checked={draft.marketing}
                  onChange={(next) => setDraft((d) => ({ ...d, marketing: next }))}
                />
              </div>
            </div>

            {/* Footer */}
            <div className="px-6 pt-4 pb-5 border-t border-[var(--color-text)]/8 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
              <button
                type="button"
                onClick={rejectAll}
                className="font-body text-[12px] text-[var(--color-text-muted)] hover:text-[var(--color-accent)] transition-colors w-fit"
                style={{ letterSpacing: "0.06em" }}
              >
                {tBanner("rejectAll")}
              </button>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handleSave}
                  className="px-4 py-2 rounded-full border border-[var(--color-text)]/15 hover:border-[var(--color-text)]/35 font-body text-[12px] text-[var(--color-text)] transition-colors"
                  style={{ letterSpacing: "0.04em" }}
                >
                  {t("save")}
                </button>
                <button
                  type="button"
                  onClick={acceptAll}
                  className="px-4 py-2 rounded-full bg-[var(--color-accent)] hover:opacity-90 font-body text-[12px] text-white transition-opacity"
                  style={{ letterSpacing: "0.04em" }}
                >
                  {tBanner("acceptAll")}
                </button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

function CategoryRow({
  category,
  title,
  description,
  checked,
  disabled,
  badge,
  onChange,
}: {
  category: Category;
  title: string;
  description: string;
  checked: boolean;
  disabled?: boolean;
  badge?: string;
  onChange?: (next: boolean) => void;
}) {
  return (
    <div className="flex items-start gap-4 p-4 rounded-xl border border-[var(--color-text)]/10 bg-[var(--color-text)]/[0.02]">
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-1">
          <h3 className="font-body text-[14px] font-medium text-[var(--color-text)]">
            {title}
          </h3>
          {badge && (
            <span
              className="font-body uppercase text-[9px] px-1.5 py-0.5 rounded-full bg-[var(--color-accent)]/12 text-[var(--color-accent)]"
              style={{ letterSpacing: "0.12em" }}
            >
              {badge}
            </span>
          )}
        </div>
        <p className="font-body text-[12.5px] leading-[1.55] text-[var(--color-text-muted)]">
          {description}
        </p>
      </div>

      <Toggle
        category={category}
        checked={checked}
        disabled={disabled}
        onChange={onChange}
      />
    </div>
  );
}

function Toggle({
  category,
  checked,
  disabled,
  onChange,
}: {
  category: Category;
  checked: boolean;
  disabled?: boolean;
  onChange?: (next: boolean) => void;
}) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      aria-label={category}
      disabled={disabled}
      onClick={() => !disabled && onChange?.(!checked)}
      className="relative shrink-0 w-10 h-6 rounded-full transition-colors disabled:cursor-not-allowed disabled:opacity-60"
      style={{
        backgroundColor: checked ? "var(--color-accent)" : "rgba(29,29,27,0.18)",
      }}
    >
      <motion.span
        animate={{ x: checked ? 16 : 0 }}
        transition={{ type: "spring", stiffness: 500, damping: 32 }}
        className="absolute top-1 left-1 w-4 h-4 rounded-full bg-white shadow-sm"
      />
    </button>
  );
}
