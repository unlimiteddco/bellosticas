"use client";

import Link from "next/link";

type Props = {
  children: React.ReactNode;
  href?: string;
  onClick?: () => void;
  className?: string;
  variant?: "default" | "inverse";
};

export function PrimaryButton({
  children,
  href,
  onClick,
  className,
  variant = "default",
}: Props) {
  const isDefault = variant === "default";

  // Inline styles guarantee colors even if Tailwind utility didn't generate.
  const inlineStyle: React.CSSProperties = isDefault
    ? { backgroundColor: "var(--color-text)", color: "#FFFFFF" }
    : { backgroundColor: "var(--color-bg)", color: "var(--color-text)" };

  const content = (
    <span className="inline-flex items-center gap-2">
      <span>{children}</span>
      <svg
        width="14"
        height="14"
        viewBox="0 0 14 14"
        fill="none"
        className="transition-transform duration-300 group-hover:translate-x-1"
        aria-hidden
      >
        <path
          d="M1 7H13M13 7L7 1M13 7L7 13"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </span>
  );

  // Hover handled via JS to ensure color toggles even without Tailwind utility classes.
  const handleEnter = (e: React.MouseEvent<HTMLElement>) => {
    e.currentTarget.style.backgroundColor = "var(--color-accent)";
    e.currentTarget.style.color = "#FFFFFF";
  };
  const handleLeave = (e: React.MouseEvent<HTMLElement>) => {
    e.currentTarget.style.backgroundColor = inlineStyle.backgroundColor as string;
    e.currentTarget.style.color = inlineStyle.color as string;
  };

  const baseClasses = `group inline-flex items-center justify-center h-12 px-7 rounded-full text-sm font-medium uppercase tracking-[0.05em] transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-accent)] focus-visible:ring-offset-2`;

  if (href) {
    return (
      <Link
        href={href}
        className={`${baseClasses} ${className ?? ""}`}
        style={inlineStyle}
        onMouseEnter={handleEnter}
        onMouseLeave={handleLeave}
      >
        {content}
      </Link>
    );
  }
  return (
    <button
      onClick={onClick}
      className={`${baseClasses} ${className ?? ""}`}
      style={inlineStyle}
      onMouseEnter={handleEnter}
      onMouseLeave={handleLeave}
    >
      {content}
    </button>
  );
}
