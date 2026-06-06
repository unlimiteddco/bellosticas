import { Crimson_Text } from "next/font/google";
import localFont from "next/font/local";
import "../globals.css";

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

export default function FrontendLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es" className={`${helvena.variable} ${crimson.variable}`}>
      <body>{children}</body>
    </html>
  );
}
