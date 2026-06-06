import { cn } from "@/lib/utils";
import type { HTMLAttributes } from "react";

export function SectionCard({
  className,
  children,
  ...props
}: HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        "border border-[var(--color-border)] rounded-2xl p-8 bg-[var(--color-surface)]",
        "transition-[border-color,transform] duration-[350ms] ease-out",
        "hover:border-[var(--color-text)] hover:-translate-y-1",
        className,
      )}
      {...props}
    >
      {children}
    </div>
  );
}
