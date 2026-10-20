import { headers } from "next/headers";
import { getTranslations } from "next-intl/server";
import { NotFoundV2 } from "@/components/v2/NotFoundV2";

/**
 * 404 de la web, con su cabecera, pie y tema. (La de la V1 está en
 * components/sections/NotFoundV1.tsx, sin usar.)
 */
export default async function NotFound() {
  const ruta = (await headers()).get("x-pathname") ?? "/";
  const locale = /^\/en(\/|$)/.test(ruta) ? "en" : "es";
  // El título de la pestaña (la 404 no admite metadata propia).
  const t = await getTranslations({ locale, namespace: "notFound" });
  return (
    <>
      <title>{t("metaTitle")}</title>
      <NotFoundV2 ruta={ruta} locale={locale} />
    </>
  );
}
