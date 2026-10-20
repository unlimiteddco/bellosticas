import { Crimson_Text, Geist_Mono } from "next/font/google";
import localFont from "next/font/local";
import "../globals.css";
// La hoja de la V2 va aquí y no en V2Root: la importan a la vez la 404 y las
// páginas de la V2, y en desarrollo esa doble carga hacía que el navegador la
// soltara. Todo lo de dentro va bajo .v2 / #v2-root, así que a la V1 no le afecta.
import "../v2.css";

/**
 * Frontend root layout — owns <html> and <body> for the public website.
 *
 * The app uses Next.js "multiple root layouts" via route groups:
 *   - app/(frontend)/layout.tsx  → this file, the public site (html/body/fonts)
 *   - app/(payload)/layout.tsx   → Payload admin (its own html, isolated styles)
 * There is intentionally NO app/layout.tsx — each route group provides its own
 * root so Payload's admin and the site don't share <html>/<body> or CSS.
 *
 * The `lang` starts as "es" and is corrected client-side by HtmlLangSync once
 * the locale is known (the locale lives in the [locale] segment below).
 */

const helvena = localFont({
  src: [
    {
      path: "../../public/helvena-actualizado/Helvena-Rg.woff2",
      weight: "400",
      style: "normal",
    },
    {
      path: "../../public/helvena-actualizado/Helvena-Md.woff2",
      weight: "500",
      style: "normal",
    },
    {
      path: "../../public/helvena-actualizado/Helvena-SmBd.woff2",
      weight: "600",
      style: "normal",
    },
    {
      path: "../../public/helvena-actualizado/Helvena-Bd.woff2",
      weight: "700",
      style: "normal",
    },
  ],
  variable: "--font-helvena",
  display: "swap",
  fallback: ["system-ui", "Arial", "sans-serif"],
});

const crimson = Crimson_Text({
  subsets: ["latin"],
  weight: ["400", "600"],
  style: ["normal", "italic"],
  display: "swap",
  variable: "--font-crimson",
});

// La mono es para los DATOS: años, plazos, cifras, estados, etiquetas. Los
// titulares siguen siendo de Helvena y Crimson.
const mono = Geist_Mono({
  subsets: ["latin"],
  weight: ["400", "500"],
  display: "swap",
  variable: "--font-geist-mono",
});

export default function FrontendLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es" className={`${helvena.variable} ${crimson.variable} ${mono.variable}`}>
      <body>{children}</body>
    </html>
  );
}
