"use client";

import { motion } from "framer-motion";
import { useTranslations } from "next-intl";
import { useEffect, useState } from "react";
import Cal, { getCalApi } from "@calcom/embed-react";
import { EditorialLabel } from "@/components/ui/EditorialLabel";
import { MixedHeadline } from "@/components/ui/MixedHeadline";
import { buildCalAttribution } from "@/lib/tracking";

type Props = { centered?: boolean; hideHeader?: boolean };

const CAL_LINK = process.env.NEXT_PUBLIC_CAL_LINK ?? "bellostas/30min";
const CAL_NAMESPACE = process.env.NEXT_PUBLIC_CAL_NAMESPACE ?? "30min";
const CAL_ORIGIN = process.env.NEXT_PUBLIC_CAL_ORIGIN ?? "https://cal.eu";

export function BookingSection({ centered = false, hideHeader = false }: Props) {
  const t = useTranslations("contactPage.booking");

  // Read tracking identity AFTER mount so server/client render the same markup
  // first (no hydration mismatch), then enrich the embed config with metadata.
  const [attribution, setAttribution] = useState<Record<string, string>>({});
  useEffect(() => {
    setAttribution(buildCalAttribution());
  }, []);

  // Themed Cal.com embed — light variant tuned to the brand palette
  useEffect(() => {
    (async function init() {
      const cal = await getCalApi({
        namespace: CAL_NAMESPACE,
        embedJsUrl: `${CAL_ORIGIN}/embed/embed.js`,
      });
      // The Cal embed types require BOTH "light" and "dark" variants in
      // `cssVarsPerTheme` even when we force `theme: "light"`. We mirror the
      // light palette into `dark` so it stays consistent if Cal ever falls
      // back (e.g. via user OS preference if `theme` config is ignored).
      const calBrandVars = {
        "cal-brand": "#C2263A",
        "cal-text": "#1D1D1B",
        "cal-text-emphasis": "#1D1D1B",
        "cal-text-muted": "#6B6B68",
        "cal-bg": "#FDFDFB",
        "cal-bg-emphasis": "#F4F2EE",
        "cal-bg-muted": "#F4F2EE",
        "cal-border": "#E5E2DC",
        "cal-border-emphasis": "#1D1D1B",
        "cal-text-on-brand": "#FFFFFF",
      };
      cal("ui", {
        hideEventTypeDetails: false,
        layout: "month_view",
        theme: "light",
        cssVarsPerTheme: {
          light: calBrandVars,
          dark: calBrandVars,
        },
      });
    })();
  }, []);

  return (
    <section
      className={`relative z-10 max-w-[1280px] mx-auto px-6 lg:px-12 py-16 lg:py-24 ${
        centered ? "flex flex-col items-center" : ""
      }`}
    >
      {!hideHeader && (
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.7, ease: "easeOut" }}
          className={`flex flex-col gap-6 mb-12 max-w-[680px] ${
            centered ? "items-center text-center" : ""
          }`}
        >
          <EditorialLabel>{t("label")}</EditorialLabel>
          <MixedHeadline
            className="text-[36px] md:text-[48px]"
            parts={[
              { text: t("title_part1") },
              { text: t("title_emphasis"), accent: true },
              { text: t("title_part2") },
            ]}
          />
          <p className="font-body text-[16px] leading-[1.55] text-[var(--color-text-muted)] max-w-[540px]">
            {t("sub")}
          </p>
        </motion.div>
      )}

      <motion.div
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-80px" }}
        transition={{ duration: 0.7, delay: 0.1, ease: "easeOut" }}
        // No border/background/padding here — the Cal.com embed renders its own
        // card, so styling the wrapper produced a visible double border. We only
        // round + drop a soft shadow behind the embed's own card.
        className="w-full rounded-2xl overflow-hidden"
        style={{
          boxShadow: "0 24px 60px -24px rgba(29,29,27,0.16)",
        }}
        // The Cal.com embed is a cross-origin iframe that swallows wheel events,
        // which makes Lenis smooth-scroll feel "stuck" over it. Pause Lenis while
        // the pointer is over the widget so native scroll-chaining works again.
        data-lenis-prevent
        onMouseEnter={() => {
          (window as unknown as { __lenis?: { stop: () => void } }).__lenis?.stop();
        }}
        onMouseLeave={() => {
          (window as unknown as { __lenis?: { start: () => void } }).__lenis?.start();
        }}
      >
        <Cal
          namespace={CAL_NAMESPACE}
          calLink={CAL_LINK}
          calOrigin={CAL_ORIGIN}
          style={{ width: "100%", height: "auto", overflow: "visible" }}
          // Attribution (visitor_id, UTMs, click ids) goes inside `metadata`
          // so Cal.com surfaces it back in the BOOKING_CREATED webhook payload
          // under `payload.metadata`. The CRM uses it to attribute the meeting
          // to the same visitor that filled the form / browsed the site.
          config={{
            layout: "month_view",
            useSlotsViewOnSmallScreen: "true",
            metadata: attribution,
          }}
        />
      </motion.div>

      <div className="mt-6 flex items-center justify-center gap-2 text-center">
        <span className="font-body text-[13px] text-[var(--color-text-muted)]">
          {t("fallbackCta")}{" "}
          <a
            href="mailto:info@bellostas.studio"
            className="text-[var(--color-text)] underline underline-offset-2 hover:text-[var(--color-accent)] transition-colors"
          >
            info@bellostas.studio
          </a>
        </span>
      </div>
    </section>
  );
}
