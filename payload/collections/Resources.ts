import type { CollectionConfig } from "payload";
import { slugField } from "../fields/slug";
import { RESOURCE_TYPES } from "../../lib/resource-type";

/**
 * Recursos (lead magnets) — guías/PDFs que se regalan a cambio del email.
 *
 * Cada entrada genera automáticamente una landing de captura en
 * `bellostas.studio/g/<slug>` con el branding del estudio: título, bullets,
 * portada difuminada y formulario de email. El flujo del embudo:
 *
 *   Reel → "comenta <keyword>" → DM con el enlace /g/<slug> → email → el CRM
 *   guarda el suscriptor y envía la guía por correo (Resend).
 *
 * El PDF y la portada se suben aquí (Media). No hay nada que desplegar:
 * crear/editar un recurso publica la landing al momento.
 */
export const Resources: CollectionConfig = {
  slug: "resources",
  labels: {
    singular: "Recurso (lead magnet)",
    plural: "Recursos (lead magnets)",
  },
  admin: {
    useAsTitle: "title",
    defaultColumns: ["title", "slug", "keyword", "active"],
    group: "Contenido",
    description:
      "Cada recurso publica una landing de captura en bellostas.studio/g/<slug>.",
  },
  access: {
    read: () => true, // la landing es pública
  },
  fields: [
    {
      name: "type",
      type: "select",
      label: "Tipo de recurso",
      required: true,
      defaultValue: "guia",
      options: RESOURCE_TYPES.map((t) => ({ value: t.value, label: t.label })),
      admin: {
        description:
          "Decide cómo se nombra en la landing y el email («Quiero la guía» / «Quiero el proceso»…).",
      },
    },
    {
      name: "title",
      type: "text",
      label: "Título",
      required: true,
      admin: {
        description: "El H1 de la landing. Ej: «Cómo trabajo yo con Claude Code, paso a paso».",
      },
    },
    slugField("title"),
    {
      name: "subtitle",
      type: "textarea",
      label: "Subtítulo",
      admin: {
        description: "1-2 frases bajo el título: qué consigue quien la descarga.",
      },
    },
    {
      name: "bullets",
      type: "array",
      label: "Qué hay dentro (bullets)",
      maxRows: 6,
      fields: [{ name: "text", type: "text", required: true }],
      admin: {
        description: "3-5 puntos concretos de lo que incluye la guía.",
      },
    },
    {
      name: "coverImage",
      type: "upload",
      relationTo: "media",
      label: "Portada (opcional)",
      admin: {
        description:
          "Opcional: si la dejas vacía, la landing dibuja una portada de marca con el título. Así puedes cambiar el título sin rehacer la imagen.",
      },
    },
    {
      name: "pdf",
      type: "upload",
      relationTo: "media",
      label: "Archivo (PDF) subido a mano",
      admin: {
        description:
          "Solo si subes el PDF tú. Los recursos creados desde el CRM usan el campo de abajo.",
      },
    },
    {
      name: "pdfUrl",
      type: "text",
      label: "URL del PDF (generado en el CRM)",
      admin: {
        readOnly: true,
        description:
          "Lo rellena el CRM al publicar. El archivo se genera al vuelo, así que refleja siempre el contenido actual.",
      },
    },
    {
      type: "row",
      fields: [
        {
          name: "keyword",
          type: "text",
          label: "Palabra clave del reel",
          admin: {
            width: "50%",
            description: "La palabra que comentan en Instagram (ej: GUIA). Solo referencia interna.",
          },
        },
        {
          name: "ctaLabel",
          type: "text",
          label: "Texto del botón (opcional)",
          admin: {
            width: "50%",
            description: "Si lo dejas vacío: «Quiero la guía / el proceso…» según el tipo.",
          },
        },
      ],
    },
    {
      name: "active",
      type: "checkbox",
      label: "Landing activa",
      defaultValue: true,
      admin: {
        position: "sidebar",
        description: "Desactívala para retirar la landing sin borrar el recurso.",
      },
    },
  ],
};
