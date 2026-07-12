import { getTranslations } from "next-intl/server";
import { EditorialLabel } from "@/components/ui/EditorialLabel";
import { MixedHeadline } from "@/components/ui/MixedHeadline";
import { PatternDivider } from "@/components/sections/PatternDivider";
import { ShortTestimonials } from "@/components/sections/ShortTestimonials";
import { ServiceFAQ } from "@/components/sections/service/ServiceFAQ";
import { Footer } from "@/components/layout/Footer";
import { NICHES } from "@/lib/seo-local";
import { SeoWizardHost, OpenWizardButton } from "./SeoWizard";

/** Marquee de nichos — CSS puro (mismo patrón que LogoMarquee). */
function NicheMarquee() {
  const items = NICHES.filter((n) => n.key !== "otro");
  const doubled = [...items, ...items];
  return (
    <div className="relative w-full max-w-[720px] overflow-hidden mt-8" aria-hidden>
      {/* Fundido en los bordes */}
      <div className="pointer-events-none absolute inset-y-0 left-0 w-16 z-10 bg-gradient-to-r from-[var(--color-bg)] to-transparent" />
      <div className="pointer-events-none absolute inset-y-0 right-0 w-16 z-10 bg-gradient-to-l from-[var(--color-bg)] to-transparent" />
      <div className="seo-niche-track flex items-center gap-3 whitespace-nowrap py-1">
        {doubled.map((n, i) => (
          <span
            key={`${n.key}-${i}`}
            className="inline-flex items-center gap-2 rounded-full border border-[var(--color-border)] bg-[var(--color-surface-2)] px-4 py-2 font-body text-[13px] text-[var(--color-text)] shrink-0"
          >
            <span className="text-[15px]">{n.emoji}</span>
            {n.label}
          </span>
        ))}
      </div>
      <style
        dangerouslySetInnerHTML={{
          __html: `
            @keyframes seo-niche-marquee { from { transform: translateX(0); } to { transform: translateX(-50%); } }
            .seo-niche-track { width: max-content; animation: seo-niche-marquee 30s linear infinite; }
            @media (prefers-reduced-motion: reduce) { .seo-niche-track { animation: none; } }
          `,
        }}
      />
    </div>
  );
}

/**
 * Landing de venta del servicio de SEO local productizado (/seo-local).
 * Distinta a las páginas de servicio: promesa + configurador de precio al
 * instante (wizard) + prueba + FAQ. Solo en español (keyword española).
 */
export async function SeoLocalLanding({ locale }: { locale: string }) {
  const t = await getTranslations({ locale, namespace: "seoLocal" });

  return (
    <>
      {/* ── HERO — centrado, promesa + configurador ── */}
      <section className="relative z-10 max-w-[1280px] mx-auto px-6 lg:px-12 pt-[160px] pb-16 md:pb-20">
        <div className="flex flex-col items-center text-center gap-6">
          <EditorialLabel>{t("hero.label")}</EditorialLabel>
          <MixedHeadline
            as="h1"
            className="text-[40px] md:text-[60px] lg:text-[72px] max-w-[900px]"
            parts={[
              { text: t("hero.title_part1") },
              { text: t("hero.title_emphasis"), accent: true },
              { text: t("hero.title_part2") },
            ]}
          />
          <p className="font-body text-[17px] lg:text-[19px] leading-[1.6] text-[var(--color-text-muted)] max-w-[640px]">
            {t("hero.sub")}
          </p>

          <div className="mt-2 flex flex-col items-center gap-3">
            <OpenWizardButton label={t("hero.cta")} />
            <span className="font-body text-[12.5px] text-[var(--color-text-muted)]">
              {t("hero.ctaNote")}
            </span>
          </div>

          {/* Chips de anclaje */}
          <ul className="mt-4 flex flex-wrap items-center justify-center gap-x-7 gap-y-3">
            {(["c1", "c2", "c3"] as const).map((k) => (
              <li
                key={k}
                className="flex items-center gap-2 font-body text-[14px] text-[var(--color-text)]"
              >
                <span
                  className="inline-block w-1.5 h-1.5 rounded-full bg-[var(--color-accent)]"
                  aria-hidden
                />
                {t(`hero.chips.${k}`)}
              </li>
            ))}
          </ul>

          {/* Mini slider de nichos */}
          <NicheMarquee />
        </div>
      </section>

      {/* ── CÓMO FUNCIONA ── */}
      <section className="relative z-10 max-w-[1280px] mx-auto px-6 lg:px-12 py-16 lg:py-24">
        <div className="flex flex-col gap-6 mb-12 max-w-[820px]">
          <EditorialLabel>{t("how.label")}</EditorialLabel>
          <MixedHeadline
            className="text-[36px] md:text-[52px]"
            parts={[
              { text: t("how.title_part1") },
              { text: t("how.title_emphasis"), accent: true },
              { text: t("how.title_part2") },
            ]}
          />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {(["s1", "s2", "s3"] as const).map((k, i) => (
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
                {t(`how.steps.${k}.title`)}
              </h3>
              <p className="font-body text-[15px] leading-[1.6] text-[var(--color-text-muted)]">
                {t(`how.steps.${k}.body`)}
              </p>
            </div>
          ))}
        </div>
      </section>

      <PatternDivider height={36} size="xs" />

      <ShortTestimonials />

      <ServiceFAQ namespace="seoLocal.faq" questionKeys={["q1", "q2", "q3", "q4", "q5"]} />

      {/* ── CTA FINAL — panel oscuro con textura tech + nichos ── */}
      <section className="relative z-10 max-w-[1280px] mx-auto px-6 lg:px-12 pb-20 lg:pb-28">
        <div className="relative overflow-hidden rounded-3xl bg-[var(--color-text)] text-[var(--color-bg)] px-8 pt-14 md:pt-16 pb-10 flex flex-col items-center text-center gap-5">
          {/* Retícula de puntos difuminada */}
          <div
            aria-hidden
            className="absolute inset-0"
            style={{
              backgroundImage:
                "radial-gradient(circle, rgba(255,255,255,0.09) 1px, transparent 1.4px)",
              backgroundSize: "22px 22px",
              maskImage: "radial-gradient(ellipse at 50% 0%, #000 20%, transparent 75%)",
              WebkitMaskImage: "radial-gradient(ellipse at 50% 0%, #000 20%, transparent 75%)",
            }}
          />
          {/* Glow de acento */}
          <div
            aria-hidden
            className="absolute left-1/2 top-0 -translate-x-1/2 -translate-y-1/2"
            style={{
              width: "60%",
              height: "260px",
              background: "radial-gradient(circle, rgba(194,38,58,0.28) 0%, transparent 65%)",
            }}
          />
          {/* Hairlines laterales */}
          <span aria-hidden className="absolute top-8 bottom-8 left-6 w-px bg-white/5" />
          <span aria-hidden className="absolute top-8 bottom-8 right-6 w-px bg-white/5" />

          <h2 className="relative z-10 font-display text-[30px] md:text-[40px] leading-tight max-w-[640px]">
            {t("finalCta.title")}
          </h2>
          <p className="relative z-10 font-body text-[15px] text-[var(--color-bg)]/70 max-w-[480px]">
            {t("finalCta.sub")}
          </p>
          <OpenWizardButton label={t("hero.cta")} className="relative z-10 mt-2" />

          {/* Fila de nichos — el "para quién" de un vistazo */}
          <div
            aria-hidden
            className="relative z-10 mt-8 pt-7 border-t border-white/10 w-full flex flex-wrap items-center justify-center gap-x-6 gap-y-3"
          >
            {NICHES.filter((n) => n.key !== "otro").map((n) => (
              <span
                key={n.key}
                className="inline-flex items-center gap-1.5 font-body text-[12.5px] text-[var(--color-bg)]/55"
              >
                <span className="text-[15px]">{n.emoji}</span>
                {n.label}
              </span>
            ))}
          </div>
        </div>
      </section>

      <Footer />

      {/* Wizard (se abre desde cualquier CTA de la página) */}
      <SeoWizardHost />
    </>
  );
}
