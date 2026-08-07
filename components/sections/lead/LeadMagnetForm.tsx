"use client";

import { useState } from "react";
import { getTrackingContext } from "@/lib/tracking";

/**
 * Formulario de captura de la landing /g/[slug].
 *
 * Pide nombre + email + UNA pregunta de segmentación de un toque («¿cuál es
 * tu caso?») que etiqueta al suscriptor hacia el servicio que le encaja
 * (SEO local / webs / white-label / nurture). Teléfono y país fuera: matan
 * conversión y no aportan a este embudo.
 *
 * Entrega SOLO por email: al enviar, el servidor resuelve el recurso, guarda
 * el suscriptor en el CRM y el CRM manda la guía por correo.
 *
 * Detalles móvil: inputs a 16px (evita el zoom automático de iOS) y botón
 * de altura generosa para el pulgar.
 */

export const SEGMENTS = [
  { value: "negocio_local", label: "Tengo un negocio local" },
  { value: "negocio_online", label: "Tengo una tienda online / negocio digital" },
  { value: "freelance_agencia", label: "Soy freelance o tengo una agencia" },
  { value: "sin_negocio", label: "Todavía no tengo negocio" },
] as const;

const inputClass =
  "mt-2 w-full rounded-xl border border-[var(--color-border)] bg-[var(--color-bg)] px-4 py-3.5 font-body text-[16px] text-[var(--color-text)] placeholder:text-[var(--color-text-muted)]/60 focus:outline-none focus:border-[var(--color-accent)] transition-colors";

export function LeadMagnetForm({
  slug,
  ctaLabel,
}: {
  slug: string;
  ctaLabel: string;
}) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [segment, setSegment] = useState("");
  const [consent, setConsent] = useState(false);
  const [state, setState] = useState<"idle" | "sending" | "done" | "error">("idle");
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const cleanName = name.trim();
    const cleanEmail = email.trim().toLowerCase();
    if (cleanName.length < 2) {
      setError("Dime tu nombre para poder enviártela.");
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(cleanEmail)) {
      setError("Revisa el email — parece incompleto.");
      return;
    }
    if (!segment) {
      setError("Elige tu caso — así te envío solo lo que te sirve.");
      return;
    }
    if (!consent) {
      setError("Marca la casilla de privacidad para poder enviarte la guía.");
      return;
    }
    setError(null);
    setState("sending");
    try {
      const res = await fetch("/api/lead-magnet", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: cleanName,
          email: cleanEmail,
          segment,
          slug,
          consent: true,
          tracking: getTrackingContext(),
        }),
      });
      const data = (await res.json().catch(() => null)) as { ok?: boolean; error?: string } | null;
      if (!res.ok || !data?.ok) {
        setState("error");
        setError(data?.error ?? "No se pudo enviar. Prueba otra vez en unos segundos.");
        return;
      }
      setState("done");
    } catch {
      setState("error");
      setError("Error de conexión. Prueba otra vez.");
    }
  }

  if (state === "done") {
    return (
      <div className="rounded-2xl border border-[var(--color-border)] bg-white px-6 py-8 text-center">
        <span
          className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-[var(--color-accent)]/10 text-[var(--color-accent)] text-[22px] font-bold"
          aria-hidden
        >
          ✓
        </span>
        <p className="mt-4 font-display text-[24px] leading-[1.15] text-[var(--color-text)]">
          ¡Hecho, {name.trim().split(/\s+/)[0]}! Revisa tu correo
        </p>
        <p className="mt-2 font-body text-[14.5px] leading-[1.6] text-[var(--color-text-muted)]">
          Te la acabo de enviar a <strong className="text-[var(--color-text)]">{email.trim()}</strong>.
          <br />
          Si no la ves en un par de minutos, mira en spam o promociones.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="rounded-2xl border border-[var(--color-border)] bg-white px-5 py-6">
      <div>
        <label htmlFor="lm-name" className="block font-body text-[14px] font-medium text-[var(--color-text)]">
          Tu nombre
        </label>
        <input
          id="lm-name"
          type="text"
          autoComplete="given-name"
          placeholder="Antonio"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
          className={inputClass}
        />
      </div>

      <div className="mt-3.5">
        <label htmlFor="lm-email" className="block font-body text-[14px] font-medium text-[var(--color-text)]">
          Tu email
        </label>
        <input
          id="lm-email"
          type="email"
          inputMode="email"
          autoComplete="email"
          placeholder="tu@email.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className={inputClass}
        />
      </div>

      <div className="mt-3.5">
        <label htmlFor="lm-segment" className="block font-body text-[14px] font-medium text-[var(--color-text)]">
          ¿Cuál es tu caso?
        </label>
        <select
          id="lm-segment"
          value={segment}
          onChange={(e) => setSegment(e.target.value)}
          required
          className={`${inputClass} appearance-none ${segment ? "" : "text-[var(--color-text-muted)]/60"}`}
        >
          <option value="" disabled>
            Elige una opción
          </option>
          {SEGMENTS.map((s) => (
            <option key={s.value} value={s.value} className="text-[var(--color-text)]">
              {s.label}
            </option>
          ))}
        </select>
      </div>

      <label className="mt-4 flex items-start gap-2.5 cursor-pointer select-none">
        <input
          type="checkbox"
          checked={consent}
          onChange={(e) => setConsent(e.target.checked)}
          className="mt-[3px] h-4 w-4 accent-[var(--color-accent)]"
        />
        <span className="font-body text-[12.5px] leading-[1.5] text-[var(--color-text-muted)]">
          Acepto recibir la guía y algún email útil de Bellostas Studio.{" "}
          <a
            href="/privacidad"
            target="_blank"
            rel="noopener"
            className="underline underline-offset-2 hover:text-[var(--color-text)]"
          >
            Política de privacidad
          </a>
          . Date de baja cuando quieras.
        </span>
      </label>

      {error && (
        <p role="alert" className="mt-3 font-body text-[13px] text-[var(--color-accent)]">
          {error}
        </p>
      )}

      <button
        type="submit"
        disabled={state === "sending"}
        className="mt-4 w-full rounded-xl bg-[var(--color-accent)] px-6 py-4 font-body font-semibold text-[16px] text-white transition-opacity hover:opacity-90 disabled:opacity-60"
      >
        {state === "sending" ? "Enviando…" : ctaLabel}
      </button>

      <p className="mt-3 text-center font-body text-[12px] text-[var(--color-text-muted)]">
        Gratis. Sin spam. Directa a tu bandeja.
      </p>
    </form>
  );
}
