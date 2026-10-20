import type { Metadata } from "next";
import { ArrowRight, ArrowUpRight, Star } from "lucide-react";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { Link } from "@/navigation";
import { getProjects } from "@/lib/cms/projects";
import { ProofRow } from "@/components/v2/home/ProofRow";
import { LogoCells } from "@/components/v2/home/LogoCells";
import { ClosingBand } from "@/components/v2/home/ClosingBand";
import { PaginaServicio } from "@/components/v2/servicio/PaginaServicio";
import { LineaArriba } from "@/components/v2/servicio/Secciones";
import { VideosClientes, type VideoCliente } from "@/components/v2/clientes/VideosClientes";

/*
 * Clientes (la «Love» de la V1) con el estilo de la V2. Misma estructura, que
 * funciona: los dos vídeos, las cifras en una banda negra, las frases sin
 * editar, los resultados con enlace a cada caso y Google. Mismos textos
 * (lovePage); las etiquetas pierden el «// » de la V1.
 */

/** Las caras que tenemos de quien dejó su frase (lovePage.mosaic). */
const CARAS: Record<string, string> = {
  t1: "/caras/javier-flores-face.png",
  t2: "/caras/adela-face.png",
  t3: "/caras/themis-face.png",
  t8: "/caras/cara-teleadhesivo.jpg",
};

const sinBarras = (s: string) => s.replace(/^\/\/\s*/, "");

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "lovePage" });
  const tn = await getTranslations({ locale, namespace: "nav" });
  return { title: `${tn("clients")} · Bellostas Studio`, description: t("metaDescription") };
}

export default async function ClientesV2({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: "lovePage" });
  const tv = await getTranslations({ locale, namespace: "videoTestimonial" });
  const tn = await getTranslations({ locale, namespace: "nav" });
  const proyectos = await getProjects(locale);
  const conCaso = new Set(proyectos.filter((p) => !p.comingSoon).map((p) => p.slug));

  const fv = t.raw("featuredVideos.items") as { name: string; role: string; company: string; quote: string }[];
  // En los textos van Javier y Themis; aquí va primero Themis. Los vídeos, por nombre.
  const ORDEN: Record<string, number> = { themis: 0, javier: 1 };
  const videos: VideoCliente[] = fv
    .flatMap((v) => {
      const id = /javier/i.test(v.name) ? "javier" : /themis/i.test(v.name) ? "themis" : null;
      return id ? [{ id, ...v } as VideoCliente] : [];
    })
    .sort((a, b) => ORDEN[a.id] - ORDEN[b.id]);
  const cifras = t.raw("numbers.items") as { value: string; label: string }[];
  const frases = t.raw("mosaic.items") as Record<string, { name: string; role: string; company: string; quote: string }>;
  const resultados = t.raw("results.items") as { metric: string; label: string; client: string; description: string; projectSlug?: string }[];
  const google = t("google.googleProfileUrl");

  const Titular = ({ ns, centro = true }: { ns: string; centro?: boolean }) => (
    <div className={`flex flex-col gap-5 ${centro ? "items-center px-6 py-20 text-center lg:py-24" : ""}`}>
      <span className="v2-label" data-reveal>
        {sinBarras(t(`${ns}.label`))}
      </span>
      <h2 className={`v2-h2 ${centro ? "max-w-[820px]" : ""}`} data-reveal>
        {t(`${ns}.title_part1`)}
        <em className="font-display italic font-semibold text-[var(--v2-accent)]">{t(`${ns}.title_emphasis`)}</em>
        {t(`${ns}.title_part2`)}
      </h2>
      {t.has(`${ns}.sub`) && (
        <p className={`text-[16px] leading-[1.6] text-[var(--v2-muted)] ${centro ? "max-w-[560px]" : "max-w-[420px]"}`} data-reveal>
          {t(`${ns}.sub`)}
        </p>
      )}
    </div>
  );

  return (
    <PaginaServicio locale={locale} proyectos={proyectos}>
      {/* ── Hero ── */}
      <section className="v2-frame">
        <div className="flex flex-col items-center gap-7 px-6 pb-16 pt-14 text-center md:px-10 lg:pb-20 lg:pt-24">
          <span className="v2-label v2-hero-in flex items-center gap-2.5">
            <span aria-hidden className="h-1.5 w-1.5 rounded-full bg-[var(--v2-accent)]" />
            {tn("clients")}
          </span>
          <h1
            className="v2-hero-in v2-h1 max-w-[980px]"
            style={{ animationDelay: "80ms" }}
          >
            {/* «no estoy escuchando» siempre en la segunda línea. */}
            <span className="block">{t("hero.title_part1").trim()}</span>
            <span className="block">
              <em className="font-display italic font-semibold text-[var(--v2-accent)]">{t("hero.title_emphasis")}</em>
              {t("hero.title_part2")}
            </span>
          </h1>
          <p className="v2-hero-in max-w-[600px] text-[16px] leading-[1.6] text-[var(--v2-muted)] lg:text-[18px]" style={{ animationDelay: "160ms" }}>
            {t("hero.sub")}
          </p>
          <div className="v2-hero-in flex flex-col items-center gap-5" style={{ animationDelay: "240ms" }}>
            <ProofRow locale={locale} className="justify-center" />
            <a href={google} target="_blank" rel="noopener" className="v2-link text-[var(--v2-muted)] hover:text-[var(--v2-text)]">
              {t("hero.googleCta")} <ArrowUpRight size={14} className="text-[var(--v2-accent)]" />
            </a>
          </div>
        </div>
      </section>

      <LogoCells />

      {/* ── En sus palabras: los vídeos ── */}
      {videos.length > 0 && (
        <section className="v2-frame">
          <div className="v2-rail grid grid-cols-1 lg:grid-cols-12">
            <LineaArriba />
            <div className="flex flex-col justify-between gap-8 border-b border-[var(--v2-line)] p-6 md:p-10 lg:col-span-4 lg:border-b-0 lg:border-r lg:p-12">
              <Titular ns="featuredVideos" centro={false} />
              <span className="v2-label" data-reveal>
                {videos.length} {t("featuredVideos.indexMeta")}
              </span>
            </div>
            <div className="lg:col-span-8">
              <VideosClientes videos={videos} etiqueta={tv("badge")} />
            </div>
          </div>
        </section>
      )}

      {/* ── Las cifras, en banda negra ── */}
      <section data-header-tone="dark" className="v2-oscuro">
        <div className="v2-frame">
          <div className="v2-rail">
            <div className="px-6 pt-14 md:px-10">
              <span className="v2-label">{sinBarras(t("numbers.label"))}</span>
            </div>
            <div className="mt-8 grid grid-cols-2 gap-px border-y border-[var(--v2-line)] bg-[var(--v2-line)] lg:grid-cols-4">
              {cifras.map((c) => (
                <div key={c.label} className="flex flex-col gap-3 bg-[var(--v2-bg)] p-6 md:p-10" data-reveal>
                  <span className="text-[44px] font-medium leading-none tracking-[-0.045em] tabular-nums md:text-[64px]">{c.value}</span>
                  <span className="text-[14px] text-[var(--v2-muted)]">{c.label}</span>
                </div>
              ))}
            </div>
            <div className="h-14" />
          </div>
        </div>
      </section>

      {/* ── Sin filtro: las frases, en mosaico ── */}
      <section className="v2-frame">
        <div className="v2-rail">
          <Titular ns="mosaic" />
          <div className="border-t border-[var(--v2-line)] p-4 md:p-8">
            <div className="columns-1 gap-4 md:columns-2 md:gap-5 lg:columns-3">
              {Object.entries(frases).map(([k, f]) => (
                <figure key={k} className="v2-card mb-4 flex break-inside-avoid flex-col gap-6 p-6 md:mb-5 md:p-7" data-reveal>
                  <span aria-hidden className="flex gap-0.5 text-[var(--v2-accent)]">
                    {Array.from({ length: 5 }, (_, i) => (
                      <Star key={i} size={13} fill="currentColor" strokeWidth={0} />
                    ))}
                  </span>
                  <blockquote className="text-[17px] leading-[1.5] tracking-[-0.005em]">“{f.quote}”</blockquote>
                  <figcaption className="flex items-center gap-3 border-t border-[var(--v2-line)] pt-5">
                    {CARAS[k] ? (
                      <img src={CARAS[k]} alt="" width={40} height={40} loading="lazy" className="h-10 w-10 rounded-full object-cover" />
                    ) : (
                      <span aria-hidden className="flex h-10 w-10 items-center justify-center rounded-full bg-[var(--v2-hover)] text-[14px] font-medium">
                        {f.name
                          .split(" ")
                          .map((x) => x[0])
                          .slice(0, 2)
                          .join("")}
                      </span>
                    )}
                    <span className="flex flex-col">
                      <span className="text-[14.5px] font-medium">{f.name}</span>
                      <span className="text-[13px] text-[var(--v2-muted)]">
                        {f.role} · {f.company}
                      </span>
                    </span>
                  </figcaption>
                </figure>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── Resultados ── */}
      <section className="v2-frame">
        <div className="v2-rail">
          <LineaArriba />
          <Titular ns="results" />
          <div className="grid grid-cols-1 gap-px border-t border-[var(--v2-line)] bg-[var(--v2-line)] sm:grid-cols-2 lg:grid-cols-4">
            {resultados.map((r) => {
              const enlace = r.projectSlug && conCaso.has(r.projectSlug);
              const cuerpo = (
                <>
                  <span className="text-[44px] font-medium leading-none tracking-[-0.045em] tabular-nums md:text-[52px]">{r.metric}</span>
                  <span className="v2-label">{r.label}</span>
                  <span className="mt-2 text-[17px] font-medium">{r.client}</span>
                  <span className="text-[14.5px] leading-[1.55] text-[var(--v2-muted)]">{r.description}</span>
                  {enlace && (
                    <span className="mt-auto inline-flex items-center gap-2 pt-4 text-[14px] font-medium">
                      {t("results.viewCase")}
                      <span className="v2-ico">
                        <ArrowRight size={13} />
                      </span>
                    </span>
                  )}
                </>
              );
              return enlace ? (
                <Link
                  key={r.client}
                  href={{ pathname: "/work/[slug]", params: { slug: r.projectSlug! } }}
                  className="v2-celda flex flex-col gap-3 bg-[var(--v2-bg)] p-6 transition-colors hover:bg-[var(--v2-hover)] md:p-8"
                  data-reveal
                >
                  {cuerpo}
                </Link>
              ) : (
                <div key={r.client} className="flex flex-col gap-3 bg-[var(--v2-bg)] p-6 md:p-8" data-reveal>
                  {cuerpo}
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── Google ── */}
      <section className="v2-frame">
        <div className="v2-rail">
          <LineaArriba />
          <div className="flex flex-col items-center gap-6 px-6 py-20 text-center lg:py-24" data-reveal>
            <span className="v2-label">{sinBarras(t("google.label"))}</span>
            <span className="flex items-center gap-3">
              <svg viewBox="0 0 24 24" className="h-7 w-7" aria-hidden>
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.27-4.74 3.27-8.1z" />
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84A11 11 0 0 0 12 23z" />
                <path fill="#FBBC05" d="M5.84 14.09A6.6 6.6 0 0 1 5.49 12c0-.73.13-1.43.35-2.09V7.07H2.18A11 11 0 0 0 1 12c0 1.78.43 3.45 1.18 4.93l3.66-2.84z" />
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1A11 11 0 0 0 2.18 7.07l3.66 2.84C6.71 7.31 9.14 5.38 12 5.38z" />
              </svg>
              <span aria-hidden className="flex gap-0.5 text-[#FBBC05]">
                {Array.from({ length: 5 }, (_, i) => (
                  <Star key={i} size={20} fill="currentColor" strokeWidth={0} />
                ))}
              </span>
            </span>
            <h2 className="v2-h2">
              {t("google.title_part1")}
              <em className="font-display italic font-semibold text-[var(--v2-accent)]">{t("google.title_emphasis")}</em>
              {t("google.title_part2")}
            </h2>
            <p className="max-w-[480px] text-[16px] leading-[1.6] text-[var(--v2-muted)]">{t("google.sub")}</p>
            <a href={google} target="_blank" rel="noopener" className="v2-btn v2-btn--ghost">
              {t("google.ctaText")} <ArrowUpRight size={14} />
            </a>
          </div>
        </div>
      </section>

      <ClosingBand />
    </PaginaServicio>
  );
}
