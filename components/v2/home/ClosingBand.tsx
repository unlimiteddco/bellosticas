"use client";

import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { Link } from "@/navigation";
import { bookingQuarter } from "@/lib/booking";
import { sonarClic } from "@/lib/v2/ui-sound";

/** La hora de Huesca, para la franja inferior. */
function horaHuesca() {
  // Con la zona incluida: «18:42 CEST» en verano y «CET» en invierno, sin acertar a mano.
  return new Intl.DateTimeFormat("es-ES", { timeZone: "Europe/Madrid", hour: "2-digit", minute: "2-digit", timeZoneName: "short" }).format(new Date());
}

/**
 * La banda final, oscura en los dos temas: la llamada a la acción con un
 * brillo rojo suave y, abajo, una franja con la hora del estudio. Marca
 * data-header-tone="dark" para que la cabecera se oscurezca al pasar.
 */
export function ClosingBand() {
  const t = useTranslations("ctaFinal");
  const [hora, setHora] = useState("");

  useEffect(() => {
    setHora(horaHuesca());
    const id = window.setInterval(() => setHora(horaHuesca()), 30_000);
    return () => window.clearInterval(id);
  }, []);

  return (
    <section data-header-tone="dark" className="relative overflow-hidden bg-[var(--v2-band)] text-[var(--v2-band-text)]">
      <div
        aria-hidden
        className="pointer-events-none absolute -bottom-40 -right-20 h-[520px] w-[720px] rounded-full opacity-60 blur-[90px]"
        style={{ background: "radial-gradient(closest-side, #c2263a, transparent)" }}
      />
      <div className="v2-frame relative">
        <div className="flex flex-col items-center gap-6 border-x border-[var(--v2-band-line)] px-6 py-24 text-center md:py-32">
          <span className="font-mono text-[11px] uppercase tracking-[0.14em] text-white/55" data-reveal>
            {t("label")}
          </span>
          <h2 className="max-w-[820px] text-[40px] font-medium leading-[1.02] tracking-[-0.03em] md:text-[68px]" data-reveal>
            {t("title_part1")}
            <em className="font-display italic font-semibold text-[#e0364c]">{t("title_emphasis")}</em>
            {t("title_part2")}
          </h2>
          <p className="max-w-[480px] text-[16px] leading-[1.55] text-white/65" data-reveal>
            {t("sub")}
          </p>
          <Link href="/intro" className="v2-btn v2-btn--primary mt-2" onClick={() => sonarClic("select")} data-reveal>
            {t("cta")}
          </Link>
        </div>
      </div>
      <div className="relative border-t border-[var(--v2-band-line)]">
        <div className="v2-frame">
          <div className="flex items-center justify-between border-x border-[var(--v2-band-line)] px-6 py-3 font-mono text-[11px] uppercase tracking-[0.14em] text-white/55 md:px-10">
            <span>
              Huesca · <span suppressHydrationWarning>{hora || "--:--"}</span>
            </span>
            <span>{t("footnote", { q: bookingQuarter() })}</span>
          </div>
        </div>
      </div>
    </section>
  );
}
