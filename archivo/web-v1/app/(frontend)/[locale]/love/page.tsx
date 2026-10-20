import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { Footer } from "@/components/layout/Footer";
import { LoveHero } from "@/components/sections/love-page/LoveHero";
import { LoveFeaturedVideos } from "@/components/sections/love-page/LoveFeaturedVideos";
import { LoveNumbers } from "@/components/sections/love-page/LoveNumbers";
import { LoveMosaic } from "@/components/sections/love-page/LoveMosaic";
import { LoveResults } from "@/components/sections/love-page/LoveResults";
import { LoveGoogle } from "@/components/sections/love-page/LoveGoogle";
import { LoveCTA } from "@/components/sections/love-page/LoveCTA";
import { getProjects } from "@/lib/cms/projects";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "lovePage" });
  return {
    title: t("metaTitle"),
    description: t("metaDescription"),
  };
}

export default async function LovePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  const projects = await getProjects(locale);

  return (
    <>
      <LoveHero />
      <LoveFeaturedVideos />
      <LoveNumbers />
      <LoveMosaic />
      <LoveResults projects={projects} />
      <LoveGoogle />
      <LoveCTA />
      <Footer />
    </>
  );
}
