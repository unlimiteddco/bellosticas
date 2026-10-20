import type { Metadata } from "next";
import { notFound, permanentRedirect } from "next/navigation";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { getLocalPage } from "@/lib/local-pages";
import { LocalV2 } from "@/components/v2/local/LocalV2";

/* «Diseño web en Huesca», en la V2. Solo en español, como la de la V1. Oculta como el resto de la V2. */
const CLAVE = "huesca";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const config = getLocalPage(CLAVE);
  if (!config) return {};
  const t = await getTranslations({ locale, namespace: config.i18nNamespace });
  const tv = await getTranslations({ locale, namespace: `v2Local.${CLAVE}` });
  return {
    title: `${t("metaTitle")} · V2`,
    description: tv("metaDescription"),
    robots: { index: false, follow: false },
  };
}

export default async function DisenoWebHuescaV2({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const config = getLocalPage(CLAVE);
  if (!config) notFound();
  // La búsqueda es española: /en/... va a la versión en español.
  if (locale !== "es") permanentRedirect(`/v2/${config.slug}`);
  return <LocalV2 config={config} locale={locale} />;
}
