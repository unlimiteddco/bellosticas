"use client";

import { useState } from "react";
import { ArrowRight, Lock } from "lucide-react";
import { buildCalAttribution } from "@/lib/tracking";
import { T, type Idioma } from "@/lib/tienda-textos";

/**
 * Compra de un producto digital: la casilla de las condiciones y el botón que
 * lleva a Stripe Checkout. La casilla es obligatoria por ley: el contenido
 * digital se entrega al momento, así que antes de pagar se acepta perder el
 * derecho de desistimiento al descargarlo.
 */
export function BotonComprar({
  producto,
  precio,
  disponible,
  idioma,
}: {
  producto: string;
  precio: string;
  disponible: boolean;
  idioma: Idioma;
}) {
  const t = T[idioma];
  const [acepta, setAcepta] = useState(false);
  const [estado, setEstado] = useState<"" | "yendo">("");
  const [error, setError] = useState("");

  async function comprar() {
    if (!acepta) {
      setError(t.marcaCasilla);
      return;
    }
    setError("");
    setEstado("yendo");
    try {
      const r = await fetch("/api/tienda/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ producto, idioma, acepta: true, atribucion: buildCalAttribution() }),
      });
      const j = (await r.json().catch(() => ({}))) as { url?: string; error?: string };
      if (!r.ok || !j.url) throw new Error(j.error ?? t.errorPago);
      window.location.href = j.url;
    } catch (e) {
      setError(e instanceof Error ? e.message : t.errorPago);
      setEstado("");
    }
  }

  if (!disponible) {
    return (
      <div className="rounded-[6px] border border-[var(--v2-line)] px-4 py-4 text-center text-[15px] text-[var(--v2-muted)]">
        {t.pronto}
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-3">
      <label className="flex cursor-pointer items-start gap-3 text-left text-[13.5px] leading-[1.5] text-[var(--v2-muted)]">
        <input
          type="checkbox"
          checked={acepta}
          onChange={(e) => {
            setAcepta(e.target.checked);
            if (e.target.checked) setError("");
          }}
          className="mt-[3px] h-4 w-4 shrink-0 accent-[var(--v2-accent)]"
        />
        <span>
          {t.acepto[0]}
          <a href="#condiciones" className="underline underline-offset-2 hover:text-[var(--v2-text)]">
            {t.acepto[1]}
          </a>
          {t.acepto[2]}
        </span>
      </label>
      <button
        type="button"
        onClick={comprar}
        disabled={estado === "yendo"}
        className="v2-btn v2-btn--primary h-[54px] w-full text-[16px] disabled:opacity-60"
      >
        {estado === "yendo" ? t.abriendo : t.comprar(precio)}
        <ArrowRight size={17} strokeWidth={1.8} />
      </button>
      {error && (
        <p role="alert" className="text-center text-[13.5px] text-[var(--v2-accent)]">
          {error}
        </p>
      )}
      <p className="flex items-center justify-center gap-1.5 text-[12.5px] text-[var(--v2-faint)]">
        <Lock size={12} strokeWidth={2} /> {t.pagoSeguro}
      </p>
    </div>
  );
}
