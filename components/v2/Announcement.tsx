import { ArrowRight } from "lucide-react";
import { getTranslations } from "next-intl/server";
import { Link } from "@/navigation";

/**
 * La franja de aviso de arriba: el cliente nuevo (sin nombre, por
 * confidencialidad), que lleva a Trabajos, donde sale como «Próximamente».
 * En móvil, sin la etiqueta y con la frase corta para que quepa entera.
 */
export async function AnnouncementV2({ locale }: { locale: string }) {
  const t = await getTranslations({ locale, namespace: "announcement" });
  return (
    <Link
      href="/work"
      className="group flex h-9 items-center justify-center gap-3 bg-[var(--v2-band)] px-4 text-[12px] text-white/85 sm:text-[13px]"
    >
      <span className="hidden bg-white px-1.5 py-[1px] font-mono text-[10px] font-semibold tracking-[0.08em] text-black sm:inline">
        {t("badge")}
      </span>
      <span className="truncate sm:hidden">{t("textShort")}</span>
      <span className="hidden truncate sm:inline">{t("text")}</span>
      <ArrowRight size={13} className="shrink-0 transition-transform group-hover:translate-x-0.5" />
    </Link>
  );
}
