import type { ResolvedPost, ResolvedPostSummary } from "@/lib/cms/types";

/**
 * Fallback estático del blog. El blog vive en Payload, pero —como el resto del
 * sitio (lib/projects.ts)— cae aquí cuando la CMS no está disponible, para que
 * nunca dé error ni se quede vacío. También son posts reales y útiles por si se
 * muestran.
 *
 * `content` es Lexical (SerializedEditorState). El helper `lexical()` construye
 * la forma correcta a partir de bloques simples.
 */

type Block =
  | { h: string }
  | { h3: string }
  | { p: string }
  | { ul: string[] };

const textNode = (text: string) => ({
  type: "text",
  text,
  format: 0,
  style: "",
  mode: "normal",
  detail: 0,
  version: 1,
});

const el = (type: string, children: unknown[], extra: Record<string, unknown> = {}) => ({
  type,
  format: "",
  indent: 0,
  version: 1,
  direction: "ltr",
  children,
  ...extra,
});

function lexical(blocks: Block[]): unknown {
  const children = blocks.map((b) => {
    if ("h" in b) return el("heading", [textNode(b.h)], { tag: "h2" });
    if ("h3" in b) return el("heading", [textNode(b.h3)], { tag: "h3" });
    if ("ul" in b)
      return el(
        "list",
        b.ul.map((li) => el("listitem", [textNode(li)], { value: 1 })),
        { listType: "bullet", tag: "ul", start: 1 },
      );
    return el("paragraph", [textNode(b.p)], { textFormat: 0 });
  });
  return { root: el("root", children) };
}

export const staticPosts: ResolvedPost[] = [
  {
    slug: "cuanto-cuesta-una-pagina-web",
    title: "Cuánto cuesta una página web en 2026 (y por qué los precios bailan tanto)",
    excerpt:
      "De 500 € a 30.000 € por lo que parece «lo mismo». Te explicamos de qué depende el precio real de una web y cómo saber cuánto deberías pagar tú.",
    author: "Antonio Bellostas",
    tags: ["Precios", "Diseño web", "Negocio"],
    publishedAt: "2026-06-02T09:00:00.000Z",
    seo: {
      metaTitle: "Cuánto cuesta una página web en 2026 | Bellostas Studio",
      metaDescription:
        "Guía honesta sobre el precio de una página web: de qué depende, qué incluye cada rango y cuánto deberías pagar según tu negocio.",
    },
    content: lexical([
      { p: "Si has pedido presupuesto para una web, ya lo habrás visto: una agencia te dice 3.000 €, otra 15.000 €, y un freelance de internet te lo hace por 500 €. Y ninguno te explica el porqué. Vamos a explicártelo nosotros." },
      { h: "Por qué el rango es tan amplio" },
      { p: "La mayoría de guías mezclan cosas que no se parecen en nada: plantillas de Wordpress, freelances a destajo, y estudios que diseñan a medida. Comparar sus precios es como comparar un menú del día con un restaurante con estrella: los dos «dan de comer»." },
      { p: "El precio real depende de tres cosas: quién hace el trabajo, qué entra de verdad en el proyecto, y cuánto se piensa antes de abrir el programa de diseño." },
      { h: "Qué incluye cada rango" },
      { ul: [
        "Menos de 1.000 €: plantilla montada rápido. Te vale para «estar», no para vender.",
        "3.500 – 8.000 €: web a medida de un estudio, con diseño propio, SEO base y una web que trabaja para captar clientes.",
        "15.000 € en adelante: e-commerce complejo, plataformas o aplicaciones a medida.",
      ] },
      { h: "Cuánto deberías pagar tú" },
      { p: "La pregunta correcta no es «cuánto cuesta una web», es «cuánto me cuesta NO tener una que convierta». Si tu web tiene que traerte clientes, ahorrarte en ella suele salir caro. Si solo necesitas presencia, no pagues de más." },
      { p: "En Bellostas trabajamos siempre con presupuesto cerrado: te damos el precio final tras una llamada de 20 minutos, y no cambia después." },
    ]),
  },
  {
    slug: "seo-local-para-negocios",
    title: "SEO local: cómo aparecer en Google en cada pueblo donde trabajas",
    excerpt:
      "Si eres cerrajero, reformista o tienes una clínica, el SEO local es la forma más barata de que te encuentren. Te contamos cómo funciona.",
    author: "Antonio Bellostas",
    tags: ["SEO", "SEO local", "Captación"],
    publishedAt: "2026-05-18T09:00:00.000Z",
    seo: {
      metaTitle: "SEO local: aparece en Google en tu zona | Bellostas Studio",
      metaDescription:
        "Cómo funciona el SEO local para negocios de servicios, cuánto tarda en dar resultados y qué necesitas para empezar.",
    },
    content: lexical([
      { p: "El SEO local es lo que hace que, cuando alguien busca «cerrajero en [tu pueblo]», salgas tú y no la competencia. Y en pueblos y ciudades pequeñas, la competencia digital es casi inexistente: es dinero en el suelo esperando a que alguien lo recoja." },
      { h: "Cómo funciona" },
      { p: "Se trata de crear una página específica y bien optimizada para cada localidad donde trabajas, con contenido propio, SEO técnico y tu ficha de Google a punto. Google entiende que eres el negocio de referencia de esa zona y te muestra arriba." },
      { h: "Cuánto tarda" },
      { p: "No es inmediato: entre 3 y 9 meses para posicionarte de forma estable, según la competencia. Pero una vez arriba, es un activo que te trae clientes solo, mes tras mes." },
      { h: "Qué necesitas para empezar" },
      { ul: [
        "Saber en qué localidades quieres aparecer.",
        "Un teléfono donde atender a los clientes que lleguen.",
        "Paciencia los primeros meses: el SEO es una carrera de fondo, no un sprint.",
      ] },
      { p: "Si quieres ver cuánto costaría en tu caso, tenemos un configurador que te da precio y estimación de resultados en un minuto." },
    ]),
  },
  {
    slug: "web-hecha-con-ia-vs-estudio",
    title: "Web hecha con IA vs. estudio de verdad: la diferencia que sí importa",
    excerpt:
      "Cualquiera puede generar una web con IA en 10 minutos. Por eso el criterio importa más que nunca, no menos. Te explicamos la diferencia.",
    author: "Antonio Bellostas",
    tags: ["IA", "Diseño", "Estrategia"],
    publishedAt: "2026-04-30T09:00:00.000Z",
    seo: {
      metaTitle: "Web con IA vs. estudio: la diferencia real | Bellostas Studio",
      metaDescription:
        "La IA hizo el trabajo mediocre más rápido, no mejor. Por qué el criterio de un estudio marca la diferencia en tu web.",
    },
    content: lexical([
      { p: "En 2026 cualquiera puede pedirle a una IA un logo, una landing o un mockup en minutos. El problema es que casi todo sale igual: correcto, genérico y olvidable. Por eso el criterio importa hoy más que nunca, no menos." },
      { h: "Nosotros usamos IA. A saco." },
      { p: "No estamos en contra de la IA, la usamos todos los días para ir más rápido y explorar más ideas. La diferencia es quién toma la decisión final: una persona con criterio que sabe qué conservar, qué cambiar y qué hará que tu negocio parezca más valioso." },
      { h: "Lo que la IA no te da" },
      { ul: [
        "Estrategia: entender tu negocio antes de diseñar nada.",
        "Criterio: saber qué de todo lo que genera la IA es bueno de verdad.",
        "Responsabilidad: alguien al otro lado que responde por el resultado.",
      ] },
      { p: "Más producción no sirve de nada sin mejores decisiones. Ese es el estándar detrás de Bellostas Studio." },
    ]),
  },
];

export function getStaticPosts(): ResolvedPostSummary[] {
  return staticPosts.map(({ content: _content, seo: _seo, ...summary }) => summary);
}

export function getStaticPostBySlug(slug: string): ResolvedPost | null {
  return staticPosts.find((p) => p.slug === slug) ?? null;
}

export function getStaticPostSlugs(): string[] {
  return staticPosts.map((p) => p.slug);
}
