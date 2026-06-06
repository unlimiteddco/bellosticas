/**
 * Central media config for the video testimonials — used by the homepage
 * ShortTestimonials grid, the floating widget, and the /love featured videos.
 *
 * VIDEO hosting is env-configurable so the big .mp4 files never need to live
 * in the git repo / Docker image:
 *
 *   NEXT_PUBLIC_VIDEO_BASE_URL unset → /public/testimonials  (local dev)
 *   NEXT_PUBLIC_VIDEO_BASE_URL set   → e.g. https://media.bellostas.studio
 *                                      (Cloudflare R2 public bucket / CDN)
 *
 * Posters are tiny (~100KB) so they always live in /public.
 */

export type TestimonialId = "javier" | "themis";

/** A clickable timeline marker: jump to `time` (seconds) labelled `label`. */
export type VideoChapter = { time: number; label: string };

export type TestimonialMedia = {
  video: string;
  poster: string;
  /** Optional timeline chapters shown as clickable dots in the player. */
  chapters?: VideoChapter[];
};

const VIDEO_BASE = (process.env.NEXT_PUBLIC_VIDEO_BASE_URL ?? "").replace(/\/$/, "");

/** Chapter timestamps (seconds) per video — real moments from each interview. */
export const TESTIMONIAL_MEDIA: Record<TestimonialId, TestimonialMedia> = {
  javier: {
    video: `${VIDEO_BASE}/testimonials/javier-flores.mp4`,
    poster: "/miniaturas-videotestimonios/javier-flores.jpg",
    chapters: [
      { time: 0, label: "Intro" },
      { time: 8, label: "El problema" },
      { time: 28, label: "La experiencia" },
      { time: 44, label: "Los resultados" },
      { time: 52, label: "La confianza" },
      { time: 71, label: "Recomendación" },
    ],
  },
  themis: {
    video: `${VIDEO_BASE}/testimonials/themis-lopez.mp4`,
    poster: "/miniaturas-videotestimonios/themis.jpg",
    chapters: [
      { time: 0, label: "Intro" },
      { time: 5, label: "El problema" },
      { time: 35, label: "La experiencia" },
      { time: 77, label: "Los resultados" },
      { time: 97, label: "Recomendación" },
    ],
  },
};
