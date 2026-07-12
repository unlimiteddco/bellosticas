import "server-only";
import { getCMS, cmsLocale } from "./client";
import type { ResolvedPost, ResolvedPostSummary } from "./types";
import { getStaticPosts, getStaticPostBySlug, getStaticPostSlugs } from "@/lib/posts";

type MediaLike = { url?: string | null } | string | null | undefined;

function mediaUrl(m: MediaLike): string | undefined {
  if (!m || typeof m === "string") return undefined;
  return m.url ?? undefined;
}

function toSummary(d: Record<string, unknown>): ResolvedPostSummary {
  return {
    slug: String(d.slug ?? ""),
    title: String(d.title ?? ""),
    excerpt: (d.excerpt as string) || undefined,
    coverImage: mediaUrl(d.coverImage as MediaLike),
    author: (d.author as string) || undefined,
    tags: Array.isArray(d.tags) ? (d.tags as string[]) : undefined,
    publishedAt: (d.publishedAt as string) || undefined,
  };
}

/** Published posts, newest first. Empty array if the CMS is unavailable. */
export async function getPosts(locale: string): Promise<ResolvedPostSummary[]> {
  const cms = await getCMS();
  if (!cms) return getStaticPosts();
  try {
    const res = await cms.find({
      collection: "posts",
      locale: cmsLocale(locale),
      where: { _status: { equals: "published" } },
      depth: 1,
      limit: 100,
      sort: "-publishedAt",
    });
    return res.docs.map((d) => toSummary(d as Record<string, unknown>));
  } catch (err) {
    console.error("[cms] getPosts failed:", err);
    return [];
  }
}

/** A single published post by slug, or null. */
export async function getPostBySlug(
  slug: string,
  locale: string,
): Promise<ResolvedPost | null> {
  const cms = await getCMS();
  if (!cms) return getStaticPostBySlug(slug);
  try {
    const res = await cms.find({
      collection: "posts",
      locale: cmsLocale(locale),
      where: {
        and: [{ slug: { equals: slug } }, { _status: { equals: "published" } }],
      },
      depth: 1,
      limit: 1,
    });
    if (res.docs.length === 0) return null;
    const d = res.docs[0] as Record<string, unknown>;
    return {
      ...toSummary(d),
      content: d.content,
      seo: {
        metaTitle: ((d.seo as Record<string, unknown>)?.metaTitle as string) || undefined,
        metaDescription:
          ((d.seo as Record<string, unknown>)?.metaDescription as string) || undefined,
      },
    };
  } catch (err) {
    console.error("[cms] getPostBySlug failed:", err);
    return null;
  }
}

/** All published slugs — for generateStaticParams / sitemap. */
export async function getAllPostSlugs(): Promise<string[]> {
  const cms = await getCMS();
  if (!cms) return getStaticPostSlugs();
  try {
    const res = await cms.find({
      collection: "posts",
      where: { _status: { equals: "published" } },
      limit: 1000,
      depth: 0,
    });
    return res.docs.map((d) => String((d as Record<string, unknown>).slug ?? "")).filter(Boolean);
  } catch {
    return [];
  }
}
