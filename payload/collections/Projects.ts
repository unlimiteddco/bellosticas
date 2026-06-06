import type { CollectionConfig } from "payload";
import { slugField } from "../fields/slug";

/**
 * Portfolio case studies. Mirrors (and replaces) the static lib/projects.ts +
 * the work.items.* descriptions in messages JSON. The frontend reads these and
 * falls back to lib/projects.ts if the CMS is empty/unreachable.
 *
 * Bilingual: `category` and `description` are localized (per-locale values).
 * Brand-fixed fields (name, client, stack, color, year) are shared.
 */
export const Projects: CollectionConfig = {
  slug: "projects",
  labels: { singular: "Proyecto", plural: "Proyectos" },
  admin: {
    useAsTitle: "name",
    defaultColumns: ["name", "category", "year", "featured", "order"],
    group: "Contenido",
    description:
      "Casos de éxito del portfolio. El orden y el campo 'featured' controlan cómo aparecen en /work y en la home.",
  },
  access: {
    read: () => true,
  },
  defaultSort: "order",
  fields: [
    {
      type: "row",
      fields: [
        {
          name: "name",
          type: "text",
          label: "Nombre",
          required: true,
          admin: { width: "60%" },
        },
        {
          name: "year",
          type: "number",
          label: "Año",
          required: true,
          admin: { width: "40%" },
        },
      ],
    },
    slugField("name"),
    {
      type: "row",
      fields: [
        {
          name: "client",
          type: "text",
          label: "Cliente",
          required: true,
          admin: { width: "50%" },
        },
        {
          name: "category",
          type: "text",
          label: "Categoría",
          required: true,
          localized: true,
          admin: {
            width: "50%",
            description: "Ej: 'SaaS · Programmatic SEO'",
          },
        },
      ],
    },
    {
      name: "stack",
      type: "text",
      label: "Stack técnico",
      hasMany: true,
      admin: {
        description: "Tecnologías usadas. Enter para añadir cada una.",
      },
    },
    {
      name: "description",
      type: "textarea",
      label: "Descripción",
      localized: true,
      admin: {
        description:
          "2-4 frases. Qué hicimos + tecnología + métrica concreta. Aparece en el modal del proyecto.",
      },
    },
    {
      type: "row",
      fields: [
        {
          name: "liveUrl",
          type: "text",
          label: "URL en vivo",
          admin: {
            width: "60%",
            description: "Opcional. Añade el botón 'Ver en vivo'.",
          },
        },
        {
          name: "color",
          type: "text",
          label: "Color de fondo",
          required: true,
          defaultValue: "#1D1D1B",
          admin: {
            width: "40%",
            description: "Hex. Fondo de la card y header del modal. Ej: #1A2B3F",
          },
        },
      ],
    },
    {
      type: "row",
      fields: [
        {
          name: "logo",
          type: "upload",
          relationTo: "media",
          label: "Logo (SVG blanco)",
          admin: {
            width: "50%",
            description: "SVG blanco sobre transparente. Se muestra en la card y el modal.",
          },
        },
        {
          name: "cover",
          type: "upload",
          relationTo: "media",
          label: "Imagen principal (cover)",
          admin: {
            width: "50%",
            description:
              "Tamaño recomendado: 2000-2400px de ancho, ratio 16:10. JPG/WEBP.",
          },
        },
      ],
    },
    {
      name: "logoScale",
      type: "number",
      label: "Tamaño del logo (%)",
      defaultValue: 100,
      min: 30,
      max: 250,
      admin: {
        description:
          "Ajusta el tamaño del logo en la card y el modal. 100 = normal. Sube a 150-200 si el logo se ve pequeño; baja si se ve demasiado grande.",
      },
    },
    {
      name: "gallery",
      type: "array",
      label: "Galería (2 columnas en el modal)",
      labels: { singular: "Imagen", plural: "Imágenes" },
      admin: {
        description:
          "Opcional. 2-6 capturas. Tamaño recomendado: ~1400-1800px de ancho, ratio 4:3. JPG/WEBP. Con número impar, la última ocupa 2 columnas.",
      },
      fields: [
        {
          name: "image",
          type: "upload",
          relationTo: "media",
          required: true,
        },
      ],
    },
    // Sidebar controls
    {
      name: "featured",
      type: "checkbox",
      label: "Destacado",
      defaultValue: false,
      admin: {
        position: "sidebar",
        description: "El destacado se muestra a ancho completo (21:9) en home y /work.",
      },
    },
    {
      name: "order",
      type: "number",
      label: "Orden",
      defaultValue: 100,
      admin: {
        position: "sidebar",
        description: "Menor número = aparece antes. Los más recientes arriba.",
      },
    },
  ],
};
