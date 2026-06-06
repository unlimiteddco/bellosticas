"use client";

import { useRef } from "react";
import {
  motion,
  useReducedMotion,
  useScroll,
  useTransform,
  type MotionValue,
} from "framer-motion";
import {
  Figma,
  Framer,
  Github,
  Code2,
  Database,
  PenTool,
  Boxes,
  Palette,
  type LucideIcon,
} from "lucide-react";

/**
 * HeroToolsBackdrop — soft "studio canvas" hero backdrop (Agnos-style): a light
 * grey surface with faint concentric rings and floating tool cards that bob and
 * tilt slowly. On scroll the cards drift outward + fade and the rings expand,
 * so the hero "disperses" as it exits. Pure DOM/CSS — no WebGL. Cards live at
 * the margins so the headline stays clear. pointer-events: none.
 */

type FloatCard = {
  icon: LucideIcon;
  top: string;
  left?: string;
  right?: string;
  rotate: number;
  size: number;
  delay: number;
  amp: number;
  /** scroll-drift target (px) at the bottom of the hero */
  dx: number;
  dy: number;
};

const CARDS: FloatCard[] = [
  { icon: Figma, top: "17%", left: "7%", rotate: -8, size: 66, delay: 0, amp: 12, dx: -75, dy: -55 },
  { icon: PenTool, top: "50%", left: "4%", rotate: 7, size: 60, delay: 0.6, amp: 14, dx: -95, dy: 35 },
  { icon: Github, top: "77%", left: "11%", rotate: -5, size: 58, delay: 1.1, amp: 10, dx: -65, dy: 75 },
  { icon: Code2, top: "11%", left: "29%", rotate: -11, size: 56, delay: 0.9, amp: 11, dx: -45, dy: -90 },
  { icon: Framer, top: "19%", right: "8%", rotate: 8, size: 66, delay: 0.3, amp: 13, dx: 75, dy: -55 },
  { icon: Database, top: "49%", right: "4%", rotate: -7, size: 60, delay: 0.8, amp: 12, dx: 95, dy: 35 },
  { icon: Boxes, top: "76%", right: "10%", rotate: 6, size: 58, delay: 1.3, amp: 10, dx: 65, dy: 75 },
  { icon: Palette, top: "84%", right: "30%", rotate: 9, size: 56, delay: 0.5, amp: 12, dx: 55, dy: 90 },
];

function ToolCard({
  card,
  animate,
  progress,
}: {
  card: FloatCard;
  animate: boolean;
  progress: MotionValue<number>;
}) {
  const Icon = card.icon;

  // Scroll-driven parallax: drift outward + fade as the hero scrolls away.
  const x = useTransform(progress, [0, 1], [0, card.dx]);
  const y = useTransform(progress, [0, 1], [0, card.dy]);
  const opacity = useTransform(progress, [0, 0.85], [1, 0.15]);

  return (
    <motion.div
      className="absolute hidden md:block"
      style={{
        top: card.top,
        left: card.left,
        right: card.right,
        x: animate ? x : 0,
        y: animate ? y : 0,
        opacity: animate ? opacity : 1,
      }}
    >
      {/* Inner element carries the idle float + tilt, kept separate from the
          scroll parallax above so the two transforms compose cleanly. */}
      <motion.div
        className="flex items-center justify-center rounded-2xl bg-white border border-[var(--color-border)]"
        style={{
          width: card.size,
          height: card.size,
          boxShadow:
            "0 18px 40px -18px rgba(29,29,27,0.22), 0 2px 6px -2px rgba(29,29,27,0.08)",
          rotate: `${card.rotate}deg`,
        }}
        animate={
          animate
            ? {
                y: [0, -card.amp, 0, card.amp * 0.6, 0],
                rotate: [
                  card.rotate,
                  card.rotate + 4,
                  card.rotate,
                  card.rotate - 3,
                  card.rotate,
                ],
              }
            : undefined
        }
        transition={{
          duration: 9 + card.delay * 2,
          delay: card.delay,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      >
        <Icon
          size={card.size * 0.42}
          strokeWidth={1.6}
          className="text-[var(--color-text)]"
        />
      </motion.div>
    </motion.div>
  );
}

export function HeroToolsBackdrop() {
  const reduce = useReducedMotion();
  const animate = !reduce;
  const ref = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });

  // Rings gently expand + fade as you scroll through the hero.
  const ringScale = useTransform(scrollYProgress, [0, 1], [1, 1.16]);
  const ringOpacity = useTransform(scrollYProgress, [0, 1], [1, 0.25]);

  return (
    <div
      ref={ref}
      aria-hidden
      className="absolute inset-0 -z-0 overflow-hidden pointer-events-none"
      style={{ backgroundColor: "#F3F2EF" }}
    >
      {/* Concentric rings — large circles centred behind the hero; only the
          left/right arcs read, sweeping through the margins. */}
      <motion.svg
        className="absolute left-1/2 top-[54%] w-[2200px] h-[2200px] max-w-none"
        style={{
          x: "-50%",
          y: "-50%",
          scale: animate ? ringScale : 1,
          opacity: animate ? ringOpacity : 1,
        }}
        viewBox="0 0 2200 2200"
        fill="none"
      >
        {[520, 700, 880, 1060, 1240].map((r) => (
          <circle
            key={r}
            cx="1100"
            cy="1100"
            r={r}
            stroke="#E3E0DA"
            strokeWidth="1.5"
          />
        ))}
      </motion.svg>

      {/* Floating tool cards */}
      {CARDS.map((card, i) => (
        <ToolCard
          key={i}
          card={card}
          animate={animate}
          progress={scrollYProgress}
        />
      ))}

      {/* Bottom fade into the cream page */}
      <div
        className="absolute inset-x-0 bottom-0 h-[35%]"
        style={{
          background:
            "linear-gradient(to bottom, rgba(253,253,251,0) 0%, var(--color-bg) 100%)",
        }}
      />
    </div>
  );
}

export default HeroToolsBackdrop;
