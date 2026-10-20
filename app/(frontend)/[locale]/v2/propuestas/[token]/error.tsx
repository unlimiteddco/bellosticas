"use client";

import { useEffect } from "react";
import { useTranslations } from "next-intl";
import { RefreshCw } from "lucide-react";
import { V2Root } from "@/components/v2/V2Root";

/**
 * Un fallo al hablar con el CRM no debe mostrarse como "propuesta no
 * encontrada": el cliente pensaría que se la hemos retirado. Aquí se le dice
 * lo que pasa de verdad y se le deja reintentar. (Versión de la V2: la misma
 * de /propuestas/[token], con su estilo.)
 */
export default function ProposalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const t = useTranslations("proposalPage.loadError");

  useEffect(() => {
    console.error("[propuestas] fallo al cargar la propuesta", error);
  }, [error]);

  return (
    <V2Root>
      <main className="flex min-h-dvh items-center justify-center px-6 py-24">
        <div className="max-w-[540px] text-center">
          <h1 className="text-[30px] font-medium leading-tight tracking-[-0.03em] md:text-[40px]">{t("title")}</h1>
          <p className="mt-4 text-[16px] leading-[1.6] text-[var(--v2-muted)]">{t("body")}</p>
          <button type="button" onClick={reset} className="v2-btn v2-btn--primary mt-8">
            <RefreshCw size={16} strokeWidth={2} />
            {t("retry")}
          </button>
          <p className="mt-6 text-[14px] text-[var(--v2-muted)]">{t("help")}</p>
        </div>
      </main>
    </V2Root>
  );
}
