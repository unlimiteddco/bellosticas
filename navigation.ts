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
    "/diseno-web-zaragoza": "/diseno-web-zaragoza",
    "/diseno-web-huesca": "/diseno-web-huesca",
    "/diseno-web-teruel": "/diseno-web-teruel",
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
