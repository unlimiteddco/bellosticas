"use client";

import { motion, useReducedMotion } from "framer-motion";
import { CalendarDays, Video, MessageSquare } from "lucide-react";
import { useState } from "react";

type Props = { isHovered: boolean };

const floaters = [
  {
    icon: CalendarDays,
    label: "Cal.com",
    pos: { top: "10%", left: "8%" },
    delay: 0,
  },
  {
    icon: Video,
    label: "",
    pos: { top: "12%", right: "10%" },
    delay: 0.15,
  },
  {
    icon: MessageSquare,
    label: "",
    pos: { bottom: "12%", left: "50%" },
    delay: 0.3,
  },
];

function VideoTile({
  src,
  tone,
  rotate,
  isHovered,
  zIndex,
  offsetX,
}: {
  src: string;
  tone: "warm" | "dark";
  rotate: number;
  isHovered: boolean;
  zIndex: number;
  offsetX: number;
}) {
  const [errored, setErrored] = useState(false);
  const fallbackGradient =
    tone === "warm"
      ? "linear-gradient(135deg, #C7B8A8 0%, #9A8775 45%, #5D4F44 100%)"
      : "linear-gradient(135deg, #2C2417 0%, #4A3D2E 45%, #1A1410 100%)";
  const fallbackHighlight =
    tone === "warm"
      ? "radial-gradient(ellipse 60% 50% at 50% 35%, rgba(255,235,210,0.4) 0%, transparent 60%)"
      : "radial-gradient(ellipse 55% 45% at 55% 38%, rgba(220,180,140,0.45) 0%, transparent 65%)";

  return (
    <motion.div
      animate={
        isHovered
          ? { rotate: rotate * 1.25, x: offsetX * 1.5, y: tone === "warm" ? 4 : -6 }
          : { rotate, x: offsetX, y: 0 }
      }
      transition={{ duration: 0.6, ease: [0.4, 0, 0.2, 1] }}
      className={`relative rounded-3xl overflow-hidden shadow-[0_20px_40px_-15px_rgba(29,29,27,0.4)] ${
        tone === "warm" ? "w-[42%]" : "-ml-10 w-[48%]"
      } aspect-[4/5]`}
      style={{
        zIndex,
        background: errored ? fallbackGradient : "#1A1410",
      }}
    >
      {!errored ? (
        <img
          src={src}
          alt=""
          onError={() => setErrored(true)}
          className="absolute inset-0 w-full h-full object-cover"
        />
      ) : (
        <div
          className="absolute inset-0"
          style={{ background: fallbackHighlight }}
        />
      )}
    </motion.div>
  );
}

export function MockupV2Day1({ isHovered }: Props) {
  const reduce = useReducedMotion();
  const animate = isHovered && !reduce;

  return (
    <div className="absolute inset-0">
      {/* Soft radial vignette */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse at center, rgba(244,242,238,0.4) 0%, rgba(229,226,220,0.6) 70%, rgba(205,200,192,0.3) 100%)",
        }}
      />

      {/* Two video call tiles */}
      <div className="absolute inset-0 flex items-center justify-center">
        <VideoTile
          src="/cliente.jpg"
          tone="warm"
          rotate={-6}
          offsetX={-6}
          zIndex={1}
          isHovered={animate}
        />
        <VideoTile
          src="/antonio.jpg"
          tone="dark"
          rotate={4}
          offsetX={8}
          zIndex={2}
          isHovered={animate}
        />
      </div>

      {/* Floating logo bubbles */}
      {floaters.map((f, i) => {
        const Icon = f.icon;
        return (
          <motion.div
            key={i}
            initial={false}
            animate={
              animate
                ? { y: [0, -6, 0], scale: [1, 1.06, 1] }
                : { y: 0, scale: 1 }
            }
            transition={{
              duration: 2,
              repeat: animate ? Infinity : 0,
              delay: f.delay,
              ease: "easeInOut",
            }}
            className="absolute flex items-center gap-1.5 px-2.5 py-1.5 rounded-full bg-[var(--color-bg)] shadow-[0_8px_20px_-6px_rgba(29,29,27,0.25)]"
            style={f.pos}
          >
            <Icon
              size={14}
              className="text-[var(--color-text)]"
              strokeWidth={2}
            />
            {f.label && (
              <span className="font-body text-[10px] text-[var(--color-text)]">
                {f.label}
              </span>
            )}
          </motion.div>
        );
      })}
    </div>
  );
}
