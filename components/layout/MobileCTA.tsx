"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ArrowRight } from "lucide-react";
import { useTranslations } from "next-intl";

/** Donde no hace falta: ya se está reservando, contactando o firmando. */
const SIN_BOTON = ["/intro", "/contact", "/contacto", "/propuestas/", "/preview"];

/**
 * El botón de «Agenda una llamada», fijo abajo en el móvil.
 *
 * En pantallas pequeñas el botón del menú no cabe y se esconde: quedaban solo
 * el icono de WhatsApp y el menú, y para reservar había que llegar al final de
 * la página. Este aparece al pasar el primer pantallazo y se queda. Va a la
 * izquierda porque a la derecha vive el vídeo de testimonio flotante.
 */
export function MobileCTA() {
  const t = useTranslations("nav");
  const ruta = usePathname();
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    // Solo cambia el estado al cruzar el umbral, no en cada evento de scroll.
    const mirar = () => setVisible((v) => (window.scrollY > 520) !== v ? !v : v);
    mirar();
    window.addEventListener("scroll", mirar, { passive: true });
    return () => window.removeEventListener("scroll", mirar);
  }, []);

  if (SIN_BOTON.some((p) => ruta?.includes(p))) return null;

  return (
    <Link
      href="/intro"
      aria-hidden={!visible}
      tabIndex={visible ? 0 : -1}
      className={`sm:hidden fixed left-4 z-40 inline-flex h-12 items-center gap-2 rounded-full bg-[var(--color-text)] pl-5 pr-4 font-body text-[13.5px] font-medium text-[var(--color-bg)] shadow-[0_16px_36px_-12px_rgba(29,29,27,0.55)] transition-all duration-300 ${
        visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4 pointer-events-none"
      }`}
      style={{ bottom: "calc(1rem + env(safe-area-inset-bottom, 0px))" }}
    >
      {t("mobileCta")}
      <ArrowRight size={15} />
    </Link>
  );
}
