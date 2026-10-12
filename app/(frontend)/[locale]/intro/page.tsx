import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { EditorialLabel } from "@/components/ui/EditorialLabel";
import { Reveal } from "@/components/ui/Reveal";
import { IntroTestimonials } from "@/components/sections/intro/IntroTestimonials";
import { BookingSection } from "@/components/sections/BookingSection";
import { Dato } from "@/components/ui/Dato";
import { Footer } from "@/components/layout/Footer";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "introPage" });
  return {
    title: t("metaTitle"),
    description: t("metaDescription"),
  };
}

export default async function IntroPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: "introPage" });
  const points = t.raw("points") as string[];
  const pasos = t.raw("steps") as { title: string; body: string }[];

  return (
    <>
      {/* Cabecera corta y centrada, y el calendario enseguida: a esta página se
          viene a una sola cosa. Lo demás —con quién se habla y qué pasa en la
          llamada— va debajo, para quien quiera leerlo antes de reservar. */}
      <section className="relative z-10 max-w-[1080px] mx-auto px-6 lg:px-12 pt-[136px] lg:pt-[150px] pb-8 text-center flex flex-col items-center gap-5">
        <Reveal immediate delay={0.05}>
          <EditorialLabel>{t("label")}</EditorialLabel>
        </Reveal>
        <Reveal immediate delay={0.12}>
          <h1 className="tracking-tight leading-[1.03] text-[44px] md:text-[64px] lg:text-[76px]">
            <span className="font-body font-medium text-[var(--color-text)]">{t("title_part1")}</span>
            <span className="font-display italic font-semibold text-[var(--color-accent)]">{t("title_emphasis")}</span>
            <span className="font-body font-medium text-[var(--color-text)]">{t("title_part2")}</span>
          </h1>
        </Reveal>
        <Reveal immediate delay={0.2}>
          <p className="font-body text-[17px] lg:text-[19px] leading-[1.5] text-[var(--color-text)] max-w-[620px]">{t("lead")}</p>
        </Reveal>
      </section>

      <section className="relative z-10 max-w-[1080px] mx-auto px-6 lg:px-12 pb-16 lg:pb-20">
        <BookingSection hideHeader bare />
      </section>

      <section className="relative z-10 max-w-[1080px] mx-auto px-6 lg:px-12 pb-16 lg:pb-24">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-start">
          {/* Con quién se habla: una cara y un nombre, no «el equipo». */}
          <div className="lg:col-span-4 flex flex-col gap-5">
            <div className="flex items-center gap-4">
              <img
                src="/images/antonio-bellostas-hero.jpg"
                alt={t("host.name")}
                className="h-14 w-14 rounded-full object-cover"
                style={{ objectPosition: "50% 22%" }}
              />
              <span className="flex flex-col gap-0.5">
                <span className="font-body text-[16px] font-medium text-[var(--color-text)]">{t("host.name")}</span>
                <span className="font-body text-[14px] text-[var(--color-text-muted)]">{t("host.note")}</span>
              </span>
            </div>
            <ul className="flex flex-col gap-2.5">
              {points.map((p) => (
                <li key={p} className="flex items-center gap-2 font-body text-[14px] text-[var(--color-text)]">
                  <span className="inline-block w-1.5 h-1.5 rounded-full bg-[var(--color-accent)]" aria-hidden />
                  {p}
                </li>
              ))}
            </ul>
          </div>
          <div className="lg:col-span-8">
            <Agenda titulo={t("stepsLabel")} pasos={pasos} />
          </div>
        </div>
      </section>

      {/* Testimonials slider — Javier, Themis, Adela */}
      <section className="relative z-10 max-w-[760px] mx-auto px-6 lg:px-12 pb-20 lg:pb-28">
        <Reveal>
          <IntroTestimonials />
        </Reveal>
      </section>

      <Footer />
    </>
  );
}

/** Los tres momentos de la llamada, numerados. */
function Agenda({ titulo, pasos }: { titulo: string; pasos: { title: string; body: string }[] }) {
  return (
    <div className="flex flex-col gap-3">
      <Dato className="text-[var(--color-text-muted)]">{titulo}</Dato>
      <ol className="flex flex-col border-t border-[var(--color-text)]">
        {pasos.map((p, i) => (
          <li key={p.title} className="flex gap-5 py-4 border-b border-[var(--color-border)]">
            <span className="font-mono text-[12px] text-[var(--color-accent)] pt-[3px]">{String(i + 1).padStart(2, "0")}</span>
            <span className="flex flex-col gap-1">
              <span className="font-body text-[16px] font-medium text-[var(--color-text)]">{p.title}</span>
              <span className="font-body text-[14.5px] leading-[1.55] text-[var(--color-text-muted)]">{p.body}</span>
            </span>
          </li>
        ))}
      </ol>
    </div>
  );
}
