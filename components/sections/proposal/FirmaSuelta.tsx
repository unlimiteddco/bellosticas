"use client";

import { useCallback, useState } from "react";
import { Check, FileText, Loader2 } from "lucide-react";
import { useTranslations } from "next-intl";
import { PrimaryButton } from "@/components/ui/PrimaryButton";
import { SignaturePad } from "./SignaturePad";
import { PagoTrasFirma, type FacturaTrasFirma } from "./PagoTrasFirma";
import { FirmaDesdeMovil } from "./FirmaDesdeMovil";

/**
 * Solo la firma del contrato de una propuesta ya aceptada: el nombre, la
 * rúbrica y enviar. Sin la propuesta, sin precios, sin nada más.
 *
 * Se llega aquí de dos formas:
 * - Con el QR de «firmar desde el móvil» (desdeMovil): al terminar, se le dice
 *   que vuelva al ordenador, que ya ha pasado solo al pago.
 * - Reabriendo una propuesta aceptada que quedó sin firmar: al terminar, ve
 *   el pago aquí mismo.
 */
export function FirmaSuelta({
  token,
  titulo,
  nombreInicial,
  desdeMovil,
}: {
  token: string;
  titulo: string;
  nombreInicial: string;
  desdeMovil: boolean;
}) {
  const t = useTranslations("proposalPage");
  const [rubrica, setRubrica] = useState<string | null>(null);
  const [nombre, setNombre] = useState(nombreInicial);
  const [firmando, setFirmando] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hecho, setHecho] = useState<{ factura: FacturaTrasFirma | null } | null>(null);
  // Abierta en el ordenador (al volver a firmar): también se puede firmar con el móvil.
  const firmadoEnElMovil = useCallback((factura: FacturaTrasFirma | null) => setHecho({ factura }), []);

  const firmar = async () => {
    if (!rubrica || firmando || nombre.trim().length < 3) return;
    setFirmando(true);
    setError(null);
    try {
      const r = await fetch(`/api/propuestas/${encodeURIComponent(token)}/firmar`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ signature: rubrica, signer_name: nombre.trim() }),
      });
      const d = await r.json().catch(() => null);
      if (!r.ok || !d?.signed) {
        setError(d?.error ?? t("wizard_sign_error"));
        return;
      }
      setHecho({ factura: d.invoice ?? null });
      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch {
      setError(t("wizard_sign_error"));
    } finally {
      setFirmando(false);
    }
  };

  if (hecho) {
    return desdeMovil ? (
      <div>
        <span className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-[var(--color-accent)]/12">
          <Check size={22} className="text-[var(--color-accent)]" strokeWidth={2.5} />
        </span>
        <h1 className="mt-5 font-display text-[30px] leading-tight text-[var(--color-text)]">{t("signpage_done_title")}</h1>
        <p className="mt-2 font-body text-[16px] leading-[1.6] text-[var(--color-text)]/85">{t("signpage_done_body")}</p>
      </div>
    ) : (
      <PagoTrasFirma factura={hecho.factura} />
    );
  }

  return (
    <div>
      <span className="v2-label">{t("signpage_label")}</span>
      <h1 className="mt-4 font-display text-[30px] md:text-[36px] leading-tight text-[var(--color-text)]">
        {t("signpage_title")}
      </h1>
      <p className="mt-2 font-body text-[16px] leading-[1.55] text-[var(--color-text-muted)]">{titulo}</p>

      <a
        href={`/api/propuestas/${encodeURIComponent(token)}/contrato/pdf`}
        target="_blank"
        rel="noopener"
        className="mt-4 inline-flex items-center gap-2 font-body text-[14px] text-[var(--color-text-muted)] hover:text-[var(--color-text)] transition-colors"
      >
        <FileText size={15} />
        {t("wizard_sign_read")}
      </a>

      <label className="mt-8 flex flex-col gap-2">
        <span className="font-body uppercase text-[11px] text-[var(--color-text-muted)]" style={{ letterSpacing: "0.14em" }}>
          {t("wizard_sign_name")}
          <span className="text-[var(--color-accent)]"> *</span>
        </span>
        <input
          type="text"
          value={nombre}
          required
          autoComplete="name"
          onChange={(e) => setNombre(e.target.value)}
          /* 16px: por debajo, iOS hace zoom al enfocar. */
          className="w-full h-12 px-3 rounded-md bg-transparent border border-[var(--color-border)] text-[16px] font-body text-[var(--color-text)] focus:border-[var(--color-text)] focus:outline-none transition-colors"
        />
      </label>

      <p className="mt-6 font-body uppercase text-[10px] text-[var(--color-text-muted)]" style={{ letterSpacing: "0.2em" }}>
        {t("wizard_sign_your")}
      </p>
      <div className="mt-3">
        <SignaturePad
          onChange={setRubrica}
          clearLabel={t("wizard_sign_clear")}
          hint={t("wizard_sign_hint")}
          drawLabel={t("wizard_sign_draw")}
          typeLabel={t("wizard_sign_type")}
          typePlaceholder={t("wizard_sign_type_hint")}
          typedName={nombre}
        />
      </div>

      <p className="mt-5 font-body text-[12px] leading-[1.6] text-[var(--color-text-muted)]">{t("wizard_sign_evidence")}</p>
      {error && <p className="mt-4 font-body text-[14px] text-[var(--color-accent)]">{error}</p>}

      <div className="mt-6">
        <PrimaryButton
          onClick={firmar}
          disabled={firmando || !rubrica || nombre.trim().length < 3}
          aria-busy={firmando}
          className="w-full justify-center"
        >
          {firmando ? (
            <span className="inline-flex items-center gap-2">
              <Loader2 size={15} className="animate-spin" /> {t("sending")}
            </span>
          ) : (
            t("wizard_cta_signnow")
          )}
        </PrimaryButton>
        {!desdeMovil && <FirmaDesdeMovil token={token} alFirmar={firmadoEnElMovil} />}
      </div>
    </div>
  );
}
