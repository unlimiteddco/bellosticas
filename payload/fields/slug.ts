import type { Field } from "payload";

/**
 * Turns any string into a URL-safe slug:
 *   "Mi Cliente S.L." → "mi-cliente-s-l"
 */
export function slugify(input: string): string {
  return input
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "") // strip accent marks
    .replace(/[^a-z0-9]+/g, "-") // non-alphanumeric → hyphen
    .replace(/^-+|-+$/g, "") // trim leading/trailing hyphens
    .replace(/-{2,}/g, "-"); // collapse repeats
}

/**
 * A reusable slug field. If left empty in the admin, it auto-fills from the
 * `sourceField` (e.g. "name" or "title"). Always normalized to a safe slug.
 */
export function slugField(sourceField = "name"): Field {
  return {
    name: "slug",
    type: "text",
    required: true,
    unique: true,
    index: true,
    admin: {
      position: "sidebar",
      description:
        "URL del recurso. Se rellena solo a partir del nombre si lo dejas vacío. Sin espacios ni tildes.",
    },
    hooks: {
      beforeValidate: [
        ({ value, data }) => {
          if (typeof value === "string" && value.length > 0) {
            return slugify(value);
          }
          const source = data?.[sourceField];
          if (typeof source === "string" && source.length > 0) {
            return slugify(source);
          }
          return value;
        },
      ],
    },
  };
}
