"use client";

import { useEffect, useState } from "react";
import { ArrowRight } from "lucide-react";

type LenisLike = { scrollTo: (target: Element | number, opts?: { offset?: number }) => void };

/**
 * Barra inferior fija SOLO en móvil (el menú lateral no existe ahí): aparece
 * cuando el lector pasa la sección de inversión y desaparece cuando el
 * formulario de aceptar ya está a la vista. Muestra el total + CTA.
 */
export function ProposalMobileCta({
  total,
  label,
}: {
  total: string;
  label: string;
}) {
  const [show, setShow] = useState(false);

  useEffect(() => {
    const inversion = document.getElementById("inversion");
    const aceptar = document.getElementById("aceptar");
    if (!inversion || !aceptar) return;

    let pastInversion = false;
    let acceptVisible = false;
    const update = () => setShow(pastInversion && !acceptVisible);

    // "Pasó la inversión" = el inicio de la sección ya quedó por encima del viewport.
    const obsInv = new IntersectionObserver(
      ([e]) => {
        pastInversion = e.boundingClientRect.top < 0;
        update();
      },
      { rootMargin: "0px 0px -100% 0px" }
    );
    obsInv.observe(inversion);

    const obsAccept = new IntersectionObserver(
      ([e]) => {
        acceptVisible = e.isIntersecting;
        update();
      },
      { rootMargin: "0px 0px -20% 0px" }
    );
    obsAccept.observe(aceptar);

    return () => {
      obsInv.disconnect();
      obsAccept.disconnect();
    };
  }, []);

  const go = () => {
    const el = document.getElementById("aceptar");
    if (!el) return;
    const lenis = (window as unknown as { __lenis?: LenisLike }).__lenis;
    if (lenis) lenis.scrollTo(el, { offset: -90 });
    else el.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div
      className={`lg:hidden fixed bottom-0 inset-x-0 z-40 transition-transform duration-300 ${
        show ? "translate-y-0" : "translate-y-full"
      }`}
    >
      <div
        className="flex items-center justify-between gap-3 px-5 py-3 pb-[max(12px,env(safe-area-inset-bottom))]"
        style={{
          background: "rgba(253, 253, 251, 0.92)",
          backdropFilter: "blur(16px) saturate(140%)",
          WebkitBackdropFilter: "blur(16px) saturate(140%)",
          borderTop: "1px solid var(--color-border)",
        }}
      >
        <span className="font-body text-[15px] font-medium text-[var(--color-text)] tabular-nums">
          {total}
        </span>
        <button
          type="button"
          onClick={go}
          className="inline-flex items-center gap-2 rounded-full bg-[var(--color-text)] hover:bg-[var(--color-accent)] px-5 py-2.5 font-body text-[13px] font-medium text-white transition-colors"
        >
          {label}
          <ArrowRight size={14} />
        </button>
      </div>
    </div>
  );
}
