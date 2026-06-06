"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";

type Testimonial = { name: string; role: string; quote: string };

/** Face photos paired with the testimonials (same order as the messages array). */
const FACES = [
  "/caras/javier-flores-face.png",
  "/caras/themis-face.png",
  "/caras/adela-face.png",
];

const ROTATE_MS = 6500;

export function IntroTestimonials() {
  const t = useTranslations("introPage");
  const items = t.raw("testimonials") as Testimonial[];

  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    if (paused || items.length <= 1) return;
    const id = window.setInterval(
      () => setActive((i) => (i + 1) % items.length),
      ROTATE_MS,
    );
    return () => window.clearInterval(id);
  }, [paused, items.length]);

  const current = items[active];

  return (
    <div
      className="flex flex-col items-center text-center gap-7"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      <AnimatePresence mode="wait">
        <motion.figure
          key={active}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -12 }}
          transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
          className="flex flex-col items-center gap-6"
        >
          {/* Face */}
          <span
            className="w-[68px] h-[68px] rounded-full overflow-hidden ring-1 ring-[var(--color-border)] shrink-0"
            style={{ backgroundColor: "var(--color-surface-2)" }}
          >
            <img
              src={FACES[active] ?? FACES[0]}
              alt={current.name}
              className="w-full h-full object-cover"
              style={{ objectPosition: "center 20%" }}
            />
          </span>

          <blockquote className="font-display text-[24px] md:text-[30px] leading-[1.4] text-[var(--color-text)] max-w-[640px]">
            <span className="text-[var(--color-accent)]">“</span>
            {current.quote}
            <span className="text-[var(--color-accent)]">”</span>
          </blockquote>

          <figcaption className="flex flex-col gap-0.5">
            <span className="font-body text-[14px] font-semibold text-[var(--color-text)]">
              {current.name}
            </span>
            <span className="font-body text-[13px] text-[var(--color-text-muted)]">
              {current.role}
            </span>
          </figcaption>
        </motion.figure>
      </AnimatePresence>

      {/* Dots */}
      <div className="flex items-center gap-2">
        {items.map((item, i) => (
          <button
            key={item.name}
            type="button"
            onClick={() => setActive(i)}
            aria-label={`Ver testimonio de ${item.name}`}
            aria-current={i === active ? "true" : undefined}
            className={`h-2 rounded-full transition-all duration-300 ${
              i === active
                ? "w-6 bg-[var(--color-accent)]"
                : "w-2 bg-[var(--color-border)] hover:bg-[var(--color-text-muted)]"
            }`}
          />
        ))}
      </div>
    </div>
  );
}
