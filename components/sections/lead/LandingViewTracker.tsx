"use client";

import { useEffect, useRef } from "react";
import { getTrackingContext } from "@/lib/tracking";

/**
 * Registra una visita a la landing /g/[slug] en el CRM (para el panel de
 * rendimiento: visitas → suscriptores → conversión).
 *
 * Se dispara una sola vez por montaje y usa `keepalive` para que la petición
 * sobreviva si el visitante se va enseguida. Nunca bloquea ni rompe la página:
 * si falla, se ignora en silencio (una métrica no puede tumbar una landing).
 */
export function LandingViewTracker({
  slug,
  title,
  type,
}: {
  slug: string;
  title: string;
  type: string;
}) {
  const sent = useRef(false);

  useEffect(() => {
    if (sent.current) return;
    sent.current = true;

    let tracking: unknown = null;
    try {
      tracking = getTrackingContext();
    } catch {
      /* sin contexto de tracking seguimos: la visita cuenta igual */
    }

    fetch("/api/lead-magnet/view", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ slug, title, type, tracking }),
      keepalive: true,
    }).catch(() => {});
  }, [slug, title, type]);

  return null;
}
