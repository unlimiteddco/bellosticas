"use client";

import { useState } from "react";
import { ArrowUpRight } from "lucide-react";
import { useTranslations } from "next-intl";
import { Link } from "@/navigation";
import { services } from "@/lib/services";
import { MEDIA } from "@/components/sections/Services";
import { sonarClic, sonarHover } from "@/lib/v2/ui-sound";

type Destino = React.ComponentProps<typeof Link>["href"];

/**
 * Servicios en acordeón numerado, separados por líneas. Los textos, bullets y
 * piezas visuales son los de la home actual (services.*, MEDIA); aquí solo
 * cambia la forma. Uno abierto a la vez; el alto se anima con la rejilla
 * 0fr → 1fr, que no necesita medir nada.
 */
export function ServicesV2() {
  const t = useTranslations("services");
  const [abierto, setAbierto] = useState(0);

  const filas = [
    {
      clave: "marca",
      titulo: t("acc.brand.title"),
      descripcion: t("acc.brand.description"),
      puntos: t.raw("acc.brand.bullets") as string[],
      href: null as Destino | null,
    },
    ...services.map((s) => ({
      clave: s.titleKey as string,
      titulo: t(`items.${s.titleKey}.title`),
      descripcion: t(`items.${s.titleKey}.description`),
      puntos: t.raw(`acc.bullets.${s.titleKey}`) as string[],
      href: (s.hasPage ? `/services/${s.slug}` : null) as Destino | null,
    })),
  ];

  return (
    <section id="servicios" className="v2-frame scroll-mt-20">
      <div className="v2-rail">
        <span aria-hidden data-draw className="pointer-events-none absolute left-0 right-0 top-0 h-px bg-[var(--v2-line)]" />
        <div className="mx-auto flex max-w-[720px] flex-col items-center gap-5 px-6 py-20 text-center lg:py-24">
          <span className="v2-label" data-reveal>
            {t("label")}
          </span>
          <h2 className="text-[38px] font-medium leading-[1.05] tracking-[-0.03em] md:text-[56px]" data-reveal>
            {t("title_part1")}
            <em className="font-display italic font-semibold text-[var(--v2-accent)]">{t("title_emphasis")}</em>
            {t("title_part2")}
          </h2>
          <p className="max-w-[520px] text-[16px] leading-[1.55] text-[var(--v2-muted)]" data-reveal>
            {t("sub")}
          </p>
        </div>

        <ul className="border-t border-[var(--v2-line)]">
          {filas.map((f, i) => {
            const on = abierto === i;
            const media = MEDIA[f.clave];
            return (
              <li key={f.clave} className="border-b border-[var(--v2-line)]" data-reveal>
                <button
                  type="button"
                  aria-expanded={on}
                  aria-controls={`v2-serv-${f.clave}`}
                  onPointerEnter={(e) => e.pointerType === "mouse" && sonarHover(i)}
                  onClick={() => {
                    sonarClic(on ? "close" : "open", i);
                    setAbierto(on ? -1 : i);
                  }}
                  className="group flex w-full items-center gap-5 px-6 py-6 text-left md:gap-10 md:px-10 md:py-7"
                >
                  <span
                    className={`w-10 shrink-0 font-mono text-[15px] transition-colors md:w-16 md:text-[17px] ${
                      on ? "text-[var(--v2-accent)]" : "text-[var(--v2-muted)] group-hover:text-[var(--v2-accent)]"
                    }`}
                  >
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <span className="flex-1 text-[24px] font-medium leading-[1.1] tracking-[-0.02em] md:text-[38px]">{f.titulo}</span>
                  <span
                    aria-hidden
                    className={`relative h-5 w-5 shrink-0 transition-transform duration-500 ease-[var(--v2-ease)] ${on ? "rotate-45" : "group-hover:rotate-90"}`}
                  >
                    <span className="absolute left-0 top-1/2 h-px w-full -translate-y-1/2 bg-[var(--v2-accent)]" />
                    <span className="absolute left-1/2 top-0 h-full w-px -translate-x-1/2 bg-[var(--v2-accent)]" />
                  </span>
                </button>

                <div
                  id={`v2-serv-${f.clave}`}
                  className="grid transition-[grid-template-rows] duration-[450ms] ease-[var(--v2-ease)]"
                  style={{ gridTemplateRows: on ? "1fr" : "0fr" }}
                >
                  <div className="overflow-hidden" inert={!on}>
                    <div
                      className={`grid grid-cols-1 gap-8 px-6 pb-10 transition-[opacity,transform] duration-500 md:grid-cols-12 md:px-10 ${
                        on ? "translate-y-0 opacity-100" : "translate-y-1.5 opacity-0"
                      }`}
                    >
                      <div className="md:col-span-6 md:col-start-1">
                        <div className="relative aspect-[16/10] overflow-hidden border border-[var(--v2-line)] bg-[var(--v2-bg-2)]">
                          {media?.video ? (
                            <video src={on ? media.video : undefined} autoPlay muted loop playsInline className="absolute inset-0 h-full w-full object-cover" />
                          ) : media?.img ? (
                            <img src={media.img} alt="" loading="lazy" className="absolute inset-0 h-full w-full object-cover" />
                          ) : null}
                        </div>
                      </div>
                      <div className="flex flex-col gap-6 md:col-span-5 md:col-start-8">
                        <p className="text-[17px] leading-[1.55]">{f.descripcion}</p>
                        <ul className="flex flex-col">
                          {f.puntos.map((x) => (
                            <li key={x} className="flex items-center gap-3 border-t border-[var(--v2-line)] py-2.5 text-[14.5px] text-[var(--v2-muted)]">
                              <span className="h-1 w-1 shrink-0 bg-[var(--v2-accent)]" />
                              {x}
                            </li>
                          ))}
                        </ul>
                        {f.href && (
                          <Link href={f.href} className="v2-link mt-auto self-start" onClick={() => sonarClic("select")}>
                            {t("acc.link")} <ArrowUpRight size={14} className="text-[var(--v2-accent)]" />
                          </Link>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
