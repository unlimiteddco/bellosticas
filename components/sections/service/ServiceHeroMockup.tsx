"use client";

import { motion } from "framer-motion";

type Mockup = { src: string; alt: string };

type Props = {
  mockups: Mockup[];
  techBadge?: { label: string; bg: string; color?: string };
};

export function ServiceHeroMockup({ mockups, techBadge }: Props) {
  if (!mockups.length) return null;

  // Single transparent-PNG composition (e.g. /images/hero-ecommerce.png with two
  // phones already composed). Render bare — no card, no rotation — just a soft
  // float so it doesn't read as a static asset.
  if (mockups.length === 1) {
    return (
      <div className="relative hidden lg:flex items-center justify-center w-full h-full">
        <div className="relative w-full">
          <motion.img
            src={mockups[0].src}
            alt={mockups[0].alt}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: [0, -10, 0] }}
            transition={{
              opacity: { duration: 0.7, delay: 0.4, ease: [0.4, 0, 0.2, 1] },
              y: {
                duration: 5.5,
                repeat: Infinity,
                ease: "easeInOut",
                delay: 0.4,
              },
            }}
            className="w-full h-auto object-contain"
            loading="eager"
          />

          {techBadge && (
            <motion.div
              initial={{ opacity: 0, scale: 0.5, rotate: -20 }}
              animate={{ opacity: 1, scale: 1, rotate: 0 }}
              transition={{
                duration: 0.6,
                delay: 0.9,
                ease: [0.34, 1.56, 0.64, 1],
              }}
              className="absolute -bottom-4 right-0 w-[72px] h-[72px] rounded-xl flex items-center justify-center font-display italic font-semibold text-[40px] shadow-[0_18px_30px_-10px_rgba(29,29,27,0.45)]"
              style={{
                backgroundColor: techBadge.bg,
                color: techBadge.color ?? "#FFFFFF",
              }}
              aria-hidden
            >
              {techBadge.label}
            </motion.div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="relative hidden lg:flex items-center justify-center w-full h-full">
      <div className="relative w-full max-w-[460px] aspect-[4/5]">
        {/* Back mockup (taller) */}
        {mockups[0] && (
          <motion.div
            initial={{ opacity: 0, y: 30, rotate: -8 }}
            animate={{ opacity: 1, y: 0, rotate: -6 }}
            transition={{ duration: 0.8, delay: 0.4, ease: [0.4, 0, 0.2, 1] }}
            className="absolute top-0 right-12 w-[68%] aspect-[3/4] rounded-2xl overflow-hidden bg-[var(--color-text)] shadow-[0_30px_60px_-20px_rgba(29,29,27,0.45)]"
            style={{ border: "1px solid rgba(29,29,27,0.12)" }}
          >
            <img
              src={mockups[0].src}
              alt={mockups[0].alt}
              className="w-full h-full object-cover object-top"
              loading="eager"
            />
          </motion.div>
        )}

        {/* Front mockup (shorter, offset down-left) */}
        {mockups[1] && (
          <motion.div
            initial={{ opacity: 0, y: 40, rotate: 8 }}
            animate={{ opacity: 1, y: 0, rotate: 5 }}
            transition={{ duration: 0.8, delay: 0.55, ease: [0.4, 0, 0.2, 1] }}
            className="absolute bottom-0 left-2 w-[60%] aspect-[3/4] rounded-2xl overflow-hidden bg-[var(--color-text)] shadow-[0_30px_60px_-20px_rgba(29,29,27,0.5)]"
            style={{ border: "1px solid rgba(29,29,27,0.12)" }}
          >
            <img
              src={mockups[1].src}
              alt={mockups[1].alt}
              className="w-full h-full object-cover object-top"
              loading="eager"
            />
          </motion.div>
        )}

        {/* Tech badge — floating square with letter */}
        {techBadge && (
          <motion.div
            initial={{ opacity: 0, scale: 0.5, rotate: -20 }}
            animate={{ opacity: 1, scale: 1, rotate: 0 }}
            transition={{
              duration: 0.6,
              delay: 0.9,
              ease: [0.34, 1.56, 0.64, 1],
            }}
            className="absolute -bottom-4 right-2 w-[72px] h-[72px] rounded-xl flex items-center justify-center font-display italic font-semibold text-[40px] shadow-[0_18px_30px_-10px_rgba(29,29,27,0.45)]"
            style={{
              backgroundColor: techBadge.bg,
              color: techBadge.color ?? "#FFFFFF",
            }}
            aria-hidden
          >
            {techBadge.label}
          </motion.div>
        )}
      </div>
    </div>
  );
}
