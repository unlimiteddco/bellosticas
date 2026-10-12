import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { ProcesoContent } from "@/components/sections/proceso/ProcesoContent";
import { CTAFinal } from "@/components/sections/CTAFinal";
import { Footer } from "@/components/layout/Footer";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "proceso" });
  return {
    title: t("metaTitle"),
    description: t("metaDescription"),
  };
}

export default async function ProcesoPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  return (
    <>
      <ProcesoContent />
      <CTAFinal />
      <Footer />
    </>
  );
}
