"use client";

import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";

/** Slug estable a partir del texto del encabezado. */
function slugify(s: string): string {
  return s
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

/**
 * Índice del artículo. Lee los <h2> ya renderizados por RichText, les asigna un
 * id (para poder enlazarlos) y marca el activo al hacer scroll. Sin tocar el
 * renderer de Lexical: robusto y desacoplado.
 */
export function PostTOC() {
  const t = useTranslations("blog");
  const [items, setItems] = useState<{ id: string; text: string }[]>([]);
  const [active, setActive] = useState("");

  useEffect(() => {
    const headings = Array.from(
      document.querySelectorAll<HTMLElement>(".prose-bellostas h2"),
    );
    const list = headings
      .map((h) => {
        const text = (h.textContent || "").trim();
        const id = h.id || slugify(text);
        if (!h.id) h.id = id;
        h.style.scrollMarginTop = "120px";
        return { id, text };
      })
      .filter((x) => x.text && x.id);
    setItems(list);

    const obs = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) setActive((e.target as HTMLElement).id);
        });
      },
      { rootMargin: "-90px 0px -72% 0px" },
    );
    headings.forEach((h) => obs.observe(h));
    return () => obs.disconnect();
  }, []);

  const go = (e: React.MouseEvent, id: string) => {
    e.preventDefault();
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "start" });
      history.replaceState(null, "", `#${id}`);
    }
  };

  if (items.length < 2) return null;

  return (
    <nav className="flex flex-col gap-3">
      <span
        className="font-body uppercase text-[10px] text-[var(--color-text-muted)]"
        style={{ letterSpacing: "0.18em" }}
      >
        {t("tocLabel")}
      </span>
      <ul className="flex flex-col gap-1 border-l border-[var(--color-border)]">
        {items.map((it) => (
          <li key={it.id}>
            <a
              href={`#${it.id}`}
              onClick={(e) => go(e, it.id)}
              className={`block -ml-px border-l-2 pl-4 py-1 font-body text-[13px] leading-[1.4] transition-colors ${
                active === it.id
                  ? "border-[var(--color-accent)] text-[var(--color-text)]"
                  : "border-transparent text-[var(--color-text-muted)] hover:text-[var(--color-text)]"
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
