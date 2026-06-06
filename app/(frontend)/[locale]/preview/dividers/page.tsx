import type { Metadata } from "next";
import { setRequestLocale } from "next-intl/server";
import { PatternDivider } from "@/components/sections/PatternDivider";
import { PatternDividerMarquee } from "@/components/sections/PatternDividerMarquee";
import { PatternDividerEditorial } from "@/components/sections/PatternDividerEditorial";
import { PatternDividerReactive } from "@/components/sections/PatternDividerReactive";

/**
 * Internal preview of all PatternDivider variants stacked side by side so the
 * client can compare them in context. NOT public — `noindex` keeps it out of
 * search engines and the page itself has no navigation links pointing to it.
 *
 * Delete this folder once a variant is picked.
 */

export const metadata: Metadata = {
  title: "Preview · Dividers",
  robots: { index: false, follow: false },
};

export default async function DividersPreviewPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  return (
    <main className="min-h-screen pt-[160px] pb-32 bg-[var(--color-bg)]">
      <div className="max-w-[1280px] mx-auto px-6 lg:px-12 mb-16">
        <p
          className="font-body uppercase text-[11px] text-[var(--color-text-muted)] mb-4"
          style={{ letterSpacing: "0.18em" }}
        >
          // INTERNAL · DIVIDERS COMPARISON
        </p>
        <h1 className="font-display italic text-[44px] md:text-[60px] leading-[1.05] tracking-tight text-[var(--color-text)] mb-4">
          Cuatro versiones del divider.
        </h1>
        <p className="font-body text-[16px] leading-[1.6] text-[var(--color-text-muted)] max-w-[680px]">
          Cada variante está rotulada arriba con su identificador. Scrollea
          rápido y para para apreciar la diferencia de la opción C (reacciona a
          la velocidad de scroll). Hover sobre la opción B la pausa.
        </p>
      </div>

      <Section label="// CURRENT — estático (lo que hay ahora)">
        <PatternDivider />
      </Section>

      <Section label="// OPCIÓN A — marquee infinito de asteriscos">
        <PatternDividerMarquee />
      </Section>

      <Section label="// OPCIÓN B — editorial con tokens (hover para pausar)">
        <PatternDividerEditorial />
      </Section>

      <Section
        label="// OPCIÓN C — editorial + scroll-velocity reactive (scrollea rápido)"
      >
        <PatternDividerReactive />
      </Section>

      {/* Spacer so the user can scroll past Option C and see it react */}
      <div className="h-[80vh] flex items-center justify-center">
        <p
          className="font-body uppercase text-[11px] text-[var(--color-text-muted)]"
          style={{ letterSpacing: "0.18em" }}
        >
          // SCROLL HACIA ARRIBA RÁPIDO PARA VER LA OPCIÓN C REACCIONAR
        </p>
      </div>
    </main>
  );
}

function Section({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <section className="mb-16">
      <div className="max-w-[1280px] mx-auto px-6 lg:px-12 mb-4">
        <span
          className="font-body uppercase text-[11px] text-[var(--color-accent)]"
          style={{ letterSpacing: "0.18em" }}
        >
          {label}
        </span>
      </div>
      {children}
    </section>
  );
}
