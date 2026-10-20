import { ArrowUpRight, Ban, Check } from "lucide-react";
import { getTranslations } from "next-intl/server";
import { Cabecera, LineaArriba } from "./Secciones";

/*
 * Los bloques propios de la página de SEO + AEO (el resto son los de la
 * plantilla de servicio). Las cifras van siempre con su fuente enlazada: en
 * una página que vende rigor, cada dato tiene que poder comprobarse.
 * Textos en messages → v2SeoAeo.
 */

type Fuente = { id: string; url: string; nombre: string };

/** «Por qué ahora»: cuatro cifras con su fuente y, debajo, la lista de fuentes. */
export async function SeoCambio({ locale, ns }: { locale: string; ns: string }) {
  const t = await getTranslations({ locale, namespace: `${ns}.cambio` });
  const tr = await getTranslations({ locale, namespace: ns });
  const items = t.raw("items") as { value: string; text: string; fuente: string; fid: string[] }[];
  const fuentes = tr.raw("fuentes") as Fuente[];
  // Cada fuente con su número, en el orden en que salen las cifras.
  const usadas = fuentes.filter((f) => items.some((it) => it.fid.includes(f.id)));
  const numero = (id: string) => usadas.findIndex((f) => f.id === id) + 1;

  return (
    <section className="v2-frame">
      <div className="v2-rail">
        <LineaArriba />
        <Cabecera t={t} />
        <div className="grid grid-cols-1 gap-px border-t border-[var(--v2-line)] bg-[var(--v2-line)] sm:grid-cols-2 lg:grid-cols-4">
          {items.map((it) => (
            <div key={it.value} className="flex flex-col gap-4 bg-[var(--v2-bg)] p-6 md:p-8" data-reveal>
              <span className="text-[44px] font-medium leading-none tracking-[-0.045em] md:text-[52px]">{it.value}</span>
              <p className="text-[15px] leading-[1.55]">{it.text}</p>
              <span className="mt-auto flex items-baseline gap-1.5 text-[12.5px] text-[var(--v2-muted)]">
                {it.fid.map((id) => (
                  <sup key={id} className="font-mono text-[10px] text-[var(--v2-accent)]">
                    [{numero(id)}]
                  </sup>
                ))}
                {it.fuente}
              </span>
            </div>
          ))}
        </div>
        <details className="group border-t border-[var(--v2-line)]">
          <summary className="flex cursor-pointer list-none items-center justify-between gap-3 px-6 py-4 text-[13.5px] text-[var(--v2-muted)] transition-colors hover:text-[var(--v2-text)] md:px-10">
            <span className="v2-label">{t("fuentesLabel")}</span>
            <span aria-hidden className="text-[var(--v2-accent)] transition-transform duration-300 group-open:rotate-45">
              +
            </span>
          </summary>
          <ol className="flex flex-col gap-2 px-6 pb-6 md:px-10">
            {usadas.map((f, i) => (
              <li key={f.id} className="flex gap-3 text-[13.5px] leading-[1.5]">
                <span className="font-mono text-[11px] leading-[1.9] text-[var(--v2-accent)]">[{i + 1}]</span>
                <a href={f.url} target="_blank" rel="noopener" className="text-[var(--v2-muted)] underline-offset-2 hover:text-[var(--v2-text)] hover:underline">
                  {f.nombre}
                  <ArrowUpRight size={12} className="ml-1 inline" />
                </a>
              </li>
            ))}
          </ol>
        </details>
      </div>
    </section>
  );
}

/** SEO y AEO, lado a lado, con lo que comparten debajo. */
export async function SeoDiferencia({ locale, ns }: { locale: string; ns: string }) {
  const t = await getTranslations({ locale, namespace: `${ns}.diferencia` });
  const tr = await getTranslations({ locale, namespace: ns });
  const guia = (tr.raw("fuentes") as Fuente[]).find((f) => f.id === "guia");
  const columnas = [
    { k: "seo", oscuro: false },
    { k: "aeo", oscuro: true },
  ] as const;
  return (
    <section className="v2-frame">
      <div className="v2-rail">
        <LineaArriba />
        <Cabecera t={t} />
        <div className="grid grid-cols-1 gap-4 border-t border-[var(--v2-line)] p-4 md:grid-cols-2 md:gap-6 md:p-8">
          {columnas.map(({ k, oscuro }) => (
            <div
              key={k}
              className={`flex flex-col overflow-hidden rounded-[8px] border border-[var(--v2-line)] ${oscuro ? "v2-oscuro" : "bg-[var(--v2-bg)]"}`}
              data-reveal
            >
              <div className="flex items-baseline justify-between gap-4 border-b border-[var(--v2-line)] px-6 py-6 md:px-8">
                <span className="text-[40px] font-medium leading-none tracking-[-0.04em] md:text-[48px]">
                  {t(`${k}.titulo`)}
                  {oscuro && <span className="text-[var(--v2-accent)]">.</span>}
                </span>
                <span className="text-right text-[14px] text-[var(--v2-muted)]">{t(`${k}.subtitulo`)}</span>
              </div>
              <ul className="flex flex-col px-6 py-3 md:px-8">
                {(t.raw(`${k}.puntos`) as string[]).map((x, i, todos) => {
                  const objetivo = i === todos.length - 1;
                  return (
                    <li
                      key={x}
                      className={`flex items-center gap-3 border-b border-[var(--v2-line)] py-3 text-[15px] last:border-b-0 ${objetivo ? "font-medium" : ""}`}
                    >
                      <Check size={15} strokeWidth={2} className="shrink-0 text-[var(--v2-accent)]" />
                      {x}
                    </li>
                  );
                })}
              </ul>
            </div>
          ))}
        </div>
        <p className="flex flex-wrap items-center justify-center gap-x-2 gap-y-1 border-t border-[var(--v2-line)] px-6 py-5 text-center text-[14.5px] text-[var(--v2-muted)]">
          <span>{t("comun")}</span>
          {guia && (
            <a href={guia.url} target="_blank" rel="noopener" className="v2-link text-[13.5px] text-[var(--v2-text)]">
              Google Search Central <ArrowUpRight size={13} className="text-[var(--v2-accent)]" />
            </a>
          )}
        </p>
      </div>
    </section>
  );
}

/** «Lo que no vamos a hacer»: cuatro reglas, en banda negra. */
export async function SeoNoHacemos({ locale, ns }: { locale: string; ns: string }) {
  const t = await getTranslations({ locale, namespace: `${ns}.nohacemos` });
  const items = t.raw("items") as { title: string; text: string }[];
  return (
    <section data-header-tone="dark" className="v2-oscuro">
      <div className="v2-frame">
        <div className="v2-rail">
          <Cabecera t={t} />
          <div className="grid grid-cols-1 gap-px border-t border-[var(--v2-line)] bg-[var(--v2-line)] sm:grid-cols-2 lg:grid-cols-4">
            {items.map((it) => (
              <div key={it.title} className="flex flex-col gap-4 bg-[var(--v2-bg)] p-6 md:p-8" data-reveal>
                <span className="inline-flex h-10 w-10 items-center justify-center rounded-[8px] border border-[var(--v2-line)] text-[var(--v2-accent)]">
                  <Ban size={18} strokeWidth={1.75} />
                </span>
                <h3 className="text-[19px] font-medium leading-[1.25] tracking-[-0.01em]">{it.title}</h3>
                <p className="text-[14.5px] leading-[1.6] text-[var(--v2-muted)]">{it.text}</p>
              </div>
            ))}
          </div>
          <div className="h-16 lg:h-20" />
        </div>
      </div>
    </section>
  );
}
