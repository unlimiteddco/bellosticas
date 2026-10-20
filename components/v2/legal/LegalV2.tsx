import { ArrowRight, ArrowUp, Cookie, FileText, type LucideIcon, ShieldCheck } from "lucide-react";
import { getTranslations } from "next-intl/server";
import { Link } from "@/navigation";
import { getProjects } from "@/lib/cms/projects";
import { sinBarras } from "@/lib/v2/texto";
import type { Block, Section } from "@/components/sections/legal/types";
import { PaginaServicio } from "@/components/v2/servicio/PaginaServicio";
import { LineaArriba } from "@/components/v2/servicio/Secciones";
import { BotonAjustesCookies, IndiceLegal } from "./IndiceLegal";

/*
 * Los textos legales en la V2 (aviso legal, privacidad y cookies): el mismo
 * contenido de la V1 (messages → legal.*), con el marco de líneas. Índice fijo
 * a la izquierda, apartados numerados a la derecha y, al final, los otros dos
 * textos en tarjetas.
 */

type Doc = "notice" | "privacy" | "cookies";

const DOCS: { k: Doc; href: "/v2/legal" | "/v2/privacidad" | "/v2/cookies"; icono: LucideIcon }[] = [
  { k: "notice", href: "/v2/legal", icono: FileText },
  { k: "privacy", href: "/v2/privacidad", icono: ShieldCheck },
  { k: "cookies", href: "/v2/cookies", icono: Cookie },
];

/** Los títulos de la V1 van numerados («1. Titular»): el número se pinta aparte. */
function partir(titulo: string) {
  const m = titulo.match(/^(\d+)\.\s*(.*)$/);
  return m ? { n: m[1].padStart(2, "0"), texto: m[2] } : { n: "", texto: titulo };
}

function Bloque({ b }: { b: Block }) {
  if ("p" in b) return <p className="text-[15.5px] leading-[1.7] text-[var(--v2-muted)]">{b.p}</p>;
  if ("ul" in b)
    return (
      <ul className="flex flex-col">
        {b.ul.map((x, i) => (
          <li key={i} className="flex gap-3 border-t border-[var(--v2-line)] py-2.5 text-[15px] leading-[1.6] text-[var(--v2-muted)] last:border-b">
            <span aria-hidden className="mt-[0.7em] h-1 w-1 shrink-0 bg-[var(--v2-accent)]" />
            {x}
          </li>
        ))}
      </ul>
    );
  if ("table" in b)
    return (
      <div className="-mx-1 max-w-full overflow-x-auto rounded-[6px] border border-[var(--v2-line)]">
        <table className="min-w-full border-collapse text-left">
          <thead className="bg-[var(--v2-bg-2)]">
            <tr>
              {b.table.headers.map((h) => (
                <th key={h} className="v2-label whitespace-nowrap border-b border-[var(--v2-line)] px-4 py-3 align-top !text-[10px]">
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {b.table.rows.map((fila, i) => (
              <tr key={i} className="border-b border-[var(--v2-line)] last:border-b-0">
                {fila.map((c, j) => (
                  <td key={j} className="px-4 py-3 align-top text-[13.5px] leading-[1.55]">
                    {c}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  return null;
}

export async function LegalV2({ locale, doc }: { locale: string; doc: Doc }) {
  const t = await getTranslations({ locale, namespace: `legal.${doc}` });
  const tc = await getTranslations({ locale, namespace: "legal.common" });
  const tl = await getTranslations({ locale, namespace: "v2Legal" });
  const tTitulos = await getTranslations({ locale, namespace: "legal" });
  const proyectos = await getProjects(locale);
  const secciones = t.raw("sections") as Section[];
  const otros = DOCS.filter((d) => d.k !== doc);

  return (
    <PaginaServicio locale={locale} proyectos={proyectos}>
      {/* ── Cabecera ── */}
      <section className="v2-frame">
        <div className="flex flex-col gap-6 px-5 pb-14 pt-14 md:px-0 lg:pb-16 lg:pt-20">
          <span className="v2-label v2-hero-in flex items-center gap-2.5">
            <span aria-hidden className="h-1.5 w-1.5 rounded-full bg-[var(--v2-accent)]" />
            {sinBarras(t("label"))}
          </span>
          <h1
            className="v2-hero-in v2-h1"
            style={{ animationDelay: "80ms" }}
          >
            {t("title")}
            <span className="text-[var(--v2-accent)]">.</span>
          </h1>
          <p className="v2-hero-in max-w-[680px] text-[16px] leading-[1.65] text-[var(--v2-muted)] lg:text-[18px]" style={{ animationDelay: "160ms" }}>
            {t("intro")}
          </p>
          <span className="v2-label v2-hero-in" style={{ animationDelay: "220ms" }}>
            {tc("lastUpdatedLabel")} · {tc("lastUpdated")}
          </span>
        </div>
      </section>

      {/* ── Índice y apartados ── */}
      <section className="v2-frame">
        <div className="v2-rail grid grid-cols-1 lg:grid-cols-12">
          <LineaArriba />
          <aside className="hidden border-r border-[var(--v2-line)] p-10 lg:col-span-4 lg:block xl:col-span-3">
            <div className="sticky top-28 flex flex-col gap-8">
              <IndiceLegal etiqueta={tl("indice")} secciones={secciones.map((s) => ({ id: s.id, ...partir(s.title) }))} />
              {doc === "cookies" && <BotonAjustesCookies etiqueta={tc("openCookieSettings")} />}
            </div>
          </aside>
          <div className="lg:col-span-8 xl:col-span-9">
            {secciones.map((s) => {
              const { n, texto } = partir(s.title);
              return (
                <article
                  key={s.id}
                  id={s.id}
                  className="grid scroll-mt-24 grid-cols-1 gap-5 border-b border-[var(--v2-line)] px-6 py-10 last:border-b-0 md:grid-cols-[64px_1fr] md:px-10 lg:px-14 lg:py-12"
                >
                  <span className="font-mono text-[13px] text-[var(--v2-accent)] md:pt-1.5">{n}</span>
                  <div className="flex max-w-[760px] flex-col gap-4">
                    <h2 className="text-[24px] font-medium leading-[1.2] tracking-[-0.02em] md:text-[28px]">{texto}</h2>
                    {s.blocks.map((b, i) => (
                      <Bloque key={i} b={b} />
                    ))}
                  </div>
                </article>
              );
            })}
            <div className="flex flex-wrap items-center justify-between gap-4 border-t border-[var(--v2-line)] px-6 py-6 md:px-10 lg:px-14">
              {doc === "cookies" ? (
                <span className="lg:hidden">
                  <BotonAjustesCookies etiqueta={tc("openCookieSettings")} />
                </span>
              ) : (
                <span />
              )}
              <a href="#top" className="v2-link text-[14px] text-[var(--v2-muted)] hover:text-[var(--v2-text)]">
                <ArrowUp size={14} /> {tl("arriba")}
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* ── Los otros textos legales ── */}
      <section className="bg-[var(--v2-bg-2)]">
        <div className="v2-frame">
          <div className="flex flex-col gap-8 px-6 py-20 md:px-10 lg:py-24">
            <span className="v2-label">{tl("otros")}</span>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              {otros.map(({ k, href, icono: Icono }) => (
                <Link key={k} href={href} className="v2-card v2-rel flex flex-col">
                  <span className="flex items-center gap-3 border-b border-[var(--v2-line)] px-6 py-5">
                    <span className="v2-ico">
                      <Icono size={14} strokeWidth={1.75} />
                    </span>
                    <span className="flex-1 text-[17px] font-medium tracking-[-0.01em]">{tTitulos(`${k}.title`)}</span>
                    <ArrowRight size={17} className="v2-mm-flecha" aria-hidden />
                  </span>
                  <span className="px-6 py-5 text-[14.5px] leading-[1.6] text-[var(--v2-muted)]">{tl(`docs.${k}`)}</span>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </section>
    </PaginaServicio>
  );
}
