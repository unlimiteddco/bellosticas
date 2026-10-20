import type { Metadata } from "next";
import {
  BarChart3,
  Bell,
  BookOpen,
  FileText,
  KeyRound,
  Mail,
  MessageCircle,
  Plug,
  PowerOff,
  Sparkles,
  UserCheck,
  Wrench,
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
 * Automatizaciones, página de servicio de la V2. Misma plantilla que el resto
 * de servicios; las fases son las de Automatizaciones en la página de Proceso
 * y los formatos llevan a su opción en precios (?opcion=automatizaciones).
 * Mismo slug que la de la V1 (/services/automatizaciones). Oculta como el
 * resto de la V2. Textos en messages → v2Automatizaciones.
 */
const NS = "v2Automatizaciones";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: NS });
  return { title: `${t("metaTitle")} · V2`, description: t("metaDescription"), robots: { index: false, follow: false } };
}

export default async function AutomatizacionesV2({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const proyectos = await getProjects(locale);
  const casos = await casosDe(locale, proyectos, [{ slug: "flylead", video: VIDEO_CASO.flylead }]);

  return (
    <PaginaServicio locale={locale} proyectos={proyectos}>
      <ServicioHero locale={locale} ns={NS} />
      <LogoCells />
      <ServicioCifras locale={locale} ns={NS} />
      <ServicioCasos locale={locale} ns={NS} casos={casos} />
      <ServicioProceso locale={locale} ns={NS} />
      <ServicioRejilla locale={locale} ns={NS} parte="checks" iconos={[PowerOff, UserCheck, KeyRound, BarChart3, Bell, BookOpen]} />
      <ServicioRejilla locale={locale} ns={NS} parte="incluye" linea iconos={[MessageCircle, Sparkles, Plug, Mail, FileText, Wrench]} />
      <ServicioTecnologias locale={locale} ns={NS} />
      <ServicioFormatos locale={locale} ns={NS} opcion="automatizaciones" />
      <TestimonialsV2 />
      <ServicioRelacionados locale={locale} ns={NS} claves={["s03", "s01", "s02", "s05"]} />
      <FaqV2 ns={`${NS}.faq`} />
      <ClosingBand />
    </PaginaServicio>
  );
}
