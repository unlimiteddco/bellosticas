"use client";

import { useEffect } from "react";
import { ArrowRight, X } from "lucide-react";
import { usePathname } from "@/navigation";

type Props = {
  id: string;
  clave: string;
  alto: number;
  url: string;
  sinAviso: string[];
  textos: { etiqueta: string; texto: string; cerrar: string };
};

export function AnnouncementBarClient({ id, clave, alto, url, sinAviso, textos }: Props) {
  const ruta = usePathname();
  const fuera = sinAviso.some((p) => ruta?.includes(p));

  // El menú es fijo y la barra no: al bajar, la barra se va con la página y el
  // menú tiene que subir a su sitio. `--aviso-h` es lo que queda de barra a la vista.
  useEffect(() => {
    const raiz = document.documentElement;
    if (fuera) {
      raiz.setAttribute("data-aviso-cerrado", "");
      return;
    }
    // Solo se escribe cuando el valor cambia. Una variable en :root obliga al
    // navegador a recalcular los estilos de TODA la página; escribirla en cada
    // evento de scroll —aunque fuera siempre «0px»— daba tirones al bajar.
    let ultimo = -1;
    const medir = () => {
      if (raiz.hasAttribute("data-aviso-cerrado")) return;
      const v = Math.max(0, alto - Math.round(window.scrollY));
      if (v === ultimo) return;
      ultimo = v;
      raiz.style.setProperty("--aviso-h", `${v}px`);
    };
    medir();
    window.addEventListener("scroll", medir, { passive: true });
    return () => window.removeEventListener("scroll", medir);
  }, [alto, fuera]);

  const cerrar = () => {
    const raiz = document.documentElement;
    raiz.setAttribute("data-aviso-cerrado", "");
    raiz.style.removeProperty("--aviso-h");
    try {
      localStorage.setItem(clave, id);
    } catch {
      // Sin almacenamiento (modo privado estricto) se cierra igual, solo para esta visita.
    }
  };

  if (fuera) return null;

  return (
    <div
      data-aviso
      className="relative z-[3] flex items-center justify-center bg-[var(--color-text)] text-[var(--color-bg)] px-11"
      style={{ height: alto }}
    >
      {/* Una sola frase y una flecha: toda la barra es el enlace. */}
      <a
        href={url}
        target="_blank"
        rel="noopener"
        className="group flex min-w-0 items-center gap-2 font-body text-[13.5px] leading-none"
      >
        <span className="truncate">
          <strong className="font-semibold">{textos.etiqueta}:</strong> {textos.texto}
        </span>
        <ArrowRight size={15} className="shrink-0 transition-transform duration-200 group-hover:translate-x-1" />
      </a>
      <button
        type="button"
        onClick={cerrar}
        aria-label={textos.cerrar}
        className="absolute right-1.5 top-1/2 -translate-y-1/2 flex h-8 w-8 items-center justify-center rounded-full text-[var(--color-bg)]/60 hover:text-[var(--color-bg)] hover:bg-[var(--color-bg)]/10 transition-colors cursor-pointer"
      >
        <X size={15} strokeWidth={1.75} />
      </button>
    </div>
  );
}
