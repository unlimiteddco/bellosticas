"use client";

import { motion, useReducedMotion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

type Props = {
  height?: number;
  className?: string;
  /** When false, render a <div> instead of a <Link>. Use when an ancestor is already an anchor. */
  asLink?: boolean;
};

const ISO_RATIO = 507.24 / 68.36;

export function AnimatedLogo({ height = 24, className, asLink = true }: Props) {
  const [isHovered, setIsHovered] = useState(false);
  const reduce = useReducedMotion();

  const logoWidth = Math.round(height * ISO_RATIO);
  const ease = [0.4, 0, 0.2, 1] as const;

  const inner = (
    <>
      <motion.div
        initial={false}
        animate={{
          y: reduce ? 0 : isHovered ? -height : 0,
          opacity: isHovered ? 0 : 1,
        }}
        transition={{ duration: 0.35, ease }}
        className="absolute inset-0 flex items-center justify-center"
      >
        <Image
          src="/logos/logo-black.svg"
          alt=""
          width={logoWidth}
          height={height}
          priority
          style={{ height, width: "auto" }}
        />
      </motion.div>

      <motion.div
        initial={false}
        animate={{
          y: reduce ? 0 : isHovered ? 0 : height,
          opacity: isHovered ? 1 : 0,
        }}
        transition={{ duration: 0.35, ease }}
        className="absolute inset-0 flex items-center justify-center"
      >
        <Image
          src="/logos/logo-black.svg"
          alt=""
          width={logoWidth}
          height={height}
          priority
          style={{ height, width: "auto" }}
        />
      </motion.div>
    </>
  );

  const baseClass = `relative inline-block overflow-hidden ${className ?? ""}`;
  const baseStyle = { height, width: logoWidth } as React.CSSProperties;

  if (!asLink) {
    return (
      <span
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        className={baseClass}
        style={baseStyle}
        aria-hidden
      >
        {inner}
      </span>
    );
  }

  return (
    <Link
      href="/"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className={baseClass}
      style={baseStyle}
      aria-label="Bellostas Studio"
    >
      {inner}
    </Link>
  );
}
