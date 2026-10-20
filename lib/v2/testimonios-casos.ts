import type { TestimonialId } from "@/lib/testimonial-media";

/**
 * Qué dijo el cliente de cada caso: la clave de su cita en los textos
 * (shortTestimonials o, si solo está ahí, la página de testimonios), su cara y
 * su vídeo si lo grabó. Solo reseñas reales; sin entrada, el caso no lleva cita.
 */
export type TestimonioCaso = {
  ns: "shortTestimonials.items" | "lovePage.mosaic.items";
  clave: string;
  cara?: string;
  video?: TestimonialId;
};

export const TESTIMONIO_CASO: Record<string, TestimonioCaso> = {
  teleadhesivo: { ns: "shortTestimonials.items", clave: "t6", cara: "/caras/cara-teleadhesivo.jpg" },
  "voluntariado-aragon": { ns: "shortTestimonials.items", clave: "t2", cara: "/caras/adela-face.png" },
  fada: { ns: "shortTestimonials.items", clave: "t3", cara: "/caras/themis-face.png", video: "themis" },
  "primex-academy": { ns: "shortTestimonials.items", clave: "t4" },
  "gotten-gym": { ns: "shortTestimonials.items", clave: "t5" },
  "embroidery-download": { ns: "lovePage.mosaic.items", clave: "t7" },
};
