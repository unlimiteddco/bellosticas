import type { Metadata } from "next";
import { ArrowRight, BadgeEuro, ChartColumn, Code2, Gauge, Heart, KeyRound, LayoutGrid, LifeBuoy, MessagesSquare, Route } from "lucide-react";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { getProjects } from "@/lib/cms/projects";
import { Link } from "@/navigation";
import { TestimonialsV2 } from "@/components/v2/home/TestimonialsV2";
import { FaqV2 } from "@/components/v2/home/FaqV2";
import { ClosingBand } from "@/components/v2/home/ClosingBand";
import { PaginaServicio } from "@/components/v2/servicio/PaginaServicio";
import { LineaArriba, ServicioHero, ServicioRejilla } from "@/components/v2/servicio/Secciones";
import { GrupoCatalogo, type EtiquetasCatalogo, type ItemCatalogo } from "@/components/v2/servicio/Catalogo";
import { ICONOS_CATALOGO } from "@/components/v2/servicio/iconos-catalogo";

/*
 * Servicios, la página que los reúne todos (V2). Como la de DesignMe: un
 * índice en tres columnas y, debajo, cada grupo con sus servicios en acordeón
 * y la pieza del abierto al lado. Precios y plazos son los de la página de
 * precios; los de las suscripciones se leen de allí (v2Precios.suscripciones)
 * para que no se descuadren. Textos en
 * messages → v2ServiciosHub.
 */
const NS = "v2ServiciosHub";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: NS });
  return {
    title: `${t("metaTitle")}`,
    description: t("metaDescription"),
  };
}

/** Las piezas de cada servicio: las mismas del acordeón de la home (MEDIA en
    components/sections/Services, que es de cliente y no se puede leer desde aquí). */
const MEDIA = {
  marca: { video: "/videos/marca.mp4" },
  s01: { video: "/videos/web-corporativa.mp4" },
  s02: { video: "/videos/ecommerce.mp4" },
  s03: { img: "/images/servicio-apps.webp" },
  s04: { img: "/images/servicio-automatizaciones.webp" },
  s05: { img: "/images/servicio-migraciones.webp" },
  s06: { img: "/images/servicio-marca-blanca.webp" },
};

type Suscripcion = {
  id: string;
  nombre: string;
  precio: string;
  sufijo?: string;
  desde?: boolean;
  texto: string;
  incluye: string[];
  funciona?: { titulo: string }[];
  niveles?: { incluye: string[] }[];
};

export default async function ServiciosV2({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const proyectos = await getProjects(locale);
  const t = await getTranslations({ locale, namespace: NS });
  // Nombres cortos, los de las tarjetas de servicios relacionados.
  const ts = await getTranslations({ locale, namespace: "v2Servicios" });
  const tp = await getTranslations({ locale, namespace: "v2Precios" });
  const e = t.raw("etiquetas") as EtiquetasCatalogo & { agencia: string };

  // Precios y plazos: los mismos que en la página de precios.
  const servicios = tp.raw("servicios.grupos") as {
    items: { nombre: string; precio?: string; plazo?: string }[];
    niveles?: { nombre: string; plazo?: string; columnas: { precio?: string }[] }[];
  }[];
  const [marcaG, webG, sistemasG] = servicios;
  const suscripciones = (tp.raw("suscripciones.grupos") as { items: Suscripcion[] }[]).flatMap((g) => g.items);
  const partner = suscripciones.find((s) => s.id === "partner");
  const mantenimiento = suscripciones.find((s) => s.id === "mantenimiento");
  const seo = suscripciones.find((s) => s.id === "seo-aeo");

  const de = (clave: string) => ({
    texto: t(`servicios.${clave}.texto`),
    entregables: t.raw(`servicios.${clave}.entregables`) as string[],
  });
  const precios = (opcion: string) => ({ pathname: "/pricing" as const, query: { opcion } });
  const tele = proyectos.find((p) => p.slug === "teleadhesivo");

  const diseno: ItemCatalogo[] = [
    {
      clave: "marca",
      icono: "marca",
      nombre: ts("marca"),
      ...de("marca"),
      precio: marcaG?.items[0]?.precio,
      desde: true,
      href: "/services/brand-identity",
      precios: precios("marca-esencial"),
      media: MEDIA.marca,
    },
    {
      clave: "webs",
      icono: "web",
      nombre: ts("s01"),
      ...de("s01"),
      precio: webG?.niveles?.[0]?.columnas[0]?.precio,
      desde: true,
      plazo: webG?.niveles?.[0]?.plazo,
      href: "/services/desarrollo-web",
      precios: precios("web"),
      media: MEDIA.s01,
    },
    {
      clave: "ecommerce",
      icono: "tienda",
      nombre: ts("s02"),
      ...de("s02"),
      precio: webG?.niveles?.[1]?.columnas[0]?.precio,
      desde: true,
      plazo: webG?.niveles?.[1]?.plazo,
      href: "/services/ecommerce",
      precios: precios("ecommerce"),
      // El recorrido en vídeo es el de TeleAdhesivo.
      media: MEDIA.s02,
      caso: tele ? { nombre: tele.name, href: { pathname: "/work/[slug]", params: { slug: tele.slug } } } : undefined,
    },
  ];

  const sistema = (i: number) => sistemasG?.items[i];
  const producto: ItemCatalogo[] = [
    {
      clave: "aplicaciones",
      icono: "app",
      nombre: ts("s03"),
      ...de("s03"),
      precio: sistema(0)?.precio,
      desde: true,
      plazo: sistema(0)?.plazo,
      href: "/services/aplicaciones-web",
      precios: precios("app"),
      media: MEDIA.s03,
    },
    {
      clave: "automatizaciones",
      icono: "flujo",
      nombre: ts("s04"),
      ...de("s04"),
      precio: sistema(1)?.precio,
      desde: true,
      plazo: sistema(1)?.plazo,
      href: "/services/automatizaciones",
      precios: precios("automatizaciones"),
      media: MEDIA.s04,
    },
    {
      clave: "migraciones",
      icono: "migracion",
      nombre: ts("s05"),
      ...de("s05"),
      precio: sistema(2)?.precio,
      desde: true,
      plazo: sistema(2)?.plazo,
      href: "/services/migraciones",
      precios: precios("migraciones"),
      media: MEDIA.s05,
    },
  ];

  const despues: ItemCatalogo[] = [
    ...(partner
      ? [
          {
            clave: "partner",
            icono: "partner" as const,
            nombre: partner.nombre,
            texto: partner.texto,
            entregables: [...partner.incluye, ...(partner.funciona?.slice(-1).map((f) => f.titulo) ?? [])],
            precio: partner.precio,
            desde: partner.desde,
            sufijo: partner.sufijo,
            precios: precios("partner"),
            media: { img: "/images/estudio-escritorio.jpg" },
          },
        ]
      : []),
    ...(seo
      ? [
          {
            clave: "seo-aeo",
            icono: "busqueda" as const,
            nombre: ts("seo"),
            ...de("seo"),
            precio: seo.precio,
            desde: seo.desde,
            sufijo: seo.sufijo,
            href: "/services/seo-aeo" as const,
            precios: precios("seo-aeo"),
            media: { img: "/images/servicio-seo-aeo.svg" },
          },
        ]
      : []),
    ...(mantenimiento
      ? [
          {
            clave: "mantenimiento",
            icono: "escudo" as const,
            nombre: mantenimiento.nombre,
            texto: mantenimiento.texto,
            entregables: mantenimiento.niveles?.[0]?.incluye ?? mantenimiento.incluye,
            precio: mantenimiento.precio,
            desde: mantenimiento.desde,
            sufijo: mantenimiento.sufijo,
            precios: precios("mantenimiento"),
            media: { img: "/images/estudio-portatil.jpg" },
          },
        ]
      : []),
    {
      clave: "marca-blanca",
      icono: "capas",
      nombre: ts("s06"),
      ...de("s06"),
      // Marca blanca nunca lleva precio público.
      precioTexto: e.agencia,
      href: "/services/white-label",
      media: MEDIA.s06,
    },
  ];

  const grupos = [
    { id: "diseno", items: diseno },
    { id: "producto", items: producto, oscuro: true },
    { id: "despues", items: despues },
  ];

  const decidir = [
    // Los mismos iconos que llevan en el megamenú.
    { k: "precios", href: "/pricing" as const, icono: ChartColumn },
    { k: "proceso", href: "/proceso" as const, icono: Route },
    { k: "trabajos", href: "/work" as const, icono: LayoutGrid },
    { k: "clientes", href: "/clients" as const, icono: Heart },
  ];

  return (
    <PaginaServicio locale={locale} proyectos={proyectos}>
      <ServicioHero locale={locale} ns={NS} ancla="indice" />

      {/* ── Índice: los tres grupos en columnas, cada servicio lleva a su sitio de la lista ── */}
      <section id="indice" className="v2-frame scroll-mt-20">
        <div className="v2-rail">
          <LineaArriba />
          <div className="px-6 py-5 md:px-10">
            <span className="v2-label">{t("indice.label")}</span>
          </div>
          <div className="grid grid-cols-1 border-t border-[var(--v2-line)] md:grid-cols-3">
            {grupos.map((g, gi) => (
              <div
                key={g.id}
                className={`flex flex-col border-[var(--v2-line)] ${gi < grupos.length - 1 ? "border-b md:border-b-0 md:border-r" : ""}`}
              >
                <a href={`#${g.id}`} className="group flex items-baseline gap-1.5 px-5 pb-3 pt-6 md:px-6">
                  <span className="text-[22px] font-medium tracking-[-0.02em] transition-colors group-hover:text-[var(--v2-accent)] md:text-[26px]">
                    {t(`grupos.${g.id}.nombre`)}
                  </span>
                  <sup className="font-mono text-[11px] text-[var(--v2-muted)]">{g.items.length}</sup>
                </a>
                <div className="flex flex-col pb-4">
                  {g.items.map((it) => {
                    const Icono = ICONOS_CATALOGO[it.icono];
                    return (
                      <a key={it.clave} href={`#s-${it.clave}`} className="v2-mm-link group flex items-center gap-3 px-5 py-2.5 transition-colors md:px-6">
                        <span className="v2-ico">
                          <Icono size={14} strokeWidth={1.75} />
                        </span>
                        <span className="flex-1 text-[15px] font-medium">{it.nombre}</span>
                        <ArrowRight size={15} className="v2-mm-flecha" aria-hidden />
                      </a>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
          <div className="flex flex-col items-center justify-between gap-3 border-t border-[var(--v2-line)] px-6 py-4 text-[14px] text-[var(--v2-muted)] sm:flex-row md:px-10">
            <span>{t("indice.pie")}</span>
            <Link href="/pricing" className="v2-link text-[var(--v2-text)]">
              {t("indice.precios")} <ArrowRight size={13} className="text-[var(--v2-accent)]" />
            </Link>
          </div>
        </div>
      </section>

      {grupos.map((g, gi) => (
        <GrupoCatalogo
          key={g.id}
          id={g.id}
          numero={String(gi + 1).padStart(2, "0")}
          nombre={t(`grupos.${g.id}.nombre`)}
          texto={t(`grupos.${g.id}.texto`)}
          items={g.items}
          etiquetas={e}
          oscuro={g.oscuro}
        />
      ))}

      <ServicioRejilla
        locale={locale}
        ns={NS}
        parte="siempre"
        linea
        iconos={[BadgeEuro, MessagesSquare, Code2, Gauge, KeyRound, LifeBuoy]}
      />

      <TestimonialsV2 />

      {/* ── ¿Aún decidiendo? Lo que suele ayudar, en tarjetas ── */}
      <section className="bg-[var(--v2-bg-2)]">
        <div className="v2-frame">
          <div className="grid grid-cols-1 gap-12 px-6 py-24 md:px-10 lg:grid-cols-12 lg:gap-10 lg:py-28">
            <div className="flex flex-col gap-6 lg:col-span-4">
              <span className="v2-label" data-reveal>
                {t("decidir.label")}
              </span>
              <h2 className="v2-h2" data-reveal>
                {t("decidir.title_part1")}
                <em className="font-display italic font-semibold text-[var(--v2-accent)]">{t("decidir.title_emphasis")}</em>
                {t("decidir.title_part2")}
              </h2>
              <p className="max-w-[360px] text-[17px] leading-[1.55]" data-reveal>
                {t("decidir.sub")}
              </p>
            </div>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:col-span-8 lg:self-center">
              {decidir.map(({ k, href, icono: Icono }) => (
                <Link key={k} href={href} className="v2-card v2-rel flex flex-col" data-reveal>
                  <span className="flex items-center gap-3 border-b border-[var(--v2-line)] px-6 py-5">
                    <span className="v2-ico">
                      <Icono size={14} strokeWidth={1.75} />
                    </span>
                    <span className="flex-1 text-[17px] font-medium tracking-[-0.01em]">{t(`decidir.items.${k}.titulo`)}</span>
                    <ArrowRight size={17} className="v2-mm-flecha" aria-hidden />
                  </span>
                  <span className="px-6 py-5 text-[14.5px] leading-[1.6] text-[var(--v2-muted)]">{t(`decidir.items.${k}.texto`)}</span>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </section>

      <FaqV2 ns={`${NS}.faq`} />
      <ClosingBand />
    </PaginaServicio>
  );
}
