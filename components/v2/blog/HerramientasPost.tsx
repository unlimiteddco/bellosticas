"use client";

import { useEffect, useState } from "react";
import { Check, Link2 } from "lucide-react";
import { useTranslations } from "next-intl";
import { AI_ASSISTANTS } from "@/components/layout/ai-assistants";
import { sonarClic, sonarHover } from "@/lib/v2/ui-sound";

/*
 * Las piezas interactivas del artículo en la V2: el índice (que se monta con
 * los <h2> del contenido), compartir y «Resúmelo con IA». Mismo funcionamiento
 * que las de la V1 (components/sections/blog), con el estilo de la V2.
 */

function slugify(s: string) {
  return s
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

/** Índice del artículo, con el apartado que estás leyendo marcado en rojo. */
export function IndicePost() {
  const t = useTranslations("v2Blog");
  const [items, setItems] = useState<{ id: string; text: string }[]>([]);
  const [activo, setActivo] = useState("");

  useEffect(() => {
    const titulos = Array.from(document.querySelectorAll<HTMLElement>(".prose-bellostas h2"));
    setItems(
      titulos
        .map((h) => {
          const text = (h.textContent || "").trim();
          if (!h.id) h.id = slugify(text);
          h.style.scrollMarginTop = "110px";
          return { id: h.id, text };
        })
        .filter((x) => x.text && x.id),
    );
    const obs = new IntersectionObserver(
      (entradas) => entradas.forEach((e) => e.isIntersecting && setActivo((e.target as HTMLElement).id)),
      { rootMargin: "-90px 0px -72% 0px" },
    );
    titulos.forEach((h) => obs.observe(h));
    return () => obs.disconnect();
  }, []);

  if (items.length < 2) return null;
  return (
    <nav className="flex flex-col gap-3">
      <span className="v2-label">{t("indice")}</span>
      <ul className="flex flex-col border-l border-[var(--v2-line)]">
        {items.map((it, i) => (
          <li key={it.id}>
            <a
              href={`#${it.id}`}
              onPointerEnter={(e) => e.pointerType === "mouse" && sonarHover(i)}
              onClick={(e) => {
                e.preventDefault();
                sonarClic("select", i);
                document.getElementById(it.id)?.scrollIntoView({ behavior: "smooth", block: "start" });
                history.replaceState(null, "", `#${it.id}`);
              }}
              className={`-ml-px block border-l-2 py-1.5 pl-4 text-[13.5px] leading-[1.4] transition-colors ${
                activo === it.id
                  ? "border-[var(--v2-accent)] text-[var(--v2-text)]"
                  : "border-transparent text-[var(--v2-muted)] hover:text-[var(--v2-text)]"
              }`}
            >
              {it.text}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}

function LinkedIn() {
  return (
    <svg width={14} height={14} viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
    </svg>
  );
}
function X() {
  return (
    <svg width={13} height={13} viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
  );
}
function WhatsApp() {
  return (
    <svg width={14} height={14} viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
    </svg>
  );
}

/** Compartir el artículo: LinkedIn, X, WhatsApp y copiar el enlace. */
export function CompartirPost({ url, titulo }: { url: string; titulo: string }) {
  const t = useTranslations("v2Blog");
  const [copiado, setCopiado] = useState(false);
  const enc = encodeURIComponent(url);
  const encT = encodeURIComponent(titulo);
  const redes = [
    { nombre: "LinkedIn", href: `https://www.linkedin.com/sharing/share-offsite/?url=${enc}`, icono: <LinkedIn /> },
    { nombre: "X", href: `https://twitter.com/intent/tweet?url=${enc}&text=${encT}`, icono: <X /> },
    { nombre: "WhatsApp", href: `https://wa.me/?text=${encT}%20${enc}`, icono: <WhatsApp /> },
  ];
  const caja =
    "inline-flex h-9 w-9 items-center justify-center rounded-[6px] border border-[var(--v2-line)] text-[var(--v2-muted)] transition-colors hover:border-[var(--v2-text)] hover:bg-[var(--v2-text)] hover:text-[var(--v2-bg)]";
  return (
    <div className="flex flex-col gap-3">
      <span className="v2-label">{t("compartir")}</span>
      <div className="flex items-center gap-2">
        {redes.map((r) => (
          <a key={r.nombre} href={r.href} target="_blank" rel="noopener noreferrer" aria-label={`${t("compartir")} · ${r.nombre}`} title={r.nombre} className={caja}>
            {r.icono}
          </a>
        ))}
        <button
          type="button"
          aria-label={t("copiar")}
          title={copiado ? t("copiado") : t("copiar")}
          className={caja}
          onClick={() => {
            navigator.clipboard?.writeText(url).then(() => {
              sonarClic("select");
              setCopiado(true);
              window.setTimeout(() => setCopiado(false), 1800);
            });
          }}
        >
          {copiado ? <Check size={14} className="text-[var(--v2-accent)]" /> : <Link2 size={14} />}
        </button>
      </div>
    </div>
  );
}

/** «Resúmelo con IA»: abre el asistente con el enlace de este artículo. */
export function ResumirPost() {
  const t = useTranslations("v2Blog");
  const tb = useTranslations("blog");
  const abrir = (base: string) => {
    const prompt = tb("aiSummarizePrompt", { url: window.location.href });
    window.open(base + encodeURIComponent(prompt), "_blank", "noopener");
  };
  return (
    <div className="mb-12 flex flex-wrap items-center justify-between gap-3 rounded-[8px] border border-[var(--v2-line)] bg-[var(--v2-bg-2)] px-5 py-3">
      <span className="v2-label">{t("resumir")}</span>
      <div className="flex items-center gap-1">
        {AI_ASSISTANTS.map((ai, i) => (
          <button
            key={ai.name}
            type="button"
            onPointerEnter={(e) => e.pointerType === "mouse" && sonarHover(i)}
            onClick={() => {
              sonarClic("open", i);
              abrir(ai.url);
            }}
            aria-label={`${tb("aiSummarizeAria")} ${ai.name}`}
            title={ai.name}
            className="flex h-9 w-9 items-center justify-center rounded-[6px] text-[var(--v2-muted)] transition-colors hover:bg-[var(--v2-bg)] hover:text-[var(--v2-text)]"
          >
            <svg width={17} height={17} viewBox={ai.viewBox} fill="currentColor" aria-hidden>
              <path d={ai.path} />
            </svg>
          </button>
        ))}
      </div>
    </div>
  );
}
