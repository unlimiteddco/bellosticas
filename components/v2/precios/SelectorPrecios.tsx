"use client";

import { useEffect, useRef, useState } from "react";
import {
  ArrowRight,
  ArrowRightLeft,
  Check,
  Clapperboard,
  Clock,
  Handshake,
  LayoutDashboard,
  Layers,
  type LucideIcon,
  Monitor,
  MousePointerClick,
  PenTool,
  Rocket,
  Search,
  ShieldCheck,
  ShoppingBag,
  Sparkles,
  Workflow,
} from "lucide-react";
import { useTranslations } from "next-intl";
import { Link } from "@/navigation";
import { sonarClic, sonarHover } from "@/lib/v2/ui-sound";

/*
 * La versión B de Precios, con la mecánica de la de DesignMe: dos pestañas
 * (proyectos de pago único / suscripciones), eliges a la izquierda y a la
 * derecha sale el precio, cómo funciona y qué incluye. Los datos los monta la
 * página desde v2Precios.
 *
 * - La opción va en la URL (?opcion=web&nivel=avanzada): se puede mandar un
 *   enlace a un cliente con un pack ya abierto.
 * - «Agenda una llamada» lleva lo elegido a /intro, que lo deja escrito en las
 *   notas de la reserva.
 * - Cada elección se manda a Analytics (pricing_option, pricing_level,
 *   pricing_commitment, pricing_cta), solo si el visitante aceptó las cookies.
 * - Los proyectos acaban con un puente a las suscripciones: el cliente de un
 *   proyecto es el mejor candidato a partner (ya conocemos su marca).
 */

/** Pagar varios meses (o el año) de golpe, con su ahorro dicho en euros. */
export type Compromiso = { etiqueta: string; precio: string; sufijo?: string; nota: string };
export type Nivel = { nombre: string; precio?: string; incluye: string[]; compromiso?: Compromiso };
export type Testimonio = { quote: string; name: string; role: string; cara?: string };
export type Opcion = {
  id: string;
  icono: keyof typeof ICONOS;
  nombre: string;
  texto: string;
  precio: string;
  desde?: boolean;
  /** Sin cifra publicada («A consultar»): cambia demasiado de un caso a otro. */
  consultar?: boolean;
  sufijo?: string;
  plazo?: string;
  separado?: string;
  incluye: string[];
  niveles?: Nivel[];
  testimonio?: Testimonio;
  compromiso?: Compromiso;
  /** Las suscripciones traen su propio «Cómo funciona». */
  funciona?: { titulo: string; texto: string }[];
  porQue?: { titulo: string; texto: string };
};
export type GrupoOpciones = { nombre: string; opciones: Opcion[] };

const ICONOS = {
  pen: PenTool,
  layers: Layers,
  video: Clapperboard,
  landing: MousePointerClick,
  monitor: Monitor,
  tienda: ShoppingBag,
  app: LayoutDashboard,
  flujo: Workflow,
  migrar: ArrowRightLeft,
  cohete: Rocket,
  estrella: Sparkles,
  partner: Handshake,
  seo: Search,
  escudo: ShieldCheck,
  reloj: Clock,
} satisfies Record<string, LucideIcon>;

/** El nivel en la URL y en Analytics: su nombre en minúsculas y sin tildes («a-medida»). */
const slug = (s: string) =>
  s
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");

type Pestana = "proyectos" | "suscripciones";

function evento(nombre: string, datos: Record<string, string>) {
  (window as unknown as { gtag?: (...a: unknown[]) => void }).gtag?.("event", nombre, datos);
}

export function SelectorPrecios({
  proyectos,
  suscripciones,
}: {
  proyectos: GrupoOpciones[];
  suscripciones: GrupoOpciones[];
}) {
  const t = useTranslations("v2PreciosB");
  // El pack estrella: el último de los packs (el primer grupo).
  const estrella = proyectos[0].opciones.at(-1)!.id;
  const primeraSuscripcion = suscripciones[0].opciones[0].id;
  const [pestana, setPestana] = useState<Pestana>("proyectos");
  const [elegida, setElegida] = useState<string>(estrella);
  const [nivel, setNivel] = useState(0);
  const [comprometido, setComprometido] = useState(false);
  const panel = useRef<HTMLDivElement>(null);
  const [cta, setCta] = useState<HTMLAnchorElement | null>(null);
  const [barra, setBarra] = useState(false);

  const deProyectos = (id: string) => proyectos.some((g) => g.opciones.some((o) => o.id === id));
  const todas = [...proyectos, ...suscripciones].flatMap((g) => g.opciones);
  const listas = pestana === "proyectos" ? proyectos : suscripciones;
  const op = todas.find((o) => o.id === elegida) ?? listas[0].opciones[0];
  const nv = op.niveles?.[nivel];
  const comp = nv?.compromiso ?? op.compromiso;
  const conComp = comp && comprometido;
  const precio = conComp ? comp.precio : nv ? nv.precio : op.precio;
  const sufijo = conComp ? comp.sufijo : op.sufijo;
  const incluye = nv ? nv.incluye : op.incluye;
  const conDesde = op.desde && !nv;
  const nivelUrl = nv ? slug(nv.nombre) : undefined;
  const interes = [op.nombre, nv?.nombre, conComp ? comp.etiqueta : undefined].filter(Boolean).join(" · ");
  const esProyecto = deProyectos(op.id);

  const nota = op.consultar
    ? t("notaConsultar")
    : comp
      ? comprometido
        ? comp.nota
        : t("sinPermanencia")
      : conDesde
        ? t("notaDesde")
        : t("notaCerrado");

  // Al llegar con ?opcion=…&nivel=…, se abre esa opción (tras montar, para no
  // descuadrar el HTML del servidor).
  useEffect(() => {
    const q = new URLSearchParams(window.location.search);
    const o = todas.find((x) => x.id === q.get("opcion"));
    if (!o) return;
    setPestana(deProyectos(o.id) ? "proyectos" : "suscripciones");
    setElegida(o.id);
    const n = o.niveles?.findIndex((x) => slug(x.nombre) === q.get("nivel")) ?? -1;
    if (n > 0) setNivel(n);
    // ?compromiso=1: con el descuento por compromiso ya puesto (p. ej. desde
    // el plan de seis meses de la página de SEO + AEO).
    if (q.get("compromiso") === "1") setComprometido(true);
    // Solo al montar.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Y la URL sigue a lo elegido, sin añadir pasos al historial.
  const primera = useRef(true);
  useEffect(() => {
    if (primera.current) {
      primera.current = false;
      return;
    }
    const url = new URL(window.location.href);
    url.searchParams.set("opcion", op.id);
    if (nivelUrl) url.searchParams.set("nivel", nivelUrl);
    else url.searchParams.delete("nivel");
    window.history.replaceState(window.history.state, "", url);
  }, [op.id, nivelUrl]);

  // Móvil: cuando el botón del panel ya ha quedado arriba y seguimos en el
  // panel, sale una barra abajo con el precio y la llamada.
  useEffect(() => {
    const el = panel.current;
    if (!cta || !el) return;
    let pasado = false;
    let dentro = false;
    const actualizar = () => setBarra(pasado && dentro);
    const oCta = new IntersectionObserver(([e]) => {
      pasado = !e.isIntersecting && e.boundingClientRect.top < 0;
      actualizar();
    });
    const oPanel = new IntersectionObserver(([e]) => {
      dentro = e.isIntersecting;
      actualizar();
    });
    oCta.observe(cta);
    oPanel.observe(el);
    return () => {
      oCta.disconnect();
      oPanel.disconnect();
    };
  }, [cta]);

  const abrir = (p: Pestana, id: string) => {
    setPestana(p);
    setElegida(id);
    setNivel(0);
    setComprometido(false);
    evento("pricing_option", { option: id, tab: p });
  };

  const cambiarPestana = (p: Pestana) => {
    if (p === pestana) return;
    sonarClic("select", p === "proyectos" ? 0 : 1);
    abrir(p, p === "proyectos" ? estrella : primeraSuscripcion);
  };

  const bajarAlPanel = () => {
    // En el móvil el panel queda debajo de la lista: bajamos hasta él.
    if (window.matchMedia("(max-width: 1023px)").matches) {
      requestAnimationFrame(() => panel.current?.scrollIntoView({ behavior: "smooth", block: "start" }));
    }
  };

  const elegir = (id: string, i: number) => {
    if (id === elegida) return;
    sonarClic("select", i);
    abrir(pestana, id);
    bajarAlPanel();
  };

  const elegirNivel = (ni: number) => {
    if (ni === nivel) return;
    sonarClic("select", ni);
    setNivel(ni);
    evento("pricing_level", { option: op.id, level: op.niveles?.[ni] ? slug(op.niveles[ni].nombre) : String(ni) });
  };

  const elegirCompromiso = (si: boolean) => {
    if (si === comprometido) return;
    sonarClic("select", si ? 1 : 0);
    setComprometido(si);
    evento("pricing_commitment", { option: op.id, value: si ? "commit" : "monthly" });
  };

  const irASuscripciones = () => {
    sonarClic("open");
    abrir("suscripciones", primeraSuscripcion);
    // Arriba del selector, para ver la pestaña cambiada.
    requestAnimationFrame(() => panel.current?.closest("section")?.querySelector("[role=tablist]")?.scrollIntoView({ behavior: "smooth", block: "center" }));
  };

  const alLlamar = () => {
    sonarClic("select");
    evento("pricing_cta", { option: op.id, level: nivelUrl ?? "", commitment: conComp ? "commit" : "" });
  };

  const destinoLlamada = { pathname: "/v2/intro" as const, query: { interes } };

  let indice = 0;

  return (
    <div className="flex flex-col">
      {/* Proyectos o suscripciones */}
      <div className="flex justify-center px-6 pb-12">
        <div
          role="tablist"
          aria-label={t("tabs.aria")}
          className="grid w-full max-w-[460px] grid-cols-2 gap-1 rounded-[8px] border border-[var(--v2-line)] p-1"
        >
          {(["proyectos", "suscripciones"] as const).map((p) => {
            const on = p === pestana;
            return (
              <button
                key={p}
                type="button"
                role="tab"
                aria-selected={on}
                onClick={() => cambiarPestana(p)}
                className={`flex items-center justify-center gap-2 rounded-[6px] px-4 py-2.5 text-[14px] font-medium transition-colors ${
                  on ? "bg-[var(--v2-hover)] text-[var(--v2-text)]" : "text-[var(--v2-muted)] hover:text-[var(--v2-text)]"
                }`}
              >
                {t(`tabs.${p}`)}
                {p === "suscripciones" && (
                  <span className="v2-tag">
                    {t("tabs.nuevo")}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* A partir de aquí, el marco de líneas. */}
      <div className="v2-rail grid grid-cols-1 border-t border-[var(--v2-line)] lg:grid-cols-12">
        {/* Lista de opciones */}
        <div className="border-b border-[var(--v2-line)] p-6 md:p-10 lg:col-span-5 lg:border-b-0 lg:border-r">
          {/* En escritorio la lista se queda a la vista mientras bajas por el panel. */}
          <div className="flex flex-col gap-8 lg:sticky lg:top-[101px]">
            {listas.map((g) => (
              <div key={g.nombre} className="flex flex-col gap-3">
                <span className="v2-label">{g.nombre}</span>
                <ul className="flex flex-col overflow-hidden rounded-[6px] border border-[var(--v2-line)]">
                  {g.opciones.map((o) => {
                    const on = o.id === op.id;
                    const Icono = ICONOS[o.icono];
                    const i = indice++;
                    return (
                      <li key={o.id} className="border-b border-[var(--v2-line)] last:border-b-0">
                        <button
                          type="button"
                          aria-pressed={on}
                          onPointerEnter={(e) => e.pointerType === "mouse" && sonarHover(i)}
                          onClick={() => elegir(o.id, i)}
                          className={`flex w-full items-center gap-3 px-4 py-3.5 text-left transition-colors ${
                            on ? "bg-[var(--v2-text)] text-[var(--v2-bg)]" : "hover:bg-[var(--v2-hover)]"
                          }`}
                        >
                          <Icono size={15} strokeWidth={1.75} className="shrink-0 opacity-80" />
                          <span className="flex flex-1 flex-col items-start gap-1 text-[15px] font-medium">
                            {o.nombre}
                            {o.id === estrella && (
                              <span className={`v2-tag ${on ? "v2-tag--inv" : ""}`}>
                                {t("recomendado")}
                              </span>
                            )}
                          </span>
                          <span className={`whitespace-nowrap text-[13.5px] ${on ? "opacity-75" : "text-[var(--v2-muted)]"}`}>
                            {(o.desde || o.niveles) && `${t("desde")} `}
                            <span className={on ? "" : "text-[var(--v2-text)]"}>{o.precio}</span>
                            {o.sufijo && ` ${o.sufijo}`}
                          </span>
                        </button>
                      </li>
                    );
                  })}
                </ul>
              </div>
            ))}
          </div>
        </div>

        {/* Panel de la opción elegida */}
        <div ref={panel} className="scroll-mt-20 bg-[var(--v2-bg-2)] lg:col-span-7" aria-live="polite">
          <div key={`${op.id}-${nivel}`} className="flex flex-col gap-8 p-6 md:p-10 lg:px-14 lg:pb-14 lg:pt-0">
            {/* Lo de arriba del panel se queda fijo bajo la cabecera; el resto
                sube por debajo. */}
            <div className="flex flex-col gap-7 lg:sticky lg:top-[61px] lg:z-10 lg:-mx-14 lg:border-b lg:border-[var(--v2-line)] lg:bg-[var(--v2-bg-2)] lg:px-14 lg:pb-8 lg:pt-12">
              <div className="v2-hero-in flex flex-col gap-3">
                <h2 className="text-[28px] font-medium tracking-[-0.025em] md:text-[34px]">{op.nombre}</h2>
                <p className="max-w-[520px] text-[16px] leading-[1.6] text-[var(--v2-muted)]">{op.texto}</p>
              </div>

              {op.niveles && (
                <Segmentos
                  opciones={op.niveles.map((n) => n.nombre)}
                  activo={nivel}
                  alElegir={elegirNivel}
                  retraso={40}
                />
              )}

              {comp && (
                <Segmentos
                  opciones={[t("mesAMes"), comp.etiqueta]}
                  activo={comprometido ? 1 : 0}
                  alElegir={(i) => elegirCompromiso(i === 1)}
                  retraso={60}
                />
              )}

              <div className="v2-hero-in flex flex-col gap-2" style={{ animationDelay: "80ms" }}>
                <span className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
                  {conDesde && <span className="text-[15px] text-[var(--v2-muted)]">{t("desde")}</span>}
                  {precio && !op.consultar ? (
                    <span className="whitespace-nowrap font-medium tabular-nums leading-none tracking-[-0.04em] text-[46px] md:text-[58px]">{precio}</span>
                  ) : (
                    <span className="text-[34px] font-medium tracking-[-0.02em] md:text-[40px]">{precio ?? t("aPresupuesto")}</span>
                  )}
                  {precio && !op.consultar && (
                    <span className="text-[14px] text-[var(--v2-muted)]">
                      {sufijo ?? t("porProyecto")} · {t("sinIva")}
                    </span>
                  )}
                </span>
                {op.separado && (
                  <span className="text-[14px] text-[var(--v2-muted)]">
                    {t("separado")} <s className="decoration-[var(--v2-accent)]">{op.separado}</s>
                  </span>
                )}
                <span className="text-[14px] text-[var(--v2-muted)]">{nota}</span>
              </div>

              <Link
                ref={setCta}
                href={destinoLlamada}
                className="v2-hero-in v2-btn v2-btn--primary h-12 w-full"
                style={{ animationDelay: "120ms" }}
                onClick={alLlamar}
              >
                {t("cta")}
              </Link>
            </div>

            {/* Por qué un partner: el argumento, en negro para que se lea. */}
            {op.porQue && (
              <div className="v2-oscuro v2-hero-in flex flex-col gap-2 rounded-[6px] p-5 md:p-6" style={{ animationDelay: "140ms" }}>
                <span className="v2-label">{op.porQue.titulo}</span>
                <p className="text-[16px] leading-[1.55]">{op.porQue.texto}</p>
              </div>
            )}

            {/* Lo que dice un cliente de un trabajo parecido, junto al precio. */}
            {op.testimonio && (
              <figure
                className="v2-hero-in flex flex-col gap-4 rounded-[6px] border border-[var(--v2-line)] bg-[var(--v2-bg)] p-5 md:p-6"
                style={{ animationDelay: "160ms" }}
              >
                <blockquote className="text-[16px] leading-[1.55]">“{op.testimonio.quote}”</blockquote>
                <figcaption className="flex items-center gap-3">
                  {op.testimonio.cara ? (
                    <img src={op.testimonio.cara} alt="" className="h-9 w-9 rounded-full object-cover" loading="lazy" />
                  ) : (
                    <span
                      aria-hidden
                      className="flex h-9 w-9 items-center justify-center rounded-full bg-[var(--v2-hover)] text-[13px] font-medium"
                    >
                      {op.testimonio.name.charAt(0)}
                    </span>
                  )}
                  <span className="flex flex-col">
                    <span className="text-[14px] font-medium">{op.testimonio.name}</span>
                    <span className="text-[13px] text-[var(--v2-muted)]">{op.testimonio.role}</span>
                  </span>
                </figcaption>
              </figure>
            )}

            <Bloque titulo={t("comoFunciona")} retraso={200}>
              {op.funciona ? (
                op.funciona.map((f) => <Fila key={f.titulo} titulo={f.titulo} texto={f.texto} />)
              ) : (
                <>
                  <Fila
                    titulo={op.plazo ? t("plazoTitulo", { plazo: op.plazo }) : t("sinPlazoTitulo")}
                    texto={op.plazo ? t("plazoTexto") : t("sinPlazoTexto")}
                  />
                  <Fila titulo={t("pagoTitulo")} texto={t("pagoTexto")} />
                  <Fila titulo={t("revisionesTitulo")} texto={t("revisionesTexto")} />
                </>
              )}
            </Bloque>

            {incluye.length > 0 && (
              <Bloque titulo={t("queIncluye")} retraso={260}>
                {incluye.map((x) => (
                  <Fila key={x} titulo={x} />
                ))}
              </Bloque>
            )}

            {/* Del proyecto a la cuota: el mismo equipo, que ya conoce tu marca. */}
            {esProyecto && (
              <div
                className="v2-hero-in flex flex-col gap-3 rounded-[6px] border border-dashed border-[var(--v2-line-strong)] p-5 md:flex-row md:items-center md:justify-between md:gap-6 md:p-6"
                style={{ animationDelay: "300ms" }}
              >
                <span className="flex flex-col gap-1">
                  <span className="text-[15px] font-medium">{t("puenteTitulo")}</span>
                  <span className="text-[14px] leading-[1.5] text-[var(--v2-muted)]">{t("puenteTexto")}</span>
                </span>
                <button
                  type="button"
                  onClick={irASuscripciones}
                  className="inline-flex shrink-0 items-center gap-1.5 self-start text-[14px] font-medium hover:text-[var(--v2-accent)] md:self-center"
                >
                  {t("puenteCta")} <ArrowRight size={14} />
                </button>
              </div>
            )}
          </div>
        </div>

        {/* La marca blanca, sin precio: los partners revenden. */}
        <div className="border-t border-[var(--v2-line)] p-6 md:p-10 lg:col-span-12">
          <TarjetaAgencia />
        </div>
      </div>

      {/* Móvil: el precio y la llamada siempre a mano mientras lees el panel. */}
      <div
        aria-hidden={!barra}
        inert={!barra}
        className={`fixed inset-x-0 bottom-0 z-40 border-t border-[var(--v2-line)] bg-[var(--v2-bg)]/95 px-4 pb-[calc(12px+env(safe-area-inset-bottom))] pt-3 backdrop-blur transition-transform duration-300 lg:hidden ${
          barra ? "translate-y-0" : "translate-y-full"
        }`}
      >
        <div className="flex items-center gap-3">
          <span className="flex min-w-0 flex-1 flex-col">
            <span className="truncate text-[13px] text-[var(--v2-muted)]">{interes}</span>
            <span className="text-[17px] font-medium">
              {conDesde && `${t("desde")} `}
              {precio ?? t("aPresupuesto")}
              {precio && !op.consultar && sufijo && ` ${sufijo}`}
            </span>
          </span>
          <Link href={destinoLlamada} className="v2-btn v2-btn--primary h-11 shrink-0" onClick={alLlamar}>
            {t("cta")}
          </Link>
        </div>
      </div>
    </div>
  );
}

/** Un control segmentado (niveles, o mes a mes / con compromiso). */
function Segmentos({
  opciones,
  activo,
  alElegir,
  retraso,
}: {
  opciones: string[];
  activo: number;
  alElegir: (i: number) => void;
  retraso: number;
}) {
  return (
    <div
      className="v2-hero-in grid gap-1 rounded-[8px] border border-[var(--v2-line)] p-1"
      style={{ gridTemplateColumns: `repeat(${opciones.length}, minmax(0, 1fr))`, animationDelay: `${retraso}ms` }}
    >
      {opciones.map((nombre, i) => (
        <button
          key={nombre}
          type="button"
          aria-pressed={i === activo}
          onClick={() => alElegir(i)}
          className={`rounded-[6px] px-3 py-2 text-[13.5px] font-medium transition-colors ${
            i === activo ? "bg-[var(--v2-bg)] text-[var(--v2-text)] shadow-sm" : "text-[var(--v2-muted)] hover:text-[var(--v2-text)]"
          }`}
        >
          {nombre}
        </button>
      ))}
    </div>
  );
}

function TarjetaAgencia() {
  const t = useTranslations("v2PreciosB");
  return (
    <div className="v2-oscuro flex flex-col gap-3 rounded-[6px] p-6 md:flex-row md:items-center md:gap-8 md:p-8">
      <span className="v2-tag self-start md:self-center">
        {t("agencia.etiqueta")}
      </span>
      <span className="flex flex-1 flex-col gap-1">
        <span className="text-[20px] font-medium tracking-[-0.015em]">{t("agencia.titulo")}</span>
        <span className="text-[14.5px] leading-[1.55] text-[var(--v2-muted)]">{t("agencia.texto")}</span>
      </span>
      <Link href="/v2/services/white-label" className="v2-btn v2-btn--ghost mt-1 shrink-0 self-start md:mt-0 md:self-center">
        {t("agencia.cta")} <ArrowRight size={14} />
      </Link>
    </div>
  );
}

function Bloque({ titulo, retraso, children }: { titulo: string; retraso: number; children: React.ReactNode }) {
  return (
    <div className="v2-hero-in flex flex-col" style={{ animationDelay: `${retraso}ms` }}>
      <span className="v2-label border-b border-[var(--v2-line)] pb-3">{titulo}</span>
      <ul>{children}</ul>
    </div>
  );
}

function Fila({ titulo, texto }: { titulo: string; texto?: string }) {
  return (
    <li className="flex items-start gap-3 border-b border-[var(--v2-line)] py-3.5 last:border-b-0">
      <Check size={15} strokeWidth={2} className="mt-[3px] shrink-0 text-[var(--v2-accent)]" />
      <span className="flex flex-col gap-0.5">
        <span className="text-[15px] font-medium">{titulo}</span>
        {texto && <span className="text-[14px] leading-[1.5] text-[var(--v2-muted)]">{texto}</span>}
      </span>
    </li>
  );
}
