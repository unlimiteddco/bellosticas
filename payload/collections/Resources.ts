import type { CollectionConfig } from "payload";
import { slugField } from "../fields/slug";

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
      name: "title",
      type: "text",
      label: "Título de la guía",
      required: true,
      admin: {
        description: "El H1 de la landing. Ej: «Las 12 herramientas IA con las que llevo mi estudio».",
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
      label: "Portada",
      required: true,
      admin: {
        description:
          "La primera página de la guía (limpia y legible): es lo que vende en la landing.",
      },
    },
    {
      name: "pdf",
      type: "upload",
      relationTo: "media",
      label: "PDF de la guía",
      required: true,
      admin: {
        description: "El archivo que se envía por email al suscriptor.",
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
          label: "Texto del botón",
          defaultValue: "Quiero la guía",
          admin: { width: "50%" },
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
