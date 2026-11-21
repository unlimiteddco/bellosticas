import type { Metadata } from "next";
import { notFound, redirect } from "next/navigation";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { defaultLocale } from "@/i18n";
import { Logo } from "@/components/ui/Logo";
import { V2Root } from "@/components/v2/V2Root";
import { ProposalExtrasProvider } from "@/components/sections/proposal/ProposalExtrasContext";
import { FirmaSuelta } from "@/components/sections/proposal/FirmaSuelta";
import { fetchProposal } from "@/lib/proposals";

/*
 * Solo la firma del contrato de una propuesta: el nombre, la rúbrica y enviar.
 *
 * Es lo que abre el QR de «firmar desde el móvil» (con ?desde=movil) y a
 * donde lleva una propuesta aceptada que quedó sin firmar. Mismo estilo que la
 * propuesta, sin nada de ella: quien llega aquí ya la ha leído. Nunca se indexa.
 */
export const dynamic = "force-dynamic";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "proposalPage" });
  return { title: t("signpage_meta"), robots: { index: false, follow: false } };
}

export default async function FirmarPropuesta({
  params,
  searchParams,
}: {
  params: Promise<{ locale: string; token: string }>;
  searchParams: Promise<{ desde?: string }>;
}) {
  const { locale, token } = await params;
  const { desde } = await searchParams;
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: "proposalPage" });

  const data = await fetchProposal(token);
  if (!data) notFound();

  // En el idioma de la propuesta, como ella.
  const idioma = data.proposal.language === "en" ? "en" : "es";
  const desdeMovil = desde === "movil";
  if (idioma !== locale) {
    const base = idioma === defaultLocale ? `/propuestas/${token}/firmar` : `/${idioma}/propuestas/${token}/firmar`;
    redirect(desdeMovil ? `${base}?desde=movil` : base);
  }

  const { proposal, prefill } = data;
  const aceptada = proposal.status === "accepted";
  const pendiente = aceptada && Boolean(proposal.contractPending);
  const enlacePropuesta = locale === defaultLocale ? `/propuestas/${token}` : `/${locale}/propuestas/${token}`;

  return (
    <V2Root>
      <ProposalExtrasProvider extras={[]} moneda={proposal.currency ?? "EUR"}>
        <div className="v2-propuesta min-h-[100dvh]">
          <header className="border-b border-[var(--v2-line)]">
            <div className="v2-frame">
              <div className="flex h-[60px] items-center justify-between gap-4 px-5 md:px-0">
                <span className="v2-solo-claro">
                  <Logo variant="black" height={20} priority />
                </span>
                <span className="v2-solo-oscuro">
                  <Logo variant="blanco-rojo" height={20} priority />
                </span>
                {proposal.clientName && (
                  <span className="truncate text-[13px] text-[var(--v2-muted)]">{proposal.clientName}</span>
                )}
              </div>
            </div>
          </header>

          <main className="mx-auto w-full max-w-[560px] px-5 pb-16 pt-10 md:pt-14">
            {pendiente ? (
              <FirmaSuelta
                token={token}
                titulo={proposal.title}
                nombreInicial={prefill?.contactName ?? ""}
                desdeMovil={desdeMovil}
              />
            ) : (
              <div>
                <span className="v2-label">{t("signpage_label")}</span>
                <h1 className="mt-4 font-display text-[28px] leading-tight text-[var(--color-text)]">
                  {aceptada ? t("signpage_nothing_title") : t("signpage_first_title")}
                </h1>
                <p className="mt-2 font-body text-[16px] leading-[1.6] text-[var(--color-text-muted)]">
                  {aceptada ? t("accepted_body") : t("signpage_first_body")}
                </p>
                <a href={enlacePropuesta} className="v2-btn v2-btn--ghost mt-7">
                  {t("signpage_back")}
                </a>
              </div>
            )}
          </main>
        </div>
      </ProposalExtrasProvider>
    </V2Root>
  );
}
