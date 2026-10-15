import { getTranslations } from "next-intl/server";
import { Link } from "@/navigation";
import { Logo } from "@/components/ui/Logo";
import { AI_ASSISTANTS } from "@/components/layout/ai-assistants";

type Destino = React.ComponentProps<typeof Link>["href"];

/**
 * El footer de la V2: continúa la banda oscura del final, con columnas
 * separadas por líneas. Mismos enlaces que el footer actual.
 */
export async function FooterV2({ locale }: { locale: string }) {
  const t = await getTranslations({ locale, namespace: "footer" });
  const aiQuery = encodeURIComponent(t("askAiQuery"));
  const year = new Date().getFullYear();

  type Enlace = { nombre: string; href: Destino; externo?: false } | { nombre: string; href: string; externo: true };
  const columnas: { titulo: string; enlaces: Enlace[] }[] = [
    {
      titulo: t("servicesHeading"),
      enlaces: [
        { nombre: t("servicesLinks.web"), href: "/services/desarrollo-web" },
        { nombre: t("servicesLinks.ecommerce"), href: "/services/ecommerce" },
        { nombre: t("servicesLinks.apps"), href: "/services/aplicaciones-web" },
        { nombre: t("servicesLinks.autom"), href: "/services/automatizaciones" },
        { nombre: t("servicesLinks.migr"), href: "/services/migraciones" },
        { nombre: t("servicesLinks.whitelabel"), href: "/services/white-label" },
      ],
    },
    {
      titulo: t("studioHeading"),
      enlaces: [
        { nombre: t("links.work"), href: "/work" },
        { nombre: t("links.studio"), href: "/studio" },
        { nombre: t("links.proceso"), href: "/proceso" },
        { nombre: t("links.blog"), href: "/blog" },
        { nombre: t("links.love"), href: "/love" },
        { nombre: t("links.contact"), href: "/contact" },
        { nombre: t("links.portal"), href: "https://portal.bellostas.studio", externo: true as const },
      ],
    },
    ...(locale === "es"
      ? [
          {
            titulo: t("seoHeading"),
            enlaces: [
              { nombre: t("localLinks.seoLocal"), href: "/seo-local" as Destino },
              { nombre: t("localLinks.huesca"), href: "/diseno-web-huesca" as Destino },
              { nombre: t("localLinks.zaragoza"), href: "/diseno-web-zaragoza" as Destino },
              { nombre: t("localLinks.teruel"), href: "/diseno-web-teruel" as Destino },
            ],
          },
        ]
      : []),
    {
      titulo: t("connectHeading"),
      enlaces: [
        { nombre: t("links.linkedin"), href: "https://www.linkedin.com/in/antonio-bellostas/", externo: true as const },
        { nombre: t("links.instagram"), href: "https://www.instagram.com/bellostas.studio/", externo: true as const },
        { nombre: t("links.legal"), href: "/legal" },
        { nombre: t("links.privacy"), href: "/privacidad" },
        { nombre: t("links.cookies"), href: "/cookies" },
      ],
    },
  ];

  const cls = "text-[14px] text-white/70 transition-colors hover:text-white";

  return (
    <footer data-header-tone="dark" className="bg-[var(--v2-band)] text-[var(--v2-band-text)]">
      <div className="v2-frame">
        <div className="grid grid-cols-1 border-x border-[var(--v2-band-line)] lg:grid-cols-12">
          <div className="flex flex-col gap-6 border-b border-[var(--v2-band-line)] p-6 md:p-10 lg:col-span-4 lg:border-b-0 lg:border-r">
            <Logo variant="white-red" height={20} />
            <p className="max-w-[300px] text-[13.5px] leading-[1.6] text-white/60">{t("tagline")}</p>
            <div className="flex flex-col gap-1 text-[13.5px] text-white/60">
              <span className="font-mono text-[10.5px] uppercase tracking-[0.14em] text-white/45">{t("hqHeading")}</span>
              <span>{t("hqAddress")}</span>
              <span>{t("hqCity")}</span>
              <a href="mailto:info@bellostas.studio" className="mt-2 text-white hover:text-[#e0364c]">
                info@bellostas.studio
              </a>
            </div>
            <div className="mt-auto flex flex-col gap-3">
              <span className="font-mono text-[10.5px] uppercase tracking-[0.14em] text-white/45">{t("askAiHeading")}</span>
              <div className="flex gap-2">
                {AI_ASSISTANTS.map((ai) => (
                  <a
                    key={ai.name}
                    href={`${ai.url}${aiQuery}`}
                    target="_blank"
                    rel="noopener"
                    aria-label={`${t("askAiAria")} ${ai.name}`}
                    className="inline-flex h-9 w-9 items-center justify-center border border-[var(--v2-band-line)] text-white/70 transition-colors hover:border-white/30 hover:text-white"
                  >
                    <svg viewBox={ai.viewBox} className="h-4 w-4" fill="currentColor" aria-hidden>
                      <path d={ai.path} />
                    </svg>
                  </a>
                ))}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-10 p-6 md:grid-cols-4 md:p-10 lg:col-span-8">
            {columnas.map((c) => (
              <div key={c.titulo} className="flex flex-col gap-4">
                <span className="font-mono text-[10.5px] uppercase tracking-[0.14em] text-white/45">{c.titulo}</span>
                <ul className="flex flex-col gap-2.5">
                  {c.enlaces.map((e) => (
                    <li key={e.nombre}>
                      {e.externo ? (
                        <a href={e.href} target="_blank" rel="noopener" className={cls}>
                          {e.nombre}
                        </a>
                      ) : (
                        <Link href={e.href} className={cls}>
                          {e.nombre}
                        </Link>
                      )}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </div>
      <div className="border-t border-[var(--v2-band-line)]">
        <div className="v2-frame">
          <div className="flex flex-wrap items-center justify-between gap-3 border-x border-[var(--v2-band-line)] px-6 py-4 font-mono text-[10.5px] uppercase tracking-[0.14em] text-white/45 md:px-10">
            <span>© {year} Bellostas Studio</span>
            <span>{t("bottomRight")}</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
