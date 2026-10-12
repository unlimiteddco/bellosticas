-- Pone al día una base de datos creada con initial-schema.sql.
--
-- Qué le falta a esa base: la colección «Recursos» (lead magnets), que se
-- añadió al código después. Sin sus tablas el gestor no puede leer recursos; y
-- sin la columna `resources_id` en la tabla de bloqueos, CUALQUIER edición de
-- cualquier colección falla con un 500, porque antes de guardar Payload mira
-- si el documento está bloqueado y esa consulta nombra la columna.
--
-- Solo añade: no borra ni modifica nada que ya exista, y se puede ejecutar las
-- veces que haga falta (cada paso comprueba antes si ya está hecho).
--
-- Sacado de un esquema generado por Payload con el código actual, comparado
-- con initial-schema.sql. Si se añaden más colecciones o campos, esto no los
-- cubre: habrá que repetir la comparación.

BEGIN;

DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'enum_resources_type') THEN
    CREATE TYPE public.enum_resources_type AS ENUM ('guia', 'proceso', 'plantilla', 'checklist', 'kit', 'video');
  END IF;
END $$;

CREATE TABLE IF NOT EXISTS public.resources (
    id serial PRIMARY KEY,
    type public.enum_resources_type DEFAULT 'guia'::public.enum_resources_type NOT NULL,
    title character varying NOT NULL,
    slug character varying NOT NULL,
    subtitle character varying,
    cover_image_id integer,
    pdf_id integer,
    pdf_url character varying,
    keyword character varying,
    cta_label character varying,
    active boolean DEFAULT true,
    updated_at timestamp(3) with time zone DEFAULT now() NOT NULL,
    created_at timestamp(3) with time zone DEFAULT now() NOT NULL
);

CREATE TABLE IF NOT EXISTS public.resources_bullets (
    _order integer NOT NULL,
    _parent_id integer NOT NULL,
    id character varying PRIMARY KEY,
    text character varying NOT NULL
);

ALTER TABLE public.payload_locked_documents_rels ADD COLUMN IF NOT EXISTS resources_id integer;

-- Está en el código desde antes que los recursos; se incluye por si acaso.
ALTER TABLE public.projects ADD COLUMN IF NOT EXISTS coming_soon boolean DEFAULT false;

CREATE INDEX IF NOT EXISTS payload_locked_documents_rels_resources_id_idx ON public.payload_locked_documents_rels USING btree (resources_id);
CREATE INDEX IF NOT EXISTS resources_bullets_order_idx ON public.resources_bullets USING btree (_order);
CREATE INDEX IF NOT EXISTS resources_bullets_parent_id_idx ON public.resources_bullets USING btree (_parent_id);
CREATE INDEX IF NOT EXISTS resources_cover_image_idx ON public.resources USING btree (cover_image_id);
CREATE INDEX IF NOT EXISTS resources_created_at_idx ON public.resources USING btree (created_at);
CREATE INDEX IF NOT EXISTS resources_pdf_idx ON public.resources USING btree (pdf_id);
CREATE UNIQUE INDEX IF NOT EXISTS resources_slug_idx ON public.resources USING btree (slug);
CREATE INDEX IF NOT EXISTS resources_updated_at_idx ON public.resources USING btree (updated_at);

DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'payload_locked_documents_rels_resources_fk') THEN
    ALTER TABLE public.payload_locked_documents_rels
      ADD CONSTRAINT payload_locked_documents_rels_resources_fk FOREIGN KEY (resources_id) REFERENCES public.resources(id) ON DELETE CASCADE;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'resources_bullets_parent_id_fk') THEN
    ALTER TABLE public.resources_bullets
      ADD CONSTRAINT resources_bullets_parent_id_fk FOREIGN KEY (_parent_id) REFERENCES public.resources(id) ON DELETE CASCADE;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'resources_cover_image_id_media_id_fk') THEN
    ALTER TABLE public.resources
      ADD CONSTRAINT resources_cover_image_id_media_id_fk FOREIGN KEY (cover_image_id) REFERENCES public.media(id) ON DELETE SET NULL;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'resources_pdf_id_media_id_fk') THEN
    ALTER TABLE public.resources
      ADD CONSTRAINT resources_pdf_id_media_id_fk FOREIGN KEY (pdf_id) REFERENCES public.media(id) ON DELETE SET NULL;
  END IF;
END $$;

COMMIT;
