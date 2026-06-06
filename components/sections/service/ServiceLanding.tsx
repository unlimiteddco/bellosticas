import { getTranslations } from "next-intl/server";
import { EditorialLabel } from "@/components/ui/EditorialLabel";
import { MixedHeadline } from "@/components/ui/MixedHeadline";
import { LogoMarquee } from "@/components/sections/LogoMarquee";
import { PatternDivider } from "@/components/sections/PatternDivider";
import { ShortTestimonials } from "@/components/sections/ShortTestimonials";
import { CTAFinal } from "@/components/sections/CTAFinal";
import { Footer } from "@/components/layout/Footer";
import { ServiceHero } from "./ServiceHero";
import { ServiceManifesto } from "./ServiceManifesto";
import { ServiceFAQ } from "./ServiceFAQ";
import { ServiceProjects } from "./ServiceProjects";
import { BentoCell } from "./BentoCell";
import { BentoVisual } from "./BentoVisuals";
import {
  breadcrumbSchema,
  faqSchema,
  jsonLdScripts,
  serviceSchema,
  type FaqItem,
} from "@/lib/json-ld";
import { getProjects } from "@/lib/cms/projects";
import { getServiceHero } from "@/lib/cms/service-heroes";
import type { ServicePageConfig } from "@/lib/service-pages";

type Props = {
  config: ServicePageConfig;
  locale: string;
};

const FEATURE_KEYS = ["f1", "f2", "f3", "f4", "f5"] as const;

export async function ServiceLanding({ config, locale }: Props) {
  const ns = config.i18nNamespace;
  const t = await getTranslations({ locale, namespace: ns });
  const tNav = await getTranslations({ locale, namespace: "footer.links" });

  // CMS-backed data (falls back to static config when the CMS is empty/off).
  const projects = await getProjects(locale);
  const cmsHero = await getServiceHero(config.slug);
  const heroMockups = cmsHero?.mockups ?? config.hero.mockups;
  const heroTechBadge = cmsHero?.techBadge ?? config.hero.techBadge;

  // Bento layout: top row = 2 cells (col-span-3 each), bottom row = 3 cells (col-span-2 each)
  const bentoSizes = ["md:col-span-3", "md:col-span-3", "md:col-span-2", "md:col-span-2", "md:col-span-2"];

  // Service URL relative to site root — locale prefix omitted (canonical es).
  const serviceUrl =
    locale === "es" ? `/services/${config.slug}` : `/${locale}/services/${config.slug}`;

  // Build JSON-LD schemas for SEO rich snippets.
  const faqItems: FaqItem[] = config.faq.questionKeys.map((key) => ({
    question: t(`faq.items.${key}.question`),
    answer: t(`faq.items.${key}.answer`),
  }));

  // The heading reads "[part1][emphasis][part2]" — recombine for the Service name.
  const serviceName = [
    t("hero.title_part1"),
    t("hero.title_emphasis"),
    t("hero.title_part2"),
  ]
    .join("")
    .trim();

  const schemas = [
    serviceSchema({
      name: serviceName,
      description: t("hero.sub"),
      url: serviceUrl,
      serviceType: t("hero.label").replace(/^\/\/ ?/, "").trim(),
    }),
    faqSchema(faqItems),
    breadcrumbSchema([
      { name: "Home", url: locale === "es" ? "/" : `/${locale}` },
      { name: tNav("services"), url: locale === "es" ? "/services" : `/${locale}/services` },
      { name: serviceName, url: serviceUrl },
    ]),
  ];

  return (
    <>
      {jsonLdScripts(schemas).map((s) => (
        <script
          key={s.key}
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: s.__html }}
        />
      ))}

      <ServiceHero
        namespace={`${ns}.hero`}
        mockups={heroMockups}
        techBadge={heroTechBadge}
      />

      <LogoMarquee />

      <ServiceManifesto
        label={t("manifesto.label")}
        titleParts={[
          t("manifesto.title_part1"),
          t("manifesto.title_emphasis"),
          t("manifesto.title_part2"),
        ]}
        body={t("manifesto.body")}
        bullets={t.raw("manifesto.bullets") as string[]}
        variant={config.manifesto?.variant}
      />

      <PatternDivider height={36} size="xs" />

      {/* Bento grid */}
      <section
        data-video-trigger
        className="relative z-10 max-w-[1280px] mx-auto px-6 lg:px-12 py-16 lg:py-24"
      >
        <div className="flex flex-col gap-6 mb-12 max-w-[820px]">
          <EditorialLabel>{t("bento.label")}</EditorialLabel>
          <MixedHeadline
            className="text-[40px] md:text-[56px]"
            parts={[
              { text: t("bento.title_part1") },
              { text: t("bento.title_emphasis"), accent: true },
              { text: t("bento.title_part2") },
            ]}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-6 gap-5 lg:gap-6">
          {FEATURE_KEYS.map((key, i) => (
            <BentoCell
              key={key}
              className={bentoSizes[i]}
              index={i}
              title={t(`bento.items.${key}.title`)}
              description={t(`bento.items.${key}.description`)}
              visual={<BentoVisual kind={config.bento.visuals[i]} />}
            />
          ))}
        </div>
      </section>

      <ServiceProjects
        namespace={`${ns}.projects`}
        projects={projects}
        stackFilter={config.projects.stackFilter}
        limit={config.projects.limit ?? 4}
      />

      <ShortTestimonials />

      <ServiceFAQ
        namespace={`${ns}.faq`}
        questionKeys={config.faq.questionKeys}
      />

      <CTAFinal />

      <Footer />
    </>
  );
}
