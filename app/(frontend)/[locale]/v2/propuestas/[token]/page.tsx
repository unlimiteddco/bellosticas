import type { Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";
import { ArrowRight, CalendarClock, Check, Clock, Download } from "lucide-react";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { Link } from "@/navigation";
import { defaultLocale } from "@/i18n";
import { Logo } from "@/components/ui/Logo";
import { Reveal } from "@/components/ui/Reveal";
import { V2Root } from "@/components/v2/V2Root";
import { TestimonialsV2 } from "@/components/v2/home/TestimonialsV2";
import { ProposalWizard } from "@/components/sections/proposal/ProposalWizard";
import { ProposalSideNav } from "@/components/sections/proposal/ProposalSideNav";
import { ProposalExtras } from "@/components/sections/proposal/ProposalExtras";
import { ProposalExtrasProvider } from "@/components/sections/proposal/ProposalExtrasContext";
import { ProposalPrice } from "@/components/sections/proposal/ProposalPrice";
import { ProposalPaymentPlan } from "@/components/sections/proposal/ProposalPaymentPlan";
import { ProposalMethod } from "@/components/sections/proposal/ProposalMethod";
import { ProposalContext } from "@/components/sections/proposal/ProposalContext";
import { ProposalContrast } from "@/components/sections/proposal/ProposalContrast";
import { ProposalScope } from "@/components/sections/proposal/ProposalScope";
import { ProposalPreloader } from "@/components/sections/proposal/ProposalPreloader";
import { ProposalMobileCta } from "@/components/sections/proposal/ProposalMobileCta";
import { fetchProposal, formatEUR, formatEURPrecio, lineTotal } from "@/lib/proposals";

/*
 * La propuesta al cliente, con el estilo de la V2. Para sustituir a
 * /propuestas/[token] cuando se publique la V2.
 *
 * Los datos y todo lo que hace algo (firmar, pagar, extras, el PDF, el menú
 * lateral, la barra del móvil) son los de la propuesta de siempre: aquí no se
 * reescribe nada de eso. Cambian la forma de la página (marco de líneas,
 * cabecera mínima, secciones separadas por líneas, el tema claro u oscuro) y,
 * con .v2-propuesta (app/v2.css), los colores, esquinas y titulares de esos
 * componentes. Nunca se indexa.
 */
export const dynamic = "force-dynamic";

const SERVICE_KEYS = new Set(["landing_page", "web_corporativa", "chatbot", "tienda_online", "desarrollo_propio", "seo"]);

export async function generateMetadata({ params }: { params: Promise<{ locale: string; token: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "proposalPage" });
  return { title: `${t("metaTitle")} · V2`, robots: { index: false, follow: false } };
}

/** Cabecera de sección: etiqueta y titular con la palabra en cursiva roja. */
function Titulo({ etiqueta, partes }: { etiqueta: string; partes?: [string, string, string] }) {
  return (
    <div className="mb-8 flex flex-col gap-4">
      <span className="v2-label">{etiqueta}</span>
      {partes && (
        <h2 className="v2-h2">
          {partes[0]}
          <em className="font-display italic font-semibold text-[var(--v2-accent)]">{partes[1]}</em>
          {partes[2]}
        </h2>
      )}
    </div>
  );
}

/** Cada bloque del contenido, separado del siguiente por una línea a todo el ancho. */
function Bloque({ id, children }: { id?: string; children: React.ReactNode }) {
  return (
    <section id={id} className="scroll-mt-24 border-b border-[var(--v2-line)] px-6 py-14 last:border-b-0 md:px-10 lg:px-14 lg:py-16">
      {children}
    </section>
  );
}

export default async function PropuestaV2({ params }: { params: Promise<{ locale: string; token: string }> }) {
  const { locale, token } = await params;
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: "proposalPage" });

  const data = await fetchProposal(token);
  if (!data) notFound();

  const { proposal, items, installments, expired, maintenance, prefill } = data;
  const extras = data.extras ?? [];
  const contexto = proposal.context ?? null;
  const contraste = proposal.contrast ?? null;
  const alcance = proposal.scope ?? null;
  const faqs = proposal.faqs ?? [];
  const accepted = proposal.status === "accepted";
  const unavailable = expired || proposal.status === "rejected" || proposal.status === "expired";
  const serviceKey = proposal.serviceType && SERVICE_KEYS.has(proposal.serviceType) ? proposal.serviceType : null;
  const highlights = proposal.highlights ?? [];
  const phases = proposal.phases ?? [];

  const IVA = 0.21;
  const baseSum = installments.reduce((s, i) => s + (Number(i.amount) || 0), 0);
  const totalBase = installments.length > 0 ? baseSum : Number(proposal.total) || 0;

  const validUntil =
    proposal.expiresAt && !unavailable
      ? new Intl.DateTimeFormat(locale === "es" ? "es-ES" : "en-GB", { day: "numeric", month: "long" }).format(
          new Date(proposal.expiresAt),
        )
      : null;
  const pdf = locale === defaultLocale ? `/propuestas/${token}/pdf` : `/${locale}/propuestas/${token}/pdf`;

  const navSections = [
    ...(contexto ? [{ id: "partida", label: t("nav_partida") }] : []),
    { id: "incluye", label: t("nav_incluye") },
    { id: "metodo", label: t("nav_metodo") },
    { id: "inversion", label: t("nav_inversion") },
    ...(alcance ? [{ id: "alcance", label: t("nav_alcance") }] : []),
    { id: "aceptar", label: t("nav_empezar") },
  ];

  const preguntas =
    faqs.length > 0
      ? faqs
      : (["q1", "q2", "q3", "q4"] as const).map((k) => ({ q: t(`faq_${k}`), a: t(`faq_${k}_a`) }));

  return (
    <V2Root>
      <ProposalExtrasProvider extras={extras}>
        {!unavailable && <ProposalPreloader clientName={proposal.clientName} />}

        <div className="v2-propuesta">
          {/* ── Cabecera mínima: la marca, para quién es y el PDF ── */}
          <header className="sticky top-0 z-30 border-b border-[var(--v2-line)] bg-[var(--v2-bg)]/90 backdrop-blur">
            <div className="v2-frame">
              <div className="flex h-[60px] items-center justify-between gap-4 px-5 md:px-0">
                <span className="flex items-center gap-4">
                  <span className="v2-solo-claro">
                    <Logo variant="black" height={20} priority />
                  </span>
                  <span className="v2-solo-oscuro">
                    <Logo variant="blanco-rojo" height={20} priority />
                  </span>
                  {proposal.clientName && (
                    <span className="hidden border-l border-[var(--v2-line)] pl-4 text-[13.5px] text-[var(--v2-muted)] sm:inline">
                      {t("welcome_eyebrow")} <span className="text-[var(--v2-text)]">{proposal.clientName}</span>
                    </span>
                  )}
                </span>
                {!unavailable && (
                  <a href={pdf} className="v2-btn v2-btn--ghost v2-btn--sm">
                    <Download size={14} strokeWidth={1.75} />
                    <span className="hidden sm:inline">{t("download_pdf")}</span>
                    <span className="sm:hidden">PDF</span>
                  </a>
                )}
              </div>
            </div>
          </header>

          <main>
            {/* ── Hero ── */}
            <section className="v2-frame">
              <div className="flex flex-col gap-7 px-5 pb-14 pt-12 md:px-0 lg:pb-16 lg:pt-16">
                <span className="v2-label v2-hero-in flex items-center gap-2.5">
                  <span aria-hidden className="h-1.5 w-1.5 rounded-full bg-[var(--v2-accent)]" />
                  {serviceKey ? t(`service.${serviceKey}`) : t("label")}
                </span>
                <h1
                  className="v2-hero-in v2-h1 v2-h1--doc max-w-[1180px]"
                  style={{ animationDelay: "80ms" }}
                >
                  {proposal.title}
                </h1>
                {proposal.transformation && (
                  <p
                    className="v2-hero-in max-w-[780px] font-display text-[22px] italic leading-[1.4] text-[var(--v2-accent)] md:text-[28px]"
                    style={{ animationDelay: "160ms" }}
                  >
                    {proposal.transformation}
                  </p>
                )}
                <div className="v2-hero-in flex flex-wrap items-center gap-3" style={{ animationDelay: "240ms" }}>
                  {!accepted && !unavailable && (
                    <a href="#incluye" className="v2-btn v2-btn--primary">
                      {t("cta_view")} <ArrowRight size={15} />
                    </a>
                  )}
                  {proposal.timeline && (
                    <span className="inline-flex items-center gap-2 rounded-[6px] border border-[var(--v2-line)] px-3.5 py-2 text-[13px] text-[var(--v2-muted)]">
                      <Clock size={14} className="text-[var(--v2-accent)]" />
                      {proposal.timeline}
                    </span>
                  )}
                  {validUntil && (
                    <span className="inline-flex items-center gap-2 rounded-[6px] border border-[var(--v2-accent)]/30 bg-[var(--v2-accent)]/[0.06] px-3.5 py-2 text-[13px]">
                      <CalendarClock size={14} className="text-[var(--v2-accent)]" />
                      {t("valid_until", { date: validUntil })}
                    </span>
                  )}
                </div>
              </div>
            </section>

            {/* ── Menú lateral fijo + contenido, en el marco de líneas ── */}
            <div className="v2-frame">
              <div className="v2-rail grid grid-cols-1 lg:grid-cols-12">
                <span aria-hidden className="pointer-events-none absolute left-0 right-0 top-0 h-px bg-[var(--v2-line)]" />
                <aside className="hidden border-r border-[var(--v2-line)] p-8 lg:col-span-3 lg:block">
                  <div className="sticky top-24">
                    <ProposalSideNav
                      label={t("toc_label")}
                      sections={navSections}
                      ctaLabel={t("cta_short")}
                      accepted={accepted}
                      unavailable={unavailable}
                      acceptedLabel={t("status_accepted")}
                      trust={{ ratingValue: t("trust_rating_value"), ratingLabel: t("trust_rating_label") }}
                    />
                  </div>
                </aside>

                <div className="min-w-0 lg:col-span-9">
                  {contexto && (
                    <Bloque>
                      <ProposalContext data={contexto} label={t("context_label")} proofsLabel={t("context_proofs")} v2 />
                    </Bloque>
                  )}

                  {contraste && (
                    <Bloque>
                      <Titulo etiqueta={t("objective_label")} />
                      <ProposalContrast data={contraste} todayLabel={t("contrast_today")} afterLabel={t("contrast_after")} />
                    </Bloque>
                  )}

                  {/* ── Qué incluye: las fases con lo que se hace en cada una ── */}
                  <Bloque id="incluye">
                    <Titulo
                      etiqueta={t("includes_label")}
                      partes={[t("includes_title_1"), t("includes_title_accent"), t("includes_title_2")]}
                    />
                    {phases.length > 0 ? (
                      <div className="flex flex-col">
                        <span className="v2-label mb-2 !text-[10px]">{t("phases_subtitle")}</span>
                        {phases.map((ph, i) => (
                          <Reveal key={i} delay={Math.min(i * 0.05, 0.2)}>
                            <div className="grid grid-cols-1 gap-4 border-t border-[var(--v2-line)] py-7 md:grid-cols-[64px_1fr]">
                              <span className="font-mono text-[13px] text-[var(--v2-accent)] md:pt-1">{String(i + 1).padStart(2, "0")}</span>
                              <div className="flex flex-col gap-4">
                                <div className="flex flex-wrap items-baseline justify-between gap-3">
                                  <h3 className="text-[22px] font-medium tracking-[-0.02em] md:text-[24px]">{ph.name}</h3>
                                  {ph.duration && <span className="v2-tag">{ph.duration}</span>}
                                </div>
                                <ul className="grid grid-cols-1 gap-x-8 sm:grid-cols-2">
                                  {ph.items.map((it, j) => (
                                    <li key={j} className="flex gap-2.5 border-t border-[var(--v2-line)] py-2.5 text-[15px] leading-[1.5]">
                                      <Check size={15} strokeWidth={2} className="mt-[3px] shrink-0 text-[var(--v2-accent)]" />
                                      <span>{it}</span>
                                    </li>
                                  ))}
                                </ul>
                              </div>
                            </div>
                          </Reveal>
                        ))}
                      </div>
                    ) : highlights.length === 0 ? (
                      // Sin fases: la lista de líneas del presupuesto.
                      <div className="flex flex-col">
                        {items.map((item, i) => {
                          const qty = typeof item.quantity === "string" ? parseFloat(item.quantity) : item.quantity;
                          return (
                            <div key={item.id ?? i} className="flex items-baseline justify-between gap-6 border-b border-[var(--v2-line)] py-4">
                              <div className="min-w-0">
                                <p className="text-[16px] md:text-[17px]">{item.description}</p>
                                {qty !== 1 && (
                                  <p className="mt-0.5 text-[12px] text-[var(--v2-muted)]">
                                    {qty} × {formatEUR(item.unitPrice, locale)}
                                  </p>
                                )}
                              </div>
                              <span className="shrink-0 text-[16px] tabular-nums md:text-[17px]">{formatEUR(lineTotal(item), locale)}</span>
                            </div>
                          );
                        })}
                      </div>
                    ) : null}
                  </Bloque>

                  {/* ── Cómo se trabaja — antes del precio a propósito ── */}
                  <Bloque>
                    <ProposalMethod locale={locale} v2 />
                  </Bloque>

                  {/* ── Inversión ── */}
                  <Bloque id="inversion">
                    <Titulo
                      etiqueta={t("investment_label")}
                      partes={[t("investment_title_1"), t("investment_title_accent"), t("investment_title_2")]}
                    />
                    <ProposalPrice baseSum={totalBase} taxRate={IVA} entregables={highlights.map((h) => h.title)} />
                    <ProposalExtras />

                    {installments.length > 0 && (
                      <div className="mt-14 border-t border-[var(--v2-line)] pt-12">
                        <Titulo etiqueta={t("plan_label")} partes={[t("plan_title_1"), t("plan_title_accent"), t("plan_title_2")]} />
                        <ProposalPaymentPlan installments={installments} />
                        <p className="mt-6 max-w-[620px] text-[13.5px] leading-[1.55]">{t("pay_today")}</p>
                        <p className="mt-2 text-[12.5px] text-[var(--v2-muted)]">{t("plan_note")}</p>
                      </div>
                    )}

                    {/* Mantenimiento: se ve antes de aceptar, no en la cuarta factura. */}
                    {maintenance ? (
                      <div className="v2-card mt-12 overflow-hidden">
                        <div className="flex flex-wrap items-baseline justify-between gap-3 border-b border-[var(--v2-line)] bg-[var(--v2-bg-2)] px-6 py-5 md:px-8">
                          <div className="flex flex-col gap-2">
                            <span className="v2-label">{t("maintenance_label")}</span>
                            <h3 className="text-[22px] font-medium tracking-[-0.02em] md:text-[26px]">
                              {t("maintenance_title", { plan: maintenance.nombre })}
                            </h3>
                          </div>
                          <p className="text-[26px] font-medium tracking-[-0.03em] md:text-[32px]">
                            {formatEURPrecio(maintenance.mensual, locale)}
                            <span className="text-[15px] font-normal text-[var(--v2-muted)]">{t("maintenance_month")}</span>
                          </p>
                        </div>
                        <div className="px-6 py-6 md:px-8">
                          <p className="max-w-[600px] text-[15px] leading-[1.6] text-[var(--v2-muted)]">{maintenance.nota || t("maintenance_included")}</p>
                          <ul className="mt-5 grid grid-cols-1 gap-x-8 sm:grid-cols-2">
                            {maintenance.incluye.map((linea) => (
                              <li key={linea} className="flex gap-2.5 border-t border-[var(--v2-line)] py-2.5 text-[14.5px]">
                                <Check size={15} strokeWidth={2} className="mt-[2px] shrink-0 text-[var(--v2-accent)]" />
                                {linea}
                              </li>
                            ))}
                          </ul>
                          {/* El ahorro anual va en euros, nunca en porcentaje. */}
                          <p className="mt-5 text-[14px] text-[var(--v2-muted)]">
                            {t("maintenance_annual", {
                              anual: formatEURPrecio(maintenance.anual, locale),
                              ahorro: formatEURPrecio(maintenance.ahorro, locale),
                            })}
                          </p>
                        </div>
                      </div>
                    ) : null}

                    {/* Mini-FAQ: las preguntas propias de esta propuesta ganan a las genéricas. */}
                    <div className="mt-12">
                      <span className="v2-label">{t("faq_label")}</span>
                      <div className="mt-4 border-t border-[var(--v2-line)]">
                        {preguntas.map((f, i) => (
                          <details key={i} className="group border-b border-[var(--v2-line)] py-4">
                            <summary className="flex cursor-pointer list-none items-center justify-between gap-4 text-[16px] font-medium">
                              {f.q}
                              <span
                                aria-hidden
                                className="relative h-3.5 w-3.5 shrink-0 transition-transform duration-300 group-open:rotate-45"
                              >
                                <span className="absolute left-0 top-1/2 h-px w-full -translate-y-1/2 bg-[var(--v2-accent)]" />
                                <span className="absolute left-1/2 top-0 h-full w-px -translate-x-1/2 bg-[var(--v2-accent)]" />
                              </span>
                            </summary>
                            <p className="mt-2 max-w-[640px] text-[14.5px] leading-[1.6] text-[var(--v2-muted)]">{f.a}</p>
                          </details>
                        ))}
                      </div>
                    </div>
                  </Bloque>

                  {alcance && (
                    <Bloque>
                      <ProposalScope
                        data={alcance}
                        label={t("scope_label")}
                        title1={t("scope_title_1")}
                        titleAccent={t("scope_title_accent")}
                        title2={t("scope_title_2")}
                        providesLabel={t("scope_provides")}
                        excludedLabel={t("scope_excluded")}
                        v2
                      />
                    </Bloque>
                  )}

                  {/* ── Empezar: datos, firma y pago ── */}
                  <Bloque id="aceptar">
                    <Titulo etiqueta={t("accept_label")} partes={[t("accept_title_1"), t("accept_title_accent"), t("accept_title_2")]} />
                    {accepted || unavailable ? (
                      <div className="v2-card bg-[var(--v2-bg-2)] p-8">
                        <h3 className="text-[24px] font-medium tracking-[-0.02em]">
                          {accepted ? t("accepted_title") : t("expired_title")}
                        </h3>
                        <p className="mt-2 text-[15px] text-[var(--v2-muted)]">{accepted ? t("accepted_body") : t("expired_body")}</p>
                      </div>
                    ) : (
                      <>
                        <p className="-mt-2 mb-7 max-w-[600px] text-[16px] leading-[1.55] text-[var(--v2-muted)]">{t("accept_sub")}</p>
                        {/* La persona detrás: boutique de verdad. */}
                        <div className="mb-8 flex items-center gap-4">
                          <Image
                            src="/images/antonio-bellostas-hero.jpg"
                            alt="Antonio Bellostas"
                            width={96}
                            height={96}
                            className="h-12 w-12 shrink-0 rounded-full border border-[var(--v2-line)] object-cover"
                          />
                          <div>
                            <p className="font-display text-[17px] italic leading-[1.45]">“{t("signature_line")}”</p>
                            <p className="mt-0.5 text-[12.5px] text-[var(--v2-muted)]">{t("signature_name")}</p>
                          </div>
                        </div>
                        <ProposalWizard
                          token={token}
                          prefill={prefill}
                          totalBase={totalBase}
                          taxRate={IVA}
                          installments={installments.map((i) => ({ label: i.label, amount: Number(i.amount) || 0, dueRule: i.dueRule }))}
                        />
                      </>
                    )}
                  </Bloque>
                </div>
              </div>
            </div>

            <TestimonialsV2 />
          </main>

          {/* Pie mínimo: la página de cierre es un pasillo, no una plaza. */}
          <footer className="border-t border-[var(--v2-line)]">
            <div className="v2-frame">
              <div className="flex flex-col items-center justify-between gap-4 px-6 py-7 text-[13px] sm:flex-row md:px-10">
                <span className="text-[var(--v2-muted)]">© Bellostas Studio</span>
                <a href="mailto:info@bellostas.studio" className="transition-colors hover:text-[var(--v2-accent)]">
                  {t("footer_questions")} info@bellostas.studio
                </a>
                <span className="flex items-center gap-5 text-[var(--v2-muted)]">
                  <Link href="/v2/legal" className="hover:text-[var(--v2-text)]">
                    {t("footer_legal")}
                  </Link>
                  <Link href="/v2/privacidad" className="hover:text-[var(--v2-text)]">
                    {t("footer_privacy")}
                  </Link>
                </span>
              </div>
            </div>
          </footer>

          {!accepted && !unavailable && <ProposalMobileCta label={t("cta_short")} />}
        </div>
      </ProposalExtrasProvider>
    </V2Root>
  );
}
