"use client";

import { motion } from "framer-motion";
import { Play } from "lucide-react";
import { useState } from "react";
import { useTranslations } from "next-intl";
import { EditorialLabel } from "@/components/ui/EditorialLabel";
import { InitialsAvatar } from "@/components/ui/InitialsAvatar";
import {
  TestimonialLightbox,
  type LightboxVideo,
} from "@/components/sections/TestimonialLightbox";
import { TESTIMONIAL_MEDIA, type TestimonialMedia } from "@/lib/testimonial-media";

type Item = {
  key: string;
  name: string;
  role: string;
  company: string;
  quote: string;
  preposition: string;
};

/** Maps the grid's local testimonial keys to the central media config. */
const VIDEO_ASSETS: Record<string, TestimonialMedia> = {
  t1: TESTIMONIAL_MEDIA.javier,
  t3: TESTIMONIAL_MEDIA.themis,
};

function RoleLine({
  role,
  company,
  preposition,
  size = "md",
}: {
  role: string;
  company: string;
  preposition: string;
  size?: "sm" | "md";
}) {
  const sizeCls = size === "sm" ? "text-[11px]" : "text-[13px]";
  return (
    <span
      className={`font-body ${sizeCls} text-[var(--color-text-muted)] leading-tight truncate`}
    >
      {role}{" "}
      <span className="text-[var(--color-text-muted)]/70">{preposition}</span>{" "}
      <span className="text-[var(--color-text)] font-medium">{company}</span>
    </span>
  );
}

function TestimonialCard({
  item,
  delay = 0,
  className = "",
}: {
  item: Item;
  delay?: number;
  className?: string;
}) {
  return (
    <motion.article
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.6, delay, ease: "easeOut" }}
      whileHover={{ y: -2 }}
      className={`flex flex-col gap-4 rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] p-5 transition-shadow duration-300 hover:shadow-[0_12px_30px_-15px_rgba(29,29,27,0.18)] ${className}`}
    >
      <header className="flex items-center gap-3">
        <InitialsAvatar name={item.name} size={40} />
        <div className="flex flex-col leading-tight min-w-0">
          <span className="font-body text-[14px] font-semibold text-[var(--color-text)]">
            {item.name}
          </span>
          <RoleLine
            role={item.role}
            company={item.company}
            preposition={item.preposition}
          />
        </div>
      </header>
      <p className="font-body text-[13px] leading-[1.55] text-[var(--color-text)]/85 line-clamp-5">
        “{item.quote}”
      </p>
    </motion.article>
  );
}

/** Unified video testimonial card — identical treatment for every video. */
function VideoCard({
  item,
  posterSrc,
  badge,
  watchAria,
  onPlay,
  className = "",
}: {
  item: Item;
  posterSrc: string;
  badge: string;
  watchAria: string;
  onPlay: () => void;
  className?: string;
}) {
  return (
    <motion.button
      type="button"
      aria-label={watchAria}
      onClick={onPlay}
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.7, ease: "easeOut" }}
      whileHover={{ scale: 1.01 }}
      className={`group relative w-full h-full overflow-hidden rounded-2xl border border-[var(--color-border)] bg-[var(--color-text)] cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-accent)] focus-visible:ring-offset-2 ${className}`}
    >
      <img
        src={posterSrc}
        alt={item.name}
        className="absolute inset-0 w-full h-full object-cover object-center transition-transform duration-[600ms] ease-out group-hover:scale-[1.03]"
      />

      {/* Top gradient + name pill */}
      <div
        className="absolute inset-x-0 top-0 h-28 pointer-events-none"
        style={{
          background: "linear-gradient(to bottom, rgba(0,0,0,0.4), rgba(0,0,0,0))",
        }}
      />
      <div className="absolute top-3 left-3 right-3 flex items-center gap-2.5 rounded-full bg-[var(--color-bg)]/95 backdrop-blur-md p-1.5 pr-3.5">
        <InitialsAvatar name={item.name} size={30} />
        <div className="flex flex-col leading-tight text-left min-w-0">
          <span className="font-body text-[13px] font-semibold text-[var(--color-text)] truncate">
            {item.name}
          </span>
          <RoleLine
            role={item.role}
            company={item.company}
            preposition={item.preposition}
            size="sm"
          />
        </div>
      </div>

      {/* Center play */}
      <span className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 flex h-14 w-14 items-center justify-center rounded-full bg-[var(--color-bg)]/95 shadow-[0_8px_24px_-8px_rgba(0,0,0,0.45)] transition-transform duration-300 group-hover:scale-110">
        <Play size={20} className="ml-0.5 text-[var(--color-text)]" fill="currentColor" />
      </span>

      {/* Bottom gradient + consistent VÍDEO badge */}
      <div
        className="absolute inset-x-0 bottom-0 h-24 pointer-events-none"
        style={{
          background: "linear-gradient(to top, rgba(0,0,0,0.5), rgba(0,0,0,0))",
        }}
      />
      <span
        className="absolute bottom-3 left-3 inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[var(--color-accent)] font-body uppercase text-[10px] font-medium text-[var(--color-bg)]"
        style={{ letterSpacing: "0.12em" }}
      >
        <Play size={9} fill="currentColor" />
        {badge}
      </span>
    </motion.button>
  );
}

export function ShortTestimonials() {
  const t = useTranslations("shortTestimonials");
  const tv = useTranslations("videoTestimonial");
  const preposition = t("rolePreposition");

  const get = (k: string): Item => ({
    key: k,
    name: t(`items.${k}.name`),
    role: t(`items.${k}.role`),
    company: t(`items.${k}.company`),
    quote: t(`items.${k}.quote`),
    preposition,
  });

  const javier = get("t1"); // video
  const adela = get("t2");
  const themis = get("t3"); // video
  const diego = get("t4");
  const carlos = get("t5");
  const sofia = get("t6");

  const [active, setActive] = useState<LightboxVideo | null>(null);
  const openVideo = (item: Item) =>
    setActive({
      videoSrc: VIDEO_ASSETS[item.key]?.video,
      posterSrc: VIDEO_ASSETS[item.key].poster,
      name: item.name,
      role: item.role,
      company: item.company,
      chapters: VIDEO_ASSETS[item.key]?.chapters,
    });

  return (
    <section className="relative z-10 max-w-[1280px] mx-auto px-6 lg:px-12 py-[72px]">
      <EditorialLabel className="block mb-12">{t("label")}</EditorialLabel>

      {/*
        Bento: two EQUAL portrait video cards anchor the centre (cols 2-3),
        text reviews flank both sides (cols 1 & 4). Collapses to 2-col on md
        and a single stack on mobile.
      */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 lg:gap-6 lg:auto-rows-[232px]">
        {/* Videos — identical treatment, centre on lg. Themis first, then Javier. */}
        <VideoCard
          item={themis}
          posterSrc={TESTIMONIAL_MEDIA.themis.poster}
          badge={tv("badge")}
          watchAria={t("watchAria")}
          onPlay={() => openVideo(themis)}
          className="aspect-[9/13] md:aspect-auto md:min-h-[440px] lg:min-h-0 lg:aspect-auto lg:col-start-2 lg:row-start-1 lg:row-span-2 order-1 md:order-1"
        />
        <VideoCard
          item={javier}
          posterSrc={TESTIMONIAL_MEDIA.javier.poster}
          badge={tv("badge")}
          watchAria={t("watchAria")}
          onPlay={() => openVideo(javier)}
          className="aspect-[9/13] md:aspect-auto md:min-h-[440px] lg:min-h-0 lg:aspect-auto lg:col-start-3 lg:row-start-1 lg:row-span-2 order-4 md:order-2"
        />

        {/* Left-side reviews (lg col 1) */}
        <TestimonialCard
          item={adela}
          delay={0.05}
          className="order-2 md:order-3 lg:col-start-1 lg:row-start-1"
        />
        <TestimonialCard
          item={carlos}
          delay={0.1}
          className="order-5 md:order-5 lg:col-start-1 lg:row-start-2"
        />

        {/* Right-side reviews (lg col 4) */}
        <TestimonialCard
          item={diego}
          delay={0.15}
          className="order-3 md:order-4 lg:col-start-4 lg:row-start-1"
        />
        <TestimonialCard
          item={sofia}
          delay={0.2}
          className="order-6 md:order-6 lg:col-start-4 lg:row-start-2"
        />
      </div>

      <TestimonialLightbox video={active} onClose={() => setActive(null)} />
    </section>
  );
}
