"use client";

import { useEffect } from "react";
import {
  captureFirstTouchIfNeeded,
  getSessionId,
  getVisitorId,
} from "@/lib/tracking";

/**
 * Initialises the visitor identity + first-touch attribution on the very
 * first page load. Mounted once at the layout level so the data is captured
 * even when the user lands on a page and bounces without converting.
 *
 * Runs entirely client-side and is idempotent: calling it on every navigation
 * is a no-op once first-touch is locked in.
 */
export function TrackingBootstrap() {
  useEffect(() => {
    // Touch visitor + session so they're created if missing
    getVisitorId();
    getSessionId();
    // Lock in first-touch (utm_*, gclid, referrer, landing_url) on the very
    // first visit. Subsequent calls are a no-op.
    captureFirstTouchIfNeeded();
  }, []);

  return null;
}
