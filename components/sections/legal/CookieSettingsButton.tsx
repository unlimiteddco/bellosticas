"use client";

import { Cookie } from "lucide-react";
import { useCookieConsent } from "@/components/cookies/CookieProvider";

type Props = {
  label: string;
};

export function CookieSettingsButton({ label }: Props) {
  const { openModal } = useCookieConsent();
  return (
    <button
      type="button"
      onClick={openModal}
      className="inline-flex items-center gap-2 px-4 py-2.5 rounded-full bg-[var(--color-text)] text-[var(--color-bg)] font-body text-[13px] hover:bg-[var(--color-accent)] transition-colors"
      style={{ letterSpacing: "0.04em" }}
    >
      <Cookie size={14} strokeWidth={2} />
      {label}
    </button>
  );
}
