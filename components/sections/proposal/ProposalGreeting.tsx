"use client";

import { motion, useReducedMotion } from "framer-motion";

type Props = {
  /** Saludo ya traducido, p. ej. "Hola, Hugo 👋". */
  greeting: string;
  /** Segunda línea ya traducida (llega del servidor). */
  line: string;
};

const EASE = [0.22, 1, 0.36, 1] as const;

/**
 * ProposalGreeting — saludo personalizado del hero de la propuesta. El saludo
 * entra palabra a palabra (stagger fade-up) y después aparece la segunda línea
 * con un fade sutil. Respeta reduce-motion (renderiza al instante).
 */
export function ProposalGreeting({ greeting, line }: Props) {
  const reduce = useReducedMotion();
  const words = greeting.split(" ");

  return (
    <div>
      <p className="font-display italic text-[clamp(24px,3vw,34px)] leading-[1.25] text-[var(--color-accent)]">
        {/* Texto completo para lectores de pantalla; las palabras animadas son decorativas */}
        <span className="sr-only">{greeting}</span>
        {words.map((word, i) => (
          <motion.span
            key={i}
            aria-hidden
            className="inline-block whitespace-pre"
            initial={{ opacity: 0, y: reduce ? 0 : 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              duration: reduce ? 0 : 0.5,
              delay: reduce ? 0 : i * 0.12,
              ease: EASE,
            }}
          >
            {word}
            {i < words.length - 1 ? " " : ""}
          </motion.span>
        ))}
      </p>
      <motion.p
        className="font-body text-[15px] md:text-[17px] text-[var(--color-text-muted)] mt-1"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: reduce ? 0 : 0.6, delay: reduce ? 0 : 0.5, ease: EASE }}
      >
        {line}
      </motion.p>
    </div>
  );
}
