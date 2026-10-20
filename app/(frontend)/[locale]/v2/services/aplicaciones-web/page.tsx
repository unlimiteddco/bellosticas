import type { Metadata } from "next";
import {
  BarChart3,
  Bot,
  CreditCard,
  DatabaseBackup,
  Gauge,
  LayoutDashboard,
  PenTool,
  Plug,
  ShieldCheck,
  Smartphone,
  TriangleAlert,
  Users,
} from "lucide-react";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { getProjects } from "@/lib/cms/projects";
import { VIDEO_CASO } from "@/lib/v2/videos-casos";
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
 * Aplicaciones web, página de servicio de la V2. Misma plantilla que Webs y
 * E-commerce; los formatos (MVP y producto completo) llevan a su opción en
 * precios (?opcion=app). Mismo slug que la de la V1 (/services/aplicaciones-web)
 * para no perder la dirección. Oculta como el resto de la V2. Textos en
 * messages → v2Apps (las fases, las de Aplicaciones en la página de Proceso).
 */
const NS = "v2Apps";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: NS });
  return {
    title: `${t("metaTitle")} · V2`,
    description: t("metaDescription"),
    robots: { index: false, follow: false },
  };
}

export default async function AplicacionesV2({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const proyectos = await getProjects(locale);
  // Tres aplicaciones reales: FlyLead (nuestro SaaS, con su vídeo), Gotten Gym
  // y PrimeX Academy, con lo que dijo cada cliente.
  const casos = await casosDe(locale, proyectos, [
    { slug: "flylead", video: VIDEO_CASO.flylead },
    { slug: "gotten-gym", testimonio: { clave: "t5" } },
    { slug: "primex-academy", testimonio: { clave: "t4" } },
  ]);

  return (
    <PaginaServicio locale={locale} proyectos={proyectos}>
      <ServicioHero locale={locale} ns={NS} />
      <LogoCells />
      <ServicioCifras locale={locale} ns={NS} />
      <ServicioCasos locale={locale} ns={NS} casos={casos} />
      <ServicioProceso locale={locale} ns={NS} />
      <ServicioRejilla locale={locale} ns={NS} parte="checks" iconos={[Gauge, ShieldCheck, DatabaseBackup, TriangleAlert, Smartphone, BarChart3]} />
      <ServicioRejilla locale={locale} ns={NS} parte="incluye" linea iconos={[PenTool, Users, LayoutDashboard, CreditCard, Plug, Bot]} />
      <ServicioTecnologias locale={locale} ns={NS} />
      <ServicioFormatos locale={locale} ns={NS} opcion="app" />
      <TestimonialsV2 />
      <ServicioRelacionados locale={locale} ns={NS} claves={["s04", "s01", "s02", "s05"]} />
      <FaqV2 ns={`${NS}.faq`} />
      <ClosingBand />
    </PaginaServicio>
  );
}
