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
import { AnimatedLogo } from "@/components/ui/AnimatedLogo";
import { LocaleSwitcher } from "./LocaleSwitcher";

interface MobileMenuProps {
  open: boolean;
  onClose: () => void;
}

const ITEMS = [
  { key: "work", href: "/work" },
  { key: "services", href: "/#services" },
  { key: "studio", href: "/studio" },
  { key: "love", href: "/love" },
  { key: "contact", href: "/contact" },
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
            className="fixed inset-0 z-[100] bg-[var(--color-text)]/25 backdrop-blur-sm"
            onClick={onClose}
            aria-hidden
          />

          {/* Panel — mismo papel que la barra de escritorio: fondo claro, un
              solo filo y nada de adornos. Sin rayas entre enlaces: el aire
              separa mejor que una línea. */}
          <motion.aside
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ duration: 0.45, ease: [0.4, 0, 0.2, 1] }}
            className="fixed top-0 right-0 z-[101] h-full w-full max-w-[460px] flex flex-col overflow-hidden bg-[var(--color-bg)] text-[var(--color-text)] border-l border-[var(--color-border)]"
            role="dialog"
            aria-modal="true"
            aria-label={t("menuLabel")}
          >
            {/* Header: la marca donde antes iba la etiqueta "// MENU" */}
            <header className="relative z-10 flex items-center justify-between px-7 pt-7">
              <motion.div
                initial={{ opacity: 0, y: -6 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.2 }}
              >
                <AnimatedLogo height={19} asLink={false} />
              </motion.div>
              <motion.button
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.4, delay: 0.2 }}
                type="button"
                onClick={onClose}
                aria-label={t("closeMenu")}
                className="flex items-center justify-center w-10 h-10 rounded-full border border-[var(--color-border)] text-[var(--color-text)] hover:border-[var(--color-text)] transition-colors"
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
              className="relative z-10 flex-1 flex flex-col px-7 pt-10 pb-6 overflow-y-auto"
            >
              {/* mb-auto: los enlaces arrancan arriba y el aire sobrante se
                  junta abajo. Centrados quedaban flotando en medio de dos
                  huecos. Y al crecer el desplegable, esto deja desplazarse sin
                  que el primer enlace se corte contra el borde. */}
              <div className="mb-auto w-full flex flex-col gap-1">
              {ITEMS.map((item) =>
                item.key === "services" ? (
                  /* Servicios — desplegable con los 6 servicios */
                  <motion.div key={item.key} variants={itemVariants}>
                    <button
                      type="button"
                      onClick={() => setServicesOpen((v) => !v)}
                      aria-expanded={servicesOpen}
                      className="group -mx-2 w-[calc(100%+1rem)] flex items-center px-2 py-3 rounded-xl text-left active:bg-[var(--color-text)]/[0.04] transition-colors"
                    >
                      <span
                        className={`flex items-center gap-2 font-body text-[34px] leading-none tracking-tight transition-colors ${
                          servicesOpen ? "text-[var(--color-accent)]" : "text-[var(--color-text)]"
                        }`}
                      >
                        {t(item.key)}
                        <ChevronDown
                          size={18}
                          className={`transition-transform duration-300 ${
                            servicesOpen
                              ? "rotate-180 text-[var(--color-accent)]"
                              : "text-[var(--color-text-muted)]"
                          }`}
                        />
                      </span>
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
                        <div className="pl-1 pb-2">
                          {/* Celdas anchas: el dedo acierta en toda la fila,
                              no solo sobre las letras. */}
                          {services.map((s) => (
                            <Link
                              key={s.slug}
                              href={`/services/${s.slug}`}
                              onClick={onClose}
                              className="group -mx-2 flex items-center gap-3 min-h-[52px] px-3 py-2 rounded-xl hover:bg-[var(--color-text)]/[0.04] active:bg-[var(--color-text)]/[0.07] transition-colors"
                            >
                              <span
                                className="font-mono text-[10px] text-[var(--color-accent)]/70 shrink-0 w-5"
                                style={{ letterSpacing: "0.08em" }}
                              >
                                {s.number}
                              </span>
                              <span className="font-body text-[16px] leading-tight text-[var(--color-text)] group-hover:text-[var(--color-accent)] transition-colors">
                                {ts(`items.${s.titleKey}.title`)}
                              </span>
                              <ArrowUpRight
                                size={15}
                                className="ml-auto shrink-0 text-[var(--color-text-muted)]/50 group-hover:text-[var(--color-accent)] transition-colors"
                              />
                            </Link>
                          ))}
                          <Link
                            href="/#services"
                            onClick={onClose}
                            className="group -mx-2 flex items-center gap-1.5 min-h-[48px] px-3 rounded-xl font-body text-[12px] uppercase text-[var(--color-text-muted)] hover:bg-[var(--color-text)]/[0.04] hover:text-[var(--color-accent)] transition-colors"
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
                      className="group -mx-2 flex items-center px-2 py-3 rounded-xl active:bg-[var(--color-text)]/[0.04] transition-colors"
                    >
                      <span className="flex items-center gap-2 font-body text-[34px] leading-none tracking-tight text-[var(--color-text)] transition-colors group-hover:text-[var(--color-accent)]">
                        {t(item.key)}
                        <ArrowUpRight
                          size={17}
                          className="text-[var(--color-text-muted)] -translate-x-2 opacity-0 group-hover:translate-x-0 group-hover:opacity-100 group-hover:text-[var(--color-accent)] transition-all duration-300"
                        />
                      </span>
                    </Link>
                  </motion.div>
                ),
              )}
              </div>
            </motion.nav>

            {/* Footer block */}
            <motion.footer
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.7 }}
              className="relative z-10 flex flex-col gap-3 px-7 pb-8 pt-5"
            >
              <Link
                href="/intro"
                onClick={onClose}
                className="flex items-center justify-center gap-2.5 h-12 rounded-full bg-[var(--color-text)] text-[var(--color-bg)] text-[14px] font-medium hover:bg-[var(--color-accent)] transition-colors"
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
                className="flex items-center justify-center gap-2.5 h-12 rounded-full border border-[#25D366]/60 text-[var(--color-text)] text-[14px] font-medium hover:bg-[#25D366]/10 transition-colors"
              >
                <MessageCircle size={16} className="text-[#25D366]" />
                WhatsApp
              </a>
              <a
                href="tel:+34624010424"
                className="flex items-center justify-center gap-2.5 h-12 rounded-full border border-[var(--color-border)] text-[var(--color-text)] text-[14px] font-medium hover:border-[var(--color-text)] transition-colors"
              >
                <Phone size={16} />
                {t("callPhone")}
              </a>

              <div className="flex items-center justify-between gap-4 mt-2">
                <a
                  href="mailto:info@bellostas.studio"
                  className="font-body text-[13px] text-[var(--color-text-muted)] hover:text-[var(--color-accent)] transition-colors truncate"
                >
                  info@bellostas.studio
                </a>
                <LocaleSwitcher variant="toggle" tone="light" onSwitch={onClose} />
              </div>
            </motion.footer>
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}
