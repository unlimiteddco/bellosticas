import { Check, X } from "lucide-react";
import { getTranslations } from "next-intl/server";
import { TOOL_LOGOS } from "@/lib/tool-logos";
import { Cabecera, LineaArriba } from "@/components/v2/servicio/Secciones";
import type { Paso } from "@/components/v2/servicio/ProcesoTabs";
import { SelectorServicio, type ProcesoDeServicio } from "./SelectorServicio";

/*
 * Los bloques de la página de Proceso de la V2. Textos en messages →
 * v2Proceso; las fases de Marca y Webs se leen de sus propias páginas
 * (v2Brand.proceso, v2Webs.proceso) para que no puedan decir cosas distintas.
 * La base de todo es el documento interno «Cómo trabajamos».
 */

const NS = "v2Proceso";

/* ───────────────────────── Seis momentos ───────────────────────── */

export async function ProcesoMomentos({ locale }: { locale: string }) {
  const t = await getTranslations({ locale, namespace: `${NS}.momentos` });
  const items = t.raw("items") as { title: string; text: string }[];
  return (
    <section className="v2-frame">
      <div className="v2-rail">
        <LineaArriba />
        <Cabecera t={t} />
        {/* Seis celdas en fila: el orden es lo que importa. */}
        <ol className="grid grid-cols-1 gap-px border-t border-[var(--v2-line)] bg-[var(--v2-line)] sm:grid-cols-2 lg:grid-cols-6">
          {items.map((it, i) => (
            <li key={it.title} className="flex flex-col gap-3 bg-[var(--v2-bg)] p-6 md:p-7" data-reveal>
              <span className="font-mono text-[11px] text-[var(--v2-accent)]">{String(i + 1).padStart(2, "0")}</span>
              <h3 className="text-[17px] font-medium tracking-[-0.01em]">{it.title}</h3>
              <p className="text-[14px] leading-[1.55] text-[var(--v2-muted)]">{it.text}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}

/* ───────────────────────── Fases por servicio (banda negra) ───────────────────────── */

type Entrada = { clave: string; nombre: string; fuente?: string; steps?: Paso[] };

export async function ProcesoServicios({ locale }: { locale: string }) {
  const t = await getTranslations({ locale, namespace: `${NS}.servicios` });
  const lista = t.raw("lista") as Entrada[];
  const servicios: ProcesoDeServicio[] = [];
  for (const s of lista) {
    if (s.fuente) {
      const tf = await getTranslations({ locale, namespace: `${s.fuente}.proceso` });
      servicios.push({ clave: s.clave, nombre: s.nombre, pasos: tf.raw("steps") as Paso[] });
    } else if (s.steps) {
      servicios.push({ clave: s.clave, nombre: s.nombre, pasos: s.steps });
    }
  }
  return (
    <section id="proceso" data-header-tone="dark" className="v2-oscuro scroll-mt-20">
      <div className="v2-frame">
        <div className="v2-rail">
          <Cabecera t={t} />
          <SelectorServicio servicios={servicios} etiquetaSalidas={t("outputsLabel")} />
          <div className="h-16 lg:h-20" />
        </div>
      </div>
    </section>
  );
}

/* ───────────────────────── La IA ───────────────────────── */

export async function ProcesoIA({ locale }: { locale: string }) {
  const t = await getTranslations({ locale, namespace: `${NS}.ia` });
  const items = t.raw("items") as { title: string; tool: string; text: string }[];
  const no = t.raw("no") as string[];
  return (
    <section className="v2-frame">
      <div className="v2-rail">
        <Cabecera t={t} />
        <div className="grid grid-cols-1 gap-px border-t border-[var(--v2-line)] bg-[var(--v2-line)] sm:grid-cols-2 lg:grid-cols-3">
          {items.map((it) => (
            <div key={it.title} className="flex flex-col gap-3 bg-[var(--v2-bg)] p-6 md:p-8" data-reveal>
              <span className="self-start rounded-[4px] bg-[var(--v2-hover)] px-2 py-0.5 font-mono text-[11px] text-[var(--v2-muted)]">
                {it.tool}
              </span>
              <h3 className="text-[19px] font-medium tracking-[-0.01em]">{it.title}</h3>
              <p className="text-[15px] leading-[1.6] text-[var(--v2-muted)]">{it.text}</p>
            </div>
          ))}
        </div>
        {/* Lo que no se le deja a la IA, en una fila aparte. */}
        <div className="flex flex-col gap-4 border-t border-[var(--v2-line)] px-6 py-8 md:px-10 lg:flex-row lg:items-center lg:gap-10">
          <span className="v2-label shrink-0">{t("noLabel")}</span>
          <ul className="flex flex-wrap gap-x-6 gap-y-3">
            {no.map((x) => (
              <li key={x} className="flex items-center gap-2 text-[15px]">
                <X size={14} strokeWidth={2} className="shrink-0 text-[var(--v2-accent)]" />
                {x}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}

/* ───────────────────────── Lo que no cambia ───────────────────────── */

export async function ProcesoSiempre({ locale }: { locale: string }) {
  const t = await getTranslations({ locale, namespace: `${NS}.siempre` });
  const items = t.raw("items") as { title: string; text: string }[];
  return (
    <section className="v2-frame">
      <div className="v2-rail">
        <LineaArriba />
        <Cabecera t={t} />
        <div className="grid grid-cols-1 gap-px border-t border-[var(--v2-line)] bg-[var(--v2-line)] sm:grid-cols-2 lg:grid-cols-3">
          {items.map((it) => (
            <div key={it.title} className="flex gap-4 bg-[var(--v2-bg)] p-6 md:p-8" data-reveal>
              <Check size={17} strokeWidth={2} className="mt-0.5 shrink-0 text-[var(--v2-accent)]" />
              <span className="flex flex-col gap-1.5">
                <span className="text-[17px] font-medium tracking-[-0.01em]">{it.title}</span>
                <span className="text-[14.5px] leading-[1.55] text-[var(--v2-muted)]">{it.text}</span>
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ───────────────────────── El portal ───────────────────────── */

export async function ProcesoPortal({ locale }: { locale: string }) {
  const t = await getTranslations({ locale, namespace: `${NS}.portal` });
  const items = t.raw("items") as string[];
  return (
    <section className="v2-frame">
      <div className="v2-rail grid grid-cols-1 lg:grid-cols-12">
        <LineaArriba />
        <div className="flex flex-col gap-8 border-b border-[var(--v2-line)] p-6 md:p-10 lg:col-span-5 lg:border-b-0 lg:border-r lg:p-14">
          <Cabecera t={t} centro={false} />
          <ul className="flex flex-col border-t border-[var(--v2-line)]">
            {items.map((x) => (
              <li key={x} className="flex items-start gap-3 border-b border-[var(--v2-line)] py-3.5 text-[15px] leading-[1.45]" data-reveal>
                <Check size={15} strokeWidth={2} className="mt-[3px] shrink-0 text-[var(--v2-accent)]" />
                {x}
              </li>
            ))}
          </ul>
        </div>
        <div className="relative min-h-[320px] overflow-hidden bg-[var(--v2-bg-2)] lg:col-span-7" data-reveal="fade">
          <img
            src="/images/portal-cliente.webp"
            alt={t("imageAlt")}
            loading="lazy"
            className="absolute inset-0 h-full w-full object-cover object-left-top"
          />
        </div>
      </div>
    </section>
  );
}

/* ───────────────────────── Herramientas ───────────────────────── */

export async function ProcesoStack({ locale }: { locale: string }) {
  const t = await getTranslations({ locale, namespace: `${NS}.stack` });
  // Los grupos y las herramientas son los de la página de proceso de siempre.
  const tg = await getTranslations({ locale, namespace: "proceso.stack" });
  const grupos = tg.raw("groups") as { name: string; tools: string[] }[];
  return (
    <section className="v2-frame">
      <div className="v2-rail">
        <LineaArriba />
        <Cabecera t={t} />
        <div className="grid grid-cols-1 gap-px border-t border-[var(--v2-line)] bg-[var(--v2-line)] sm:grid-cols-2 lg:grid-cols-4">
          {grupos.map((g) => (
            <div key={g.name} className="flex flex-col gap-5 bg-[var(--v2-bg)] p-6 md:p-8" data-reveal>
              <span className="v2-label">{g.name}</span>
              <ul className="flex flex-col gap-3">
                {g.tools.map((tool) => {
                  const trazo = TOOL_LOGOS[tool];
                  return (
                    <li key={tool} className="flex items-center gap-3 text-[15px]">
                      <span className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-[6px] border border-[var(--v2-line)]">
                        {trazo ? (
                          <svg viewBox="0 0 24 24" className="h-4 w-4" fill="currentColor" aria-hidden>
                            <path d={trazo} />
                          </svg>
                        ) : null}
                      </span>
                      {tool}
                    </li>
                  );
                })}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
