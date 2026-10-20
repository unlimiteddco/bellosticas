import type { Metadata } from "next";
import {
  Bot,
  CalendarCheck,
  EyeOff,
  LayoutDashboard,
  Monitor,
  PenTool,
  Receipt,
  RefreshCw,
  ShoppingBag,
  Check,
  Minus,
} from "lucide-react";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { getProjects } from "@/lib/cms/projects";
import { TestimonialsV2 } from "@/components/v2/home/TestimonialsV2";
import { FaqV2 } from "@/components/v2/home/FaqV2";
import { ClosingBand } from "@/components/v2/home/ClosingBand";
import { PaginaServicio } from "@/components/v2/servicio/PaginaServicio";
import { VideoTestimonioGrande } from "@/components/v2/servicio/VideoTestimonioGrande";
import {
  Cabecera,
  LineaArriba,
  ServicioCifras,
  ServicioFormatos,
  ServicioHero,
  ServicioProceso,
  ServicioRejilla,
} from "@/components/v2/servicio/Secciones";

/*
 * Marca blanca para agencias, en la V2. Sin precios públicos a propósito: los
 * partners revenden y no hay que marcarles el suelo; las tarifas se ven en la
 * llamada, bajo NDA. Tampoco lleva la tira de logos (algunos son agencias que
 * trabajan con nosotros en marca blanca). Mismo slug que la de la V1
 * (/services/white-label). Oculta como el resto de la V2. Textos en
 * messages → v2WhiteLabel.
 */
const NS = "v2WhiteLabel";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: NS });
  return { title: `${t("metaTitle")} · V2`, description: t("metaDescription"), robots: { index: false, follow: false } };
}

export default async function MarcaBlancaV2({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const proyectos = await getProjects(locale);
  const tc = await getTranslations({ locale, namespace: `${NS}.comparativa` });
  const filas = tc.raw("filas") as { k: string; a: string; b: string }[];
  const ta = await getTranslations({ locale, namespace: `${NS}.agencia` });
  const datos = ta.raw("datos") as string[];

  return (
    <PaginaServicio locale={locale} proyectos={proyectos}>
      <ServicioHero locale={locale} ns={NS} />

      {/* ── La prueba: Social11, una agencia de 20 personas, delega en nosotros ── */}
      <section data-header-tone="dark" className="v2-oscuro">
        <div className="v2-frame">
          <div className="v2-rail grid grid-cols-1 gap-8 p-6 md:p-10 lg:grid-cols-12 lg:gap-12 lg:p-14">
            <div className="lg:col-span-7" data-reveal>
              <VideoTestimonioGrande id="javier" nombre={ta("nombre")} cargo={ta("cargo")} empresa={ta("empresa")} etiqueta={ta("cta")} />
            </div>
            <div className="flex flex-col justify-center gap-6 lg:col-span-5">
              <span className="v2-label" data-reveal>
                {ta("label")}
              </span>
              <h2 className="v2-h2" data-reveal>
                {ta("title_part1")}
                <em className="font-display italic font-semibold text-[var(--v2-accent)]">{ta("title_emphasis")}</em>
                {ta("title_part2")}
              </h2>
              <p className="text-[16px] leading-[1.6] text-[var(--v2-muted)]" data-reveal>
                {ta("texto")}
              </p>
              <ul className="flex flex-wrap gap-2" data-reveal>
                {datos.map((d) => (
                  <li key={d} className="rounded-[4px] border border-[var(--v2-line)] px-2.5 py-1 text-[13px] text-[var(--v2-muted)]">
                    {d}
                  </li>
                ))}
              </ul>
              <figure className="flex flex-col gap-4 border-t border-[var(--v2-line)] pt-6" data-reveal>
                <blockquote className="text-[19px] font-medium leading-[1.45] tracking-[-0.01em]">“{ta("quote")}”</blockquote>
                <figcaption className="flex items-center gap-3">
                  <img src="/caras/javier-flores-face.png" alt="" width={44} height={44} className="h-11 w-11 rounded-full object-cover" />
                  <span className="flex flex-col">
                    <span className="text-[15px] font-medium">{ta("nombre")}</span>
                    <span className="text-[13.5px] text-[var(--v2-muted)]">
                      {ta("cargo")} · {ta("empresa")}
                    </span>
                  </span>
                </figcaption>
              </figure>
            </div>
          </div>
        </div>
      </section>

      <ServicioCifras locale={locale} ns={NS} />
      <ServicioRejilla locale={locale} ns={NS} parte="checks" linea iconos={[CalendarCheck, Receipt, EyeOff]} />

      {/* ── Contratar en plantilla o marca blanca: la comparativa ── */}
      <section className="v2-frame">
        <div className="v2-rail">
          <LineaArriba />
          <Cabecera t={tc} />
          <div className="overflow-x-auto border-t border-[var(--v2-line)] [scrollbar-width:none]">
            <table className="w-full min-w-[620px] border-collapse text-left text-[15px]">
              <thead>
                <tr className="border-b border-[var(--v2-line)]">
                  <th className="w-[34%] px-6 py-5 font-normal md:px-10" />
                  <th scope="col" className="px-6 py-5 font-normal md:px-8">
                    <span className="v2-label">{tc("colA")}</span>
                  </th>
                  <th scope="col" className="bg-[var(--v2-hover)] px-6 py-5 font-normal md:px-8">
                    <span className="v2-label !text-[var(--v2-text)]">{tc("colB")}</span>
                  </th>
                </tr>
              </thead>
              <tbody>
                {filas.map((f) => (
                  <tr key={f.k} className="border-b border-[var(--v2-line)] last:border-b-0" data-reveal>
                    <th scope="row" className="px-6 py-4 font-medium md:px-10">
                      {f.k}
                    </th>
                    <td className="px-6 py-4 text-[var(--v2-muted)] md:px-8">
                      <span className="flex items-center gap-2.5">
                        <Minus size={14} className="shrink-0 text-[var(--v2-faint)]" />
                        {f.a}
                      </span>
                    </td>
                    <td className="bg-[var(--v2-hover)] px-6 py-4 font-medium md:px-8">
                      <span className="flex items-center gap-2.5">
                        <Check size={15} strokeWidth={2} className="shrink-0 text-[var(--v2-accent)]" />
                        {f.b}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      <ServicioProceso locale={locale} ns={NS} />
      <ServicioRejilla locale={locale} ns={NS} parte="incluye" iconos={[Monitor, ShoppingBag, LayoutDashboard, RefreshCw, PenTool, Bot]} />
      <ServicioFormatos locale={locale} ns={NS} />
      <TestimonialsV2 />
      <FaqV2 ns={`${NS}.faq`} />
      <ClosingBand />
    </PaginaServicio>
  );
}
