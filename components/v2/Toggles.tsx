"use client";

import { useEffect, useState, useTransition } from "react";
import { useParams } from "next/navigation";
import { Moon, Sun, Volume2, VolumeX } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import { usePathname, useRouter } from "@/navigation";
import { locales } from "@/i18n";
import { alCambiarSonido, activarSonido, sonarClic, sonarTema, sonidoActivo } from "@/lib/v2/ui-sound";

const base =
  "inline-flex h-9 w-9 items-center justify-center rounded-md text-[var(--v2-muted)] transition-colors hover:bg-[var(--v2-hover)] hover:text-[var(--v2-text)]";

/** Claro u oscuro. Se guarda en localStorage («bs-theme»). */
export function ThemeToggle() {
  const t = useTranslations("v2");
  const [oscuro, setOscuro] = useState(false);

  // Hay un botón en la cabecera y otro en el menú del móvil: los dos se enteran.
  useEffect(() => {
    const leer = () => setOscuro(document.getElementById("v2-root")?.getAttribute("data-theme") === "dark");
    leer();
    window.addEventListener("bs-theme-change", leer);
    return () => window.removeEventListener("bs-theme-change", leer);
  }, []);

  const cambiar = () => {
    const raiz = document.getElementById("v2-root");
    if (!raiz) return;
    const nuevo = !oscuro;
    raiz.setAttribute("data-theme", nuevo ? "dark" : "light");
    try {
      localStorage.setItem("bs-theme", nuevo ? "dark" : "light");
    } catch {
      /* sin almacenamiento */
    }
    setOscuro(nuevo);
    window.dispatchEvent(new Event("bs-theme-change"));
    sonarTema(nuevo);
  };

  return (
    <button type="button" onClick={cambiar} className={base} aria-label={oscuro ? t("themeLight") : t("themeDark")} title={oscuro ? t("themeLight") : t("themeDark")}>
      {oscuro ? <Sun size={16} strokeWidth={1.75} /> : <Moon size={16} strokeWidth={1.75} />}
    </button>
  );
}

/** Sonido de la interfaz, activado de serie. */
export function SoundToggle() {
  const t = useTranslations("v2");
  const [activo, setActivo] = useState(true);

  useEffect(() => {
    setActivo(sonidoActivo());
    return alCambiarSonido(setActivo);
  }, []);

  const cambiar = () => {
    const nuevo = !activo;
    activarSonido(nuevo);
    if (nuevo) sonarClic("select");
  };

  return (
    <button
      type="button"
      onClick={cambiar}
      className={base}
      aria-pressed={activo}
      aria-label={activo ? t("soundOff") : t("soundOn")}
      title={activo ? t("soundOff") : t("soundOn")}
    >
      {activo ? <Volume2 size={16} strokeWidth={1.75} /> : <VolumeX size={16} strokeWidth={1.75} />}
    </button>
  );
}

/**
 * ES · EN, en un interruptor: una píldora de fondo que se desliza a la opción
 * elegida. Cambia de idioma manteniendo la página (next-intl traduce la
 * dirección: /trabajos/fada ↔ /en/work/fada). `grande`: el del menú del
 * móvil, con más superficie para el dedo.
 */
export function IdiomaToggle({ grande = false, alCambiar }: { grande?: boolean; alCambiar?: () => void }) {
  const t = useTranslations("v2");
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();
  const params = useParams();
  const [, startTransition] = useTransition();
  // La píldora se mueve al pulsar, sin esperar a que cargue la página en el otro idioma.
  const [elegido, setElegido] = useState(locale);
  useEffect(() => setElegido(locale), [locale]);

  const ir = (destino: (typeof locales)[number]) => {
    if (destino === locale) return;
    sonarClic("select");
    setElegido(destino);
    alCambiar?.();
    startTransition(() => {
      // @ts-expect-error -- params es un Record suelto; next-intl lo acepta.
      router.replace({ pathname, params }, { locale: destino });
    });
  };

  const indice = Math.max(0, locales.indexOf(elegido as (typeof locales)[number]));

  return (
    <div
      role="group"
      aria-label={t("idioma")}
      className="v2-idioma relative grid rounded-full border border-[var(--v2-line)] bg-[var(--v2-hover)] p-[3px]"
      style={{ gridTemplateColumns: `repeat(${locales.length}, minmax(0, 1fr))` }}
    >
      <span
        aria-hidden
        className="v2-idioma-pildora absolute bottom-[3px] left-[3px] top-[3px] rounded-full bg-[var(--v2-bg)]"
        style={{
          width: `calc((100% - 6px) / ${locales.length})`,
          transform: `translateX(${indice * 100}%)`,
        }}
      />
      {locales.map((l) => {
        const on = l === elegido;
        return (
          <button
            key={l}
            type="button"
            onClick={() => ir(l)}
            aria-current={l === locale ? "true" : undefined}
            lang={l}
            title={t(`idioma_${l}`)}
            className={`relative z-[1] inline-flex items-center justify-center rounded-full font-mono uppercase tracking-[0.06em] transition-colors duration-300 ${
              grande ? "h-9 min-w-[52px] px-4 text-[13px]" : "h-[26px] min-w-[34px] px-2 text-[11px]"
            } ${on ? "text-[var(--v2-text)]" : "text-[var(--v2-muted)] hover:text-[var(--v2-text)]"}`}
          >
            {l}
          </button>
        );
      })}
    </div>
  );
}
