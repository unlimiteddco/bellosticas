"use client";

import { useEffect, useState } from "react";
import { ArrowRight, Check } from "lucide-react";

type Section = { id: string; label: string };

type LenisLike = { scrollTo: (target: HTMLElement, opts?: { offset?: number }) => void };

function getLenis(): LenisLike | undefined {
  return (window as unknown as { __lenis?: LenisLike }).__lenis;
}

export function ProposalSideNav({
  label,
  sections,
  ctaLabel,
  accepted,
  unavailable,
  acceptedLabel,
}: {
  label: string;
  sections: Section[];
  ctaLabel: string;
  accepted: boolean;
  unavailable: boolean;
  acceptedLabel: string;
}) {
  const [active, setActive] = useState(sections[0]?.id ?? "");

  // Scroll-spy: resalta la sección visible para guiar de arriba a abajo.
  useEffect(() => {
    const els = sections
      .map((s) => document.getElementById(s.id))
      .filter((el): el is HTMLElement => Boolean(el));
    if (els.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
        if (visible[0]) setActive(visible[0].target.id);
      },
      { rootMargin: "-25% 0px -60% 0px", threshold: 0 },
    );
    els.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, [sections]);

  const go = (e: React.MouseEvent, id: string) => {
    e.preventDefault();
    const el = document.getElementById(id);
    if (!el) return;
    const lenis = getLenis();
    if (lenis?.scrollTo) lenis.scrollTo(el, { offset: -110 });
    else el.scrollIntoView({ behavior: "smooth", block: "start" });
    setActive(id);
  };

  return (
    <nav aria-label={label} className="flex flex-col gap-5">
      <span
        className="font-body uppercase text-[10px] text-[var(--color-text-muted)]"
        style={{ letterSpacing: "0.18em" }}
      >
        {label}
      </span>

      <ul className="flex flex-col border-l border-[var(--color-text)]/12">
        {sections.map((s, i) => {
          const on = active === s.id;
          return (
            <li key={s.id}>
              <a
                href={`#${s.id}`}
                onClick={(e) => go(e, s.id)}
                className={`group flex items-center gap-3 pl-4 -ml-px py-2.5 border-l-2 transition-colors ${
                  on
                    ? "border-[var(--color-accent)]"
                    : "border-transparent hover:border-[var(--color-text)]/30"
                }`}
              >
                <span
                  className={`font-body text-[11px] tabular-nums transition-colors ${
                    on ? "text-[var(--color-accent)]" : "text-[var(--color-text-muted)]/50"
                  }`}
                >
                  {String(i + 1).padStart(2, "0")}
                </span>
                <span
                  className={`font-body text-[14px] leading-[1.3] transition-colors ${
                    on
                      ? "text-[var(--color-text)] font-medium"
                      : "text-[var(--color-text-muted)] group-hover:text-[var(--color-text)]"
                  }`}
                >
                  {s.label}
                </span>
              </a>
            </li>
          );
        })}
      </ul>

      {accepted ? (
        <span className="inline-flex items-center gap-2 font-body text-[13px] text-[var(--color-accent)]">
          <Check size={15} /> {acceptedLabel}
        </span>
      ) : unavailable ? null : (
        <a
          href="#aceptar"
          onClick={(e) => go(e, "aceptar")}
          className="group inline-flex items-center justify-center gap-2 rounded-full h-11 px-5 font-body text-[12px] font-medium uppercase tracking-[0.05em] whitespace-nowrap transition-colors"
          style={{ backgroundColor: "var(--color-text)", color: "#FFFFFF" }}
        >
          {ctaLabel}
          <ArrowRight size={14} className="transition-transform group-hover:translate-x-0.5" />
        </a>
      )}
    </nav>
  );
}
