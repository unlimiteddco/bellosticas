import type { Metadata } from "next";
import { BookOpen, Compass, FileText, Megaphone, Monitor, PenTool } from "lucide-react";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { getProjects } from "@/lib/cms/projects";
import { LogoCells } from "@/components/v2/home/LogoCells";
import { TestimonialsV2 } from "@/components/v2/home/TestimonialsV2";
import { FaqV2 } from "@/components/v2/home/FaqV2";
import { ClosingBand } from "@/components/v2/home/ClosingBand";
import { PaginaServicio, casosDe } from "@/components/v2/servicio/PaginaServicio";
import {
  ServicioCasos,
  ServicioCifras,
  ServicioFormatos,
  ServicioHero,
  ServicioPorQue,
  ServicioProceso,
  ServicioRejilla,
  ServicioRelacionados,
} from "@/components/v2/servicio/Secciones";

/*
 * Identidad de marca, página de servicio de la V2. Textos en messages → v2Brand.
 */
const NS = "v2Brand";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: NS });
  return {
    title: `${t("metaTitle")}`,
    description: t("metaDescription"),
  };
}

export default async function IdentidadDeMarcaV2({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const proyectos = await getProjects(locale);
  // FlyLead es la marca completa que podemos enseñar (marca, web y CRM).
  // TeleAdhesivo va de prueba, con su vídeo y lo que dijo su cliente.
  const casos = await casosDe(locale, proyectos, [
    { slug: "flylead", video: "/videos/marca.mp4" },
    { slug: "teleadhesivo", video: "/videos/ecommerce.mp4", testimonio: { clave: "t6", cara: "/caras/cara-teleadhesivo.jpg" } },
  ]);

  return (
    <PaginaServicio locale={locale} proyectos={proyectos}>
      <ServicioHero locale={locale} ns={NS} />
      <LogoCells />
      <ServicioCasos locale={locale} ns={NS} casos={casos} />
      <ServicioProceso locale={locale} ns={NS} />
      <ServicioRejilla locale={locale} ns={NS} parte="incluye" iconos={[Compass, PenTool, BookOpen, Monitor, Megaphone, FileText]} />
      <ServicioFormatos locale={locale} ns={NS} />
      <ServicioPorQue locale={locale} ns={NS} />
      <ServicioCifras locale={locale} ns={NS} />
      <TestimonialsV2 />
      <ServicioRelacionados locale={locale} ns={NS} claves={["s01", "s02", "s03", "s04"]} />
      <FaqV2 ns={`${NS}.faq`} />
      <ClosingBand />
    </PaginaServicio>
  );
}
