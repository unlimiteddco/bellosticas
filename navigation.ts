import { defineRouting } from "next-intl/routing";
import { createNavigation } from "next-intl/navigation";
import { locales, defaultLocale } from "./i18n";

/**
 * next-intl routing with LOCALIZED pathnames. The folder structure stays in the
 * canonical (internal) names — e.g. `app/[locale]/contact` — and next-intl
 * serves them under the localized external paths below (e.g. `/contacto` in ES).
 *
 * Using `defineRouting` (which knows the defaultLocale) means `as-needed` drops
 * the prefix for the default locale, so ES links render `/servicios/…`, not
 * `/es/servicios/…`.
 *
 * `localeDetection: false` — el idioma lo manda SOLO la URL. Por defecto
 * next-intl mira la cabecera `Accept-Language`, así que un móvil con Chrome en
 * inglés entraba a bellostas.studio y era redirigido (307) a /en, aunque la
 * SERP mostrase la página en español. La web debe servirse siempre en español
 * salvo que el visitante cambie de idioma, y el selector navega por URL
 * (`router.replace(..., { locale })`), así que sigue funcionando.
 */
export const routing = defineRouting({
  locales,
  defaultLocale,
  localePrefix: "as-needed",
  localeDetection: false,
  pathnames: {
    "/": "/",
    "/services": { es: "/servicios", en: "/services" },
    "/services/brand-identity": { es: "/servicios/identidad-de-marca", en: "/services/brand-identity" },
    "/services/desarrollo-web": { es: "/servicios/desarrollo-web", en: "/services/desarrollo-web" },
    "/services/ecommerce": { es: "/servicios/ecommerce", en: "/services/ecommerce" },
    "/services/seo-aeo": { es: "/servicios/seo-aeo", en: "/services/seo-aeo" },
    "/services/aplicaciones-web": { es: "/servicios/aplicaciones-web", en: "/services/aplicaciones-web" },
    "/services/automatizaciones": { es: "/servicios/automatizaciones", en: "/services/automatizaciones" },
    "/services/migraciones": { es: "/servicios/migraciones", en: "/services/migraciones" },
    "/services/white-label": { es: "/servicios/white-label", en: "/services/white-label" },
    "/pricing": { es: "/precios", en: "/pricing" },
    // La versión A de precios, guardada (sin enlaces desde la web y sin indexar).
    "/pricing-a": { es: "/precios-a", en: "/pricing-a" },
    "/work": { es: "/trabajos", en: "/work" },
    "/work/[slug]": { es: "/trabajos/[slug]", en: "/work/[slug]" },
    "/clients": { es: "/clientes", en: "/clients" },
    "/studio": { es: "/estudio", en: "/studio" },
    "/proceso": "/proceso",
    "/contact": { es: "/contacto", en: "/contact" },
    "/intro": "/intro",
    "/blog": "/blog",
    "/blog/[slug]": "/blog/[slug]",
    "/legal": "/legal",
    "/privacidad": "/privacidad",
    "/cookies": "/cookies",
    "/diseno-web-zaragoza": "/diseno-web-zaragoza",
    "/diseno-web-huesca": "/diseno-web-huesca",
    "/diseno-web-teruel": "/diseno-web-teruel",
    // Landings de recursos y propuestas (sin indexar).
    "/g/[slug]": "/g/[slug]",
    "/propuestas/[token]": "/propuestas/[token]",
    // De la V1: ya no tienen página y redirigen (next.config.ts). Se quedan
    // aquí solo porque algún componente antiguo aún los enlaza.
    "/love": "/love",
    "/seo-local": "/seo-local",
    "/preview": "/preview",
  },
});

export const pathnames = routing.pathnames;
export const localePrefix = routing.localePrefix;

export const { Link, redirect, usePathname, useRouter, getPathname } =
  createNavigation(routing);
