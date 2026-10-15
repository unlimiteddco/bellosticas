"use client";

import { useEffect, useRef } from "react";
import { useTranslations } from "next-intl";
import { CLIENTS } from "@/components/sections/LogoMarquee";

/**
 * Los logos de clientes, cada uno en su celda con líneas (la valoración de
 * Google va en el hero, bajo los botones). El carrusel no se para al pasar el ratón: se frena poco a poco (y
 * vuelve a su ritmo al salir), que se lee mejor que un frenazo en seco.
 */
export function LogoCells() {
  const t = useTranslations("logos");
  const pista = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = pista.current;
    if (!el) return;
    let objetivo = 1;
    let actual = 1;
    let raf = 0;
    const paso = () => {
      actual += (objetivo - actual) * 0.08;
      el.getAnimations().forEach((a) => a.updatePlaybackRate(actual));
      if (Math.abs(objetivo - actual) > 0.01) raf = requestAnimationFrame(paso);
    };
    const ir = (v: number) => {
      objetivo = v;
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(paso);
    };
    const padre = el.parentElement!;
    const entra = () => ir(0.25);
    const sale = () => ir(1);
    padre.addEventListener("pointerenter", entra);
    padre.addEventListener("pointerleave", sale);
    return () => {
      cancelAnimationFrame(raf);
      padre.removeEventListener("pointerenter", entra);
      padre.removeEventListener("pointerleave", sale);
    };
  }, []);

  const fila = [...CLIENTS, ...CLIENTS];

  return (
    <section className="v2-frame">
      <div className="v2-rail border-t border-[var(--v2-line)]">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[var(--v2-line)] px-6 py-3 md:px-10">
          <span className="v2-label">{t("label")}</span>
        </div>
        <div className="relative overflow-hidden" style={{ maskImage: "linear-gradient(90deg, transparent, #000 6%, #000 94%, transparent)" }}>
          <div ref={pista} className="v2-ticker">
            {fila.map((c, n) => (
              <div
                key={`${c.name}-${n}`}
                className="flex h-[96px] w-[200px] shrink-0 items-center justify-center border-r border-[var(--v2-line)] md:w-[230px]"
                aria-hidden={n >= CLIENTS.length}
              >
                <img
                  src={c.src}
                  alt={n < CLIENTS.length ? c.name : ""}
                  style={{ height: Math.round(c.h * 0.85) }}
                  className="w-auto opacity-60 grayscale transition duration-300 hover:opacity-100 hover:grayscale-0 [.v2[data-theme=dark]_&]:invert"
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
