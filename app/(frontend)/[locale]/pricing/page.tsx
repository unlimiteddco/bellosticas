import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { getProjects } from "@/lib/cms/projects";
import { TestimonialsV2 } from "@/components/v2/home/TestimonialsV2";
import { FaqV2 } from "@/components/v2/home/FaqV2";
import { ClosingBand } from "@/components/v2/home/ClosingBand";
import { PaginaServicio } from "@/components/v2/servicio/PaginaServicio";
import { PreciosSelector, PreciosSiempre } from "@/components/v2/precios/Secciones";

/*
 * Precios, en la V2: la mecánica de la página de precios de DesignMe (eliges
 * a la izquierda, el detalle a la derecha, con los niveles esencial /
 * avanzada / a medida dentro de cada opción). Abre una opción concreta con
 * ?opcion=…&nivel=… (o &compromiso=1 en las suscripciones). Textos y cifras en messages → v2Precios y v2PreciosB.
 */
export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "v2Precios" });
  return {
    title: `${t("metaTitle")}`,
    description: t("metaDescription"),
  };
}

export default async function PreciosV2({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const proyectos = await getProjects(locale);

  return (
    <PaginaServicio locale={locale} proyectos={proyectos}>
      <PreciosSelector locale={locale} />
      <PreciosSiempre locale={locale} />
      <TestimonialsV2 />
      <FaqV2 ns="v2Precios.faq" />
      <ClosingBand />
    </PaginaServicio>
  );
}
