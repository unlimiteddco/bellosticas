import type { Metadata } from "next";
import { BarChart3, Bot, Braces, FileText, MapPin, Wrench } from "lucide-react";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { getProjects } from "@/lib/cms/projects";
import { TestimonialsV2 } from "@/components/v2/home/TestimonialsV2";
import { FaqV2 } from "@/components/v2/home/FaqV2";
import { ClosingBand } from "@/components/v2/home/ClosingBand";
import { PaginaServicio } from "@/components/v2/servicio/PaginaServicio";
import {
  ServicioFormatos,
  ServicioHero,
  ServicioProceso,
  ServicioRejilla,
  ServicioRelacionados,
} from "@/components/v2/servicio/Secciones";
import { SeoCambio, SeoDiferencia, SeoNoHacemos } from "@/components/v2/servicio/SeoAeo";

/*
 * SEO + AEO, página de servicio de la V2: posicionamiento en Google y en las
 * respuestas de IA (ChatGPT, Gemini, Modo IA). Es una suscripción mensual, así
 * que los formatos son mes a mes o seis meses (los precios de la página de
 * precios) y llevan a su opción (?opcion=seo-aeo).
 *
 * Todo lo que se afirma sale de fuentes que se pueden comprobar (Google Search
 * Central, OpenAI, Pew Research, Ahrefs), enlazadas en la propia página: nada
 * de trucos ni promesas de primer puesto. Oculta como el resto de la V2.
 * Textos en messages → v2SeoAeo.
 */
const NS = "v2SeoAeo";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: NS });
  return {
    title: `${t("metaTitle")} · V2`,
    description: t("metaDescription"),
    robots: { index: false, follow: false },
  };
}

export default async function SeoAeoV2({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const proyectos = await getProjects(locale);

  return (
    <PaginaServicio locale={locale} proyectos={proyectos}>
      <ServicioHero locale={locale} ns={NS} />
      <SeoCambio locale={locale} ns={NS} />
      <SeoDiferencia locale={locale} ns={NS} />
      <ServicioProceso locale={locale} ns={NS} />
      <ServicioRejilla locale={locale} ns={NS} parte="incluye" iconos={[Wrench, FileText, Braces, MapPin, Bot, BarChart3]} />
      <SeoNoHacemos locale={locale} ns={NS} />
      <ServicioFormatos locale={locale} ns={NS} opcion="seo-aeo" />
      <TestimonialsV2 />
      <ServicioRelacionados locale={locale} ns={NS} claves={["s05", "s01", "s02", "marca"]} />
      <FaqV2 ns={`${NS}.faq`} />
      <ClosingBand />
    </PaginaServicio>
  );
}
