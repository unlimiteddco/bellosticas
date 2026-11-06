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
  "vestuario-3d": "/videos/vestuario.mp4",
};

/**
 * Imágenes de casos hechas para la web (mockups) o que no están en el gestor:
 * la portada para su tarjeta y su página, y las capturas de la galería (con
 * etiqueta antes/después si la llevan). Si `manda`, la portada sustituye a la
 * del gestor; si no, solo se usa cuando el gestor no tiene ninguna.
 */
export const IMAGENES_CASO: Record<
  string,
  {
    portada?: string;
    manda?: boolean;
    galeria?: { src: string; alt: string; etiqueta?: string }[];
    /** La tira de «Cómo se hizo», si el caso la tiene. */
    proceso?: { src: string; alt: string };
  }
> = {
  "vestuario-3d": {
    portada: "/clientes/vestuario-mockup-portada.webp",
    manda: true,
    galeria: [
      { src: "/clientes/vestuario-mockup-portada.webp", alt: "El vestuario del Huesca en 3D: la ficha de un jugador en el ordenador y el personalizador en el móvil" },
      { src: "/clientes/vestuario-barra.webp", alt: "La barra del vestuario con una percha por jugador; al pasar el ratón, la camiseta sale hacia delante" },
      { src: "/clientes/vestuario-portero.webp", alt: "La camiseta del portero abierta, con la ficha del jugador y sus estadísticas" },
      { src: "/clientes/vestuario-mockup-personaliza.webp", alt: "El personalizador: tu nombre y tu dorsal en la camiseta, con la talla, listos para la tienda oficial" },
      { src: "/clientes/vestuario-mockup-moviles.webp", alt: "El vestuario en el móvil: la barra, la ficha y el personalizador" },
      { src: "/clientes/vestuario-convocatoria.webp", alt: "La convocatoria: se eligen los jugadores y el partido y se descarga un vídeo vertical para redes" },
    ],
    proceso: {
      src: "/clientes/vestuario-proceso.webp",
      alt: "Del producto a la percha: la foto de la tienda, la textura sacada de ella, la tela simulada en Blender, su malla y la camiseta final en el navegador",
    },
  },
  fada: {
    portada: "/clientes/fada-mockup-portada.webp",
    manda: true,
    galeria: [
      { src: "/clientes/fada-antes.jpg", alt: "La web de FADA antes del rediseño", etiqueta: "antes" },
      { src: "/clientes/fada-mockup-portada.webp", alt: "La web de FADA después del rediseño, en ordenador y móvil", etiqueta: "despues" },
      { src: "/clientes/fada-mockup-calendario.webp", alt: "FADA: el calendario de la temporada con filtros por campeonato" },
      { src: "/clientes/fada-mockup-rallyes.webp", alt: "FADA: la página del Campeonato de Aragón de Rallyes" },
      { src: "/clientes/fada-mockup-moviles.webp", alt: "FADA en el móvil: calendario, portada y rallyes" },
    ],
  },
  "borrell-pinol": {
    portada: "/clientes/borrell-mockup-portada.webp",
    manda: true,
    // Sin la portada: ya sale en grande arriba del caso.
    galeria: [
      { src: "/clientes/borrell-mockup-productos.webp", alt: "Borrell & Piñol: la página del seguro de coche" },
      { src: "/clientes/borrell-mockup-nosotros.webp", alt: "Borrell & Piñol: «Sobre nosotros»" },
      { src: "/clientes/borrell-mockup-moviles.webp", alt: "Borrell & Piñol en el móvil" },
    ],
  },
};

/** Los proyectos con la portada de IMAGENES_CASO puesta (si les falta o si manda). */
export function conPortada<T extends { slug: string; cover?: string }>(proyectos: T[]): T[] {
  return proyectos.map((p) => {
    const extra = IMAGENES_CASO[p.slug];
    if (!extra?.portada || (p.cover && !extra.manda)) return p;
    return { ...p, cover: extra.portada };
  });
}

/**
 * Cómo recortar una imagen de caso en su marco: los mockups van centrados (la
 * composición está pensada para aguantar el recorte a 4:3); las capturas
 * sueltas, desde arriba a la izquierda, donde está la cabecera de la web.
 */
export function encuadre(src?: string) {
  return src?.includes("-mockup-") ? "object-center" : "object-left-top";
}
