import { Star } from "lucide-react";
import { getTranslations } from "next-intl/server";

const GOOGLE_REVIEWS_URL = "https://www.google.com/search?q=bellostas+studio+huesca";
// Las caras de los testimonios (las mismas fotos que en «Palabra de cliente»).
const CARAS = ["/caras/javier-flores-face.png", "/caras/adela-face.png", "/caras/themis-face.png", "/caras/cara-teleadhesivo.jpg"];

/**
 * La prueba social corta de la V2: caras reales, 5,0 en Google, 70+ proyectos
 * y desde cuándo. Va bajo los botones de los heroes (home y servicios).
 * En escritorio, la cifra va al lado de la valoración tras una raya fina y con
 * su misma altura; en móvil no cabe al lado y va debajo en una sola línea.
 */
export async function ProofRow({
  locale,
  className = "",
  style,
  centro = false,
}: {
  locale: string;
  className?: string;
  style?: React.CSSProperties;
  /** Centrada (portadas con el texto al centro). */
  centro?: boolean;
}) {
  const tf = await getTranslations({ locale, namespace: "footer" });
  const tw = await getTranslations({ locale, namespace: "workPage.stats" });

  return (
    <div
      className={`flex flex-col gap-3.5 sm:flex-row sm:items-center sm:gap-6 ${centro ? "items-center sm:justify-center" : "items-start"} ${className}`}
      style={style}
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
        <span className="flex flex-col gap-0.5 text-left">
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
      <span aria-hidden className="hidden h-9 w-px bg-[var(--v2-line)] sm:block" />
      <span className="flex items-baseline gap-1.5 text-[13px] text-[var(--v2-muted)] sm:flex-col sm:items-start sm:gap-0.5">
        <span className="text-[14px] font-medium text-[var(--v2-text)] sm:text-[15px] sm:leading-[14px]">{tw("projects")}</span>
        <span aria-hidden className="sm:hidden">·</span>
        <span>{tw("since")}</span>
      </span>
    </div>
  );
}
