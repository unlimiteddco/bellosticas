"use client";

import { useRef, useState } from "react";
import { ArrowLeft, ArrowRight, Play } from "lucide-react";
import { useTranslations } from "next-intl";
import { InitialsAvatar } from "@/components/ui/InitialsAvatar";
import { CARAS } from "@/components/sections/ShortTestimonials";
import { TestimonialLightbox, type LightboxVideo } from "@/components/sections/TestimonialLightbox";
import { TESTIMONIAL_MEDIA, type TestimonialMedia } from "@/lib/testimonial-media";
import { sonarClic, sonarHover } from "@/lib/v2/ui-sound";

const VIDEOS: Record<string, TestimonialMedia> = { t1: TESTIMONIAL_MEDIA.javier, t3: TESTIMONIAL_MEDIA.themis };
// Primero los dos vídeos (son lo más creíble), luego las reseñas escritas.
const ORDEN = ["t3", "t2", "t1", "t6", "t4", "t5"];

/**
 * Testimonios en un carrusel de tarjetas con borde. Mismos textos y caras que
 * la home actual (shortTestimonials.*, CARAS); las de vídeo abren el reproductor.
 * Se desliza con el dedo o con las flechas.
 */
export function TestimonialsV2() {
  const t = useTranslations("shortTestimonials");
  const tv = useTranslations("v2");
  const tvid = useTranslations("videoTestimonial");
  const pista = useRef<HTMLDivElement>(null);
  const [video, setVideo] = useState<LightboxVideo | null>(null);

  const mover = (dir: 1 | -1) => {
    const el = pista.current;
    if (!el) return;
    const tarjeta = el.querySelector("article");
    const paso = tarjeta ? tarjeta.getBoundingClientRect().width : 320;
    el.scrollBy({ left: dir * paso, behavior: "smooth" });
    sonarClic("select", dir > 0 ? 1 : 0);
  };

  return (
    <section className="v2-frame">
      <div className="v2-rail">
        <span aria-hidden data-draw className="pointer-events-none absolute left-0 right-0 top-0 h-px bg-[var(--v2-line)]" />
        <div className="flex flex-wrap items-end justify-between gap-6 px-6 py-16 md:px-10 lg:py-20">
          <div className="flex flex-col gap-4">
            <span className="v2-label" data-reveal>
              {t("label")}
            </span>
            <h2 className="max-w-[560px] text-[34px] font-medium leading-[1.05] tracking-[-0.03em] md:text-[48px]" data-reveal>
              {tv("testimonialsTitle")}
            </h2>
          </div>
          <div className="flex gap-2">
            {([-1, 1] as const).map((d) => (
              <button
                key={d}
                type="button"
                aria-label={d < 0 ? tv("prev") : tv("next")}
                onPointerEnter={(e) => e.pointerType === "mouse" && sonarHover(d)}
                onClick={() => mover(d)}
                className="inline-flex h-10 w-10 items-center justify-center border border-[var(--v2-line)] transition-colors hover:border-[var(--v2-line-strong)] hover:bg-[var(--v2-hover)]"
              >
                {d < 0 ? <ArrowLeft size={16} /> : <ArrowRight size={16} />}
              </button>
            ))}
          </div>
        </div>

        <div
          ref={pista}
          className="flex snap-x snap-mandatory overflow-x-auto border-t border-[var(--v2-line)] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        >
          {ORDEN.map((k) => {
            const nombre = t(`items.${k}.name`);
            const rol = `${t(`items.${k}.role`)} · ${t(`items.${k}.company`)}`;
            const media = VIDEOS[k];
            const cara = CARAS[k];
            return (
              <article
                key={k}
                className="relative flex h-[420px] w-[85%] shrink-0 snap-start flex-col justify-between border-r border-[var(--v2-line)] p-6 sm:w-[48%] lg:w-[33.333%] md:p-8"
              >
                {media ? (
                  <button
                    type="button"
                    aria-label={`${tvid("watchAria")} · ${nombre}`}
                    onClick={() => {
                      sonarClic("open");
                      setVideo({
                        videoSrc: media.video,
                        posterSrc: media.poster,
                        name: nombre,
                        role: t(`items.${k}.role`),
                        company: t(`items.${k}.company`),
                        chapters: media.chapters,
                      });
                    }}
                    className="group absolute inset-0 overflow-hidden text-left"
                  >
                    <img src={media.poster} alt="" className="absolute inset-0 h-full w-full object-cover object-[50%_20%] transition-transform duration-700 group-hover:scale-[1.03]" />
                    <span aria-hidden className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/10 to-transparent" />
                    <span className="absolute left-6 top-6 inline-flex items-center gap-1.5 bg-black/55 px-2 py-1 font-mono text-[10px] uppercase tracking-[0.12em] text-white md:left-8 md:top-8">
                      <Play size={10} fill="currentColor" /> {tvid("badge")}
                    </span>
                    <span className="absolute bottom-6 left-6 right-6 flex flex-col gap-3 text-white md:bottom-8 md:left-8 md:right-8">
                      <span className="text-[17px] leading-[1.4]">“{t(`items.${k}.quote`)}”</span>
                      <span className="text-[13px] text-white/75">
                        <strong className="font-medium text-white">{nombre}</strong> · {rol}
                      </span>
                    </span>
                  </button>
                ) : (
                  <>
                    <span className="v2-label">{t(`items.${k}.company`)}</span>
                    <p className="text-[20px] leading-[1.35] tracking-[-0.01em] md:text-[22px]">“{t(`items.${k}.quote`)}”</p>
                    <div className="flex items-center gap-3">
                      {cara ? (
                        <img src={cara} alt={nombre} width={36} height={36} className="h-9 w-9 rounded-full object-cover" />
                      ) : (
                        <InitialsAvatar name={nombre} size={36} />
                      )}
                      <span className="flex flex-col">
                        <span className="text-[14px] font-medium">{nombre}</span>
                        <span className="text-[12.5px] text-[var(--v2-muted)]">{rol}</span>
                      </span>
                    </div>
                  </>
                )}
              </article>
            );
          })}
        </div>
      </div>
      <TestimonialLightbox video={video} onClose={() => setVideo(null)} />
    </section>
  );
}
