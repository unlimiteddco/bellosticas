import type { Metadata } from "next";
import {
  Accessibility,
  BarChart3,
  Code2,
  FileText,
  Gauge,
  LayoutTemplate,
  MousePointerClick,
  PenTool,
  Search,
  Smartphone,
  SquarePen,
  Undo2,
} from "lucide-react";
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
  ServicioProceso,
  ServicioRejilla,
  ServicioRelacionados,
  ServicioTecnologias,
} from "@/components/v2/servicio/Secciones";

/*
 * Webs corporativas, página de servicio de la V2 (inspirada en la de diseño
 * web de DesignMe). Mismo slug que la de la V1 (/services/desarrollo-web) para
 * que, cuando la V2 la sustituya, Google no pierda la dirección. Oculta como
 * el resto de la V2. Textos en messages → v2Webs (las preguntas, las de la V1).
 */
const NS = "v2Webs";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: NS });
  return {
    title: `${t("metaTitle")} · V2`,
    description: t("metaDescription"),
    robots: { index: false, follow: false },
  };
}

export default async function WebsCorporativasV2({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const proyectos = await getProjects(locale);
  // Dos webs reales con lo que dijo su cliente.
  const casos = await casosDe(locale, proyectos, [
    { slug: "fada", imagen: "/clientes/fada-despues.jpg", testimonio: { clave: "t3", cara: "/caras/themis-face.png" } },
    { slug: "voluntariado-aragon", testimonio: { clave: "t2", cara: "/caras/adela-face.png" } },
  ]);

  return (
    <PaginaServicio locale={locale} proyectos={proyectos}>
      <ServicioHero locale={locale} ns={NS} />
      <LogoCells />
      <ServicioCifras locale={locale} ns={NS} />
      <ServicioCasos locale={locale} ns={NS} casos={casos} />
      <ServicioProceso locale={locale} ns={NS} />
      <ServicioRejilla locale={locale} ns={NS} parte="checks" iconos={[Gauge, Smartphone, Search, Undo2, Accessibility, BarChart3]} />
      <ServicioRejilla locale={locale} ns={NS} parte="incluye" linea iconos={[LayoutTemplate, PenTool, Code2, SquarePen, Search, MousePointerClick]} />
      <ServicioTecnologias locale={locale} ns={NS} />
      <ServicioFormatos locale={locale} ns={NS} />
      <TestimonialsV2 />
      <ServicioRelacionados locale={locale} ns={NS} claves={["marca", "seo", "s02", "s03"]} />
      <FaqV2 ns={`${NS}.faq`} />
      <ClosingBand />
    </PaginaServicio>
  );
}
