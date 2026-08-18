"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import { useTranslations } from "next-intl";
import { useReducedMotion } from "@/lib/hooks/useReducedMotion";

/**
 * El portal de cliente, en real.
 *
 * Antes había un mockup dibujado a mano; ahora es una captura del portal
 * funcionando con un cliente de verdad — que es lo que hace que se crea.
 * Se presenta como una ventana flotante: marco redondeado, borde y sombra
 * larga, con un desplazamiento suave al hacer scroll.
 */
export function ClientPortalMockup() {
  const t = useTranslations("clientPortal.mockup");
  const reduced = useReducedMotion();
  const ref = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });
  const y = useTransform(scrollYProgress, [0, 1], [40, -40]);

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, scale: 0.95, y: 60 }}
      whileInView={{ opacity: 1, scale: 1, y: 0 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ duration: 0.8, ease: "easeOut" }}
      style={{ y: reduced ? 0 : y }}
      className="lg:col-span-7 relative"
    >
      {/* Resplandor suave detrás: separa la ventana del fondo claro */}
      <div
        aria-hidden
        className="absolute -inset-6 rounded-[32px] bg-[var(--color-text)]/[0.06] blur-2xl"
      />

      <figure className="relative m-0">
        <div className="rounded-2xl overflow-hidden border border-[var(--color-text)]/15 bg-[#0F0E0C] shadow-[0_40px_80px_-32px_rgba(29,29,27,0.45)]">
          {/* Barra de ventana: sitúa la captura como una app, sin recargar */}
          <div className="flex items-center gap-1.5 px-4 py-2.5 bg-[#141311] border-b border-white/[0.06]">
            <span className="h-2.5 w-2.5 rounded-full bg-white/15" />
            <span className="h-2.5 w-2.5 rounded-full bg-white/15" />
            <span className="h-2.5 w-2.5 rounded-full bg-white/15" />
            <span
              className="ml-3 font-mono text-[10px] text-white/35"
              style={{ letterSpacing: "0.08em" }}
            >
              portal.bellostas.studio
            </span>
          </div>

          {/* eslint-disable-next-line @next/next/no-img-element -- asset local ya optimizado */}
          <img
            src="/images/portal-cliente.webp"
            alt={t("alt")}
            width={1600}
            height={906}
            loading="lazy"
            decoding="async"
            className="block w-full h-auto"
          />
        </div>
      </figure>
    </motion.div>
  );
}
