"use client";

import { useTranslations } from "next-intl";
import { AI_ASSISTANTS } from "@/components/layout/ai-assistants";

/**
 * Barra "Resumir con IA" del post — abre el asistente elegido con un prompt que
 * le pide resumir ESTE artículo (usando su URL). Reutiliza los logos de IA del
 * footer. Es interactivo (lee window.location al hacer clic), así que botones.
 */
export function AiSummarizeBar() {
  const t = useTranslations("blog");

  const open = (base: string) => {
    const url = typeof window !== "undefined" ? window.location.href : "";
    const prompt = t("aiSummarizePrompt", { url });
    window.open(base + encodeURIComponent(prompt), "_blank", "noopener");
  };

  return (
    <div className="flex items-center justify-between gap-4 rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface-2)]/50 px-5 py-3.5 mb-12">
      <span
        className="font-body uppercase text-[11px] text-[var(--color-text-muted)]"
        style={{ letterSpacing: "0.16em" }}
      >
        {t("aiSummarizeLabel")}
      </span>
      <div className="flex items-center gap-1.5">
        {AI_ASSISTANTS.map((ai) => (
          <button
            key={ai.name}
            type="button"
            onClick={() => open(ai.url)}
            aria-label={`${t("aiSummarizeAria")} ${ai.name}`}
            title={ai.name}
            className="flex items-center justify-center w-9 h-9 rounded-lg text-[var(--color-text-muted)] hover:text-[var(--color-text)] hover:bg-[var(--color-bg)] transition-colors"
          >
            <svg width={18} height={18} viewBox={ai.viewBox} fill="currentColor" aria-hidden>
              <path d={ai.path} />
            </svg>
          </button>
        ))}
      </div>
    </div>
  );
}
