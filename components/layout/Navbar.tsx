"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Menu } from "lucide-react";
import { motion } from "framer-motion";
import { useTranslations } from "next-intl";
import { PrimaryButton } from "@/components/ui/PrimaryButton";
import { AnimatedLogo } from "@/components/ui/AnimatedLogo";
import { LocaleSwitcher } from "./LocaleSwitcher";
import { MobileMenu } from "./MobileMenu";
import { cn } from "@/lib/utils";

export function Navbar() {
  const t = useTranslations("nav");
  const [scrolled, setScrolled] = useState(false);
  const [hidden, setHidden] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    let lastY = window.scrollY;
    const onScroll = () => {
      const y = window.scrollY;
      setScrolled(y > 50);
      const goingDown = y > lastY;
      setHidden(goingDown && y > 120);
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

  return (
    <>
      <motion.header
        initial={{ opacity: 0, y: -20 }}
        animate={{
          opacity: 1,
          y: hidden ? -100 : 0,
        }}
        transition={{ duration: 0.4, ease: [0.4, 0, 0.2, 1] }}
        className={cn(
          "fixed top-0 left-0 right-0 z-50 h-20",
          "bg-[rgba(253,253,251,0.85)] backdrop-blur-md",
          "transition-[border-color] duration-300",
          scrolled
            ? "border-b border-[var(--color-border)]"
            : "border-b border-transparent",
        )}
      >
        <div className="h-full max-w-[1280px] mx-auto px-6 lg:px-12 flex items-center justify-between gap-6">
          <AnimatedLogo height={24} />

          <nav className="hidden lg:flex items-center gap-10">
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

          <div className="flex items-center gap-4 lg:gap-6">
            <LocaleSwitcher />
            <div className="hidden lg:block">
              <PrimaryButton href="/intro">{t("cta")}</PrimaryButton>
            </div>
            <button
              type="button"
              className="lg:hidden p-2 -m-2"
              aria-label={t("openMenu")}
              onClick={() => setMenuOpen(true)}
            >
              <Menu size={22} />
            </button>
          </div>
        </div>
      </motion.header>

      <MobileMenu open={menuOpen} onClose={() => setMenuOpen(false)} />
    </>
  );
}

