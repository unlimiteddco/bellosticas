"use client";

import { useEffect, useState } from "react";
import { X } from "lucide-react";
import { useTranslations } from "next-intl";
import { Link } from "@/navigation";
import { Logo } from "@/components/ui/Logo";
import type { TrabajoMenu } from "@/components/layout/WorkMegaMenu";
import { sonarClic } from "@/lib/v2/ui-sound";
import { SoundToggle, ThemeToggle } from "./Toggles";

type Destino = React.ComponentProps<typeof Link>["href"];

/**
 * El menú del móvil: pantalla completa, con Servicios y Trabajos en acordeón.
 * Mismas líneas y mismo sonido que en escritorio.
 */
export function MobileMenu({
  abierto,
  alCerrar,
  trabajos,
}: {
  abierto: boolean;
  alCerrar: () => void;
  trabajos: TrabajoMenu[];
}) {
  const t = useTranslations("nav");
  const ts = useTranslations("services");
  const [seccion, setSeccion] = useState<"services" | "work" | null>(null);

  // Con el menú abierto no se mueve la página de detrás.
  useEffect(() => {
    if (!abierto) return;
    const antes = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && alCerrar();
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = antes;
      window.removeEventListener("keydown", onKey);
    };
  }, [abierto, alCerrar]);

  const servicios: { href: Destino; titulo: string }[] = [
    { href: { pathname: "/v2", hash: "servicios" }, titulo: ts("acc.brand.title") },
    { href: "/services/desarrollo-web", titulo: ts("items.s01.title") },
    { href: "/services/ecommerce", titulo: ts("items.s02.title") },
    { href: "/services/aplicaciones-web", titulo: ts("items.s03.title") },
    { href: "/services/automatizaciones", titulo: ts("items.s04.title") },
    { href: "/services/migraciones", titulo: ts("items.s05.title") },
    { href: "/services/white-label", titulo: ts("items.s06.title") },
  ];
  const trabajo: { href: Destino; titulo: string }[] = [
    { href: "/work", titulo: t("wm.work.title") },
    { href: "/proceso", titulo: t("wm.process.title") },
    { href: "/love", titulo: t("wm.clients.title") },
    ...trabajos
      .filter((p) => !p.comingSoon)
      .slice(0, 4)
      .map((p) => ({ href: { pathname: "/work" as const, query: { caso: p.slug } }, titulo: p.name })),
  ];

  const elegir = () => {
    sonarClic("select");
    alCerrar();
  };

  const acordeon = (clave: "services" | "work", lista: { href: Destino; titulo: string }[]) => {
    const on = seccion === clave;
    return (
      <li className="border-b border-[var(--v2-line)]">
        <button
          type="button"
          className="flex w-full items-center justify-between py-4 text-[22px] font-medium"
          aria-expanded={on}
          onClick={() => {
            sonarClic(on ? "close" : "open");
            setSeccion(on ? null : clave);
          }}
        >
          {t(clave)}
          <span aria-hidden className="v2-plus text-[var(--v2-accent)]">+</span>
        </button>
        <div
          className="grid transition-[grid-template-rows] duration-300 ease-out"
          style={{ gridTemplateRows: on ? "1fr" : "0fr" }}
        >
          <ul className="overflow-hidden">
            {lista.map((l) => (
              <li key={l.titulo}>
                <Link href={l.href} onClick={elegir} className="block py-2 text-[16px] text-[var(--v2-muted)]">
                  {l.titulo}
                </Link>
              </li>
            ))}
            <li className="h-3" />
          </ul>
        </div>
      </li>
    );
  };

  return (
    <div
      className={`fixed inset-0 z-[60] flex flex-col bg-[var(--v2-bg)] transition-[opacity,transform] duration-300 lg:hidden ${
        abierto ? "opacity-100" : "pointer-events-none -translate-y-2 opacity-0"
      }`}
      role="dialog"
      aria-modal="true"
      aria-hidden={!abierto}
      inert={!abierto}
    >
      <div className="v2-frame flex h-[60px] w-full items-center justify-between border-b border-[var(--v2-line)] px-5 md:px-0">
        <Link href="/v2" onClick={elegir} aria-label="Bellostas Studio">
          <span className="v2-solo-claro">
            <Logo variant="black" height={20} />
          </span>
          <span className="v2-solo-oscuro">
            <Logo variant="white-red" height={20} />
          </span>
        </Link>
        <button
          type="button"
          className="inline-flex h-9 w-9 items-center justify-center rounded-md hover:bg-[var(--v2-hover)]"
          aria-label={t("closeMenu")}
          onClick={() => {
            sonarClic("close");
            alCerrar();
          }}
        >
          <X size={20} strokeWidth={1.75} />
        </button>
      </div>

      <nav className="v2-frame w-full flex-1 overflow-y-auto px-5 md:px-0">
        <ul className="pt-2">
          {acordeon("services", servicios)}
          {acordeon("work", trabajo)}
          {(["studio", "contact"] as const).map((k) => (
            <li key={k} className="border-b border-[var(--v2-line)]">
              <Link href={`/${k}`} onClick={elegir} className="block py-4 text-[22px] font-medium">
                {t(k)}
              </Link>
            </li>
          ))}
        </ul>
      </nav>

      <div className="v2-frame flex w-full items-center justify-between gap-3 border-t border-[var(--v2-line)] px-5 py-4 md:px-0">
        <div className="flex items-center gap-1">
          <SoundToggle />
          <ThemeToggle />
        </div>
        <Link href="/intro" onClick={elegir} className="v2-btn v2-btn--primary">
          {t("cta")}
        </Link>
      </div>
    </div>
  );
}
