import type { Metadata } from "next";
import {
  BarChart3,
  CreditCard,
  Gauge,
  LayoutGrid,
  Mail,
  PenTool,
  Search,
  Settings2,
  Smartphone,
  Truck,
  Undo2,
  Wallet,
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
 * E-commerce, página de servicio de la V2. Misma plantilla que Webs
 * corporativas; los formatos son los niveles de la página de precios y llevan
 * a su opción (?opcion=ecommerce). Mismo slug que la de la V1
 * (/services/ecommerce) para no perder la dirección. Textos en messages → v2Ecommerce.
 */
const NS = "v2Ecommerce";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: NS });
  return {
    title: `${t("metaTitle")}`,
    description: t("metaDescription"),
  };
}

export default async function EcommerceV2({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const proyectos = await getProjects(locale);
  // Tres tiendas reales, cada una con su recorrido en vídeo y, si lo ha dicho,
  // lo que opina su cliente.
  const casos = await casosDe(locale, proyectos, [
    { slug: "teleadhesivo", video: "/videos/ecommerce.mp4", testimonio: { clave: "t6", cara: "/caras/cara-teleadhesivo.jpg" } },
    { slug: "embroidery-download", video: "/videos/embroidery.mp4", testimonio: { clave: "t7", ns: "lovePage.mosaic.items" } },
    { slug: "obra-partner", video: "/videos/obrapartner.mp4" },
  ]);

  return (
    <PaginaServicio locale={locale} proyectos={proyectos}>
      <ServicioHero locale={locale} ns={NS} />
      <LogoCells />
      <ServicioCifras locale={locale} ns={NS} />
      <ServicioCasos locale={locale} ns={NS} casos={casos} />
      <ServicioProceso locale={locale} ns={NS} />
      <ServicioRejilla locale={locale} ns={NS} parte="checks" iconos={[Gauge, Smartphone, CreditCard, Search, Undo2, BarChart3]} />
      <ServicioRejilla locale={locale} ns={NS} parte="incluye" linea iconos={[LayoutGrid, PenTool, Wallet, Truck, Mail, Settings2]} />
      <ServicioTecnologias locale={locale} ns={NS} />
      <ServicioFormatos locale={locale} ns={NS} opcion="ecommerce" />
      <TestimonialsV2 />
      <ServicioRelacionados locale={locale} ns={NS} claves={["marca", "s01", "s05", "s04"]} />
      <FaqV2 ns={`${NS}.faq`} />
      <ClosingBand />
    </PaginaServicio>
  );
}
