import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getResourceBySlug } from "@/lib/cms/resources";
import { LeadMagnetForm } from "@/components/sections/lead/LeadMagnetForm";
import { LandingViewTracker } from "@/components/sections/lead/LandingViewTracker";

/**
 * Landing de captura para lead magnets — /g/[slug].
 *
 * Vive FUERA del árbol de locales a propósito: sin navbar, sin preloader,
 * sin smooth-scroll ni widgets. El 95% del tráfico llega desde el navegador
 * interno de Instagram en móvil (columna única), pero en escritorio se abre
 * a dos columnas: copy a la izquierda, anticipo + formulario a la derecha.
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
      <LandingViewTracker slug={resource.slug} title={resource.title} type={resource.type} />
      <div className="w-full max-w-[460px] lg:max-w-[1060px] mx-auto px-6 lg:px-10 pt-9 lg:pt-12 pb-8 flex-1 flex flex-col">
        {/* Marca */}
        <div className="flex justify-center lg:justify-start mb-9 lg:mb-14">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/logos/logo-black.svg"
            alt="Bellostas Studio"
            className="h-[26px] lg:h-[30px] w-auto select-none"
          />
        </div>

        <div className="lg:grid lg:grid-cols-[1fr_420px] lg:gap-16 lg:items-start">
          {/* Columna de copy */}
          <div>
            <h1 className="font-display text-[32px] lg:text-[46px] leading-[1.1] lg:leading-[1.06] text-[var(--color-text)] text-center lg:text-left">
              {resource.title}
            </h1>
            {resource.subtitle && (
              <p className="mt-4 lg:mt-6 font-body text-[15.5px] lg:text-[17px] leading-[1.6] text-[var(--color-text-muted)] text-center lg:text-left lg:max-w-[520px]">
                {resource.subtitle}
              </p>
            )}

            {/* Qué hay dentro */}
            {resource.bullets.length > 0 && (
              <ul className="mt-8 lg:mt-10 flex flex-col gap-3 lg:gap-4">
                {resource.bullets.map((b) => (
                  <li
                    key={b}
                    className="flex items-start gap-3 font-body text-[15px] lg:text-[16px] leading-[1.5] text-[var(--color-text)]"
                  >
                    <span className="mt-[3px] text-[var(--color-accent)] font-bold" aria-hidden>
                      ✓
                    </span>
                    {b}
                  </li>
                ))}
              </ul>
            )}
          </div>

          {/* Columna de conversión: anticipo + formulario */}
          <div className="mt-8 lg:mt-0">
            {resource.coverUrl ? (
              <div className="relative rounded-2xl overflow-hidden border border-[var(--color-border)] aspect-[4/3] bg-[#F1F0EC] shadow-[0_18px_40px_-18px_rgba(29,29,27,0.25)]">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={resource.coverUrl}
                  alt={`Portada: ${resource.title}`}
                  className="absolute inset-0 w-full h-full object-cover object-top"
                />
              </div>
            ) : (
              <div className="relative rounded-2xl overflow-hidden aspect-[4/3] flex items-center justify-center bg-gradient-to-br from-[#2C2417] via-[#1D1D1B] to-[#14110D]">
                <span className="font-display italic text-[22px] text-white/80 px-8 text-center">
                  {resource.title}
                </span>
              </div>
            )}

            <div className="mt-5">
              <LeadMagnetForm
                slug={resource.slug}
                type={resource.type}
                ctaLabel={resource.ctaLabel}
              />
            </div>
          </div>
        </div>

        {/* Pie mínimo */}
        <footer className="mt-auto pt-10 lg:pt-16 text-center font-body text-[12px] text-[var(--color-text-muted)]">
          © {new Date().getFullYear()} Bellostas Studio ·{" "}
          <a href="/privacidad" className="underline underline-offset-2 hover:text-[var(--color-text)]">
            Privacidad
          </a>
        </footer>
      </div>
    </div>
  );
}
