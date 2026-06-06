type Props = {
  name: string;
  size?: number;
  className?: string;
};

export function InitialsAvatar({ name, size = 48, className }: Props) {
  const initials = name
    .split(" ")
    .map((n) => n[0])
    .filter(Boolean)
    .slice(0, 2)
    .join("")
    .toUpperCase();

  return (
    <div
      className={`flex items-center justify-center rounded-full bg-[var(--color-text)] text-[var(--color-bg)] shrink-0 ${className ?? ""}`}
      style={{ width: size, height: size }}
    >
      <span
        className="font-display tracking-tight leading-none"
        style={{ fontSize: Math.round(size * 0.36) }}
      >
        {initials}
      </span>
    </div>
  );
}
