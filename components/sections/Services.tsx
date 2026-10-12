"use client";

import { useState } from "react";
import Link from "next/link";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { ArrowUpRight, Minus, Plus } from "lucide-react";
import { useTranslations } from "next-intl";
import { EditorialLabel } from "@/components/ui/EditorialLabel";
import { MixedHeadline } from "@/components/ui/MixedHeadline";
import { Reveal } from "@/components/ui/Reveal";
import { services } from "@/lib/services";

/**
 * Los servicios, en acordeón.
 *
 * Una fila por servicio —número y nombre en grande— y solo uno abierto a la
 * vez: al abrirlo sale una pieza visual a la izquierda y, a la derecha, qué
 * es, qué incluye y el enlace a su página. Enseña mucho más que una tarjeta
 * sin ocupar más: lo que no interesa se queda en una línea.
 *
 * «Identidad de marca» es un servicio nuevo que de momento SOLO vive aquí: no
 * está en el catálogo (lib/services.ts) porque aún no tiene página propia, y
 * meterlo allí lo sacaría en los menús con un enlace roto.
 */

/** La pieza visual de cada servicio. Un vídeo o una imagen que ya está en la web. */
const MEDIA: Record<string, { video?: string; img?: string }> = {
  marca: { video: "/videos/marca.mp4" },
  // Recorridos grabados de dos webs reales: un despacho y una tienda.
  s01: { video: "/videos/web-corporativa.mp4" },
  s02: { video: "/videos/ecommerce.mp4" },
  // Ilustraciones generadas con IA, todas con la misma dirección de arte (fondo
  // cálido, un solo rojo) y sin texto legible: son una metáfora del servicio,
  // no la captura de ningún proyecto.
  s03: { img: "/images/servicio-apps.webp" },
  s04: { img: "/images/servicio-automatizaciones.webp" },
  s05: { img: "/images/servicio-migraciones.webp" },
  s06: { img: "/images/servicio-marca-blanca.webp" },
};

export function Services() {
  const t = useTranslations("services");
  const reduce = useReducedMotion();
  const [abierto, setAbierto] = useState(0);

  const filas = [
    {
      clave: "marca",
      titulo: t("acc.brand.title"),
      descripcion: t("acc.brand.description"),
      puntos: t.raw("acc.brand.bullets") as string[],
      href: null as string | null,
    },
    ...services.map((s) => ({
      clave: s.titleKey as string,
      titulo: t(`items.${s.titleKey}.title`),
      descripcion: t(`items.${s.titleKey}.description`),
      puntos: t.raw(`acc.bullets.${s.titleKey}`) as string[],
      href: s.hasPage ? `/services/${s.slug}` : null,
    })),
  ];

  return (
    <section
      id="services"
      data-video-trigger
      className="relative z-10 max-w-[1280px] mx-auto px-6 lg:px-12 py-16 lg:py-24 scroll-mt-24"
    >
      <Reveal className="flex flex-col items-center text-center gap-6 mb-12 lg:mb-16 max-w-[820px] mx-auto">
        <EditorialLabel>{t("label")}</EditorialLabel>
        <MixedHeadline
          className="text-[44px] md:text-[64px]"
          parts={[
            { text: t("title_part1") },
            { text: t("title_emphasis"), accent: true },
            { text: t("title_part2") },
          ]}
        />
        <p className="font-body text-[16px] lg:text-[18px] leading-[1.5] text-[var(--color-text-muted)] max-w-[540px]">
          {t("sub")}
        </p>
      </Reveal>

      <ul className="border-b border-[var(--color-border)]">
        {filas.map((f, i) => {
          const on = abierto === i;
          const media = MEDIA[f.clave];
          return (
            <li key={f.clave} className="border-t border-[var(--color-border)]">
              <button
                type="button"
                onClick={() => setAbierto(on ? -1 : i)}
                aria-expanded={on}
                aria-label={`${on ? t("acc.close") : t("acc.open")}: ${f.titulo}`}
                className="group flex w-full items-center gap-5 md:gap-10 py-6 md:py-8 text-left cursor-pointer"
              >
                <span
                  className={`w-10 md:w-[72px] shrink-0 font-body font-medium tracking-tight text-[24px] md:text-[40px] leading-none transition-colors ${
                    on ? "text-[var(--color-accent)]" : "text-[var(--color-text)] group-hover:text-[var(--color-accent)]"
                  }`}
                >
                  {String(i + 1).padStart(2, "0")}
                </span>
                <span className="flex-1 font-body font-medium tracking-tight text-[24px] md:text-[40px] leading-[1.1] text-[var(--color-text)]">
                  {f.titulo}
                </span>
                {on ? (
                  <Minus size={30} strokeWidth={1.5} className="shrink-0 text-[var(--color-accent)]" />
                ) : (
                  <Plus size={30} strokeWidth={1.5} className="shrink-0 text-[var(--color-accent)] transition-transform duration-300 group-hover:rotate-90" />
                )}
              </button>

              <AnimatePresence initial={false}>
                {on && (
                  <motion.div
                    initial={reduce ? false : { height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={reduce ? undefined : { height: 0, opacity: 0 }}
                    transition={{ duration: 0.45, ease: [0.4, 0, 0.2, 1] }}
                    className="overflow-hidden"
                  >
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-10 pb-8 md:pb-10">
                      <div className="relative aspect-[16/11] rounded-2xl overflow-hidden bg-[var(--color-surface-2)]">
                        {media?.video ? (
                          <video
                            src={media.video}
                            autoPlay
                            muted
                            loop
                            playsInline
                            className="absolute inset-0 h-full w-full object-cover"
                          />
                        ) : media?.img ? (
                          <img src={media.img} alt="" loading="lazy" className="absolute inset-0 h-full w-full object-cover" />
                        ) : null}
                      </div>
                      <div className="flex flex-col gap-6 md:py-2">
                        <p className="font-body text-[17px] md:text-[19px] leading-[1.55] text-[var(--color-text)]">{f.descripcion}</p>
                        <ul className="flex flex-col gap-2.5">
                          {f.puntos.map((x) => (
                            <li key={x} className="flex items-baseline gap-3 font-body text-[15.5px] text-[var(--color-text-muted)]">
                              <span className="h-1 w-1 shrink-0 rounded-full bg-[var(--color-accent)] translate-y-[-3px]" />
                              {x}
                            </li>
                          ))}
                        </ul>
                        {f.href && (
                          <Link
                            href={f.href}
                            className="group/link mt-auto inline-flex items-center gap-1.5 self-start font-body text-[14.5px] font-medium text-[var(--color-text)]"
                          >
                            <span className="underline decoration-[var(--color-accent)] underline-offset-[6px]">{t("acc.link")}</span>
                            <ArrowUpRight
                              size={15}
                              className="text-[var(--color-accent)] transition-transform duration-200 group-hover/link:translate-x-0.5 group-hover/link:-translate-y-0.5"
                            />
                          </Link>
                        )}
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
