import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { EditorialLabel } from "@/components/ui/EditorialLabel";
import { Reveal } from "@/components/ui/Reveal";
import { IntroTestimonials } from "@/components/sections/intro/IntroTestimonials";
import { BookingSection } from "@/components/sections/BookingSection";
import { Footer } from "@/components/layout/Footer";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "introPage" });
  return {
    title: t("metaTitle"),
    description: t("metaDescription"),
  };
}

export default async function IntroPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: "introPage" });
  const points = t.raw("points") as string[];

  return (
    <>
      {/* Header */}
      <section className="relative z-10 max-w-[1280px] mx-auto px-6 lg:px-12 pt-[160px] pb-10 text-center flex flex-col items-center">
        <Reveal immediate delay={0.05}>
          <EditorialLabel>{t("label")}</EditorialLabel>
        </Reveal>

        <Reveal immediate delay={0.15}>
          <h1 className="tracking-tight leading-[1.05] text-[44px] md:text-[64px] lg:text-[72px] mt-6">
            <span className="font-body font-medium text-[var(--color-text)]">
              {t("title_part1")}
            </span>
            <span className="font-display italic font-semibold text-[var(--color-accent)]">
              {t("title_emphasis")}
            </span>
            <span className="font-body font-medium text-[var(--color-text)]">
              {t("title_part2")}
            </span>
          </h1>
        </Reveal>

        <Reveal immediate delay={0.28}>
          <p className="font-body text-[17px] lg:text-[19px] leading-[1.6] text-[var(--color-text-muted)] max-w-[640px] mx-auto mt-6">
            {t("sub")}
          </p>
        </Reveal>

        {/* Points */}
        <Reveal immediate delay={0.4}>
          <ul className="mt-7 flex flex-wrap items-center justify-center gap-x-7 gap-y-3">
            {points.map((p) => (
              <li
                key={p}
                className="flex items-center gap-2 font-body text-[14px] text-[var(--color-text)]"
              >
                <span
                  className="inline-block w-1.5 h-1.5 rounded-full bg-[var(--color-accent)]"
                  aria-hidden
                />
                {p}
              </li>
            ))}
          </ul>
        </Reveal>
      </section>

      {/* Cal.com embed (no internal header) */}
      <BookingSection hideHeader centered />

      {/* Testimonials slider — Javier, Themis, Adela */}
      <section className="relative z-10 max-w-[760px] mx-auto px-6 lg:px-12 pb-20 lg:pb-28">
        <Reveal>
          <IntroTestimonials />
        </Reveal>
      </section>

      <Footer />
    </>
  );
}
