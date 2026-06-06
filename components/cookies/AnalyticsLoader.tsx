"use client";

import Script from "next/script";
import { useEffect, useState } from "react";
import { useCookieConsent } from "./CookieProvider";

/**
 * Conditionally loads Google Analytics 4 when:
 *   1. `NEXT_PUBLIC_GA4_ID` is configured at build time, AND
 *   2. The user has granted analytics consent via the cookie banner.
 *
 * If the user later revokes consent, GA cookies are cleared and gtag is
 * neutralised — but the already-loaded script remains in the page until the
 * next reload. Standard for static-site GDPR setups.
 */
export function AnalyticsLoader() {
  const { consent } = useCookieConsent();
  const gaId = process.env.NEXT_PUBLIC_GA4_ID;
  const [enabled, setEnabled] = useState(false);

  useEffect(() => {
    const allowed = consent?.choices.analytics === true;
    setEnabled(allowed);

    if (!allowed && typeof window !== "undefined") {
      // Tombstone gtag and clear the _ga* cookies if consent is revoked.
      const w = window as unknown as { [k: string]: unknown };
      w["ga-disable-" + (gaId ?? "")] = true;
      document.cookie.split(";").forEach((c) => {
        const name = c.split("=")[0].trim();
        if (name.startsWith("_ga")) {
          document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/; domain=.${window.location.hostname.replace(
            /^www\./,
            "",
          )}`;
          document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/`;
        }
      });
    }
  }, [consent, gaId]);

  if (!gaId || !enabled) return null;

  return (
    <>
      <Script
        src={`https://www.googletagmanager.com/gtag/js?id=${gaId}`}
        strategy="afterInteractive"
      />
      <Script id="ga4-init" strategy="afterInteractive">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', '${gaId}', { anonymize_ip: true });
        `}
      </Script>
    </>
  );
}
