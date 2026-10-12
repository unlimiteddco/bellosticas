import { useTranslations } from "next-intl";
import { EditorialLabel } from "@/components/ui/EditorialLabel";
import { MixedHeadline } from "@/components/ui/MixedHeadline";
import { Reveal } from "@/components/ui/Reveal";
import { ClientsMapCanvas } from "./ClientsMapCanvas";

/**
 * Dónde están los clientes: cabecera y mapa.
 *
 * Los textos se resuelven aquí, en servidor, y bajan al mapa como props: así
 * la parte interactiva no depende del proveedor de traducciones.
 * Los clientes y sus ciudades están en lib/client-map.ts.
 *
 * APARCADO: no está puesto en ninguna página. Con casi todos los clientes en
 * Huesca y Zaragoza el mapa se queda corto; se colocará cuando haya clientes
 * fuera de España (y entonces habrá que ampliar el encuadre del mapa de
 * puntos, que hoy solo cubre la península: scripts/build-dot-map.mjs).
 * Para usarlo: `<ClientsMap />` en la página que toque.
 */
export function ClientsMap() {
  const t = useTranslations("clientsMap");

  return (
    <section className="relative z-10 bg-[var(--color-surface-2)] border-t border-b border-[var(--color-border)] overflow-hidden">
      <div className="max-w-[1280px] mx-auto px-6 lg:px-12 pt-20 lg:pt-28">
        <Reveal className="flex flex-col gap-6 max-w-[760px]">
          <EditorialLabel>{t("label")}</EditorialLabel>
          <MixedHeadline
            className="text-[40px] md:text-[60px] lg:text-[68px]"
            parts={[
              { text: t("title_part1") },
              { text: t("title_emphasis"), accent: true },
              { text: t("title_part2") },
            ]}
          />
          <p className="font-body text-[16px] lg:text-[18px] leading-[1.55] text-[var(--color-text-muted)] max-w-[560px]">
            {t("sub")}
          </p>
        </Reveal>
      </div>

      <Reveal y={0} className="mt-8 lg:mt-10">
        <ClientsMapCanvas
          textos={{
            estudio: t("studio"),
            estudioNota: t("studio_note"),
            pais: t("country"),
            enlaceLocal: t.raw("local_link"),
            pistaMac: t("hint_mac"),
            pistaOtros: t("hint_other"),
            leyenda: t.raw("legend"),
            leyendaTactil: t("legend_touch"),
            acercar: t("zoom_in"),
            alejar: t("zoom_out"),
            reiniciar: t("reset"),
            grupo: t.raw("cluster"),
          }}
        />
      </Reveal>
    </section>
  );
}
