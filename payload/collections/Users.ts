import type { CollectionConfig } from "payload";

/**
 * Admin users — whoever can log into /admin and edit content.
 *
 * `auth: true` turns this into Payload's authentication collection (email +
 * password, sessions, password reset, etc.). The first user is created via
 * the seed script or the /admin first-run screen.
 */
export const Users: CollectionConfig = {
  slug: "users",
  auth: true,
  admin: {
    useAsTitle: "email",
    defaultColumns: ["name", "email"],
    group: "Sistema",
  },
  fields: [
    {
      name: "name",
      type: "text",
      label: "Nombre",
    },
  ],
};
