"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import { useTranslations } from "next-intl";
import { EditorialLabel } from "@/components/ui/EditorialLabel";
import { MixedHeadline } from "@/components/ui/MixedHeadline";
import { PrimaryButton } from "@/components/ui/PrimaryButton";
import { Reveal } from "@/components/ui/Reveal";
import { WorkModal } from "@/components/sections/WorkModal";
import type { ResolvedProject } from "@/lib/cms/types";

/**
 * La página de Trabajos.
 *
 * Antes era una rejilla de tarjetas de color con un logo dentro: todas
 * iguales y sin decir nada hasta abrirlas. Ahora tiene dos partes que hacen
 * cosas distintas:
 *
 *  1. Casos destacados — los proyectos que tienen imagen, uno por fila y en
 *     grande, con lo que se hizo escrito al lado. Es lo que se lee.
 *  2. Todos los proyectos — un índice, como el de un libro: nombre, cliente,
 *     tipo y año. Es lo que se recorre con la vista.
 *
 * Un proyecto sin imagen no se queda fuera: va al índice.
 * `?caso=slug` abre directamente la ficha de ese proyecto (así enlaza el menú).
 */
export function WorkPageContent({ projects }: { projects: ResolvedProject[] }) {
  const t = useTranslations("workPage");
  const tw = useTranslations("work");
  const [selected, setSelected] = useState<ResolvedProject | null>(null);

  // Destacados: los marcados en el gestor primero, y hasta tres con imagen.
  const conImagen = projects.filter((p) => p.cover && !p.comingSoon);
  const destacados = [...conImagen.filter((p) => p.featured), ...conImagen.filter((p) => !p.featured)].slice(0, 3);

  useEffect(() => {
    const slug = new URLSearchParams(window.location.search).get("caso");
    const p = slug ? projects.find((x) => x.slug === slug && !x.comingSoon) : null;
    if (p) setSelected(p);
  }, [projects]);

  const stats = [t("stats.projects"), t("stats.since"), t("stats.ontime")];

  return (
    <>
      {/* ── Cabecera ── */}
      <section className="relative z-10 max-w-[1280px] mx-auto px-6 lg:px-12 pt-[160px] pb-12 md:pb-16">
        <div className="flex flex-col gap-6 max-w-[880px]">
          <EditorialLabel>{t("label")}</EditorialLabel>
          <MixedHeadline
            as="h1"
            className="text-[48px] md:text-[72px] lg:text-[88px]"
            parts={[
              { text: t("title_part1") },
              { text: t("title_emphasis"), accent: true },
              { text: t("title_part2") },
            ]}
          />
          <p className="font-body text-[17px] lg:text-[19px] leading-[1.55] text-[var(--color-text-muted)] max-w-[640px]">
            {t("sub")}
          </p>
        </div>

        {/* Las tres cifras, en una banda con filetes: se leen de un vistazo. */}
        <Reveal className="mt-12 md:mt-16 grid grid-cols-1 sm:grid-cols-3 border-t border-b border-[var(--color-border)]">
          {stats.map((s, i) => (
            <span
              key={s}
              className={`py-5 sm:py-6 font-body text-[15px] md:text-[17px] font-medium text-[var(--color-text)] ${
                i > 0 ? "border-t sm:border-t-0 sm:border-l border-[var(--color-border)] sm:pl-8" : ""
              }`}
            >
              {s}
            </span>
          ))}
        </Reveal>
      </section>

      {/* ── Casos destacados ── */}
      {destacados.length > 0 && (
        <section className="relative z-10 max-w-[1280px] mx-auto px-6 lg:px-12 pb-8 md:pb-12">
          <EditorialLabel as="div" className="mb-8 md:mb-10">
            {t("featuredSection")}
          </EditorialLabel>
          <div className="flex flex-col gap-16 md:gap-24">
            {destacados.map((p, i) => (
              <motion.article
                key={p.slug}
                initial={{ opacity: 0, y: 28 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-80px" }}
                transition={{ duration: 0.6, ease: [0.4, 0, 0.2, 1] }}
                className="grid grid-cols-1 md:grid-cols-12 gap-6 md:gap-10 lg:gap-14 items-center"
              >
                {/* La imagen manda: siete de doce, y alterna de lado en cada caso. */}
                <button
                  type="button"
                  onClick={() => setSelected(p)}
                  aria-label={`${t("viewCase")}: ${p.name}`}
                  className={`group relative md:col-span-7 aspect-[16/10] rounded-2xl overflow-hidden cursor-pointer ${
                    i % 2 === 1 ? "md:order-2" : ""
                  }`}
                  style={{ backgroundColor: p.color }}
                >
                  <img
                    src={p.cover}
                    alt={p.name}
                    className="absolute inset-0 h-full w-full object-cover transition-transform duration-[900ms] ease-out group-hover:scale-[1.035]"
                  />
                  <span
                    className="absolute bottom-4 right-4 flex items-center gap-1.5 rounded-full bg-[var(--color-bg)]/95 px-3 py-1.5 font-body uppercase text-[10px] text-[var(--color-text)] opacity-0 translate-y-1 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300"
                    style={{ letterSpacing: "0.12em" }}
                  >
                    {t("viewCase")}
                    <ArrowUpRight size={12} className="text-[var(--color-accent)]" />
                  </span>
                </button>

                <div className="md:col-span-5 flex flex-col gap-4">
                  <span className="flex items-baseline gap-3">
                    <span className="font-mono text-[11px] text-[var(--color-accent)]" style={{ letterSpacing: "0.08em" }}>
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <EditorialLabel>
                      {p.category} · {p.year}
                    </EditorialLabel>
                  </span>
                  <h2 className="font-body font-medium tracking-tight leading-[1.05] text-[34px] md:text-[44px] text-[var(--color-text)]">
                    {p.name}
                  </h2>
                  <p className="font-body text-[16px] leading-[1.65] text-[var(--color-text-muted)] line-clamp-5">{p.description}</p>

                  <dl className="mt-2 grid grid-cols-2 gap-x-6 gap-y-1 border-t border-[var(--color-border)] pt-4">
                    <dt className="font-body uppercase text-[10px] text-[var(--color-text-muted)]" style={{ letterSpacing: "0.16em" }}>
                      {tw("modal.client")}
                    </dt>
                    <dt className="font-body uppercase text-[10px] text-[var(--color-text-muted)]" style={{ letterSpacing: "0.16em" }}>
                      {tw("modal.stack")}
                    </dt>
                    <dd className="font-body text-[14px] text-[var(--color-text)]">{p.client}</dd>
                    <dd className="font-body text-[14px] text-[var(--color-text)]">{p.stack.join(" · ") || "—"}</dd>
                  </dl>

                  <button
                    type="button"
                    onClick={() => setSelected(p)}
                    className="group/btn mt-3 inline-flex items-center gap-2 self-start font-body text-[14px] font-medium text-[var(--color-text)] cursor-pointer"
                  >
                    <span className="underline decoration-[var(--color-accent)] underline-offset-[6px]">{t("viewCase")}</span>
                    <ArrowUpRight
                      size={15}
                      className="text-[var(--color-accent)] transition-transform duration-200 group-hover/btn:translate-x-0.5 group-hover/btn:-translate-y-0.5"
                    />
                  </button>
                </div>
              </motion.article>
            ))}
          </div>
        </section>
      )}

      {/* ── Todos los proyectos: el índice ── */}
      <section data-video-trigger className="relative z-10 max-w-[1280px] mx-auto px-6 lg:px-12 py-16 lg:py-24">
        <div className="flex items-end justify-between gap-6 mb-6">
          <EditorialLabel as="div">{t("allSection")}</EditorialLabel>
          <span className="font-mono text-[11px] text-[var(--color-text-muted)]" style={{ letterSpacing: "0.08em" }}>
            {String(projects.length).padStart(2, "0")}
          </span>
        </div>

        {/* Cabecera de columnas: solo donde hay columnas (escritorio). */}
        <div
          className="hidden md:grid grid-cols-12 gap-6 pb-3 border-b border-[var(--color-text)] font-body uppercase text-[10px] text-[var(--color-text-muted)]"
          style={{ letterSpacing: "0.16em" }}
        >
          <span className="col-span-5">{t("col_project")}</span>
          <span className="col-span-3">{t("col_client")}</span>
          <span className="col-span-3">{t("col_type")}</span>
          <span className="col-span-1 text-right">{t("col_year")}</span>
        </div>

        <ul className="border-t border-[var(--color-text)] md:border-t-0">
          {projects.map((p, i) => {
            const fila = (
              <>
                <span className="md:col-span-5 flex items-center gap-4 min-w-0">
                  {/* El color de marca del proyecto, en pequeño: da ritmo a la lista. */}
                  <span
                    className="hidden sm:flex h-10 w-14 shrink-0 items-center justify-center rounded-lg overflow-hidden"
                    style={{ backgroundColor: p.color }}
                  >
                    {p.cover && !p.comingSoon ? (
                      <img src={p.cover} alt="" className="h-full w-full object-cover" loading="lazy" />
                    ) : (
                      p.logo && <img src={p.logo} alt="" className="max-h-[14px] max-w-[38px] object-contain" loading="lazy" />
                    )}
                  </span>
                  <span
                    className={`font-body font-medium tracking-tight text-[20px] md:text-[24px] leading-tight transition-colors ${
                      p.comingSoon ? "text-[var(--color-text-muted)]" : "text-[var(--color-text)] group-hover:text-[var(--color-accent)]"
                    }`}
                  >
                    {p.name}
                  </span>
                </span>
                <span className="md:col-span-3 font-body text-[14px] text-[var(--color-text-muted)] truncate">{p.client}</span>
                <span className="md:col-span-3 font-body text-[14px] text-[var(--color-text-muted)] truncate">
                  {p.comingSoon ? (
                    <span className="inline-flex items-center gap-2 font-body uppercase text-[10.5px] text-[var(--color-accent)]" style={{ letterSpacing: "0.14em" }}>
                      <span className="h-1.5 w-1.5 rounded-full bg-[var(--color-accent)]" />
                      {t("comingSoon")}
                    </span>
                  ) : (
                    p.category
                  )}
                </span>
                <span className="md:col-span-1 flex items-center justify-between md:justify-end gap-3 font-mono text-[12px] text-[var(--color-text-muted)]">
                  {p.year}
                  {/* Siempre ocupa su sitio, aunque en «próximamente» no se vea:
                      si no, el año de esa fila se descuadra de los demás. */}
                  <ArrowUpRight
                    size={15}
                    aria-hidden
                    className={`text-[var(--color-accent)] opacity-0 -translate-x-1 transition-all duration-200 ${
                      p.comingSoon ? "" : "group-hover:opacity-100 group-hover:translate-x-0"
                    }`}
                  />
                </span>
              </>
            );
            const clase = "grid grid-cols-1 md:grid-cols-12 gap-1.5 md:gap-6 md:items-center w-full py-5 md:py-6 px-0 md:px-3 md:-mx-3 md:w-[calc(100%+1.5rem)] text-left rounded-xl transition-colors";
            return (
              <motion.li
                key={p.slug}
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-40px" }}
                transition={{ duration: 0.4, delay: Math.min(i, 8) * 0.04, ease: "easeOut" }}
                className="border-b border-[var(--color-border)]"
              >
                {p.comingSoon ? (
                  // Próximamente: se anuncia, pero todavía no hay ficha que abrir.
                  <div className={clase}>{fila}</div>
                ) : (
                  <button type="button" onClick={() => setSelected(p)} className={`group cursor-pointer hover:bg-[var(--color-surface-2)] ${clase}`}>
                    {fila}
                  </button>
                )}
              </motion.li>
            );
          })}
        </ul>
      </section>

      {/* ── Cierre ── */}
      <section className="relative z-10 max-w-[1280px] mx-auto px-6 lg:px-12 pb-16 lg:pb-24">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="relative overflow-hidden rounded-3xl bg-[var(--color-text)] px-6 md:px-12 py-12 md:py-16 flex flex-col md:flex-row md:items-center md:justify-between gap-8"
        >
          <div className="flex flex-col gap-3 max-w-[640px]">
            <EditorialLabel className="text-[var(--color-bg)]/60">{t("cta.label")}</EditorialLabel>
            <MixedHeadline
              dark
              className="text-[32px] md:text-[48px]"
              parts={[
                { text: t("cta.title_part1") },
                { text: t("cta.title_emphasis"), accent: true },
                { text: t("cta.title_part2") },
              ]}
            />
            <p className="font-body text-[15px] text-[var(--color-bg)]/65 max-w-[480px]">{t("cta.sub")}</p>
          </div>

          <div className="shrink-0">
            <PrimaryButton href="/contact" variant="inverse">
              {t("cta.button")}
            </PrimaryButton>
          </div>
        </motion.div>
      </section>

      <AnimatePresence>
        {selected && <WorkModal project={selected} onClose={() => setSelected(null)} />}
      </AnimatePresence>
    </>
  );
}
