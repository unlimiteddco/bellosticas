/**
 * Las entradas al hacer scroll de la V2, sin librerías.
 *
 * Los elementos con `data-reveal` (aparecen subiendo un poco) o `data-draw`
 * (líneas que se dibujan) reciben la clase `is-in` al entrar en pantalla; el
 * CSS hace el resto (app/v2.css). Los hermanos entran escalonados, 60 ms entre
 * uno y otro, con un máximo de 7 para que una lista larga no tarde.
 *
 * Lo que ya está en pantalla al cargar entra enseguida, sin esperar al
 * observador: así ningún contenido de arriba depende de que llegue un evento
 * de scroll (el fallo de «reseñas invisibles» que tuvimos con whileInView).
 */

const PASO_MS = 60;
const MAX_ESCALONADOS = 7;

function grupo(el: Element): Element {
  return el.parentElement ?? el;
}

function entrar(els: Element[], base = 0) {
  els.forEach((el, i) => {
    (el as HTMLElement).style.setProperty("--rv-d", `${base + Math.min(i, MAX_ESCALONADOS) * PASO_MS}ms`);
    el.classList.add("is-in");
  });
}

export function iniciarEntradas(raiz: HTMLElement): () => void {
  const vistos = new WeakSet<Element>();
  const porGrupo = new Map<Element, Element[]>();

  const io = new IntersectionObserver(
    (entradas) => {
      const listos: Element[] = [];
      for (const e of entradas) {
        if (!e.isIntersecting) continue;
        io.unobserve(e.target);
        listos.push(...(porGrupo.get(e.target) ?? []));
        porGrupo.delete(e.target);
      }
      entrar(listos);
    },
    { rootMargin: "0px 0px -8% 0px", threshold: 0.05 },
  );

  const registrar = () => {
    const nuevos = [...raiz.querySelectorAll("[data-reveal], [data-draw]")].filter((el) => !vistos.has(el));
    if (!nuevos.length) return;
    const alto = window.innerHeight;
    const enPantalla: Element[] = [];
    for (const el of nuevos) {
      vistos.add(el);
      const r = el.getBoundingClientRect();
      if (r.bottom > 0 && r.top < alto) {
        enPantalla.push(el);
        continue;
      }
      const g = grupo(el);
      const lista = porGrupo.get(g);
      if (lista) lista.push(el);
      else {
        porGrupo.set(g, [el]);
        io.observe(g);
      }
    }
    entrar(enPantalla, 120);
  };

  registrar();
  raiz.setAttribute("data-reveal-ready", "");

  // Lo que se monta después (paneles, pestañas) también entra.
  const mo = new MutationObserver(() => registrar());
  mo.observe(raiz, { childList: true, subtree: true });

  return () => {
    io.disconnect();
    mo.disconnect();
  };
}
