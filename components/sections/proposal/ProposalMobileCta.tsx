"use client";

import { useEffect, useState } from "react";
import { ArrowRight } from "lucide-react";

type LenisLike = { scrollTo: (target: Element | number, opts?: { offset?: number }) => void };

/**
 * Barra inferior fija SOLO en móvil (el menú lateral no existe ahí): aparece
 * cuando el lector pasa la sección de inversión y desaparece cuando el
 * formulario de aceptar ya está a la vista.
 *
 * Sin precio: el total ya lo ha leído justo encima. Repetirlo pegado al botón
 * convierte el último paso en una decisión de dinero otra vez, en vez de en
 * el gesto de continuar.
 */
export function ProposalMobileCta({ label }: { label: string }) {
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
      // Oculta = fuera del tabulador y del árbol de accesibilidad. Si no, se
      // enfoca un botón invisible al final de la página y el anillo de foco
      // desaparece de la pantalla.
      aria-hidden={!show}
      inert={!show ? true : undefined}
      className={`lg:hidden fixed bottom-0 inset-x-0 z-40 transition-transform duration-300 ${
        show ? "translate-y-0" : "translate-y-full"
      }`}
    >
      <div
        className="px-5 py-3 pb-[max(12px,env(safe-area-inset-bottom))]"
        style={{
          background: "rgba(253, 253, 251, 0.92)",
          backdropFilter: "blur(16px) saturate(140%)",
          WebkitBackdropFilter: "blur(16px) saturate(140%)",
          borderTop: "1px solid var(--color-border)",
        }}
      >
        <button
          type="button"
          onClick={go}
          className="w-full inline-flex items-center justify-center gap-2 rounded-full bg-[var(--color-text)] hover:bg-[var(--color-accent)] px-5 py-3.5 font-body text-[15px] font-medium text-white transition-colors"
        >
          {label}
          <ArrowRight size={14} />
        </button>
      </div>
    </div>
  );
}
