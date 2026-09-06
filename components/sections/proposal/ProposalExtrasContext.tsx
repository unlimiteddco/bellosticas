"use client";

import { createContext, useContext, useMemo, useState } from "react";
import type { ProposalExtra } from "@/lib/proposals";

type Ctx = {
  extras: ProposalExtra[];
  seleccion: string[];
  alternar: (id: string) => void;
  /** Suma base de lo marcado, sin IVA. */
  extrasBase: number;
};

const ProposalExtrasCtx = createContext<Ctx | null>(null);

/**
 * Estado compartido de los añadidos. Lo necesitan tres sitios lejanos entre sí:
 * las casillas, la barra del total y el formulario de aceptar.
 */
export function ProposalExtrasProvider({
  extras,
  children,
}: {
  extras: ProposalExtra[];
  children: React.ReactNode;
}) {
  const [seleccion, setSeleccion] = useState<string[]>([]);

  const value = useMemo<Ctx>(() => {
    const alternar = (id: string) =>
      setSeleccion((s) => (s.includes(id) ? s.filter((x) => x !== id) : [...s, id]));
    const extrasBase = extras
      .filter((e) => seleccion.includes(e.id))
      .reduce((acc, e) => acc + (Number(e.price) || 0), 0);
    return { extras, seleccion, alternar, extrasBase };
  }, [extras, seleccion]);

  return <ProposalExtrasCtx.Provider value={value}>{children}</ProposalExtrasCtx.Provider>;
}

/** Devuelve null si no hay proveedor: la propuesta puede no tener añadidos. */
export function useProposalExtras(): Ctx | null {
  return useContext(ProposalExtrasCtx);
}
