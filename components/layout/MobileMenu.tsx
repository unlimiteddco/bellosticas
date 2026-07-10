"use client";

import { AnimatePresence, motion } from "framer-motion";
import Link from "next/link";
import {
  ArrowUpRight,
  ChevronDown,
  MessageCircle,
  Phone,
  Video,
  X,
} from "lucide-react";
import { useTranslations } from "next-intl";
import { useEffect, useState } from "react";
import { services } from "@/lib/services";
import { LocaleSwitcher } from "./LocaleSwitcher";

interface MobileMenuProps {
  open: boolean;
  onClose: () => void;
}

const ITEMS = [
  { key: "work", href: "/work", n: "01" },
  { key: "services", href: "/#services", n: "02" },
  { key: "studio", href: "/studio", n: "03" },
  { key: "love", href: "/love", n: "04" },
  { key: "contact", href: "/contact", n: "05" },
] as const;

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.06, delayChildren: 0.15 },
  },
  exit: { opacity: 0 },
};

const itemVariants = {
  hidden: { opacity: 0, x: 24 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.4, ease: [0.4, 0, 0.2, 1] as const } },
  exit: { opacity: 0, x: 24, transition: { duration: 0.2 } },
};

export function MobileMenu({ open, onClose }: MobileMenuProps) {
  const t = useTranslations("nav");
  const ts = useTranslations("services");
  const [servicesOpen, setServicesOpen] = useState(false);

  useEffect(() => {
    if (!open) return;
    setServicesOpen(false); // cada apertura arranca con el desplegable cerrado
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener("keydown", onKey);
    };
  }, [open, onClose]);

  return (
    <AnimatePresence>
      {open && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-[100] bg-black/40 backdrop-blur-sm"
            onClick={onClose}
            aria-hidden
          />

          {/* Panel — minimal: fondo plano de marca, sin patrón ni adornos */}
          <motion.aside
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ duration: 0.45, ease: [0.4, 0, 0.2, 1] }}
            className="fixed top-0 right-0 z-[101] h-full w-full max-w-[460px] flex flex-col overflow-hidden bg-[var(--color-text)] text-[var(--color-bg)]"
            role="dialog"
            aria-modal="true"
            aria-label={t("menuLabel")}
          >
            {/* Header */}
            <header className="relative z-10 flex items-center justify-between px-7 pt-7">
              <motion.span
                initial={{ opacity: 0, y: -6 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.2 }}
                className="font-body uppercase text-[11px] text-[var(--color-bg)]/70"
                style={{ letterSpacing: "0.18em" }}
              >
                {t("menuLabel")}
              </motion.span>
              <motion.button
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.4, delay: 0.2 }}
                type="button"
                onClick={onClose}
                aria-label={t("closeMenu")}
                className="flex items-center justify-center w-10 h-10 rounded-full border border-[var(--color-bg)]/20 text-[var(--color-bg)] hover:bg-[var(--color-bg)]/10 transition-colors"
              >
                <X size={18} />
              </motion.button>
            </header>

            {/* Nav items */}
            <motion.nav
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              className="relative z-10 flex-1 flex flex-col justify-center gap-0.5 px-7 overflow-y-auto"
            >
              {ITEMS.map((item) =>
                item.key === "services" ? (
                  /* Servicios — desplegable con los 6 servicios */
                  <motion.div key={item.key} variants={itemVariants}>
                    <button
                      type="button"
                      onClick={() => setServicesOpen((v) => !v)}
                      aria-expanded={servicesOpen}
                      className="group w-full flex items-baseline gap-4 py-2.5 border-b border-[var(--color-bg)]/10 transition-colors text-left"
                    >
                      <span
                        className="font-body uppercase text-[11px] text-[var(--color-bg)]/40 tabular-nums shrink-0"
                        style={{ letterSpacing: "0.18em" }}
                      >
                        {item.n}
                      </span>
                      <div className="flex flex-col gap-0.5 flex-1 min-w-0">
                        <span
                          className={`flex items-center gap-2 font-display text-[26px] leading-none transition-colors ${
                            servicesOpen ? "text-[var(--color-accent)]" : "text-[var(--color-bg)]"
                          }`}
                        >
                          {t(item.key)}
                          <ChevronDown
                            size={17}
                            className={`transition-transform duration-300 ${
                              servicesOpen
                                ? "rotate-180 text-[var(--color-accent)]"
                                : "text-[var(--color-bg)]/40"
                            }`}
                          />
                        </span>
                        <span
                          className="font-body text-[11px] text-[var(--color-bg)]/55 uppercase mt-1"
                          style={{ letterSpacing: "0.12em" }}
                        >
                          {t(`${item.key}Sub`)}
                        </span>
                      </div>
                    </button>

                    {/* Colapso con CSS grid-rows: fiable sin JS por frame */}
                    <div
                      className="grid transition-[grid-template-rows,opacity] duration-300 ease-out"
                      style={{
                        gridTemplateRows: servicesOpen ? "1fr" : "0fr",
                        opacity: servicesOpen ? 1 : 0,
                      }}
                    >
                      <div className="min-h-0 overflow-hidden">
                        <div className="pl-9 py-2 border-b border-[var(--color-bg)]/10">
                            {services.map((s) => (
                              <Link
                                key={s.slug}
                                href={`/services/${s.slug}`}
                                onClick={onClose}
                                className="group flex items-center gap-3 py-2"
                              >
                                <span
                                  className="font-mono text-[10px] text-[var(--color-accent)]/80 shrink-0"
                                  style={{ letterSpacing: "0.08em" }}
                                >
                                  {s.number}
                                </span>
                                <span className="font-body text-[15px] text-[var(--color-bg)]/85 group-hover:text-[var(--color-accent)] transition-colors">
                                  {ts(`items.${s.titleKey}.title`)}
                                </span>
                              </Link>
                            ))}
                            <Link
                              href="/#services"
                              onClick={onClose}
                              className="inline-flex items-center gap-1.5 py-2 font-body text-[12px] uppercase text-[var(--color-bg)]/50 hover:text-[var(--color-accent)] transition-colors"
                              style={{ letterSpacing: "0.14em" }}
                            >
                              {t("mm.viewAll")}
                              <ArrowUpRight size={12} />
                            </Link>
                          </div>
                        </div>
                      </div>
                  </motion.div>
                ) : (
                  <motion.div key={item.key} variants={itemVariants}>
                    <Link
                      href={item.href}
                      onClick={onClose}
                      className="group flex items-baseline gap-4 py-2.5 border-b border-[var(--color-bg)]/10 transition-colors"
                    >
                      <span
                        className="font-body uppercase text-[11px] text-[var(--color-bg)]/40 tabular-nums shrink-0"
                        style={{ letterSpacing: "0.18em" }}
                      >
                        {item.n}
                      </span>
                      <div className="flex flex-col gap-0.5 flex-1 min-w-0">
                        <span className="flex items-center gap-2 font-display text-[26px] leading-none text-[var(--color-bg)] transition-colors group-hover:text-[var(--color-accent)]">
                          {t(item.key)}
                          <ArrowUpRight
                            size={16}
                            className="text-[var(--color-bg)]/30 -translate-x-2 opacity-0 group-hover:translate-x-0 group-hover:opacity-100 group-hover:text-[var(--color-accent)] transition-all duration-300"
                          />
                        </span>
                        <span
                          className="font-body text-[11px] text-[var(--color-bg)]/55 uppercase mt-1"
                          style={{ letterSpacing: "0.12em" }}
                        >
                          {t(`${item.key}Sub`)}
                        </span>
                      </div>
                    </Link>
                  </motion.div>
                ),
              )}
            </motion.nav>

            {/* Footer block */}
            <motion.footer
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.7 }}
              className="relative z-10 flex flex-col gap-3 px-7 pb-8 pt-5 border-t border-[var(--color-bg)]/10"
            >
              <Link
                href="/intro"
                onClick={onClose}
                className="flex items-center justify-center gap-2.5 h-12 rounded-full bg-[var(--color-bg)] text-[var(--color-text)] text-[14px] font-medium hover:bg-[var(--color-accent)] hover:text-[var(--color-bg)] transition-colors"
              >
                <Video size={17} />
                {t("bookVideo")}
              </Link>
              <a
                href="https://wa.me/34624010424?text=Hola%20Antonio%20%F0%9F%91%8B%20Vengo%20de%20la%20web%20y%20me%20gustar%C3%ADa%20hablar%20de%20un%20proyecto."
                target="_blank"
                rel="noopener"
                onClick={() =>
                  (window as unknown as { gtag?: (...a: unknown[]) => void }).gtag?.(
                    "event",
                    "whatsapp_click",
                    { source: "mobile-menu" },
                  )
                }
                className="flex items-center justify-center gap-2.5 h-12 rounded-full border border-[#25D366]/50 text-[var(--color-bg)] text-[14px] font-medium hover:bg-[#25D366]/15 transition-colors"
              >
                <MessageCircle size={16} className="text-[#25D366]" />
                WhatsApp
              </a>
              <a
                href="tel:+34624010424"
                className="flex items-center justify-center gap-2.5 h-12 rounded-full border border-[var(--color-bg)]/30 text-[var(--color-bg)] text-[14px] font-medium hover:bg-[var(--color-bg)]/10 transition-colors"
              >
                <Phone size={16} />
                {t("callPhone")}
              </a>

              <div className="flex items-center justify-between gap-4 mt-2">
                <a
                  href="mailto:info@bellostas.studio"
                  className="font-body text-[13px] text-[var(--color-bg)]/70 hover:text-[var(--color-accent)] transition-colors truncate"
                >
                  info@bellostas.studio
                </a>
                <LocaleSwitcher variant="toggle" onSwitch={onClose} />
              </div>
            </motion.footer>
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}
