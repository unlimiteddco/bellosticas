"use client";

import { useEffect } from "react";
import { iniciarEntradas } from "@/lib/v2/reveal";

/** Arranca las entradas al hacer scroll dentro de la raíz de la V2. */
export function RevealRoot() {
  useEffect(() => {
    const raiz = document.getElementById("v2-root");
    if (!raiz) return;
    return iniciarEntradas(raiz);
  }, []);
  return null;
}
