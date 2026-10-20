import type { Metadata } from "next";
import { Check } from "lucide-react";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { getProjects } from "@/lib/cms/projects";
import { BookingSection } from "@/components/sections/BookingSection";
import { TestimonialsV2 } from "@/components/v2/home/TestimonialsV2";
import { PaginaServicio } from "@/components/v2/servicio/PaginaServicio";
import { LineaArriba } from "@/components/v2/servicio/Secciones";

/*
 * Reservar llamada, en la V2. A esta página se viene a una sola cosa, así que
 * el calendario sale enseguida: a la derecha, enmarcado; a la izquierda, con
 * quién se habla, lo esencial y qué pasa en la llamada (fijo al bajar). Si se
 * llega desde Precios (?interes=…), lo elegido va escrito en las notas de la
 * reserva. Sin banda de cierre: toda la página es la llamada. Textos en
 * messages → introPage (los de la V1).
 */

const sinBarras = (s: string) => s.replace(/^\/\/\s*/, "");

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "introPage" });
  return { title: `${t("metaTitle")}`, description: t("metaDescription") };
}

export default async function IntroV2({
  params,
  searchParams,
}: {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ interes?: string | string[] }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: "introPage" });
  const proyectos = await getProjects(locale);
  const puntos = t.raw("points") as string[];
  const pasos = t.raw("steps") as { title: string; body: string }[];
  // Lo que miró en Precios («Web corporativa · Avanzada»): va a las notas de la reserva.
  const crudo = (await searchParams).interes;
  const interes = (Array.isArray(crudo) ? crudo[0] : crudo)?.replace(/\s+/g, " ").trim().slice(0, 120);

  return (
    <PaginaServicio locale={locale} proyectos={proyectos}>
      {/* ── Hero corto ── */}
      <section className="v2-frame">
        <div className="flex flex-col items-center gap-6 px-6 pb-14 pt-12 text-center md:px-10 lg:pb-16 lg:pt-16">
          <span className="v2-label v2-hero-in flex items-center gap-2.5">
            <span aria-hidden className="h-1.5 w-1.5 rounded-full bg-[var(--v2-accent)]" />
            {sinBarras(t("label"))}
          </span>
          <h1
            className="v2-hero-in v2-h1"
            style={{ animationDelay: "80ms" }}
          >
            {t("title_part1")}
            <em className="font-display italic font-semibold text-[var(--v2-accent)]">{t("title_emphasis")}</em>
            {t("title_part2")}
          </h1>
          <p className="v2-hero-in max-w-[520px] text-[17px] leading-[1.55] text-[var(--v2-muted)] lg:text-[18px]" style={{ animationDelay: "160ms" }}>
            {t("lead")}
          </p>
        </div>
      </section>

      {/* ── Con quién hablas y el calendario ── */}
      <section className="v2-frame">
        <div className="v2-rail grid grid-cols-1 lg:grid-cols-12">
          <LineaArriba />
          <div className="order-2 border-t border-[var(--v2-line)] lg:order-1 lg:col-span-5 lg:border-r lg:border-t-0">
            <div className="flex flex-col lg:sticky lg:top-[61px]">
              {/* Con quién se habla: una cara y un nombre, no «el equipo». */}
              <div className="flex items-center gap-4 border-b border-[var(--v2-line)] p-6 md:p-10">
                <img
                  src="/images/antonio-bellostas-hero.jpg"
                  alt={t("host.name")}
                  width={56}
                  height={56}
                  className="h-14 w-14 rounded-full object-cover"
                  style={{ objectPosition: "50% 22%" }}
                />
                <span className="flex flex-col gap-0.5">
                  <span className="text-[17px] font-medium">{t("host.name")}</span>
                  <span className="text-[14px] text-[var(--v2-muted)]">{t("host.note")}</span>
                </span>
              </div>
              <ul className="flex flex-col border-b border-[var(--v2-line)] px-6 py-4 md:px-10">
                {puntos.map((p) => (
                  <li key={p} className="flex items-center gap-3 py-2 text-[15px]">
                    <Check size={15} strokeWidth={2} className="shrink-0 text-[var(--v2-accent)]" />
                    {p}
                  </li>
                ))}
              </ul>
              <div className="flex flex-col gap-2 p-6 md:p-10">
                <span className="v2-label">{t("stepsLabel")}</span>
                <ol className="flex flex-col">
                  {pasos.map((p, i) => (
                    <li key={p.title} className="flex gap-4 border-b border-[var(--v2-line)] py-4 last:border-b-0">
                      <span className="font-mono text-[11px] leading-[24px] text-[var(--v2-accent)]">{String(i + 1).padStart(2, "0")}</span>
                      <span className="flex flex-col gap-1">
                        <span className="text-[16px] font-medium">{p.title}</span>
                        <span className="text-[14.5px] leading-[1.55] text-[var(--v2-muted)]">{p.body}</span>
                      </span>
                    </li>
                  ))}
                </ol>
              </div>
            </div>
          </div>

          {/* El calendario: lo primero que se ve en el móvil. */}
          <div className="order-1 p-3 md:p-6 lg:order-2 lg:col-span-7">
            <div className="overflow-hidden rounded-[8px] border border-[var(--v2-line)] bg-[#F4F4F3]">
              <BookingSection hideHeader bare nota={interes ? t("interesNota", { interes }) : undefined} />
            </div>
          </div>
        </div>
      </section>

      <TestimonialsV2 />
    </PaginaServicio>
  );
}
