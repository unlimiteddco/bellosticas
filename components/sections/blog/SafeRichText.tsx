"use client";

import { Component, type ReactNode } from "react";
import { RichText } from "@payloadcms/richtext-lexical/react";
import type { SerializedEditorState } from "@payloadcms/richtext-lexical/lexical";

/**
 * Renderiza el rich-text Lexical de un post SIN poder tumbar la página.
 *
 * Antes, si el contenido llegaba nulo, como string o con un nodo que el
 * renderer no soporta, `<RichText>` lanzaba y la ruta entera daba 500. Aquí:
 *  1. Se valida la forma antes de renderizar.
 *  2. Un error boundary (solo funciona en cliente) captura cualquier throw en
 *     el render —también en SSR— y muestra un fallback en su lugar.
 */

class RichTextBoundary extends Component<
  { fallback: ReactNode; children: ReactNode },
  { failed: boolean }
> {
  state = { failed: false };
  static getDerivedStateFromError() {
    return { failed: true };
  }
  render() {
    return this.state.failed ? this.props.fallback : this.props.children;
  }
}

function isLexical(data: unknown): data is SerializedEditorState {
  return (
    !!data &&
    typeof data === "object" &&
    "root" in data &&
    !!(data as { root?: { children?: unknown } }).root &&
    Array.isArray((data as { root: { children?: unknown } }).root.children)
  );
}

export function SafeRichText({
  data,
  fallback = null,
}: {
  data: unknown;
  fallback?: ReactNode;
}) {
  if (!isLexical(data)) return <>{fallback}</>;
  return (
    <RichTextBoundary fallback={fallback}>
      <RichText data={data} />
    </RichTextBoundary>
  );
}
