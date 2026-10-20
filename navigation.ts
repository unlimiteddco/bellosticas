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
    "/work": "/work",
    "/studio": "/studio",
    "/love": "/love",
    "/blog": "/blog",
    "/blog/[slug]": "/blog/[slug]",
    "/intro": "/intro",
    "/proceso": "/proceso",
    "/legal": "/legal",
    "/cookies": "/cookies",
    "/privacidad": "/privacidad",
    "/preview": "/preview",
    // La V2 de la web, oculta (noindex) mientras se compara con la actual.
    "/v2": "/v2",
    "/v2/contact": { es: "/v2/contacto", en: "/v2/contact" },
    "/v2/proceso": "/v2/proceso",
    "/v2/work": { es: "/v2/trabajos", en: "/v2/work" },
    "/v2/clients": { es: "/v2/clientes", en: "/v2/clients" },
    "/v2/studio": { es: "/v2/estudio", en: "/v2/studio" },
    "/v2/intro": "/v2/intro",
    "/v2/blog": "/v2/blog",
    "/v2/g/[slug]": "/v2/g/[slug]",
    "/v2/propuestas/[token]": "/v2/propuestas/[token]",
    "/v2/blog/[slug]": "/v2/blog/[slug]",
    "/v2/legal": "/v2/legal",
    "/v2/privacidad": "/v2/privacidad",
    "/v2/cookies": "/v2/cookies",
    "/v2/work/[slug]": { es: "/v2/trabajos/[slug]", en: "/v2/work/[slug]" },
    "/v2/pricing": { es: "/v2/precios", en: "/v2/pricing" },
    // La versión A de precios, guardada (sin enlaces desde la web).
    "/v2/pricing-a": { es: "/v2/precios-a", en: "/v2/pricing-a" },
    "/v2/services": { es: "/v2/servicios", en: "/v2/services" },
    "/v2/services/brand-identity": { es: "/v2/servicios/identidad-de-marca", en: "/v2/services/brand-identity" },
    "/v2/services/desarrollo-web": { es: "/v2/servicios/desarrollo-web", en: "/v2/services/desarrollo-web" },
    "/v2/services/ecommerce": { es: "/v2/servicios/ecommerce", en: "/v2/services/ecommerce" },
    "/v2/services/aplicaciones-web": { es: "/v2/servicios/aplicaciones-web", en: "/v2/services/aplicaciones-web" },
    "/v2/services/automatizaciones": { es: "/v2/servicios/automatizaciones", en: "/v2/services/automatizaciones" },
    "/v2/services/migraciones": { es: "/v2/servicios/migraciones", en: "/v2/services/migraciones" },
    "/v2/services/white-label": { es: "/v2/servicios/white-label", en: "/v2/services/white-label" },
    "/v2/services/seo-aeo": { es: "/v2/servicios/seo-aeo", en: "/v2/services/seo-aeo" },
    "/v2/diseno-web-zaragoza": "/v2/diseno-web-zaragoza",
    "/v2/diseno-web-huesca": "/v2/diseno-web-huesca",
    "/v2/diseno-web-teruel": "/v2/diseno-web-teruel",
    "/diseno-web-zaragoza": "/diseno-web-zaragoza",
    "/diseno-web-huesca": "/diseno-web-huesca",
    "/diseno-web-teruel": "/diseno-web-teruel",
    "/seo-local": "/seo-local",
    "/contact": { es: "/contacto", en: "/contact" },
    "/services/desarrollo-web": {
      es: "/servicios/desarrollo-web",
      en: "/services/desarrollo-web",
    },
    "/services/aplicaciones-web": {
      es: "/servicios/aplicaciones-web",
      en: "/services/aplicaciones-web",
    },
    "/services/ecommerce": {
      es: "/servicios/ecommerce",
      en: "/services/ecommerce",
    },
    "/services/migraciones": {
      es: "/servicios/migraciones",
      en: "/services/migraciones",
    },
    "/services/automatizaciones": {
      es: "/servicios/automatizaciones",
      en: "/services/automatizaciones",
    },
    "/services/white-label": {
      es: "/servicios/white-label",
      en: "/services/white-label",
    },
  },
});

export const pathnames = routing.pathnames;
export const localePrefix = routing.localePrefix;

export const { Link, redirect, usePathname, useRouter, getPathname } =
  createNavigation(routing);
