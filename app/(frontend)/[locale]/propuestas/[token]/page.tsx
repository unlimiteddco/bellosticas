import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Clock } from "lucide-react";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { EditorialLabel } from "@/components/ui/EditorialLabel";
import { MixedHeadline } from "@/components/ui/MixedHeadline";
import { PrimaryButton } from "@/components/ui/PrimaryButton";
import { Reveal } from "@/components/ui/Reveal";
import { ShortTestimonials } from "@/components/sections/ShortTestimonials";
import { Footer } from "@/components/layout/Footer";
import { ProposalAcceptForm } from "@/components/sections/proposal/ProposalAcceptForm";
import { ProposalGreeting } from "@/components/sections/proposal/ProposalGreeting";
import { ProposalSideNav } from "@/components/sections/proposal/ProposalSideNav";
import { fetchProposal, formatEUR, lineTotal } from "@/lib/proposals";

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

  const { proposal, items, installments, expired } = data;
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

  const navSections = [
    { id: "incluye", label: t("nav_incluye") },
    { id: "inversion", label: t("nav_inversion") },
    { id: "aceptar", label: t("nav_empezar") },
  ];

  return (
    <>
      <article className="relative z-10 max-w-[1320px] mx-auto px-6 lg:px-12 pt-[150px] pb-20">
        {/* ── Hero — a ancho completo, sin tarjeta ── */}
        <header className="flex flex-col gap-6 max-w-[920px] mb-14 lg:mb-20">
          <ProposalGreeting
            greeting={
              proposal.clientName
                ? t("greeting_hello", { name: proposal.clientName })
                : t("greeting_hello_anon")
            }
            line={t("greeting_line")}
          />
          <Reveal immediate delay={0.35}>
            <EditorialLabel>{`// ${serviceKey ? t(`service.${serviceKey}`) : t("label")}`}</EditorialLabel>
          </Reveal>
          <Reveal immediate delay={0.42}>
            <h1 className="font-body font-medium tracking-tight leading-[1.04] text-[42px] md:text-[60px] lg:text-[68px] text-[var(--color-text)]">
              {proposal.title}
            </h1>
          </Reveal>
          {proposal.transformation && (
            <Reveal immediate delay={0.52}>
              <p className="font-display italic text-[22px] md:text-[28px] leading-[1.4] text-[var(--color-accent)] max-w-[760px]">
                {proposal.transformation}
              </p>
            </Reveal>
          )}
          <Reveal immediate delay={0.62}>
            <div className="flex flex-wrap items-center gap-3 mt-1">
              {proposal.timeline && (
                <span className="inline-flex items-center gap-2 rounded-full border border-[var(--color-border)] px-4 py-2 font-body text-[13px] text-[var(--color-text-muted)]">
                  <Clock size={14} className="text-[var(--color-accent)]" />
                  {proposal.timeline}
                </span>
              )}
              {!accepted && !unavailable && (
                <PrimaryButton href="#incluye" className="whitespace-nowrap">
                  {t("cta_view")}
                </PrimaryButton>
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
                                  {ph.name}
                                </h3>
                                {ph.tags && ph.tags.length > 0 && (
                                  <span
                                    className="font-body uppercase text-[10px] text-[var(--color-text-muted)]"
                                    style={{ letterSpacing: "0.14em" }}
                                  >
                                    {ph.tags.join(" · ")}
                                  </span>
                                )}
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
                  className="text-[32px] md:text-[44px] mt-4 mb-8"
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
                          {[t("table_concept"), t("table_base"), t("table_iva"), t("table_total")].map(
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
                          const iva = base * IVA;
                          const ruleLabel =
                            inst.dueRule === "date" && inst.dueDate
                              ? inst.dueDate
                              : DUE_RULES.has(inst.dueRule)
                                ? t(`dueRule.${inst.dueRule}`)
                                : inst.dueRule;
                          return (
                            <tr key={inst.id ?? i} className="border-b border-[var(--color-border)]">
                              <td className="py-4 pr-4">
                                <span className="font-body text-[15px] text-[var(--color-text)]">
                                  {inst.label}
                                </span>
                                <span
                                  className="block font-body text-[11px] uppercase text-[var(--color-text-muted)] mt-0.5"
                                  style={{ letterSpacing: "0.1em" }}
                                >
                                  {ruleLabel}
                                </span>
                              </td>
                              <td className="py-4 px-3 text-right font-body text-[15px] text-[var(--color-text-muted)] tabular-nums">
                                {formatEUR(base, locale)}
                              </td>
                              <td className="py-4 px-3 text-right font-body text-[15px] text-[var(--color-text-muted)] tabular-nums">
                                {formatEUR(iva, locale)}
                              </td>
                              <td className="py-4 pl-3 text-right font-body text-[15px] text-[var(--color-text)] tabular-nums">
                                {formatEUR(base + iva, locale)}
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>

                  {/* Total del proyecto — barra carmín (estilo PDF) */}
                  <div className="mt-4 flex flex-wrap items-center justify-between gap-3 rounded-xl bg-[var(--color-accent)] text-white px-5 py-4">
                    <span className="font-body text-[14px] font-medium">{t("table_grand_total")}</span>
                    <div className="flex items-baseline gap-5 tabular-nums">
                      <span className="hidden sm:inline font-body text-[13px] text-white/75">
                        {formatEUR(baseSum, locale)} + {formatEUR(ivaSum, locale)} IVA
                      </span>
                      <span className="font-display text-[24px]">{formatEUR(totSum, locale)}</span>
                    </div>
                  </div>
                  <p className="font-body text-[12px] text-[var(--color-text-muted)]/80 mt-3">
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
                  <ProposalAcceptForm token={token} />
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

      <Footer />
    </>
  );
}
