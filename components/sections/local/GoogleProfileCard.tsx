"use client";

import { motion } from "framer-motion";
import { BadgeCheck, Star } from "lucide-react";
import { useTranslations } from "next-intl";
import { AsteriskIcon } from "@/components/ui/AsteriskIcon";

const GOOGLE_PROFILE_URL = "https://www.google.com/search?q=bellostas+studio+huesca";

function GoogleG({ size = 16 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 48 48" aria-hidden>
      <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z" />
      <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z" />
      <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z" />
      <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z" />
    </svg>
  );
}

function Stars({ size = 13 }: { size?: number }) {
  return (
    <span className="inline-flex gap-0.5" aria-hidden>
      {Array.from({ length: 5 }).map((_, i) => (
        <Star key={i} size={size} className="text-[#FBBC04]" fill="#FBBC04" />
      ))}
    </span>
  );
}

/**
 * Stylized Google Business Profile card for the local-landing heroes — real
 * trust signals (5.0 rating, verified, client reviews) presented as a designed
 * object. Same card on the three city pages. Links to the live Google profile.
 */
export function GoogleProfileCard() {
  const t = useTranslations("localPages.common.gcard");

  return (
    <motion.a
      href={GOOGLE_PROFILE_URL}
      target="_blank"
      rel="noopener"
      aria-label={t("cta")}
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: [0, -8, 0] }}
      transition={{
        opacity: { duration: 0.7, delay: 0.3, ease: [0.4, 0, 0.2, 1] },
        y: { duration: 6, repeat: Infinity, ease: "easeInOut", delay: 0.3 },
      }}
      className="block rounded-2xl bg-white border border-[var(--color-border)] p-5 lg:p-6 shadow-[0_40px_80px_-40px_rgba(29,29,27,0.45)] hover:-translate-y-1 transition-transform"
    >
      {/* Cabecera del negocio */}
      <div className="flex items-start gap-3.5">
        <span className="flex items-center justify-center w-11 h-11 rounded-xl bg-[var(--color-text)] shrink-0">
          <AsteriskIcon className="w-5 h-5 text-[var(--color-accent)]" />
        </span>
        <div className="min-w-0">
          <span className="flex items-center gap-1.5 font-body text-[16px] font-semibold text-[#1D1D1B]">
            Bellostas Studio
            <BadgeCheck size={16} className="text-[#4285F4] shrink-0" fill="#E8F0FE" />
          </span>
          <span className="block font-body text-[12.5px] text-[#6B6B68] truncate">
            {t("businessType")} · {t("location")}
          </span>
          <span className="mt-1 flex items-center gap-1.5">
            <span className="font-body text-[13px] font-semibold text-[#1D1D1B] tabular-nums">
              5,0
            </span>
            <Stars />
            <span className="font-body text-[11.5px] text-[#6B6B68]">
              · {t("reviewsLabel")}
            </span>
          </span>
        </div>
      </div>

      {/* Verificado */}
      <span className="mt-3.5 inline-flex items-center gap-1.5 rounded-full bg-[#E6F4EA] text-[#188038] px-2.5 py-1 font-body text-[11px] font-medium">
        <BadgeCheck size={12} />
        {t("verified")}
      </span>

      {/* Reseñas */}
      <div className="mt-4 flex flex-col gap-3 border-t border-[var(--color-border)] pt-4">
        {(["r1", "r2"] as const).map((k) => (
          <div key={k} className="flex gap-2.5">
            <span className="flex items-center justify-center w-7 h-7 rounded-full bg-[var(--color-surface-2)] font-body text-[11px] font-semibold text-[#1D1D1B] shrink-0">
              {t(`${k}.name`).charAt(0)}
            </span>
            <div className="min-w-0">
              <span className="flex items-center gap-2">
                <span className="font-body text-[12.5px] font-medium text-[#1D1D1B]">
                  {t(`${k}.name`)}
                </span>
                <Stars size={10} />
              </span>
              <p className="font-body text-[12.5px] leading-[1.5] text-[#6B6B68] mt-0.5">
                “{t(`${k}.text`)}”
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Pie Google */}
      <div className="mt-4 pt-3.5 border-t border-[var(--color-border)] flex items-center justify-between">
        <span className="inline-flex items-center gap-1.5 font-body text-[12px] text-[#6B6B68]">
          <GoogleG />
          Google
        </span>
        <span className="font-body text-[12px] font-medium text-[#1A73E8]">
          {t("cta")} →
        </span>
      </div>
    </motion.a>
  );
}
