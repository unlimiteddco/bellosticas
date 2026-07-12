/**
 * Conversor de un subconjunto de Markdown → Lexical (SerializedEditorState),
 * la forma que espera el campo `content` de la colección `posts` de Payload.
 *
 * Subconjunto soportado (el mismo que se le pide a la IA en el CRM):
 *   - Encabezados `## ` (H2) y `### ` (H3)
 *   - Párrafos
 *   - Listas con `- ` / `* `
 *   - Negrita `**texto**`
 *   - Enlaces `[texto](url)`
 *
 * Cualquier otra sintaxis se trata como texto plano. La forma de los nodos
 * está calcada del helper `lexical()` de lib/posts.ts (que ya renderiza bien).
 */

type LexNode = Record<string, unknown>;

const textNode = (text: string, format = 0): LexNode => ({
  type: "text",
  text,
  format,
  style: "",
  mode: "normal",
  detail: 0,
  version: 1,
});

const el = (type: string, children: unknown[], extra: Record<string, unknown> = {}): LexNode => ({
  type,
  format: "",
  indent: 0,
  version: 1,
  direction: "ltr",
  children,
  ...extra,
});

const linkNode = (children: unknown[], url: string): LexNode =>
  el("link", children, {
    version: 3,
    fields: { linkType: "custom", url, newTab: true },
  });

/** Parte una línea en nodos inline: texto, **negrita** y [enlaces](url). */
function parseInline(text: string): LexNode[] {
  const nodes: LexNode[] = [];
  // Alterna negrita y enlaces; el resto es texto normal.
  const regex = /\*\*(.+?)\*\*|\[([^\]]+)\]\(([^)]+)\)/g;
  let last = 0;
  let m: RegExpExecArray | null;
  while ((m = regex.exec(text)) !== null) {
    if (m.index > last) nodes.push(textNode(text.slice(last, m.index)));
    if (m[1] !== undefined) {
      nodes.push(textNode(m[1], 1)); // format 1 = negrita
    } else if (m[2] !== undefined && m[3] !== undefined) {
      nodes.push(linkNode([textNode(m[2])], m[3]));
    }
    last = regex.lastIndex;
  }
  if (last < text.length) nodes.push(textNode(text.slice(last)));
  return nodes.length ? nodes : [textNode(text)];
}

export function markdownToLexical(md: string): { root: LexNode } {
  const lines = (md || "").replace(/\r\n/g, "\n").split("\n");
  const blocks: LexNode[] = [];
  let para: string[] = [];
  let list: string[] = [];

  const flushPara = () => {
    if (para.length) {
      blocks.push(el("paragraph", parseInline(para.join(" ").trim()), { textFormat: 0 }));
      para = [];
    }
  };
  const flushList = () => {
    if (list.length) {
      const items = list.map((li, i) => el("listitem", parseInline(li), { value: i + 1 }));
      blocks.push(el("list", items, { listType: "bullet", tag: "ul", start: 1 }));
      list = [];
    }
  };

  for (const raw of lines) {
    const line = raw.trimEnd();
    if (!line.trim()) {
      flushPara();
      flushList();
      continue;
    }
    if (line.startsWith("### ")) {
      flushPara();
      flushList();
      blocks.push(el("heading", parseInline(line.slice(4)), { tag: "h3" }));
    } else if (line.startsWith("## ")) {
      flushPara();
      flushList();
      blocks.push(el("heading", parseInline(line.slice(3)), { tag: "h2" }));
    } else if (line.startsWith("# ")) {
      // Un H1 en el cuerpo se degrada a H2 (el H1 real es el título del post).
      flushPara();
      flushList();
      blocks.push(el("heading", parseInline(line.slice(2)), { tag: "h2" }));
    } else if (/^[-*]\s+/.test(line)) {
      flushPara();
      list.push(line.replace(/^[-*]\s+/, ""));
    } else {
      flushList();
      para.push(line.trim());
    }
  }
  flushPara();
  flushList();

  if (blocks.length === 0) blocks.push(el("paragraph", [textNode("")], { textFormat: 0 }));
  return { root: el("root", blocks) };
}
