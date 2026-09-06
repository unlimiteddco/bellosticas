"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useTranslations } from "next-intl";
import { useReducedMotion } from "@/lib/hooks/useReducedMotion";
import { Logo } from "@/components/ui/Logo";

/**
 * Recibimiento de la propuesta.
 *
 * No es el preloader genérico de la web: esto es la portada del documento.
 * Se lee "Propuesta preparada para" y debajo SU NOMBRE en grande, como la
 * primera página de algo encuadernado. Después el telón se parte y le deja
 * ver el interior.
 *
 * Todo lo que entra lo hace desde debajo de una máscara: no aparece, se
 * descubre. Es la diferencia entre una transición y un gesto.
 *
 * Se muestra UNA vez por sesión y por propuesta: la segunda visita ya no
 * viene a descubrir nada, viene a buscar una cifra.
 */
const TELON = 0.9; // segundos que tarda en abrirse
const ESPERA = 2300; // ms de portada antes de abrir

/** Curva de entrada: sale rápido y frena largo. Es la que da el aire caro. */
const SUAVE = [0.16, 1, 0.3, 1] as const;
/** Curva del telón: arranca lento, cruza rápido y asienta. */
const TELON_EASE = [0.83, 0, 0.17, 1] as const;

export function ProposalPreloader({ clientName }: { clientName?: string | null }) {
  const t = useTranslations("proposalPage");
  const reduced = useReducedMotion();
  const [fase, setFase] = useState<"portada" | "abriendo" | "fuera">("portada");

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
    document.documentElement.setAttribute("data-proposal-welcome", "");

    const abrir = setTimeout(() => {
      setFase("abriendo");
      // La cabecera vuelve aquí, no al final: entra fundiéndose mientras el
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

  // Salga por donde salga, el scroll y la cabecera se devuelven.
  useEffect(() => {
    if (fase === "fuera") {
      document.body.style.overflow = "";
      document.body.removeAttribute("aria-busy");
      document.documentElement.removeAttribute("data-proposal-welcome");
    }
  }, [fase]);

  // Render condicional en vez de AnimatePresence: no hay animación de salida
  // que esperar, así que el desmontaje no puede quedarse a medias.
  if (fase === "fuera") return null;

  const nombre = (clientName ?? "").trim();
  const abriendo = fase === "abriendo";

  /** Línea que se descubre subiendo desde detrás de su propia máscara. */
  const Linea = ({
    children,
    delay,
    duracion = 0.9,
  }: {
    children: React.ReactNode;
    delay: number;
    duracion?: number;
  }) => (
    <div className="overflow-hidden">
      <motion.div
        initial={{ y: "115%" }}
        animate={{ y: abriendo ? "-115%" : 0 }}
        transition={{ duration: abriendo ? 0.5 : duracion, delay: abriendo ? 0 : delay, ease: SUAVE }}
      >
        {children}
      </motion.div>
    </div>
  );

  return (
    <div className="fixed inset-0 z-[9998] pointer-events-none" aria-hidden>
      {/* Telón: dos mitades que se separan. Que la propuesta "se abra" lee
          mejor que un fundido — hay un antes y un después. La mitad de abajo
          sale una pizca más tarde: la simetría perfecta se nota artificial. */}
      <motion.div
        className="absolute inset-x-0 top-0 h-1/2 bg-[var(--color-text)]"
        initial={{ y: 0 }}
        animate={{ y: abriendo ? "-100%" : 0 }}
        transition={{ duration: TELON, ease: TELON_EASE }}
      />
      <motion.div
        className="absolute inset-x-0 bottom-0 h-1/2 bg-[var(--color-text)]"
        initial={{ y: 0 }}
        animate={{ y: abriendo ? "100%" : 0 }}
        transition={{ duration: TELON, delay: abriendo ? 0.06 : 0, ease: TELON_EASE }}
      />

      <div className="absolute inset-0 flex flex-col items-center justify-center px-8 text-center">
        <motion.div
          className="mb-9"
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: abriendo ? 0 : 1, y: 0 }}
          transition={{ duration: abriendo ? 0.3 : 0.7, ease: SUAVE }}
        >
          <Logo variant="white-red" height={30} priority />
        </motion.div>

        <Linea delay={0.34} duracion={0.8}>
          <span
            className="block font-body uppercase text-[10px] md:text-[11px] text-[var(--color-bg)]/45"
            style={{ letterSpacing: "0.26em" }}
          >
            {nombre ? t("welcome_eyebrow") : t("welcome_eyebrow_generic")}
          </span>
        </Linea>

        {nombre && (
          <Linea delay={0.46} duracion={1}>
            <span className="block mt-4 font-display text-[38px] md:text-[64px] leading-[1.05] text-[var(--color-bg)]">
              {nombre}
            </span>
          </Linea>
        )}

        {/* La regla se dibuja sola de izquierda a derecha: cierra la portada
            y marca que ya está todo puesto. */}
        <motion.span
          className="block mt-8 h-px w-[132px] md:w-[168px] origin-left bg-[var(--color-bg)]/25"
          initial={{ scaleX: 0 }}
          animate={{ scaleX: abriendo ? 0 : 1 }}
          transition={{
            duration: abriendo ? 0.35 : 0.85,
            delay: abriendo ? 0 : 0.95,
            ease: SUAVE,
          }}
        />
      </div>

      <motion.span
        className="absolute bottom-7 left-7 font-body uppercase text-[10px] text-[var(--color-bg)]/35"
        style={{ letterSpacing: "0.22em" }}
        initial={{ opacity: 0 }}
        animate={{ opacity: abriendo ? 0 : 1 }}
        transition={{ duration: abriendo ? 0.25 : 0.9, delay: abriendo ? 0 : 0.8 }}
      >
        {t("welcome_studio")}
      </motion.span>
    </div>
  );
}
