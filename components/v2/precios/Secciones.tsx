import { getTranslations } from "next-intl/server";
import { Cabecera, LineaArriba } from "@/components/v2/servicio/Secciones";
import { SelectorPrecios, type GrupoOpciones, type Opcion } from "./SelectorPrecios";

/*
 * Los bloques de la página de Precios de la V2 (el selector al estilo de
 * DesignMe y «Siempre incluido»). Textos y cifras en messages → v2Precios. Precio cerrado en lo que tiene niveles (marca, web, e-commerce);
 * «desde» solo en lo que cambia mucho de un caso a otro (aplicaciones,
 * automatizaciones, migraciones). La marca blanca no lleva precio público:
 * los partners revenden y no les marcamos el suelo.
 */

const NS = "v2Precios";

/* ───────────────────────── Packs ───────────────────────── */

type Pack = { nombre: string; texto: string; precio: string; separado: string; destacado?: boolean; incluye: string[] };

/* ───────────────────────── Servicios ───────────────────────── */

type Servicio = {
  nombre: string;
  precio: string;
  texto: string;
  incluye: string[];
  desde?: boolean;
  consultar?: boolean;
  sufijo?: string;
  plazo?: string;
};
type Niveles = {
  nombre: string;
  texto?: string;
  plazo: string;
  columnas: { nombre: string; precio?: string }[];
  filas: { nombre: string; valores: string[] }[];
};
type Grupo = { nombre: string; texto: string; items: Servicio[]; niveles?: Niveles[] };

/* ───────────────────────── Selector (al estilo de DesignMe) ───────────────────────── */

/** Identificadores fijos (no dependen del idioma): van en la URL (?opcion=web) y en Analytics. */
const IDS_PACKS = ["marca-landing", "marca-web"];
const IDS_GRUPO = [
  ["marca-esencial", "marca-completa", "video"],
  ["landing", "web", "ecommerce"],
  ["app", "automatizaciones", "migraciones"],
];

/*
 * Qué cliente habla junto a cada precio: solo reseñas reales (shortTestimonials)
 * y de un trabajo parecido al de la opción. Sin reseña, no sale nada.
 */
const TESTIMONIO_DE: Record<string, string> = {
  "marca-landing": "t2",
  "marca-web": "t2",
  "marca-esencial": "t1",
  "marca-completa": "t1",
  landing: "t3",
  web: "t3",
  ecommerce: "t6",
  migraciones: "t6",
  app: "t4",
  automatizaciones: "t5",
  // Lo que más valora FADA de seguir con nosotros: la rapidez con los cambios.
  partner: "t3",
  mantenimiento: "t3",
};
const CARA_DE: Record<string, string> = {
  t1: "/caras/javier-flores-face.png",
  t2: "/caras/adela-face.png",
  t3: "/caras/themis-face.png",
  t6: "/caras/cara-teleadhesivo.jpg",
};

const ICONOS_GRUPO: Opcion["icono"][][] = [
  ["pen", "layers", "video"],
  ["landing", "monitor", "tienda"],
  ["app", "flujo", "migrar"],
];

/** Hero corto y, debajo, el selector. Mismas cifras que la versión A (v2Precios). */
export async function PreciosSelector({ locale }: { locale: string }) {
  const t = await getTranslations({ locale, namespace: NS });
  const th = await getTranslations({ locale, namespace: `${NS}.hero` });
  const tb = await getTranslations({ locale, namespace: "v2PreciosB" });

  const packs: GrupoOpciones = {
    nombre: tb("grupoPacks"),
    opciones: (t.raw("packs.items") as Pack[]).map((p, i) => ({
      id: IDS_PACKS[i] ?? `pack-${i}`,
      icono: i === 0 ? "cohete" : "estrella",
      nombre: p.nombre,
      texto: p.texto,
      precio: p.precio,
      separado: p.separado,
      incluye: p.incluye,
    })),
  };

  const grupos: GrupoOpciones[] = (t.raw("servicios.grupos") as Grupo[]).map(
    (g, gi) => {
      const sueltos: Opcion[] = g.items.map((s) => ({ ...s, id: s.nombre, icono: "pen" }));
      // Los que tienen niveles (web corporativa, e-commerce) van detrás de la
      // landing. Aquí, para que sea simple, solo «desde» el primer nivel y lo que
      // incluye; la tabla esencial / avanzada / a medida se queda en la versión A.
      const conNiveles: Opcion[] = (g.niveles ?? []).map((n) => ({
        id: n.nombre,
        icono: "pen",
        nombre: n.nombre,
        texto: n.texto ?? "",
        precio: n.columnas[0].precio ?? "",
        desde: true,
        plazo: n.plazo,
        incluye: n.filas
          .filter((f) => f.valores[0] !== "—")
          .map((f) => (f.valores[0] === "✓" ? f.nombre : `${f.nombre}: ${f.valores[0]}`)),
      }));
      const opciones = [...sueltos, ...conNiveles].map((o, oi) => ({
        ...o,
        id: IDS_GRUPO[gi]?.[oi] ?? o.id,
        icono: ICONOS_GRUPO[gi]?.[oi] ?? "pen",
      }));
      return { nombre: g.nombre, opciones };
    },
  );

  const tt = await getTranslations({ locale, namespace: "shortTestimonials.items" });
  const conTestimonio = (o: Opcion): Opcion => {
    const k = TESTIMONIO_DE[o.id];
    if (!k || !tt.has(`${k}.quote`)) return o;
    return { ...o, testimonio: { quote: tt(`${k}.quote`), name: tt(`${k}.name`), role: `${tt(`${k}.role`)} · ${tt(`${k}.company`)}`, cara: CARA_DE[k] } };
  };
  packs.opciones = packs.opciones.map(conTestimonio);
  for (const g of grupos) g.opciones = g.opciones.map(conTestimonio);

  // Las suscripciones ya vienen con su id e icono en los textos.
  const suscripciones: GrupoOpciones[] = (t.raw("suscripciones.grupos") as { nombre: string; items: Opcion[] }[]).map(
    (g) => ({ nombre: g.nombre, opciones: g.items.map(conTestimonio) }),
  );

  return (
    <section id="precios" className="v2-frame">
      <div className="flex flex-col items-center gap-6 px-6 pb-12 pt-14 text-center md:px-10 lg:pt-20">
        <span className="v2-label v2-hero-in flex items-center gap-2.5">
          <span aria-hidden className="h-1.5 w-1.5 rounded-full bg-[var(--v2-accent)]" />
          {th("label")}
        </span>
        <h1
          className="v2-hero-in v2-h1"
          style={{ animationDelay: "80ms" }}
        >
          <span className="block">{th("line1")}</span>
          <span className="block">
            {th("line2_pre")}
            <em className="font-display italic font-semibold text-[var(--v2-accent)]">{th("line2_em")}</em>
            {th("line2_post")}
          </span>
        </h1>
        <p className="v2-hero-in max-w-[560px] text-[16px] leading-[1.6] text-[var(--v2-muted)]" style={{ animationDelay: "160ms" }}>
          {tb("heroSub")}
        </p>
        {th.has("note") && (
          <span className="v2-label v2-hero-in" style={{ animationDelay: "220ms" }}>
            {th("note")}
          </span>
        )}
      </div>
      <div className="v2-hero-in" style={{ animationDelay: "280ms" }}>
        <SelectorPrecios proyectos={[packs, ...grupos]} suscripciones={suscripciones} />
      </div>
    </section>
  );
}

/** Seis celdas con lo que va siempre, como el «antes de firmar» de DesignMe. */
export async function PreciosSiempre({ locale }: { locale: string }) {
  const t = await getTranslations({ locale, namespace: "v2PreciosB.siempre" });
  const items = t.raw("items") as { title: string; text: string }[];
  return (
    <section className="v2-frame">
      <div className="v2-rail">
        <LineaArriba />
        <Cabecera t={t} />
        <div className="grid grid-cols-1 gap-px border-t border-[var(--v2-line)] bg-[var(--v2-line)] sm:grid-cols-2 lg:grid-cols-3">
          {items.map((it, i) => (
            <div key={it.title} className="flex min-h-[200px] flex-col gap-3 bg-[var(--v2-bg)] p-6 md:p-8" data-reveal>
              <span className="text-[19px] font-medium tracking-[-0.01em]">{it.title}</span>
              <span className="text-[15px] leading-[1.55] text-[var(--v2-muted)]">{it.text}</span>
              <span className="mt-auto pt-4 font-mono text-[11px] text-[var(--v2-faint)]">
                {String(i + 1).padStart(2, "0")} / {String(items.length).padStart(2, "0")}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
