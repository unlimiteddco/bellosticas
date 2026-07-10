import Link from "next/link";
import { useLocale, useTranslations } from "next-intl";
import { Logo } from "@/components/ui/Logo";
import { LocaleSwitcher } from "./LocaleSwitcher";
import { bookingQuarter } from "@/lib/booking";

export function Footer() {
  const t = useTranslations("footer");
  const locale = useLocale();
  // Las landings de SEO local solo existen en español.
  const showLocalLinks = locale === "es";
  const year = new Date().getFullYear();

  const studioLinks = [
    { key: "work", href: "/work" },
    { key: "services", href: "/services" },
    { key: "proceso", href: "/proceso" },
    { key: "studio", href: "/studio" },
    { key: "blog", href: "/blog" },
    { key: "love", href: "/love" },
    { key: "contact", href: "/contact" },
    {
      key: "portal",
      href: "https://portal.bellostas.studio",
      external: true,
    },
  ] as const;

  const legalLinks = [
    { key: "legal", href: "/legal" },
    { key: "privacy", href: "/privacidad" },
    { key: "cookies", href: "/cookies" },
  ] as const;

  const connectLinks = [
    { key: "linkedin", href: "https://linkedin.com" },
    { key: "instagram", href: "https://instagram.com" },
    { key: "twitter", href: "https://twitter.com" },
    { key: "github", href: "https://github.com" },
  ] as const;

  return (
    <footer className="relative bg-[var(--color-text)] text-[var(--color-bg)]">
      <div className="max-w-[1280px] mx-auto px-6 lg:px-12 pt-20 pb-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          <div className="flex flex-col gap-5 lg:col-span-4">
            <Logo variant="white-red" height={45} />
            <p className="font-body text-[13px] leading-[1.6] text-[var(--color-bg)]/70 max-w-[260px]">
              {t("tagline")}
            </p>
            <a
              href="mailto:info@bellostas.studio"
              className="font-body text-[14px] text-[var(--color-bg)]/90 hover:text-[var(--color-accent)] transition-colors w-fit"
            >
              info@bellostas.studio
            </a>
            <div className="flex items-center gap-2 mt-1">
              <span className="relative flex h-2 w-2" aria-hidden>
                <span className="absolute inline-flex h-full w-full rounded-full bg-green-500 opacity-75 animate-ping" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500" />
              </span>
              <span
                className="font-body uppercase text-[11px] text-[var(--color-bg)]/70"
                style={{ letterSpacing: "0.18em" }}
              >
                {t("booking", { q: bookingQuarter() })}
              </span>
            </div>

            <div className="flex flex-col gap-1.5 mt-5">
              <span
                className="font-body uppercase text-[11px] text-[var(--color-bg)]/90"
                style={{ letterSpacing: "0.18em" }}
              >
                {t("hqHeading")}
              </span>
              <address className="not-italic font-body text-[13px] leading-[1.6] text-[var(--color-bg)]/70">
                {t("hqAddress")}
                <br />
                {t("hqCity")}
              </address>
            </div>
          </div>

          {/* Link columns grouped on the right so the logo block breathes */}
          <div className="lg:col-span-7 lg:col-start-6 grid grid-cols-2 sm:grid-cols-3 gap-8 lg:gap-12">
            <FooterColumn
              heading={t("studioHeading")}
              items={studioLinks.map((l) => ({
                label: t(`links.${l.key}`),
                href: l.href,
                external: "external" in l ? l.external : false,
              }))}
            />

            <FooterColumn
              heading={t("legalHeading")}
              items={legalLinks.map((l) => ({
                label: t(`links.${l.key}`),
                href: l.href,
              }))}
            />

            <FooterColumn
              heading={t("connectHeading")}
              items={connectLinks.map((l) => ({
                label: t(`links.${l.key}`),
                href: l.href,
                external: true,
              }))}
            />
          </div>
        </div>

        {/* Local SEO — landings por ciudad (enlazado interno). Solo en ES. */}
        {showLocalLinks && (
          <div className="mt-14 flex flex-wrap items-center gap-x-6 gap-y-2">
            <span
              className="font-body uppercase text-[10px] text-[var(--color-bg)]/40"
              style={{ letterSpacing: "0.18em" }}
            >
              {t("localHeading")}
            </span>
            {(["zaragoza", "huesca", "teruel"] as const).map((c) => (
              <Link
                key={c}
                href={`/diseno-web-${c}`}
                className="font-body text-[13px] text-[var(--color-bg)]/60 hover:text-[var(--color-bg)] transition-colors"
              >
                {t(`localLinks.${c}`)}
              </Link>
            ))}
          </div>
        )}

        <div
          className={`${showLocalLinks ? "mt-8" : "mt-16"} pt-8 border-t border-[var(--color-bg)]/15 flex flex-col gap-4 md:flex-row md:items-center md:justify-between`}
        >
          <span
            className="font-body uppercase text-[11px] text-[var(--color-bg)]/60"
            style={{ letterSpacing: "0.18em" }}
          >
            {t("bottomLeft")}
          </span>

          <div className="md:order-2">
            <LocaleSwitcher />
          </div>

          <span
            className="font-body uppercase text-[11px] text-[var(--color-bg)]/60 md:order-3"
            style={{ letterSpacing: "0.18em" }}
          >
            {t("bottomRight").replace("2026", String(year))}
          </span>
        </div>
      </div>
    </footer>
  );
}

function FooterColumn({
  heading,
  items,
}: {
  heading: string;
  items: { label: string; href: string; external?: boolean }[];
}) {
  return (
    <div className="flex flex-col gap-4">
      <span
        className="font-body uppercase text-[11px] text-[var(--color-bg)]/90"
        style={{ letterSpacing: "0.18em" }}
      >
        {heading}
      </span>
      <ul className="flex flex-col gap-2.5">
        {items.map((it) => {
          const cls =
            "font-body text-[14px] text-[var(--color-bg)]/70 hover:text-[var(--color-accent)] hover:opacity-100 transition-colors w-fit";
          return (
            <li key={it.label}>
              {it.external ? (
                <a href={it.href} target="_blank" rel="noopener noreferrer" className={cls}>
                  {it.label}
                </a>
              ) : (
                <Link href={it.href} className={cls}>
                  {it.label}
                </Link>
              )}
            </li>
          );
        })}
      </ul>
    </div>
  );
}
