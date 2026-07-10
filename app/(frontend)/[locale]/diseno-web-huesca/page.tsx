import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { LocalLanding } from "@/components/sections/local/LocalLanding";
import { getLocalPage } from "@/lib/local-pages";
import { serviceSchema, faqSchema, breadcrumbSchema } from "@/lib/json-ld";

const KEY = "huesca";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const config = getLocalPage(KEY);
  if (!config) return {};
  const t = await getTranslations({ locale, namespace: config.i18nNamespace });
  return {
    title: t("metaTitle"),
    description: t("metaDescription"),
  };
}

export default async function DisenoWebHuescaPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  const config = getLocalPage(KEY);
  if (!config) notFound();

  const t = await getTranslations({ locale, namespace: config.i18nNamespace });
  const schemas = [
    serviceSchema({
      name: t("metaTitle"),
      description: t("metaDescription"),
      url: `/${config.slug}`,
      areaServed: [config.city, "Aragón", "ES"],
      serviceType: "Diseño y desarrollo web",
    }),
    faqSchema(
      config.faqKeys.map((k) => ({
        question: t(`faq.items.${k}.question`),
        answer: t(`faq.items.${k}.answer`),
      })),
    ),
    breadcrumbSchema([
      { name: "Bellostas Studio", url: "/" },
      { name: t("metaTitle"), url: `/${config.slug}` },
    ]),
  ];

  return (
    <>
      {schemas.map((schema, i) =>
        schema ? (
          <script
            key={i}
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
          />
        ) : null,
      )}
      <LocalLanding config={config} locale={locale} />
    </>
  );
}
