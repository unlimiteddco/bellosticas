import type { CollectionConfig } from "payload";
import { slugField } from "../fields/slug";

/**
 * Blog posts. Bilingual (title/excerpt/content/SEO localized). Drafts enabled
 * so you can write and preview before publishing. The frontend reads only
 * published posts on the public /blog.
 */
export const Posts: CollectionConfig = {
  slug: "posts",
  labels: { singular: "Artículo", plural: "Blog" },
  admin: {
    useAsTitle: "title",
    defaultColumns: ["title", "publishedAt", "_status"],
    group: "Contenido",
    description: "Artículos del blog. Guarda como borrador hasta publicar.",
  },
  access: {
    // Public can only read published docs; logged-in admins read everything.
    read: ({ req: { user } }) => {
      if (user) return true;
      return {
        _status: { equals: "published" },
      };
    },
  },
  versions: {
    drafts: {
      autosave: { interval: 800 },
    },
    maxPerDoc: 20,
  },
  defaultSort: "-publishedAt",
  fields: [
    {
      name: "title",
      type: "text",
      label: "Título",
      required: true,
      localized: true,
    },
    slugField("title"),
    {
      name: "excerpt",
      type: "textarea",
      label: "Extracto",
      localized: true,
      admin: {
        description: "1-2 frases. Aparece en el listado del blog y en meta description si no hay SEO.",
      },
    },
    {
      name: "coverImage",
      type: "upload",
      relationTo: "media",
      label: "Imagen de portada",
      admin: {
        description: "Tamaño recomendado: 1600×900px (16:9). JPG/WEBP.",
      },
    },
    {
      name: "content",
      type: "richText",
      label: "Contenido",
      localized: true,
      required: true,
    },
    {
      type: "row",
      fields: [
        {
          name: "author",
          type: "text",
          label: "Autor",
          defaultValue: "Antonio Bellostas",
          admin: { width: "50%" },
        },
        {
          name: "tags",
          type: "text",
          label: "Tags",
          hasMany: true,
          admin: {
            width: "50%",
            description: "Ej: Next.js, SEO, Caso de estudio",
          },
        },
      ],
    },
    {
      name: "publishedAt",
      type: "date",
      label: "Fecha de publicación",
      admin: {
        position: "sidebar",
        date: { pickerAppearance: "dayAndTime" },
      },
      hooks: {
        // Default to "now" when first published and no date set.
        beforeChange: [
          ({ siblingData, value }) => {
            if (siblingData?._status === "published" && !value) {
              return new Date().toISOString();
            }
            return value;
          },
        ],
      },
    },
    {
      name: "seo",
      type: "group",
      label: "SEO",
      admin: { position: "sidebar" },
      fields: [
        {
          name: "metaTitle",
          type: "text",
          label: "Meta título",
          localized: true,
        },
        {
          name: "metaDescription",
          type: "textarea",
          label: "Meta descripción",
          localized: true,
        },
      ],
    },
  ],
};
