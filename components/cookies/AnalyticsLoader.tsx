"use client";

import { useEffect } from "react";
import { useCookieConsent } from "./CookieProvider";

/**
 * Google Consent Mode v2 — runtime updater.
 *
 * The gtag base + `consent default (denied)` + config are injected directly in
 * the root layout, so the tag loads on every page (Google can detect it) while
 * NO analytics storage fires until consent. This component only listens to the
 * cookie banner and pushes `consent update` when the visitor accepts or rejects
 * analytics — and clears the `_ga*` cookies when consent is revoked.
 */
export function AnalyticsLoader() {
  const { consent } = useCookieConsent();
  const gaId = process.env.NEXT_PUBLIC_GA4_ID;

  useEffect(() => {
    if (!gaId || typeof window === "undefined") return;

    const w = window as unknown as {
      gtag?: (...args: unknown[]) => void;
      [k: string]: unknown;
    };
    const granted = consent?.choices.analytics === true;

    if (typeof w.gtag === "function") {
      w.gtag("consent", "update", {
        analytics_storage: granted ? "granted" : "denied",
        ad_storage: "denied",
        ad_user_data: "denied",
        ad_personalization: "denied",
      });
    }

    // Hard kill-switch + cookie cleanup when consent is absent/revoked.
    w["ga-disable-" + gaId] = !granted;
    if (!granted) {
      const base = window.location.hostname.replace(/^www\./, "");
      document.cookie.split(";").forEach((c) => {
        const name = c.split("=")[0].trim();
        if (name.startsWith("_ga")) {
          document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/; domain=.${base}`;
          document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/`;
        }
      });
    }
  }, [consent, gaId]);

  return null;
}
