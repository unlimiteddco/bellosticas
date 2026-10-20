import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { LegalV2 } from "@/components/v2/legal/LegalV2";

/* Texto legal en la V2: el contenido es el de la V1 (messages → legal.privacy). */
export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "legal.privacy" });
  return {
    title: `${t("metaTitle")}`,
    description: t("metaDescription"),
    robots: { index: false, follow: true },
  };
}

export default async function PrivacidadV2({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  return <LegalV2 locale={locale} doc="privacy" />;
}
