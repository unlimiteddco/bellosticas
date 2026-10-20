"use client";

import { useEffect, useState } from "react";
import { Cookie } from "lucide-react";
import { useCookieConsent } from "@/components/cookies/CookieProvider";
import { sonarClic, sonarHover } from "@/lib/v2/ui-sound";

/** El índice de un texto legal, con el apartado en pantalla marcado en rojo. */
export function IndiceLegal({ etiqueta, secciones }: { etiqueta: string; secciones: { id: string; n: string; texto: string }[] }) {
  const [activo, setActivo] = useState(secciones[0]?.id ?? "");

  useEffect(() => {
    const obs = new IntersectionObserver(
      (entradas) => entradas.forEach((e) => e.isIntersecting && setActivo(e.target.id)),
      { rootMargin: "-100px 0px -70% 0px" },
    );
    secciones.forEach((s) => {
      const el = document.getElementById(s.id);
      if (el) obs.observe(el);
    });
    return () => obs.disconnect();
  }, [secciones]);

  return (
    <nav aria-label={etiqueta} className="flex flex-col gap-3">
      <span className="v2-label">{etiqueta}</span>
      <ul className="flex flex-col border-l border-[var(--v2-line)]">
        {secciones.map((s, i) => (
          <li key={s.id}>
            <a
              href={`#${s.id}`}
              onPointerEnter={(e) => e.pointerType === "mouse" && sonarHover(i)}
              onClick={() => sonarClic("select", i)}
              className={`-ml-px flex gap-3 border-l-2 py-1.5 pl-4 text-[13.5px] leading-[1.4] transition-colors ${
                activo === s.id
                  ? "border-[var(--v2-accent)] text-[var(--v2-text)]"
                  : "border-transparent text-[var(--v2-muted)] hover:text-[var(--v2-text)]"
              }`}
            >
              {s.n && <span className="font-mono text-[11px] leading-[1.75] text-[var(--v2-faint)]">{s.n}</span>}
              {s.texto}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}

/** Abre la ventana de ajustes de cookies (la de la V2). */
export function BotonAjustesCookies({ etiqueta }: { etiqueta: string }) {
  const { openModal } = useCookieConsent();
  return (
    <button
      type="button"
      className="v2-btn v2-btn--primary v2-btn--sm"
      onClick={() => {
        sonarClic("open");
        openModal();
      }}
    >
      <Cookie size={14} /> {etiqueta}
    </button>
  );
}
