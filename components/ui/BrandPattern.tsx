type BrandPatternProps = {
  opacity?: number;
  size?: "xs" | "sm" | "md" | "lg";
  className?: string;
  asBackground?: boolean;
  blendMode?: "normal" | "multiply" | "screen" | "overlay";
};

const tileSizes = {
  xs: { width: "70px", height: "35px" },
  sm: { width: "140px", height: "70px" },
  md: { width: "210px", height: "105px" },
  lg: { width: "280px", height: "140px" },
} as const;

export function BrandPattern({
  opacity = 1,
  size = "sm",
  className = "",
  asBackground = false,
  blendMode = "normal",
}: BrandPatternProps) {
  const { width, height } = tileSizes[size];

  const style: React.CSSProperties = {
    backgroundImage: `url(/patterns/patron-asteriscos.svg)`,
    backgroundSize: `${width} ${height}`,
    backgroundRepeat: "repeat",
    opacity,
    mixBlendMode: blendMode === "normal" ? undefined : blendMode,
  };

  if (asBackground) {
    return (
      <div
        className={`absolute inset-0 pointer-events-none ${className}`}
        style={style}
      />
    );
  }

  return <div className={className} style={style} />;
}
