import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { ArrowLeft, ArrowUpRight } from "lucide-react";
import { Footer } from "@/components/layout/Footer";
import { ReadingProgress } from "@/components/sections/blog/ReadingProgress";
import { SafeRichText } from "@/components/sections/blog/SafeRichText";
import { AiSummarizeBar } from "@/components/sections/blog/AiSummarizeBar";
import { PostSidebar } from "@/components/sections/blog/PostSidebar";
import { BlogFAQ } from "@/components/sections/blog/BlogFAQ";
import { RelatedPosts } from "@/components/sections/blog/RelatedPosts";
import { getAllPostSlugs, getPostBySlug, getPosts } from "@/lib/cms/posts";

export async function generateStaticParams() {
  const slugs = await getAllPostSlugs();
  return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}): Promise<Metadata> {
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

function formatDate(iso: string | undefined, locale: string): string {
  if (!iso) return "";
  try {
    return new Intl.DateTimeFormat(locale === "en" ? "en-GB" : "es-ES", {
      day: "numeric",
      month: "long",
      year: "numeric",
    }).format(new Date(iso));
  } catch {
    return "";
  }
}

/** Walk the Lexical tree collecting text nodes → word count → reading minutes. */
function readingMinutes(content: unknown): number {
  let words = 0;
  const walk = (node: unknown) => {
    if (!node || typeof node !== "object") return;
    const n = node as Record<string, unknown>;
    if (typeof n.text === "string") {
      words += n.text.trim().split(/\s+/).filter(Boolean).length;
    }
    if (Array.isArray(n.children)) n.children.forEach(walk);
    if (n.root) walk(n.root);
  };
  walk(content);
  return Math.max(1, Math.round(words / 200));
}

export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = await params;
  setRequestLocale(locale);

  const t = await getTranslations({ locale, namespace: "blog" });
  const [post, allPosts] = await Promise.all([
    getPostBySlug(slug, locale),
    getPosts(locale),
  ]);
  if (!post) notFound();

  const blogBase = locale === "es" ? "/blog" : `/${locale}/blog`;
  const minutes = readingMinutes(post.content);
  const minLabel = locale === "en" ? `${minutes} min read` : `${minutes} min de lectura`;

  return (
    <>
      <ReadingProgress />

      <div className="relative z-10 max-w-[1120px] mx-auto px-6 lg:px-8 pt-[140px] pb-16">
        <Link
          href={blogBase}
          className="inline-flex items-center gap-1.5 mb-10 font-mono text-[11px] uppercase text-[var(--color-text-muted)] hover:text-[var(--color-accent)] transition-colors"
          style={{ letterSpacing: "0.1em" }}
        >
          <ArrowLeft size={13} />
          {t("backToBlog")}
        </Link>

        {/* Header a ancho completo */}
        <header className="flex flex-col gap-6 mb-10">
          {post.tags && post.tags.length > 0 && (
            <div className="flex flex-wrap items-center gap-2">
              {post.tags.slice(0, 4).map((tag) => (
                <span
                  key={tag}
                  className="px-3 py-1 rounded-full border border-[var(--color-border)] font-body text-[12px] text-[var(--color-text-muted)]"
                >
                  {tag}
                </span>
              ))}
            </div>
          )}

          <h1 className="font-display text-[34px] md:text-[52px] leading-[1.06] text-[var(--color-text)] max-w-[920px]">
            {post.title}
          </h1>

          <div
            className="flex flex-wrap items-center gap-x-3 gap-y-1.5 pb-8 border-b border-[var(--color-border)] font-mono text-[11px] text-[var(--color-text-muted)]"
            style={{ letterSpacing: "0.04em" }}
          >
            {post.author && <span>{t("by")} {post.author}</span>}
            {post.publishedAt && (
              <>
                <span className="text-[var(--color-border)]" aria-hidden>|</span>
                <span>{formatDate(post.publishedAt, locale)}</span>
              </>
            )}
            <span className="text-[var(--color-border)]" aria-hidden>|</span>
            <span className="text-[var(--color-accent)]">{minLabel}</span>
          </div>
        </header>

        {/* Dos columnas: sidebar sticky + contenido */}
        <div className="grid grid-cols-1 lg:grid-cols-[280px_1fr] gap-12 lg:gap-16 mt-10">
          <PostSidebar slug={slug} title={post.title} locale={locale} />

          <article className="min-w-0 max-w-[720px]">
            {post.coverImage && (
              <div className="relative w-full aspect-[16/9] rounded-2xl overflow-hidden mb-10 bg-[var(--color-text)] border border-[var(--color-border)]">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={post.coverImage}
                  alt={post.title}
                  className="w-full h-full object-cover"
                />
              </div>
            )}

            {/* Resumir con IA */}
            <AiSummarizeBar />

            <div className="prose-bellostas">
              <SafeRichText
                data={post.content}
                fallback={
                  post.excerpt ? (
                    <p className="font-body text-[17px] leading-[1.7] text-[var(--color-text)]">
                      {post.excerpt}
                    </p>
                  ) : null
                }
              />
            </div>

            {/* End marker + back */}
            <div className="mt-16 pt-8 border-t border-[var(--color-border)] flex items-center justify-between gap-4">
              <span
                className="font-mono text-[11px] text-[var(--color-text-muted)]"
                style={{ letterSpacing: "0.08em" }}
              >
                {locale === "en" ? "// END OF FILE" : "// FIN DEL ARTÍCULO"}
              </span>
              <Link
                href={blogBase}
                className="group inline-flex items-center gap-2 font-mono uppercase text-[11px] text-[var(--color-text)] hover:text-[var(--color-accent)] transition-colors"
                style={{ letterSpacing: "0.1em" }}
              >
                {t("backToBlog")}
                <ArrowUpRight
                  size={14}
                  className="group-hover:-translate-y-0.5 group-hover:translate-x-0.5 transition-transform"
                />
              </Link>
            </div>
          </article>
        </div>
      </div>

      {/* FAQ compartida (igual en todas las entradas) */}
      <BlogFAQ questionKeys={["q1", "q2", "q3", "q4", "q5"]} />

      {/* Posts relacionados */}
      <RelatedPosts
        posts={allPosts}
        currentSlug={slug}
        currentTags={post.tags}
        locale={locale}
      />

      <Footer />
    </>
  );
}
