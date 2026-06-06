import { cn } from "@/lib/utils";
import type { HTMLAttributes } from "react";

interface EditorialLabelProps extends HTMLAttributes<HTMLSpanElement> {
  as?: "span" | "div" | "p";
}

export function EditorialLabel({
  className,
  as: Tag = "span",
  children,
  ...props
}: EditorialLabelProps) {
  return (
    <Tag
      className={cn(
        "font-body uppercase text-[11px] leading-none text-[var(--color-text-muted)]",
        className,
      )}
      style={{ letterSpacing: "0.18em" }}
      {...props}
    >
      {children}
    </Tag>
  );
}
