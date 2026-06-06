import type { Metadata } from "next";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { EditorialLabel } from "@/components/ui/EditorialLabel";
import { Reveal } from "@/components/ui/Reveal";
import { ContactForm } from "@/components/sections/ContactForm";
import { ShortTestimonials } from "@/components/sections/ShortTestimonials";
import { Footer } from "@/components/layout/Footer";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "contactPage" });
  return {
    title: t("metaTitle"),
    description: t("metaDescription"),
  };
}

export default async function ContactPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: "contactPage" });

  return (
    <>
      {/* Page header */}
      <section className="relative z-10 max-w-[1280px] mx-auto px-6 lg:px-12 pt-[160px] pb-10">
        <div className="flex flex-col items-center text-center gap-6 max-w-[820px] mx-auto">
          <Reveal immediate delay={0.05}>
            <EditorialLabel>{t("label")}</EditorialLabel>
          </Reveal>
          <Reveal immediate delay={0.15}>
            <h1 className="tracking-tight leading-[1.05] text-[44px] md:text-[68px]">
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
            <p className="font-body text-[17px] lg:text-[19px] leading-[1.55] text-[var(--color-text-muted)] max-w-[620px]">
              {t("sub")}
            </p>
          </Reveal>
        </div>
      </section>

      {/* Two columns — live call (left) + email form (right) */}
      <section className="relative z-10 max-w-[1280px] mx-auto px-6 lg:px-12 pb-16 lg:pb-20">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-0 items-start border-t border-[var(--color-border)]">
          {/* Left — prefer a live call */}
          <Reveal immediate delay={0.4}>
          <div className="flex flex-col gap-5 pt-10 lg:pt-14 lg:pr-12">
            <h2 className="font-display text-[28px] md:text-[34px] leading-tight text-[var(--color-text)]">
              {t("call_title")}
            </h2>
            <p className="font-body text-[15px] text-[var(--color-text-muted)]">
              {t("call_sub")}
            </p>

            <Link
              href="/intro"
              className="group mt-1 flex items-center justify-between gap-4 rounded-2xl bg-[var(--color-text)] text-[var(--color-bg)] p-4 md:p-5 transition-transform hover:-translate-y-0.5"
              style={{ boxShadow: "0 24px 50px -24px rgba(29,29,27,0.4)" }}
            >
              <span className="flex items-center gap-3 min-w-0">
                <img
                  src="/images/antonio-bellostas-hero-grain.jpg"
                  alt={t("call_name")}
                  width={48}
                  height={48}
                  className="w-12 h-12 rounded-full object-cover shrink-0"
                  style={{ objectPosition: "center 25%" }}
                />
                <span className="flex flex-col leading-tight min-w-0">
                  <span className="font-body text-[15px] font-semibold truncate">
                    {t("call_name")}
                  </span>
                  <span className="font-body text-[13px] text-[var(--color-bg)]/60 truncate">
                    {t("call_role")}
                  </span>
                </span>
              </span>
              <span className="shrink-0 inline-flex items-center gap-2 rounded-full bg-[var(--color-bg)] text-[var(--color-text)] h-11 px-5 font-body text-[13px] font-medium transition-colors group-hover:bg-[var(--color-accent)] group-hover:text-[var(--color-bg)]">
                {t("call_cta")}
                <ArrowUpRight
                  size={15}
                  className="transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                />
              </span>
            </Link>
          </div>
          </Reveal>

          {/* Right — send an email */}
          <Reveal immediate delay={0.5}>
          <div className="flex flex-col gap-6 pt-10 lg:pt-14 lg:border-l lg:border-[var(--color-border)] lg:pl-12">
            <h2 className="font-display text-[28px] md:text-[34px] leading-tight text-[var(--color-text)]">
              {t("email_title")}
            </h2>
            <ContactForm hideHeader />
          </div>
          </Reveal>
        </div>
      </section>

      {/* Reviews */}
      <ShortTestimonials />

      <Footer />
    </>
  );
}
