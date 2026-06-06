import type { CollectionConfig } from "payload";

/**
 * Media — all uploaded images (project covers, gallery shots, blog covers,
 * service hero mockups, etc.).
 *
 * Files are stored on local disk under `public/media`, so Next serves them
 * directly at `/media/<filename>` with zero extra routing. In production on
 * Dokploy this directory MUST live on a persistent volume (see the Dokploy
 * guide in INSTRUCTIONS.md) or be swapped for S3/R2 cloud storage.
 *
 * `imageSizes` generates resized variants on upload so the frontend can serve
 * appropriately-sized images instead of the full original.
 */
export const Media: CollectionConfig = {
  slug: "media",
  admin: {
    group: "Sistema",
  },
  access: {
    read: () => true, // public — images are served on the public site
  },
  upload: {
    staticDir: "public/media",
    // Generated on upload. The frontend can request a specific size by name.
    imageSizes: [
      { name: "thumbnail", width: 400, height: undefined, position: "centre" },
      { name: "card", width: 900, height: undefined, position: "centre" },
      { name: "feature", width: 1600, height: undefined, position: "centre" },
      { name: "hero", width: 2400, height: undefined, position: "centre" },
    ],
    // Admin preview thumbnail
    adminThumbnail: "thumbnail",
    // Allow raster images + SVG (logos). SVGs sniff as application/xml, so we
    // list it explicitly. Uploads are admin-only, so this is safe.
    mimeTypes: ["image/*", "image/svg+xml", "application/xml"],
  },
  fields: [
    {
      name: "alt",
      type: "text",
      label: "Texto alternativo (alt)",
      required: true,
      admin: {
        description:
          "Describe la imagen para accesibilidad y SEO. Ej: 'Panel de admin de Gotten Gym'.",
      },
    },
    {
      name: "caption",
      type: "text",
      label: "Pie de foto (opcional)",
    },
  ],
};
