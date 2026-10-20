"use client";

import { useLayoutEffect } from "react";

/**
 * Pone el tema guardado («bs-theme») en cada página de la V2. El script en
 * línea de V2Root solo corre al cargar la web; al pasar de una página a otra
 * sin recargar (Link de Next) no vuelve a ejecutarse y la página nueva nacía en
 * claro. Esto corre antes de pintar, así que no hay destello.
 */
export function TemaRoot() {
  useLayoutEffect(() => {
    const raiz = document.getElementById("v2-root");
    if (!raiz) return;
    let tema = "light";
    try {
      const guardado = localStorage.getItem("bs-theme");
      if (guardado === "dark" || guardado === "light") tema = guardado;
    } catch {
      /* sin almacenamiento: claro */
    }
    raiz.setAttribute("data-theme", tema);
    raiz.classList.add("v2-js");
    // Que los botones de tema (cabecera y menú móvil) se enteren.
    window.dispatchEvent(new Event("bs-theme-change"));
  }, []);
  return null;
}
