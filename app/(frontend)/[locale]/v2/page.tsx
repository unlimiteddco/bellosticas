import type { Metadata } from "next";
import { setRequestLocale } from "next-intl/server";
import { getProjects } from "@/lib/cms/projects";
import { V2Root } from "@/components/v2/V2Root";
import { AnnouncementV2 } from "@/components/v2/Announcement";
import { Header } from "@/components/v2/Header";
import { FooterV2 } from "@/components/v2/Footer";
import { Hero } from "@/components/v2/home/Hero";
import type { CasoReel } from "@/components/v2/home/CaseReel";
import { LogoCells } from "@/components/v2/home/LogoCells";
import { ServicesV2 } from "@/components/v2/home/ServicesV2";
import { CardsPair } from "@/components/v2/home/CardsPair";
import { CasesV2 } from "@/components/v2/home/CasesV2";
import { TestimonialsV2 } from "@/components/v2/home/TestimonialsV2";
import { StudioNote } from "@/components/v2/home/StudioNote";
import { FaqV2 } from "@/components/v2/home/FaqV2";
import { ClosingBand } from "@/components/v2/home/ClosingBand";

/*
 * La V2 de la home, en una dirección oculta para compararla con la actual.
 * Sin indexar y fuera del sitemap hasta que sustituya a la home.
 */
export const metadata: Metadata = {
  title: "Bellostas Studio · V2",
  robots: { index: false, follow: false },
};

/** Qué casos pasa el reproductor del hero, y con qué vídeo si lo tienen. */
const REEL: { slug: string; video?: string }[] = [
  { slug: "flylead", video: "/videos/marca.mp4" },
  { slug: "teleadhesivo", video: "/videos/ecommerce.mp4" },
  { slug: "borrell-pinol" },
];

export default async function V2Page({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const proyectos = await getProjects(locale);

  const trabajosMenu = proyectos.map((p) => ({
    slug: p.slug,
    name: p.name,
    category: p.category,
    color: p.color,
    cover: p.cover,
    logo: p.logo,
    comingSoon: p.comingSoon,
  }));

  const casos: CasoReel[] = REEL.flatMap((r): CasoReel[] => {
    const p = proyectos.find((x) => x.slug === r.slug);
    if (!p || (!r.video && !p.cover)) return [];
    return [{ slug: p.slug, nombre: p.name, etiquetas: p.category, color: p.color, video: r.video, imagen: p.cover }];
  });

  return (
    <V2Root>
      <AnnouncementV2 locale={locale} />
      <Header trabajos={trabajosMenu} />
      <main id="top">
        <Hero locale={locale} casos={casos} />
        {/* Primero los logos, de un vistazo, como base del hero; luego los
            testimonios, que piden pararse a leer. */}
        <LogoCells />
        <TestimonialsV2 />
        <ServicesV2 />
        <CardsPair locale={locale} />
        <CasesV2 locale={locale} proyectos={proyectos} />
        <StudioNote locale={locale} />
        <FaqV2 />
        <ClosingBand />
      </main>
      <FooterV2 locale={locale} />
    </V2Root>
  );
}
