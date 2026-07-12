import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { Footer } from "@/components/layout/Footer";
import { StudioHero } from "@/components/sections/studio-page/StudioHero";
import { StudioTimeline } from "@/components/sections/studio-page/StudioTimeline";
import { StudioGallery } from "@/components/sections/studio-page/StudioGallery";
import { ManifestoHorizontal } from "@/components/sections/ManifestoHorizontal";
import { StudioFuel } from "@/components/sections/studio-page/StudioFuel";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "studioPage" });
  return {
    title: t("metaTitle"),
    description: t("metaDescription"),
  };
}

export default async function StudioFullPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  return (
    <>
      <StudioHero />
      <StudioTimeline />
      <StudioGallery />
      <ManifestoHorizontal />
      <StudioFuel />
      <Footer />
    </>
  );
}
