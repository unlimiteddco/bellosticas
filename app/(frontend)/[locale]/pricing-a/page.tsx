import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { getProjects } from "@/lib/cms/projects";
import { TestimonialsV2 } from "@/components/v2/home/TestimonialsV2";
import { FaqV2 } from "@/components/v2/home/FaqV2";
import { ClosingBand } from "@/components/v2/home/ClosingBand";
import { PaginaServicio } from "@/components/v2/servicio/PaginaServicio";
import { ServicioHero } from "@/components/v2/servicio/Secciones";
import { PreciosAgencias, PreciosPacks, PreciosServicios } from "@/components/v2/precios/VersionA";

/*
 * Precios, versión A (guardada; la que se usa es /v2/precios). Packs en
 * tarjetas y servicios con su tabla de niveles. Textos y cifras en messages → v2Precios.
 */
export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "v2Precios" });
  return {
    title: `${t("metaTitle")} (A)`,
    description: t("metaDescription"),
    robots: { index: false, follow: false },
  };
}

export default async function PreciosAV2({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const proyectos = await getProjects(locale);

  return (
    <PaginaServicio locale={locale} proyectos={proyectos}>
      <ServicioHero locale={locale} ns="v2Precios" ancla="packs" />
      <PreciosPacks locale={locale} />
      <PreciosServicios locale={locale} />
      <PreciosAgencias locale={locale} />
      <TestimonialsV2 />
      <FaqV2 ns="v2Precios.faq" />
      <ClosingBand />
    </PaginaServicio>
  );
}
