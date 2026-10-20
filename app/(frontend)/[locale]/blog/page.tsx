import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { getProjects } from "@/lib/cms/projects";
import { getPosts } from "@/lib/cms/posts";
import { ClosingBand } from "@/components/v2/home/ClosingBand";
import { PaginaServicio } from "@/components/v2/servicio/PaginaServicio";
import { ListaBlog } from "@/components/v2/blog/ListaBlog";
import { fechaPost } from "@/lib/v2/fechas";

/*
 * El blog, en la V2: hero corto, filtros por etiqueta, el último artículo en
 * grande y el resto en rejilla de celdas. Los artículos son los del gestor
 * (los mismos de /blog). Textos en
 * messages → v2Blog.
 */
export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "v2Blog" });
  return {
    title: `${t("metaTitle")}`,
    description: t("metaDescription"),
  };
}

export default async function BlogV2({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: "v2Blog" });
  const [proyectos, posts] = await Promise.all([getProjects(locale), getPosts(locale)]);
  const tarjetas = posts.map((p) => ({ ...p, fecha: fechaPost(p.publishedAt, locale) }));

  return (
    <PaginaServicio locale={locale} proyectos={proyectos}>
      <section className="v2-frame">
        <div className="flex flex-col items-center gap-6 px-6 pb-12 pt-14 text-center md:px-10 lg:pt-20">
          <span className="v2-label v2-hero-in flex items-center gap-2.5">
            <span aria-hidden className="h-1.5 w-1.5 rounded-full bg-[var(--v2-accent)]" />
            {t("label")}
            {posts.length > 0 && (
              <span className="text-[var(--v2-faint)]">
                · {posts.length} {t("entradas")}
              </span>
            )}
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
            className="v2-hero-in max-w-[560px] text-[16px] leading-[1.6] text-[var(--v2-muted)] lg:text-[18px]"
            style={{ animationDelay: "160ms" }}
          >
            {t("sub")}
          </p>
        </div>
        <div className="v2-hero-in" style={{ animationDelay: "240ms" }}>
          <ListaBlog posts={tarjetas} />
        </div>
      </section>
      <ClosingBand />
    </PaginaServicio>
  );
}
