"use client";

import { useEffect, useRef, useState } from "react";
import { useReducedMotion } from "@/lib/hooks/useReducedMotion";

type Props = {
  value: string;
  label: string;
  description?: string;
  dark?: boolean;
};

function parseValue(value: string) {
  const m = value.match(/^(\d+)([+%]?)(.*)$/);
  if (!m) return { num: 0, suffix: value };
  return { num: Number(m[1]), suffix: `${m[2]}${m[3]}` };
}

export function NumberCounter({ value, label, description, dark = false }: Props) {
  const reduced = useReducedMotion();
  const ref = useRef<HTMLDivElement>(null);
  const { num, suffix } = parseValue(value);
  const [display, setDisplay] = useState(reduced ? num : 0);

  useEffect(() => {
    if (reduced) {
      setDisplay(num);
      return;
    }
    const el = ref.current;
    if (!el) return;

    const io = new IntersectionObserver(
      (entries) => {
        const e = entries[0];
        if (!e.isIntersecting) return;
        io.disconnect();

        const start = performance.now();
        const duration = 1400;
        let raf = 0;
        const tick = (now: number) => {
          const t = Math.min(1, (now - start) / duration);
          const eased = 1 - Math.pow(1 - t, 3);
          setDisplay(Math.floor(eased * num));
          if (t < 1) raf = requestAnimationFrame(tick);
        };
        raf = requestAnimationFrame(tick);

        return () => cancelAnimationFrame(raf);
      },
      { threshold: 0.4 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [num, reduced]);

  const numberColor = dark ? "text-[var(--color-bg)]" : "text-[var(--color-text)]";
  const labelColor = dark ? "text-[var(--color-bg)]" : "text-[var(--color-text)]";
  const descColor = dark
    ? "text-[var(--color-bg)]/55"
    : "text-[var(--color-text-muted)]";

  return (
    <div ref={ref} className="flex flex-col gap-3">
      <span
        className={`font-display text-[56px] md:text-[80px] lg:text-[88px] leading-[0.95] ${numberColor} tabular-nums`}
      >
        {display}
        {suffix}
      </span>
      <span
        className={`font-body font-semibold text-[18px] md:text-[20px] ${labelColor}`}
      >
        {label}
      </span>
      {description && (
        <span className={`font-body text-[13px] leading-[1.5] ${descColor} max-w-[240px]`}>
          {description}
        </span>
      )}
    </div>
  );
}
