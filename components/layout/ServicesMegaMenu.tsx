"use client";

import { useRef, useState, useEffect } from "react";
import { createPortal } from "react-dom";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowUpRight, ArrowRight } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import { services } from "@/lib/services";
import { AsteriskIcon } from "@/components/ui/AsteriskIcon";

const CLOSE_DELAY_MS = 160;

/**
 * "Servicios" nav item with a visual mega menu (desktop only).
 *
 * Opens on hover/focus, closes on leave (with a small grace delay), Escape or
 * click-through. The panel renders via portal into `panelHost` (a positioned
 * wrapper OUTSIDE the pill) — the pill has its own backdrop-filter, which in
 * Chrome creates a backdrop root that would break the panel's glass blur if it
 * stayed a DOM descendant. The trigger itself still links to /#services.
 */
export function ServicesMegaMenu({
  panelHost,
}: {
  panelHost?: React.RefObject<HTMLDivElement | null>;
}) {
  const t = useTranslations("nav");
  const ts = useTranslations("services");
  const locale = useLocale();
  // Las landings de SEO local solo existen en español.
  const showLocalLinks = locale === "es";
  const [open, setOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const closeTimer = useRef<number | null>(null);

  useEffect(() => setMounted(true), []);

  const enter = () => {
    if (closeTimer.current) window.clearTimeout(closeTimer.current);
    setOpen(true);
  };
  const leave = () => {
    if (closeTimer.current) window.clearTimeout(closeTimer.current);
    closeTimer.current = window.setTimeout(() => setOpen(false), CLOSE_DELAY_MS);
  };

  // Escape closes the panel (a11y)
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  return (
    <span onMouseEnter={enter} onMouseLeave={leave} className="contents">
      {/* Trigger — same style as the other nav links */}
      <Link
        href="/#services"
        onMouseEnter={enter}
        onMouseLeave={leave}
        onFocus={enter}
        onClick={() => setOpen(false)}
        aria-haspopup="true"
        aria-expanded={open}
        className={`group relative font-body text-[14px] transition-colors ${
          open ? "text-[var(--color-accent)]" : "text-[var(--color-text)] hover:text-[var(--color-accent)]"
        }`}
      >
        {t("services")}
        <span
          className={`absolute left-0 -bottom-1 h-px bg-[var(--color-accent)] transition-[width] duration-300 ${
            open ? "w-full" : "w-0 group-hover:w-full"
          }`}
        />
      </Link>

      {/* Panel — spans the host wrapper width (portal escapes the pill's backdrop root) */}
      {(() => {
        const panel = (
          <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.99 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 8, scale: 0.99 }}
            transition={{ duration: 0.22, ease: [0.4, 0, 0.2, 1] }}
            onMouseEnter={enter}
            onMouseLeave={leave}
            className="absolute left-0 right-0 top-[calc(100%+12px)] hidden lg:block"
          >
            <div
              className="rounded-3xl overflow-hidden"
              style={{
                background: "rgba(253, 253, 251, 0.97)",
                backdropFilter: "blur(28px) saturate(160%)",
                WebkitBackdropFilter: "blur(28px) saturate(160%)",
                border: "1px solid rgba(229, 226, 220, 0.9)",
                boxShadow: "0 40px 90px -20px rgba(29, 29, 27, 0.35)",
              }}
            >
              <div className="grid grid-cols-12">
                {/* ── Services grid ── */}
                <div className="col-span-8 p-6 lg:p-7">
                  <span
                    className="block font-body uppercase text-[10px] text-[var(--color-text-muted)] mb-4 pl-3"
                    style={{ letterSpacing: "0.18em" }}
                  >
                    {t("mm.label")}
                  </span>
                  <div className="grid grid-cols-2 gap-1">
                    {services.map((s) => (
                      <Link
                        key={s.slug}
                        href={`/services/${s.slug}`}
                        onClick={() => setOpen(false)}
                        className="group/item flex items-start gap-3.5 rounded-2xl p-3 hover:bg-[var(--color-surface-2)] transition-colors"
                      >
                        <span
                          className="font-mono text-[11px] text-[var(--color-accent)] pt-[3px] shrink-0"
                          style={{ letterSpacing: "0.08em" }}
                        >
                          {s.number}
                        </span>
                        <span className="flex flex-col gap-0.5 min-w-0">
                          <span className="flex items-center gap-1.5 font-body text-[14px] font-medium text-[var(--color-text)] group-hover/item:text-[var(--color-accent)] transition-colors">
                            {ts(`items.${s.titleKey}.title`)}
                            <ArrowUpRight
                              size={13}
                              className="opacity-0 -translate-x-0.5 group-hover/item:opacity-100 group-hover/item:translate-x-0 transition-all text-[var(--color-accent)] shrink-0"
                            />
                          </span>
                          <span className="font-body text-[12.5px] leading-[1.45] text-[var(--color-text-muted)] line-clamp-2">
                            {ts(`items.${s.titleKey}.description`)}
                          </span>
                        </span>
                      </Link>
                    ))}
                  </div>
                </div>

                {/* ── Help / CTA column ── */}
                <div className="col-span-4 border-l border-[var(--color-border)] bg-[var(--color-surface-2)]/60 p-6 lg:p-7 flex flex-col">
                  <span
                    className="font-body uppercase text-[10px] text-[var(--color-text-muted)]"
                    style={{ letterSpacing: "0.18em" }}
                  >
                    {t("mm.helpLabel")}
                  </span>
                  <p className="font-body text-[14px] leading-[1.55] text-[var(--color-text)] mt-3">
                    {t("mm.helpText")}
                  </p>
                  <Link
                    href="/intro"
                    onClick={() => setOpen(false)}
                    className="mt-4 inline-flex items-center justify-center gap-2 h-11 px-5 rounded-full bg-[var(--color-text)] text-[var(--color-bg)] font-body text-[13px] font-medium hover:bg-[var(--color-accent)] transition-colors self-start"
                  >
                    {t("mm.helpCta")}
                    <ArrowRight size={14} />
                  </Link>
                  <Link
                    href="/work"
                    onClick={() => setOpen(false)}
                    className="mt-3 inline-flex items-center gap-1.5 font-body text-[13px] text-[var(--color-text-muted)] hover:text-[var(--color-accent)] transition-colors self-start"
                  >
                    {t("mm.viewWork")}
                    <ArrowUpRight size={13} />
                  </Link>

                  {/* Brand mark, quietly */}
                  <div className="mt-auto pt-6 flex justify-end" aria-hidden>
                    <AsteriskIcon className="w-8 h-8 text-[var(--color-accent)]/25" />
                  </div>
                </div>
              </div>

              {/* ── Bottom strip: local pages + view all ── */}
              <div className="flex items-center justify-between gap-4 px-6 lg:px-7 py-3.5 border-t border-[var(--color-border)]">
                <span className="flex items-center gap-4 min-w-0">
                  {showLocalLinks && (
                    <>
                      <span
                        className="font-body uppercase text-[9.5px] text-[var(--color-text-muted)]/70 shrink-0"
                        style={{ letterSpacing: "0.16em" }}
                      >
                        {t("mm.localLabel")}
                      </span>
                      {(["zaragoza", "huesca", "teruel"] as const).map((c) => (
                        <Link
                          key={c}
                          href={`/diseno-web-${c}`}
                          onClick={() => setOpen(false)}
                          className="font-body text-[12.5px] text-[var(--color-text-muted)] hover:text-[var(--color-accent)] transition-colors capitalize"
                        >
                          {c}
                        </Link>
                      ))}
                    </>
                  )}
                </span>
                <Link
                  href="/#services"
                  onClick={() => setOpen(false)}
                  className="inline-flex items-center gap-1.5 font-body text-[12.5px] text-[var(--color-text)] hover:text-[var(--color-accent)] transition-colors shrink-0"
                >
                  {t("mm.viewAll")}
                  <ArrowRight size={13} />
                </Link>
              </div>
            </div>
          </motion.div>
        )}
          </AnimatePresence>
        );
        return mounted && panelHost?.current
          ? createPortal(panel, panelHost.current)
          : panel;
      })()}
    </span>
  );
}
