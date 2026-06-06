"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useState } from "react";
import { useTranslations } from "next-intl";
import { BrandPattern } from "@/components/ui/BrandPattern";
import { PrimaryButton } from "@/components/ui/PrimaryButton";
import { MixedHeadline } from "@/components/ui/MixedHeadline";
import { bookingQuarter } from "@/lib/booking";

type Client = {
  name: string;
  photo?: string;
  company: string;
  logo?: string;
};

const clients: Client[] = [
  {
    name: "Javier Flores",
    photo: "/caras/javier-flores-face.png",
    company: "Social11",
  },
  {
    name: "Adela Ocenic",
    photo: "/caras/adela-face.png",
    company: "Voluntariado Aragón",
  },
  {
    name: "Themis López",
    photo: "/caras/themis-face.png",
    company: "FADA",
  },
];

function ClientAvatar({
  client,
  index,
  isActive,
  isAnyHovered,
  onEnter,
  onLeave,
}: {
  client: Client;
  index: number;
  isActive: boolean;
  isAnyHovered: boolean;
  onEnter: () => void;
  onLeave: () => void;
}) {
  const [errored, setErrored] = useState(false);
  const dimmed = isAnyHovered && !isActive;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      whileInView={{
        opacity: 1,
        scale: 1,
        transition: {
          duration: 0.5,
          delay: 0.1 + index * 0.08,
          ease: [0.34, 1.56, 0.64, 1],
        },
      }}
      viewport={{ once: true, margin: "-50px" }}
      onMouseEnter={onEnter}
      onMouseLeave={onLeave}
      animate={{
        scale: isActive ? 1.18 : dimmed ? 0.92 : 1,
        opacity: dimmed ? 0.5 : 1,
        y: isActive ? -6 : 0,
        zIndex: isActive ? 30 : 10 - index,
        marginLeft: index === 0 ? 0 : isActive ? -10 : -18,
        marginRight: isActive ? 8 : 0,
      }}
      transition={{ duration: 0.35, ease: [0.4, 0, 0.2, 1] }}
      className="relative w-[72px] h-[72px] md:w-[88px] md:h-[88px] rounded-full overflow-hidden ring-4 ring-[var(--color-text)] cursor-pointer"
      style={{
        boxShadow: isActive
          ? "0 0 0 2px rgba(194,38,58,0.8), 0 18px 40px -8px rgba(194,38,58,0.45)"
          : "0 8px 24px -6px rgba(0,0,0,0.5)",
        transition: "box-shadow 350ms ease-out",
      }}
    >
      {client.photo && !errored ? (
        <img
          src={client.photo}
          alt={client.name}
          onError={() => setErrored(true)}
          className="w-full h-full object-cover"
          // Neutral backdrop so transparent face PNGs read cleanly.
          style={{ backgroundColor: "var(--color-surface-2)" }}
        />
      ) : (
        <div
          className="w-full h-full flex items-center justify-center"
          style={{ backgroundColor: "var(--color-bg)" }}
        >
          <span
            className="font-display italic text-[var(--color-text)] leading-none"
            style={{ fontSize: 24 }}
          >
            {client.name
              .split(" ")
              .map((n) => n[0])
              .slice(0, 2)
              .join("")}
          </span>
        </div>
      )}
    </motion.div>
  );
}

export function CTAFinal() {
  const t = useTranslations("ctaFinal");
  const [hovered, setHovered] = useState<number | null>(null);

  const hoveredClient = hovered !== null ? clients[hovered] : null;

  return (
    <section className="relative overflow-hidden bg-[var(--color-text)] py-20 md:py-28 lg:py-32">
      {/* Pattern at low opacity */}
      <BrandPattern asBackground opacity={0.16} size="md" />

      {/* Center vignette to ensure copy readability */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse 60% 60% at 50% 55%, rgba(29,29,27,0.7) 0%, rgba(29,29,27,0) 75%)",
        }}
      />

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="relative z-10 max-w-[1280px] mx-auto px-6 lg:px-12 text-center flex flex-col items-center gap-6 md:gap-7"
      >
        {/* Client faces — the visual hook. Hover reveals who's who. */}
        <div className="flex flex-col items-center gap-4">
          <div
            className="relative flex items-center"
            onMouseLeave={() => setHovered(null)}
          >
            {clients.map((c, i) => (
              <ClientAvatar
                key={c.name}
                client={c}
                index={i}
                isActive={hovered === i}
                isAnyHovered={hovered !== null}
                onEnter={() => setHovered(i)}
                onLeave={() => setHovered(null)}
              />
            ))}
          </div>

          {/* One caption line: companies by default, name·company on hover */}
          <div className="h-5 flex items-center justify-center">
            <AnimatePresence mode="wait">
              {hoveredClient ? (
                <motion.span
                  key={hoveredClient.name}
                  initial={{ opacity: 0, y: -3 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -3 }}
                  transition={{ duration: 0.2 }}
                  className="font-body uppercase text-[11px] text-[#FFFFFF] whitespace-nowrap"
                  style={{ letterSpacing: "0.18em" }}
                >
                  {hoveredClient.name} · {hoveredClient.company}
                </motion.span>
              ) : (
                <motion.span
                  key="default"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0, y: -3 }}
                  transition={{ duration: 0.2 }}
                  className="font-body uppercase text-[11px] text-[#FFFFFF]/45 whitespace-nowrap"
                  style={{ letterSpacing: "0.18em" }}
                >
                  {clients.map((c) => c.company).join("  ·  ")}
                </motion.span>
              )}
            </AnimatePresence>
          </div>
        </div>

        <MixedHeadline
          dark
          className="text-[36px] md:text-[52px] lg:text-[64px] max-w-[900px] mt-1"
          parts={[
            { text: t("title_part1") },
            { text: t("title_emphasis"), accent: true },
            { text: t("title_part2") },
          ]}
        />

        <p className="font-body text-[16px] md:text-[18px] leading-[1.5] text-[#FFFFFF]/75 max-w-[560px]">
          {t("sub")}
        </p>

        <PrimaryButton href="/intro" variant="inverse">
          {t("cta")}
        </PrimaryButton>

        <span
          className="font-body uppercase text-[11px] text-[#FFFFFF]/65"
          style={{ letterSpacing: "0.18em" }}
        >
          {t("footnote", { q: bookingQuarter() })}
        </span>
      </motion.div>
    </section>
  );
}
