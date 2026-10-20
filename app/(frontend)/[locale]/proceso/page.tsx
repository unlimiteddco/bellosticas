import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { getProjects } from "@/lib/cms/projects";
import { TestimonialsV2 } from "@/components/v2/home/TestimonialsV2";
import { ClosingBand } from "@/components/v2/home/ClosingBand";
import { PaginaServicio } from "@/components/v2/servicio/PaginaServicio";
import { ServicioHero } from "@/components/v2/servicio/Secciones";
import {
  ProcesoIA,
  ProcesoMomentos,
  ProcesoPortal,
  ProcesoServicios,
  ProcesoSiempre,
  ProcesoStack,
} from "@/components/v2/proceso/Secciones";

/*
 * Cómo trabajamos, en la V2. Textos en messages → v2Proceso.
 */
export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "v2Proceso" });
  return {
    title: `${t("metaTitle")}`,
    description: t("metaDescription"),
  };
}

export default async function ProcesoV2({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const proyectos = await getProjects(locale);

  return (
    <PaginaServicio locale={locale} proyectos={proyectos}>
      <ServicioHero locale={locale} ns="v2Proceso" />
      <ProcesoMomentos locale={locale} />
      <ProcesoServicios locale={locale} />
      <ProcesoIA locale={locale} />
      <ProcesoSiempre locale={locale} />
      <ProcesoPortal locale={locale} />
      <ProcesoStack locale={locale} />
      <TestimonialsV2 />
      <ClosingBand />
    </PaginaServicio>
  );
}
