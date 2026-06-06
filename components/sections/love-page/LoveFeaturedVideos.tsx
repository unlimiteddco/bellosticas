"use client";

import { motion } from "framer-motion";
import { Play } from "lucide-react";
import { useTranslations } from "next-intl";
import { useState } from "react";
import { EditorialLabel } from "@/components/ui/EditorialLabel";
import { MixedHeadline } from "@/components/ui/MixedHeadline";
import { InitialsAvatar } from "@/components/ui/InitialsAvatar";
import { AsteriskIcon } from "@/components/ui/AsteriskIcon";
import {
  TestimonialLightbox,
  type LightboxVideo,
} from "@/components/sections/TestimonialLightbox";
import { TESTIMONIAL_MEDIA } from "@/lib/testimonial-media";

const NS = "lovePage.featuredVideos";

type Slug = "javier" | "themis";

type Item = {
  name: string;
  role: string;
  company: string;
  quote: string;
};

/** Poster card. Clicking opens the shared lightbox player (chapters, etc.). */
function FeaturedVideoCard({
  slug,
  item,
  onOpen,
  playLabel,
}: {
  slug: Slug;
  item: Item;
  onOpen: () => void;
  playLabel: string;
}) {
  const [posterErrored, setPosterErrored] = useState(false);
  const { poster } = TESTIMONIAL_MEDIA[slug];

  return (
    <motion.button
      type="button"
      onClick={onOpen}
      aria-label={playLabel}
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.7, ease: "easeOut" }}
      whileHover={{ scale: 1.01 }}
      className="group relative w-full overflow-hidden rounded-2xl bg-[var(--color-text)] cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-accent)] focus-visible:ring-offset-2"
      style={{
        aspectRatio: "9 / 14",
        boxShadow: "0 24px 60px -24px rgba(29,29,27,0.35)",
      }}
    >
      {!posterErrored ? (
        <img
          src={poster}
          alt={item.name}
          onError={() => setPosterErrored(true)}
          className="absolute inset-0 w-full h-full object-cover transition-transform duration-[600ms] ease-out group-hover:scale-[1.03]"
        />
      ) : (
        <div className="absolute inset-0 flex items-center justify-center bg-[var(--color-text)]">
          <div
            className="absolute"
            style={{ top: "18%", right: "10%", width: "40%", height: "40%", color: "rgba(194,38,58,0.35)" }}
          >
            <AsteriskIcon className="w-full h-full" />
          </div>
          <InitialsAvatar
            name={item.name}
            size={72}
            className="!bg-[var(--color-bg)] !text-[var(--color-text)]"
          />
        </div>
      )}

      {/* Top gradient + name pill */}
      <div
        className="absolute inset-x-0 top-0 h-32 pointer-events-none"
        style={{ background: "linear-gradient(to bottom, rgba(0,0,0,0.45), rgba(0,0,0,0))" }}
      />
      <div className="absolute top-4 left-4 right-4 flex items-center gap-2.5 rounded-full bg-[var(--color-bg)]/95 backdrop-blur-md p-1.5 pr-3.5">
        <InitialsAvatar name={item.name} size={32} />
        <div className="flex flex-col leading-tight text-left min-w-0">
          <span className="font-body text-[13px] font-semibold text-[var(--color-text)] truncate">
            {item.name}
          </span>
          <span className="font-body text-[11px] text-[var(--color-text-muted)] truncate">
            {item.role} · {item.company}
          </span>
        </div>
      </div>

      {/* Center play */}
      <span className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 flex h-16 w-16 items-center justify-center rounded-full bg-[var(--color-bg)]/95 shadow-[0_8px_24px_-8px_rgba(0,0,0,0.5)] transition-transform duration-300 group-hover:scale-110">
        <Play size={22} className="ml-0.5 text-[var(--color-text)]" fill="currentColor" />
      </span>

      {/* Bottom gradient + quote */}
      <div
        className="absolute inset-x-0 bottom-0 h-40 pointer-events-none"
        style={{ background: "linear-gradient(to top, rgba(0,0,0,0.55), rgba(0,0,0,0))" }}
      />
      <div className="absolute bottom-4 left-4 right-4 text-left">
        <p
          className="font-display italic text-[16px] md:text-[17px] leading-[1.35] text-[#FFFFFF] max-w-[90%]"
          style={{ textShadow: "0 1px 8px rgba(0,0,0,0.5)" }}
        >
          “{item.quote}”
        </p>
      </div>
    </motion.button>
  );
}

export function LoveFeaturedVideos() {
  const t = useTranslations(NS);
  const items = t.raw("items") as Item[];
  // Display order: Themis first, then Javier. items[] is [javier, themis].
  const ordered: { slug: Slug; item: Item }[] = [
    { slug: "themis", item: items[1] },
    { slug: "javier", item: items[0] },
  ];

  const [activeVideo, setActiveVideo] = useState<LightboxVideo | null>(null);

  const openVideo = (slug: Slug, item: Item) => {
    const media = TESTIMONIAL_MEDIA[slug];
    setActiveVideo({
      videoSrc: media.video,
      posterSrc: media.poster,
      name: item.name,
      role: item.role,
      company: item.company,
      chapters: media.chapters,
    });
  };

  return (
    <section className="relative z-10 max-w-[1280px] mx-auto px-6 lg:px-12 py-16 lg:py-24 overflow-hidden">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 lg:items-center">
        {/* LEFT — editorial column + clickable index */}
        <div className="lg:col-span-5 relative flex flex-col gap-6">
          <div
            aria-hidden
            className="pointer-events-none absolute -z-10"
            style={{ top: "-8%", left: "-12%", width: "180px", height: "180px", color: "rgba(194,38,58,0.06)" }}
          >
            <AsteriskIcon className="w-full h-full" />
          </div>

          <EditorialLabel>{t("label")}</EditorialLabel>
          <MixedHeadline
            className="text-[40px] md:text-[52px]"
            parts={[
              { text: t("title_part1") },
              { text: t("title_emphasis"), accent: true },
              { text: t("title_part2") },
            ]}
          />
          <p className="font-body text-[16px] lg:text-[17px] leading-[1.55] text-[var(--color-text-muted)] max-w-[440px]">
            {t("sub")}
          </p>

          {/* Index — clicking opens the player */}
          <ul className="mt-3 flex flex-col border-t border-[var(--color-border)]">
            {ordered.map(({ slug, item }, i) => {
              return (
                <li key={slug}>
                  <button
                    type="button"
                    onClick={() => openVideo(slug, item)}
                    className="group w-full flex items-center gap-4 py-4 text-left border-b border-[var(--color-border)]"
                  >
                    <span
                      className="font-mono text-[12px] tabular-nums shrink-0 text-[var(--color-text-muted)] group-hover:text-[var(--color-accent)] transition-colors"
                      style={{ letterSpacing: "0.04em" }}
                    >
                      0{i + 1}
                    </span>
                    <div className="flex flex-col min-w-0 flex-1">
                      <span className="font-body font-medium text-[16px] md:text-[18px] truncate text-[var(--color-text)] group-hover:text-[var(--color-accent)] transition-colors">
                        {item.name}
                      </span>
                      <span className="font-body text-[12px] text-[var(--color-text-muted)] truncate">
                        {item.role} · {item.company}
                      </span>
                    </div>
                    <span className="shrink-0 flex items-center justify-center w-8 h-8 rounded-full border border-[var(--color-border)] group-hover:border-[var(--color-accent)] group-hover:bg-[var(--color-accent)] transition-colors">
                      <Play
                        size={12}
                        className="ml-0.5 text-[var(--color-text-muted)] group-hover:text-white transition-colors"
                        fill="currentColor"
                      />
                    </span>
                  </button>
                </li>
              );
            })}
          </ul>

          <span
            className="font-mono text-[11px] text-[var(--color-text-muted)]"
            style={{ letterSpacing: "0.04em" }}
          >
            // {items.length} {t("indexMeta")}
          </span>
        </div>

        {/* RIGHT — the two videos, staggered for editorial rhythm */}
        <div className="lg:col-span-7">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 lg:gap-7">
            {ordered.map(({ slug, item }, i) => (
              <div key={slug} className={i === 1 ? "sm:mt-12 lg:mt-16" : ""}>
                <FeaturedVideoCard
                  slug={slug}
                  item={item}
                  onOpen={() => openVideo(slug, item)}
                  playLabel={t("playLabel")}
                />
              </div>
            ))}
          </div>
        </div>
      </div>

      <TestimonialLightbox video={activeVideo} onClose={() => setActiveVideo(null)} />
    </section>
  );
}
