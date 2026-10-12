import mapa from "./dot-map-iberia.json";

/**
 * Los clientes que salen en el mapa de la home, y dónde está cada uno.
 *
 * La ciudad es la del domicilio fiscal que consta en el CRM. Solo empresas:
 * ni particulares, ni proveedores, ni clientes de marca blanca.
 *
 * Añadir un cliente: una línea en `CLIENTES` con su ciudad. Si la ciudad es
 * nueva, se añade antes a `CIUDADES` con sus coordenadas.
 */

export type Ciudad = {
  nombre: string;
  lat: number;
  lng: number;
  /** Página local a la que enlaza la ficha, si existe. */
  pagina?: "/diseno-web-huesca" | "/diseno-web-zaragoza" | "/diseno-web-teruel";
  /** Cómo se llama la capital en ese enlace: «Diseño web en Zaragoza». */
  capital?: string;
};

export const CIUDADES = {
  huesca: { nombre: "Huesca", lat: 42.1401, lng: -0.4089, pagina: "/diseno-web-huesca", capital: "Huesca" },
  zaragoza: { nombre: "Zaragoza", lat: 41.6488, lng: -0.8891, pagina: "/diseno-web-zaragoza", capital: "Zaragoza" },
  cuarte: { nombre: "Cuarte de Huerva", lat: 41.5943, lng: -0.9321, pagina: "/diseno-web-zaragoza", capital: "Zaragoza" },
  villanueva: { nombre: "Villanueva de Gállego", lat: 41.7691, lng: -0.8262, pagina: "/diseno-web-zaragoza", capital: "Zaragoza" },
  sanMateo: { nombre: "San Mateo de Gállego", lat: 41.8312, lng: -0.7663, pagina: "/diseno-web-zaragoza", capital: "Zaragoza" },
  lleida: { nombre: "Lleida", lat: 41.6176, lng: 0.62 },
  getafe: { nombre: "Getafe, Madrid", lat: 40.3057, lng: -3.7329 },
} satisfies Record<string, Ciudad>;

export type CiudadId = keyof typeof CIUDADES;

export type ClienteMapa = {
  nombre: string;
  ciudad: CiudadId;
  /** Las letras del pin. Si falta, salen del nombre. */
  sigla?: string;
};

export const CLIENTES: ClienteMapa[] = [
  // Huesca
  { nombre: "GottenGym", ciudad: "huesca", sigla: "GG" },
  { nombre: "Teleadhesivo", ciudad: "huesca" },
  { nombre: "Voluntariado de Aragón", ciudad: "huesca", sigla: "VA" },
  { nombre: "Comomelocomo", ciudad: "huesca" },
  { nombre: "Digital Green", ciudad: "huesca" },
  { nombre: "Fincas Osca", ciudad: "huesca" },
  { nombre: "AK Academy", ciudad: "huesca" },
  { nombre: "La Colmena Creativa", ciudad: "huesca", sigla: "LC" },
  // Zaragoza y alrededores
  { nombre: "Noal Design", ciudad: "zaragoza" },
  { nombre: "FADA", ciudad: "zaragoza", sigla: "FA" },
  { nombre: "Social11", ciudad: "zaragoza", sigla: "S11" },
  { nombre: "BW Fast Food", ciudad: "zaragoza", sigla: "BW" },
  { nombre: "RTBunker", ciudad: "cuarte", sigla: "RT" },
  { nombre: "Gráficas Imagen", ciudad: "villanueva" },
  { nombre: "Tajoh Guapo", ciudad: "sanMateo" },
  // Fuera de Aragón
  { nombre: "Borrell & Pinyol", ciudad: "lleida", sigla: "BP" },
  { nombre: "Obra Partner", ciudad: "getafe" },
];

/** Donde está el estudio: el pin distinto del mapa. */
export const ESTUDIO: CiudadId = "huesca";

/** Dos letras para el pin: las iniciales de las dos primeras palabras, o las dos primeras letras. */
export function siglaDe(c: ClienteMapa): string {
  if (c.sigla) return c.sigla;
  const palabras = c.nombre.split(/\s+/).filter((p) => /^[\p{L}\d]/u.test(p));
  const s = palabras.length > 1 ? palabras[0][0] + palabras[1][0] : c.nombre.slice(0, 2);
  return s.toUpperCase();
}

/**
 * De coordenadas a unidades del mapa de puntos. Es la misma proyección con la
 * que se generó `dot-map-iberia.json` (scripts/build-dot-map.mjs): si se
 * cambia una, hay que cambiar la otra.
 */
export function proyectar(lat: number, lng: number): { x: number; y: number } {
  return { x: (lng - mapa.lon0) * mapa.cos * mapa.k, y: (mapa.lat1 - lat) * mapa.k };
}

export const MAPA = mapa;
