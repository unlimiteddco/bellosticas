import Image from "next/image";

type LogoProps = {
  variant?: "wordmark" | "black" | "white-red";
  height?: number;
  className?: string;
  priority?: boolean;
};

const aspectRatios = {
  wordmark: 320 / 48,
  black: 507.24 / 68.36,
  "white-red": 1114.64 / 152.76,
} as const;

export function Logo({
  variant = "wordmark",
  height = 22,
  className,
  priority = false,
}: LogoProps) {
  const src = {
    wordmark: "/logos/bellostas-wordmark.svg",
    black: "/logos/logo-black.svg",
    "white-red": "/logos/logo-white-red.svg",
  }[variant];

  const width = Math.round(height * aspectRatios[variant]);

  return (
    <Image
      src={src}
      alt="Bellostas Studio"
      height={height}
      width={width}
      priority={priority}
      className={className}
    />
  );
}
