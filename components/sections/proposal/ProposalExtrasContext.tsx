"use client";

import { createContext, useContext, useMemo, useState } from "react";
import type { ProposalExtra } from "@/lib/proposals";

type Ctx = {
  extras: ProposalExtra[];
  seleccion: string[];
  alternar: (id: string) => void;
  /** Suma base de lo marcado, sin IVA. */
  extrasBase: number;
  /** Moneda de la propuesta: EUR, GBP o USD. */
  moneda: string;
};

const ProposalExtrasCtx = createContext<Ctx | null>(null);

/**
 * Estado compartido de los añadidos. Lo necesitan tres sitios lejanos entre sí:
 * las casillas, la barra del total y el formulario de aceptar.
 */
export function ProposalExtrasProvider({
  extras,
  moneda = "EUR",
  children,
}: {
  extras: ProposalExtra[];
  moneda?: string;
  children: React.ReactNode;
}) {
  const [seleccion, setSeleccion] = useState<string[]>([]);

  const value = useMemo<Ctx>(() => {
    const alternar = (id: string) =>
      setSeleccion((s) => (s.includes(id) ? s.filter((x) => x !== id) : [...s, id]));
    const extrasBase = extras
      .filter((e) => seleccion.includes(e.id))
      .reduce((acc, e) => acc + (Number(e.price) || 0), 0);
    return { extras, seleccion, alternar, extrasBase, moneda };
  }, [extras, seleccion, moneda]);

  return <ProposalExtrasCtx.Provider value={value}>{children}</ProposalExtrasCtx.Provider>;
}

/** La moneda de la propuesta, para los importes de los componentes de cliente. */
export function useMonedaPropuesta(): string {
  return useContext(ProposalExtrasCtx)?.moneda ?? "EUR";
}

/** Devuelve null si no hay proveedor: la propuesta puede no tener añadidos. */
export function useProposalExtras(): Ctx | null {
  return useContext(ProposalExtrasCtx);
}
