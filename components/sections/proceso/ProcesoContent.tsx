import { useTranslations } from "next-intl";
import { EditorialLabel } from "@/components/ui/EditorialLabel";
import { MixedHeadline } from "@/components/ui/MixedHeadline";
import { PrimaryButton } from "@/components/ui/PrimaryButton";
import { Reveal } from "@/components/ui/Reveal";
import { Dato } from "@/components/ui/Dato";
import { TOOL_LOGOS } from "@/lib/tool-logos";

type Tarjeta = { title: string; body: string };
type Fase = { n: string; name: string; when: string; body: string; outputs: string[] };
type Grupo = { name: string; tools: string[] };

/**
 * La página de Proceso.
 *
 * Cinco bloques, en este orden: cabecera centrada; dónde entra la IA (tarjetas
 * numeradas); el proyecto en cuatro fases puestas en columnas, como un
 * calendario; las herramientas agrupadas; y los seis momentos en que se habla
 * con el cliente, con el portal debajo.
 *
 * Regla de la casa para los textos: hechos, no eslóganes. Cada frase tiene que
 * decir algo que el cliente pueda comprobar —cuánto dura, qué recibe, dónde lo
 * ve—. Todo el texto está en `proceso` (messages/es.json y en.json).
 */
export function ProcesoContent() {
  const t = useTranslations("proceso");
  const ia = t.raw("ai.cards") as Tarjeta[];
  const iaNo = t.raw("ai.no") as string[];
  const fases = t.raw("phases.items") as Fase[];
  const siempre = t.raw("phases.always") as string[];
  const grupos = t.raw("stack.groups") as Grupo[];
  const pasos = t.raw("steps.items") as Tarjeta[];

  const h2 = "font-body font-medium tracking-tight leading-[1.05] text-[34px] md:text-[52px] text-[var(--color-text)]";
  const cuerpo = "font-body text-[16px] leading-[1.65] text-[var(--color-text-muted)]";
  const tarjeta = "rounded-2xl border border-[var(--color-border)] bg-[var(--color-bg)]";

  return (
    <>
      {/* ── Cabecera, centrada sobre una luz suave ── */}
      <section className="relative z-10 overflow-hidden">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-x-0 top-0 h-[460px]"
          style={{
            background:
              "radial-gradient(46% 70% at 28% 0%, rgba(194,38,58,0.13), transparent 70%), radial-gradient(44% 64% at 72% 0%, rgba(232,196,160,0.42), transparent 72%)",
          }}
        />
        <div className="relative max-w-[1280px] mx-auto px-6 lg:px-12 pt-[190px] pb-20 md:pb-28 flex flex-col items-center text-center gap-7">
          <EditorialLabel>{t("hero.label")}</EditorialLabel>
          <MixedHeadline
            as="h1"
            className="text-[46px] md:text-[72px] lg:text-[86px] max-w-[980px]"
            parts={[
              { text: t("hero.title_part1") },
              { text: t("hero.title_emphasis"), accent: true },
              { text: t("hero.title_part2") },
            ]}
          />
          <p className="font-body text-[17px] lg:text-[19px] leading-[1.55] text-[var(--color-text-muted)] max-w-[620px]">
            {t("hero.sub")}
          </p>
          <PrimaryButton href="#fases">{t("hero.cta")}</PrimaryButton>
        </div>
      </section>

      {/* ── Dónde entra la IA: etiqueta a la izquierda, contenido a la derecha ── */}
      <section className="relative z-10 border-t border-[var(--color-border)]">
        <div className="max-w-[1280px] mx-auto px-6 lg:px-12 py-20 md:py-28 grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10">
          <div className="lg:col-span-3">
            <EditorialLabel className="lg:sticky lg:top-32 block">{t("ai.label")}</EditorialLabel>
          </div>
          <div className="lg:col-span-9 flex flex-col gap-10">
            <div className="flex flex-col gap-5 max-w-[760px]">
              <h2 className={h2}>{t("ai.title")}</h2>
              <p className={`${cuerpo} text-[17px]`}>{t("ai.sub")}</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {ia.map((c, i) => (
                <Reveal key={c.title} delay={(i % 2) * 0.06} className={`${tarjeta} p-7 flex flex-col gap-3`}>
                  <span className="font-mono text-[12px] text-[var(--color-accent)]">{String(i + 1).padStart(2, "0")}</span>
                  <h3 className="font-body font-medium text-[21px] tracking-tight text-[var(--color-text)]">{c.title}</h3>
                  <p className="font-body text-[15px] leading-[1.6] text-[var(--color-text-muted)]">{c.body}</p>
                </Reveal>
              ))}
              {/* La sexta casilla es lo contrario: lo que no se delega. */}
              <Reveal delay={0.06} className="rounded-2xl bg-[var(--color-text)] p-7 flex flex-col gap-4">
                <h3 className="font-body font-medium text-[21px] tracking-tight text-[var(--color-bg)]">{t("ai.noLabel")}</h3>
                <ul className="flex flex-col">
                  {iaNo.map((x) => (
                    <li key={x} className="py-2 border-t border-[var(--color-bg)]/12 first:border-t-0 font-body text-[14.5px] text-[var(--color-bg)]/80">
                      {x}
                    </li>
                  ))}
                </ul>
              </Reveal>
            </div>
          </div>
        </div>
      </section>

      {/* ── El proyecto: las cuatro fases en columnas ── */}
      <section id="fases" className="relative z-10 border-t border-b border-[var(--color-border)] scroll-mt-24">
        <div className="max-w-[1280px] mx-auto px-6 lg:px-12 py-20 md:py-28">
          <EditorialLabel as="div" className="mb-6">
            {t("phases.label")}
          </EditorialLabel>
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-10 items-end mb-12">
            <h2 className={`${h2} lg:col-span-7`}>{t("phases.title")}</h2>
            <p className={`${cuerpo} lg:col-span-5`}>{t("phases.sub")}</p>
          </div>

          <Dato className="block text-[var(--color-text-muted)] mb-3">{t("phases.alwaysLabel")}</Dato>
          <ul className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-12">
            {siempre.map((x) => (
              <li
                key={x}
                className="flex items-center justify-center gap-2.5 rounded-full border border-[var(--color-border)] bg-[var(--color-surface-2)] px-4 py-3 font-body text-[14.5px] text-[var(--color-text)] whitespace-nowrap"
              >
                <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-[var(--color-accent)]" />
                {x}
              </li>
            ))}
          </ul>

          <Dato className="block text-[var(--color-text-muted)] mb-3">{t("phases.timelineLabel")}</Dato>
          <ol className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {fases.map((f, i) => (
              <li key={f.n}>
                <Reveal delay={i * 0.07} className={`${tarjeta} h-full flex flex-col`}>
                  <div className="flex items-center justify-between border-b border-[var(--color-border)] px-6 py-4">
                    <Dato className="text-[var(--color-text)]">{f.when}</Dato>
                    <span className="font-mono text-[12px] text-[var(--color-accent)]">{f.n}</span>
                  </div>
                  <div className="flex flex-1 flex-col gap-3 px-6 py-6">
                    <h3 className="font-body font-medium text-[24px] tracking-tight leading-tight text-[var(--color-text)]">{f.name}</h3>
                    <p className="font-body text-[15px] leading-[1.6] text-[var(--color-text-muted)]">{f.body}</p>
                    <div className="mt-auto pt-5">
                      <Dato className="block text-[var(--color-text-muted)] mb-2">{t("phases.outputsLabel")}</Dato>
                      <ul className="flex flex-col">
                        {f.outputs.map((o) => (
                          <li key={o} className="py-2 border-t border-[var(--color-border)] font-body text-[14px] text-[var(--color-text)]">
                            {o}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </Reveal>
              </li>
            ))}
          </ol>
          <p className="mt-6 font-body text-[13.5px] text-[var(--color-text-muted)]">{t("phases.note")}</p>
        </div>
      </section>

      {/* ── Herramientas: cabecera centrada y, por grupos, una ficha por
          herramienta con su logotipo ── */}
      <section className="relative z-10 bg-[var(--color-surface-2)] border-b border-[var(--color-border)]">
        <div className="max-w-[1280px] mx-auto px-6 lg:px-12 py-20 md:py-28">
          <div className="flex flex-col items-center text-center gap-5 max-w-[720px] mx-auto mb-14 md:mb-16">
            <EditorialLabel>{t("stack.label")}</EditorialLabel>
            <h2 className={h2}>{t("stack.title")}</h2>
            <p className={cuerpo}>{t("stack.sub")}</p>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-x-8 gap-y-12">
            {grupos.map((g) => (
              <div key={g.name} className="flex flex-col gap-3">
                <Dato className="text-[var(--color-text-muted)]">{g.name}</Dato>
                <ul className="grid grid-cols-2 gap-2.5">
                  {g.tools.map((x) => (
                    <li
                      key={x}
                      className="flex items-center gap-3.5 rounded-xl bg-[var(--color-bg)] px-5 py-4 font-body text-[16px] font-medium text-[var(--color-text)]"
                    >
                      {TOOL_LOGOS[x] && (
                        <svg viewBox="0 0 24 24" className="h-[19px] w-[19px] shrink-0" aria-hidden>
                          <path d={TOOL_LOGOS[x]} fill="currentColor" />
                        </svg>
                      )}
                      {x}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Cómo estamos cerca: seis pasos y el portal ── */}
      <section className="relative z-10">
        <div className="max-w-[1280px] mx-auto px-6 lg:px-12 py-20 md:py-28">
          <div className="flex flex-col gap-5 max-w-[720px] mb-12">
            <EditorialLabel>{t("steps.label")}</EditorialLabel>
            <h2 className={h2}>{t("steps.title")}</h2>
            <p className={cuerpo}>{t("steps.sub")}</p>
          </div>
          <ol className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {pasos.map((p, i) => (
              <li key={p.title}>
                <Reveal delay={(i % 3) * 0.06} className={`${tarjeta} h-full p-7 flex flex-col gap-3`}>
                  <Dato className="text-[var(--color-accent)]">
                    {t("steps.stepLabel")} {i + 1}
                  </Dato>
                  <h3 className="font-body font-medium text-[21px] tracking-tight text-[var(--color-text)]">{p.title}</h3>
                  <p className="font-body text-[15px] leading-[1.6] text-[var(--color-text-muted)]">{p.body}</p>
                </Reveal>
              </li>
            ))}
          </ol>

          <Reveal className="mt-12 md:mt-16">
            <div className="rounded-2xl overflow-hidden border border-[var(--color-border)] shadow-[0_40px_90px_-50px_rgba(29,29,27,0.4)]">
              <img src="/images/portal-cliente.webp" alt={t("steps.imageAlt")} className="block w-full h-auto" loading="lazy" />
            </div>
            <p className="mt-4 font-body text-[13.5px] text-[var(--color-text-muted)]">{t("steps.note")}</p>
          </Reveal>
        </div>
      </section>
    </>
  );
}
