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
 * ES · EN. Cambia de idioma manteniendo la página (next-intl traduce la
 * dirección: /v2/trabajos/fada ↔ /en/v2/work/fada). `grande`: el del menú del
 * móvil, con más superficie para el dedo.
 */
export function IdiomaToggle({ grande = false, alCambiar }: { grande?: boolean; alCambiar?: () => void }) {
  const t = useTranslations("v2");
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();
  const params = useParams();
  const [, startTransition] = useTransition();

  const ir = (destino: (typeof locales)[number]) => {
    if (destino === locale) return;
    sonarClic("select");
    alCambiar?.();
    startTransition(() => {
      // @ts-expect-error -- params es un Record suelto; next-intl lo acepta.
      router.replace({ pathname, params }, { locale: destino });
    });
  };

  return (
    <div role="group" aria-label={t("idioma")} className={`inline-flex items-center ${grande ? "gap-1" : ""}`}>
      {locales.map((l) => {
        const on = l === locale;
        return (
          <button
            key={l}
            type="button"
            onClick={() => ir(l)}
            aria-current={on ? "true" : undefined}
            lang={l}
            title={t(`idioma_${l}`)}
            className={`inline-flex items-center justify-center rounded-md font-mono uppercase tracking-[0.06em] transition-colors ${
              grande ? "h-10 px-3 text-[13px]" : "h-9 px-1.5 text-[11.5px]"
            } ${on ? "text-[var(--v2-text)]" : "text-[var(--v2-faint)] hover:bg-[var(--v2-hover)] hover:text-[var(--v2-text)]"} ${
              on && grande ? "bg-[var(--v2-hover)]" : ""
            }`}
          >
            {l}
          </button>
        );
      })}
    </div>
  );
}
