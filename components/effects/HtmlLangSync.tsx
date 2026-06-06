"use client";

import { useEffect } from "react";

/**
 * Updates `document.documentElement.lang` once the locale is known.
 *
 * The root `app/layout.tsx` hardcodes `lang="es"` because it can't access
 * route params. This client effect overrides it after hydration so the
 * attribute reflects the actual locale. SEO crawlers also see `hreflang`
 * tags in the head, so initial-paint lang isn't critical for ranking.
 */
export function HtmlLangSync({ locale }: { locale: string }) {
  useEffect(() => {
    if (typeof document !== "undefined") {
      document.documentElement.lang = locale;
    }
  }, [locale]);
  return null;
}
