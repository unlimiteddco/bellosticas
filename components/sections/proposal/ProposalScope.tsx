import { EditorialLabel } from "@/components/ui/EditorialLabel";
import { MixedHeadline } from "@/components/ui/MixedHeadline";
import { Reveal } from "@/components/ui/Reveal";
import type { ProposalScope as Datos } from "@/lib/proposals";

/**
 * Lo que aporta el cliente y lo que se presupuesta aparte.
 *
 * Va DESPUÉS del precio y antes de aceptar. Decir por escrito qué no entra no
 * enfría la venta: evita la conversación incómoda del mes tres, que es la que
 * de verdad cuesta dinero y clientes.
 */
export function ProposalScope({
  data,
  label,
  title1,
  titleAccent,
  title2,
  providesLabel,
  excludedLabel,
}: {
  data: Datos;
  label: string;
  title1: string;
  titleAccent: string;
  title2: string;
  providesLabel: string;
  excludedLabel: string;
}) {
  const columnas = [
    { titulo: providesLabel, items: data.provides },
    { titulo: excludedLabel, items: data.excluded },
  ];

  return (
    <section id="alcance" className="scroll-mt-28">
      <Reveal>
        <EditorialLabel>{`// ${label}`}</EditorialLabel>
      </Reveal>
      <Reveal delay={0.08}>
        <MixedHeadline
          className="text-[28px] md:text-[38px] mt-4 mb-8"
          parts={[{ text: title1 }, { text: titleAccent, accent: true }, { text: title2 }]}
        />
      </Reveal>

      <Reveal delay={0.12}>
        <div className="grid gap-10 md:grid-cols-2 md:gap-12">
          {columnas.map((col) => (
            <div key={col.titulo}>
              <span
                className="block font-body uppercase text-[10px] text-[var(--color-text-muted)] pb-3.5 border-b border-[var(--color-text)]/25"
                style={{ letterSpacing: "0.2em" }}
              >
                {col.titulo}
              </span>
              <ul>
                {col.items.map((it, i) => (
                  <li
                    key={i}
                    className="py-3.5 border-b border-[var(--color-border)] font-body text-[14px] leading-[1.5] text-[var(--color-text)]/85"
                  >
                    {it}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        {data.note && (
          <p className="mt-6 font-body text-[13px] leading-[1.6] text-[var(--color-text-muted)] max-w-[640px]">
            {data.note}
          </p>
        )}
      </Reveal>
    </section>
  );
}
