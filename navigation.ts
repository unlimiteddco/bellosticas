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
 */
export const routing = defineRouting({
  locales,
  defaultLocale,
  localePrefix: "as-needed",
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
