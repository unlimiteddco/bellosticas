"use client";

import { useState } from "react";
import { sonarClic, sonarHover } from "@/lib/v2/ui-sound";
import { ProcesoTabs, type Paso } from "@/components/v2/servicio/ProcesoTabs";

export type ProcesoDeServicio = { clave: string; nombre: string; pasos: Paso[] };

/**
 * Elige un servicio y ve sus fases: una fila de pastillas encima y, debajo,
 * las pestañas del proceso de ese servicio (las mismas que en su página).
 * Al cambiar de servicio las pestañas vuelven a la primera fase.
 */
export function SelectorServicio({ servicios, etiquetaSalidas }: { servicios: ProcesoDeServicio[]; etiquetaSalidas: string }) {
  const [activo, setActivo] = useState(0);
  const s = servicios[activo];
  return (
    <div>
      <div role="group" className="flex flex-wrap justify-center gap-2 px-6 pb-10">
        {servicios.map((x, i) => {
          const on = i === activo;
          return (
            <button
              key={x.clave}
              type="button"
              aria-pressed={on}
              onPointerEnter={(e) => e.pointerType === "mouse" && sonarHover(i)}
              onClick={() => {
                if (on) return;
                sonarClic("select", i);
                setActivo(i);
              }}
              className={`h-9 rounded-[6px] border px-4 text-[14px] font-medium transition-colors ${
                on
                  ? "border-[var(--v2-text)] bg-[var(--v2-text)] text-[var(--v2-bg)]"
                  : "border-[var(--v2-line)] text-[var(--v2-muted)] hover:border-[var(--v2-line-strong)] hover:text-[var(--v2-text)]"
              }`}
            >
              {x.nombre}
            </button>
          );
        })}
      </div>
      <ProcesoTabs key={s.clave} pasos={s.pasos} etiquetaSalidas={etiquetaSalidas} />
    </div>
  );
}
