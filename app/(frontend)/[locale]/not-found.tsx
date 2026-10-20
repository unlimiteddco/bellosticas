import { headers } from "next/headers";
import { getTranslations } from "next-intl/server";
import { NotFoundV1 } from "@/components/sections/NotFoundV1";
import { NotFoundV2 } from "@/components/v2/NotFoundV2";

/**
 * 404. En las rutas de la V2 (/v2, /en/v2) sale la suya, con su cabecera,
 * pie y tema; en el resto, la de siempre. Cuando la V2 pase a ser la web,
 * se queda solo la segunda.
 */
export default async function NotFound() {
  const ruta = (await headers()).get("x-pathname") ?? "/";
  const locale = /^\/en(\/|$)/.test(ruta) ? "en" : "es";
  // El título de la pestaña (la 404 no admite metadata propia).
  const titulo = <title>{(await getTranslations({ locale, namespace: "notFound" }))("metaTitle")}</title>;
  if (/^(\/en)?\/v2(\/|$)/.test(ruta)) {
    return (
      <>
        {titulo}
        <NotFoundV2 ruta={ruta} locale={locale} />
      </>
    );
  }
  return (
    <>
      {titulo}
      <NotFoundV1 />
    </>
  );
}
