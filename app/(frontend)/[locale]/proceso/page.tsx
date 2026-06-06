import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { ProcesoHero } from "@/components/sections/proceso/ProcesoHero";
import { ProcesoAISplit } from "@/components/sections/proceso/ProcesoAISplit";
import { ProcesoPhases } from "@/components/sections/proceso/ProcesoPhases";
import { ProcesoStack } from "@/components/sections/proceso/ProcesoStack";
import { ProcesoCerca } from "@/components/sections/proceso/ProcesoCerca";
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
      <ProcesoHero />
      <ProcesoAISplit />
      <ProcesoPhases />
      <ProcesoStack />
      <ProcesoCerca />
      <CTAFinal />
      <Footer />
    </>
  );
}
