"use client";

import { useEffect, useRef, useState } from "react";
import { useReducedMotion } from "@/lib/hooks/useReducedMotion";

/**
 * Visual de la hero de /studio: el estudio de verdad, en vídeo.
 *
 * Antes había un panel decorativo (degradado + retícula + asterisco). Un plano
 * real del sitio donde se trabaja dice más que cualquier gráfico.
 *
 * Rendimiento: el vídeo no se monta hasta que el panel se acerca a la vista, y
 * con "reducir movimiento" activado se queda en el póster, sin reproducir.
 */
export function StudioHeroVisual() {
  const reduced = useReducedMotion();
  const ref = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          io.disconnect();
        }
      },
      { rootMargin: "300px" },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  useEffect(() => {
    if (visible && !reduced) videoRef.current?.play().catch(() => {});
  }, [visible, reduced]);

  return (
    <div
      ref={ref}
      className="relative overflow-hidden rounded-lg bg-[#14110D] shadow-[0_30px_70px_-40px_rgba(29,29,27,0.5)]"
      style={{ aspectRatio: "4 / 5" }}
    >
      {visible && (
        <video
          ref={videoRef}
          poster="/studio/oficina-poster.jpg"
          muted
          loop
          playsInline
          preload="none"
          aria-hidden
          className="absolute inset-0 w-full h-full object-cover"
          style={{ objectPosition: "50% 42%" }}
        >
          <source src="/studio/oficina.mp4" type="video/mp4" />
        </video>
      )}

      {/* Velo suave: unifica el plano con la marca y deja respirar los bordes */}
      <div
        aria-hidden
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "linear-gradient(160deg, rgba(20,17,13,0.12) 0%, rgba(20,17,13,0.05) 45%, rgba(20,17,13,0.42) 100%)",
        }}
      />

      {/* Marco fino de marca */}
      <div
        aria-hidden
        className="absolute inset-0 rounded-lg pointer-events-none ring-1 ring-inset ring-white/10"
      />
    </div>
  );
}
