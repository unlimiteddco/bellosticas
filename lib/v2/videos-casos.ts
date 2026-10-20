/**
 * El vídeo de cada caso (recorridos grabados de cada web o tienda), por slug.
 * Lo usan la página de Trabajos y las de servicio de la V2; los casos sin vídeo
 * enseñan su portada.
 */
export const VIDEO_CASO: Record<string, string> = {
  flylead: "/videos/marca.mp4",
  teleadhesivo: "/videos/ecommerce.mp4",
  "embroidery-download": "/videos/embroidery.mp4",
  "obra-partner": "/videos/obrapartner.mp4",
};

/**
 * Imágenes de casos que no están en el gestor (o no tienen portada allí): la
 * portada para su tarjeta y su página, y capturas con etiqueta (antes/después).
 */
export const IMAGENES_CASO: Record<string, { portada?: string; galeria?: { src: string; alt: string; etiqueta?: string }[] }> = {
  fada: {
    portada: "/clientes/fada-despues.jpg",
    galeria: [
      { src: "/clientes/fada-antes.jpg", alt: "La web de FADA antes del rediseño", etiqueta: "antes" },
      { src: "/clientes/fada-despues.jpg", alt: "La web de FADA después del rediseño", etiqueta: "despues" },
    ],
  },
};

/** Los proyectos con la portada que les falte puesta desde IMAGENES_CASO. */
export function conPortada<T extends { slug: string; cover?: string }>(proyectos: T[]): T[] {
  return proyectos.map((p) => (p.cover || !IMAGENES_CASO[p.slug]?.portada ? p : { ...p, cover: IMAGENES_CASO[p.slug].portada }));
}
