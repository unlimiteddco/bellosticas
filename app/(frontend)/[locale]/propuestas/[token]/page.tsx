import type { Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";
import { Clock, CalendarClock, Download } from "lucide-react";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { Link } from "@/navigation";
import { defaultLocale } from "@/i18n";
import { EditorialLabel } from "@/components/ui/EditorialLabel";
import { MixedHeadline } from "@/components/ui/MixedHeadline";
import { PrimaryButton } from "@/components/ui/PrimaryButton";
import { Reveal } from "@/components/ui/Reveal";
import { ShortTestimonials } from "@/components/sections/ShortTestimonials";
import { ProposalAcceptForm } from "@/components/sections/proposal/ProposalAcceptForm";
import { ProposalSideNav } from "@/components/sections/proposal/ProposalSideNav";
import { ProposalExtras } from "@/components/sections/proposal/ProposalExtras";
import { ProposalExtrasProvider } from "@/components/sections/proposal/ProposalExtrasContext";
import { ProposalTotalBar } from "@/components/sections/proposal/ProposalTotalBar";
import { ProposalMobileCta } from "@/components/sections/proposal/ProposalMobileCta";
import { fetchProposal, formatEUR, formatEURPrecio, lineTotal } from "@/lib/proposals";

export const dynamic = "force-dynamic";

const SERVICE_KEYS = new Set([
  "landing_page",
  "web_corporativa",
  "chatbot",
  "tienda_online",
  "desarrollo_propio",
  "seo",
]);
const DUE_RULES = new Set(["on_accept", "on_delivery", "date"]);

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; token: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "proposalPage" });
  return {
    title: t("metaTitle"),
    // Las propuestas son privadas: nunca indexar.
    robots: { index: false, follow: false },
  };
}

export default async function ProposalPage({
  params,
}: {
  params: Promise<{ locale: string; token: string }>;
}) {
  const { locale, token } = await params;
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: "proposalPage" });

  const data = await fetchProposal(token);
  if (!data) notFound();

  const { proposal, items, installments, expired, maintenance, prefill } = data;
  const extras = data.extras ?? [];
  const accepted = proposal.status === "accepted";
  const unavailable = expired || proposal.status === "rejected" || proposal.status === "expired";
  const serviceKey =
    proposal.serviceType && SERVICE_KEYS.has(proposal.serviceType) ? proposal.serviceType : null;
  const highlights = proposal.highlights ?? [];
  const phases = proposal.phases ?? [];

  // Tabla de inversión (estilo documento): base por plazo + IVA 21% + total.
  const IVA = 0.21;
  const baseSum = installments.reduce((s, i) => s + (Number(i.amount) || 0), 0);
  const ivaSum = baseSum * IVA;
  const totSum = baseSum + ivaSum;

  // "Válida hasta el…" — urgencia honesta si la propuesta tiene caducidad.
  const validUntil =
    proposal.expiresAt && !unavailable
      ? new Intl.DateTimeFormat(locale === "es" ? "es-ES" : "en-GB", {
          day: "numeric",
          month: "long",
        }).format(new Date(proposal.expiresAt))
      : null;

  const navSections = [
    { id: "incluye", label: t("nav_incluye") },
    { id: "inversion", label: t("nav_inversion") },
    { id: "aceptar", label: t("nav_empezar") },
  ];

  return (
    <ProposalExtrasProvider extras={extras}>
      <article className="relative z-10 max-w-[1320px] mx-auto px-6 lg:px-12 pt-[150px] pb-[104px] lg:pb-20">
        {/* ── Hero — a ancho completo, sin tarjeta ── */}
        <header className="flex flex-col gap-6 max-w-[920px] mb-14 lg:mb-20">
          <Reveal immediate delay={0.05}>
            <EditorialLabel>{`// ${serviceKey ? t(`service.${serviceKey}`) : t("label")}`}</EditorialLabel>
          </Reveal>
          <Reveal immediate delay={0.12}>
            <h1 className="font-body font-medium tracking-tight leading-[1.04] text-[42px] md:text-[60px] lg:text-[68px] text-[var(--color-text)]">
              {proposal.title}
            </h1>
          </Reveal>
          {proposal.transformation && (
            <Reveal immediate delay={0.22}>
              <p className="font-display italic text-[22px] md:text-[28px] leading-[1.4] text-[var(--color-accent)] max-w-[760px]">
                {proposal.transformation}
              </p>
            </Reveal>
          )}
          <Reveal immediate delay={0.32}>
            <div className="flex flex-wrap items-center gap-3 mt-1">
              {proposal.timeline && (
                <span className="inline-flex items-center gap-2 rounded-full border border-[var(--color-border)] px-4 py-2 font-body text-[13px] text-[var(--color-text-muted)]">
                  <Clock size={14} className="text-[var(--color-accent)]" />
                  {proposal.timeline}
                </span>
              )}
              {validUntil && (
                <span className="inline-flex items-center gap-2 rounded-full border border-[var(--color-accent)]/30 bg-[var(--color-accent)]/[0.05] px-4 py-2 font-body text-[13px] text-[var(--color-text)]">
                  <CalendarClock size={14} className="text-[var(--color-accent)]" />
                  {t("valid_until", { date: validUntil })}
                </span>
              )}
              {!accepted && !unavailable && (
                <PrimaryButton href="#incluye" className="whitespace-nowrap">
                  {t("cta_view")}
                </PrimaryButton>
              )}
              {/* Muchos clientes deciden con alguien más delante: el PDF es
                  para reenviar a un socio, a la gestoría o a quien firma. */}
              {!unavailable && (
                <a
                  href={locale === defaultLocale ? `/propuestas/${token}/pdf` : `/${locale}/propuestas/${token}/pdf`}
                  className="group inline-flex items-center gap-2 font-body text-[13px] text-[var(--color-text-muted)] transition-colors hover:text-[var(--color-text)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[var(--color-accent)] rounded-sm"
                >
                  <Download size={14} strokeWidth={1.75} />
                  <span className="border-b border-transparent group-hover:border-[var(--color-accent)] pb-px">
                    {t("download_pdf")}
                  </span>
                </a>
              )}
            </div>
          </Reveal>
        </header>

        {/* ── Grid: menú lateral sticky + contenido ── */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14">
          <aside className="hidden lg:block lg:col-span-3 lg:sticky lg:top-28 self-start">
            <ProposalSideNav
              label={t("toc_label")}
              sections={navSections}
              ctaLabel={t("cta_short")}
              accepted={accepted}
              unavailable={unavailable}
              acceptedLabel={t("status_accepted")}
              trust={{
                projectsCount: t("trust_projects_count"),
                projectsLabel: t("trust_projects_label"),
                ratingValue: t("trust_rating_value"),
                ratingLabel: t("trust_rating_label"),
              }}
            />
          </aside>

          <div className="lg:col-span-9 flex flex-col gap-16 lg:gap-20">
            {/* ── Qué incluye ── */}
            <section id="incluye" className="scroll-mt-28">
              <Reveal>
                <EditorialLabel>{`// ${t("includes_label")}`}</EditorialLabel>
              </Reveal>
              <Reveal delay={0.08}>
                <MixedHeadline
                  className="text-[32px] md:text-[44px] mt-4 mb-8"
                  parts={[
                    { text: t("includes_title_1") },
                    { text: t("includes_title_accent"), accent: true },
                    { text: t("includes_title_2") },
                  ]}
                />
              </Reveal>
              {highlights.length > 0 || phases.length > 0 ? (
                <>
                  {/* Piezas de la solución (rejilla cualitativa) */}
                  {highlights.length > 0 && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 lg:gap-5">
                      {highlights.map((h, i) => (
                        <Reveal key={i} delay={Math.min(i * 0.06, 0.3)}>
                          <div className="h-full rounded-2xl border border-[var(--color-border)] p-6 transition-[border-color,transform] duration-[350ms] hover:border-[var(--color-text)] hover:-translate-y-1">
                            <h3 className="font-display text-[20px] md:text-[21px] text-[var(--color-text)]">
                              {h.title}
                            </h3>
                            <p className="font-body text-[14px] leading-[1.6] text-[var(--color-text-muted)] mt-2">
                              {h.description}
                            </p>
                          </div>
                        </Reveal>
                      ))}
                    </div>
                  )}

                  {/* Fase a fase */}
                  {phases.length > 0 && (
                    <div className="mt-12">
                      <p
                        className="font-body uppercase text-[11px] text-[var(--color-text-muted)] mb-6"
                        style={{ letterSpacing: "0.18em" }}
                      >
                        {t("phases_subtitle")}
                      </p>
                      <div className="flex flex-col gap-8">
                        {phases.map((ph, i) => (
                          <Reveal key={i} delay={Math.min(i * 0.05, 0.2)}>
                            <div className="border-t border-[var(--color-border)] pt-6">
                              <div className="flex flex-wrap items-baseline justify-between gap-3 mb-4">
                                <h3 className="font-display text-[22px] text-[var(--color-text)]">
                                  {/* El nombre solo no deja ver que hay un orden.
                                      Si el propio nombre ya dice "Fase 2", no se
                                      repite. */}
                                  {!/^\s*fase\s*\d/i.test(ph.name) && (
                                    <span className="text-[var(--color-accent)]">
                                      {t("phase_n", { n: i + 1 })}{" "}
                                    </span>
                                  )}
                                  {ph.name}
                                </h3>
                              </div>
                              <ul className="flex flex-col gap-2.5">
                                {ph.items.map((it, j) => (
                                  <li
                                    key={j}
                                    className="flex gap-3 font-body text-[15px] leading-[1.5] text-[var(--color-text)]/85"
                                  >
                                    <span className="text-[var(--color-accent)] shrink-0">—</span>
                                    <span>{it}</span>
                                  </li>
                                ))}
                              </ul>
                            </div>
                          </Reveal>
                        ))}
                      </div>
                    </div>
                  )}
                </>
              ) : (
                // Fallback: lista de líneas (propuestas sin alcance estructurado)
                <div className="flex flex-col">
                  {items.map((item, i) => {
                    const qty =
                      typeof item.quantity === "string" ? parseFloat(item.quantity) : item.quantity;
                    return (
                      <Reveal key={item.id ?? i} delay={Math.min(i * 0.05, 0.3)}>
                        <div className="flex items-baseline justify-between gap-6 py-4 border-b border-[var(--color-border)]">
                          <div className="min-w-0">
                            <p className="font-body text-[16px] md:text-[17px] text-[var(--color-text)]">
                              {item.description}
                            </p>
                            {qty !== 1 && (
                              <p className="font-body text-[12px] text-[var(--color-text-muted)] mt-0.5">
                                {qty} × {formatEUR(item.unitPrice, locale)}
                              </p>
                            )}
                          </div>
                          <span className="font-body text-[16px] md:text-[17px] text-[var(--color-text)] tabular-nums shrink-0">
                            {formatEUR(lineTotal(item), locale)}
                          </span>
                        </div>
                      </Reveal>
                    );
                  })}
                </div>
              )}
            </section>

            {/* ── Inversión (total + plan de pago) ── */}
            <section id="inversion" className="scroll-mt-28">
              <Reveal>
                <EditorialLabel>{`// ${t("investment_label")}`}</EditorialLabel>
              </Reveal>
              <Reveal delay={0.08}>
                <MixedHeadline
                  className="text-[32px] md:text-[44px] mt-4 mb-6"
                  parts={[
                    { text: t("investment_title_1") },
                    { text: t("investment_title_accent"), accent: true },
                    { text: t("investment_title_2") },
                  ]}
                />
              </Reveal>

              {installments.length > 0 ? (
                <Reveal delay={0.1}>
                  <div className="overflow-x-auto">
                    <table className="w-full min-w-[440px] border-collapse">
                      <thead>
                        <tr className="border-b border-[var(--color-text)]/15">
                          {[t("table_concept"), t("table_amount")].map(
                            (h, i) => (
                              <th
                                key={i}
                                className={`py-3 font-body uppercase text-[10px] font-medium text-[var(--color-text-muted)] ${
                                  i === 0 ? "pr-4 text-left" : "px-3 text-right"
                                }`}
                                style={{ letterSpacing: "0.14em" }}
                              >
                                {h}
                              </th>
                            ),
                          )}
                        </tr>
                      </thead>
                      <tbody>
                        {installments.map((inst, i) => {
                          const base = Number(inst.amount) || 0;
                          // La etiqueta ya dice cuándo se paga ("50% Fase 1, al
                          // aceptar"). Numerarla además como "Pago 1" hace que el
                          // cliente cuente pagos en vez de leer el calendario.
                          const label = inst.label.replace(/^\s*pago\s*\d+\s*[·:.-]\s*/i, "");
                          return (
                            <tr key={inst.id ?? i} className="border-b border-[var(--color-border)]">
                              <td className="py-4 pr-4">
                                <span className="font-body text-[15px] text-[var(--color-text)]">
                                  {label}
                                </span>
                              </td>
                              <td className="py-4 pl-3 text-right font-body text-[15px] text-[var(--color-text)] tabular-nums">
                                {formatEUR(base, locale)}
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>

                  {/* Añadidos opcionales antes del total: al marcarlos, la
                      cifra de abajo se mueve sola. */}
                  <ProposalExtras />

                  {/* Total del proyecto — barra carmín (estilo PDF) */}
                  <ProposalTotalBar baseSum={baseSum} taxRate={IVA} />
                  <p className="font-body text-[13px] leading-[1.55] text-[var(--color-text)]/75 mt-4 max-w-[620px]">
                    {t("pay_today")}
                  </p>
                  <p className="font-body text-[12px] text-[var(--color-text-muted)]/80 mt-2">
                    {t("plan_note")}
                  </p>
                </Reveal>
              ) : (
                <Reveal delay={0.1}>
                  <div>
                    <p
                      className="font-body uppercase text-[11px] text-[var(--color-text-muted)]"
                      style={{ letterSpacing: "0.18em" }}
                    >
                      {t("total")}
                    </p>
                    <p className="font-display text-[52px] md:text-[68px] leading-none text-[var(--color-accent)] tabular-nums mt-2">
                      {formatEUR(proposal.total, locale)}
                    </p>
                    <p className="font-body text-[12px] text-[var(--color-text-muted)]/80 mt-2">
                      {t("total_note")}
                    </p>
                  </div>
                </Reveal>
              )}

              {/* Mantenimiento — se ve ANTES de aceptar, no en la 4ª factura */}
              {maintenance ? (
                <Reveal delay={0.1}>
                  <div className="mt-12 rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface-2)] p-7 md:p-9">
                    <p
                      className="font-body uppercase text-[11px] text-[var(--color-text-muted)]"
                      style={{ letterSpacing: "0.18em" }}
                    >
                      {t("maintenance_label")}
                    </p>
                    <div className="mt-3 flex flex-wrap items-baseline gap-x-3 gap-y-1">
                      <h3 className="font-display text-[24px] md:text-[30px] leading-tight text-[var(--color-text)]">
                        {t("maintenance_title", { plan: maintenance.nombre })}
                      </h3>
                      <p className="font-display text-[24px] md:text-[30px] leading-tight text-[var(--color-text)]">
                        {formatEURPrecio(maintenance.mensual, locale)}
                        <span className="font-body text-[15px] text-[var(--color-text-muted)]">
                          {t("maintenance_month")}
                        </span>
                      </p>
                    </div>
                    <p className="mt-3 font-body text-[15px] leading-[1.6] text-[var(--color-text-muted)] max-w-[600px]">
                      {maintenance.nota || t("maintenance_included")}
                    </p>
                    <ul className="mt-5 grid gap-x-8 gap-y-2 sm:grid-cols-2">
                      {maintenance.incluye.map((linea) => (
                        <li
                          key={linea}
                          className="font-body text-[14px] leading-[1.5] text-[var(--color-text)] flex gap-2.5"
                        >
                          <span aria-hidden className="text-[var(--color-accent)] mt-[2px]">
                            &#8226;
                          </span>
                          {linea}
                        </li>
                      ))}
                    </ul>
                    {/* El ahorro anual va en EUROS, nunca en porcentaje. */}
                    <p className="mt-5 font-body text-[14px] text-[var(--color-text-muted)]">
                      {t("maintenance_annual", {
                        anual: formatEURPrecio(maintenance.anual, locale),
                        ahorro: formatEURPrecio(maintenance.ahorro, locale),
                      })}
                    </p>
                  </div>
                </Reveal>
              ) : null}

              {/* Mini-FAQ — mata objeciones sin que tenga que escribirte */}
              <Reveal delay={0.12}>
                <div className="mt-12 border-t border-[var(--color-border)] pt-8">
                  <p
                    className="font-body uppercase text-[11px] text-[var(--color-text-muted)]"
                    style={{ letterSpacing: "0.18em" }}
                  >
                    {t("faq_label")}
                  </p>
                  <div className="mt-3 divide-y divide-[var(--color-border)]">
                    {(["q1", "q2", "q3", "q4"] as const).map((k) => (
                      <details key={k} className="group py-3.5">
                        <summary className="cursor-pointer list-none flex items-center justify-between gap-4 font-body text-[15px] text-[var(--color-text)]">
                          {t(`faq_${k}`)}
                          <span
                            aria-hidden
                            className="shrink-0 text-[var(--color-text-muted)] text-[18px] leading-none transition-transform duration-200 group-open:rotate-45"
                          >
                            +
                          </span>
                        </summary>
                        <p className="font-body text-[14px] text-[var(--color-text-muted)] leading-[1.6] mt-2 max-w-[640px]">
                          {t(`faq_${k}_a`)}
                        </p>
                      </details>
                    ))}
                  </div>
                </div>
              </Reveal>
            </section>

            {/* ── Empezar (formulario) ── */}
            <section id="aceptar" className="scroll-mt-28">
              <Reveal>
                <EditorialLabel>{`// ${t("accept_label")}`}</EditorialLabel>
              </Reveal>
              <Reveal delay={0.08}>
                <MixedHeadline
                  className="text-[32px] md:text-[44px] mt-4"
                  parts={[
                    { text: t("accept_title_1") },
                    { text: t("accept_title_accent"), accent: true },
                    { text: t("accept_title_2") },
                  ]}
                />
              </Reveal>

              {accepted ? (
                <Reveal delay={0.12}>
                  <div className="mt-6 rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface-2)] p-8">
                    <h3 className="font-display text-[24px] text-[var(--color-text)]">
                      {t("accepted_title")}
                    </h3>
                    <p className="font-body text-[15px] text-[var(--color-text-muted)] mt-2">
                      {t("accepted_body")}
                    </p>
                  </div>
                </Reveal>
              ) : unavailable ? (
                <Reveal delay={0.12}>
                  <div className="mt-6 rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface-2)] p-8">
                    <h3 className="font-display text-[24px] text-[var(--color-text)]">
                      {t("expired_title")}
                    </h3>
                    <p className="font-body text-[15px] text-[var(--color-text-muted)] mt-2">
                      {t("expired_body")}
                    </p>
                  </div>
                </Reveal>
              ) : (
                <Reveal delay={0.12}>
                  <p className="font-body text-[16px] leading-[1.55] text-[var(--color-text-muted)] max-w-[600px] mt-4 mb-7">
                    {t("accept_sub")}
                  </p>

                  {/* Qué pasa al aceptar — desactiva el miedo al botón */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
                    {([1, 2, 3] as const).map((n) => (
                      <div
                        key={n}
                        className="rounded-xl border border-[var(--color-border)] bg-[var(--color-surface-2)]/50 p-4"
                      >
                        <span className="font-display italic text-[20px] text-[var(--color-accent)]">
                          0{n}
                        </span>
                        <p className="font-body text-[14px] font-medium text-[var(--color-text)] mt-1.5">
                          {t(`step${n}_title`)}
                        </p>
                        <p className="font-body text-[12.5px] text-[var(--color-text-muted)] leading-[1.5] mt-1">
                          {t(`step${n}_body`)}
                        </p>
                      </div>
                    ))}
                  </div>

                  {/* La persona detrás — boutique de verdad */}
                  <div className="flex items-center gap-4 mb-8">
                    <Image
                      src="/images/antonio-bellostas-hero.jpg"
                      alt="Antonio Bellostas"
                      width={96}
                      height={96}
                      className="h-12 w-12 rounded-full object-cover border border-[var(--color-border)] shrink-0"
                    />
                    <div>
                      <p className="font-display italic text-[16px] leading-[1.45] text-[var(--color-text)]">
                        “{t("signature_line")}”
                      </p>
                      <p className="font-body text-[12px] text-[var(--color-text-muted)] mt-0.5">
                        {t("signature_name")}
                      </p>
                    </div>
                  </div>

                  <ProposalAcceptForm token={token} prefill={prefill} />
                </Reveal>
              )}
            </section>
          </div>
        </div>
      </article>

      {/* ── Prueba social — al final y a ancho completo (banda full-bleed) ── */}
      <div className="relative z-10 bg-[var(--color-surface-2)] border-t border-[var(--color-border)]">
        <ShortTestimonials />
      </div>

      {/* Footer mínimo: la página de cierre es un pasillo, no una plaza. */}
      <footer className="relative z-10 border-t border-[var(--color-border)] bg-[var(--color-bg)]">
        <div className="max-w-[1320px] mx-auto px-6 lg:px-12 py-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="font-body text-[12px] text-[var(--color-text-muted)]">
            © Bellostas Studio
          </p>
          <a
            href="mailto:info@bellostas.studio"
            className="font-body text-[13px] text-[var(--color-text)] hover:text-[var(--color-accent)] transition-colors"
          >
            {t("footer_questions")} info@bellostas.studio
          </a>
          <div className="flex items-center gap-5">
            <Link
              href="/legal"
              className="font-body text-[12px] text-[var(--color-text-muted)] hover:text-[var(--color-text)] transition-colors"
            >
              {t("footer_legal")}
            </Link>
            <Link
              href="/privacidad"
              className="font-body text-[12px] text-[var(--color-text-muted)] hover:text-[var(--color-text)] transition-colors"
            >
              {t("footer_privacy")}
            </Link>
          </div>
        </div>
      </footer>

      {/* CTA fijo en móvil: aparece tras pasar la inversión */}
      {!accepted && !unavailable && (
        <ProposalMobileCta label={t("cta_short")} />
      )}
    </ProposalExtrasProvider>
  );
}
