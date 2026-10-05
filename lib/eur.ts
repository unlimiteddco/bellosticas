/**
 * Un solo formato de euros para toda la propuesta.
 *
 * Había seis copias de esta función, y todas dejaban a `Intl` decidir el
 * punto de los miles. En español `Intl` no agrupa los números de cuatro
 * cifras («5000 €»), así que la propuesta decía «5000 €» y la factura del
 * mismo trabajo, «5.000,00 €»: el mismo importe escrito de dos maneras en
 * dos documentos que el cliente compara.
 *
 * El español se compone a mano, y no con `useGrouping: "always"`, porque el
 * resultado tiene que ser idéntico en el servidor y en el navegador sea cual
 * sea su versión: si difieren, React avisa de que el HTML no coincide.
 *
 * Sin céntimos cuando el importe es redondo: «5.000 €» es un precio, y los
 * «,00» lo ensucian. `conCentimos` los fuerza donde la cifra es la de una
 * transferencia y tiene que ser exacta.
 */
export function eur(importe: number | string, locale: string, conCentimos = false): string {
  const v = typeof importe === "string" ? parseFloat(importe) : importe;
  const n = Number.isFinite(v) ? v : 0;
  const decimales = conCentimos || !Number.isInteger(Math.round(n * 100) / 100);

  if (locale === "en") {
    return new Intl.NumberFormat("en-IE", {
      style: "currency",
      currency: "EUR",
      minimumFractionDigits: decimales ? 2 : 0,
      maximumFractionDigits: 2,
    }).format(n);
  }

  const abs = Math.abs(n);
  let entero = Math.floor(abs);
  let cent = Math.round((abs - entero) * 100);
  if (cent === 100) {
    entero += 1;
    cent = 0;
  }
  const miles = String(entero).replace(/\B(?=(\d{3})+(?!\d))/g, ".");
  // Espacio de no separación: la cifra y su «€» no pueden partirse en dos líneas.
  return `${n < 0 ? "-" : ""}${miles}${decimales ? `,${String(cent).padStart(2, "0")}` : ""} €`;
}
