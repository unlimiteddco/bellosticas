import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getResourceBySlug } from "@/lib/cms/resources";
import { LeadMagnetForm } from "@/components/sections/lead/LeadMagnetForm";

/**
 * Landing de captura para lead magnets — /g/[slug].
 *
 * Vive FUERA del árbol de locales a propósito: sin navbar, sin preloader,
 * sin smooth-scroll ni widgets. El 95% del tráfico llega desde el navegador
 * interno de Instagram en móvil, así que la página es mínima: título,
 * anticipo difuminado de la guía, bullets y el formulario de email.
 * La entrega es SOLO por email (garantiza emails reales para la lista).
 */

export const dynamic = "force-dynamic";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const resource = await getResourceBySlug(slug);
  return {
    title: resource ? `${resource.title} · Bellostas Studio` : "Bellostas Studio",
    description: resource?.subtitle,
    // Landings de embudo: fuera del índice para no ensuciar el SEO del sitio.
    robots: { index: false, follow: false },
  };
}

export default async function LeadMagnetPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const resource = await getResourceBySlug(slug);
  if (!resource) notFound();

  return (
    <div className="min-h-dvh bg-[var(--color-bg)] flex flex-col">
      <div className="w-full max-w-[480px] mx-auto px-6 pt-10 pb-8 flex-1 flex flex-col">
        {/* Marca */}
        <p className="text-center select-none mb-9">
          <span className="font-body font-bold text-[19px] tracking-tight text-[var(--color-text)]">
            Bellostas
          </span>
          <span className="font-display italic text-[19px] text-[var(--color-text)]"> studio</span>
        </p>

        {/* Título + subtítulo */}
        <h1 className="font-display text-[32px] leading-[1.1] text-[var(--color-text)] text-center">
          {resource.title}
        </h1>
        {resource.subtitle && (
          <p className="mt-4 font-body text-[15.5px] leading-[1.6] text-[var(--color-text-muted)] text-center">
            {resource.subtitle}
          </p>
        )}

        {/* Anticipo difuminado de la guía */}
        {resource.coverUrl ? (
          <div className="relative mt-8 rounded-2xl overflow-hidden border border-[var(--color-border)] aspect-[4/3] bg-[var(--color-surface-2,#F1F0EC)]">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={resource.coverUrl}
              alt={`Vista previa: ${resource.title}`}
              className="absolute inset-0 w-full h-full object-cover object-top blur-[7px] scale-[1.06]"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[rgba(253,253,251,0.92)] via-transparent to-transparent" />
            <span
              className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 px-4 py-2 rounded-full bg-[var(--color-text)] text-white font-mono uppercase text-[10.5px]"
              style={{ letterSpacing: "0.12em" }}
            >
              Vista previa
            </span>
          </div>
        ) : (
          <div className="relative mt-8 rounded-2xl overflow-hidden aspect-[4/3] flex items-center justify-center bg-gradient-to-br from-[#2C2417] via-[#1D1D1B] to-[#14110D]">
            <span className="font-display italic text-[22px] text-white/80 px-8 text-center">
              {resource.title}
            </span>
          </div>
        )}

        {/* Qué hay dentro */}
        {resource.bullets.length > 0 && (
          <ul className="mt-8 flex flex-col gap-3">
            {resource.bullets.map((b) => (
              <li key={b} className="flex items-start gap-3 font-body text-[15px] leading-[1.5] text-[var(--color-text)]">
                <span className="mt-[3px] text-[var(--color-accent)] font-bold" aria-hidden>
                  ✓
                </span>
                {b}
              </li>
            ))}
          </ul>
        )}

        {/* Formulario */}
        <div className="mt-9">
          <LeadMagnetForm slug={resource.slug} ctaLabel={resource.ctaLabel} />
        </div>

        {/* Pie mínimo */}
        <footer className="mt-auto pt-10 text-center font-body text-[12px] text-[var(--color-text-muted)]">
          © {new Date().getFullYear()} Bellostas Studio ·{" "}
          <a href="/privacidad" className="underline underline-offset-2 hover:text-[var(--color-text)]">
            Privacidad
          </a>
        </footer>
      </div>
    </div>
  );
}
