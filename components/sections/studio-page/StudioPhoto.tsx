"use client";

import { useState } from "react";
import { AsteriskIcon } from "@/components/ui/AsteriskIcon";

type Props = {
  /** Source path. When missing/errored, an elegant placeholder is rendered. */
  src?: string;
  alt?: string;
  /** Description shown inside the placeholder ("// FOTO PENDIENTE · {label}") */
  label: string;
  className?: string;
  /** Tailwind aspect class or inline aspectRatio value */
  aspect?: string;
  /** Tone of the placeholder gradient */
  tone?: "warm" | "dark";
  /** Show small asterisk decoration in the placeholder */
  withAsterisk?: boolean;
  /** object-position for the photo (e.g. "top" to avoid cropping faces) */
  objectPosition?: string;
};

export function StudioPhoto({
  src,
  alt = "",
  label,
  className = "",
  aspect = "4 / 5",
  tone = "warm",
  withAsterisk = false,
  objectPosition = "center",
}: Props) {
  const [errored, setErrored] = useState(false);
  const showPhoto = src && !errored;

  const gradient =
    tone === "warm"
      ? "linear-gradient(135deg, #F4F2EE 0%, #E5E2DC 55%, #D6D0C3 100%)"
      : "linear-gradient(135deg, #2C2417 0%, #1D1D1B 55%, #14110D 100%)";

  return (
    <div
      className={`relative overflow-hidden rounded-lg ${className}`}
      style={{ aspectRatio: aspect, background: gradient }}
    >
      {showPhoto ? (
        <img
          src={src}
          alt={alt}
          onError={() => setErrored(true)}
          className="absolute inset-0 w-full h-full object-cover"
          style={{ objectPosition }}
        />
      ) : (
        <>
          {/* Soft vignette inside placeholder */}
          <div
            className="absolute inset-0"
            style={{
              background:
                tone === "warm"
                  ? "radial-gradient(ellipse at 30% 30%, rgba(255,255,255,0.5) 0%, transparent 60%)"
                  : "radial-gradient(ellipse at 30% 30%, rgba(255,255,255,0.08) 0%, transparent 60%)",
            }}
          />
          {/* Editorial label */}
          <div
            className="absolute inset-0 flex flex-col items-start justify-end p-4"
            style={{ color: tone === "warm" ? "var(--color-text-muted)" : "rgba(255,255,255,0.55)" }}
          >
            <span
              className="font-body uppercase text-[10px] leading-tight"
              style={{ letterSpacing: "0.18em" }}
            >
              // FOTO PENDIENTE
            </span>
            <span
              className="font-body text-[10px] mt-0.5 leading-tight"
              style={{ letterSpacing: "0.04em" }}
            >
              {label}
            </span>
          </div>
          {withAsterisk && (
            <div
              className="absolute"
              style={{
                top: "16%",
                right: "12%",
                width: "32%",
                height: "32%",
                color:
                  tone === "warm"
                    ? "rgba(194,38,58,0.18)"
                    : "rgba(194,38,58,0.32)",
              }}
            >
              <AsteriskIcon className="w-full h-full" />
            </div>
          )}
        </>
      )}
    </div>
  );
}
