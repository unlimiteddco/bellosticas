"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { motion } from "framer-motion";
import { Maximize2, X } from "lucide-react";

export type Clausula = { titulo: string; parrafos: string[] };

/**
 * El contrato, para leerlo sin salir del formulario.
 *
 * Con scroll dentro de su caja y un botón para verlo a pantalla completa:
 * nadie firma con gusto un documento que solo asoma por una rendija.
 *
 * El texto llega ya montado desde el servidor, del mismo sitio del que sale
 * el PDF que se firma. No hay dos versiones.
 */
export function ContractReader({
  clausulas,
  titulo,
  fecha,
  expandLabel,
  closeLabel,
}: {
  clausulas: Clausula[];
  titulo: string;
  fecha: string;
  expandLabel: string;
  closeLabel: string;
}) {
  const [ampliado, setAmpliado] = useState(false);
  // El modal se monta en <body>: dentro del asistente vive bajo un motion.div,
  // y una transformación crea su propio contexto de apilamiento — el z-index
  // deja de competir con la cabecera y el botón de cerrar queda debajo.
  const [montado, setMontado] = useState(false);
  useEffect(() => setMontado(true), []);

  useEffect(() => {
    if (!ampliado) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setAmpliado(false);
    document.addEventListener("keydown", onKey);
    const previo = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = previo;
    };
  }, [ampliado]);

  const Texto = ({ compacto }: { compacto?: boolean }) => (
    <div className={compacto ? "" : "max-w-[720px] mx-auto"}>
      <p className="font-display text-[20px] text-[var(--color-text)]">{titulo}</p>
      <p className="font-body text-[12px] text-[var(--color-text-muted)] mt-0.5 mb-6">{fecha}</p>
      {clausulas.map((c, i) => (
        <section key={i} className="mb-6">
          <h4
            className="font-body uppercase text-[10px] text-[var(--color-text-muted)] mb-2"
            style={{ letterSpacing: "0.16em" }}
          >
            {c.titulo}
          </h4>
          {c.parrafos.map((t, j) => (
            <p
              key={j}
              className="font-body text-[13.5px] leading-[1.65] text-[var(--color-text)]/85 mb-2"
            >
              {t}
            </p>
          ))}
        </section>
      ))}
    </div>
  );

  return (
    <>
      <div className="relative">
        <div className="max-h-[340px] overflow-y-auto rounded-xl border border-[var(--color-border)] bg-white p-6">
          <Texto compacto />
        </div>
        <button
          type="button"
          onClick={() => setAmpliado(true)}
          className="absolute top-3 right-3 inline-flex items-center gap-1.5 rounded-full bg-[var(--color-bg)] border border-[var(--color-border)] px-3 py-1.5 font-body text-[12px] text-[var(--color-text-muted)] hover:text-[var(--color-text)] transition-colors"
        >
          <Maximize2 size={12} />
          {expandLabel}
        </button>
      </div>

      {ampliado && montado && createPortal(
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="fixed inset-0 z-[100] bg-[var(--color-bg)] overflow-y-auto"
          role="dialog"
          aria-modal="true"
          aria-label={titulo}
        >
          <div className="sticky top-0 z-10 flex justify-end p-4 pt-[max(16px,env(safe-area-inset-top))] bg-[var(--color-bg)]/95 backdrop-blur border-b border-[var(--color-border)]">
            <button
              type="button"
              onClick={() => setAmpliado(false)}
              className="inline-flex items-center gap-2 rounded-full border border-[var(--color-border)] px-4 py-2 font-body text-[13px] text-[var(--color-text)]"
            >
              <X size={14} /> {closeLabel}
            </button>
          </div>
          <div className="px-6 pb-24">
            <Texto />
          </div>
        </motion.div>,
        document.body,
      )}
    </>
  );
}
