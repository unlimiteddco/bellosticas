import { notFound } from "next/navigation";

/**
 * Cualquier dirección que no exista dentro del árbol de idiomas cae aquí y
 * muestra la 404 de la web ([locale]/not-found.tsx), con su cabecera y su pie,
 * en vez de la página genérica de Next. Las rutas de verdad tienen prioridad.
 */
export default function Resto() {
  notFound();
}
