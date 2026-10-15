"use client";

import { useEffect, useRef, useState } from "react";
import { ArrowRight } from "lucide-react";
import { useTranslations } from "next-intl";
import { Link } from "@/navigation";
import { sonarClic, sonarHover } from "@/lib/v2/ui-sound";

export type CasoReel = {
  slug: string;
  nombre: string;
  etiquetas: string;
  color: string;
  video?: string;
  imagen?: string;
};

const DURACION_MS = 7000;

/**
 * El reproductor de casos del hero: va pasando de uno en uno, con una barra
 * de progreso por caso. Las barras también sirven para saltar a uno. Con
 * «reducir movimiento» no avanza solo.
 */
export function CaseReel({ casos }: { casos: CasoReel[] }) {
  const t = useTranslations("v2");
  const [i, setI] = useState(0);
  const [quieto, setQuieto] = useState(false);
  const timer = useRef<number | undefined>(undefined);

  useEffect(() => {
    setQuieto(window.matchMedia("(prefers-reduced-motion: reduce)").matches);
  }, []);

  useEffect(() => {
    if (quieto || casos.length < 2) return;
    timer.current = window.setTimeout(() => setI((n) => (n + 1) % casos.length), DURACION_MS);
    return () => window.clearTimeout(timer.current);
  }, [i, quieto, casos.length]);

  if (!casos.length) return null;
  const c = casos[i];

  return (
    <div
      className="flex flex-col gap-4"
      role="region"
      aria-roledescription="carousel"
      aria-label={t("reelAria")}
    >
      <Link
        href={{ pathname: "/work", query: { caso: c.slug } }}
        className="group relative block aspect-[16/11] overflow-hidden border border-[var(--v2-line)]"
        style={{ backgroundColor: c.color }}
        onClick={() => sonarClic("select")}
      >
        {casos.map((x, n) => (
          <div
            key={x.slug}
            className="absolute inset-0 transition-opacity duration-700"
            style={{ opacity: n === i ? 1 : 0 }}
            aria-hidden={n !== i}
          >
            {x.video ? (
              <video
                src={n === i ? x.video : undefined}
                autoPlay
                muted
                loop
                playsInline
                className="h-full w-full object-cover"
              />
            ) : x.imagen ? (
              <img src={x.imagen} alt="" className="h-full w-full object-cover" loading={n === 0 ? "eager" : "lazy"} />
            ) : null}
          </div>
        ))}
      </Link>

      <div className="flex items-start justify-between gap-4">
        <div className="flex flex-col gap-1">
          <span className="flex items-center gap-2">
            <span className="v2-label">{t("nowPlaying")}</span>
            <span className="text-[14px] font-medium">{c.nombre}</span>
          </span>
          <span className="text-[13px] text-[var(--v2-muted)]">{c.etiquetas}</span>
        </div>
        <Link
          href={{ pathname: "/work", query: { caso: c.slug } }}
          className="v2-link shrink-0 text-[13px]"
          onClick={() => sonarClic("select")}
        >
          {t("viewCase")} <ArrowRight size={13} />
        </Link>
      </div>

      {casos.length > 1 && (
        <div className="flex gap-2">
          {casos.map((x, n) => (
            <button
              key={x.slug}
              type="button"
              aria-label={x.nombre}
              aria-current={n === i}
              onPointerEnter={(e) => e.pointerType === "mouse" && sonarHover(n)}
              onClick={() => {
                sonarClic("select", n);
                setI(n);
              }}
              className="group flex-1 py-2"
            >
              <span
                className={`v2-progress block h-[2px] overflow-hidden bg-[var(--v2-line)] ${
                  n === i ? (quieto ? "is-done" : "is-active") : n < i ? "is-done" : ""
                }`}
                style={{ ["--dur" as string]: `${DURACION_MS}ms` }}
                key={`${x.slug}-${n === i ? i : "x"}`}
              >
                <span />
              </span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
