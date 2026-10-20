import type { Metadata } from "next";
import { permanentRedirect } from "next/navigation";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { SeoLocalLanding } from "@/components/sections/seo-local/SeoLocalLanding";
import { serviceSchema, faqSchema, breadcrumbSchema } from "@/lib/json-ld";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "seoLocal" });
  return {
    title: t("metaTitle"),
    description: t("metaDescription"),
  };
}

export default async function SeoLocalPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  // Servicio orientado a búsquedas en español — solo ES (como las landings locales).
  if (locale !== "es") permanentRedirect("/seo-local");

  const t = await getTranslations({ locale, namespace: "seoLocal" });
  const faqKeys = ["q1", "q2", "q3", "q4", "q5"] as const;
  const schemas = [
    serviceSchema({
      name: t("metaTitle"),
      description: t("metaDescription"),
      url: "/seo-local",
      areaServed: ["Aragón", "ES"],
      serviceType: "SEO local",
    }),
    faqSchema(
      faqKeys.map((k) => ({
        question: t(`faq.items.${k}.question`),
        answer: t(`faq.items.${k}.answer`),
      })),
    ),
    breadcrumbSchema([
      { name: "Bellostas Studio", url: "/" },
      { name: t("metaTitle"), url: "/seo-local" },
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
      <SeoLocalLanding locale={locale} />
    </>
  );
}
