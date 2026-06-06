import { getTranslations } from "next-intl/server";
import { Footer } from "@/components/layout/Footer";
import { EditorialLabel } from "@/components/ui/EditorialLabel";
import { LegalTOC } from "./LegalTOC";
import { LegalSection } from "./LegalSection";
import { CookieSettingsButton } from "./CookieSettingsButton";
import type { LegalContent, Section } from "./types";

type Props = {
  /** Translation namespace, e.g. "legal.notice" / "legal.privacy" / "legal.cookies" */
  namespace: string;
  locale: string;
  /** When true, renders an "Open cookie settings" button before the back-to-top link */
  showCookieButton?: boolean;
};

export async function LegalPage({ namespace, locale, showCookieButton }: Props) {
  const tPage = await getTranslations({ locale, namespace });
  const tCommon = await getTranslations({ locale, namespace: "legal.common" });

  const content: LegalContent = {
    label: tPage("label"),
    title: tPage("title"),
    intro: tPage("intro"),
    sections: tPage.raw("sections") as Section[],
  };

  return (
    <>
      <article className="relative z-10 max-w-[1280px] mx-auto px-6 lg:px-12 pt-[160px] pb-24">
        {/* Hero */}
        <header className="flex flex-col gap-5 max-w-[820px] mb-12 lg:mb-16">
          <EditorialLabel>{content.label}</EditorialLabel>
          <h1 className="font-display italic text-[44px] md:text-[64px] lg:text-[72px] leading-[1.05] tracking-tight text-[var(--color-text)]">
            {content.title}
          </h1>
          <p className="font-body text-[16px] lg:text-[18px] leading-[1.65] text-[var(--color-text-muted)] max-w-[680px]">
            {content.intro}
          </p>
          <div
            className="font-body uppercase text-[11px] text-[var(--color-text-muted)] mt-2"
            style={{ letterSpacing: "0.18em" }}
          >
            {tCommon("lastUpdatedLabel")} · {tCommon("lastUpdated")}
          </div>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12">
          {/* Sticky TOC */}
          <aside className="lg:col-span-3 lg:sticky lg:top-32 self-start order-2 lg:order-1">
            <LegalTOC
              label={tCommon("tocLabel")}
              sections={content.sections.map((s) => ({ id: s.id, title: s.title }))}
            />
          </aside>

          {/* Sections */}
          <div className="lg:col-span-9 order-1 lg:order-2 flex flex-col gap-12">
            {content.sections.map((section) => (
              <LegalSection key={section.id} section={section} />
            ))}

            {showCookieButton && (
              <div className="mt-2">
                <CookieSettingsButton label={tCommon("openCookieSettings")} />
              </div>
            )}

            <div className="mt-4">
              <a
                href="#top"
                className="font-body uppercase text-[11px] text-[var(--color-text-muted)] hover:text-[var(--color-accent)] transition-colors"
                style={{ letterSpacing: "0.18em" }}
              >
                ↑ {tCommon("backToTop")}
              </a>
            </div>
          </div>
        </div>
      </article>

      <Footer />
    </>
  );
}
