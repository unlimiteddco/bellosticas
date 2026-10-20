import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { Link } from "@/navigation";
import { getProjects } from "@/lib/cms/projects";
import { getAllPostSlugs, getPostBySlug, getPosts } from "@/lib/cms/posts";
import { fechaPost } from "@/lib/v2/fechas";
import { AsteriskIcon } from "@/components/ui/AsteriskIcon";
import { ReadingProgress } from "@/components/sections/blog/ReadingProgress";
import { SafeRichText } from "@/components/sections/blog/SafeRichText";
import { FaqV2 } from "@/components/v2/home/FaqV2";
import { ClosingBand } from "@/components/v2/home/ClosingBand";
import { PaginaServicio } from "@/components/v2/servicio/PaginaServicio";
import { LineaArriba } from "@/components/v2/servicio/Secciones";
import { PortadaPost, TarjetaPost } from "@/components/v2/blog/ListaBlog";
import { CompartirPost, IndicePost, ResumirPost } from "@/components/v2/blog/HerramientasPost";

/*
 * Un artículo del blog, en la V2: cabecera con etiquetas, titular y datos de
 * lectura; portada en el marco; a un lado el índice, compartir y la llamada, y
 * al otro el texto. Debajo, preguntas y artículos relacionados. El contenido es
 * el del gestor, el mismo de /blog/[slug].
 */
const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL ?? "https://bellostas.studio").replace(/\/$/, "");

export async function generateStaticParams() {
  const slugs = await getAllPostSlugs();
  return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ locale: string; slug: string }> }): Promise<Metadata> {
  const { locale, slug } = await params;
  const post = await getPostBySlug(slug, locale);
  if (!post) return {};
  return {
    title: post.seo?.metaTitle || `${post.title} · Bellostas Studio`,
    description: post.seo?.metaDescription || post.excerpt,
    openGraph: {
      title: post.title,
      description: post.excerpt,
      type: "article",
      images: post.coverImage ? [{ url: post.coverImage }] : undefined,
    },
  };
}

/** Minutos de lectura a partir de las palabras del texto (Lexical), a 200 por minuto. */
function minutosDe(content: unknown): number {
  let palabras = 0;
  const recorrer = (n: unknown) => {
    if (!n || typeof n !== "object") return;
    const o = n as Record<string, unknown>;
    if (typeof o.text === "string") palabras += o.text.trim().split(/\s+/).filter(Boolean).length;
    if (Array.isArray(o.children)) o.children.forEach(recorrer);
    if (o.root) recorrer(o.root);
  };
  recorrer(content);
  return Math.max(1, Math.round(palabras / 200));
}

export default async function PostV2({ params }: { params: Promise<{ locale: string; slug: string }> }) {
  const { locale, slug } = await params;
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: "v2Blog" });
  const [post, todos, proyectos] = await Promise.all([getPostBySlug(slug, locale), getPosts(locale), getProjects(locale)]);
  if (!post) notFound();

  // Al compartir, la dirección pública del artículo (la V2 aún no lo es).
  const url = `${SITE_URL}${locale === "es" ? "" : `/${locale}`}/blog/${slug}`;

  // Relacionados: primero los que comparten etiqueta.
  const etiquetas = new Set(post.tags ?? []);
  const relacionados = todos
    .filter((p) => p.slug !== slug)
    .sort((a, b) => (b.tags ?? []).filter((x) => etiquetas.has(x)).length - (a.tags ?? []).filter((x) => etiquetas.has(x)).length)
    .slice(0, 3)
    .map((p) => ({ ...p, fecha: fechaPost(p.publishedAt, locale) }));

  return (
    <PaginaServicio locale={locale} proyectos={proyectos}>
      <ReadingProgress targetId="articulo" />

      {/* ── Cabecera ── */}
      <section className="v2-frame">
        <div className="flex flex-col gap-7 px-5 pb-12 pt-10 md:px-0 lg:pb-14 lg:pt-14">
          <Link href="/blog" className="v2-link v2-hero-in self-start text-[14px] text-[var(--v2-muted)] hover:text-[var(--v2-text)]">
            <ArrowLeft size={14} /> {t("volver")}
          </Link>
          {post.tags && post.tags.length > 0 && (
            <div className="v2-hero-in flex flex-wrap gap-2" style={{ animationDelay: "60ms" }}>
              {post.tags.slice(0, 4).map((x) => (
                <span key={x} className="rounded-[4px] bg-[var(--v2-hover)] px-2.5 py-1 text-[12.5px] text-[var(--v2-muted)]">
                  {x}
                </span>
              ))}
            </div>
          )}
          <h1
            className="v2-hero-in v2-h1 v2-h1--doc max-w-[980px]"
            style={{ animationDelay: "120ms" }}
          >
            {post.title}
          </h1>
          {post.excerpt && (
            <p className="v2-hero-in max-w-[680px] text-[17px] leading-[1.6] text-[var(--v2-muted)] lg:text-[19px]" style={{ animationDelay: "180ms" }}>
              {post.excerpt}
            </p>
          )}
          <div className="v2-hero-in v2-label flex flex-wrap items-center gap-x-3 gap-y-1" style={{ animationDelay: "240ms" }}>
            {post.author && (
              <span>
                {t("por")} {post.author}
              </span>
            )}
            {post.publishedAt && (
              <>
                <span aria-hidden>·</span>
                <span>{fechaPost(post.publishedAt, locale, true)}</span>
              </>
            )}
            <span aria-hidden>·</span>
            <span className="text-[var(--v2-accent)]">{t("min", { n: minutosDe(post.content) })}</span>
          </div>
        </div>
        {post.coverImage && (
          <div className="v2-hero-in px-5 pb-6 md:px-0" style={{ animationDelay: "300ms" }}>
            <PortadaPost post={{ ...post, fecha: "" }} className="aspect-[16/9] rounded-[8px] border border-[var(--v2-line)] lg:aspect-[21/9]" />
          </div>
        )}
      </section>

      {/* ── Artículo: índice y llamada a un lado, texto al otro ── */}
      <section className="v2-frame">
        <div className="v2-rail grid grid-cols-1 lg:grid-cols-12">
          <LineaArriba />
          <aside className="order-2 border-t border-[var(--v2-line)] p-6 md:p-10 lg:order-1 lg:col-span-4 lg:border-r lg:border-t-0 lg:p-10 xl:col-span-3">
            <div className="flex flex-col gap-9 lg:sticky lg:top-28">
              <IndicePost />
              <CompartirPost url={url} titulo={post.title} />
              {/* La llamada, en una tarjeta negra con el asterisco de la marca. */}
              <div className="v2-oscuro flex flex-col gap-4 overflow-hidden rounded-[8px] border border-[var(--v2-line)] p-6">
                <AsteriskIcon className="h-7 w-7 text-[var(--v2-accent)]" />
                <span className="v2-label">{t("cta.label")}</span>
                <p className="text-[19px] font-medium leading-[1.25] tracking-[-0.01em]">{t("cta.title")}</p>
                <p className="text-[13.5px] leading-[1.55] text-[var(--v2-muted)]">{t("cta.body")}</p>
                <Link href="/intro" className="v2-btn v2-btn--primary v2-btn--sm mt-1 self-start">
                  {t("cta.button")} <ArrowRight size={14} />
                </Link>
              </div>
            </div>
          </aside>
          <article id="articulo" className="order-1 min-w-0 px-6 py-12 md:px-10 lg:order-2 lg:col-span-8 lg:px-14 lg:py-14 xl:col-span-9">
            <div className="max-w-[720px]">
              <ResumirPost />
              <div className="prose-bellostas">
                <SafeRichText
                  data={post.content}
                  fallback={post.excerpt ? <p>{post.excerpt}</p> : null}
                />
              </div>
            </div>
          </article>
        </div>
      </section>

      <FaqV2 ns="v2Blog.faq" />

      {/* ── Relacionados ── */}
      {relacionados.length > 0 && (
        <section className="v2-frame">
          <div className="v2-rail">
            <LineaArriba />
            <div className="flex flex-col items-start justify-between gap-5 px-6 py-14 md:flex-row md:items-end md:px-10 lg:py-16">
              <div className="flex flex-col gap-4">
                <span className="v2-label" data-reveal>
                  {t("relacionados.label")}
                </span>
                <h2 className="v2-h2" data-reveal>
                  {t("relacionados.title_part1")}
                  <em className="font-display italic font-semibold text-[var(--v2-accent)]">{t("relacionados.title_emphasis")}</em>
                  {t("relacionados.title_part2")}
                </h2>
              </div>
              <Link href="/blog" className="v2-link" data-reveal>
                {t("relacionados.todos")} <ArrowRight size={14} className="text-[var(--v2-accent)]" />
              </Link>
            </div>
            <div className="grid grid-cols-1 gap-px border-t border-[var(--v2-line)] bg-[var(--v2-line)] md:grid-cols-3">
              {relacionados.map((p, i) => (
                <TarjetaPost key={p.slug} post={p} i={i} leer={t("leer")} />
              ))}
              {Array.from({ length: (3 - (relacionados.length % 3)) % 3 }).map((_, i) => (
                <div key={`hueco-${i}`} aria-hidden className="hidden bg-[var(--v2-bg)] md:block" />
              ))}
            </div>
          </div>
        </section>
      )}

      <ClosingBand />
    </PaginaServicio>
  );
}
