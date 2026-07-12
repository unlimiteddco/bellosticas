"use client";

import { useState } from "react";
import Link from "next/link";
import { Plus, ArrowRight } from "lucide-react";
import { useTranslations } from "next-intl";

/**
 * FAQ del blog en dos columnas (estilo DesignMe): a la izquierda el titular y
 * una tarjeta con la foto de Antonio + CTA; a la derecha el acordeón. Igual en
 * todas las entradas.
 */
export function BlogFAQ({ questionKeys }: { questionKeys: string[] }) {
  const t = useTranslations("blog.faq");
  const [open, setOpen] = useState<string | null>(questionKeys[0] ?? null);

  return (
    <section className="relative z-10 max-w-[1280px] mx-auto px-6 lg:px-12 py-16 lg:py-20">
      <div className="grid grid-cols-1 lg:grid-cols-[340px_1fr] gap-10 lg:gap-16">
        {/* Izquierda: titular + tarjeta */}
        <div className="lg:sticky lg:top-[120px] self-start flex flex-col gap-6">
          <div className="flex flex-col gap-3">
            <span
              className="font-body uppercase text-[10px] text-[var(--color-text-muted)]"
              style={{ letterSpacing: "0.18em" }}
            >
              {t("kicker")}
            </span>
            <h2 className="font-display text-[32px] md:text-[40px] leading-[1.05] text-[var(--color-text)]">
              {t("heading")}
            </h2>
          </div>

          <div className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface-2)]/50 p-6 flex flex-col gap-4">
            <img
              src="/images/antonio-bellostas-hero-grain.jpg"
              alt="Antonio Bellostas"
              width={52}
              height={52}
              className="w-13 h-13 rounded-full object-cover"
              style={{ width: 52, height: 52, objectPosition: "center 25%" }}
            />
            <div className="flex flex-col gap-1">
              <p className="font-body text-[16px] font-semibold text-[var(--color-text)]">
                {t("cantFindTitle")}
              </p>
              <p className="font-body text-[14px] text-[var(--color-text-muted)]">
                {t("cantFindBody")}
              </p>
            </div>
            <Link
              href="/intro"
              className="inline-flex items-center justify-center gap-2 h-11 px-5 rounded-full bg-[var(--color-text)] text-[var(--color-bg)] font-body text-[13px] font-medium hover:bg-[var(--color-accent)] transition-colors self-start"
            >
              {t("startProject")}
              <ArrowRight size={14} />
            </Link>
            <a
              href="mailto:info@bellostas.studio"
              className="font-body text-[13px] text-[var(--color-text-muted)] hover:text-[var(--color-accent)] transition-colors"
            >
              {t("orEmail")} → info@bellostas.studio
            </a>
          </div>
        </div>

        {/* Derecha: acordeón */}
        <div className="flex flex-col gap-2.5">
          {questionKeys.map((k) => {
            const isOpen = open === k;
            return (
              <div
                key={k}
                className="rounded-2xl bg-[var(--color-surface-2)]/50 border border-[var(--color-border)] overflow-hidden"
              >
                <button
                  type="button"
                  onClick={() => setOpen(isOpen ? null : k)}
                  aria-expanded={isOpen}
                  className="w-full flex items-center gap-4 px-5 py-4 text-left"
                >
                  <Plus
                    size={18}
                    className={`shrink-0 text-[var(--color-accent)] transition-transform duration-300 ${
                      isOpen ? "rotate-45" : ""
                    }`}
                  />
                  <span className="font-body text-[15px] md:text-[16px] font-medium text-[var(--color-text)]">
                    {t(`items.${k}.question`)}
                  </span>
                </button>
                <div
                  className="grid transition-[grid-template-rows] duration-300 ease-out"
                  style={{ gridTemplateRows: isOpen ? "1fr" : "0fr" }}
                >
                  <div className="min-h-0 overflow-hidden">
                    <p className="px-5 pb-5 pl-[52px] font-body text-[14px] leading-[1.65] text-[var(--color-text-muted)]">
                      {t(`items.${k}.answer`)}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
