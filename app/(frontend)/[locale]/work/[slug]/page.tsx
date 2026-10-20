import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowUpRight, Check } from "lucide-react";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { Link } from "@/navigation";
import { getProjects } from "@/lib/cms/projects";
import { IMAGENES_CASO, VIDEO_CASO, conPortada } from "@/lib/v2/videos-casos";
import { TESTIMONIO_CASO } from "@/lib/v2/testimonios-casos";
import { ClosingBand } from "@/components/v2/home/ClosingBand";
import { PaginaServicio } from "@/components/v2/servicio/PaginaServicio";
import { LineaArriba } from "@/components/v2/servicio/Secciones";
import { TarjetaTrabajo } from "@/components/v2/trabajos/RejillaTrabajos";
import { BarraCaso, BotonVideoTestimonio, VideoCaso } from "@/components/v2/trabajos/PiezasCaso";

/*
 * La página de cada caso en la V2 (sustituye a la ficha emergente), con la
 * estructura de los casos de DesignMe: titular, cifras y lo que dijo el
 * cliente, el vídeo o la portada en grande, el proyecto con sus datos, las
 * capturas, más casos y la banda final. Una barra fija abajo deja siempre a
 * mano el cliente, el año y la llamada.
 *
 * Todo sale del proyecto en el gestor (nombre, tipo, año, tecnología, web,
 * portada, galería) y de los vídeos y reseñas que ya tenemos. Lo que solo
 * algunos casos tienen (titular propio, cifras, «qué hicimos») está en
 * messages → v2Casos.casos.[slug]; si un caso no lo tiene, ese bloque no sale.
 */

type Extra = { titular?: string; intro?: string; cifras?: { valor: string; texto: string }[]; hicimos?: string[] };

async function buscar(locale: string, slug: string) {
  const proyectos = conPortada(await getProjects(locale));
  const listos = proyectos.filter((p) => !p.comingSoon);
  const i = listos.findIndex((p) => p.slug === slug);
  return { proyectos, listos, i, p: i >= 0 ? listos[i] : null };
}

export async function generateMetadata({ params }: { params: Promise<{ locale: string; slug: string }> }): Promise<Metadata> {
  const { locale, slug } = await params;
  const { p } = await buscar(locale, slug);
  if (!p) return {};
  return {
    title: `${p.name} · ${locale === "es" ? "Caso de éxito" : "Case study"} · Bellostas Studio`,
    description: p.description,
  };
}

export default async function CasoPagina({ params }: { params: Promise<{ locale: string; slug: string }> }) {
  const { locale, slug } = await params;
  setRequestLocale(locale);
  const { proyectos, listos, i, p } = await buscar(locale, slug);
  if (!p) notFound();

  const t = await getTranslations({ locale, namespace: "v2Casos" });
  const extra: Extra = t.has(`casos.${slug}`) ? (t.raw(`casos.${slug}`) as Extra) : {};
  const etiquetas = p.category
    .split("·")
    .map((c) => c.trim())
    .filter(Boolean);
  const video = VIDEO_CASO[p.slug];
  const galeria: { src: string; alt?: string; etiqueta?: string }[] = IMAGENES_CASO[p.slug]?.galeria ?? p.gallery ?? [];
  const imagen = p.cover ?? p.gallery?.[0]?.src;

  // Lo que dijo el cliente, si lo dijo.
  const tc = TESTIMONIO_CASO[p.slug];
  let cita: { quote: string; name: string; role: string; company: string; cara?: string } | null = null;
  if (tc) {
    const tt = await getTranslations({ locale, namespace: tc.ns });
    if (tt.has(`${tc.clave}.quote`)) {
      cita = {
        quote: tt(`${tc.clave}.quote`),
        name: tt(`${tc.clave}.name`),
        role: tt(`${tc.clave}.role`),
        company: tt(`${tc.clave}.company`),
        cara: tc.cara,
      };
    }
  }

  // Los tres siguientes casos, empezando por el que va detrás de este.
  const mas = Array.from({ length: Math.min(3, listos.length - 1) }, (_, k) => listos[(i + 1 + k) % listos.length]);
  const num = (n: number) => String(n).padStart(2, "0");
  const dominio = p.liveUrl?.replace(/^https?:\/\/(www\.)?/, "").replace(/\/$/, "");
  let seccion = 0;

  return (
    <PaginaServicio locale={locale} proyectos={proyectos}>
      {/* ── Titular ── */}
      <section className="v2-frame">
        <div className="flex flex-col gap-7 px-5 pb-14 pt-10 md:px-0 lg:pb-16 lg:pt-14">
          <Link href="/work" className="v2-link v2-hero-in self-start text-[var(--v2-muted)] hover:text-[var(--v2-text)]">
            <ArrowLeft size={14} /> {t("volver")}
          </Link>
          <div className="v2-hero-in flex flex-wrap items-center gap-2" style={{ animationDelay: "40ms" }}>
            <span className="v2-label mr-1 flex items-center gap-2.5">
              <span aria-hidden className="h-1.5 w-1.5 rounded-full bg-[var(--v2-accent)]" />
              {t("label")} · {p.name}
            </span>
            {etiquetas.map((e) => (
              <span key={e} className="rounded-[4px] bg-[var(--v2-hover)] px-2 py-0.5 text-[12px] text-[var(--v2-muted)]">
                {e}
              </span>
            ))}
          </div>
          <h1
            className="v2-hero-in v2-h1 v2-h1--doc max-w-[1000px]"
            style={{ animationDelay: "80ms" }}
          >
            {extra.titular ?? p.name}
          </h1>
          <p
            className="v2-hero-in max-w-[680px] text-[17px] leading-[1.6] text-[var(--v2-muted)] lg:text-[19px]"
            style={{ animationDelay: "140ms" }}
          >
            {extra.intro ?? p.description}
          </p>
          <div className="v2-hero-in flex flex-wrap gap-3" style={{ animationDelay: "200ms" }}>
            {p.liveUrl && (
              <a href={p.liveUrl} target="_blank" rel="noopener" className="v2-btn v2-btn--ghost">
                {t("verWeb")} <ArrowUpRight size={15} />
              </a>
            )}
            <Link href={{ pathname: "/intro", query: { interes: `${t("label")} ${p.name}` } }} className="v2-btn v2-btn--primary">
              {t("hablemos")}
            </Link>
          </div>
        </div>
      </section>

      {/* ── Cifras y lo que dijo el cliente ── */}
      {(extra.cifras?.length || cita) && (
        <section className="v2-frame">
          <div className="v2-rail grid grid-cols-1 lg:grid-cols-12">
            <LineaArriba />
            {extra.cifras?.length ? (
              <div
                className={`grid grid-cols-1 gap-px bg-[var(--v2-line)] sm:grid-cols-2 lg:grid-cols-1 ${cita ? "lg:col-span-5" : "lg:col-span-12 lg:grid-cols-3"}`}
              >
                {extra.cifras.map((c) => (
                  <div key={c.texto} className="flex flex-col gap-2 bg-[var(--v2-bg)] p-6 md:p-8" data-reveal>
                    <span className="text-[40px] font-medium leading-none tracking-[-0.04em] tabular-nums md:text-[48px]">{c.valor}</span>
                    <span className="max-w-[340px] text-[14.5px] leading-[1.5] text-[var(--v2-muted)]">{c.texto}</span>
                  </div>
                ))}
              </div>
            ) : null}
            {cita && (
              <figure
                className={`flex flex-col justify-between gap-8 border-t border-[var(--v2-line)] bg-[var(--v2-bg-2)] p-6 md:p-10 lg:border-t-0 ${
                  extra.cifras?.length ? "lg:col-span-7 lg:border-l" : "lg:col-span-12"
                }`}
                data-reveal
              >
                <blockquote className="text-[22px] font-medium leading-[1.35] tracking-[-0.015em] md:text-[26px]">“{cita.quote}”</blockquote>
                <figcaption className="flex flex-wrap items-center justify-between gap-4 border-t border-[var(--v2-line)] pt-6">
                  <span className="flex items-center gap-3">
                    {cita.cara ? (
                      <img src={cita.cara} alt="" width={44} height={44} className="h-11 w-11 rounded-full object-cover" />
                    ) : (
                      <span aria-hidden className="flex h-11 w-11 items-center justify-center rounded-full bg-[var(--v2-hover)] text-[15px] font-medium">
                        {cita.name.charAt(0)}
                      </span>
                    )}
                    <span className="flex flex-col">
                      <span className="text-[15px] font-medium">{cita.name}</span>
                      <span className="text-[13.5px] text-[var(--v2-muted)]">
                        {cita.role} · {cita.company}
                      </span>
                    </span>
                  </span>
                  {tc?.video && (
                    <BotonVideoTestimonio id={tc.video} etiqueta={t("verVideo")} nombre={cita.name} cargo={cita.role} empresa={cita.company} />
                  )}
                </figcaption>
              </figure>
            )}
          </div>
        </section>
      )}

      {/* ── El vídeo o la portada, en grande ── */}
      <section className="v2-frame">
        <div className="v2-rail p-3 md:p-6">
          <LineaArriba />
          <div
            className="relative aspect-[4/3] overflow-hidden rounded-[8px] border border-[var(--v2-line)] md:aspect-[16/9]"
            style={{ backgroundColor: p.color }}
            data-reveal="fade"
          >
            {video ? (
              <VideoCaso src={video} poster={imagen} />
            ) : imagen ? (
              <img src={imagen} alt={p.name} className="absolute inset-0 h-full w-full object-cover object-left-top" />
            ) : p.logo ? (
              <span className="absolute inset-0 flex items-center justify-center p-16">
                <img src={p.logo} alt={p.name} className="max-h-24 w-auto max-w-[60%] object-contain" />
              </span>
            ) : (
              <span className="absolute inset-0 flex items-center justify-center text-[40px] font-medium text-white/85">{p.name}</span>
            )}
          </div>
        </div>
      </section>

      {/* ── El proyecto ── */}
      <Apartado n={num(++seccion)} titulo={t("secciones.proyecto")}>
        <p className="text-[18px] font-medium leading-[1.55] tracking-[-0.01em] md:text-[20px]">{p.description}</p>
        <dl className="flex flex-col border-t border-[var(--v2-line)]">
          {[
            { k: t("datos.cliente"), v: p.client || p.name },
            { k: t("datos.sector"), v: etiquetas.join(" · ") },
            { k: t("datos.ano"), v: p.year ? String(p.year) : "" },
            { k: t("datos.tecnologia"), v: p.stack.join(" · ") },
          ]
            .filter((d) => d.v)
            .map((d) => (
              <div key={d.k} className="grid grid-cols-3 gap-4 border-b border-[var(--v2-line)] py-3.5 text-[15px]">
                <dt className="text-[var(--v2-muted)]">{d.k}</dt>
                <dd className="col-span-2">{d.v}</dd>
              </div>
            ))}
          {p.liveUrl && (
            <div className="grid grid-cols-3 gap-4 border-b border-[var(--v2-line)] py-3.5 text-[15px]">
              <dt className="text-[var(--v2-muted)]">{t("datos.web")}</dt>
              <dd className="col-span-2">
                <a href={p.liveUrl} target="_blank" rel="noopener" className="v2-link">
                  {dominio} <ArrowUpRight size={13} className="text-[var(--v2-accent)]" />
                </a>
              </dd>
            </div>
          )}
        </dl>
        {extra.hicimos?.length ? (
          <div className="flex flex-col gap-3">
            <span className="v2-label">{t("datos.hicimos")}</span>
            <ul className="flex flex-wrap gap-2">
              {extra.hicimos.map((h) => (
                <li key={h} className="inline-flex items-center gap-2 rounded-[6px] border border-[var(--v2-line)] px-3 py-2 text-[14px]">
                  <Check size={14} strokeWidth={2} className="text-[var(--v2-accent)]" /> {h}
                </li>
              ))}
            </ul>
          </div>
        ) : null}
      </Apartado>

      {/* ── El trabajo: las capturas ── */}
      {galeria.length ? (
        <Apartado n={num(++seccion)} titulo={t("secciones.trabajo")}>
          <div className="flex flex-col gap-4 md:gap-6">
            {galeria.map((g, k) => (
              <div
                key={g.src + k}
                className="relative overflow-hidden rounded-[8px] border border-[var(--v2-line)]"
                style={{ backgroundColor: p.color }}
                data-reveal
              >
                {g.etiqueta && <span className="v2-tag absolute left-3 top-3 z-10">{t(`galeria.${g.etiqueta}`)}</span>}
                <img src={g.src} alt={g.alt ?? `${p.name} ${k + 1}`} loading="lazy" className="block h-auto w-full" />
              </div>
            ))}
          </div>
        </Apartado>
      ) : null}

      {/* ── Más casos ── */}
      {mas.length > 0 && (
        <section className="v2-frame">
          <div className="v2-rail">
            <LineaArriba />
            <div className="flex flex-col gap-4 px-6 pb-8 pt-16 md:flex-row md:items-end md:justify-between md:px-10 lg:pt-20">
              <div className="flex flex-col gap-4">
                <span className="v2-label" data-reveal>
                  {t("mas.label")}
                </span>
                <h2 className="v2-h2" data-reveal>
                  {t("mas.title_part1")}
                  <em className="font-display italic font-semibold text-[var(--v2-accent)]">{t("mas.title_emphasis")}</em>
                  {t("mas.title_part2")}
                </h2>
              </div>
              <Link href="/work" className="v2-link self-start md:self-end" data-reveal>
                {t("volver")} <ArrowUpRight size={14} className="text-[var(--v2-accent)]" />
              </Link>
            </div>
            <ul className="grid grid-cols-1 gap-4 border-t border-[var(--v2-line)] p-4 sm:grid-cols-2 md:gap-5 md:p-8 lg:grid-cols-3">
              {mas.map((m) => (
                <li key={m.slug} className="flex">
                  <TarjetaTrabajo p={m} video={VIDEO_CASO[m.slug]} verCaso={t("mas.siguiente")} />
                </li>
              ))}
            </ul>
          </div>
        </section>
      )}

      <ClosingBand />

      {/* ── Barra fija: cliente, llamada y año siempre a mano ── */}
      <BarraCaso
        cliente={p.client || p.name}
        ano={p.year ? String(p.year) : ""}
        web={p.liveUrl}
        t={{ cliente: t("barra.cliente"), ano: t("barra.ano"), llamada: t("barra.llamada"), web: t("verWeb") }}
      />
    </PaginaServicio>
  );
}

/** Un apartado numerado: el título a la izquierda (se queda a la vista), el contenido a la derecha. */
function Apartado({ n, titulo, children }: { n: string; titulo: string; children: React.ReactNode }) {
  return (
    <section className="v2-frame">
      <div className="v2-rail grid grid-cols-1 lg:grid-cols-12">
        <LineaArriba />
        <div className="border-b border-[var(--v2-line)] px-6 py-8 md:px-10 lg:col-span-4 lg:border-b-0 lg:border-r lg:py-16">
          <div className="flex items-baseline gap-3 lg:sticky lg:top-28" data-reveal>
            <span className="font-mono text-[11px] text-[var(--v2-accent)]">{n}</span>
            <h2 className="text-[26px] font-medium tracking-[-0.025em] md:text-[30px]">{titulo}</h2>
          </div>
        </div>
        <div className="flex flex-col gap-8 px-6 py-8 md:px-10 lg:col-span-8 lg:py-16" data-reveal>
          {children}
        </div>
      </div>
    </section>
  );
}
