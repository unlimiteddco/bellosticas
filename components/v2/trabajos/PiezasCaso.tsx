"use client";

import { useEffect, useRef, useState } from "react";
import { ArrowUpRight, Play } from "lucide-react";
import { Link } from "@/navigation";
import { TestimonialLightbox, type LightboxVideo } from "@/components/sections/TestimonialLightbox";
import { TESTIMONIAL_MEDIA, type TestimonialId } from "@/lib/testimonial-media";
import { sonarClic } from "@/lib/v2/ui-sound";

/** El vídeo grande del caso: en bucle y en silencio, solo mientras se ve. */
export function VideoCaso({ src, poster }: { src: string; poster?: string }) {
  const ref = useRef<HTMLVideoElement>(null);
  useEffect(() => {
    const v = ref.current;
    if (!v) return;
    const io = new IntersectionObserver(([e]) => (e.isIntersecting ? v.play().catch(() => {}) : v.pause()), {
      threshold: 0.2,
    });
    io.observe(v);
    return () => io.disconnect();
  }, []);
  return (
    <video
      ref={ref}
      src={src}
      poster={poster}
      muted
      loop
      playsInline
      preload="metadata"
      className="absolute inset-0 h-full w-full object-cover"
    />
  );
}

/** «Ver vídeo» junto a la cita, si el cliente grabó su testimonio. */
export function BotonVideoTestimonio({
  id,
  etiqueta,
  nombre,
  cargo,
  empresa,
}: {
  id: TestimonialId;
  etiqueta: string;
  nombre: string;
  cargo: string;
  empresa: string;
}) {
  const [video, setVideo] = useState<LightboxVideo | null>(null);
  const media = TESTIMONIAL_MEDIA[id];
  return (
    <>
      <button
        type="button"
        onClick={() => {
          sonarClic("open");
          setVideo({ videoSrc: media.video, posterSrc: media.poster, name: nombre, role: cargo, company: empresa, chapters: media.chapters });
        }}
        className="v2-btn v2-btn--ghost v2-btn--sm self-start"
      >
        <Play size={12} fill="currentColor" /> {etiqueta}
      </button>
      <TestimonialLightbox video={video} onClose={() => setVideo(null)} />
    </>
  );
}

/**
 * La barra fija de abajo en cada caso (como en DesignMe): cliente, la llamada
 * y el año. Se aparta cuando llega el footer, para no taparlo.
 */
export function BarraCaso({
  cliente,
  ano,
  web,
  t,
}: {
  cliente: string;
  ano: string;
  web?: string;
  t: { cliente: string; ano: string; llamada: string; web: string };
}) {
  const [oculta, setOculta] = useState(false);
  useEffect(() => {
    const pie = document.querySelector("#v2-root footer");
    if (!pie) return;
    const io = new IntersectionObserver(([e]) => setOculta(e.isIntersecting));
    io.observe(pie);
    return () => io.disconnect();
  }, []);
  return (
    <div
      inert={oculta}
      className={`fixed inset-x-0 bottom-0 z-40 border-t border-[var(--v2-line)] bg-[var(--v2-bg)]/90 backdrop-blur-md transition-transform duration-500 ease-[var(--v2-ease-out)] ${
        oculta ? "translate-y-full" : ""
      }`}
    >
      <div className="v2-frame flex h-14 items-center justify-between gap-4 px-4 md:px-6">
        <span className="flex min-w-0 items-center gap-3 text-[13.5px]">
          <span className="v2-label hidden sm:inline">{t.cliente}</span>
          <span aria-hidden className="hidden h-px w-8 bg-[var(--v2-line-strong)] sm:inline-block" />
          <span className="truncate font-medium">{cliente}</span>
        </span>
        <span className="flex shrink-0 items-center gap-2">
          {web && (
            <a href={web} target="_blank" rel="noopener" className="v2-btn v2-btn--ghost v2-btn--sm hidden sm:inline-flex">
              {t.web} <ArrowUpRight size={13} />
            </a>
          )}
          <Link href="/v2/intro" className="v2-btn v2-btn--primary v2-btn--sm" onClick={() => sonarClic("select")}>
            {t.llamada}
          </Link>
        </span>
        {ano && (
          <span className="hidden items-center gap-3 text-[13.5px] md:flex">
            <span className="v2-label">{t.ano}</span>
            <span aria-hidden className="h-px w-8 bg-[var(--v2-line-strong)]" />
            <span className="font-medium tabular-nums">{ano}</span>
          </span>
        )}
      </div>
    </div>
  );
}
