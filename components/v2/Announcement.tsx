import { ArrowRight } from "lucide-react";
import { getTranslations } from "next-intl/server";
import { Link } from "@/navigation";

/**
 * La franja de aviso de arriba: el cliente nuevo (sin nombre, por
 * confidencialidad), que lleva a Trabajos, donde sale como «Próximamente».
 * En móvil, la etiqueta dice «Nuevo cliente» (así se entiende que trabaja
 * con nosotros) y la frase va corta; por debajo de 360 px, solo «Nuevo».
 */
export async function AnnouncementV2({ locale }: { locale: string }) {
  const t = await getTranslations({ locale, namespace: "announcement" });
  return (
    <Link
      href="/work"
      className="group flex h-9 items-center justify-center gap-2 bg-[var(--v2-band)] px-3 text-[12px] max-[374px]:text-[11.5px] sm:px-4 text-white/85 sm:gap-3 sm:text-[13px]"
    >
      <span className="shrink-0 bg-white px-1.5 py-[1px] font-mono text-[10px] font-semibold tracking-[0.08em] text-black">
        <span className="max-[359px]:hidden sm:hidden">{t("badgeClient")}</span>
        <span className="hidden max-[359px]:inline sm:inline">{t("badge")}</span>
      </span>
      <span className="truncate sm:hidden">{t("textShort")}</span>
      <span className="hidden truncate sm:inline">{t("text")}</span>
      <ArrowRight size={13} className="shrink-0 transition-transform group-hover:translate-x-0.5" />
    </Link>
  );
}
