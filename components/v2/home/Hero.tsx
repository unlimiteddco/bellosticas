import { Star } from "lucide-react";
import { getTranslations } from "next-intl/server";
import { Link } from "@/navigation";
import { bookingQuarter } from "@/lib/booking";
import { CaseReel, type CasoReel } from "./CaseReel";

const GOOGLE_REVIEWS_URL = "https://www.google.com/search?q=bellostas+studio+huesca";
// Las caras de los testimonios (las mismas fotos que en «Palabra de cliente»).
const CARAS = ["/caras/javier-flores-face.png", "/caras/adela-face.png", "/caras/themis-face.png", "/caras/cara-teleadhesivo.jpg"];

/*
 * El hero de la V2: texto a la izquierda y, a la derecha, un reproductor que
 * va pasando casos reales. Va sin líneas (ni laterales ni entre columnas),
 * como en DesignMe: el marco de líneas empieza en la franja de logos. Nada aquí depende del scroll ni de JS para verse:
 * entra con una animación CSS al cargar, que siempre termina.
 */
export async function Hero({ locale, casos }: { locale: string; casos: CasoReel[] }) {
  const t = await getTranslations({ locale, namespace: "hero" });
  const tv = await getTranslations({ locale, namespace: "v2" });
  const tf = await getTranslations({ locale, namespace: "footer" });
  const tw = await getTranslations({ locale, namespace: "workPage.stats" });
  // Solo el trimestre («Q4»): el año sobra en una frase de disponibilidad.
  const trimestre = bookingQuarter().split(" ")[0];

  return (
    <section className="v2-frame">
      <div className="relative grid grid-cols-1 lg:grid-cols-12">
        <div className="lg:col-span-8 flex flex-col justify-center gap-7 px-6 pt-12 pb-10 md:px-10 lg:py-24">
          <span className="v2-label v2-hero-in flex items-center gap-2.5 tracking-[0.08em] sm:tracking-[0.14em]" style={{ animationDelay: "0ms" }}>
            <span className="booking-dot" aria-hidden />
            {tv("heroLabel", { q: trimestre })}
          </span>
          {/* Dos líneas como máximo en escritorio: cada mitad del titular en su
              línea, con un tamaño que escala con el ancho para que quepa. */}
          <h1
            className="v2-hero-in text-[clamp(32px,9.4vw,44px)] leading-[1.04] tracking-[-0.035em] font-medium sm:text-[56px] lg:text-[clamp(48px,4.7vw,68px)] lg:leading-[1.04]"
            style={{ animationDelay: "80ms" }}
          >
            <span className="lg:block lg:whitespace-nowrap">{t("headline_line1")}</span>{" "}
            <span className="lg:block lg:whitespace-nowrap">
              {t("headline_line2_pre")}{" "}
              <em className="font-display italic font-semibold text-[var(--v2-accent)]">{t("headline_emphasis")}</em>{" "}
              {t("headline_line2_post")}
            </span>
          </h1>
          <p
            className="v2-hero-in max-w-[520px] text-[16px] leading-[1.55] text-[var(--v2-muted)] lg:text-[17px]"
            style={{ animationDelay: "160ms" }}
          >
            {t("sub")}
          </p>
          <div className="v2-hero-in flex flex-col gap-3 sm:flex-row sm:items-center" style={{ animationDelay: "240ms" }}>
            <Link href="/intro" className="v2-btn v2-btn--primary h-12 w-full sm:h-[46px] sm:w-auto">
              {t("cta_primary")}
            </Link>
            <Link href="/work" className="v2-btn v2-btn--ghost h-12 w-full sm:h-[46px] sm:w-auto">
              {t("cta_secondary")}
            </Link>
          </div>

          {/* La prueba, justo bajo los botones: quién lo dice (Google y caras
              reales), cuánto (70+ proyectos) y desde cuándo. */}
          <div
            className="v2-hero-in mt-3 flex flex-wrap items-center gap-x-6 gap-y-4"
            style={{ animationDelay: "320ms" }}
          >
            <a href={GOOGLE_REVIEWS_URL} target="_blank" rel="noopener" className="group flex items-center gap-3">
              <span className="flex -space-x-2" aria-hidden>
                {CARAS.map((src) => (
                  <img
                    key={src}
                    src={src}
                    alt=""
                    width={32}
                    height={32}
                    className="h-8 w-8 rounded-full object-cover ring-2 ring-[var(--v2-bg)]"
                  />
                ))}
              </span>
              <span className="flex flex-col gap-0.5">
                <span className="flex text-[var(--v2-accent)]" aria-hidden>
                  {[0, 1, 2, 3, 4].map((n) => (
                    <Star key={n} size={13} fill="currentColor" strokeWidth={0} />
                  ))}
                </span>
                <span className="text-[13px] text-[var(--v2-muted)] transition-colors group-hover:text-[var(--v2-text)]">
                  {tf("reviewsLine")}
                </span>
              </span>
            </a>
            <span className="flex flex-col gap-0.5">
              <span className="text-[15px] font-medium leading-none">{tw("projects")}</span>
              <span className="text-[13px] text-[var(--v2-muted)]">{tw("since")}</span>
            </span>
          </div>
        </div>

        <div className="lg:col-span-4 flex items-center px-6 pb-12 md:px-10 lg:py-16">
          <div className="v2-hero-in w-full" style={{ animationDelay: "200ms" }}>
            <CaseReel casos={casos} />
          </div>
        </div>
      </div>
    </section>
  );
}
