import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { headers } from "next/headers";
import { NextIntlClientProvider } from "next-intl";
import { getMessages, getTranslations, setRequestLocale } from "next-intl/server";
import { defaultLocale, locales, type Locale } from "@/i18n";
import { pathnames } from "@/navigation";
import { SmoothScroll } from "@/components/effects/SmoothScroll";
import { Preloader } from "@/components/effects/Preloader";
import { HtmlLangSync } from "@/components/effects/HtmlLangSync";
import { TrackingBootstrap } from "@/components/effects/TrackingBootstrap";
import { MotionProvider } from "@/components/providers/MotionProvider";
import { Navbar } from "@/components/layout/Navbar";
import { NavbarPill } from "@/components/layout/NavbarPill";
import { CookieProvider } from "@/components/cookies/CookieProvider";
import { CookieBanner } from "@/components/cookies/CookieBanner";
import { AnalyticsLoader } from "@/components/cookies/AnalyticsLoader";
import { VideoTestimonialWidget } from "@/components/floating/VideoTestimonialWidget";
import { TESTIMONIAL_MEDIA } from "@/lib/testimonial-media";

/**
 * Toggle navbar style. Both components live side-by-side so reverting is one word.
 *   "pill"    → floating glassy pill (new look)
 *   "classic" → original full-width navbar
 */
const NAVBAR_VARIANT: "pill" | "classic" = "pill";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://bellostas.studio";
const GA_ID = process.env.NEXT_PUBLIC_GA4_ID;

/**
 * Google Consent Mode v2 bootstrap. The tag loads on EVERY page (so Google can
 * detect it), but with tracking storage DENIED by default — no analytics
 * cookies fire until the visitor accepts in the cookie banner. The default is
 * read straight from the stored consent so returning visitors who already
 * accepted get `granted` immediately. `AnalyticsLoader` flips consent on change.
 */
const gaConsentBootstrap = GA_ID
  ? `window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}var a='denied';try{var r=localStorage.getItem('bellostas-cookie-consent');if(r){var p=JSON.parse(r);if(p&&p.version===1&&p.choices&&p.choices.analytics===true)a='granted';}}catch(e){}gtag('consent','default',{ad_storage:'denied',analytics_storage:a,ad_user_data:'denied',ad_personalization:'denied'});gtag('js',new Date());gtag('config','${GA_ID}',{anonymize_ip:true});`
  : "";

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

/**
 * Build per-page hreflang alternates from the requested (localized) path. Maps
 * the URL back to its internal route, then resolves each locale's path from the
 * `pathnames` map — so `/servicios/desarrollo-web` ↔ `/en/services/desarrollo-web`
 * are declared as alternates. Falls back gracefully for dynamic routes.
 */
async function buildAlternates(
  safeLocale: Locale,
): Promise<Metadata["alternates"]> {
  const requested = (await headers()).get("x-pathname") ?? "/";

  // Strip the locale prefix → localized path within the current locale.
  let external = requested;
  for (const l of locales) {
    if (external === `/${l}`) {
      external = "/";
      break;
    }
    if (external.startsWith(`/${l}/`)) {
      external = external.slice(l.length + 1) || "/";
      break;
    }
  }

  // Reverse-map the localized path to its internal route key.
  let internalKey: keyof typeof pathnames | null = null;
  for (const key of Object.keys(pathnames) as (keyof typeof pathnames)[]) {
    const value = pathnames[key];
    const localized = typeof value === "string" ? value : value[safeLocale];
    if (localized === external) {
      internalKey = key;
      break;
    }
  }

  if (!internalKey) return { canonical: requested };

  const pathFor = (loc: Locale) => {
    const value = pathnames[internalKey!];
    const p = typeof value === "string" ? value : value[loc];
    return loc === defaultLocale ? p : `/${loc}${p === "/" ? "" : p}`;
  };

  return {
    canonical: pathFor(safeLocale),
    languages: {
      es: pathFor("es"),
      en: pathFor("en"),
      "x-default": pathFor(defaultLocale),
    },
  };
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  // Fall back to default locale's metadata for invalid locale slugs (the
  // layout itself renders the 404 in that case, but generateMetadata still
  // runs for the page).
  const safeLocale = (
    locales.includes(locale as Locale) ? locale : defaultLocale
  ) as Locale;
  const t = await getTranslations({ locale: safeLocale, namespace: "meta" });

  // Per-page hreflang alternates — derive the internal route from the requested
  // (localized) pathname, then resolve each locale's URL via next-intl so the
  // language switch + search engines land on the matching page.
  const alternates = await buildAlternates(safeLocale);

  return {
    metadataBase: new URL(SITE_URL),
    title: t("title"),
    description: t("description"),
    icons: {
      icon: [
        {
          url: "/favicon-bellostas-studio.png",
          type: "image/png",
          sizes: "192x192",
        },
      ],
      shortcut: "/favicon-bellostas-studio.png",
      apple: [{ url: "/favicon-bellostas-studio.png", sizes: "192x192" }],
    },
    alternates,
    openGraph: {
      title: t("title"),
      description: t("description"),
      url: safeLocale === "es" ? SITE_URL : `${SITE_URL}/${safeLocale}`,
      siteName: "Bellostas Studio",
      locale: safeLocale === "es" ? "es_ES" : "en_US",
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: t("title"),
      description: t("description"),
    },
  };
}

/**
 * Guard that triggers Next's `notFound()` from inside the React tree.
 *
 * Why nested instead of called at the top of the layout: throwing from the
 * top would abort the locale layout before its providers are mounted, and
 * the not-found page would render without translations / context. By throwing
 * from inside `<main>`, all the wrapping providers stay in scope and the 404
 * page gets the full setup.
 */
function LocaleGuard({
  isValid,
  children,
}: {
  isValid: boolean;
  children: React.ReactNode;
}) {
  if (!isValid) notFound();
  return <>{children}</>;
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const isValidLocale = locales.includes(locale as Locale);
  // Use the requested locale when valid; fall back to default so providers
  // and the navbar still get sensible translations on the invalid-locale 404.
  const effectiveLocale = (isValidLocale ? locale : defaultLocale) as Locale;
  setRequestLocale(effectiveLocale);

  const messages = await getMessages({ locale: effectiveLocale });

  const orgJsonLd = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "Bellostas Studio",
    url: SITE_URL,
    logo: `${SITE_URL}/logos/bellostas-wordmark.svg`,
    sameAs: [],
    email: "info@bellostas.studio",
  };

  const localBusinessJsonLd = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    name: "Bellostas Studio",
    url: SITE_URL,
    image: `${SITE_URL}/logos/bellostas-wordmark.svg`,
    address: {
      "@type": "PostalAddress",
      addressLocality: "Huesca",
      addressCountry: "ES",
    },
    areaServed: ["ES", "Worldwide"],
    email: "info@bellostas.studio",
  };

  return (
    <NextIntlClientProvider messages={messages} locale={effectiveLocale}>
      {GA_ID && (
        <>
          {/* Google Consent Mode v2 — denied by default, granted on consent */}
          <script dangerouslySetInnerHTML={{ __html: gaConsentBootstrap }} />
          <script
            async
            src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`}
          />
        </>
      )}
      <CookieProvider>
        <HtmlLangSync locale={effectiveLocale} />
        <TrackingBootstrap />
        <MotionProvider>
          <Preloader />
          <SmoothScroll>
            {NAVBAR_VARIANT === "pill" ? <NavbarPill /> : <Navbar />}
            <main id="top" className="relative z-[2]">
              <LocaleGuard isValid={isValidLocale}>{children}</LocaleGuard>
            </main>
          </SmoothScroll>
        </MotionProvider>
        <CookieBanner />
        <AnalyticsLoader />
        {/* Floating video testimonial — only shows on pages that include a
            [data-video-trigger] element (home, work, service pages). */}
        <VideoTestimonialWidget
          videoSrc={TESTIMONIAL_MEDIA.javier.video}
          posterSrc={TESTIMONIAL_MEDIA.javier.poster}
        />
      </CookieProvider>

      {/* JSON-LD lives in the body — crawlers parse it from anywhere in the document. */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(orgJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(localBusinessJsonLd) }}
      />
    </NextIntlClientProvider>
  );
}
