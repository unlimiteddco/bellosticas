"use client";

import { useRef, useState } from "react";
import { sonarClic, sonarHover } from "@/lib/v2/ui-sound";

export type Paso = { title: string; text: string; outputs: string[] };

/**
 * El proceso en pestañas: una fila numerada arriba y, debajo, la fase elegida
 * (qué pasa en ella a la izquierda; lo que sale de ella a la derecha). En el
 * móvil la fila de pestañas se desliza de lado. ← → mueven entre pestañas.
 */
export function ProcesoTabs({ pasos, etiquetaSalidas }: { pasos: Paso[]; etiquetaSalidas: string }) {
  const [activo, setActivo] = useState(0);
  const botones = useRef<(HTMLButtonElement | null)[]>([]);
  const paso = pasos[activo];
  const num = (n: number) => String(n + 1).padStart(2, "0");

  const elegir = (i: number) => {
    if (i === activo) return;
    sonarClic("select", i);
    setActivo(i);
  };

  const onKey = (e: React.KeyboardEvent) => {
    if (e.key !== "ArrowRight" && e.key !== "ArrowLeft") return;
    e.preventDefault();
    const i = (activo + (e.key === "ArrowRight" ? 1 : -1) + pasos.length) % pasos.length;
    elegir(i);
    botones.current[i]?.focus();
  };

  return (
    <div>
      <div
        role="tablist"
        aria-orientation="horizontal"
        onKeyDown={onKey}
        // Una columna por fase, sean 5 o 6 (migraciones tiene 6).
        style={{ "--fases": pasos.length } as React.CSSProperties}
        className="flex overflow-x-auto border-y border-[var(--v2-line)] [scrollbar-width:none] lg:grid lg:grid-cols-[repeat(var(--fases),minmax(0,1fr))]"
      >
        {pasos.map((p, i) => {
          const on = i === activo;
          return (
            <button
              key={p.title}
              ref={(el) => {
                botones.current[i] = el;
              }}
              type="button"
              role="tab"
              id={`v2-paso-${i}`}
              aria-selected={on}
              aria-controls="v2-paso-panel"
              tabIndex={on ? 0 : -1}
              onPointerEnter={(e) => e.pointerType === "mouse" && sonarHover(i)}
              onClick={() => elegir(i)}
              className={`relative flex shrink-0 items-center gap-2.5 border-r border-[var(--v2-line)] px-5 py-4 text-left text-[14px] font-medium transition-colors last:border-r-0 md:px-6 ${
                on ? "bg-[var(--v2-hover)] text-[var(--v2-text)]" : "text-[var(--v2-muted)] hover:text-[var(--v2-text)]"
              }`}
            >
              <span className={`font-mono text-[11px] ${on ? "text-[var(--v2-accent)]" : ""}`}>{num(i)}</span>
              {p.title}
              <span
                aria-hidden
                className="absolute bottom-[-1px] left-0 right-0 h-[2px] origin-left bg-[var(--v2-accent)] transition-transform duration-500 ease-[var(--v2-ease-out)]"
                style={{ transform: on ? "scaleX(1)" : "scaleX(0)" }}
              />
            </button>
          );
        })}
      </div>

      <div
        role="tabpanel"
        id="v2-paso-panel"
        aria-labelledby={`v2-paso-${activo}`}
        className="grid grid-cols-1 border-b border-[var(--v2-line)] lg:grid-cols-12"
      >
        {/* key: cada fase vuelve a entrar al cambiar de pestaña. */}
        <div key={`a-${activo}`} className="flex flex-col gap-5 p-6 md:p-10 lg:col-span-7 lg:p-14">
          <span className="v2-hero-in font-display text-[84px] italic leading-none text-[var(--v2-accent)] md:text-[112px]">
            {num(activo)}
          </span>
          <h3
            className="v2-hero-in text-[30px] font-medium leading-[1.1] tracking-[-0.025em] md:text-[40px]"
            style={{ animationDelay: "60ms" }}
          >
            {paso.title}
          </h3>
          <p
            className="v2-hero-in max-w-[520px] text-[16px] leading-[1.65] text-[var(--v2-muted)]"
            style={{ animationDelay: "120ms" }}
          >
            {paso.text}
          </p>
        </div>
        <div
          key={`b-${activo}`}
          className="flex flex-col border-t border-[var(--v2-line)] lg:col-span-5 lg:border-l lg:border-t-0"
        >
          <span className="v2-label border-b border-[var(--v2-line)] px-6 py-4 md:px-10">{etiquetaSalidas}</span>
          <ol>
            {paso.outputs.map((o, i) => (
              <li
                key={o}
                className="v2-hero-in flex items-baseline gap-4 border-b border-[var(--v2-line)] px-6 py-4 text-[15px] last:border-b-0 md:px-10"
                style={{ animationDelay: `${80 + i * 60}ms` }}
              >
                <span className="font-mono text-[11px] text-[var(--v2-faint)]">{num(i)}</span>
                {o}
              </li>
            ))}
          </ol>
        </div>
      </div>
    </div>
  );
}
