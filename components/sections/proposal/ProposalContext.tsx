import { EditorialLabel } from "@/components/ui/EditorialLabel";
import { Reveal } from "@/components/ui/Reveal";
import type { ProposalContext as Ctx } from "@/lib/proposals";

/**
 * Punto de partida.
 *
 * Abre la propuesta hablando de SU negocio, no del nuestro. Quien lee que has
 * entendido dónde está deja de leer un presupuesto y empieza a leer un
 * diagnóstico — y a un diagnóstico no se le compara el precio igual.
 *
 * Todo lo de aquí sale de las notas de la llamada. Si no hay notas, no hay
 * sección: inventarle a alguien su propia situación es la forma más rápida de
 * perder la reunión.
 */
export function ProposalContext({
  data,
  label,
  proofsLabel,
}: {
  data: Ctx;
  label: string;
  proofsLabel: string;
}) {
  const proofs = data.proofs ?? [];
  return (
    <section id="partida" className="scroll-mt-28">
      <Reveal>
        <EditorialLabel>{`// ${label}`}</EditorialLabel>
      </Reveal>
      <div className="mt-5 grid gap-10 lg:grid-cols-[1fr_1fr] lg:gap-14">
        <Reveal delay={0.08}>
          <p className="font-body text-[17px] md:text-[19px] leading-[1.6] text-[var(--color-text)]/85 max-w-[520px]">
            {data.intro}
          </p>
        </Reveal>

        {proofs.length > 0 && (
          <Reveal delay={0.12}>
            <div>
              <span
                className="block font-body uppercase text-[10px] text-[var(--color-text-muted)] pb-4 border-b border-[var(--color-text)]/20"
                style={{ letterSpacing: "0.2em" }}
              >
                {proofsLabel}
              </span>
              <ul>
                {proofs.map((p, i) => (
                  <li
                    key={i}
                    className="flex gap-5 py-5 border-b border-[var(--color-border)]"
                  >
                    <span className="font-display italic text-[20px] leading-none text-[var(--color-text-muted)]/60 tabular-nums shrink-0 pt-0.5">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <span className="font-body text-[15px] leading-[1.5] text-[var(--color-text)]">
                      {p}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          </Reveal>
        )}
      </div>
    </section>
  );
}
