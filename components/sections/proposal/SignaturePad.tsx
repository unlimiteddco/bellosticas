"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { Eraser } from "lucide-react";

/**
 * Panel de firma.
 *
 * Dibuja a resolución del dispositivo para que la rúbrica no salga pixelada en
 * el PDF, y funciona con ratón y con dedo — la mayoría firma desde el móvil.
 */
export function SignaturePad({
  onChange,
  clearLabel,
  hint,
  drawLabel,
  typeLabel,
  typePlaceholder,
  typedName,
}: {
  onChange: (dataUrl: string | null) => void;
  clearLabel: string;
  hint: string;
  drawLabel: string;
  typeLabel: string;
  typePlaceholder: string;
  /** Nombre ya escrito en el formulario: se propone como firma escrita. */
  typedName?: string;
}) {
  const [modo, setModo] = useState<"dibujar" | "escribir">("dibujar");
  const [texto, setTexto] = useState("");
  const ref = useRef<HTMLCanvasElement>(null);
  const dibujando = useRef(false);
  const [hayTrazo, setHayTrazo] = useState(false);

  const preparar = useCallback(() => {
    const c = ref.current;
    if (!c) return;
    const dpr = window.devicePixelRatio || 1;
    const r = c.getBoundingClientRect();
    c.width = Math.round(r.width * dpr);
    c.height = Math.round(r.height * dpr);
    const ctx = c.getContext("2d");
    if (!ctx) return;
    ctx.scale(dpr, dpr);
    ctx.lineWidth = 2;
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
    ctx.strokeStyle = "#1D1D1B";
  }, []);

  useEffect(() => {
    preparar();
    window.addEventListener("resize", preparar);
    return () => window.removeEventListener("resize", preparar);
  }, [preparar]);

  const punto = (e: React.PointerEvent<HTMLCanvasElement>) => {
    const r = e.currentTarget.getBoundingClientRect();
    return { x: e.clientX - r.left, y: e.clientY - r.top };
  };

  const empezar = (e: React.PointerEvent<HTMLCanvasElement>) => {
    e.currentTarget.setPointerCapture(e.pointerId);
    const ctx = ref.current?.getContext("2d");
    if (!ctx) return;
    const p = punto(e);
    ctx.beginPath();
    ctx.moveTo(p.x, p.y);
    dibujando.current = true;
  };

  const mover = (e: React.PointerEvent<HTMLCanvasElement>) => {
    if (!dibujando.current) return;
    const ctx = ref.current?.getContext("2d");
    if (!ctx) return;
    const p = punto(e);
    ctx.lineTo(p.x, p.y);
    ctx.stroke();
    if (!hayTrazo) setHayTrazo(true);
  };

  const soltar = () => {
    if (!dibujando.current) return;
    dibujando.current = false;
    const c = ref.current;
    if (c && hayTrazo) onChange(c.toDataURL("image/png"));
  };

  const borrar = () => {
    const c = ref.current;
    const ctx = c?.getContext("2d");
    if (!c || !ctx) return;
    ctx.clearRect(0, 0, c.width, c.height);
    setHayTrazo(false);
    onChange(null);
  };

  /** La firma escrita se convierte a la misma imagen: un solo camino después. */
  const escribir = useCallback(
    (valor: string) => {
      setTexto(valor);
      const limpio = valor.trim();
      if (!limpio) {
        onChange(null);
        return;
      }
      const c = document.createElement("canvas");
      const dpr = 2;
      c.width = 520 * dpr;
      c.height = 150 * dpr;
      const ctx = c.getContext("2d");
      if (!ctx) return;
      ctx.scale(dpr, dpr);
      ctx.fillStyle = "#1D1D1B";
      ctx.font = "italic 46px 'Crimson Text', Georgia, serif";
      ctx.textBaseline = "middle";
      ctx.fillText(limpio, 10, 75);
      onChange(c.toDataURL("image/png"));
    },
    [onChange],
  );

  const cambiarModo = (m: "dibujar" | "escribir") => {
    setModo(m);
    onChange(null);
    if (m === "dibujar") borrar();
    else setTexto("");
  };

  return (
    <div>
      <div className="flex gap-1 mb-3">
        {([
          ["dibujar", drawLabel],
          ["escribir", typeLabel],
        ] as const).map(([m, label]) => (
          <button
            key={m}
            type="button"
            onClick={() => cambiarModo(m)}
            className={`rounded-full px-4 py-1.5 font-body text-[12px] transition-colors ${
              modo === m
                ? "bg-[var(--color-text)] text-[var(--color-bg)]"
                : "border border-[var(--color-border)] text-[var(--color-text-muted)] hover:text-[var(--color-text)]"
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      {modo === "escribir" ? (
        <div>
          <input
            type="text"
            value={texto}
            onChange={(e) => escribir(e.target.value)}
            placeholder={typedName || typePlaceholder}
            className="w-full h-[70px] px-4 rounded-xl border border-[var(--color-border)] bg-white font-display italic text-[30px] text-[var(--color-text)] focus:border-[var(--color-text)] focus:outline-none"
          />
          <p className="mt-2 font-body text-[12px] text-[var(--color-text-muted)]">
            {typePlaceholder}
          </p>
        </div>
      ) : (
      <>
      <canvas
        ref={ref}
        onPointerDown={empezar}
        onPointerMove={mover}
        onPointerUp={soltar}
        onPointerLeave={soltar}
        // touch-none: sin esto, el dedo hace scroll en vez de dibujar.
        className="w-full h-[170px] rounded-xl border border-[var(--color-border)] bg-white touch-none cursor-crosshair"
      />
      <div className="mt-2 flex items-center justify-between gap-4">
        <span className="font-body text-[12px] text-[var(--color-text-muted)]">{hint}</span>
        {hayTrazo && (
          <button
            type="button"
            onClick={borrar}
            className="inline-flex items-center gap-1.5 font-body text-[12px] text-[var(--color-text-muted)] hover:text-[var(--color-text)] transition-colors"
          >
            <Eraser size={13} /> {clearLabel}
          </button>
        )}
      </div>
      </>
      )}
    </div>
  );
}
