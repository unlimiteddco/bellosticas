import Link from "next/link";
import { useLocale, useTranslations } from "next-intl";
import { Logo } from "@/components/ui/Logo";
import { LocaleSwitcher } from "./LocaleSwitcher";
import { AI_ASSISTANTS } from "./ai-assistants";

const GOOGLE_REVIEWS_URL = "https://www.google.com/search?q=bellostas+studio+huesca";

function GoogleG({ size = 18 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 48 48" aria-hidden>
      <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z" />
      <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z" />
      <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z" />
      <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z" />
    </svg>
  );
}

export function Footer() {
  const t = useTranslations("footer");
  const locale = useLocale();
  // Las landings de SEO local solo existen en español.
  const showLocalLinks = locale === "es";
  const year = new Date().getFullYear();
  const aiQuery = encodeURIComponent(t("askAiQuery"));

  const serviceLinks = [
    { key: "web", href: "/services/desarrollo-web" },
    { key: "ecommerce", href: "/services/ecommerce" },
    { key: "apps", href: "/services/aplicaciones-web" },
    { key: "autom", href: "/services/automatizaciones" },
    { key: "migr", href: "/services/migraciones" },
    { key: "whitelabel", href: "/services/white-label" },
  ] as const;

  const studioLinks = [
    { name: t("links.work"), href: "/work" },
    { name: t("links.studio"), href: "/studio" },
    { name: t("links.proceso"), href: "/proceso" },
    { name: t("links.blog"), href: "/blog" },
    { name: t("links.love"), href: "/love" },
    { name: t("links.contact"), href: "/contact" },
    { name: t("links.portal"), href: "https://portal.bellostas.studio", external: true },
    { name: t("links.careers"), href: "#", soon: true },
  ];

  const localLinks = [
    { key: "seoLocal", href: "/seo-local" },
    { key: "zaragoza", href: "/diseno-web-zaragoza" },
    { key: "huesca", href: "/diseno-web-huesca" },
    { key: "teruel", href: "/diseno-web-teruel" },
  ] as const;

  const legalLinks = [
    { key: "legal", href: "/legal" },
    { key: "privacy", href: "/privacidad" },
    { key: "cookies", href: "/cookies" },
  ] as const;

  const connectLinks = [
    { key: "linkedin", href: "https://www.linkedin.com/in/antonio-bellostas/" },
    { key: "instagram", href: "https://www.instagram.com/bellostas.studio/" },
  ] as const;

  return (
    <footer className="relative bg-[var(--color-text)] text-[var(--color-bg)]">
      <div className="max-w-[1280px] mx-auto px-6 lg:px-12 pt-20 pb-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8">
          {/* ── Columna izquierda: marca + contacto + IA ── */}
          <div className="flex flex-col gap-6 lg:col-span-4 lg:pr-10">
            <Logo variant="white-red" height={45} />
            <p className="font-body text-[13px] leading-[1.6] text-[var(--color-bg)]/70 max-w-[280px]">
              {t("tagline")}
            </p>

            {/* Contacto directo, a dos columnas (hablamos / email) */}
            <div className="grid grid-cols-2 gap-6 mt-2">
              <div className="flex flex-col gap-2">
                <span
                  className="font-body uppercase text-[10px] text-[var(--color-bg)]/50"
                  style={{ letterSpacing: "0.18em" }}
                >
                  {t("letsTalk")}
                </span>
                <Link
                  href="/intro"
                  className="font-body text-[14px] font-medium text-[var(--color-bg)]/90 hover:text-[var(--color-accent)] transition-colors w-fit underline underline-offset-4 decoration-[var(--color-bg)]/30"
                >
                  {t("bookCall")}
                </Link>
                <a
                  href="https://wa.me/34624010424?text=Hola%20Antonio%20%F0%9F%91%8B%20Vengo%20de%20la%20web%20y%20me%20gustar%C3%ADa%20hablar%20de%20un%20proyecto."
                  target="_blank"
                  rel="noopener"
                  className="font-body text-[14px] font-medium text-[var(--color-bg)]/90 hover:text-[#25D366] transition-colors w-fit underline underline-offset-4 decoration-[var(--color-bg)]/30"
                >
                  WhatsApp
                </a>
              </div>
              <div className="flex flex-col gap-2">
                <span
                  className="font-body uppercase text-[10px] text-[var(--color-bg)]/50"
                  style={{ letterSpacing: "0.18em" }}
                >
                  {t("sendEmail")}
                </span>
                <a
                  href="mailto:info@bellostas.studio"
                  className="font-body text-[14px] font-medium text-[var(--color-bg)]/90 hover:text-[var(--color-accent)] transition-colors w-fit underline underline-offset-4 decoration-[var(--color-bg)]/30"
                >
                  info@bellostas.studio
                </a>
              </div>
            </div>

            {/* Pregúntale a la IA por nosotros — logos como en los grandes */}
            <div className="flex flex-col gap-3 mt-3">
              <span
                className="font-body uppercase text-[10px] text-[var(--color-bg)]/50"
                style={{ letterSpacing: "0.18em" }}
              >
                {t("askAiHeading")}
              </span>
              <div className="flex flex-wrap gap-2.5">
                {AI_ASSISTANTS.map((ai) => (
                  <a
                    key={ai.name}
                    href={`${ai.url}${aiQuery}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={`${t("askAiAria")} ${ai.name}`}
                    title={ai.name}
                    className="flex items-center justify-center w-11 h-11 rounded-xl border border-[var(--color-bg)]/20 text-[var(--color-bg)]/80 hover:text-[var(--color-bg)] hover:border-[var(--color-accent)] hover:-translate-y-0.5 transition-all"
                  >
                    <svg width={19} height={19} viewBox={ai.viewBox} fill="currentColor" aria-hidden>
                      <path d={ai.path} />
                    </svg>
                  </a>
                ))}
              </div>
            </div>

            <address className="not-italic font-body text-[12px] text-[var(--color-bg)]/50 mt-2">
              {t("hqAddress")} · {t("hqCity")}
            </address>
          </div>

          {/* ── Columnas de enlaces ── */}
          <div
            className={`lg:col-span-8 grid grid-cols-2 gap-8 lg:gap-6 ${
              showLocalLinks ? "sm:grid-cols-4" : "sm:grid-cols-3"
            }`}
          >
            <FooterColumn
              heading={t("servicesHeading")}
              items={serviceLinks.map((l) => ({
                name: t(`servicesLinks.${l.key}`),
                href: l.href,
              }))}
            />

            <FooterColumn heading={t("studioHeading")} items={studioLinks} />

            {showLocalLinks && (
              <FooterColumn
                heading={t("seoHeading")}
                items={localLinks.map((l) => ({
                  name: t(`localLinks.${l.key}`),
                  href: l.href,
                }))}
              />
            )}

            {/* Conecta + Legal apiladas en la última columna */}
            <div className="flex flex-col gap-10">
              <FooterColumn
                heading={t("connectHeading")}
                items={connectLinks.map((l) => ({
                  name: t(`links.${l.key}`),
                  href: l.href,
                  external: true,
                }))}
              />
              <FooterColumn
                heading={t("legalHeading")}
                items={legalLinks.map((l) => ({
                  name: t(`links.${l.key}`),
                  href: l.href,
                }))}
              />
            </div>
          </div>
        </div>

        {/* ── Reseñas de Google ── */}
        <a
          href={GOOGLE_REVIEWS_URL}
          target="_blank"
          rel="noopener"
          className="mt-14 flex items-center justify-between gap-4 rounded-2xl border border-[var(--color-bg)]/15 px-5 py-4 hover:border-[var(--color-bg)]/35 transition-colors group"
        >
          <span className="flex items-center gap-3 min-w-0">
            <GoogleG />
            <span className="font-body text-[14px] text-[var(--color-bg)]/85 truncate">
              {t("reviewsLine")}
            </span>
            <span className="text-[#FBBC04] text-[13px] tracking-[2px] shrink-0" aria-hidden>
              ★★★★★
            </span>
          </span>
          <span className="font-body text-[13px] text-[var(--color-bg)]/70 group-hover:text-[var(--color-bg)] transition-colors shrink-0">
            {t("reviewsCta")} →
          </span>
        </a>

        {/* ── Barra inferior ── */}
        <div className="mt-8 pt-8 border-t border-[var(--color-bg)]/15 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <span
            className="font-body uppercase text-[11px] text-[var(--color-bg)]/60"
            style={{ letterSpacing: "0.18em" }}
          >
            {t("bottomRight").replace("2026", String(year))}
          </span>
          {/* self-start para que en móvil (columna) no se estire a todo el ancho */}
          <div className="self-start">
            <LocaleSwitcher variant="toggle" />
          </div>
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
  items: { name: string; href: string; external?: boolean; soon?: boolean }[];
}) {
  // Subrayado animado igual que el header (crece de 0 a 100% al hover).
  const cls =
    "group relative inline-block font-body text-[14px] font-medium text-[var(--color-bg)]/80 hover:text-[var(--color-accent)] transition-colors w-fit";
  const underline = (
    <span className="absolute left-0 -bottom-0.5 h-px w-0 bg-[var(--color-accent)] transition-[width] duration-300 group-hover:w-full" />
  );
  return (
    <div className="flex flex-col gap-4">
      <span
        className="font-body uppercase text-[11px] text-[var(--color-bg)]/90"
        style={{ letterSpacing: "0.18em" }}
      >
        {heading}
      </span>
      <ul className="flex flex-col gap-2.5">
        {items.map((it) => (
          <li key={it.name}>
            {it.soon ? (
              // Próximamente: no navega, con etiqueta
              <span className="flex items-center gap-2 font-body text-[14px] font-medium text-[var(--color-bg)]/40 cursor-default w-fit">
                {it.name}
                <span
                  className="rounded-full border border-[var(--color-accent)]/60 text-[var(--color-accent)] px-2 py-0.5 font-body text-[9px] uppercase font-semibold"
                  style={{ letterSpacing: "0.1em" }}
                >
                  SOON
                </span>
              </span>
            ) : it.external ? (
              <a href={it.href} target="_blank" rel="noopener noreferrer" className={cls}>
                {it.name}
                {underline}
              </a>
            ) : (
              <Link href={it.href} className={cls}>
                {it.name}
                {underline}
              </Link>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}
