/**
 * Los sonidos de la interfaz de la V2: un «tic» al pasar por el menú y un
 * clic suave al pulsar, abrir o cerrar.
 *
 * Se generan en el momento con Web Audio (osciladores y un poco de ruido
 * filtrado), sin archivos: no pesan nada y no hay que descargarlos. Reglas:
 *
 * - Activado de serie, pero el navegador no deja sonar nada hasta que el
 *   visitante interactúa; el contexto de audio se crea en esa primera
 *   interacción.
 * - El botón de sonido lo apaga y se recuerda (localStorage «bs-sound»).
 * - Volumen general bajo (−14 dB) y nunca dos sonidos en menos de 40 ms: al
 *   barrer el menú con el ratón suena como un roce, no como una ametralladora.
 * - Cada enlace suena un pelín distinto según su posición, para que recorrer
 *   el menú tenga algo de melodía.
 */

const CLAVE = "bs-sound";
const EVENTO = "bs-sound-change";

let ctx: AudioContext | null = null;
let salida: GainNode | null = null;
let ruido: AudioBuffer | null = null;
let ultimo = 0;

export function sonidoActivo(): boolean {
  try {
    return localStorage.getItem(CLAVE) !== "off";
  } catch {
    return true;
  }
}

export function activarSonido(si: boolean) {
  try {
    localStorage.setItem(CLAVE, si ? "on" : "off");
  } catch {
    /* sin almacenamiento: dura lo que la visita */
  }
  if (si) despertar();
  window.dispatchEvent(new CustomEvent(EVENTO, { detail: si }));
}

export function alCambiarSonido(fn: (si: boolean) => void): () => void {
  const h = (e: Event) => fn((e as CustomEvent<boolean>).detail);
  window.addEventListener(EVENTO, h);
  return () => window.removeEventListener(EVENTO, h);
}

/** Crea (o reanuda) el contexto de audio. Solo funciona dentro de un gesto del usuario. */
function despertar() {
  if (typeof window === "undefined") return;
  if (!ctx) {
    const AC = window.AudioContext ?? (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
    if (!AC) return;
    try {
      ctx = new AC();
    } catch {
      return;
    }
    salida = ctx.createGain();
    salida.gain.value = 10 ** (-14 / 20);
    salida.connect(ctx.destination);
    // 50 ms de ruido blanco, para los clics.
    ruido = ctx.createBuffer(1, Math.ceil(ctx.sampleRate * 0.05), ctx.sampleRate);
    const d = ruido.getChannelData(0);
    for (let i = 0; i < d.length; i++) d[i] = Math.random() * 2 - 1;
  }
  if (ctx.state !== "running") ctx.resume().catch(() => {});
}

// El primer gesto de la visita despierta el audio (si el sonido está activo).
if (typeof window !== "undefined") {
  const primerGesto = () => {
    if (sonidoActivo()) despertar();
  };
  for (const ev of ["pointerdown", "keydown", "touchend"]) {
    window.addEventListener(ev, primerGesto, { capture: true, passive: true });
  }
}

function listo(): AudioContext | null {
  if (!sonidoActivo() || !ctx || !salida || ctx.state !== "running") return null;
  return ctx;
}

/** Variación de tono según la posición: ±6 % y un pelín de azar. */
const variacion = (i: number) => 1 + (((i * 5) % 9) - 4) * 0.015 + (Math.random() - 0.5) * 0.02;

function tono(c: AudioContext, tipo: OscillatorType, de: number, a: number, vol: number, dur: number, ataque = 0.0015, retraso = 0) {
  const t = c.currentTime + 0.002 + retraso;
  const osc = c.createOscillator();
  const g = c.createGain();
  osc.type = tipo;
  osc.frequency.setValueAtTime(de, t);
  osc.frequency.exponentialRampToValueAtTime(a, t + dur);
  g.gain.setValueAtTime(0.0001, t);
  g.gain.exponentialRampToValueAtTime(vol, t + ataque);
  g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
  osc.connect(g).connect(salida!);
  osc.start(t);
  osc.stop(t + dur + 0.02);
}

function clic(c: AudioContext, frecuencia: number, vol: number, dur: number) {
  if (!ruido) return;
  const t = c.currentTime + 0.002;
  const src = c.createBufferSource();
  src.buffer = ruido;
  const filtro = c.createBiquadFilter();
  filtro.type = "bandpass";
  filtro.frequency.value = frecuencia;
  filtro.Q.value = 1.2;
  const g = c.createGain();
  g.gain.setValueAtTime(vol, t);
  g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
  src.connect(filtro).connect(g).connect(salida!);
  src.start(t);
  src.stop(t + dur + 0.01);
}

function aTiempo(): boolean {
  const ahora = performance.now();
  if (ahora - ultimo < 40) return false;
  ultimo = ahora;
  return true;
}

/** Al pasar por un enlace del menú. */
export function sonarHover(i = 0) {
  const c = listo();
  if (!c || !aTiempo()) return;
  const v = variacion(i);
  tono(c, "triangle", 2300 * v, 1650 * v, 0.45, 0.022);
}

/** Al pulsar, abrir un panel o cerrarlo. */
export function sonarClic(tipo: "select" | "open" | "close" = "select", i = 0) {
  const c = listo();
  if (!c) return;
  ultimo = performance.now();
  const v = variacion(i);
  const [de, a] = tipo === "open" ? [620, 410] : tipo === "close" ? [450, 260] : [540, 320];
  tono(c, "sine", de * v, a * v, 0.85, 0.04, 0.002);
  clic(c, 3100 * v, 0.3, 0.012);
}

/** Al cambiar de tema: dos notas, hacia arriba al oscuro y hacia abajo al claro. */
export function sonarTema(oscuro: boolean) {
  const c = listo();
  if (!c) return;
  const [n1, n2] = oscuro ? [520, 780] : [780, 520];
  tono(c, "triangle", n1, n1 * 0.98, 0.35, 0.04, 0.002);
  tono(c, "triangle", n2, n2 * 0.98, 0.35, 0.04, 0.002, 0.055);
}
