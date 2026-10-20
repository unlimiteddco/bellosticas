import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { ArrowDown, ArrowUpRight, Check, Plus } from "lucide-react";
import { getProjects } from "@/lib/cms/projects";
import { PaginaServicio } from "@/components/v2/servicio/PaginaServicio";
import { Link } from "@/navigation";
import styles from "./precios-c.module.css";

type Pack = { nombre: string; texto: string; precio: string; separado: string; destacado?: boolean; incluye: string[] };
type Service = { nombre: string; texto: string; precio: string; desde?: boolean; sufijo?: string; plazo?: string; incluye: string[] };
type Levels = { nombre: string; texto?: string; plazo: string; columnas: { nombre: string; precio?: string }[]; filas: { nombre: string; valores: string[] }[] };
type Group = { nombre: string; texto: string; items: Service[]; niveles?: Levels[] };

export const metadata: Metadata = {
  title: "Precios · Propuesta C · Bellostas Studio",
  description: "Compara los packs de marca y web y consulta cada servicio. Una propuesta visual alternativa de Bellostas Studio.",
  robots: { index: false, follow: false },
};

function Booking({ interest, children, secondary = false }: { interest?: string; children: React.ReactNode; secondary?: boolean }) {
  return <Link href={interest ? { pathname: "/intro", query: { interes: interest } } : "/intro"} className={`${styles.button} ${secondary ? styles.secondary : ""}`}>{children}<ArrowUpRight size={18} aria-hidden="true" /></Link>;
}
function Includes({ items }: { items: string[] }) {
  return <ul className={styles.includes}>{items.map(item => <li key={item}><Check size={15} aria-hidden="true" /><span>{item}</span></li>)}</ul>;
}

export default async function PreciosC({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: "v2Precios" });
  const quotes = await getTranslations({ locale, namespace: "shortTestimonials.items" });
  const packs = t.raw("packs.items") as Pack[];
  const groups = t.raw("servicios.grupos") as Group[];
  const faq = t.raw("faq.items") as Record<string, { question: string; answer: string }>;
  const proyectos = await getProjects(locale);
  return <PaginaServicio locale={locale} proyectos={proyectos}>
    <div className={styles.page}>
      <a className={styles.skip} href="#packs-c">Ir a los precios</a>
      <section className={`${styles.container} ${styles.hero}`} aria-labelledby="titulo-c">
        <div>
          <p className={styles.eyebrow}><span /> DISEÑO, MARCA Y DESARROLLO · PRECIOS</p>
          <h1 id="titulo-c">Tu próximo paso.<br /><em>Con las cuentas claras.</em></h1>
        </div>
        <div className={styles.heroAside}>
          <p>Una marca que te represente.<br />Una web a la altura de tu negocio.</p>
          <p className={styles.muted}>Elige un punto de partida. Tras una llamada, recibirás un presupuesto cerrado con el alcance y las fechas.</p>
          <a href="#packs-c" className={styles.textLink}>Encuentra tu opción <ArrowDown size={16} aria-hidden="true" /></a>
        </div>
      </section>

      <section id="packs-c" className={`${styles.container} ${styles.offers}`} aria-labelledby="packs-titulo">
        <div className={styles.sectionTop}>
          <div><p className={styles.eyebrow}>01 / MARCA + WEB</p><h2 id="packs-titulo">Todo empieza encajando.</h2></div>
          <a href="#servicios-c" className={styles.textLink}>¿Ya tienes marca? Ver servicios <ArrowDown size={16} aria-hidden="true" /></a>
        </div>
        <div className={styles.packGrid}>
          {packs.map((p, i) => <article key={p.nombre} className={`${styles.pack} ${p.destacado ? styles.featured : ""}`}>
            <div className={styles.cardTop}><span className={styles.eyebrow}>{i === 0 ? "PARA LANZAR UNA IDEA" : "PARA DAR EL SALTO"}</span>{p.destacado && <span className={styles.badge}>Marca + web completa</span>}</div>
            <h3>{p.nombre}</h3>
            <p className={styles.cardDescription}>{i === 0 ? "Tu identidad y una página enfocada en presentar, lanzar o captar." : "Tu identidad y una web corporativa para presentar todo lo que haces."}</p>
            <div className={styles.priceRow}><strong className={styles.price}>{p.precio}</strong><span>por proyecto<br />sin IVA</span></div>
            <p className={styles.saving}>Por separado <s>{p.separado}</s><span>Ahorras 300 €</span></p>
            <Booking interest={p.nombre} secondary={!p.destacado}>{i === 0 ? "Hablemos de tu lanzamiento" : "Hablemos de tu nueva web"}</Booking>
            <Includes items={p.incluye} />
          </article>)}
        </div>
        <div className={styles.assurance}><span><Check size={15} aria-hidden="true" /> Un equipo, de principio a fin</span><span><Check size={15} aria-hidden="true" /> Pago por fases</span><span><Check size={15} aria-hidden="true" /> Todo a tu nombre</span></div>
      </section>

      <section id="servicios-c" className={`${styles.container} ${styles.services}`} aria-labelledby="servicios-titulo">
        <div className={styles.sectionTop}><div><p className={styles.eyebrow}>02 / SERVICIOS POR SEPARADO</p><h2 id="servicios-titulo">Justo lo que necesitas.</h2></div><p className={styles.sectionNote}>¿Tu proyecto ya está en marcha?<br />También podemos trabajar en una parte.</p></div>
        <div className={styles.directory}>
          {groups.map((g, gi) => <div key={g.nombre} className={styles.group}>
            <div className={styles.groupHeader}><span className={styles.eyebrow}>0{gi + 1}</span><h3>{g.nombre}</h3><p>{g.texto}</p></div>
            <div className={styles.serviceList}>
              {g.items.map(s => <details key={s.nombre} className={styles.service}>
                <summary><span className={styles.serviceName}>{s.nombre}<small>{s.texto}</small></span><span className={styles.servicePrice}>{s.desde && <small>desde </small>}{s.precio}{s.sufijo && <small> · {s.sufijo}</small>}</span><Plus className={styles.plus} size={18} aria-hidden="true" /></summary>
                <div className={styles.serviceBody}><Includes items={s.incluye} /><div className={styles.serviceFoot}><span>{s.plazo ? `Plazo orientativo: ${s.plazo}` : "Alcance y calendario acordados en la propuesta."}</span><Link href={{ pathname: "/intro", query: { interes: s.nombre } }} className={styles.textLink}>Hablemos de {s.nombre.toLowerCase()} <ArrowUpRight size={16} aria-hidden="true" /></Link></div></div>
              </details>)}
              {g.niveles?.map(n => <details key={n.nombre} className={styles.service}>
                <summary><span className={styles.serviceName}>{n.nombre}<small>{n.texto}</small></span><span className={styles.servicePrice}><small>desde </small>{n.columnas[0].precio}</span><Plus className={styles.plus} size={18} aria-hidden="true" /></summary>
                <div className={styles.serviceBody}><p className={styles.levelNote}>Plazo orientativo: {n.plazo} · Todos los precios sin IVA</p><div className={styles.levels}>{n.columnas.map((c, ci) => <div key={c.nombre} className={styles.level}><h4>{c.nombre}</h4><strong>{c.precio ?? "A presupuesto"}</strong><Includes items={n.filas.flatMap(f => { const v = f.valores[ci]; return v === "—" ? [] : [v === "✓" ? f.nombre : `${f.nombre}: ${v}`]; })} /><Link href={{ pathname: "/intro", query: { interes: `${n.nombre} · ${c.nombre}` } }} className={styles.textLink}>Consultar {c.nombre.toLowerCase()} <ArrowUpRight size={16} aria-hidden="true" /></Link></div>)}</div></div>
              </details>)}
            </div>
          </div>)}
        </div>
        <div className={styles.agency}><p><strong>¿Trabajas en una agencia?</strong> Nos integramos en tu equipo en marca blanca, con NDA.</p><Link href="/v2/contact" className={styles.textLink}>Hablemos <ArrowUpRight size={16} aria-hidden="true" /></Link></div>
      </section>

      <section className={styles.trust} aria-labelledby="trust-titulo">
        <div className={styles.container}>
          <div className={styles.trustGrid}><div><p className={styles.eyebrow}>03 / SIN LETRA PEQUEÑA</p><h2 id="trust-titulo">Sabes qué pagas.<br /><em>Y con quién cuentas.</em></h2></div><div className={styles.promises}>
            <div><span>01</span><h3>Precio acordado antes de empezar</h3><p>Propuesta en 24 h tras una llamada de 30 minutos. Cualquier ampliación se aprueba contigo.</p></div>
            <div><span>02</span><h3>Hablas con quien lo hace</h3><p>Diseño y desarrollo en el mismo equipo. Revisiones en cada fase y seguimiento en tu portal.</p></div>
            <div><span>03</span><h3>Tu proyecto es tuyo</h3><p>Web, dominio y archivos a tu nombre. Sin permanencia y con un plan de pagos por fases.</p></div>
          </div></div>
          <figure className={styles.quote}><span className={styles.quoteMark} aria-hidden="true">“</span><blockquote>{quotes("t2.quote")}</blockquote><figcaption><span className={styles.person}>{quotes("t2.name")}</span><span>{quotes("t2.role")} · {quotes("t2.company")}</span></figcaption></figure>
        </div>
      </section>

      <section className={`${styles.container} ${styles.faq}`} aria-labelledby="faq-titulo"><div><p className={styles.eyebrow}>04 / ANTES DE HABLAR</p><h2 id="faq-titulo">Las dudas,<br /> <em>despejadas.</em></h2><p className={styles.muted}>Sin sorpresas en la propuesta.<br />Ni después.</p></div><div>{Object.entries(faq).map(([key,f]) => <details key={key} className={styles.question}><summary>{f.question}<Plus className={styles.plus} size={18} aria-hidden="true" /></summary><p>{f.answer}</p></details>)}</div></section>

      <section className={`${styles.container} ${styles.closing}`}><div><p className={styles.eyebrow}>TU PROYECTO EMPIEZA CON UNA CONVERSACIÓN</p><h2>¿Lo vemos <em>juntos?</em></h2><p>Cuéntanos dónde estás y a dónde quieres llegar.</p></div><div><Booking>Agenda una llamada</Booking><p>30 minutos · Sin compromiso</p></div></section>
    </div>
  </PaginaServicio>;
}
