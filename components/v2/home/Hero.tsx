import { getTranslations } from "next-intl/server";
import { Link } from "@/navigation";
import { bookingQuarter } from "@/lib/booking";
import { CaseReel, type CasoReel } from "./CaseReel";
import { ProofRow } from "./ProofRow";

/*
 * El hero de la V2: texto a la izquierda y, a la derecha, un reproductor que
 * va pasando casos reales. Va sin líneas (ni laterales ni entre columnas),
 * como en DesignMe: el marco de líneas empieza en la franja de logos. Nada aquí depende del scroll ni de JS para verse:
 * entra con una animación CSS al cargar, que siempre termina.
 */
export async function Hero({ locale, casos }: { locale: string; casos: CasoReel[] }) {
  const t = await getTranslations({ locale, namespace: "hero" });
  const tv = await getTranslations({ locale, namespace: "v2" });
  // Titular y entradilla propios de la V2 (los de «hero» siguen siendo los de la V1).
  const th = await getTranslations({ locale, namespace: "v2Hero" });
  // Solo el trimestre («Q4»): el año sobra en una frase de disponibilidad.
  const trimestre = bookingQuarter().split(" ")[0];

  return (
    <section className="v2-frame">
      <div className="relative grid grid-cols-1 lg:grid-cols-12">
        <div className="lg:col-span-8 flex flex-col justify-center gap-7 px-5 pt-12 pb-10 md:px-0 lg:py-24 lg:pr-10">
          <span className="v2-label v2-hero-in flex items-center gap-2.5 tracking-[0.08em] sm:tracking-[0.14em]" style={{ animationDelay: "0ms" }}>
            <span className="booking-dot" aria-hidden />
            {tv("heroLabel", { q: trimestre })}
          </span>
          {/* Dos líneas en escritorio («Diseño y desarrollo web / que hace crecer
              tu marca.»), algo por debajo del resto de portadas para que
              quepan junto al vídeo también en inglés. */}
          <h1 className="v2-hero-in v2-h1 lg:text-[clamp(44px,4.9vw,66px)]" style={{ animationDelay: "80ms" }}>
            <span className="block lg:whitespace-nowrap">{th("line1")}</span>
            <span className="block lg:whitespace-nowrap">
              {th("line2_pre")}
              <span className="whitespace-nowrap">
                <em className="font-display italic font-semibold text-[var(--v2-accent)]">{th("line2_em")}</em>
                {th("line2_post")}
              </span>
            </span>
          </h1>
          <p
            className="v2-hero-in max-w-[560px] text-[16px] leading-[1.55] text-[var(--v2-muted)] lg:text-[17px]"
            style={{ animationDelay: "160ms" }}
          >
            {th("sub")}
          </p>
          <div className="v2-hero-in flex flex-col gap-3 sm:flex-row sm:items-center" style={{ animationDelay: "240ms" }}>
            <Link href="/v2/intro" className="v2-btn v2-btn--primary h-12 w-full sm:h-[46px] sm:w-auto">
              {t("cta_primary")}
            </Link>
            <Link href="/v2/work" className="v2-btn v2-btn--ghost h-12 w-full sm:h-[46px] sm:w-auto">
              {t("cta_secondary")}
            </Link>
          </div>

          {/* La prueba, justo bajo los botones: quién lo dice (Google y caras
              reales), cuánto (70+ proyectos) y desde cuándo. */}
          <ProofRow locale={locale} className="v2-hero-in mt-3" style={{ animationDelay: "320ms" }} />
        </div>

        <div className="lg:col-span-4 flex items-center px-5 pb-12 md:px-0 lg:py-16">
          <div className="v2-hero-in w-full" style={{ animationDelay: "200ms" }}>
            <CaseReel casos={casos} />
          </div>
        </div>
      </div>
    </section>
  );
}
