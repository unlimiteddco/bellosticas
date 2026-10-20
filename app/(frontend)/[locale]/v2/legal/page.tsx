import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { LegalV2 } from "@/components/v2/legal/LegalV2";

/* Texto legal en la V2: el contenido es el de la V1 (messages → legal.notice). Oculto como el resto de la V2. */
export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "legal.notice" });
  return {
    title: `${t("metaTitle")} · V2`,
    description: t("metaDescription"),
    robots: { index: false, follow: false },
  };
}

export default async function AvisoLegalV2({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  return <LegalV2 locale={locale} doc="notice" />;
}
