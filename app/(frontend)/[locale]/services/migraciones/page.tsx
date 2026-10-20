import type { Metadata } from "next";
import {
  CalendarCheck,
  MousePointerClick,
  Palette,
  PencilLine,
  ShieldCheck,
  TrendingUp,
  Zap,
  Copy,
  FileStack,
  Gauge,
  LineChart,
  ListTree,
  Map,
  Search,
  SquarePen,
  Undo2,
  Waypoints,
  ScanSearch,
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
  ServicioAntesDespues,
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
 * Migraciones, página de servicio de la V2: no solo cambiar de plataforma,
 * sino una renovación completa (diseño, velocidad, SEO) sin perder lo ganado
 * en Google. Misma plantilla que el resto de servicios; las fases son las de
 * Migraciones en la página de Proceso (con «Renovación» en la cuarta) y
 * los formatos llevan a su opción en precios (?opcion=migraciones). Mismo slug
 * que la de la V1 (/services/migraciones).
 * Textos en messages → v2Migraciones.
 */
const NS = "v2Migraciones";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: NS });
  return { title: `${t("metaTitle")}`, description: t("metaDescription") };
}

export default async function MigracionesV2({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const proyectos = await getProjects(locale);
  // Dos migraciones reales: TeleAdhesivo («migró nuestra tienda sin perder una
  // sola venta») y Voluntariado Aragón (de WordPress a Next.js y Sanity).
  const casos = await casosDe(locale, proyectos, [
    { slug: "teleadhesivo", video: VIDEO_CASO.teleadhesivo, testimonio: { clave: "t6", cara: "/caras/cara-teleadhesivo.jpg" } },
    { slug: "voluntariado-aragon", testimonio: { clave: "t2", cara: "/caras/adela-face.png" } },
  ]);

  return (
    <PaginaServicio locale={locale} proyectos={proyectos}>
      <ServicioHero locale={locale} ns={NS} />
      <LogoCells />
      <ServicioCifras locale={locale} ns={NS} />
      {/* No solo se migra: se renueva. Lo que ganas y un antes/después real. */}
      <ServicioRejilla locale={locale} ns={NS} parte="ganas" linea iconos={[Palette, Zap, TrendingUp, MousePointerClick, PencilLine, ShieldCheck]} />
      <ServicioAntesDespues locale={locale} ns={NS} antes="/clientes/fada-antes.jpg" despues="/clientes/fada-despues.jpg" />
      <ServicioCasos locale={locale} ns={NS} casos={casos} />
      <ServicioProceso locale={locale} ns={NS} />
      <ServicioRejilla locale={locale} ns={NS} parte="checks" iconos={[Waypoints, Map, ScanSearch, Gauge, Undo2, CalendarCheck]} />
      <ServicioRejilla locale={locale} ns={NS} parte="incluye" linea iconos={[Search, ListTree, FileStack, Copy, SquarePen, LineChart]} />
      <ServicioTecnologias locale={locale} ns={NS} />
      <ServicioFormatos locale={locale} ns={NS} opcion="migraciones" />
      <TestimonialsV2 />
      <ServicioRelacionados locale={locale} ns={NS} claves={["seo", "s01", "s02", "s04"]} />
      <FaqV2 ns={`${NS}.faq`} />
      <ClosingBand />
    </PaginaServicio>
  );
}
