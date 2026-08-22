"use client";

import { useEffect } from "react";
import { useTranslations } from "next-intl";
import { RefreshCw } from "lucide-react";

/**
 * Un fallo al hablar con el CRM no debe mostrarse como "propuesta no
 * encontrada": el cliente pensaría que se la hemos retirado. Aquí se le dice
 * lo que pasa de verdad y se le deja reintentar.
 */
export default function ProposalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const t = useTranslations("proposalPage.error");

  useEffect(() => {
    console.error("[propuestas] fallo al cargar la propuesta", error);
  }, [error]);

  return (
    <main className="min-h-[70vh] flex items-center justify-center px-6 py-24">
      <div className="max-w-[540px] text-center">
        <h1 className="font-display text-[30px] md:text-[38px] leading-tight text-[var(--color-text)]">
          {t("title")}
        </h1>
        <p className="mt-4 font-body text-[16px] leading-[1.6] text-[var(--color-text-muted)]">
          {t("body")}
        </p>
        <button
          type="button"
          onClick={reset}
          className="mt-8 inline-flex items-center gap-2 rounded-full bg-[var(--color-text)] px-7 py-3.5 font-body text-[15px] font-medium text-[var(--color-bg)] transition-opacity hover:opacity-88 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-accent)]"
        >
          <RefreshCw size={16} strokeWidth={2} />
          {t("retry")}
        </button>
        <p className="mt-6 font-body text-[14px] text-[var(--color-text-muted)]">{t("help")}</p>
      </div>
    </main>
  );
}
