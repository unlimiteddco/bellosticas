import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Check } from "lucide-react";
import { Logo } from "@/components/ui/Logo";
import { V2Root } from "@/components/v2/V2Root";
import { BotonComprar } from "@/components/sections/tienda/BotonComprar";
import { euros, fichaProducto } from "@/lib/tienda";

/*
 * Landing de venta de un producto digital (bellostas.studio/tienda/<slug>).
 * Mismo planteamiento que las de los lead magnets (/g/…): sin menú, móvil
 * primero (casi todo llega del navegador de Instagram) y un solo objetivo,
 * comprar. El precio sale del CRM, que es quien cobra; el texto, de aquí.
 */
export const dynamic = "force-dynamic";

interface Contenido {
  etiqueta: string;
  titulo: string;
  subtitulo: string;
  incluye: string[];
  necesitas: string[];
  capturas: { src: string; alt: string; movil?: boolean }[];
  faq: { p: string; r: string }[];
}

const CONTENIDO: Record<string, Contenido> = {
  "vestuario-3d": {
    etiqueta: "Código + guía",
    titulo: "El vestuario 3D de tu club, listo para publicar",
    subtitulo:
      "El código completo de la web del vídeo y una guía para adaptarla a tu club con Claude Code: camisetas, plantilla, colores y escudo.",
    incluye: [
      "Vestuario 3D con una percha por jugador, su ficha y sus estadísticas (Astro y Three.js).",
      "Personalizador: nombre y dorsal en la camiseta, con enlace a la tienda del club (Shopify).",
      "Vídeo vertical de la convocatoria en MP4 (1080×1920), listo para redes.",
      "Pipeline para pasar de fotos de producto a camisetas 3D (Python y Blender).",
      "Un club de ejemplo completo: cambias una carpeta y es tu club.",
      "Guía en PDF para adaptarlo paso a paso con Claude Code.",
      "Listo para publicar con Docker o en cualquier hosting estático.",
    ],
    necesitas: [
      "Un ordenador con Node 22 y Claude Code.",
      "Para generar tus propias camisetas 3D, Python y Blender (gratis). Si tu camiseta tiene la forma de la del ejemplo, basta con cambiar las texturas.",
      "Escudo, camisetas y fotos de tu club, con permiso para usarlos.",
    ],
    capturas: [
      { src: "/tienda/vestuario-3d/ficha.webp", alt: "El vestuario de ejemplo con la ficha de un jugador abierta" },
      { src: "/tienda/vestuario-3d/movil-ficha.webp", alt: "La camiseta y la ficha en el móvil", movil: true },
      { src: "/tienda/vestuario-3d/movil-personaliza.webp", alt: "El personalizador de nombre y dorsal en el móvil", movil: true },
      { src: "/tienda/vestuario-3d/convocatoria.webp", alt: "El editor del vídeo de la convocatoria" },
    ],
    faq: [
      {
        p: "¿Necesito saber programar?",
        r: "No hace falta ser programador, pero sí perderle el miedo a la terminal: instalar Node, abrir el proyecto y pedirle cambios a Claude Code. La guía te lleva paso a paso.",
      },
      {
        p: "¿Puedo usar el escudo y las camisetas de cualquier club?",
        r: "Solo si eres el club o tienes su permiso: escudos, equipaciones y fotos son de sus dueños. Por eso la plantilla viene con un club inventado. Encaja perfecto con clubes de base, regionales y peñas que tienen su propio escudo.",
      },
      {
        p: "¿Lo puedo usar para webs de clientes?",
        r: "Sí, sin límite de proyectos. Lo que no puedes es revender o compartir la plantilla en sí.",
      },
      {
        p: "¿Recibo las actualizaciones?",
        r: "Sí. El enlace de descarga no caduca: cuando saque una versión nueva, estará en el mismo sitio.",
      },
      {
        p: "¿Y si prefiero que me lo hagas tú?",
        r: "Escríbeme desde la página de contacto y te digo qué haría falta y cuánto costaría para tu club.",
      },
    ],
  },
};

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const c = CONTENIDO[slug];
  return {
    title: c ? `${c.titulo} · Bellostas Studio` : "Bellostas Studio",
    description: c?.subtitulo,
    robots: { index: false, follow: false },
  };
}

export default async function ProductoPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const c = CONTENIDO[slug];
  if (!c) notFound();
  const ficha = await fichaProducto(slug);
  const precio = ficha ? euros(ficha.importe) : null;
  const hasta = ficha?.lanzamientoHasta
    ? new Intl.DateTimeFormat("es-ES", { day: "numeric", month: "long", timeZone: "Europe/Madrid" }).format(new Date(ficha.lanzamientoHasta))
    : null;

  const compra = (
    <div className="v2-card flex flex-col gap-4 p-5 lg:p-6">
      <div className="flex items-end justify-between gap-3">
        <div>
          <p className="v2-label">Pago único</p>
          <p className="mt-1 flex items-baseline gap-2">
            <span className="text-[44px] font-medium leading-none tracking-[-0.03em]">{precio ?? "—"}</span>
            {ficha && ficha.normal > ficha.importe && (
              <span className="text-[18px] text-[var(--v2-faint)] line-through">{euros(ficha.normal)}</span>
            )}
          </p>
        </div>
        <span className="pb-1 text-right text-[12.5px] text-[var(--v2-muted)]">IVA incluido</span>
      </div>
      {hasta && (
        <p className="border-l-2 border-[var(--v2-accent)] pl-3 text-[14px] leading-[1.45]">
          Precio de lanzamiento hasta el {hasta}. Después, {euros(ficha!.normal)}.
        </p>
      )}
      <BotonComprar producto={slug} precio={precio ?? ""} disponible={Boolean(ficha?.disponible && precio)} />
    </div>
  );

  return (
    <V2Root>
      <div className="flex min-h-dvh flex-col">
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
          {/* ── Qué es, la imagen y la compra ── */}
          <div className="v2-rail grid grid-cols-1 lg:grid-cols-12">
            <div className="flex flex-col gap-6 px-6 pb-8 pt-10 text-center lg:col-span-7 lg:border-r lg:border-[var(--v2-line)] lg:px-12 lg:pb-14 lg:pt-16 lg:text-left">
              <div className="v2-hero-in flex justify-center lg:justify-start">
                <span className="v2-tag">{c.etiqueta}</span>
              </div>
              <h1 className="v2-hero-in v2-h1 v2-h1--doc" style={{ animationDelay: "80ms" }}>
                {c.titulo}
              </h1>
              <p
                className="v2-hero-in mx-auto max-w-[560px] text-[16px] leading-[1.6] text-[var(--v2-muted)] lg:mx-0 lg:text-[18px]"
                style={{ animationDelay: "160ms" }}
              >
                {c.subtitulo}
              </p>
              <div
                className="v2-hero-in overflow-hidden rounded-[8px] border border-[var(--v2-line)] bg-[#070504] shadow-[0_30px_60px_-40px_rgba(29,29,27,0.45)]"
                style={{ animationDelay: "220ms" }}
              >
                <img src={c.capturas[0].src} alt={c.capturas[0].alt} width={1600} height={1000} className="block h-auto w-full" />
              </div>
            </div>

            <div className="px-6 pb-12 lg:col-span-5 lg:px-10 lg:pb-14 lg:pt-16">
              <div className="v2-hero-in flex flex-col gap-6 lg:sticky lg:top-8" style={{ animationDelay: "260ms" }}>
                {compra}
                <div>
                  <p className="v2-label mb-2">Qué incluye</p>
                  <ul className="flex flex-col border-t border-[var(--v2-line)]">
                    {c.incluye.map((b, i) => (
                      <li key={b} className="flex items-start gap-4 border-b border-[var(--v2-line)] py-3">
                        <span className="mt-[3px] font-mono text-[11px] text-[var(--v2-accent)]">{String(i + 1).padStart(2, "0")}</span>
                        <span className="flex-1 text-[15px] leading-[1.5]">{b}</span>
                        <Check size={15} strokeWidth={2} className="mt-[3px] shrink-0 text-[var(--v2-accent)]" />
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </div>

          {/* ── Más capturas ── */}
          <div className="v2-sep" />
          <section className="grid grid-cols-2 gap-3 px-6 py-10 lg:grid-cols-4 lg:gap-4 lg:px-10">
            {c.capturas.slice(1).map((s) => (
              <figure
                key={s.src}
                className={`overflow-hidden rounded-[8px] border border-[var(--v2-line)] bg-[#070504] ${s.movil ? "" : "col-span-2"}`}
              >
                <img src={s.src} alt={s.alt} loading="lazy" className="block h-full w-full object-cover object-top" />
              </figure>
            ))}
          </section>

          {/* ── Qué necesitas y preguntas ── */}
          <div className="v2-sep" />
          <section className="grid grid-cols-1 lg:grid-cols-12">
            <div className="px-6 py-10 lg:col-span-5 lg:border-r lg:border-[var(--v2-line)] lg:px-10">
              <h2 className="v2-label mb-4">Qué necesitas</h2>
              <ul className="flex flex-col gap-3 text-[15px] leading-[1.55]">
                {c.necesitas.map((n) => (
                  <li key={n} className="flex gap-3">
                    <span className="mt-[9px] h-[5px] w-[5px] shrink-0 bg-[var(--v2-accent)]" />
                    {n}
                  </li>
                ))}
              </ul>
            </div>
            <div className="px-6 pb-10 lg:col-span-7 lg:px-10 lg:pt-10">
              <h2 className="v2-label mb-2">Preguntas</h2>
              <div className="border-t border-[var(--v2-line)]">
                {c.faq.map((f) => (
                  <details key={f.p} className="group border-b border-[var(--v2-line)]">
                    <summary className="flex cursor-pointer list-none items-center justify-between gap-4 py-4 text-[16px] font-medium">
                      {f.p}
                      <span className="text-[20px] leading-none text-[var(--v2-accent)] transition-transform group-open:rotate-45">+</span>
                    </summary>
                    <p className="pb-4 text-[15px] leading-[1.6] text-[var(--v2-muted)]">
                      {f.r}
                      {f.p.startsWith("¿Y si prefiero") && (
                        <>
                          {" "}
                          <a href="/contacto" className="text-[var(--v2-text)] underline underline-offset-2">
                            Ir a contacto
                          </a>
                        </>
                      )}
                    </p>
                  </details>
                ))}
              </div>
            </div>
          </section>

          {/* ── Otra vez la compra, al final, para quien lo ha leído todo ── */}
          <div className="v2-sep" />
          <section className="mx-auto max-w-[520px] px-6 py-10">{compra}</section>

          {/* ── Condiciones de venta ── */}
          <div className="v2-sep" />
          <section id="condiciones" className="px-6 py-10 text-[13.5px] leading-[1.6] text-[var(--v2-muted)] lg:px-10">
            <h2 className="v2-label mb-3">Condiciones de venta</h2>
            <div className="max-w-[760px] space-y-2">
              <p>
                Vende Bellostas Studio (los datos del titular están en el{" "}
                <a href="/legal" className="underline underline-offset-2">
                  aviso legal
                </a>
                ). El precio es un pago único con IVA incluido; se cobra con Stripe y no se guarda tu tarjeta.
              </p>
              <p>
                Al pagar recibes al momento, en pantalla y por email, un enlace para descargar los archivos. El enlace no caduca e
                incluye las versiones nuevas que se publiquen.
              </p>
              <p>
                Es contenido digital que se entrega en el acto: antes de pagar aceptas que pierdes el derecho de desistimiento de 14
                días en cuanto lo descargas. Si algo no funciona como se describe aquí, escribe a info@bellostas.studio y lo
                arreglamos o te devolvemos el dinero.
              </p>
              <p>
                Licencia: puedes usar y modificar el código en proyectos propios y de clientes, sin límite. No puedes revender,
                compartir ni publicar la plantilla en sí. Escudos, equipaciones y fotos de clubes reales son de sus titulares: úsalos
                solo con permiso.
              </p>
            </div>
          </section>
        </main>

        <footer className="border-t border-[var(--v2-line)]">
          <div className="v2-frame">
            <p className="flex flex-wrap items-center justify-center gap-x-4 px-6 py-5 text-[12.5px] text-[var(--v2-muted)] lg:justify-between lg:px-10">
              <span>© {new Date().getFullYear()} Bellostas Studio</span>
              <span className="flex gap-4">
                <a href="/legal" className="underline-offset-2 hover:text-[var(--v2-text)] hover:underline">
                  Aviso legal
                </a>
                <a href="/privacidad" className="underline-offset-2 hover:text-[var(--v2-text)] hover:underline">
                  Privacidad
                </a>
              </span>
            </p>
          </div>
        </footer>
      </div>
    </V2Root>
  );
}
