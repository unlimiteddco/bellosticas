"use client";

import { useReducedMotion } from "framer-motion";
import { useTranslations } from "next-intl";
import { AsteriskIcon } from "@/components/ui/AsteriskIcon";

/**
 * Option B — Editorial marquee with tokens.
 *
 * The strip now carries signal: editorial uppercase phrases interleaved with
 * carmín asterisks, scrolling slowly. Pauses on hover so the user can read.
 *
 * Tokens are i18n-driven via `marqueeDivider.tokens` (string array per locale).
 *
 * The infinite loop uses the same trick as Option A: render the token row
 * twice side-by-side and translate by -50%, so when the cycle restarts the
 * second copy has just landed where the first started.
 */

type Props = {
  height?: number;
  /** Seconds per full cycle. Lower = faster. Default 38 (slow, readable). */
  duration?: number;
};

export function PatternDividerEditorial({ height = 90, duration = 38 }: Props) {
  const reduced = useReducedMotion();
  const t = useTranslations("marqueeDivider");
  const tokens = (t.raw("tokens") as string[]) ?? [];

  return (
    <div
      className="group relative w-full overflow-hidden"
      style={{ height, backgroundColor: "#1D1D1B" }}
      role="presentation"
    >
      {reduced ? (
        // Reduced motion: static row, centered, no animation
        <div className="absolute inset-0 flex items-center justify-center">
          <TokenRow tokens={tokens} />
        </div>
      ) : (
        <div
          className="absolute inset-0 flex items-center"
          style={{
            width: "max-content",
            animation: `bp-editorial ${duration}s linear infinite`,
            animationPlayState: "running",
          }}
        >
          <TokenRow tokens={tokens} />
          <TokenRow tokens={tokens} aria-hidden />
        </div>
      )}

      <style jsx>{`
        @keyframes bp-editorial {
          0% {
            transform: translateX(0%);
          }
          100% {
            transform: translateX(-50%);
          }
        }
        .group:hover > div {
          animation-play-state: paused;
        }
      `}</style>
    </div>
  );
}

function TokenRow({
  tokens,
  ...rest
}: { tokens: string[] } & React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div className="flex items-center shrink-0" {...rest}>
      {tokens.map((token, i) => (
        <span key={i} className="flex items-center">
          <AsteriskIcon className="w-6 h-6 mx-7 text-[var(--color-accent)] shrink-0" />
          <span
            className="font-body uppercase text-[13px] md:text-[14px] text-[var(--color-bg)] whitespace-nowrap"
            style={{ letterSpacing: "0.22em" }}
          >
            {token}
          </span>
        </span>
      ))}
      {/* Trailing asterisk so the loop end has a separator before the next row starts */}
      <AsteriskIcon className="w-6 h-6 mx-7 text-[var(--color-accent)] shrink-0" />
    </div>
  );
}
