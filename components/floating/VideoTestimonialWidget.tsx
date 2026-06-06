"use client";

import { AnimatePresence, motion } from "framer-motion";
import { ArrowRight, Play, Volume2, VolumeX, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useTranslations } from "next-intl";
import { AsteriskIcon } from "@/components/ui/AsteriskIcon";

const STORAGE_KEY = "bs:video-testimonial-dismissed";
/** Once closed, stay hidden for this many days (then re-engage gently). */
const SUPPRESS_DAYS = 3;

type Props = {
  videoSrc?: string;
  posterSrc?: string;
  clientName?: string;
  clientCompany?: string;
  /** CSS selector of the element whose viewport entry triggers the widget */
  triggerSelector?: string;
};

export function VideoTestimonialWidget({
  videoSrc,
  posterSrc,
  clientName,
  clientCompany,
  triggerSelector = "[data-video-trigger]",
}: Props) {
  const t = useTranslations("videoTestimonial");
  const [isVisible, setIsVisible] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [isDismissed, setIsDismissed] = useState(false);
  const [muted, setMuted] = useState(true);
  const videoRef = useRef<HTMLVideoElement | null>(null);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const ts = Number(raw);
      if (Number.isFinite(ts) && Date.now() - ts < SUPPRESS_DAYS * 86_400_000) {
        setIsDismissed(true);
        return;
      }
    }

    const trigger = document.querySelector(triggerSelector);
    if (!trigger) return; // No trigger present → widget stays hidden on this page

    const io = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setIsVisible(true);
          io.disconnect();
        }
      },
      { threshold: 0.15, rootMargin: "0px 0px -10% 0px" },
    );
    io.observe(trigger);
    return () => io.disconnect();
  }, [triggerSelector]);

  // ESC closes expanded → back to collapsed
  useEffect(() => {
    if (!isExpanded) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setIsExpanded(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [isExpanded]);

  // Pause + cleanup video when collapsing
  useEffect(() => {
    if (!isExpanded && videoRef.current) {
      videoRef.current.pause();
      videoRef.current.removeAttribute("src");
      videoRef.current.load();
    }
  }, [isExpanded]);

  const handleDismiss = (e: React.MouseEvent) => {
    e.stopPropagation();
    localStorage.setItem(STORAGE_KEY, String(Date.now()));
    setIsDismissed(true);
  };

  if (isDismissed || !isVisible) return null;

  const name = clientName ?? t("clientName");
  const company = clientCompany ?? t("clientCompany");

  return (
    <AnimatePresence>
      {!isExpanded ? (
        <motion.div
          key="collapsed-wrap"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 20 }}
          transition={{ duration: 0.4, ease: [0.4, 0, 0.2, 1] }}
          className="fixed z-50 bottom-4 right-4 md:bottom-6 md:right-6"
        >
          {/* Floating label pill — to the LEFT of the thumb */}
          <motion.div
            initial={{ opacity: 0, x: 16 }}
            animate={{
              opacity: 1,
              x: [0, -3, 0, -3, 0],
            }}
            transition={{
              opacity: { duration: 0.4, delay: 0.5 },
              x: {
                delay: 0.9,
                duration: 2.2,
                repeat: Infinity,
                repeatDelay: 1.4,
                ease: "easeInOut",
              },
            }}
            className="hidden sm:flex absolute right-full top-1/2 -translate-y-1/2 mr-3 items-center gap-2 pl-4 pr-3 py-2 rounded-full bg-[var(--color-bg)] whitespace-nowrap"
            style={{ boxShadow: "0 10px 30px -8px rgba(29,29,27,0.25)" }}
            aria-hidden
          >
            <span
              className="font-body text-[12px] font-medium text-[var(--color-text)]"
              style={{ letterSpacing: "0.01em" }}
            >
              {t("preLabel")}
            </span>
            <span className="font-display italic font-semibold text-[14px] text-[var(--color-accent)] leading-none">
              {t("firstName")}
            </span>
            <ArrowRight
              size={14}
              className="text-[var(--color-accent)]"
              strokeWidth={2.2}
            />
            {/* Pointer notch on the right edge of the bubble */}
            <span
              className="absolute top-1/2 -translate-y-1/2 -right-[5px] w-2.5 h-2.5 rotate-45 bg-[var(--color-bg)]"
              aria-hidden
            />
          </motion.div>

          <motion.div
            layoutId="video-widget"
            initial={{ scale: 0.85 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.4, ease: [0.4, 0, 0.2, 1] }}
            whileHover={{ scale: 1.04 }}
            className="relative overflow-hidden"
            style={{
              width: 110,
              height: 140,
              borderRadius: 12,
              boxShadow: "0 8px 32px rgba(0,0,0,0.18)",
              border: "2px solid var(--color-bg)",
              background: "var(--color-text)",
            }}
          >
            {/* Thumbnail — opens the player */}
            <button
              type="button"
              onClick={() => setIsExpanded(true)}
              aria-label={t("watchAria")}
              className="absolute inset-0 w-full h-full cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-accent)] focus-visible:ring-inset"
            >
              {posterSrc ? (
                <img
                  src={posterSrc}
                  alt=""
                  className="absolute inset-0 w-full h-full object-cover"
                />
              ) : (
                <div className="absolute inset-0 flex items-center justify-center text-[var(--color-accent)]">
                  <AsteriskIcon className="w-16 h-16 opacity-90" />
                </div>
              )}

              <div
                className="absolute inset-0 pointer-events-none"
                style={{
                  background:
                    "linear-gradient(to top, rgba(0,0,0,0.45), rgba(0,0,0,0) 60%)",
                }}
              />

              {/* Play button center */}
              <span className="absolute inset-0 flex items-center justify-center">
                <span className="w-10 h-10 rounded-full bg-[var(--color-bg)] flex items-center justify-center shadow-md">
                  <Play
                    size={14}
                    className="text-[var(--color-text)] ml-0.5"
                    fill="currentColor"
                  />
                </span>
              </span>
            </button>

            {/* Dismiss X — separate button, sits above the thumbnail */}
            <button
              type="button"
              onClick={handleDismiss}
              aria-label={t("closeAria")}
              className="absolute top-1.5 right-1.5 z-10 w-6 h-6 rounded-full bg-[var(--color-bg)]/90 flex items-center justify-center hover:bg-[var(--color-bg)] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-accent)]"
            >
              <X size={12} className="text-[var(--color-text)]" strokeWidth={2.5} />
            </button>
          </motion.div>
        </motion.div>
      ) : (
        <motion.div
          key="expanded"
          layoutId="video-widget"
          transition={{ duration: 0.4, ease: [0.4, 0, 0.2, 1] }}
          className="fixed z-50 bottom-4 right-4 md:bottom-6 md:right-6 overflow-hidden bg-[var(--color-text)]"
          role="dialog"
          aria-modal="true"
          aria-label={t("watchAria")}
          style={{
            width: "min(320px, 90vw)",
            height: "min(568px, 75vh)",
            borderRadius: 16,
            boxShadow: "0 16px 64px rgba(0,0,0,0.32)",
          }}
        >
          {/* Video or placeholder */}
          {videoSrc ? (
            <video
              ref={videoRef}
              src={videoSrc}
              poster={posterSrc}
              autoPlay
              muted={muted}
              playsInline
              loop
              className="absolute inset-0 w-full h-full object-cover"
            />
          ) : (
            <>
              {posterSrc && (
                <img
                  src={posterSrc}
                  alt=""
                  className="absolute inset-0 w-full h-full object-cover"
                />
              )}
              <div
                className="absolute inset-0 flex flex-col items-center justify-center gap-6 px-6 text-center"
                style={{
                  background: posterSrc
                    ? "linear-gradient(to bottom, rgba(29,29,27,0.55), rgba(29,29,27,0.85))"
                    : undefined,
                }}
              >
                <AsteriskIcon className="w-20 h-20 text-[var(--color-accent)]" />
                <span
                  className="font-body uppercase text-[11px] text-[var(--color-bg)]/90"
                  style={{ letterSpacing: "0.18em" }}
                >
                  {t("comingSoon")}
                </span>
              </div>
            </>
          )}

          {/* Bottom client info overlay */}
          <div
            className="absolute inset-x-0 bottom-0 p-5 flex flex-col gap-1 pointer-events-none"
            style={{
              background:
                "linear-gradient(to top, rgba(29,29,27,0.85), rgba(29,29,27,0))",
            }}
          >
            <span
              className="font-body uppercase text-[11px] text-[var(--color-bg)]"
              style={{ letterSpacing: "0.18em" }}
            >
              {name}
            </span>
            <span
              className="font-body uppercase text-[11px] text-[var(--color-bg)]/70"
              style={{ letterSpacing: "0.18em" }}
            >
              {company}
            </span>
          </div>

          {/* Close → back to collapsed */}
          <button
            type="button"
            onClick={() => setIsExpanded(false)}
            aria-label={t("closeAria")}
            className="absolute top-3 right-3 w-9 h-9 rounded-full bg-[var(--color-bg)]/90 flex items-center justify-center hover:bg-[var(--color-bg)] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-accent)]"
          >
            <X size={16} className="text-[var(--color-text)]" strokeWidth={2.5} />
          </button>

          {/* Mute / Unmute (only when video exists) */}
          {videoSrc && (
            <button
              type="button"
              onClick={() => setMuted((m) => !m)}
              aria-label={muted ? t("unmuteAria") : t("muteAria")}
              className="absolute bottom-4 right-4 w-9 h-9 rounded-full bg-[var(--color-bg)]/90 flex items-center justify-center hover:bg-[var(--color-bg)] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-accent)] pointer-events-auto"
            >
              {muted ? (
                <VolumeX size={14} className="text-[var(--color-text)]" />
              ) : (
                <Volume2 size={14} className="text-[var(--color-text)]" />
              )}
            </button>
          )}
        </motion.div>
      )}
    </AnimatePresence>
  );
}
