import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { useTranslations } from "next-intl";
import { EditorialLabel } from "@/components/ui/EditorialLabel";
import { MixedHeadline } from "@/components/ui/MixedHeadline";
import { Reveal } from "@/components/ui/Reveal";
import { Dato } from "@/components/ui/Dato";
import { services } from "@/lib/services";

/**
 * Los servicios, como una tabla. APARCADA: la home usa ahora el acordeón de
 * Services.tsx. Para volver a esta, cambiar <Services /> por <ServicesTable />
 * en la página de inicio.
 *
 * Son seis cosas comparables, así que van en celdas iguales separadas por
 * filetes: número, nombre, qué es y con qué se hace. Los filetes aquí
 * trabajan —separan— y es el mismo lenguaje de Trabajos y Proceso.
 * Antes eran tarjetas sueltas.
 */
export function ServicesTable() {
  const t = useTranslations("services");

  return (
    <section
      id="services"
      data-video-trigger
      className="relative z-10 max-w-[1280px] mx-auto px-6 lg:px-12 py-16 lg:py-24 scroll-mt-24"
    >
      <Reveal className="flex flex-col gap-6 mb-12 lg:mb-16 max-w-[820px]">
        <EditorialLabel>{t("label")}</EditorialLabel>
        <MixedHeadline
          className="text-[44px] md:text-[64px]"
          parts={[
            { text: t("title_part1") },
            { text: t("title_emphasis"), accent: true },
            { text: t("title_part2") },
          ]}
        />
        <p className="font-body text-[16px] lg:text-[18px] leading-[1.5] text-[var(--color-text-muted)] max-w-[540px]">
          {t("sub")}
        </p>
      </Reveal>

      {/* Marco redondeado con filetes dentro, como los paneles del menú: el
          resto de la web es de esquinas redondas y una tabla de esquinas vivas
          parecía de otra página. Las celdas sobresalen un píxel por la derecha
          y por abajo para que su último filete lo recorte el marco. */}
      <Reveal className="rounded-3xl overflow-hidden border border-[var(--color-text)]/15">
        <div className="grid grid-cols-1 md:grid-cols-2 -mr-px -mb-px">
        {services.map((s) => {
          const celda = (
            <>
              <div className="flex items-center justify-between">
                <span className="font-mono text-[12px] text-[var(--color-accent)]">{s.number}</span>
                {s.hasPage && (
                  <ArrowUpRight
                    size={17}
                    className="text-[var(--color-text)]/25 transition-all duration-200 group-hover:text-[var(--color-accent)] group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                  />
                )}
              </div>
              <h3 className="font-body font-medium tracking-tight text-[24px] lg:text-[28px] leading-tight text-[var(--color-text)]">
                {t(`items.${s.titleKey}.title`)}
              </h3>
              <p className="font-body text-[15px] leading-[1.6] text-[var(--color-text-muted)] max-w-[440px]">
                {t(`items.${s.titleKey}.description`)}
              </p>
              <div className="mt-auto flex flex-wrap gap-x-3 gap-y-1 pt-3">
                {s.stack.map((x) => (
                  <Dato key={x} className="text-[var(--color-text-muted)]">
                    {x}
                  </Dato>
                ))}
              </div>
            </>
          );
          const clase = "group relative flex flex-col gap-4 border-r border-b border-[var(--color-text)]/15 p-7 lg:p-9";
          // Solo enlaza el servicio que tiene página propia.
          return s.hasPage ? (
            <Link key={s.slug} href={`/services/${s.slug}`} className={`${clase} transition-colors hover:bg-[var(--color-surface-2)]`}>
              {celda}
            </Link>
          ) : (
            <div key={s.slug} className={clase}>
              {celda}
            </div>
          );
        })}
        </div>
      </Reveal>
    </section>
  );
}
