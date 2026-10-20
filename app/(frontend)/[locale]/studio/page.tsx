import type { Metadata } from "next";
import { ArrowRight } from "lucide-react";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { Link } from "@/navigation";
import { getProjects } from "@/lib/cms/projects";
import { ProofRow } from "@/components/v2/home/ProofRow";
import { ClosingBand } from "@/components/v2/home/ClosingBand";
import { PaginaServicio } from "@/components/v2/servicio/PaginaServicio";
import { LineaArriba } from "@/components/v2/servicio/Secciones";
import { VideoCaso } from "@/components/v2/trabajos/PiezasCaso";

/*
 * El estudio, con el estilo de la V2. Mismos bloques que la de la V1 (que
 * funcionan) y mismos textos (studioPage y manifesto): quiénes somos con el
 * vídeo de la oficina, la historia de 2016 a hoy, el manifiesto en banda
 * negra (entre dos secciones claras) y el espacio.
 *
 */

const sinBarras = (s: string) => s.replace(/^\/\/\s*/, "");

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "v2Estudio" });
  const ts = await getTranslations({ locale, namespace: "studioPage" });
  return { title: `${t("metaTitle")}`, description: ts("metaDescription") };
}

type Hito = { year: string; title: string; body: string };
type Regla = { n: string; title: string; body: string[]; punch: string | null };

export default async function EstudioV2({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: "studioPage" });
  const te = await getTranslations({ locale, namespace: "v2Estudio" });
  const tm = await getTranslations({ locale, namespace: "manifesto" });
  const tn = await getTranslations({ locale, namespace: "nav" });
  const proyectos = await getProjects(locale);

  const hitos = t.raw("timeline.milestones") as Hito[];
  const reglas = tm.raw("rules") as Regla[];
  // El orden del recorrido: por qué existimos, cómo pensamos, cómo trabajamos,
  // con quién y cómo empezamos (01 realidad, 03 ethos, 02 método, 04 perfil, 05 siguiente paso).
  const recorrido = ["01", "03", "02", "04", "05"].flatMap((n) => reglas.filter((r) => r.n === n));

  /** Etiqueta y titular con la palabra en cursiva roja, como en el resto de la V2. */
  const Titular = ({ ns, src = t, centro = true }: { ns: string; src?: typeof t; centro?: boolean }) => (
    <div className={`flex flex-col gap-5 ${centro ? "items-center px-6 py-20 text-center lg:py-24" : ""}`}>
      <span className="v2-label" data-reveal>
        {sinBarras(src(`${ns}.label`))}
      </span>
      <h2 className={`v2-h2 ${centro ? "max-w-[820px]" : ""}`} data-reveal>
        {src(`${ns}.title_part1`)}
        <em className="font-display italic font-semibold text-[var(--v2-accent)]">{src(`${ns}.title_emphasis`)}</em>
        {src(`${ns}.title_part2`)}
      </h2>
      {src.has(`${ns}.sub`) && (
        <p className={`text-[16px] leading-[1.6] text-[var(--v2-muted)] ${centro ? "max-w-[560px]" : "max-w-[420px]"}`} data-reveal>
          {src(`${ns}.sub`)}
        </p>
      )}
    </div>
  );

  return (
    <PaginaServicio locale={locale} proyectos={proyectos}>
      {/* ── Hero: quiénes somos y la oficina en vídeo ── */}
      <section className="v2-frame">
        <div className="grid grid-cols-1 items-center gap-10 px-5 pb-16 pt-12 md:px-0 lg:grid-cols-12 lg:gap-12 lg:pb-20 lg:pt-16">
          <div className="flex flex-col gap-7 lg:col-span-7">
            <span className="v2-label v2-hero-in flex items-center gap-2.5">
              <span aria-hidden className="h-1.5 w-1.5 rounded-full bg-[var(--v2-accent)]" />
              {te("label")}
            </span>
            <h1
              className="v2-hero-in v2-h1"
              style={{ animationDelay: "80ms" }}
            >
              {t("hero.title_part1")}
              <em className="font-display italic font-semibold text-[var(--v2-accent)]">{t("hero.title_emphasis")}</em>
              {t("hero.title_part2")}
            </h1>
            <p className="v2-hero-in max-w-[560px] text-[16px] leading-[1.6] text-[var(--v2-muted)] lg:text-[18px]" style={{ animationDelay: "160ms" }}>
              {t("hero.sub")}
            </p>
            <div className="v2-hero-in flex flex-col gap-3 sm:flex-row" style={{ animationDelay: "240ms" }}>
              <Link href="/intro" className="v2-btn v2-btn--primary h-12 sm:h-[46px]">
                {tn("cta")}
              </Link>
              <Link href="/proceso" className="v2-btn v2-btn--ghost h-12 sm:h-[46px]">
                {te("ctaProceso")} <ArrowRight size={14} />
              </Link>
            </div>
            <ProofRow locale={locale} className="v2-hero-in mt-2" style={{ animationDelay: "320ms" }} />
          </div>
          <div className="v2-hero-in lg:col-span-5" style={{ animationDelay: "200ms" }}>
            <div className="relative mx-auto aspect-[4/5] max-w-[460px] overflow-hidden rounded-[8px] border border-[var(--v2-line)] bg-[var(--v2-band)]">
              <VideoCaso src="/studio/oficina.mp4" poster="/studio/oficina-poster.jpg" />
              <span className="absolute bottom-3 left-3 bg-black/55 px-2 py-1 font-mono text-[10px] uppercase tracking-[0.12em] text-white">
                {t("hero.photoCaption")}
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* ── La historia: un año por fila ── */}
      <section className="v2-frame">
        <div className="v2-rail grid grid-cols-1 lg:grid-cols-12">
          <LineaArriba />
          <div className="border-b border-[var(--v2-line)] p-6 md:p-10 lg:col-span-4 lg:border-b-0 lg:border-r lg:p-12">
            <div className="lg:sticky lg:top-28">
              <Titular ns="timeline" centro={false} />
            </div>
          </div>
          <ol className="lg:col-span-8">
            {hitos.map((h, i) => (
              <li
                key={h.year}
                className="v2-celda grid grid-cols-1 gap-3 border-b border-[var(--v2-line)] px-6 py-8 transition-colors last:border-b-0 hover:bg-[var(--v2-hover)] sm:grid-cols-12 sm:gap-8 md:px-10 md:py-10"
                data-reveal
              >
                <span
                  className={`text-[44px] font-medium leading-none tracking-[-0.045em] tabular-nums sm:col-span-4 md:text-[56px] ${
                    i === hitos.length - 1 ? "text-[var(--v2-accent)]" : ""
                  }`}
                >
                  {h.year}
                </span>
                <span className="flex flex-col gap-2 sm:col-span-8">
                  <span className="text-[19px] font-medium tracking-[-0.01em]">{h.title}</span>
                  <span className="text-[15px] leading-[1.6] text-[var(--v2-muted)]">{h.body}</span>
                  {/* Hoy: la acreditación del AI Summit Barcelona. */}
                  {i === hitos.length - 1 && (
                    <figure className="mt-4 flex items-center gap-4">
                      <span className="relative block aspect-[3/4] w-24 shrink-0 overflow-hidden rounded-[6px] border border-[var(--v2-line)] md:w-28">
                        <img src="/images/ai-summit-barcelona.jpg" alt={te("fotos.summit")} loading="lazy" className="absolute inset-0 h-full w-full object-cover" />
                      </span>
                      <figcaption className="flex flex-col gap-1">
                        <span className="v2-label">{te("summit.etiqueta")}</span>
                        <span className="text-[14.5px] leading-[1.5]">{te("summit.texto")}</span>
                      </figcaption>
                    </figure>
                  )}
                </span>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* ── El manifiesto, en banda negra: un recorrido (por qué existimos →
          cómo pensamos → cómo trabajamos → con quién → cómo empezamos), con el
          título y la llamada fijos a la izquierda. ── */}
      <section data-header-tone="dark" className="v2-oscuro">
        <div className="v2-frame">
          <div className="v2-rail grid grid-cols-1 lg:grid-cols-12">
            <div className="border-b border-[var(--v2-line)] p-6 md:p-10 lg:col-span-5 lg:border-b-0 lg:border-r lg:p-14">
              <div className="flex flex-col gap-6 lg:sticky lg:top-28">
                <span className="v2-label" data-reveal>
                  {sinBarras(tm("label"))}
                </span>
                <h2 className="v2-h2" data-reveal>
                  {tm("intro_title_part1")}
                  <em className="font-display italic font-semibold text-[var(--v2-accent)]">{tm("intro_title_emphasis")}</em>
                  {tm("intro_title_part2")}
                </h2>
                <p className="max-w-[420px] text-[16px] leading-[1.6] text-[var(--v2-muted)]" data-reveal>
                  {tm("intro_sub")}
                </p>
                <Link href="/intro" className="v2-btn v2-btn--primary mt-2 self-start" data-reveal>
                  {tm("cta")} <ArrowRight size={14} />
                </Link>
                <span className="font-mono text-[11px] uppercase tracking-[0.14em] text-[var(--v2-faint)]">{sinBarras(tm("footnote"))}</span>
              </div>
            </div>
            <ol className="lg:col-span-7">
              {recorrido.map((r, k) => (
                <li key={r.n} className="flex flex-col gap-4 border-b border-[var(--v2-line)] p-6 last:border-b-0 md:p-10 lg:p-12" data-reveal>
                  <span className="flex items-center gap-3">
                    <span className="font-mono text-[11px] text-[var(--v2-accent)]">{String(k + 1).padStart(2, "0")}</span>
                    <span aria-hidden className="h-px w-6 bg-[var(--v2-line-strong)]" />
                    <span className="v2-label">{te(`manifiesto.${r.n}`)}</span>
                  </span>
                  <h3 className="text-[26px] font-medium tracking-[-0.02em] md:text-[30px]">{r.title}</h3>
                  <div className="flex flex-col gap-2.5">
                    {r.body.map((b) => (
                      <p key={b} className="max-w-[560px] text-[16px] leading-[1.6] text-[var(--v2-muted)]">
                        {b}
                      </p>
                    ))}
                  </div>
                  {r.punch && <p className="font-display text-[21px] italic text-[var(--v2-accent)]">{r.punch}</p>}
                </li>
              ))}
            </ol>
          </div>
        </div>
      </section>

      {/* ── El espacio: fotos y el timelapse del cartel ── */}
      <section className="v2-frame">
        <div className="v2-rail">
          <LineaArriba />
          <Titular ns="gallery" />
          <div className="grid grid-cols-2 gap-3 border-t border-[var(--v2-line)] p-3 md:gap-4 md:p-6 lg:grid-cols-4 lg:grid-rows-2">
            <Foto src="/images/estudio-mesa.webp" alt={te("fotos.mesa")} className="col-span-2 aspect-[4/3] lg:row-span-2 lg:aspect-auto" />
            <div className="relative row-span-2 aspect-[9/16] overflow-hidden rounded-[8px] border border-[var(--v2-line)] bg-[var(--v2-band)] lg:aspect-auto" data-reveal>
              <VideoCaso src="/studio/sign-timelapse.mp4" poster="/studio/sign-timelapse-poster.jpg" />
              <span className="absolute bottom-3 left-3 bg-black/55 px-2 py-1 font-mono text-[10px] uppercase tracking-[0.12em] text-white">
                {t("gallery.videoBadge")}
              </span>
            </div>
            {/* Las dos de la derecha: el portátil con la marca y la edición de vídeo. */}
            <Foto src="/images/estudio-portatil.jpg" alt={te("fotos.portatil")} className="aspect-square" posicion="object-[50%_62%]" />
            <Foto src="/images/estudio-edicion.jpg" alt={te("fotos.edicion")} className="aspect-square" posicion="object-[50%_45%]" />
          </div>
        </div>
      </section>

      <ClosingBand />
    </PaginaServicio>
  );
}

function Foto({ src, alt, className, posicion = "" }: { src: string; alt: string; className: string; posicion?: string }) {
  return (
    <div className={`relative overflow-hidden rounded-[8px] border border-[var(--v2-line)] bg-[var(--v2-bg-2)] ${className}`} data-reveal>
      <img src={src} alt={alt} loading="lazy" className={`absolute inset-0 h-full w-full object-cover ${posicion} transition-transform duration-[900ms] ease-[var(--v2-ease)] hover:scale-[1.03]`} />
    </div>
  );
}
