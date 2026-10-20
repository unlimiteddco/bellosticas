import { ArrowRight, Calendar, Home, LayoutGrid, Layers, type LucideIcon } from "lucide-react";
import { getTranslations } from "next-intl/server";
import { Link } from "@/navigation";
import { getProjects } from "@/lib/cms/projects";
import { AsteriskIcon } from "@/components/ui/AsteriskIcon";
import { PaginaServicio } from "@/components/v2/servicio/PaginaServicio";
import { LineaArriba } from "@/components/v2/servicio/Secciones";

/*
 * La 404 de la V2: un «404» enorme con el asterisco de la marca en lugar del
 * cero (gira despacio), la dirección que se ha pedido en una línea de consola
 * y los cuatro caminos que sí existen, en tarjetas. Con la cabecera y el pie
 * de siempre para que nadie se quede sin salida. Textos en messages → v2NotFound.
 */
const CAMINOS: { k: string; href: "/v2" | "/v2/services" | "/v2/work" | "/v2/intro"; icono: LucideIcon }[] = [
  { k: "inicio", href: "/v2", icono: Home },
  { k: "servicios", href: "/v2/services", icono: Layers },
  { k: "trabajos", href: "/v2/work", icono: LayoutGrid },
  { k: "llamada", href: "/v2/intro", icono: Calendar },
];

export async function NotFoundV2({ ruta, locale }: { ruta: string; locale: string }) {
  const t = await getTranslations({ locale, namespace: "v2NotFound" });
  const proyectos = await getProjects(locale);
  // La dirección tal cual se pidió, sin el prefijo del idioma.
  const pedida = ruta.replace(/^\/en(?=\/|$)/, "") || "/";

  return (
    <PaginaServicio locale={locale} proyectos={proyectos}>
      <section className="v2-frame">
        <div className="flex flex-col items-center gap-8 px-6 pb-16 pt-14 text-center md:px-10 lg:pb-20 lg:pt-16">
          <span className="v2-label v2-hero-in flex items-center gap-2.5">
            <span aria-hidden className="h-1.5 w-1.5 rounded-full bg-[var(--v2-accent)]" />
            {t("label")}
          </span>
          <p
            aria-label="404"
            className="v2-hero-in flex select-none items-center font-medium leading-[0.85] tracking-[-0.06em] text-[clamp(120px,30vw,300px)]"
            style={{ animationDelay: "80ms" }}
          >
            <span aria-hidden>4</span>
            <AsteriskIcon className="v2-giro mx-[0.02em] h-[0.78em] w-[0.78em] text-[var(--v2-accent)]" />
            <span aria-hidden>4</span>
          </p>
          <p
            className="v2-hero-in flex max-w-full flex-wrap items-center justify-center gap-x-2 gap-y-1 rounded-[6px] border border-[var(--v2-line)] bg-[var(--v2-bg-2)] px-4 py-2 font-mono text-[12px] text-[var(--v2-muted)] md:text-[13px]"
            style={{ animationDelay: "140ms" }}
          >
            <span>GET</span>
            <span className="max-w-[60vw] truncate text-[var(--v2-text)]">{pedida}</span>
            <span aria-hidden>→</span>
            <span className="text-[var(--v2-accent)]">{t("consola")}</span>
            <span aria-hidden className="v2-cursor text-[var(--v2-accent)]">
              ▍
            </span>
          </p>
          <h1
            className="v2-hero-in v2-h1 v2-h1--doc max-w-[760px]"
            style={{ animationDelay: "200ms" }}
          >
            {t("title_part1")}
            <em className="font-display italic font-semibold text-[var(--v2-accent)]">{t("title_emphasis")}</em>
            {t("title_part2")}
          </h1>
          <p className="v2-hero-in max-w-[540px] text-[16px] leading-[1.6] text-[var(--v2-muted)] lg:text-[17px]" style={{ animationDelay: "260ms" }}>
            {t("sub")}
          </p>
        </div>
      </section>

      <section className="v2-frame">
        <div className="v2-rail">
          <LineaArriba />
          <div className="grid grid-cols-1 gap-4 p-4 sm:grid-cols-2 md:p-8 lg:grid-cols-4">
            {CAMINOS.map(({ k, href, icono: Icono }) => (
              <Link key={k} href={href} className="v2-card v2-rel flex flex-col">
                <span className="flex items-center gap-3 border-b border-[var(--v2-line)] px-5 py-4">
                  <span className="v2-ico">
                    <Icono size={14} strokeWidth={1.75} />
                  </span>
                  <span className="flex-1 text-[16px] font-medium tracking-[-0.01em]">{t(`caminos.${k}.titulo`)}</span>
                  <ArrowRight size={16} className="v2-mm-flecha" aria-hidden />
                </span>
                <span className="px-5 py-4 text-[14px] leading-[1.55] text-[var(--v2-muted)]">{t(`caminos.${k}.texto`)}</span>
              </Link>
            ))}
          </div>
          <p className="border-t border-[var(--v2-line)] px-6 py-5 text-center text-[14px] text-[var(--v2-muted)]">
            {t("pie")}{" "}
            <Link href="/v2/contact" className="text-[var(--v2-text)] underline underline-offset-2 hover:text-[var(--v2-accent)]">
              {t("pieEnlace")}
            </Link>
          </p>
        </div>
      </section>
    </PaginaServicio>
  );
}
