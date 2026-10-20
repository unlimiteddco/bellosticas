import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { ServiceLanding } from "@/components/sections/service/ServiceLanding";
import { getServicePage } from "@/lib/service-pages";

const SLUG = "desarrollo-web";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const config = getServicePage(SLUG);
  if (!config) return {};
  const t = await getTranslations({ locale, namespace: config.i18nNamespace });
  return {
    title: t("metaTitle"),
    description: t("metaDescription"),
  };
}

export default async function ServiceWebPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  const config = getServicePage(SLUG);
  if (!config) notFound();

  return <ServiceLanding config={config} locale={locale} />;
}
