export type Testimonial = {
  key: "t1" | "t2" | "t3" | "t4";
  avatar: string;
};

export const testimonials: Testimonial[] = [
  { key: "t1", avatar: "/images/testimonios/javi.jpg" },
  { key: "t2", avatar: "/images/testimonios/adela.jpg" },
  { key: "t3", avatar: "/images/testimonios/themis.jpg" },
  { key: "t4", avatar: "/images/testimonios/diego.jpg" },
];
