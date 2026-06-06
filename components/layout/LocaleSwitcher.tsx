"use client";

import { useTransition } from "react";
import { useLocale } from "next-intl";
import { useParams } from "next/navigation";
import { usePathname, useRouter } from "@/navigation";
import { locales } from "@/i18n";
import { cn } from "@/lib/utils";

type Props = {
  /** "inline" → ES / EN text (light surfaces). "toggle" → segmented pill (dark surfaces). */
  variant?: "inline" | "toggle";
  /** Called after switching — handy to close a mobile menu. */
  onSwitch?: () => void;
};

export function LocaleSwitcher({ variant = "inline", onSwitch }: Props = {}) {
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();
  const params = useParams();
  const [, startTransition] = useTransition();

  const switchTo = (next: (typeof locales)[number]) => {
    if (next === locale) {
      onSwitch?.();
      return;
    }
    // next-intl maps the current (internal) pathname to its localized path in the
    // target locale and updates the NEXT_LOCALE cookie. Passing `params` keeps
    // dynamic routes (e.g. /blog/[slug]) intact across the switch.
    startTransition(() => {
      router.replace(
        // @ts-expect-error -- params is a loose Record; next-intl accepts it.
        { pathname, params },
        { locale: next },
      );
    });
    onSwitch?.();
  };

  if (variant === "toggle") {
    return (
      <div
        className="inline-flex items-center rounded-full border border-[var(--color-bg)]/25 p-1"
        aria-label="Language switcher"
      >
        {locales.map((l) => (
          <button
            key={l}
            type="button"
            onClick={() => switchTo(l)}
            aria-current={l === locale ? "true" : undefined}
            className={cn(
              "px-4 h-8 rounded-full font-body text-[13px] font-medium uppercase transition-colors duration-200",
              l === locale
                ? "bg-[var(--color-bg)] text-[var(--color-text)]"
                : "text-[var(--color-bg)]/60 hover:text-[var(--color-bg)]",
            )}
            style={{ letterSpacing: "0.08em" }}
          >
            {l.toUpperCase()}
          </button>
        ))}
      </div>
    );
  }

  return (
    <div
      className="flex items-center gap-2 font-body text-[12px] uppercase"
      style={{ letterSpacing: "0.12em" }}
      aria-label="Language switcher"
    >
      {locales.map((l, i) => (
        <span key={l} className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => switchTo(l)}
            aria-label={`Switch to ${l.toUpperCase()}`}
            aria-current={l === locale ? "true" : undefined}
            className={cn(
              "transition-colors duration-200",
              l === locale
                ? "text-[var(--color-text)] font-semibold"
                : "text-[var(--color-text-muted)] hover:text-[var(--color-text)]",
            )}
          >
            {l.toUpperCase()}
          </button>
          {i < locales.length - 1 && (
            <span className="text-[var(--color-text-muted)]">/</span>
          )}
        </span>
      ))}
    </div>
  );
}
