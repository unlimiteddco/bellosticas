/**
 * Genera el mapa de puntos de la península para <ClientsMap>.
 *
 *   node scripts/build-dot-map.mjs
 *
 * Recorre una rejilla y se queda con los puntos que caen en tierra, marcando
 * cuáles son España. El resultado se guarda en lib/dot-map-iberia.json y se
 * versiona: la web NO necesita estas dependencias (world-atlas, d3-geo) en
 * producción, solo el JSON. Solo hay que volver a ejecutarlo si se cambia el
 * encuadre o la densidad de la rejilla.
 *
 * Una fila es un texto con un carácter por punto: "." mar, "1" España,
 * "2" resto de tierra. Comprimido al servirse, todo el mapa pesa unos pocos KB.
 */
import { readFileSync, writeFileSync } from "node:fs";
import { createRequire } from "node:module";
import { feature } from "topojson-client";
import { geoContains, geoBounds } from "d3-geo";

const require = createRequire(import.meta.url);
const topo = JSON.parse(readFileSync(require.resolve("world-atlas/countries-50m.json"), "utf8"));

// El encuadre: mucho más ancho que la península. El mar no pesa (no tiene
// puntos) y así, con el mapa alejado del todo en una pantalla apaisada, se ve
// la silueta entera sin que asome el borde. Lo de alrededor —Francia, el norte
// de África, un trozo de Italia— está para que se reconozca.
const LON0 = -17, LON1 = 10.5, LAT0 = 34.2, LAT1 = 45.6;
// Proyección plana corregida a 40° N: a esta escala no se distingue de una
// Mercator y se invierte con una resta. Tiene que coincidir con lib/client-map.ts.
const COS = Math.cos((40 * Math.PI) / 180);
// Unidades del mapa por grado de latitud.
const K = 87;
const ANCHO = Math.round((LON1 - LON0) * COS * K);
const ALTO = Math.round((LAT1 - LAT0) * K);
// Rejilla fina: un punto cada 3,8 km. El mapa NO los pinta todos a la vez
// —de lejos coge uno de cada dos, cuatro u ocho— para que al acercarse sigan
// apareciendo puntos nuevos en vez de quedarse cuatro puntos gordos.
const PASO = 3;

const paises = feature(topo, topo.objects.countries).features.filter((f) => {
  const [[x0, y0], [x1, y1]] = geoBounds(f);
  // Francia cruza el antimeridiano por sus territorios: su caja sale «al revés».
  const cruza = x0 > x1;
  return (cruza || (x1 >= LON0 && x0 <= LON1)) && y1 >= LAT0 && y0 <= LAT1;
});
const espana = paises.find((f) => f.id === "724");
const resto = paises.filter((f) => f.id !== "724");

// La caja de cada país primero: preguntar «¿está dentro?» a un polígono de
// miles de vértices es lo caro, y la mayoría de puntos ni se le acercan.
const caja = (f) => {
  const [[x0, y0], [x1, y1]] = geoBounds(f);
  return x0 > x1 ? () => true : ([x, y]) => x >= x0 && x <= x1 && y >= y0 && y <= y1;
};
const enEspana = caja(espana);
const cajas = resto.map((f) => [f, caja(f)]);

const filas = [];
let nEs = 0, nOtros = 0;
for (let y = PASO / 2; y < ALTO; y += PASO) {
  let fila = "";
  for (let x = PASO / 2; x < ANCHO; x += PASO) {
    const p = [LON0 + x / K / COS, LAT1 - y / K];
    if (enEspana(p) && geoContains(espana, p)) { fila += "1"; nEs++; }
    else if (cajas.some(([f, dentro]) => dentro(p) && geoContains(f, p))) { fila += "2"; nOtros++; }
    else fila += ".";
  }
  filas.push(fila);
}

const salida = { lon0: LON0, lat1: LAT1, cos: COS, k: K, ancho: ANCHO, alto: ALTO, paso: PASO, filas };
writeFileSync(new URL("../lib/dot-map-iberia.json", import.meta.url), JSON.stringify(salida));
console.log(`${ANCHO}×${ALTO} · ${nEs} puntos de España, ${nOtros} del resto · ${paises.map((p) => p.properties.name).join(", ")}`);
