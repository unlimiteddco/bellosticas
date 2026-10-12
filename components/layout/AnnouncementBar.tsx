import { headers } from "next/headers";
import { getTranslations } from "next-intl/server";
import { AnnouncementBarClient } from "./AnnouncementBarClient";

/**
 * La barra de novedades: una línea encima del menú con UNA noticia.
 *
 * Para cambiar de noticia: textos en `announcement` (messages/es.json y
 * en.json) y, sobre todo, un `AVISO_ID` nuevo. El id es lo que recuerda el
 * navegador de quien la cerró: con el mismo id, quien cerró la anterior no
 * vería la nueva. Para quitarla del todo, `AVISO_ACTIVO = false`.
 */
const AVISO_ACTIVO = true;
const AVISO_ID = "flylead-2026-10";
const AVISO_URL = "https://flylead.es";
/** Alto de la barra en px. El menú flotante baja exactamente esto. */
const ALTO = 40;
const CLAVE = "bellostas-aviso-cerrado";

/** Donde no pinta nada: la propuesta es un pasillo de cierre, sin distracciones. */
const SIN_AVISO = ["/propuestas/", "/preview", "/intro"];

export async function AnnouncementBar({ locale }: { locale: string }) {
  if (!AVISO_ACTIVO) return null;
  const ruta = (await headers()).get("x-pathname") ?? "/";
  if (SIN_AVISO.some((p) => ruta.includes(p))) return null;

  const t = await getTranslations({ locale, namespace: "announcement" });

  return (
    <>
      {/* La barra va en el flujo de la página (empuja el contenido, no lo tapa)
          y el menú, que es fijo, lee `--aviso-h` para ponerse debajo.
          Quien ya la cerró no debe verla ni un instante: por eso se decide con
          un script en línea, antes del primer pintado, y no al hidratar. */}
      <style>{`:root{--aviso-h:${ALTO}px}html[data-aviso-cerrado]{--aviso-h:0px}html[data-aviso-cerrado] [data-aviso]{display:none}`}</style>
      <script
        dangerouslySetInnerHTML={{
          __html: `try{if(localStorage.getItem(${JSON.stringify(CLAVE)})===${JSON.stringify(AVISO_ID)})document.documentElement.setAttribute("data-aviso-cerrado","")}catch(e){}`,
        }}
      />
      <AnnouncementBarClient
        id={AVISO_ID}
        clave={CLAVE}
        alto={ALTO}
        url={AVISO_URL}
        sinAviso={SIN_AVISO}
        textos={{
          etiqueta: t("badge"),
          texto: t("text"),
          cerrar: t("close"),
        }}
      />
    </>
  );
}
