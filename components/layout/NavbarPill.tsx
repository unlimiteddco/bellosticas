"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu } from "lucide-react";
import { motion } from "framer-motion";
import { useTranslations } from "next-intl";
import { PrimaryButton } from "@/components/ui/PrimaryButton";
import { AnimatedLogo } from "@/components/ui/AnimatedLogo";
import { LocaleSwitcher } from "./LocaleSwitcher";
import { MobileMenu } from "./MobileMenu";

/**
 * Floating glassy pill navbar. Alternative to /components/layout/Navbar.tsx (classic style).
 * Both coexist — switch via `NAVBAR_VARIANT` constant in `app/[locale]/layout.tsx`.
 */
export function NavbarPill() {
  const t = useTranslations("nav");
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [hidden, setHidden] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  // Página de propuesta = pasillo de cierre: sin navegación ni CTAs que
  // compitan con aceptar. Solo marca + idioma.
  const isProposal = pathname?.includes("/propuestas/") ?? false;

  useEffect(() => {
    let lastY = window.scrollY;
    const onScroll = () => {
      const y = window.scrollY;
      setScrolled(y > 50);
      const goingDown = y > lastY;
      setHidden(goingDown && y > 160);
      lastY = y;
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const links = [
    { key: "work", href: "/work" },
    { key: "services", href: "/#services" },
    { key: "studio", href: "/studio" },
    { key: "love", href: "/love" },
    { key: "contact", href: "/contact" },
  ] as const;

  if (isProposal) {
    return (
      <motion.header
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: [0.4, 0, 0.2, 1] }}
        className="fixed top-4 left-0 right-0 z-50 px-4 lg:px-8 pointer-events-none"
      >
        <div className="max-w-[1280px] mx-auto pointer-events-auto">
          <div
            className="relative flex items-center justify-between gap-3 rounded-full pl-2 pr-2 lg:pl-3 lg:pr-4 h-[64px]"
            style={{
              background: "rgba(253, 253, 251, 0.72)",
              backdropFilter: "blur(20px) saturate(140%)",
              WebkitBackdropFilter: "blur(20px) saturate(140%)",
              border: "1px solid rgba(229, 226, 220, 0.6)",
              boxShadow: "0 6px 24px -8px rgba(29, 29, 27, 0.12)",
            }}
          >
            <div className="flex items-center justify-center h-12 px-4 lg:px-5 rounded-full bg-[var(--color-bg)] border border-[var(--color-border)] shrink-0">
              <AnimatedLogo height={20} asLink={false} />
            </div>
            <LocaleSwitcher />
          </div>
        </div>
      </motion.header>
    );
  }

  return (
    <>
      <motion.header
        initial={{ opacity: 0, y: -20 }}
        animate={{
          opacity: 1,
          y: hidden ? -120 : 0,
        }}
        transition={{ duration: 0.4, ease: [0.4, 0, 0.2, 1] }}
        className="fixed top-4 left-0 right-0 z-50 px-4 lg:px-8 pointer-events-none"
      >
        <div className="max-w-[1280px] mx-auto pointer-events-auto">
          <div
            className="relative flex items-center justify-between gap-3 rounded-full pl-2 pr-2 lg:pl-3 lg:pr-3 h-[64px] transition-all duration-300"
            style={{
              background: scrolled
                ? "rgba(253, 253, 251, 0.72)"
                : "rgba(253, 253, 251, 0.55)",
              backdropFilter: "blur(20px) saturate(140%)",
              WebkitBackdropFilter: "blur(20px) saturate(140%)",
              border: "1px solid rgba(229, 226, 220, 0.6)",
              boxShadow: scrolled
                ? "0 12px 40px -12px rgba(29, 29, 27, 0.18)"
                : "0 6px 24px -8px rgba(29, 29, 27, 0.12)",
            }}
          >
            {/* Logo pill */}
            <Link
              href="/"
              aria-label="Bellostas Studio"
              className="flex items-center justify-center h-12 px-4 lg:px-5 rounded-full bg-[var(--color-bg)] border border-[var(--color-border)] shrink-0 hover:border-[var(--color-text)] transition-colors"
            >
              <AnimatedLogo height={20} asLink={false} />
            </Link>

            {/* Center nav */}
            <nav className="hidden lg:flex items-center gap-7 mx-2">
              {links.map((l) => (
                <Link
                  key={l.key}
                  href={l.href}
                  className="group relative font-body text-[14px] text-[var(--color-text)] transition-colors hover:text-[var(--color-accent)]"
                >
                  {t(l.key)}
                  <span className="absolute left-0 -bottom-1 h-px w-0 bg-[var(--color-accent)] transition-[width] duration-300 group-hover:w-full" />
                </Link>
              ))}
            </nav>

            {/* Right actions */}
            <div className="flex items-center gap-2 lg:gap-3">
              <div className="hidden md:flex items-center">
                <LocaleSwitcher />
              </div>

              <div className="hidden sm:block">
                <PrimaryButton href="/intro" className="h-11 px-5 text-[13px]">
                  {t("cta")}
                </PrimaryButton>
              </div>

              <button
                type="button"
                className="lg:hidden p-3 -mr-1"
                aria-label={t("openMenu")}
                onClick={() => setMenuOpen(true)}
              >
                <Menu size={20} />
              </button>
            </div>
          </div>
        </div>
      </motion.header>

      <MobileMenu open={menuOpen} onClose={() => setMenuOpen(false)} />
    </>
  );
}
