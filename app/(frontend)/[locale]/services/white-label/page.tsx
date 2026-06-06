import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { Footer } from "@/components/layout/Footer";
import { WhiteLabelHero } from "@/components/sections/white-label/WhiteLabelHero";
import { WhiteLabelStats } from "@/components/sections/white-label/WhiteLabelStats";
import { WhiteLabelPillars } from "@/components/sections/white-label/WhiteLabelPillars";
import { WhiteLabelComparison } from "@/components/sections/white-label/WhiteLabelComparison";
import { WhiteLabelProcess } from "@/components/sections/white-label/WhiteLabelProcess";
import { WhiteLabelFAQ } from "@/components/sections/white-label/WhiteLabelFAQ";
import { WhiteLabelCTA } from "@/components/sections/white-label/WhiteLabelCTA";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({
    locale,
    namespace: "servicePages.whitelabel",
  });
  return {
    title: t("metaTitle"),
    description: t("metaDescription"),
  };
}

export default async function WhiteLabelPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  return (
    <>
      <WhiteLabelHero />
      <WhiteLabelStats />
      <WhiteLabelPillars />
      <WhiteLabelComparison />
      <WhiteLabelProcess />
      <WhiteLabelFAQ />
      <WhiteLabelCTA />
      <Footer />
    </>
  );
}
