"use client";

import { useEffect, useState } from "react";
import { Smartphone } from "lucide-react";
import { useTranslations } from "next-intl";
import type { FacturaTrasFirma } from "./PagoTrasFirma";

/**
 * «Firmar desde el móvil», en el paso de firma de la propuesta.
 *
 * Firmar con el ratón es lo más torpe de todo el recorrido. Un enlace pequeño
 * (solo donde hay ratón: en el teléfono ya se firma con el dedo) abre un QR que
 * lleva a una página que solo tiene la firma. Mientras el QR está a la vista,
 * se pregunta cada pocos segundos si ya se ha firmado y, en cuanto sí, esta
 * pestaña pasa sola al pago.
 */
export function FirmaDesdeMovil({
  token,
  alFirmar,
}: {
  token: string;
  alFirmar: (factura: FacturaTrasFirma | null) => void;
}) {
  const t = useTranslations("proposalPage");
  const [abierto, setAbierto] = useState(false);
  const [qr, setQr] = useState<string | null>(null);

  const alternar = async () => {
    if (abierto) return setAbierto(false);
    if (!qr) {
      try {
        const qrcode = (await import("qrcode-generator")).default;
        const codigo = qrcode(0, "M");
        // La misma propuesta (con su idioma en la ruta) + /firmar, marcada como
        // abierta desde el QR: al terminar dirá «vuelve al ordenador».
        // Desde la propuesta o desde su página de firma: la ruta acaba igual.
        const ruta = window.location.pathname.replace(/\/+$/, "").replace(/\/firmar$/, "");
        codigo.addData(`${window.location.origin}${ruta}/firmar?desde=movil`);
        codigo.make();
        setQr(codigo.createSvgTag({ cellSize: 4, margin: 2, scalable: true }));
      } catch {
        return; // sin QR se firma aquí, como siempre
      }
    }
    setAbierto(true);
  };

  useEffect(() => {
    if (!abierto) return;
    const desde = Date.now();
    const reloj = window.setInterval(async () => {
      // Un cuarto de hora mirando es de sobra.
      if (Date.now() - desde > 15 * 60_000) return window.clearInterval(reloj);
      try {
        const r = await fetch(`/api/propuestas/${encodeURIComponent(token)}/firma`, { cache: "no-store" });
        if (!r.ok) return;
        const d = (await r.json()) as { signed?: boolean; invoice?: FacturaTrasFirma | null };
        if (d.signed) {
          window.clearInterval(reloj);
          alFirmar(d.invoice ?? null);
        }
      } catch {
        // Sin red un momento: se vuelve a preguntar en la siguiente vuelta.
      }
    }, 4000);
    return () => window.clearInterval(reloj);
  }, [abierto, token, alFirmar]);

  return (
    <div className="mt-4 hidden flex-col items-start gap-3 [@media(hover:hover)_and_(pointer:fine)]:flex">
      <button
        type="button"
        onClick={alternar}
        aria-expanded={abierto}
        className="inline-flex items-center gap-1.5 font-body text-[13px] text-[var(--color-text-muted)] underline decoration-[var(--color-border)] underline-offset-[3px] hover:text-[var(--color-text)] transition-colors"
      >
        <Smartphone size={14} />
        {abierto ? t("mobile_sign_hide") : t("mobile_sign_link")}
      </button>
      {abierto && qr && (
        <div className="flex w-full max-w-[520px] items-center gap-5 rounded-xl border border-[var(--color-border)] p-4">
          {/* El SVG lo genera aquí mismo la librería de QR: no viene de fuera. */}
          <span
            role="img"
            aria-label={t("mobile_sign_qr")}
            className="block h-[132px] w-[132px] shrink-0 rounded-md bg-white p-1.5 [&_svg]:block [&_svg]:h-full [&_svg]:w-full"
            dangerouslySetInnerHTML={{ __html: qr }}
          />
          <span className="flex min-w-0 flex-col gap-1.5 font-body text-[13.5px] leading-[1.5] text-[var(--color-text-muted)]">
            <b className="font-medium text-[15px] text-[var(--color-text)]">{t("mobile_sign_title")}</b>
            <span>{t("mobile_sign_body")}</span>
            <span className="text-[12.5px]">{t("mobile_sign_wait")}</span>
          </span>
        </div>
      )}
    </div>
  );
}
