import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { getTranslations } from "next-intl/server";
import { EditorialLabel } from "@/components/ui/EditorialLabel";
import { AsteriskIcon } from "@/components/ui/AsteriskIcon";
import type { ResolvedPostSummary } from "@/lib/cms/types";

/** Posts relacionados bajo el artículo. Prioriza los que comparten etiqueta. */
export async function RelatedPosts({
  posts,
  currentSlug,
  currentTags,
  locale,
}: {
  posts: ResolvedPostSummary[];
  currentSlug: string;
  currentTags?: string[];
  locale: string;
}) {
  const t = await getTranslations({ locale, namespace: "blog" });
  const blogBase = locale === "es" ? "/blog" : `/${locale}/blog`;
  const tags = new Set(currentTags ?? []);

  const others = posts.filter((p) => p.slug !== currentSlug);
  const ranked = [...others].sort((a, b) => {
    const sa = (a.tags ?? []).filter((x) => tags.has(x)).length;
    const sb = (b.tags ?? []).filter((x) => tags.has(x)).length;
    return sb - sa;
  });
  const related = ranked.slice(0, 3);
  if (related.length === 0) return null;

  return (
    <section className="relative z-10 max-w-[1120px] mx-auto px-6 lg:px-8 pb-24">
      <EditorialLabel className="block mb-8">{t("relatedLabel")}</EditorialLabel>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5 lg:gap-6">
        {related.map((p) => (
          <Link
            key={p.slug}
            href={`${blogBase}/${p.slug}`}
            className="group flex flex-col rounded-2xl border border-[var(--color-border)] bg-[var(--color-bg)] overflow-hidden hover:border-[var(--color-accent)]/40 hover:-translate-y-0.5 transition-all"
          >
            {/* Imagen destacada (o placeholder de marca) */}
            <div className="relative aspect-[16/10] overflow-hidden bg-[var(--color-text)]">
              {p.coverImage ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={p.coverImage}
                  alt={p.title}
                  className="absolute inset-0 w-full h-full object-cover transition-transform duration-[600ms] ease-out group-hover:scale-[1.04]"
                />
              ) : (
                <span
                  className="absolute inset-0 flex items-center justify-center"
                  style={{
                    background: "linear-gradient(150deg, #2C2417 0%, #1D1D1B 60%, #14110D 100%)",
                  }}
                >
                  <AsteriskIcon className="w-10 h-10 text-[var(--color-accent)]/50" />
                </span>
              )}
            </div>

            <div className="flex flex-col gap-2.5 p-5">
              {p.tags && p.tags[0] && (
                <span
                  className="font-mono uppercase text-[10px] text-[var(--color-accent)]"
                  style={{ letterSpacing: "0.1em" }}
                >
                  {p.tags[0]}
                </span>
              )}
              <h3 className="font-display text-[19px] leading-[1.2] text-[var(--color-text)] group-hover:text-[var(--color-accent)] transition-colors">
                {p.title}
              </h3>
              {p.excerpt && (
                <p className="font-body text-[13.5px] leading-[1.5] text-[var(--color-text-muted)] line-clamp-2">
                  {p.excerpt}
                </p>
              )}
              <span className="mt-1 inline-flex items-center gap-1 font-mono uppercase text-[10px] text-[var(--color-text-muted)] group-hover:text-[var(--color-accent)] transition-colors">
                {t("readArticle")}
                <ArrowUpRight size={12} />
              </span>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
