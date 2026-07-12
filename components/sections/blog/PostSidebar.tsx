import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { getTranslations } from "next-intl/server";
import { AsteriskIcon } from "@/components/ui/AsteriskIcon";
import { PostTOC } from "./PostTOC";

const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL ?? "https://bellostas.studio").replace(/\/$/, "");

function LinkedInGlyph({ size = 15 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
    </svg>
  );
}
function XGlyph({ size = 14 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
  );
}

/**
 * Barra lateral del artículo (estilo DesignMe): compartir, tarjeta de "partner
 * de diseño + desarrollo" y el índice. Sticky en desktop.
 */
export async function PostSidebar({
  slug,
  title,
  locale,
}: {
  slug: string;
  title: string;
  locale: string;
}) {
  const t = await getTranslations({ locale, namespace: "blog" });
  const postPath = locale === "es" ? `/blog/${slug}` : `/${locale}/blog/${slug}`;
  const url = `${SITE_URL}${postPath}`;
  const enc = encodeURIComponent(url);
  const encTitle = encodeURIComponent(title);

  const shares = [
    { name: "LinkedIn", href: `https://www.linkedin.com/sharing/share-offsite/?url=${enc}`, glyph: <LinkedInGlyph /> },
    { name: "X", href: `https://twitter.com/intent/tweet?url=${enc}&text=${encTitle}`, glyph: <XGlyph /> },
    { name: "WhatsApp", href: `https://wa.me/?text=${encTitle}%20${enc}`, glyph: <span className="text-[13px]">↗</span> },
  ];

  return (
    <aside className="lg:sticky lg:top-[120px] lg:self-start flex flex-col gap-8">
      {/* Compartir */}
      <div className="flex flex-col gap-3">
        <span
          className="font-body uppercase text-[10px] text-[var(--color-text-muted)]"
          style={{ letterSpacing: "0.18em" }}
        >
          {t("shareLabel")}
        </span>
        <div className="flex items-center gap-2">
          {shares.map((s) => (
            <a
              key={s.name}
              href={s.href}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`${t("shareLabel")} · ${s.name}`}
              title={s.name}
              className="flex items-center justify-center w-10 h-10 rounded-full border border-[var(--color-border)] text-[var(--color-text-muted)] hover:text-[var(--color-text)] hover:border-[var(--color-text)] transition-colors"
            >
              {s.glyph}
            </a>
          ))}
        </div>
      </div>

      {/* Tarjeta partner */}
      <div className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface-2)]/60 overflow-hidden">
        <div className="relative h-[120px] flex items-center justify-center bg-[var(--color-text)] overflow-hidden">
          <AsteriskIcon className="w-12 h-12 text-[var(--color-accent)]" />
          <div
            aria-hidden
            className="absolute inset-0 pointer-events-none"
            style={{
              backgroundImage:
                "radial-gradient(circle, rgba(255,255,255,0.08) 1px, transparent 1.4px)",
              backgroundSize: "18px 18px",
              maskImage: "radial-gradient(ellipse at 50% 50%, #000 30%, transparent 80%)",
              WebkitMaskImage: "radial-gradient(ellipse at 50% 50%, #000 30%, transparent 80%)",
            }}
          />
        </div>
        <div className="p-5 flex flex-col gap-3">
          <span
            className="font-body uppercase text-[9px] text-[var(--color-text-muted)]"
            style={{ letterSpacing: "0.16em" }}
          >
            {t("cta.label")}
          </span>
          <h3 className="font-display text-[19px] leading-[1.2] text-[var(--color-text)]">
            {t("cta.title")}
          </h3>
          <p className="font-body text-[12.5px] leading-[1.55] text-[var(--color-text-muted)]">
            {t("cta.body")}
          </p>
          <Link
            href="/intro"
            className="mt-1 inline-flex items-center justify-center gap-2 h-11 rounded-full bg-[var(--color-text)] text-[var(--color-bg)] font-body text-[13px] font-medium hover:bg-[var(--color-accent)] transition-colors"
          >
            {t("cta.button")}
            <ArrowRight size={14} />
          </Link>
        </div>
      </div>

      {/* Índice */}
      <PostTOC />
    </aside>
  );
}
