import { Reveal } from "@/components/ui/Reveal";
import type { ProposalContrast as Datos } from "@/lib/proposals";

/**
 * Hoy vs con la nueva web.
 *
 * Dos columnas enfrentadas, y la de la derecha en negro. Es la sección que
 * más trabaja de toda la propuesta: no argumenta, deja que la comparación
 * argumente sola. Nadie lee las dos listas y se queda en la de la izquierda.
 */
export function ProposalContrast({
  data,
  todayLabel,
  afterLabel,
}: {
  data: Datos;
  todayLabel: string;
  afterLabel: string;
}) {
  const columnas = [
    { titulo: todayLabel, items: data.today, oscura: false },
    { titulo: afterLabel, items: data.after, oscura: true },
  ];

  return (
    <Reveal delay={0.1}>
      <div className="mt-8 grid gap-4 md:grid-cols-2">
        {columnas.map((col) => (
          <div
            key={col.titulo}
            className={`rounded-2xl p-6 md:p-7 ${
              col.oscura
                ? "bg-[var(--color-text)] text-[var(--color-bg)]"
                : "border border-[var(--color-border)]"
            }`}
          >
            <span
              className={`block font-body uppercase text-[10px] pb-4 border-b ${
                col.oscura
                  ? "text-[var(--color-bg)]/45 border-[var(--color-bg)]/20"
                  : "text-[var(--color-text-muted)] border-[var(--color-border)]"
              }`}
              style={{ letterSpacing: "0.2em" }}
            >
              {col.titulo}
            </span>
            <ul>
              {col.items.map((it, i) => (
                <li
                  key={i}
                  className={`py-3.5 font-body text-[15px] leading-[1.45] ${
                    i < col.items.length - 1 ? "border-b" : ""
                  } ${
                    col.oscura
                      ? "text-[var(--color-bg)]/90 border-[var(--color-bg)]/12"
                      : "text-[var(--color-text)] border-[var(--color-border)]"
                  }`}
                >
                  {it}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </Reveal>
  );
}
