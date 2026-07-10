import { getTranslations } from "next-intl/server";
import { EditorialLabel } from "@/components/ui/EditorialLabel";
import { MixedHeadline } from "@/components/ui/MixedHeadline";
import { PrimaryButton } from "@/components/ui/PrimaryButton";
import { WhatsAppButton } from "@/components/ui/WhatsAppButton";
import { LogoMarquee } from "@/components/sections/LogoMarquee";
import { PatternDivider } from "@/components/sections/PatternDivider";
import { ShortTestimonials } from "@/components/sections/ShortTestimonials";
import { CTAFinal } from "@/components/sections/CTAFinal";
import { Footer } from "@/components/layout/Footer";
import { ServiceFAQ } from "@/components/sections/service/ServiceFAQ";
import { ServiceProjects } from "@/components/sections/service/ServiceProjects";
import { GoogleProfileCard } from "./GoogleProfileCard";
import { getProjects } from "@/lib/cms/projects";
import { services } from "@/lib/services";
import type { LocalPageConfig } from "@/lib/local-pages";
import { ArrowUpRight } from "lucide-react";
import Link from "next/link";

/**
 * Local-SEO landing ("diseño web en {ciudad}"). Composes existing, proven
 * sections — hero + local proof + why-a-studio + testimonials + FAQ — so each
 * city page stays cheap to build but carries genuinely local content.
 */
export async function LocalLanding({
  config,
  locale,
}: {
  config: LocalPageConfig;
  locale: string;
}) {
  const t = await getTranslations({ locale, namespace: config.i18nNamespace });
  const tc = await getTranslations({ locale, namespace: "localPages.common" });
  const ts = await getTranslations({ locale, namespace: "services" });
  const all = await getProjects(locale);
  // Local proof: keep the configured order, skip missing/coming-soon ones.
  const projects = config.projectSlugs
    .map((slug) => all.find((p) => p.slug === slug && !p.comingSoon))
    .filter((p): p is NonNullable<typeof p> => Boolean(p));

  return (
    <>
      {/* ── HERO ── */}
      <section className="relative z-10 max-w-[1280px] mx-auto px-6 lg:px-12 pt-[160px] pb-16 md:pb-20">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 items-center">
          <div className="lg:col-span-7 flex flex-col gap-6">
            <EditorialLabel>{t("hero.label")}</EditorialLabel>
            <MixedHeadline
              as="h1"
              className="text-[42px] md:text-[60px] lg:text-[72px]"
              parts={[
                { text: t("hero.title_part1") },
                { text: t("hero.title_emphasis"), accent: true },
                { text: t("hero.title_part2") },
              ]}
            />
            <p className="font-body text-[17px] lg:text-[19px] leading-[1.6] text-[var(--color-text-muted)] max-w-[620px]">
              {t("hero.sub")}
            </p>
            <div className="flex flex-col sm:flex-row flex-wrap items-stretch sm:items-center gap-3 mt-2 w-full sm:w-auto">
              <PrimaryButton href="/contact" className="w-full sm:w-auto">
                {t("hero.cta")}
              </PrimaryButton>
              <WhatsAppButton
                source={config.slug}
                message={t("hero.whatsappMessage")}
                className="w-full sm:w-auto"
              />
            </div>
            <span
              className="font-body uppercase text-[11px] text-[var(--color-text-muted)] mt-4"
              style={{ letterSpacing: "0.18em" }}
            >
              {t("hero.meta")}
            </span>
          </div>

          <div className="hidden lg:block lg:col-span-5">
            <div className="relative max-w-[400px] ml-auto">
              <GoogleProfileCard />
            </div>
          </div>
        </div>
      </section>

      <LogoMarquee />

      {/* ── LOCAL PROOF ── */}
      <ServiceProjects
        namespace={`${config.i18nNamespace}.projects`}
        projects={projects}
        limit={4}
      />

      <PatternDivider height={36} size="xs" />

      {/* ── WHY A STUDIO (not an agency) ── */}
      <section className="relative z-10 max-w-[1280px] mx-auto px-6 lg:px-12 py-16 lg:py-24">
        <div className="flex flex-col gap-6 mb-12 max-w-[820px]">
          <EditorialLabel>{t("why.label")}</EditorialLabel>
          <MixedHeadline
            className="text-[36px] md:text-[52px]"
            parts={[
              { text: t("why.title_part1") },
              { text: t("why.title_emphasis"), accent: true },
              { text: t("why.title_part2") },
            ]}
          />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {(["i1", "i2", "i3"] as const).map((k, i) => (
            <div
              key={k}
              className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface-2)] p-7 flex flex-col gap-3"
            >
              <span
                className="font-mono text-[12px] text-[var(--color-accent)]"
                style={{ letterSpacing: "0.12em" }}
              >
                0{i + 1}
              </span>
              <h3 className="font-body text-[17px] font-semibold text-[var(--color-text)]">
                {t(`why.items.${k}.title`)}
              </h3>
              <p className="font-body text-[15px] leading-[1.6] text-[var(--color-text-muted)]">
                {t(`why.items.${k}.body`)}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* ── ALL SERVICES — enlaces a las páginas de servicio (SEO interno) ── */}
      <section className="relative z-10 max-w-[1280px] mx-auto px-6 lg:px-12 pb-16 lg:pb-24">
        <div className="flex flex-col gap-6 mb-10 max-w-[820px]">
          <EditorialLabel>{tc("services.label")}</EditorialLabel>
          <MixedHeadline
            className="text-[36px] md:text-[52px]"
            parts={[
              { text: tc("services.title_part1") },
              { text: tc("services.title_emphasis"), accent: true },
              { text: tc("services.title_part2") },
            ]}
          />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {services.map((s) => (
            <Link
              key={s.slug}
              href={`/services/${s.slug}`}
              className="group flex items-start gap-3.5 rounded-2xl border border-[var(--color-border)] bg-[var(--color-bg)] p-5 hover:border-[var(--color-accent)]/40 hover:-translate-y-0.5 transition-all"
            >
              <span
                className="font-mono text-[11px] text-[var(--color-accent)] pt-[3px] shrink-0"
                style={{ letterSpacing: "0.08em" }}
              >
                {s.number}
              </span>
              <span className="flex flex-col gap-1 min-w-0">
                <span className="flex items-center gap-1.5 font-body text-[15px] font-medium text-[var(--color-text)] group-hover:text-[var(--color-accent)] transition-colors">
                  {ts(`items.${s.titleKey}.title`)}
                  <ArrowUpRight
                    size={13}
                    className="opacity-0 -translate-x-0.5 group-hover:opacity-100 group-hover:translate-x-0 transition-all text-[var(--color-accent)] shrink-0"
                  />
                </span>
                <span className="font-body text-[13px] leading-[1.5] text-[var(--color-text-muted)] line-clamp-2">
                  {ts(`items.${s.titleKey}.description`)}
                </span>
              </span>
            </Link>
          ))}
        </div>
      </section>

      <ShortTestimonials />

      <ServiceFAQ
        namespace={`${config.i18nNamespace}.faq`}
        questionKeys={config.faqKeys}
      />

      <CTAFinal />
      <Footer />
    </>
  );
}
