"use client";

import { AnimatePresence, motion } from "framer-motion";
import { Play, Volume2, X } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { useTranslations } from "next-intl";
import { AsteriskIcon } from "@/components/ui/AsteriskIcon";
import type { VideoChapter } from "@/lib/testimonial-media";

export type LightboxVideo = {
  videoSrc?: string;
  posterSrc: string;
  name: string;
  role: string;
  company: string;
  chapters?: VideoChapter[];
};

function formatTime(s: number): string {
  if (!Number.isFinite(s) || s < 0) return "0:00";
  const m = Math.floor(s / 60);
  const sec = Math.floor(s % 60);
  return `${m}:${sec.toString().padStart(2, "0")}`;
}

/**
 * Shared portrait video player for testimonials.
 *  - Starts with sound ON (the click that opens it is the user gesture);
 *    falls back to muted if the browser blocks autoplay-with-audio.
 *  - Timeline with clickable chapter markers (one per interview question).
 *  - Plays `videoSrc` if present, else shows the poster + "coming soon".
 */
export function TestimonialLightbox({
  video,
  onClose,
}: {
  video: LightboxVideo | null;
  onClose: () => void;
}) {
  const t = useTranslations("videoTestimonial");
  const [mounted, setMounted] = useState(false);
  const [muted, setMuted] = useState(false); // sound ON by default
  const [videoErrored, setVideoErrored] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const videoRef = useRef<HTMLVideoElement | null>(null);

  useEffect(() => setMounted(true), []);

  const showVideo = Boolean(video?.videoSrc) && !videoErrored;
  const chapters = video?.chapters ?? [];

  // Reset per-video state when a new one opens.
  useEffect(() => {
    setVideoErrored(false);
    setMuted(false);
    setCurrentTime(0);
    setDuration(0);
    setIsPlaying(true);
  }, [video?.videoSrc, video?.posterSrc]);

  const togglePlay = useCallback(() => {
    const v = videoRef.current;
    if (!v) return;
    if (v.paused) v.play().catch(() => {});
    else v.pause();
  }, []);

  // Try to play with sound (gesture-allowed); fall back to muted if blocked.
  useEffect(() => {
    if (!video || !showVideo) return;
    const v = videoRef.current;
    if (!v) return;
    let cancelled = false;
    v.muted = false;
    const tryPlay = async () => {
      try {
        await v.play();
      } catch {
        if (cancelled) return;
        v.muted = true;
        setMuted(true);
        try {
          await v.play();
        } catch {
          /* ignore */
        }
      }
    };
    tryPlay();
    return () => {
      cancelled = true;
    };
  }, [video, showVideo]);

  // Esc to close + scroll lock + Lenis pause
  useEffect(() => {
    if (!video) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const lenis = (
      window as unknown as { __lenis?: { stop: () => void; start: () => void } }
    ).__lenis;
    lenis?.stop();
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
      lenis?.start();
    };
  }, [video, onClose]);

  const seekTo = useCallback((time: number) => {
    const v = videoRef.current;
    if (!v) return;
    v.currentTime = Math.max(0, time);
  }, []);

  const onBarClick = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      const v = videoRef.current;
      if (!v || !duration) return;
      const rect = e.currentTarget.getBoundingClientRect();
      const frac = (e.clientX - rect.left) / rect.width;
      seekTo(frac * duration);
    },
    [duration, seekTo],
  );

  if (!mounted) return null;

  const progress = duration > 0 ? (currentTime / duration) * 100 : 0;
  // Active chapter = last one whose start has passed.
  const activeChapterIdx = chapters.reduce(
    (acc, c, i) => (currentTime + 0.4 >= c.time ? i : acc),
    -1,
  );

  const node = (
    <AnimatePresence>
      {video && (
        <motion.div
          key="testimonial-lightbox"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.25 }}
          onClick={onClose}
          // Solid dim (no backdrop-filter) — avoids the Chrome backdrop-blur
          // repaint flicker when hovering the controls.
          className="fixed inset-0 z-[9999] flex items-center justify-center p-4 md:p-8 bg-[rgba(20,20,19,0.86)]"
          role="dialog"
          aria-modal="true"
          aria-label={t("watchAria")}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.94, y: 16 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.94, y: 16 }}
            transition={{ duration: 0.35, ease: [0.4, 0, 0.2, 1] }}
            onClick={(e) => e.stopPropagation()}
            className="relative overflow-hidden bg-[var(--color-text)] rounded-3xl"
            style={{
              width: "min(380px, 92vw)",
              aspectRatio: "9 / 16",
              maxHeight: "84vh",
              boxShadow: "0 30px 80px -20px rgba(0,0,0,0.6)",
              // Own compositing layer → button hovers don't re-raster the shadow.
              transform: "translateZ(0)",
            }}
          >
            {showVideo ? (
              <video
                ref={videoRef}
                src={video.videoSrc}
                poster={video.posterSrc}
                autoPlay
                muted={muted}
                playsInline
                loop
                onError={() => setVideoErrored(true)}
                onTimeUpdate={(e) => setCurrentTime(e.currentTarget.currentTime)}
                onLoadedMetadata={(e) => setDuration(e.currentTarget.duration)}
                onPlay={() => setIsPlaying(true)}
                onPause={() => setIsPlaying(false)}
                className="absolute inset-0 w-full h-full object-cover"
              />
            ) : (
              <>
                <img
                  src={video.posterSrc}
                  alt={video.name}
                  className="absolute inset-0 w-full h-full object-cover"
                />
                <div
                  className="absolute inset-0 flex flex-col items-center justify-center gap-5 px-6 text-center"
                  style={{
                    background:
                      "linear-gradient(to bottom, rgba(29,29,27,0.5), rgba(29,29,27,0.85))",
                  }}
                >
                  <AsteriskIcon className="w-16 h-16 text-[var(--color-accent)]" />
                  <span
                    className="font-body uppercase text-[11px] text-[var(--color-bg)]/90"
                    style={{ letterSpacing: "0.18em" }}
                  >
                    {t("comingSoon")}
                  </span>
                </div>
              </>
            )}

            {/* Click anywhere on the video → pause / resume (Reels-style). */}
            {showVideo && (
              <div
                className="absolute inset-0 z-10 flex items-center justify-center"
                onClick={togglePlay}
                role="button"
                aria-label={isPlaying ? t("pauseAria") : t("playAria")}
              >
                <AnimatePresence>
                  {!isPlaying && (
                    <motion.span
                      key="paused"
                      initial={{ opacity: 0, scale: 0.7 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.7 }}
                      transition={{ duration: 0.18 }}
                      className="flex h-16 w-16 items-center justify-center rounded-full bg-[var(--color-bg)]/95 shadow-[0_8px_24px_-8px_rgba(0,0,0,0.5)]"
                    >
                      <Play size={24} className="ml-1 text-[var(--color-text)]" fill="currentColor" />
                    </motion.span>
                  )}
                </AnimatePresence>
              </div>
            )}

            {/* Close */}
            <button
              type="button"
              onClick={onClose}
              aria-label={t("closeAria")}
              className="absolute top-3 right-3 z-30 w-9 h-9 rounded-full bg-[var(--color-bg)]/90 flex items-center justify-center hover:bg-[var(--color-bg)] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-accent)]"
            >
              <X size={16} className="text-[var(--color-text)]" strokeWidth={2.5} />
            </button>

            {/* Bottom control bar. The container is click-through (pointer-events
                -none) so taps on the video toggle play/pause; only the timeline
                and the unmute badge capture clicks. */}
            <div
              className="absolute inset-x-0 bottom-0 z-20 px-4 pt-16 pb-4 flex flex-col gap-3 pointer-events-none"
              style={{
                background:
                  "linear-gradient(to top, rgba(20,20,19,0.92), rgba(20,20,19,0.4) 55%, rgba(20,20,19,0))",
              }}
            >
              {/* Name + role (full width) */}
              <div className="flex flex-col gap-0.5">
                <span className="font-body text-[15px] font-semibold text-[var(--color-bg)] truncate">
                  {video.name}
                </span>
                <span
                  className="font-body uppercase text-[10px] text-[var(--color-bg)]/70 truncate"
                  style={{ letterSpacing: "0.16em" }}
                >
                  {video.role} · {video.company}
                </span>
              </div>

              {showVideo && (
                <>
                  {/* Active chapter label */}
                  {activeChapterIdx >= 0 && (
                    <span
                      className="font-mono text-[10px] text-[var(--color-accent)] uppercase -mb-1"
                      style={{ letterSpacing: "0.1em" }}
                    >
                      {`0${activeChapterIdx + 1}`.slice(-2)} · {chapters[activeChapterIdx].label}
                    </span>
                  )}

                  {/* Timeline with chapter dots */}
                  <div
                    onClick={onBarClick}
                    className="relative h-4 flex items-center cursor-pointer group/bar pointer-events-auto"
                  >
                    {/* Track */}
                    <div className="absolute inset-x-0 h-[3px] rounded-full bg-white/25" />
                    {/* Filled */}
                    <div
                      className="absolute left-0 h-[3px] rounded-full bg-[var(--color-accent)]"
                      style={{ width: `${progress}%` }}
                    />
                    {/* Playhead */}
                    <div
                      className="absolute w-3 h-3 rounded-full bg-white shadow-[0_2px_6px_rgba(0,0,0,0.4)] -translate-x-1/2 transition-transform group-hover/bar:scale-110"
                      style={{ left: `${progress}%` }}
                    />
                    {/* Chapter dots */}
                    {duration > 0 &&
                      chapters.map((c, i) => (
                        <button
                          key={i}
                          type="button"
                          title={c.label}
                          aria-label={c.label}
                          onClick={(e) => {
                            e.stopPropagation();
                            seekTo(c.time);
                          }}
                          className="absolute -translate-x-1/2 w-2.5 h-2.5 rounded-full border-2 transition-transform hover:scale-150"
                          style={{
                            left: `${(c.time / duration) * 100}%`,
                            backgroundColor:
                              i <= activeChapterIdx
                                ? "var(--color-accent)"
                                : "var(--color-bg)",
                            borderColor:
                              i <= activeChapterIdx
                                ? "var(--color-accent)"
                                : "rgba(255,255,255,0.6)",
                          }}
                        />
                      ))}
                  </div>

                  {/* Time + (only-when-muted) unmute helper */}
                  <div className="flex items-center justify-between min-h-[20px]">
                    <span className="font-mono text-[10px] text-[var(--color-bg)]/70 tabular-nums">
                      {formatTime(currentTime)} / {formatTime(duration)}
                    </span>
                    {/* Shown ONLY if the browser blocked autoplay-with-sound, so
                        the viewer can recover audio. Hidden in the normal case. */}
                    {muted && (
                      <button
                        type="button"
                        onClick={() => {
                          const v = videoRef.current;
                          setMuted(false);
                          if (v) {
                            v.muted = false;
                            v.play().catch(() => {});
                          }
                        }}
                        aria-label={t("unmuteAria")}
                        className="pointer-events-auto inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[var(--color-accent)] text-[var(--color-bg)] font-body uppercase text-[9px] font-medium hover:opacity-90 transition-opacity focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-bg)]"
                        style={{ letterSpacing: "0.1em" }}
                      >
                        <Volume2 size={11} />
                        {t("unmuteShort")}
                      </button>
                    )}
                  </div>
                </>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );

  return createPortal(node, document.body);
}
