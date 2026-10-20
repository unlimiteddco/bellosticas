import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { getProjects } from "@/lib/cms/projects";
import { bookingQuarter } from "@/lib/booking";
import { Link } from "@/navigation";
import { V2Root } from "@/components/v2/V2Root";
import { AnnouncementV2 } from "@/components/v2/Announcement";
import { Header } from "@/components/v2/Header";
import { FooterV2 } from "@/components/v2/Footer";
import { TestimonialsV2 } from "@/components/v2/home/TestimonialsV2";
import { FaqV2 } from "@/components/v2/home/FaqV2";
import { ContactForm } from "@/components/sections/ContactForm";
import { WhatsAppButton } from "@/components/ui/WhatsAppButton";

/*
 * Contacto con el estilo de la V2. Oculta como la home V2 (sin indexar y
 * fuera del sitemap) hasta que la V2 sustituya a la web actual. El formulario
 * es el mismo de siempre (envío al CRM, antispam, analítica), vestido con los
 * colores de la V2 a través de .v2-legado.
 */
export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "contactPage" });
  return {
    title: `${t("metaTitle")} · V2`,
    description: t("metaDescription"),
    robots: { index: false, follow: false },
  };
}

export default async function ContactoV2({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: "contactPage" });
  const tf = await getTranslations({ locale, namespace: "footer" });
  const tv = await getTranslations({ locale, namespace: "v2" });
  const trimestre = bookingQuarter().split(" ")[0];

  const proyectos = await getProjects(locale);
  const trabajosMenu = proyectos.map((p) => ({
    slug: p.slug,
    name: p.name,
    category: p.category,
    color: p.color,
    cover: p.cover,
    logo: p.logo,
    comingSoon: p.comingSoon,
  }));

  // La llamada en tres datos, en celdas como los logos de la home.
  const datos = [
    { etiqueta: t("booking.durationLabel"), valor: t("booking.duration") },
    { etiqueta: t("booking.modalityLabel"), valor: t("booking.modality") },
    { etiqueta: t("booking.responseLabel"), valor: t("booking.responseTime") },
  ];

  return (
    <V2Root>
      <AnnouncementV2 locale={locale} />
      <Header trabajos={trabajosMenu} />
      <main id="top">
        {/* Cabecera sin líneas, como el hero de la home. */}
        <section className="v2-frame">
          <div className="flex flex-col gap-7 px-5 pt-12 pb-12 md:px-0 lg:pt-20 lg:pb-16">
            <span className="v2-label v2-hero-in flex items-center gap-2.5 tracking-[0.08em] sm:tracking-[0.14em]">
              <span className="booking-dot" aria-hidden />
              {tv("heroLabel", { q: trimestre })}
            </span>
            <h1
              className="v2-hero-in v2-h1"
              style={{ animationDelay: "80ms" }}
            >
              {t("title_part1")}
              <em className="font-display italic font-semibold text-[var(--v2-accent)]">{t("title_emphasis")}</em>
              {t("title_part2")}
            </h1>
            <p
              className="v2-hero-in max-w-[560px] text-[16px] leading-[1.55] text-[var(--v2-muted)] lg:text-[17px]"
              style={{ animationDelay: "160ms" }}
            >
              {t("sub")}
            </p>
          </div>
        </section>

        {/* El formulario a la izquierda; la llamada y los atajos a la derecha. */}
        <section className="v2-frame">
          <div className="v2-rail grid grid-cols-1 border-t border-[var(--v2-line)] lg:grid-cols-12">
            <div className="flex flex-col gap-8 px-6 py-10 md:p-10 lg:col-span-7 lg:p-12">
              <h2 className="text-[26px] font-medium leading-[1.15] tracking-[-0.02em] md:text-[30px]" data-reveal>
                {t("email_title")}
              </h2>
              <div className="v2-legado" data-reveal>
                <ContactForm hideHeader boton="v2" />
              </div>
            </div>

            <aside className="flex flex-col border-t border-[var(--v2-line)] lg:col-span-5 lg:border-l lg:border-t-0">
              <div className="flex flex-col gap-5 border-b border-[var(--v2-line)] px-6 py-10 md:p-10" data-reveal>
                <h2 className="text-[26px] font-medium leading-[1.15] tracking-[-0.02em] md:text-[30px]">{t("call_title")}</h2>
                <p className="text-[15px] leading-[1.55] text-[var(--v2-muted)]">{t("call_sub")}</p>
                <div className="flex items-center gap-3">
                  <img
                    src="/images/antonio-bellostas-hero-grain.jpg"
                    alt={t("call_name")}
                    width={48}
                    height={48}
                    className="h-12 w-12 shrink-0 rounded-full object-cover"
                    style={{ objectPosition: "center 25%" }}
                  />
                  <span className="flex flex-col leading-tight">
                    <span className="text-[15px] font-medium">{t("call_name")}</span>
                    <span className="text-[13px] text-[var(--v2-muted)]">{t("call_role")}</span>
                  </span>
                </div>
                <Link href="/v2/intro" className="v2-btn v2-btn--primary self-start">
                  {t("call_cta")}
                </Link>
              </div>

              <dl className="grid grid-cols-3 border-b border-[var(--v2-line)]" data-reveal>
                {datos.map((d, i) => (
                  <div key={d.etiqueta} className={`flex flex-col gap-1.5 px-4 py-5 md:px-6 ${i < 2 ? "border-r border-[var(--v2-line)]" : ""}`}>
                    <dt className="v2-label !text-[10px]">{d.etiqueta}</dt>
                    <dd className="text-[14px] font-medium md:text-[15px]">{d.valor}</dd>
                  </div>
                ))}
              </dl>

              <div className="flex flex-col gap-5 px-6 py-10 md:p-10" data-reveal>
                <span className="v2-label">{tv("contactDirect")}</span>
                <WhatsAppButton source="contact-v2" variant="v2" className="self-start" />
                <div className="flex flex-col gap-1 text-[14px] text-[var(--v2-muted)]">
                  <a href="mailto:info@bellostas.studio" className="v2-link self-start text-[var(--v2-text)]">
                    info@bellostas.studio
                  </a>
                  <span className="mt-2">{tf("hqAddress")}</span>
                  <span>{tf("hqCity")}</span>
                </div>
              </div>
            </aside>
          </div>
        </section>

        <TestimonialsV2 />
        <FaqV2 />
      </main>
      <FooterV2 locale={locale} />
    </V2Root>
  );
}
