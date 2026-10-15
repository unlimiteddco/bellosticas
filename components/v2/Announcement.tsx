import { ArrowRight } from "lucide-react";
import { getTranslations } from "next-intl/server";

/** La franja de aviso de arriba (la misma noticia que la web actual: FlyLead). */
export async function AnnouncementV2({ locale }: { locale: string }) {
  const t = await getTranslations({ locale, namespace: "announcement" });
  return (
    <a
      href="https://flylead.es"
      target="_blank"
      rel="noopener"
      className="group flex h-9 items-center justify-center gap-3 bg-[var(--v2-band)] px-4 text-[13px] text-white/85"
    >
      <span className="bg-white px-1.5 py-[1px] font-mono text-[10px] font-semibold tracking-[0.08em] text-black">{t("badge")}</span>
      <span className="truncate">{t("text")}</span>
      <ArrowRight size={13} className="shrink-0 transition-transform group-hover:translate-x-0.5" />
    </a>
  );
}
