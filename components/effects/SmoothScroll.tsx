"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import Lenis from "lenis";
import { useReducedMotion } from "@/lib/hooks/useReducedMotion";

interface SmoothScrollProps {
  children: React.ReactNode;
  enabled?: boolean;
}

export function SmoothScroll({ children, enabled = true }: SmoothScrollProps) {
  const reduced = useReducedMotion();
  const lenisRef = useRef<Lenis | null>(null);
  const pathname = usePathname();
  const prevPath = useRef<string | null>(null);

  useEffect(() => {
    if (!enabled || reduced) return;

    const lenis = new Lenis({
      lerp: 0.08,
      smoothWheel: true,
    });
    lenisRef.current = lenis;
    // Expose globally so overlays/modals can pause smooth scroll
    (window as unknown as { __lenis?: Lenis }).__lenis = lenis;

    let rafId = 0;
    const raf = (time: number) => {
      lenis.raf(time);
      rafId = requestAnimationFrame(raf);
    };
    rafId = requestAnimationFrame(raf);

    // Keep Lenis's cached scroll dimensions in sync when the document height
    // changes after mount (late-loading images, fonts, dynamic content). Stale
    // dimensions are what cause the "scroll feels off / jumps into empty space"
    // bug on content-heavy pages like the blog.
    const ro = new ResizeObserver(() => lenis.resize());
    ro.observe(document.documentElement);
    if (document.body) ro.observe(document.body);

    // Any <img> that loads after first paint also shifts height → re-measure.
    const onImgLoad = () => lenis.resize();
    window.addEventListener("load", onImgLoad);
    document.addEventListener("load", onImgLoad, true); // capture: img load events

    // Smooth-scroll same-page anchor (#) links instead of the instant jump.
    const onAnchorClick = (e: MouseEvent) => {
      if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey) return;
      const anchor = (e.target as HTMLElement | null)?.closest("a");
      const href = anchor?.getAttribute("href");
      if (!href) return;

      let hash = "";
      if (href.startsWith("#")) {
        hash = href;
      } else {
        try {
          const url = new URL(href, window.location.href);
          if (url.pathname === window.location.pathname && url.hash) hash = url.hash;
        } catch {
          return;
        }
      }
      if (!hash || hash === "#") return;

      const el = document.querySelector(hash);
      if (!el) return;

      e.preventDefault();
      lenis.scrollTo(el as HTMLElement, { offset: -90, duration: 1.1 });
      window.history.pushState(null, "", hash);
    };
    document.addEventListener("click", onAnchorClick);

    return () => {
      cancelAnimationFrame(rafId);
      ro.disconnect();
      window.removeEventListener("load", onImgLoad);
      document.removeEventListener("load", onImgLoad, true);
      document.removeEventListener("click", onAnchorClick);
      lenis.destroy();
      lenisRef.current = null;
      delete (window as unknown as { __lenis?: Lenis }).__lenis;
    };
  }, [enabled, reduced]);

  // Reset scroll to top on route change (Next.js client navigation +
  // Lenis don't restore scroll automatically, which can leave the new page
  // mid-scroll where the previous one was).
  useEffect(() => {
    if (prevPath.current === null) {
      prevPath.current = pathname;
      return;
    }
    if (prevPath.current === pathname) return;
    prevPath.current = pathname;

    // Skip if the URL has a hash — let anchor scrolling handle it
    if (typeof window !== "undefined" && window.location.hash) return;

    const lenis = lenisRef.current;
    if (lenis) {
      lenis.scrollTo(0, { immediate: true, force: true });
      // Re-measure now and again shortly after, once the new route's content
      // (and its images) has settled — prevents stale-height scroll glitches.
      lenis.resize();
      const t1 = window.setTimeout(() => lenis.resize(), 120);
      const t2 = window.setTimeout(() => lenis.resize(), 500);
      return () => {
        window.clearTimeout(t1);
        window.clearTimeout(t2);
      };
    }
    window.scrollTo({ top: 0, behavior: "instant" as ScrollBehavior });
  }, [pathname]);

  return <>{children}</>;
}
