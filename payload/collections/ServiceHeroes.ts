import type { CollectionConfig } from "payload";

/**
 * Hero images for each service landing — the two mockups in the right column
 * of every /services/* hero. One entry per service slug. The frontend reads
 * these and falls back to lib/service-pages.ts static paths if empty.
 *
 * Two layouts:
 *   - "stacked": two mockups overlapped at angles (the default look)
 *   - "single":  one transparent PNG composition (e.g. the ecommerce phones)
 */
export const ServiceHeroes: CollectionConfig = {
  slug: "service-heroes",
  labels: { singular: "Hero de servicio", plural: "Heros de servicio" },
  admin: {
    useAsTitle: "service",
    defaultColumns: ["service", "mode"],
    group: "Contenido",
    description:
      "Las dos imágenes de la derecha del hero de cada página de servicio.",
  },
  access: {
    read: () => true,
  },
  fields: [
    {
      name: "service",
      type: "select",
      label: "Servicio",
      required: true,
      unique: true,
      options: [
        { label: "Desarrollo web", value: "desarrollo-web" },
        { label: "E-commerce", value: "ecommerce" },
        { label: "Aplicaciones web", value: "aplicaciones-web" },
        { label: "Automatizaciones", value: "automatizaciones" },
        { label: "Migraciones", value: "migraciones" },
        { label: "White-label", value: "white-label" },
      ],
      admin: {
        description: "Cada servicio solo puede tener una entrada.",
      },
    },
    {
      name: "mode",
      type: "select",
      label: "Disposición",
      required: true,
      defaultValue: "stacked",
      options: [
        { label: "Dos mockups en ángulo (stacked)", value: "stacked" },
        { label: "Una imagen / PNG transparente (single)", value: "single" },
      ],
      admin: {
        description:
          "'stacked' = dos capturas superpuestas. 'single' = una sola imagen (ideal PNG transparente, p.ej. los móviles del ecommerce).",
      },
    },
    {
      name: "image1",
      type: "upload",
      relationTo: "media",
      label: "Imagen 1 (principal)",
      required: true,
      admin: {
        description:
          "STACKED → mockup trasero, ratio 3:4, recomendado 1200×1600px. SINGLE → la composición completa, PNG transparente ~1600×1400px.",
      },
    },
    {
      name: "image2",
      type: "upload",
      relationTo: "media",
      label: "Imagen 2 (solo modo stacked)",
      admin: {
        description:
          "Solo en modo 'stacked'. Mockup delantero, ratio 3:4, recomendado 1200×1600px. En modo 'single' déjalo vacío.",
        condition: (data) => data?.mode === "stacked",
      },
    },
    {
      name: "techBadge",
      type: "text",
      label: "Badge flotante (opcional)",
      admin: {
        description: "Símbolo pequeño que flota sobre el mockup. Ej: $, ⚡, →, { }",
      },
    },
  ],
};
