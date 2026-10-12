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
        // Peso medio y un punto más: en regular a 11 px casi no se leían.
        "font-body font-medium uppercase text-[12px] leading-none text-[var(--color-text)]/70",
        className,
      )}
      style={{ letterSpacing: "0.18em" }}
      {...props}
    >
      {children}
    </Tag>
  );
}
