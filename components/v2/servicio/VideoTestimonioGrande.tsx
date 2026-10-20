"use client";

import { useState } from "react";
import { Play } from "lucide-react";
import { TestimonialLightbox, type LightboxVideo } from "@/components/sections/TestimonialLightbox";
import { TESTIMONIAL_MEDIA, type TestimonialId } from "@/lib/testimonial-media";
import { sonarClic, sonarHover } from "@/lib/v2/ui-sound";

/**
 * Un vídeo-testimonio en grande: la miniatura con el botón de play y, al
 * pulsar, el reproductor de siempre. Para cuando un testimonio merece su propio
 * bloque (el de Social11 en Marca blanca).
 */
export function VideoTestimonioGrande({
  id,
  nombre,
  cargo,
  empresa,
  etiqueta,
}: {
  id: TestimonialId;
  nombre: string;
  cargo: string;
  empresa: string;
  etiqueta: string;
}) {
  const [video, setVideo] = useState<LightboxVideo | null>(null);
  const media = TESTIMONIAL_MEDIA[id];
  return (
    <>
      <button
        type="button"
        aria-label={`${etiqueta} · ${nombre}`}
        onPointerEnter={(e) => e.pointerType === "mouse" && sonarHover(0)}
        onClick={() => {
          sonarClic("open");
          setVideo({ videoSrc: media.video, posterSrc: media.poster, name: nombre, role: cargo, company: empresa, chapters: media.chapters });
        }}
        className="group relative block aspect-[4/3] w-full overflow-hidden rounded-[8px] border border-[var(--v2-line)] bg-black text-left lg:aspect-auto lg:h-full lg:min-h-[480px]"
      >
        <img
          src={media.poster}
          alt=""
          className="absolute inset-0 h-full w-full object-cover object-[50%_25%] transition-transform duration-[900ms] ease-[var(--v2-ease)] group-hover:scale-[1.03]"
        />
        <span aria-hidden className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />
        <span
          aria-hidden
          className="absolute left-1/2 top-1/2 flex h-20 w-20 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-white/90 text-black transition-[background-color,color,transform] duration-300 group-hover:scale-105 group-hover:bg-[var(--v2-accent)] group-hover:text-white"
        >
          <Play size={24} fill="currentColor" className="ml-1" />
        </span>
        <span className="absolute bottom-5 left-5 inline-flex items-center gap-1.5 bg-black/55 px-2 py-1 font-mono text-[10px] uppercase tracking-[0.12em] text-white">
          <Play size={10} fill="currentColor" /> {nombre} · {empresa}
        </span>
      </button>
      <TestimonialLightbox video={video} onClose={() => setVideo(null)} />
    </>
  );
}
