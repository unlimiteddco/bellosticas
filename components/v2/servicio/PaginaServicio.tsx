import { getTranslations } from "next-intl/server";
import type { ResolvedProject } from "@/lib/cms/types";
import { V2Root } from "@/components/v2/V2Root";
import { AnnouncementV2 } from "@/components/v2/Announcement";
import { Header } from "@/components/v2/Header";
import { FooterV2 } from "@/components/v2/Footer";
import type { CasoServicio } from "./Secciones";

/**
 * El envoltorio de una página de servicio de la V2: aviso, cabecera con sus
 * megamenús, pie y la ficha de caso que se abre desde cualquier enlace a un
 * trabajo. Lo de dentro lo compone cada página con los bloques de Secciones.
 */
export function PaginaServicio({
  locale,
  proyectos,
  children,
}: {
  locale: string;
  proyectos: ResolvedProject[];
  children: React.ReactNode;
}) {
  const trabajosMenu = proyectos.map((p) => ({
    slug: p.slug,
    name: p.name,
    category: p.category,
    color: p.color,
    cover: p.cover,
    logo: p.logo,
    comingSoon: p.comingSoon,
  }));
  return (
    <V2Root>
      <AnnouncementV2 locale={locale} />
      <Header trabajos={trabajosMenu} />
      <main id="top">{children}</main>
      <FooterV2 locale={locale} />
    </V2Root>
  );
}

/**
 * Los casos de una página a partir de sus slugs, con el vídeo y la cita del
 * cliente (de shortTestimonials, la misma que sale en la web) si los tiene.
 * Los que no estén en el gestor se quedan fuera sin romper nada.
 */
export async function casosDe(
  locale: string,
  proyectos: ResolvedProject[],
  // `ns`: de dónde sale la cita si no está entre las cortas (p. ej. la de
  // Embroidery Download, que solo está en la página de testimonios).
  lista: { slug: string; video?: string; imagen?: string; testimonio?: { clave: string; cara?: string; ns?: string } }[],
): Promise<CasoServicio[]> {
  const cortas = await getTranslations({ locale, namespace: "shortTestimonials.items" });
  const otras = await getTranslations({ locale, namespace: "lovePage.mosaic.items" });
  return lista.flatMap(({ slug, video, imagen, testimonio }) => {
    const proyecto = proyectos.find((p) => p.slug === slug);
    if (!proyecto) return [];
    const k = testimonio?.clave;
    const tt = testimonio?.ns === "lovePage.mosaic.items" ? otras : cortas;
    return [
      {
        proyecto,
        video,
        imagen,
        testimonio: k
          ? {
              quote: tt(`${k}.quote`),
              name: tt(`${k}.name`),
              role: `${tt(`${k}.role`)} · ${tt(`${k}.company`)}`,
              cara: testimonio?.cara,
            }
          : undefined,
      },
    ];
  });
}
