import type { Metadata } from "next";
import Link from "next/link";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { ArrowUpRight } from "lucide-react";
import { EditorialLabel } from "@/components/ui/EditorialLabel";
import { Footer } from "@/components/layout/Footer";
import { getPosts } from "@/lib/cms/posts";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "blog" });
  return {
    title: t("metaTitle"),
    description: t("metaDescription"),
  };
}

function formatDate(iso: string | undefined, locale: string): string {
  if (!iso) return "—";
  try {
    return new Intl.DateTimeFormat(locale === "en" ? "en-GB" : "es-ES", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    })
      .format(new Date(iso))
      .replace(".", "");
  } catch {
    return "—";
  }
}

export default async function BlogPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  const t = await getTranslations({ locale, namespace: "blog" });
  const posts = await getPosts(locale);
  const blogBase = locale === "es" ? "/blog" : `/${locale}/blog`;

  const [featured, ...rest] = posts;
  const count = String(posts.length).padStart(2, "0");

  return (
    <>
      <main className="relative z-10 max-w-[1280px] mx-auto px-6 lg:px-12 pt-[150px] pb-24 min-h-[70vh]">
        {/* Hero */}
        <header className="relative flex flex-col gap-5 mb-16 lg:mb-20">
          <EditorialLabel>{t("label")}</EditorialLabel>

          {/* Single-line H1 (wraps only on small mobile) */}
          <h1
            className="font-body font-medium tracking-tight text-[var(--color-text)] leading-[1.0] whitespace-normal lg:whitespace-nowrap text-[32px] sm:text-[44px] lg:text-[60px]"
          >
            {t("title_part1")}
            <span className="font-display italic font-semibold text-[var(--color-accent)]">
              {t("title_emphasis")}
            </span>
            {t("title_part2")}
          </h1>

          <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
            <p className="font-body text-[16px] lg:text-[18px] leading-[1.55] text-[var(--color-text-muted)] max-w-[460px]">
              {t("sub")}
            </p>
            {posts.length > 0 && (
              <span
                className="font-mono text-[11px] text-[var(--color-text-muted)] tabular-nums shrink-0"
                style={{ letterSpacing: "0.04em" }}
              >
                [{count}] {locale === "en" ? "entries" : "entradas"} · est. 2026
              </span>
            )}
          </div>

          {/* Thin tech rule with corner ticks */}
          <div className="relative mt-2 h-px w-full bg-[var(--color-border)]">
            <span className="absolute left-0 -top-1 h-2 w-px bg-[var(--color-accent)]" />
            <span className="absolute right-0 -top-1 h-2 w-px bg-[var(--color-border)]" />
          </div>
        </header>

        {posts.length === 0 ? (
          <EmptyState message={t("empty")} />
        ) : (
          <>
            {featured && (
              <FeaturedPost
                post={featured}
                href={`${blogBase}/${featured.slug}`}
                readLabel={t("readMore")}
                dateLabel={formatDate(featured.publishedAt, locale)}
                index="01"
              />
            )}

            {rest.length > 0 && (
              <ul className="mt-4 border-t border-[var(--color-border)]">
                {rest.map((post, i) => (
                  <PostRow
                    key={post.slug}
                    post={post}
                    href={`${blogBase}/${post.slug}`}
                    index={String(i + 2).padStart(2, "0")}
                    dateLabel={formatDate(post.publishedAt, locale)}
                  />
                ))}
              </ul>
            )}
          </>
        )}
      </main>

      <Footer />
    </>
  );
}

/* ----------------------------- subcomponents ----------------------------- */

type PostLike = {
  slug: string;
  title: string;
  excerpt?: string;
  coverImage?: string;
  tags?: string[];
};

function FeaturedPost({
  post,
  href,
  readLabel,
  dateLabel,
  index,
}: {
  post: PostLike;
  href: string;
  readLabel: string;
  dateLabel: string;
  index: string;
}) {
  return (
    <Link
      href={href}
      className="group grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-10 items-stretch rounded-3xl border border-[var(--color-border)] p-4 lg:p-5 transition-colors duration-300 hover:border-[var(--color-accent)]/50"
    >
      <div className="relative aspect-[16/10] lg:aspect-auto lg:min-h-[340px] rounded-2xl overflow-hidden bg-[var(--color-text)]">
        {post.coverImage ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={post.coverImage}
            alt={post.title}
            className="absolute inset-0 w-full h-full object-cover transition-transform duration-[700ms] group-hover:scale-[1.04]"
          />
        ) : (
          <DotGrid />
        )}
        <span
          className="absolute top-3 left-3 font-mono text-[10px] text-white/80 bg-black/30 backdrop-blur-sm px-2 py-1 rounded-full"
          style={{ letterSpacing: "0.1em" }}
        >
          {index} / FEATURED
        </span>
      </div>

      <div className="flex flex-col justify-between gap-6 py-2 lg:py-4 lg:pr-4">
        <div className="flex flex-col gap-4">
          <div
            className="flex flex-wrap items-center gap-2 font-mono text-[11px] text-[var(--color-text-muted)]"
            style={{ letterSpacing: "0.04em" }}
          >
            <span>{dateLabel}</span>
            {post.tags?.slice(0, 3).map((tag) => (
              <span
                key={tag}
                className="px-2 py-0.5 rounded-full border border-[var(--color-border)] text-[var(--color-text)]"
              >
                {tag}
              </span>
            ))}
          </div>
          <h2 className="font-display text-[30px] md:text-[40px] leading-[1.08] text-[var(--color-text)] group-hover:text-[var(--color-accent)] transition-colors">
            {post.title}
          </h2>
          {post.excerpt && (
            <p className="font-body text-[15px] leading-[1.65] text-[var(--color-text-muted)] max-w-[460px] line-clamp-3">
              {post.excerpt}
            </p>
          )}
        </div>

        <span
          className="inline-flex items-center gap-2 font-mono uppercase text-[11px] text-[var(--color-text)] group-hover:text-[var(--color-accent)] transition-colors"
          style={{ letterSpacing: "0.1em" }}
        >
          {readLabel}
          <ArrowUpRight
            size={14}
            className="group-hover:-translate-y-0.5 group-hover:translate-x-0.5 transition-transform"
          />
        </span>
      </div>
    </Link>
  );
}

function PostRow({
  post,
  href,
  index,
  dateLabel,
}: {
  post: PostLike;
  href: string;
  index: string;
  dateLabel: string;
}) {
  return (
    <li>
      <Link
        href={href}
        className="group grid grid-cols-[40px_1fr_auto] md:grid-cols-[56px_88px_1fr_auto] items-center gap-4 md:gap-6 py-6 border-b border-[var(--color-border)] transition-colors hover:bg-[var(--color-surface-2)]/50 -mx-3 px-3 rounded-lg"
      >
        <span
          className="font-mono text-[12px] text-[var(--color-text-muted)] tabular-nums group-hover:text-[var(--color-accent)] transition-colors"
          style={{ letterSpacing: "0.04em" }}
        >
          {index}
        </span>

        {/* Thumb (md+) */}
        <div className="hidden md:block relative w-[88px] h-[58px] rounded-lg overflow-hidden bg-[var(--color-text)] shrink-0">
          {post.coverImage ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={post.coverImage}
              alt={post.title}
              className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
            />
          ) : (
            <DotGrid small />
          )}
        </div>

        <div className="flex flex-col gap-1.5 min-w-0">
          <h3 className="font-body font-medium text-[16px] md:text-[19px] text-[var(--color-text)] group-hover:text-[var(--color-accent)] transition-colors truncate">
            {post.title}
          </h3>
          <div
            className="flex flex-wrap items-center gap-2 font-mono text-[10.5px] text-[var(--color-text-muted)]"
            style={{ letterSpacing: "0.04em" }}
          >
            <span>{dateLabel}</span>
            {post.tags?.slice(0, 2).map((tag) => (
              <span key={tag} aria-hidden>
                · {tag}
              </span>
            ))}
          </div>
        </div>

        <ArrowUpRight
          size={16}
          className="text-[var(--color-text-muted)] group-hover:text-[var(--color-accent)] group-hover:-translate-y-0.5 group-hover:translate-x-0.5 transition-all justify-self-end"
        />
      </Link>
    </li>
  );
}

function EmptyState({ message }: { message: string }) {
  return (
    <div className="relative rounded-3xl border border-[var(--color-border)] overflow-hidden">
      <DotGrid muted />
      <div className="relative px-8 py-24 flex flex-col items-center gap-3 text-center">
        <span
          className="font-mono text-[11px] text-[var(--color-accent)]"
          style={{ letterSpacing: "0.12em" }}
        >
          $ ls ./posts → 0 results
        </span>
        <p
          className="font-body uppercase text-[12px] text-[var(--color-text-muted)]"
          style={{ letterSpacing: "0.16em" }}
        >
          {message}
        </p>
      </div>
    </div>
  );
}

/** Dotted-grid placeholder, matching the service-window / 404 tech motif. */
function DotGrid({ small, muted }: { small?: boolean; muted?: boolean }) {
  // `muted` = dark dots on the light card (empty state). Otherwise white dots
  // on the dark surface (cover placeholders).
  const dot = muted ? "rgba(29,29,27,0.07)" : "rgba(255,255,255,0.10)";
  return (
    <div
      className="absolute inset-0"
      style={{
        backgroundColor: muted ? "transparent" : "var(--color-text)",
        backgroundImage: `radial-gradient(circle at 1px 1px, ${dot} 1px, transparent 0)`,
        backgroundSize: small ? "10px 10px" : "16px 16px",
      }}
    />
  );
}
