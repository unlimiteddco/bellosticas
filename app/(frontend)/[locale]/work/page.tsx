import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { getProjects } from "@/lib/cms/projects";
import { VIDEO_CASO, conPortada } from "@/lib/v2/videos-casos";
import { ProofRow } from "@/components/v2/home/ProofRow";
import { TestimonialsV2 } from "@/components/v2/home/TestimonialsV2";
import { ClosingBand } from "@/components/v2/home/ClosingBand";
import { PaginaServicio } from "@/components/v2/servicio/PaginaServicio";
import { RejillaTrabajos } from "@/components/v2/trabajos/RejillaTrabajos";

/*
 * Trabajos, en la V2 (al estilo de la página de casos de DesignMe): hero corto,
 * filtros por tipo y la rejilla de proyectos. Cada tarjeta lleva a la página
 * de su caso (/v2/trabajos/[slug]). Textos en
 * messages → v2Trabajos.
 */
export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "v2Trabajos" });
  return {
    title: `${t("metaTitle")}`,
    description: t("metaDescription"),
  };
}

export default async function TrabajosV2({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: "v2Trabajos" });
  const proyectos = conPortada(await getProjects(locale));

  return (
    <PaginaServicio locale={locale} proyectos={proyectos}>
      <section className="v2-frame">
        <div className="flex flex-col items-center gap-6 px-6 pb-12 pt-14 text-center md:px-10 lg:pt-20">
          <span className="v2-label v2-hero-in flex items-center gap-2.5">
            <span aria-hidden className="h-1.5 w-1.5 rounded-full bg-[var(--v2-accent)]" />
            {t("label")}
          </span>
          <h1
            className="v2-hero-in v2-h1"
            style={{ animationDelay: "80ms" }}
          >
            {t("title_part1")}
            <em className="font-display italic font-semibold text-[var(--v2-accent)]">{t("title_emphasis")}</em>
            {t("title_part2")}
          </h1>
          <p
            className="v2-hero-in max-w-[560px] text-[16px] leading-[1.6] text-[var(--v2-muted)] lg:text-[18px]"
            style={{ animationDelay: "160ms" }}
          >
            {t("sub")}
          </p>
          <ProofRow locale={locale} className="v2-hero-in mt-2 justify-center" style={{ animationDelay: "240ms" }} />
        </div>
        <div className="v2-hero-in" style={{ animationDelay: "300ms" }}>
          <RejillaTrabajos proyectos={proyectos} videos={VIDEO_CASO} />
        </div>
      </section>
      <TestimonialsV2 />
      <ClosingBand />
    </PaginaServicio>
  );
}
