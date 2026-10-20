import { getTranslations } from "next-intl/server";
import { TOOL_LOGOS } from "@/lib/tool-logos";
import { sinBarras } from "@/lib/v2/texto";

type Grupo = { name: string; tools: string[] };

/**
 * Dos tarjetas con borde, lado a lado: el portal de cliente (lo que nos
 * diferencia) y las herramientas con las que construimos. Textos de
 * clientPortal.* y proceso.stack.*.
 */
export async function CardsPair({ locale }: { locale: string }) {
  const tp = await getTranslations({ locale, namespace: "clientPortal" });
  const ts = await getTranslations({ locale, namespace: "proceso.stack" });
  const grupos = ts.raw("groups") as Grupo[];
  const herramientas = grupos.flatMap((g) => g.tools).filter((n) => TOOL_LOGOS[n]);

  return (
    <section className="v2-frame">
      <div className="v2-rail grid grid-cols-1 md:grid-cols-2">
        <span aria-hidden data-draw className="pointer-events-none absolute left-0 right-0 top-0 h-px bg-[var(--v2-line)]" />
        {/* Portal de cliente */}
        <article className="flex flex-col border-b border-[var(--v2-line)] md:border-b-0 md:border-r" data-reveal>
          <div className="flex flex-col gap-4 p-6 md:p-10">
            <span className="v2-label">{sinBarras(tp("label"))}</span>
            <h3 className="text-[28px] font-medium leading-[1.1] tracking-[-0.02em] md:text-[34px]">
              {tp("title_part1")}
              <em className="font-display italic font-semibold text-[var(--v2-accent)]">{tp("title_emphasis")}</em>
              {tp("title_part2")}
            </h3>
            <p className="max-w-[460px] text-[15px] leading-[1.55] text-[var(--v2-muted)]">{tp("sub")}</p>
          </div>
          <div className="mt-auto border-t border-[var(--v2-line)] bg-[var(--v2-bg-2)] px-6 pt-6 md:px-10 md:pt-8">
            <img
              src="/images/portal-cliente.webp"
              alt={tp("mockup.alt")}
              loading="lazy"
              className="block w-full border border-b-0 border-[var(--v2-line)] shadow-[0_-10px_40px_-20px_rgb(0_0_0/0.25)]"
            />
          </div>
        </article>

        {/* Herramientas */}
        <article className="flex flex-col" data-reveal>
          <div className="flex flex-col gap-4 p-6 md:p-10">
            <span className="v2-label">{sinBarras(ts("label"))}</span>
            <h3 className="text-[28px] font-medium leading-[1.1] tracking-[-0.02em] md:text-[34px]">{ts("title")}</h3>
            <p className="max-w-[460px] text-[15px] leading-[1.55] text-[var(--v2-muted)]">{ts("sub")}</p>
          </div>
          <ul className="mt-auto grid grid-cols-3 border-t border-[var(--v2-line)] sm:grid-cols-5">
            {herramientas.map((n) => (
              <li
                key={n}
                className="group flex aspect-square flex-col items-center justify-center gap-2 border-b border-r border-[var(--v2-line)] text-[var(--v2-muted)] transition-colors hover:text-[var(--v2-text)] [&:nth-child(3n)]:border-r-0 sm:[&:nth-child(3n)]:border-r sm:[&:nth-child(5n)]:border-r-0"
              >
                <svg viewBox="0 0 24 24" className="h-6 w-6" fill="currentColor" aria-hidden>
                  <path d={TOOL_LOGOS[n]} />
                </svg>
                <span className="font-mono text-[10px] uppercase tracking-[0.1em]">{n}</span>
              </li>
            ))}
          </ul>
        </article>
      </div>
    </section>
  );
}
