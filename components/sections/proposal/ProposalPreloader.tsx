"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useTranslations } from "next-intl";
import { useReducedMotion } from "@/lib/hooks/useReducedMotion";
import { Logo } from "@/components/ui/Logo";

/**
 * Recibimiento de la propuesta.
 *
 * No es el preloader genérico de la web: aquí se saluda al cliente POR SU
 * NOMBRE y después el telón se abre para enseñarle el documento. Es la
 * diferencia entre "una web bonita" y "esto lo han preparado para mí", y en
 * una propuesta esa sensación llega antes que el precio.
 *
 * Se muestra UNA vez por sesión y por propuesta: la segunda vez que abre el
 * enlace ya no está descubriendo nada, está buscando una cifra.
 */
const TELON = 0.85; // segundos que tarda en abrirse
const ESPERA = 1900; // ms de saludo antes de abrir

export function ProposalPreloader({ clientName }: { clientName?: string | null }) {
  const t = useTranslations("proposalPage");
  const reduced = useReducedMotion();
  const [fase, setFase] = useState<"saludo" | "abriendo" | "fuera">("saludo");

  useEffect(() => {
    if (typeof window === "undefined") return;
    const clave = `bs:proposal-welcome:${window.location.pathname}`;

    // Ya lo vio en esta sesión, o pidió menos animación: directo al documento.
    if (sessionStorage.getItem(clave) || reduced) {
      setFase("fuera");
      return;
    }

    document.body.style.overflow = "hidden";
    document.body.setAttribute("aria-busy", "true");
    // La cabecera se esconde: flotando sobre el telón rompe el momento.
    document.documentElement.setAttribute("data-proposal-welcome", "");

    const abrir = setTimeout(() => {
      setFase("abriendo");
      // Se devuelve aquí, no al final: así entra fundiéndose mientras el
      // telón se separa, en vez de aparecer de golpe sobre la propuesta.
      document.documentElement.removeAttribute("data-proposal-welcome");
    }, ESPERA);
    const salir = setTimeout(() => {
      sessionStorage.setItem(clave, "1");
      setFase("fuera");
    }, ESPERA + TELON * 1000);

    return () => {
      clearTimeout(abrir);
      clearTimeout(salir);
      document.body.style.overflow = "";
      document.body.removeAttribute("aria-busy");
      document.documentElement.removeAttribute("data-proposal-welcome");
    };
  }, [reduced]);

  // Salga por donde salga, el scroll se devuelve.
  useEffect(() => {
    if (fase === "fuera") {
      document.body.style.overflow = "";
      document.body.removeAttribute("aria-busy");
      document.documentElement.removeAttribute("data-proposal-welcome");
    }
  }, [fase]);

  // Sin AnimatePresence a propósito: no hace falta animación de salida (el
  // telón ya se ha ido) y su desmontaje se quedaba atascado, dejando la capa
  // tapando la propuesta para siempre. Un condicional no puede fallar así.
  if (fase === "fuera") return null;

  const nombre = (clientName ?? "").trim().split(/\s+/)[0] || "";
  const abriendo = fase === "abriendo";
  const salida = { duration: TELON, ease: [0.76, 0, 0.24, 1] as const };

  return (
    <div className="fixed inset-0 z-[9998] pointer-events-none" aria-hidden>
      {/* Telón: dos mitades que se separan. Que la propuesta "se abra" lee
          mejor que un fundido — hay un antes y un después. */}
      <motion.div
        className="absolute inset-x-0 top-0 h-1/2 bg-[var(--color-text)]"
        initial={{ y: 0 }}
        animate={{ y: abriendo ? "-100%" : 0 }}
        transition={salida}
      />
      <motion.div
        className="absolute inset-x-0 bottom-0 h-1/2 bg-[var(--color-text)]"
        initial={{ y: 0 }}
        animate={{ y: abriendo ? "100%" : 0 }}
        transition={salida}
      />

      <motion.div
        className="absolute inset-0 flex flex-col items-center justify-center gap-6 px-8 text-center"
        animate={{ opacity: abriendo ? 0 : 1 }}
        transition={{ duration: 0.32, ease: "easeOut" }}
      >
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
        >
          <Logo variant="white-red" height={34} priority />
        </motion.div>

        {/* El nombre entra desde debajo de una máscara: se descubre, no
            aparece. Es el gesto que hace que parezca hecho a mano. */}
        <div className="overflow-hidden">
          <motion.p
            className="font-display text-[34px] md:text-[52px] leading-[1.1] text-[var(--color-bg)]"
            initial={{ y: "110%" }}
            animate={{ y: 0 }}
            transition={{ duration: 0.75, delay: 0.28, ease: [0.22, 1, 0.36, 1] }}
          >
            {nombre ? t("welcome_hello", { name: nombre }) : t("welcome_hello_generic")}
          </motion.p>
        </div>

        <div className="overflow-hidden">
          <motion.p
            className="font-body text-[13px] md:text-[14px] uppercase text-[var(--color-bg)]/55"
            style={{ letterSpacing: "0.18em" }}
            initial={{ y: "120%" }}
            animate={{ y: 0 }}
            transition={{ duration: 0.7, delay: 0.5, ease: [0.22, 1, 0.36, 1] }}
          >
            {t("welcome_sub")}
          </motion.p>
        </div>
      </motion.div>
    </div>
  );
}
