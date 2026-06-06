"use client";

import { AnimatePresence, motion } from "framer-motion";
import Link from "next/link";
import { ArrowUpRight, Phone, Video, X } from "lucide-react";
import { useTranslations } from "next-intl";
import { useEffect } from "react";
import { BrandPattern } from "@/components/ui/BrandPattern";
import { AsteriskIcon } from "@/components/ui/AsteriskIcon";
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

  useEffect(() => {
    if (!open) return;
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

          {/* Panel */}
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
            {/* Brand pattern bg */}
            <BrandPattern asBackground opacity={0.08} size="md" />

            {/* Aura glow */}
            <div
              className="absolute inset-0 pointer-events-none"
              style={{
                background:
                  "radial-gradient(ellipse 70% 50% at 90% 100%, rgba(194,38,58,0.22) 0%, rgba(194,38,58,0) 60%)",
              }}
            />

            {/* Decorative asterisk top-right */}
            <motion.div
              initial={{ opacity: 0, scale: 0.6, rotate: -25 }}
              animate={{ opacity: 0.1, scale: 1, rotate: -10 }}
              transition={{ duration: 0.9, delay: 0.2, ease: [0.34, 1.56, 0.64, 1] }}
              className="absolute -top-12 -right-12 w-[220px] h-[220px] text-[var(--color-accent)] pointer-events-none"
            >
              <AsteriskIcon className="w-full h-full" />
            </motion.div>

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
              {ITEMS.map((item) => (
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
              ))}
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
