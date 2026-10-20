import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Check } from "lucide-react";
import { getResourceBySlug } from "@/lib/cms/resources";
import { RESOURCE_TYPES } from "@/lib/resource-type";
import { Logo } from "@/components/ui/Logo";
import { AsteriskIcon } from "@/components/ui/AsteriskIcon";
import { LeadMagnetForm } from "@/components/sections/lead/LeadMagnetForm";
import { LandingViewTracker } from "@/components/sections/lead/LandingViewTracker";
import { V2Root } from "@/components/v2/V2Root";

/*
 * La landing de un recurso (lead magnet) con el estilo de la V2, para
 * sustituir a /g/[slug] cuando se publique la V2. Mismo recurso (Payload →
 * resources), mismo formulario y la misma entrega solo por email; cambia la
 * forma: marco de líneas, titular en grande y el formulario en tarjeta.
 *
 * Sigue siendo una landing de embudo: sin menú ni pie de la web, para que lo
 * único que se pueda hacer sea pedir el recurso. Casi todo el tráfico llega
 * desde el navegador de Instagram en el móvil, así que en el móvil va en una
 * columna (titular, qué hay dentro, portada y formulario). Solo en español.
 */
export const dynamic = "force-dynamic";

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const recurso = await getResourceBySlug(slug);
  return {
    title: recurso ? `${recurso.title} · Bellostas Studio` : "Bellostas Studio",
    description: recurso?.subtitle,
    robots: { index: false, follow: false },
  };
}

export default async function RecursoV2({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const recurso = await getResourceBySlug(slug);
  if (!recurso) notFound();

  // «Guía gratuita» / «Proceso gratuito»…, según el tipo de recurso.
  const tipo = RESOURCE_TYPES.find((x) => x.value === recurso.type) ?? RESOURCE_TYPES[0];
  const etiqueta = `${tipo.noun.charAt(0).toUpperCase()}${tipo.noun.slice(1)} ${tipo.article === "la" ? "gratuita" : "gratuito"}`;

  return (
    <V2Root>
      <LandingViewTracker slug={recurso.slug} title={recurso.title} type={recurso.type} />
      <div className="v2-legado flex min-h-dvh flex-col">
        {/* Solo la marca: aquí no hay a dónde más ir. */}
        <header className="border-b border-[var(--v2-line)]">
          <div className="v2-frame">
            <div className="flex h-[60px] items-center justify-center px-6 lg:justify-start lg:px-10">
              <span className="v2-solo-claro">
                <Logo variant="black" height={20} priority />
              </span>
              <span className="v2-solo-oscuro">
                <Logo variant="blanco-rojo" height={20} priority />
              </span>
            </div>
          </div>
        </header>

        <main className="v2-frame flex-1">
          <div className="v2-rail grid grid-cols-1 lg:grid-cols-12">
            {/* ── El recurso: qué es y qué hay dentro ── */}
            <div className="flex flex-col gap-6 px-6 pb-8 pt-10 text-center lg:col-span-7 lg:border-r lg:border-[var(--v2-line)] lg:px-12 lg:pb-14 lg:pt-16 lg:text-left">
              <div className="v2-hero-in flex flex-wrap items-center justify-center gap-2 lg:justify-start">
                <span className="v2-tag">{etiqueta}</span>
                {recurso.keyword && <span className="v2-label">#{recurso.keyword}</span>}
              </div>
              <h1
                className="v2-hero-in v2-h1 v2-h1--doc"
                style={{ animationDelay: "80ms" }}
              >
                {recurso.title}
              </h1>
              {recurso.subtitle && (
                <p
                  className="v2-hero-in mx-auto max-w-[560px] text-[16px] leading-[1.6] text-[var(--v2-muted)] lg:mx-0 lg:text-[18px]"
                  style={{ animationDelay: "160ms" }}
                >
                  {recurso.subtitle}
                </p>
              )}
              {recurso.bullets.length > 0 && (
                <ul className="v2-hero-in mt-2 flex flex-col border-t border-[var(--v2-line)] text-left" style={{ animationDelay: "220ms" }}>
                  {recurso.bullets.map((b, i) => (
                    <li key={b} className="flex items-start gap-4 border-b border-[var(--v2-line)] py-3.5">
                      <span className="mt-[3px] font-mono text-[11px] text-[var(--v2-accent)]">{String(i + 1).padStart(2, "0")}</span>
                      <span className="flex-1 text-[15.5px] leading-[1.5]">{b}</span>
                      <Check size={15} strokeWidth={2} className="mt-[3px] shrink-0 text-[var(--v2-accent)]" />
                    </li>
                  ))}
                </ul>
              )}
            </div>

            {/* ── La portada y el formulario (fijos en escritorio) ── */}
            <div className="px-6 pb-12 lg:col-span-5 lg:px-10 lg:pb-14 lg:pt-16">
              <div className="v2-hero-in flex flex-col gap-4 lg:sticky lg:top-8" style={{ animationDelay: "260ms" }}>
                <div className="relative aspect-[4/3] overflow-hidden rounded-[8px] border border-[var(--v2-line)] bg-[var(--v2-bg-2)] shadow-[0_30px_60px_-40px_rgba(29,29,27,0.45)]">
                  {recurso.coverUrl ? (
                    <img src={recurso.coverUrl} alt={`Portada: ${recurso.title}`} className="absolute inset-0 h-full w-full object-cover object-top" />
                  ) : (
                    // Sin portada subida: una de marca con el propio título.
                    <div className="absolute inset-0 flex flex-col bg-[#121211] text-[#f4f2ee]">
                      <div className="flex items-center justify-between border-b border-white/15 px-6 py-4">
                        <AsteriskIcon className="h-5 w-5 text-[var(--v2-accent)]" />
                        <span className="font-mono text-[10px] uppercase tracking-[0.14em] text-white/60">
                          {recurso.keyword ? `#${recurso.keyword}` : etiqueta}
                        </span>
                      </div>
                      <p className="flex flex-1 items-center px-6 text-[26px] font-medium leading-[1.12] tracking-[-0.02em]">
                        <span className="line-clamp-4">{recurso.title}</span>
                      </p>
                    </div>
                  )}
                </div>
                <LeadMagnetForm slug={recurso.slug} type={recurso.type} ctaLabel={recurso.ctaLabel} variante="v2" />
              </div>
            </div>
          </div>
        </main>

        <footer className="border-t border-[var(--v2-line)]">
          <div className="v2-frame">
            <p className="flex flex-wrap items-center justify-center gap-x-2 px-6 py-5 text-[12.5px] text-[var(--v2-muted)] lg:justify-between lg:px-10">
              <span>© {new Date().getFullYear()} Bellostas Studio</span>
              <a href="/privacidad" className="underline-offset-2 hover:text-[var(--v2-text)] hover:underline">
                Privacidad
              </a>
            </p>
          </div>
        </footer>
      </div>
    </V2Root>
  );
}
