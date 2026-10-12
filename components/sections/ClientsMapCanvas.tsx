"use client";

import { useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { Minus, Plus, RotateCcw } from "lucide-react";
import { Link } from "@/navigation";
import { AsteriskIcon } from "@/components/ui/AsteriskIcon";
import { CIUDADES, CLIENTES, ESTUDIO, MAPA, proyectar, siglaDe, type Ciudad, type ClienteMapa } from "@/lib/client-map";

/**
 * El mapa de clientes: la península en puntos, un pin por cliente.
 *
 * Los puntos van en un <canvas> —son miles y se redibujan en cada fotograma— y
 * los pines en HTML encima, para que sean botones de verdad: se enfocan con el
 * teclado, se leen con lector de pantalla y llevan enlaces.
 *
 * Nada se mueve «a saltos»: arrastrar, la rueda y los botones solo cambian el
 * OBJETIVO, y un único bucle acerca la vista a él un poco en cada fotograma.
 * Ese mismo bucle pinta los latidos carmín que mantienen el mapa vivo.
 *
 * Varios clientes en el mismo sitio se juntan en un número. Al acercarse lo
 * bastante se abren en corro alrededor de la ciudad.
 */

export type TextosMapa = {
  estudio: string;
  estudioNota: string;
  pais: string;
  enlaceLocal: string; // «Diseño web en {city}»
  pistaMac: string;
  pistaOtros: string;
  leyenda: string;
  leyendaTactil: string;
  acercar: string;
  alejar: string;
  reiniciar: string;
  grupo: string; // «{n} clientes»
};

type Vista = { k: number; tx: number; ty: number };
type Punto = Ciudad & { id: string; x: number; y: number; clientes: ClienteMapa[] };
type Grupo = { clave: string; x: number; y: number; ciudades: Punto[]; clientes: (ClienteMapa & { lugar: Punto })[] };

const PIN = 38;
/** Por debajo de esta distancia en pantalla, dos ciudades son el mismo grupo.
    Algo más que el diámetro del número (48): si no, dos números se pisan. */
const JUNTAR = 58;
const PASO_ZOOM = 1.6;
/** Separación mínima en pantalla entre dos puntos del mapa, en px. Holgada a
    propósito: el mapa tiene que leerse como puntos sueltos, no como una trama. */
const HUECO = 12;
/** Radio de un punto, como parte de la separación. */
const GORDO = 0.17;
/** Cuánto tarda la vista en alcanzar su objetivo (ms): corto al arrastrar,
    para que el mapa vaya pegado al dedo; largo al soltar o al saltar. */
const TAU = { arrastre: 38, rueda: 95, salto: 150, inercia: 260, entrada: 420 };

type Pulso = { x: number; y: number; t0: number; dur: number; ciudad: boolean };

const PUNTOS: Punto[] = Object.entries(CIUDADES)
  .map(([id, c]) => ({ id, ...(c as Ciudad), ...proyectar(c.lat, c.lng), clientes: CLIENTES.filter((x) => x.ciudad === id) }))
  .filter((p) => p.clientes.length > 0)
  // Las ciudades con más clientes hacen de semilla del grupo.
  .sort((a, b) => b.clientes.length - a.clientes.length);

const limitar = (n: number, min: number, max: number) => Math.min(max, Math.max(min, n));

type Marco = { w: number; h: number; kMin: number; kMax: number };

/** La vista, dentro de sus límites: ni se ve el borde del mapa ni se pasa de zoom. */
function encajarEn(v: Vista, m: Marco): Vista {
  const k = limitar(v.k, m.kMin, m.kMax);
  const mw = MAPA.ancho * k;
  const mh = MAPA.alto * k;
  return {
    k,
    tx: mw <= m.w ? (m.w - mw) / 2 : limitar(v.tx, m.w - mw, 0),
    ty: mh <= m.h ? (m.h - mh) / 2 : limitar(v.ty, m.h - mh, 0),
  };
}

/** Zoom dejando quieto el punto de pantalla (px, py): el que está bajo el cursor. */
function zoomEn(v: Vista, px: number, py: number, k: number, m: Marco): Vista {
  const nk = limitar(k, m.kMin, m.kMax);
  const f = nk / v.k;
  return encajarEn({ k: nk, tx: px - (px - v.tx) * f, ty: py - (py - v.ty) * f }, m);
}
/** Radio del corro para n pines: que quepan sin pisarse. */
const radioCorro = (n: number) => (n <= 1 ? 0 : Math.max(34, (n * (PIN + 6)) / (2 * Math.PI)));

function agrupar(k: number): Grupo[] {
  const grupos: { x: number; y: number; peso: number; ciudades: Punto[] }[] = [];
  for (const p of PUNTOS) {
    const g = grupos.find((g) => Math.hypot(g.x - p.x, g.y - p.y) * k < JUNTAR);
    if (!g) {
      grupos.push({ x: p.x, y: p.y, peso: p.clientes.length, ciudades: [p] });
      continue;
    }
    // El centro del grupo tira hacia donde hay más clientes.
    const peso = g.peso + p.clientes.length;
    g.x = (g.x * g.peso + p.x * p.clientes.length) / peso;
    g.y = (g.y * g.peso + p.y * p.clientes.length) / peso;
    g.peso = peso;
    g.ciudades.push(p);
  }
  return grupos.map((g) => ({
    clave: g.ciudades.map((c) => c.id).sort().join("+"),
    x: g.x,
    y: g.y,
    ciudades: g.ciudades,
    clientes: g.ciudades.flatMap((c) => c.clientes.map((cl) => ({ ...cl, lugar: c }))),
  }));
}

/** A qué zoom se puede abrir un grupo en corro sin chocar con los de al lado. */
function zoomParaAbrir(g: Grupo, todos: Grupo[]): number {
  let k = 0;
  for (const o of todos) {
    if (o === g) continue;
    const d = Math.hypot(o.x - g.x, o.y - g.y);
    k = Math.max(k, (radioCorro(g.clientes.length) + radioCorro(o.clientes.length) + PIN + 6) / d);
  }
  return k;
}

export function ClientsMapCanvas({ textos }: { textos: TextosMapa }) {
  const reduce = !!useReducedMotion();
  const caja = useRef<HTMLDivElement>(null);
  const lienzo = useRef<HTMLCanvasElement>(null);
  const [tam, setTam] = useState({ w: 0, h: 0 });
  const [vista, setVista] = useState<Vista>({ k: 1, tx: 0, ty: 0 });
  const [abierto, setAbierto] = useState<string | null>(null);
  const [pista, setPista] = useState(false);
  const [esMac, setEsMac] = useState(true);
  const [tactil, setTactil] = useState(false);
  const [arrastrando, setArrastrando] = useState(false);

  // Lo que el bucle lee en cada fotograma vive en refs: no puede esperar a un
  // render de React ni quedarse con valores viejos.
  const actual = useRef<Vista>({ k: 1, tx: 0, ty: 0 });
  const objetivo = useRef<Vista>({ k: 1, tx: 0, ty: 0 });
  const tau = useRef(TAU.salto);
  const marco = useRef<Marco>({ w: 0, h: 0, kMin: 1, kMax: 12 });
  const sucio = useRef(true);
  const enPantalla = useRef(false);
  const entrado = useRef(false);
  const tocado = useRef(false);
  const pulsos = useRef<Pulso[]>([]);
  const proximo = useRef({ punto: 0, ciudad: 0 });
  const punteros = useRef(new Map<number, { x: number; y: number }>());
  const pellizco = useRef<{ d: number; mx: number; my: number } | null>(null);
  const velocidad = useRef({ x: 0, y: 0, t: 0 });

  useEffect(() => {
    setEsMac(/Mac|iPhone|iPad/i.test(navigator.platform || navigator.userAgent));
    setTactil(window.matchMedia("(pointer: coarse)").matches);
  }, []);

  /* ── Tamaño y límites ─────────────────────────────────────── */

  useLayoutEffect(() => {
    const el = caja.current;
    if (!el) return;
    const medir = () => setTam({ w: el.clientWidth, h: el.clientHeight });
    medir();
    const ro = new ResizeObserver(medir);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  // El mapa nunca se aleja tanto que deje ver el borde, ni se acerca más de lo
  // que hace falta para separar dos pueblos vecinos.
  const kMin = tam.w ? Math.max(tam.w / MAPA.ancho, tam.h / MAPA.alto) : 1;
  const kMax = Math.max(kMin * 4, 12);
  marco.current = { w: tam.w, h: tam.h, kMin, kMax };

  /** La vista de partida: todos los clientes dentro, con aire alrededor. */
  const inicial = useMemo<Vista>(() => {
    if (!tam.w) return { k: 1, tx: 0, ty: 0 };
    const m = { w: tam.w, h: tam.h, kMin, kMax };
    const xs = PUNTOS.map((p) => p.x);
    const ys = PUNTOS.map((p) => p.y);
    const [x0, x1, y0, y1] = [Math.min(...xs), Math.max(...xs), Math.min(...ys), Math.max(...ys)];
    const aire = tam.w < 640 ? 56 : 110;
    const k = Math.min((tam.w - aire * 2) / (x1 - x0), (tam.h - aire * 2) / (y1 - y0));
    // Sin pasarse de cerca: si solo se ve interior, es un campo de puntos y no
    // un mapa. A dos veces el mínimo entran la costa cantábrica y la mediterránea.
    const kk = limitar(Math.min(k, kMin * 2), kMin, kMax);
    return encajarEn({ k: kk, tx: tam.w / 2 - ((x0 + x1) / 2) * kk, ty: tam.h / 2 - ((y0 + y1) / 2) * kk }, m);
  }, [tam.w, tam.h, kMin, kMax]);

  // Mientras nadie lo haya movido, el mapa sigue al tamaño de la ventana.
  useLayoutEffect(() => {
    if (!tam.w) return;
    if (tocado.current) {
      objetivo.current = encajarEn(objetivo.current, marco.current);
    } else {
      objetivo.current = inicial;
      actual.current = inicial;
      setVista(inicial);
    }
    sucio.current = true;
  }, [tam.w, tam.h, inicial]);

  /* ── Moverse ──────────────────────────────────────────────── */

  const irA = useCallback((destino: Vista, t = TAU.salto) => {
    tau.current = t;
    objetivo.current = encajarEn(destino, marco.current);
  }, []);

  const centrarEn = (x: number, y: number, k: number): Vista => ({ k, tx: tam.w / 2 - x * k, ty: tam.h / 2 - y * k });

  const boton = (factor: number) => {
    tocado.current = true;
    setAbierto(null);
    const o = objetivo.current;
    irA(zoomEn(o, tam.w / 2, tam.h / 2, o.k * factor, marco.current));
  };

  // La rueda: con ⌘/Ctrl acerca; sin ella la página sigue bajando y se enseña
  // cómo se hace. Si el mapa se quedara el scroll, bajar por la home sería
  // tropezar con él. El pellizco del trackpad llega como rueda con Ctrl.
  useEffect(() => {
    const el = caja.current;
    if (!el) return;
    let reloj: ReturnType<typeof setTimeout>;
    const rueda = (e: WheelEvent) => {
      if (!e.ctrlKey && !e.metaKey) {
        setPista(true);
        clearTimeout(reloj);
        reloj = setTimeout(() => setPista(false), 1400);
        return;
      }
      e.preventDefault();
      // Que no le llegue al scroll suave de la página.
      e.stopPropagation();
      tocado.current = true;
      setPista(false);
      setAbierto(null);
      const r = el.getBoundingClientRect();
      const o = objetivo.current;
      irA(zoomEn(o, e.clientX - r.left, e.clientY - r.top, o.k * Math.exp(-e.deltaY * 0.006), marco.current), TAU.rueda);
    };
    el.addEventListener("wheel", rueda, { passive: false });
    return () => {
      el.removeEventListener("wheel", rueda);
      clearTimeout(reloj);
    };
  }, [irA]);

  const abajo = (e: React.PointerEvent) => {
    if ((e.target as HTMLElement).closest("[data-pin]")) return;
    setAbierto(null);
    punteros.current.set(e.pointerId, { x: e.clientX, y: e.clientY });
    pellizco.current = null;
    velocidad.current = { x: 0, y: 0, t: performance.now() };
    // Lo que venía moviéndose se para donde está: se coge el mapa, no su destino.
    objetivo.current = actual.current;
    (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
    setArrastrando(true);
  };

  const mover = (e: React.PointerEvent) => {
    const antes = punteros.current.get(e.pointerId);
    if (!antes) return;
    punteros.current.set(e.pointerId, { x: e.clientX, y: e.clientY });
    const r = caja.current!.getBoundingClientRect();
    const ps = [...punteros.current.values()];
    const o = objetivo.current;
    tocado.current = true;

    if (ps.length === 1) {
      const dx = e.clientX - antes.x;
      const dy = e.clientY - antes.y;
      // La velocidad se va promediando: al soltar, el mapa sigue un poco.
      const ahora = performance.now();
      const dt = Math.max(1, ahora - velocidad.current.t);
      velocidad.current = { x: velocidad.current.x * 0.6 + (dx / dt) * 0.4, y: velocidad.current.y * 0.6 + (dy / dt) * 0.4, t: ahora };
      irA({ k: o.k, tx: o.tx + dx, ty: o.ty + dy }, TAU.arrastre);
      return;
    }
    // Dos dedos: la distancia entre ellos acerca, su punto medio arrastra.
    const d = Math.hypot(ps[0].x - ps[1].x, ps[0].y - ps[1].y);
    const mx = (ps[0].x + ps[1].x) / 2 - r.left;
    const my = (ps[0].y + ps[1].y) / 2 - r.top;
    const p = pellizco.current;
    pellizco.current = { d, mx, my };
    if (!p) return;
    const z = zoomEn(o, mx, my, o.k * (d / p.d), marco.current);
    irA({ k: z.k, tx: z.tx + (mx - p.mx), ty: z.ty + (my - p.my) }, TAU.arrastre);
  };

  const arriba = (e: React.PointerEvent) => {
    const era = punteros.current.size;
    punteros.current.delete(e.pointerId);
    pellizco.current = null;
    if (punteros.current.size > 0) return;
    setArrastrando(false);
    // Inercia: solo si se soltó en movimiento, no tras pararse un momento.
    const v = velocidad.current;
    if (era === 1 && e.type === "pointerup" && performance.now() - v.t < 80 && Math.hypot(v.x, v.y) > 0.25) {
      const o = objetivo.current;
      irA({ k: o.k, tx: o.tx + v.x * 240, ty: o.ty + v.y * 240 }, TAU.inercia);
    }
  };

  useEffect(() => {
    const tecla = (e: KeyboardEvent) => e.key === "Escape" && setAbierto(null);
    window.addEventListener("keydown", tecla);
    return () => window.removeEventListener("keydown", tecla);
  }, []);

  // Solo late y se mueve mientras se ve: fuera de pantalla no gasta nada. La
  // primera vez que entra, llega desde un poco más lejos.
  useEffect(() => {
    const el = caja.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([x]) => {
        enPantalla.current = x.isIntersecting;
        sucio.current = true;
        if (x.isIntersecting && !entrado.current && marco.current.w && !reduce) {
          entrado.current = true;
          const o = objetivo.current;
          const { w, h } = marco.current;
          actual.current = encajarEn({ k: o.k * 0.86, tx: w / 2 - (w / 2 - o.tx) * 0.86, ty: h / 2 - (h / 2 - o.ty) * 0.86 }, marco.current);
          tau.current = TAU.entrada;
        }
      },
      { threshold: 0.15 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [reduce]);

  /* ── El bucle: acercar la vista a su objetivo y pintar ───── */

  useEffect(() => {
    const c = lienzo.current;
    if (!c) return;
    const ctx = c.getContext("2d");
    if (!ctx) return;
    const estilo = getComputedStyle(c);
    const tinta = estilo.getPropertyValue("--color-text").trim() || "#1D1D1B";
    const carmin = estilo.getPropertyValue("--color-accent").trim() || "#C2263A";
    const paso = MAPA.paso;
    let raf = 0;
    let antes = performance.now();

    const pintar = (t: number) => {
      const { w, h } = marco.current;
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      if (c.width !== Math.round(w * dpr) || c.height !== Math.round(h * dpr)) {
        c.width = Math.round(w * dpr);
        c.height = Math.round(h * dpr);
      }
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.clearRect(0, 0, w, h);
      const { k, tx, ty } = actual.current;

      // De la rejilla fina se pinta uno de cada `salto` puntos, el justo para
      // que queden separados y se lean uno a uno. Al acercarse, los del nivel
      // siguiente van apareciendo poco a poco (`asoma`) hasta ser los nuevos.
      let salto = 1;
      while (paso * k * salto < HUECO) salto *= 2;
      const hueco = paso * k * salto;
      // Los nuevos no asoman hasta el último tramo antes del cambio de nivel:
      // el resto del tiempo se ve una sola rejilla, limpia.
      const asoma = salto > 1 ? limitar((hueco / 2 - HUECO * 0.84) / (HUECO * 0.16), 0, 1) : 0;
      // El radio crece con el hueco y vuelve a encoger mientras asoman los
      // nuevos: así, al cambiar de nivel, no hay salto de tamaño.
      const lleno = GORDO * Math.min(hueco, HUECO * 1.68);
      const r = salto > 1 ? lleno + (GORDO * HUECO - lleno) * asoma : Math.min(GORDO * hueco, 3.8);

      const fino = Math.max(1, salto / 2);
      const f0 = Math.max(0, Math.floor(-ty / k / paso) - 1);
      const f1 = Math.min(MAPA.filas.length - 1, Math.ceil((h - ty) / k / paso) + 1);
      const c0 = Math.max(0, Math.floor(-tx / k / paso) - 1);
      const c1 = Math.ceil((w - tx) / k / paso) + 1;
      const fi = Math.ceil(f0 / fino) * fino;
      const ci = Math.ceil(c0 / fino) * fino;

      ctx.fillStyle = tinta;
      // España más marcada que lo de alrededor: es donde pasa todo.
      for (const [marca, alfa] of [["2", 0.085], ["1", 0.21]] as const) {
        for (const nuevos of [false, true]) {
          if (nuevos && asoma <= 0.01) continue;
          ctx.globalAlpha = nuevos ? alfa * asoma : alfa;
          ctx.beginPath();
          for (let f = fi; f <= f1; f += fino) {
            const fila = MAPA.filas[f];
            const y = (f * paso + paso / 2) * k + ty;
            const hasta = Math.min(fila.length - 1, c1);
            const filaBase = f % salto === 0;
            for (let col = ci; col <= hasta; col += fino) {
              if (fila[col] !== marca) continue;
              if ((filaBase && col % salto === 0) === nuevos) continue;
              const x = (col * paso + paso / 2) * k + tx;
              ctx.moveTo(x + r, y);
              ctx.arc(x, y, r, 0, Math.PI * 2);
            }
          }
          ctx.fill();
        }
      }

      /* Los latidos. De dos clases: un punto cualquiera de España que se
         enciende en carmín y se apaga, y —más de tarde en tarde— una onda que
         sale de una ciudad con clientes. */
      if (!reduce && enPantalla.current) {
        if (t > proximo.current.punto) {
          proximo.current.punto = t + 140 + Math.random() * 260;
          for (let i = 0; i < 14; i++) {
            const f = Math.round((f0 + Math.random() * (f1 - f0)) / salto) * salto;
            const col = Math.round((c0 + Math.random() * (c1 - c0)) / salto) * salto;
            if (MAPA.filas[f]?.[col] !== "1") continue;
            pulsos.current.push({ x: col * paso + paso / 2, y: f * paso + paso / 2, t0: t, dur: 1500 + Math.random() * 1300, ciudad: false });
            break;
          }
        }
        if (t > proximo.current.ciudad) {
          proximo.current.ciudad = t + 1500 + Math.random() * 1600;
          const p = PUNTOS[Math.floor(Math.random() * PUNTOS.length)];
          pulsos.current.push({ x: p.x, y: p.y, t0: t, dur: 2300, ciudad: true });
        }
        pulsos.current = pulsos.current.filter((p) => t - p.t0 < p.dur);
        ctx.fillStyle = carmin;
        ctx.strokeStyle = carmin;
        for (const p of pulsos.current) {
          const a = (t - p.t0) / p.dur;
          const x = p.x * k + tx;
          const y = p.y * k + ty;
          if (p.ciudad) {
            const sale = 1 - Math.pow(1 - a, 3);
            ctx.globalAlpha = 0.5 * (1 - a);
            ctx.lineWidth = 1.5;
            ctx.beginPath();
            ctx.arc(x, y, 5 + 30 * sale, 0, Math.PI * 2);
            ctx.stroke();
            continue;
          }
          const luz = Math.sin(Math.PI * a);
          // El halo, que se abre mientras el punto se apaga.
          ctx.globalAlpha = 0.2 * (1 - a);
          ctx.beginPath();
          ctx.arc(x, y, r * (1.4 + 2.4 * a), 0, Math.PI * 2);
          ctx.fill();
          ctx.globalAlpha = luz;
          ctx.beginPath();
          ctx.arc(x, y, r * (1 + 0.3 * luz), 0, Math.PI * 2);
          ctx.fill();
        }
      }

      // El sitio exacto de cada ciudad, en tinta: el pin puede estar desplazado
      // en un corro, el punto no se mueve.
      ctx.globalAlpha = 1;
      ctx.fillStyle = tinta;
      ctx.beginPath();
      for (const p of PUNTOS) {
        const x = p.x * k + tx;
        const y = p.y * k + ty;
        ctx.moveTo(x + 2.6, y);
        ctx.arc(x, y, 2.6, 0, Math.PI * 2);
      }
      ctx.fill();
    };

    const fotograma = (t: number) => {
      raf = requestAnimationFrame(fotograma);
      const dt = Math.min(64, t - antes);
      antes = t;
      if (!marco.current.w) return;

      const a = actual.current;
      const o = objetivo.current;
      const lejos = Math.abs(o.k - a.k) > a.k * 0.0004 || Math.abs(o.tx - a.tx) > 0.08 || Math.abs(o.ty - a.ty) > 0.08;
      if (lejos) {
        // Una fracción de lo que falta en cada fotograma, igual a 60 que a 120 Hz.
        // Zoom y posición avanzan a la vez y en línea recta: así el punto bajo
        // el cursor no se mueve mientras dura el acercamiento.
        const f = reduce ? 1 : 1 - Math.exp(-dt / tau.current);
        actual.current = { k: a.k + (o.k - a.k) * f, tx: a.tx + (o.tx - a.tx) * f, ty: a.ty + (o.ty - a.ty) * f };
        setVista(actual.current);
      } else if (a !== o) {
        actual.current = o;
        setVista(o);
      }
      if (lejos || sucio.current || (enPantalla.current && !reduce)) {
        sucio.current = false;
        pintar(t);
      }
    };
    raf = requestAnimationFrame(fotograma);
    return () => cancelAnimationFrame(raf);
  }, [reduce]);

  /* ── Los pines ────────────────────────────────────────────── */

  const grupos = useMemo(() => agrupar(vista.k), [vista.k]);

  // Un clic en el número tiene que bastar para ver quién hay. Al acercar, el
  // grupo se parte en otros más pequeños, así que no vale calcular el zoom con
  // los grupos de ahora: se va probando hacia dentro hasta dar con el primer
  // zoom en el que la ciudad principal del grupo ya se abre.
  const abrirGrupo = (g: Grupo) => {
    tocado.current = true;
    const semilla = g.ciudades[0].id;
    let destino = { x: g.x, y: g.y, k: kMax };
    for (let k = objetivo.current.k * 1.2; k <= kMax; k *= 1.1) {
      const gs = agrupar(k);
      const mio = gs.find((x) => x.ciudades.some((c) => c.id === semilla));
      if (!mio) break;
      if (mio.clientes.length === 1 || k >= zoomParaAbrir(mio, gs)) {
        // Un pelín más de lo justo, para no quedarse en el filo de cerrarse.
        destino = { x: mio.x, y: mio.y, k: Math.min(kMax, k * 1.06) };
        break;
      }
    }
    irA(centrarEn(destino.x, destino.y, destino.k), TAU.salto * 1.5);
  };

  const listo = tam.w > 0;

  return (
    <div
      ref={caja}
      onPointerDown={abajo}
      onPointerMove={mover}
      onPointerUp={arriba}
      onPointerCancel={arriba}
      className="relative h-[440px] md:h-[560px] lg:h-[620px] overflow-hidden select-none"
      // `pan-y`: con un dedo en vertical la página sigue bajando; en horizontal
      // y con dos dedos, el gesto es del mapa.
      style={{ touchAction: "pan-y", cursor: arrastrando ? "grabbing" : "grab" }}
    >
      <canvas ref={lienzo} className="absolute inset-0 h-full w-full" aria-hidden />

      {listo &&
        grupos.map((g) => {
          const gx = g.x * vista.k + vista.tx;
          const gy = g.y * vista.k + vista.ty;
          // Fuera de la ventana no se pinta: ni estorba al teclado ni cuesta.
          if (gx < -90 || gx > tam.w + 90 || gy < -90 || gy > tam.h + 90) return null;

          const n = g.clientes.length;
          const conEstudio = g.ciudades.some((c) => c.id === ESTUDIO);
          const enCorro = n > 1 && vista.k >= zoomParaAbrir(g, grupos);
          const suelto = n === 1 && !conEstudio;
          const radio = radioCorro(n);

          return (
            <div
              key={`${g.clave}-${enCorro ? "corro" : "junto"}`}
              className="absolute left-0 top-0"
              style={{ transform: `translate(${gx}px, ${gy}px)`, zIndex: abierto && g.clientes.some((c) => c.nombre === abierto) ? 30 : 10 }}
            >
              {/* Cerrado: cuántos hay. Un clic acerca hasta que se abren. */}
              {!enCorro && !suelto && (
                <motion.button
                  type="button"
                  data-pin
                  onClick={() => abrirGrupo(g)}
                  initial={{ scale: reduce ? 1 : 0.6, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ duration: 0.25, ease: [0.4, 0, 0.2, 1] }}
                  aria-label={textos.grupo.replace("{n}", String(n))}
                  className="absolute flex items-center justify-center gap-1 rounded-full bg-[var(--color-white)] text-[var(--color-text)] font-body font-medium text-[14px] shadow-[0_6px_22px_rgba(29,29,27,0.14)] border border-[var(--color-border)] hover:border-[var(--color-text)] transition-colors cursor-pointer"
                  style={{ height: 48, minWidth: 48, padding: "0 13px", left: 0, top: 0, translate: "-50% -50%" }}
                >
                  {conEstudio && <AsteriskIcon className="h-[13px] w-[13px] text-[var(--color-accent)]" />}
                  {n}
                </motion.button>
              )}

              {/* El estudio, en el centro del corro de Huesca. */}
              {enCorro && conEstudio && (
                <Pin
                  x={0}
                  y={0}
                  abierto={abierto === "__estudio"}
                  abrir={(v) => setAbierto(v ? "__estudio" : null)}
                  arriba={gy < 150}
                  titulo={textos.estudio}
                  sub={`${CIUDADES[ESTUDIO].nombre} · ${textos.estudioNota}`}
                  reduce={reduce}
                  estudio
                />
              )}

              {(enCorro || suelto) &&
                g.clientes.map((c, i) => {
                  // En corro: repartidos alrededor, empezando por arriba.
                  const ang = (i / n) * Math.PI * 2 - Math.PI / 2;
                  const ox = enCorro ? Math.cos(ang) * radio : 0;
                  const oy = enCorro ? Math.sin(ang) * radio : 0;
                  return (
                    <Pin
                      key={c.nombre}
                      x={ox}
                      y={oy}
                      abierto={abierto === c.nombre}
                      abrir={(v) => setAbierto(v ? c.nombre : null)}
                      arriba={gy + oy < 150}
                      titulo={c.nombre}
                      sub={`${c.lugar.nombre} · ${textos.pais}`}
                      sigla={siglaDe(c)}
                      enlace={
                        c.lugar.pagina && c.lugar.capital
                          ? { href: c.lugar.pagina, texto: textos.enlaceLocal.replace("{city}", c.lugar.capital) }
                          : undefined
                      }
                      reduce={reduce}
                    />
                  );
                })}
            </div>
          );
        })}

      {/* Sin ⌘/Ctrl la rueda es de la página: se dice cómo acercar. */}
      <div
        aria-hidden
        className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-md bg-[var(--color-text)] px-4 py-2.5 font-body text-[13.5px] text-[var(--color-bg)] transition-opacity duration-200 whitespace-nowrap z-40"
        style={{ opacity: pista ? 1 : 0 }}
      >
        {esMac ? textos.pistaMac : textos.pistaOtros}
      </div>

      <div data-pin className="absolute bottom-4 right-4 md:bottom-6 md:right-6 z-40 flex items-stretch rounded-md border border-[var(--color-border)] bg-[var(--color-bg)] cursor-default">
        <span
          className="hidden sm:flex items-center px-4 font-body uppercase text-[10.5px] text-[var(--color-text-muted)]"
          style={{ letterSpacing: "0.16em" }}
        >
          {tactil ? textos.leyendaTactil : textos.leyenda.replace("{tecla}", esMac ? "⌘" : "Ctrl")}
        </span>
        {(
          [
            [textos.acercar, () => boton(PASO_ZOOM), Plus],
            [textos.alejar, () => boton(1 / PASO_ZOOM), Minus],
            [
              textos.reiniciar,
              () => {
                tocado.current = false;
                setAbierto(null);
                irA(inicial);
              },
              RotateCcw,
            ],
          ] as const
        ).map(([nombre, accion, Icono]) => (
          <button
            key={nombre}
            type="button"
            onClick={accion}
            aria-label={nombre}
            title={nombre}
            className="flex h-11 w-11 items-center justify-center border-l border-[var(--color-border)] first:border-l-0 sm:first:border-l text-[var(--color-text)] hover:bg-[var(--color-surface-2)] transition-colors cursor-pointer"
          >
            <Icono size={16} strokeWidth={1.75} />
          </button>
        ))}
      </div>
    </div>
  );
}

/* ── Un pin y su ficha ──────────────────────────────────────── */

function Pin({
  x,
  y,
  abierto,
  abrir,
  arriba,
  titulo,
  sub,
  sigla,
  enlace,
  estudio = false,
  reduce,
}: {
  x: number;
  y: number;
  abierto: boolean;
  abrir: (v: boolean) => void;
  /** Tan cerca del borde de arriba que la ficha tiene que salir por debajo. */
  arriba: boolean;
  titulo: string;
  sub: string;
  sigla?: string;
  enlace?: { href: "/diseno-web-huesca" | "/diseno-web-zaragoza" | "/diseno-web-teruel"; texto: string };
  estudio?: boolean;
  reduce: boolean;
}) {
  return (
    <motion.div
      data-pin
      // Salen del centro del grupo hacia su sitio: se ve de dónde viene cada uno.
      initial={reduce ? false : { x: 0, y: 0, opacity: 0, scale: 0.6 }}
      animate={{ x, y, opacity: 1, scale: 1 }}
      transition={{ type: "spring", stiffness: 320, damping: 26 }}
      className="absolute left-0 top-0"
      style={{ zIndex: abierto ? 5 : 1 }}
      // Con ratón basta pasar por encima; con el dedo, tocar.
      onPointerEnter={(e) => e.pointerType === "mouse" && abrir(true)}
      onPointerLeave={(e) => e.pointerType === "mouse" && abrir(false)}
    >
      <button
        type="button"
        onClick={() => abrir(!abierto)}
        onFocus={() => abrir(true)}
        aria-expanded={abierto}
        aria-label={`${titulo}, ${sub}`}
        className={[
          "absolute flex items-center justify-center rounded-full font-body font-medium shadow-[0_6px_20px_rgba(29,29,27,0.13)] transition-colors duration-200 cursor-pointer",
          estudio
            ? "bg-[var(--color-accent)] text-[var(--color-white)]"
            : abierto
              ? "bg-[var(--color-text)] text-[var(--color-bg)] border border-[var(--color-text)]"
              : "bg-[var(--color-white)] text-[var(--color-text)] border border-[var(--color-border)]",
        ].join(" ")}
        style={{ width: PIN, height: PIN, left: -PIN / 2, top: -PIN / 2, fontSize: (sigla?.length ?? 0) > 2 ? 10.5 : 12, letterSpacing: "0.02em" }}
      >
        {estudio ? <AsteriskIcon className="h-[17px] w-[17px]" /> : sigla}
      </button>

      {abierto && (
        <div
          className="absolute left-0"
          // El relleno de arriba o abajo es el puente entre pin y ficha: sin él,
          // al ir con el ratón hacia el enlace la ficha se cerraría por el camino.
          style={arriba ? { top: PIN / 2, paddingTop: 10, translate: "-50% 0" } : { bottom: PIN / 2, paddingBottom: 10, translate: "-50% 0" }}
        >
          <motion.div
            initial={reduce ? false : { opacity: 0, y: arriba ? -4 : 4 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.16 }}
            className="flex flex-col gap-1.5 whitespace-nowrap rounded-md border border-[var(--color-border)] bg-[var(--color-bg)] px-4 py-3 shadow-[0_14px_40px_rgba(29,29,27,0.14)] cursor-default"
          >
            <span className="font-body font-medium text-[15px] leading-tight text-[var(--color-text)]">{titulo}</span>
            <span className="font-body uppercase text-[10.5px] leading-none text-[var(--color-text-muted)]" style={{ letterSpacing: "0.16em" }}>
              {sub}
            </span>
            {enlace && (
              <Link
                href={enlace.href}
                className="mt-1.5 font-body text-[13.5px] text-[var(--color-text)] underline decoration-[var(--color-accent)] underline-offset-4 hover:text-[var(--color-accent)] transition-colors"
              >
                {enlace.texto} →
              </Link>
            )}
          </motion.div>
        </div>
      )}
    </motion.div>
  );
}
