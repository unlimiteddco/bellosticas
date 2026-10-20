"use client";

import { useState } from "react";
import { Play } from "lucide-react";
import { TestimonialLightbox, type LightboxVideo } from "@/components/sections/TestimonialLightbox";
import { TESTIMONIAL_MEDIA, type TestimonialId } from "@/lib/testimonial-media";
import { sonarClic, sonarHover } from "@/lib/v2/ui-sound";

export type VideoCliente = { id: TestimonialId; name: string; role: string; company: string; quote: string };

/**
 * Los dos vídeo-testimonios en grande: la miniatura con la frase encima y, al
 * pulsar, el reproductor (el mismo de la home). Sin guion: lo que dijeron.
 */
export function VideosClientes({ videos, etiqueta }: { videos: VideoCliente[]; etiqueta: string }) {
  const [abierto, setAbierto] = useState<LightboxVideo | null>(null);
  return (
    <>
      <div className="grid grid-cols-1 gap-px bg-[var(--v2-line)] md:grid-cols-2">
        {videos.map((v, i) => {
          const media = TESTIMONIAL_MEDIA[v.id];
          return (
            <button
              key={v.id}
              type="button"
              onPointerEnter={(e) => e.pointerType === "mouse" && sonarHover(i)}
              onClick={() => {
                sonarClic("open");
                setAbierto({ videoSrc: media.video, posterSrc: media.poster, name: v.name, role: v.role, company: v.company, chapters: media.chapters });
              }}
              aria-label={`${etiqueta} · ${v.name}`}
              className="group relative block aspect-[4/5] overflow-hidden bg-[var(--v2-band)] text-left sm:aspect-[4/3] md:aspect-[4/5] lg:aspect-[5/6]"
              data-reveal
            >
              <img
                src={media.poster}
                alt=""
                loading="lazy"
                className="absolute inset-0 h-full w-full object-cover object-[50%_22%] transition-transform duration-[900ms] ease-[var(--v2-ease)] group-hover:scale-[1.03]"
              />
              <span aria-hidden className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-transparent" />
              {/* El botón de play, en el centro: se rellena de rojo al pasar el ratón. */}
              <span
                aria-hidden
                className="absolute left-1/2 top-1/2 flex h-16 w-16 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-white/90 text-[var(--v2-band)] transition-[background-color,color,transform] duration-300 group-hover:scale-105 group-hover:bg-[var(--v2-accent)] group-hover:text-white"
              >
                <Play size={20} fill="currentColor" className="ml-0.5" />
              </span>
              <span className="absolute inset-x-0 bottom-0 flex flex-col gap-4 p-6 text-white md:p-8">
                <span className="text-[20px] font-medium leading-[1.3] tracking-[-0.01em] md:text-[24px]">“{v.quote}”</span>
                <span className="flex items-center justify-between gap-4 border-t border-white/20 pt-4">
                  <span className="flex flex-col">
                    <span className="text-[15px] font-medium">{v.name}</span>
                    <span className="text-[13px] text-white/70">
                      {v.role} · {v.company}
                    </span>
                  </span>
                  <span className="inline-flex items-center gap-1.5 bg-black/55 px-2 py-1 font-mono text-[10px] uppercase tracking-[0.12em]">
                    <Play size={10} fill="currentColor" /> {etiqueta}
                  </span>
                </span>
              </span>
            </button>
          );
        })}
      </div>
      <TestimonialLightbox video={abierto} onClose={() => setAbierto(null)} />
    </>
  );
}
