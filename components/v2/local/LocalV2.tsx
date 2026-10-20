import { ArrowRight, BadgeCheck, Star } from "lucide-react";
import { getTranslations } from "next-intl/server";
import { Link } from "@/navigation";
import { getProjects } from "@/lib/cms/projects";
import { conPortada, VIDEO_CASO } from "@/lib/v2/videos-casos";
import { sinBarras } from "@/lib/v2/texto";
import type { LocalPageConfig } from "@/lib/local-pages";
import { breadcrumbSchema, faqSchema, serviceSchema } from "@/lib/json-ld";
import { AsteriskIcon } from "@/components/ui/AsteriskIcon";
import { WhatsAppButton } from "@/components/ui/WhatsAppButton";
import { LogoCells } from "@/components/v2/home/LogoCells";
import { TestimonialsV2 } from "@/components/v2/home/TestimonialsV2";
import { FaqV2 } from "@/components/v2/home/FaqV2";
import { ClosingBand } from "@/components/v2/home/ClosingBand";
import { ProofRow } from "@/components/v2/home/ProofRow";
import { PaginaServicio } from "@/components/v2/servicio/PaginaServicio";
import { LineaArriba, ServicioRelacionados } from "@/components/v2/servicio/Secciones";
import { TarjetaTrabajo } from "@/components/v2/trabajos/RejillaTrabajos";

/*
 * Las landings de ciudad («Diseño web en Huesca / Zaragoza / Teruel») en la
 * V2. Cada ciudad conserva su texto propio (messages → localPages.{ciudad}:
 * hero, casos, «por qué» y preguntas), porque tres páginas casi iguales Google
 * las lee como páginas puerta. De la V2 salen la forma y los precios al día:
 * la descripción y las preguntas con precios están copiadas en v2Local.{ciudad}
 * con las cifras nuevas, para no tocar las de la V1 mientras siga publicada.
 */

const PERFIL_GOOGLE = "https://www.google.com/search?q=bellostas+studio+huesca";

function Estrellas({ size = 13 }: { size?: number }) {
  return (
    <span className="inline-flex gap-0.5 text-[#FBBC04]" aria-hidden>
      {[0, 1, 2, 3, 4].map((n) => (
        <Star key={n} size={size} fill="currentColor" strokeWidth={0} />
      ))}
    </span>
  );
}

function GoogleG() {
  return (
    <svg width={15} height={15} viewBox="0 0 48 48" aria-hidden>
      <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z" />
      <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z" />
      <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z" />
      <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z" />
    </svg>
  );
}

/** La ficha de Google del estudio, como objeto de diseño (enlaza al perfil real). */
async function FichaGoogle({ locale }: { locale: string }) {
  const t = await getTranslations({ locale, namespace: "localPages.common.gcard" });
  return (
    <a
      href={PERFIL_GOOGLE}
      target="_blank"
      rel="noopener"
      aria-label={t("cta")}
      className="v2-card group block p-5 shadow-[0_40px_80px_-48px_rgba(29,29,27,0.45)] transition-transform duration-500 ease-[var(--v2-ease)] hover:-translate-y-1 lg:p-6"
    >
      <div className="flex items-start gap-3.5">
        <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-[8px] bg-[#121211]">
          <AsteriskIcon className="h-5 w-5 text-[var(--v2-accent)] transition-transform duration-700 group-hover:rotate-45" />
        </span>
        <div className="min-w-0">
          <span className="flex items-center gap-1.5 text-[16px] font-medium">
            Bellostas Studio
            <BadgeCheck size={16} className="shrink-0 text-[#4285F4]" />
          </span>
          <span className="block truncate text-[12.5px] text-[var(--v2-muted)]">
            {t("businessType")} · {t("location")}
          </span>
          <span className="mt-1 flex items-center gap-1.5">
            <span className="text-[13px] font-medium tabular-nums">5,0</span>
            <Estrellas />
            <span className="text-[11.5px] text-[var(--v2-muted)]">· {t("reviewsLabel")}</span>
          </span>
        </div>
      </div>
      <div className="mt-4 flex flex-col gap-3 border-t border-[var(--v2-line)] pt-4">
        {(["r1", "r2"] as const).map((k) => (
          <div key={k} className="flex gap-2.5">
            <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[var(--v2-hover)] text-[11px] font-medium">
              {t(`${k}.name`).charAt(0)}
            </span>
            <div className="min-w-0">
              <span className="flex items-center gap-2">
                <span className="text-[12.5px] font-medium">{t(`${k}.name`)}</span>
                <Estrellas size={10} />
              </span>
              <p className="mt-0.5 text-[12.5px] leading-[1.5] text-[var(--v2-muted)]">“{t(`${k}.text`)}”</p>
            </div>
          </div>
        ))}
      </div>
      <div className="mt-4 flex items-center justify-between border-t border-[var(--v2-line)] pt-3.5">
        <span className="inline-flex items-center gap-1.5 text-[12px] text-[var(--v2-muted)]">
          <GoogleG /> Google
        </span>
        <span className="inline-flex items-center gap-1 text-[12.5px] font-medium">
          {t("cta")} <ArrowRight size={13} className="text-[var(--v2-accent)] transition-transform group-hover:translate-x-0.5" />
        </span>
      </div>
    </a>
  );
}

export async function LocalV2({ config, locale }: { config: LocalPageConfig; locale: string }) {
  const t = await getTranslations({ locale, namespace: config.i18nNamespace });
  const clave = config.i18nNamespace.split(".").pop()!;
  const tv = await getTranslations({ locale, namespace: `v2Local.${clave}` });
  const tc = await getTranslations({ locale, namespace: "v2Local.common" });
  const todos = conPortada(await getProjects(locale));
  // Los casos de la ciudad, en el orden configurado; fuera los que no estén listos.
  const casos = config.projectSlugs
    .map((slug) => todos.find((p) => p.slug === slug && !p.comingSoon))
    .filter((p): p is NonNullable<typeof p> => Boolean(p))
    .slice(0, 4);

  const preguntas = (tv.raw("faq.items") as Record<string, { question: string; answer: string }>) ?? {};
  const schemas = [
    serviceSchema({
      name: t("metaTitle"),
      description: tv("metaDescription"),
      url: `/${config.slug}`,
      areaServed: [config.city, "Aragón", "ES"],
      serviceType: "Diseño y desarrollo web",
    }),
    faqSchema(Object.values(preguntas).map((q) => ({ question: q.question, answer: q.answer }))),
    breadcrumbSchema([
      { name: "Bellostas Studio", url: "/" },
      { name: tc("migas", { ciudad: config.city }), url: `/${config.slug}` },
    ]),
  ];
  const razones = ["i1", "i2", "i3"] as const;

  return (
    <PaginaServicio locale={locale} proyectos={todos}>
      {schemas.map((s, i) =>
        s ? <script key={i} type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(s) }} /> : null,
      )}

      {/* ── Hero: la ciudad en grande y la ficha de Google al lado ── */}
      <section className="v2-frame">
        <div className="grid grid-cols-1 items-center gap-12 px-5 pb-16 pt-14 md:px-0 lg:grid-cols-12 lg:gap-10 lg:pb-20 lg:pt-20">
          <div className="flex flex-col gap-7 lg:col-span-7">
            <span className="v2-label v2-hero-in flex items-center gap-2.5">
              <span aria-hidden className="h-1.5 w-1.5 rounded-full bg-[var(--v2-accent)]" />
              {sinBarras(t("hero.label"))}
            </span>
            <h1
              className="v2-hero-in v2-h1"
              style={{ animationDelay: "80ms" }}
            >
              {t("hero.title_part1")}
              <span className="whitespace-nowrap">
                <em className="font-display italic font-semibold text-[var(--v2-accent)]">{t("hero.title_emphasis")}</em>
                {t("hero.title_part2")}
              </span>
            </h1>
            <p className="v2-hero-in max-w-[600px] text-[16px] leading-[1.6] text-[var(--v2-muted)] lg:text-[18px]" style={{ animationDelay: "160ms" }}>
              {t("hero.sub")}
            </p>
            <div className="v2-hero-in flex w-full flex-col gap-3 sm:w-auto sm:flex-row" style={{ animationDelay: "240ms" }}>
              <Link
                href={{ pathname: "/intro", query: { interes: tc("interes", { ciudad: config.city }) } }}
                className="v2-btn v2-btn--primary h-12 w-full sm:h-[46px] sm:w-auto"
              >
                {tc("cta")}
              </Link>
              <WhatsAppButton source={config.slug} message={t("hero.whatsappMessage")} variant="v2" className="h-12 w-full sm:h-[46px] sm:w-auto" />
            </div>
            <ProofRow locale={locale} className="v2-hero-in mt-2" style={{ animationDelay: "320ms" }} />
          </div>
          <div className="v2-hero-in lg:col-span-5" style={{ animationDelay: "200ms" }}>
            <div className="mx-auto max-w-[420px] lg:ml-auto lg:mr-0">
              <FichaGoogle locale={locale} />
            </div>
          </div>
        </div>
      </section>

      <LogoCells />

      {/* ── Casos de aquí ── */}
      {casos.length > 0 && (
        <section className="v2-frame">
          <div className="v2-rail">
            <LineaArriba />
            <div className="flex flex-col items-start justify-between gap-5 px-6 py-14 md:flex-row md:items-end md:px-10 lg:py-16">
              <div className="flex flex-col gap-4">
                <span className="v2-label" data-reveal>
                  {sinBarras(t("projects.label"))}
                </span>
                <h2 className="v2-h2" data-reveal>
                  {t("projects.title_part1")}
                  <em className="font-display italic font-semibold text-[var(--v2-accent)]">{t("projects.title_emphasis")}</em>
                  {t("projects.title_part2")}
                </h2>
              </div>
              <Link href="/work" className="v2-link" data-reveal>
                {tc("casosCta")} <ArrowRight size={14} className="text-[var(--v2-accent)]" />
              </Link>
            </div>
            <div className="grid grid-cols-1 gap-4 border-t border-[var(--v2-line)] p-4 sm:grid-cols-2 md:p-6 xl:grid-cols-4">
              {casos.map((p) => (
                <div key={p.slug} className="flex" data-reveal>
                  <TarjetaTrabajo p={p} video={VIDEO_CASO[p.slug]} verCaso={tc("verCaso")} />
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ── Por qué un estudio de aquí (banda negra) ── */}
      <section data-header-tone="dark" className="v2-oscuro">
        <div className="v2-frame">
          <div className="v2-rail grid grid-cols-1 lg:grid-cols-12">
            <div className="border-b border-[var(--v2-line)] p-6 md:p-10 lg:col-span-5 lg:border-b-0 lg:border-r lg:p-14">
              <div className="flex flex-col gap-5 lg:sticky lg:top-28">
                <span className="v2-label" data-reveal>
                  {sinBarras(t("why.label"))}
                </span>
                <h2 className="v2-h2" data-reveal>
                  {t("why.title_part1")}
                  <em className="font-display italic font-semibold text-[var(--v2-accent)]">{t("why.title_emphasis")}</em>
                  {t("why.title_part2")}
                </h2>
              </div>
            </div>
            <ol className="lg:col-span-7">
              {razones.map((k, i) => (
                <li key={k} className="flex gap-6 border-b border-[var(--v2-line)] p-6 last:border-b-0 md:gap-10 md:p-10" data-reveal>
                  <span className="font-mono text-[12px] text-[var(--v2-accent)]">{String(i + 1).padStart(2, "0")}</span>
                  <div className="flex flex-col gap-2">
                    <h3 className="text-[20px] font-medium tracking-[-0.01em] md:text-[22px]">{t(`why.items.${k}.title`)}</h3>
                    <p className="max-w-[520px] text-[15px] leading-[1.6] text-[var(--v2-muted)]">{t(`why.items.${k}.body`)}</p>
                  </div>
                </li>
              ))}
            </ol>
          </div>
        </div>
      </section>

      <ServicioRelacionados locale={locale} ns="v2Local.common" claves={["s01", "s02", "seo", "marca", "s03", "s05"]} />
      <TestimonialsV2 />
      <FaqV2 ns={`v2Local.${clave}.faq`} />
      <ClosingBand />
    </PaginaServicio>
  );
}
