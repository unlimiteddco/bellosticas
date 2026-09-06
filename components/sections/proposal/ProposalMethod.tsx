import { EditorialLabel } from "@/components/ui/EditorialLabel";
import { MixedHeadline } from "@/components/ui/MixedHeadline";
import { Reveal } from "@/components/ui/Reveal";
import { getTranslations } from "next-intl/server";

/**
 * Cómo se trabaja.
 *
 * Es contenido de estudio, no de cliente: las reglas del proceso son las
 * mismas en todos los proyectos. Va antes del precio a propósito — quien lee
 * "una fase cerrada no se reabre" ya no está comparando presupuestos, está
 * juzgando a un profesional.
 *
 * Panel oscuro: la alternancia claro/oscuro es lo que da sensación de ir
 * pasando páginas en vez de bajar por una lista.
 */
export async function ProposalMethod({ locale }: { locale: string }) {
  const t = await getTranslations({ locale, namespace: "proposalPage.method" });
  const reglas = ["r1", "r2", "r3"] as const;

  return (
    <section id="metodo" className="scroll-mt-28">
      <Reveal>
        <EditorialLabel>{`// ${t("label")}`}</EditorialLabel>
      </Reveal>
      <Reveal delay={0.08}>
        <MixedHeadline
          className="text-[32px] md:text-[44px] mt-4 mb-8"
          parts={[
            { text: t("title_1") },
            { text: t("title_accent"), accent: true },
            { text: t("title_2") },
          ]}
        />
      </Reveal>

      <Reveal delay={0.12}>
        <div className="rounded-2xl bg-[var(--color-text)] text-[var(--color-bg)] p-7 md:p-10">
          <div className="grid gap-8 md:grid-cols-3 md:gap-10">
            {reglas.map((k, i) => (
              <div
                key={k}
                className={
                  i > 0
                    ? "md:pl-10 md:border-l border-[var(--color-bg)]/15"
                    : undefined
                }
              >
                <span className="block font-display italic text-[26px] text-[var(--color-bg)]/35 leading-none">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <h3 className="mt-4 font-body text-[17px] leading-[1.35] text-[var(--color-bg)]">
                  {t(`${k}_title`)}
                </h3>
                <p className="mt-2.5 font-body text-[13px] leading-[1.6] text-[var(--color-bg)]/60">
                  {t(`${k}_body`)}
                </p>
              </div>
            ))}
          </div>
        </div>
      </Reveal>
    </section>
  );
}
