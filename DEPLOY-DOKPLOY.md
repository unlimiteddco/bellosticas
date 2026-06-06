# Despliegue en Dokploy — Web + Payload CMS

La web y su base de datos van en **un proyecto nuevo de Dokploy** ("Bellostas Web"),
separado del proyecto del CRM. Un solo servicio web (Next.js + Payload admin embebido)
+ un servicio Postgres.

```
Dokploy
├── Proyecto: CRM Bellostas Studio   (ya existe — NO se toca)
│   ├── docuseal
│   ├── bepartners-postgres
│   └── Frontend (CRM)
│
└── Proyecto: Bellostas Web          (NUEVO)
    ├── web         → esta app (web pública + /admin de Payload)
    └── web-db      → Postgres de la web
```

La web habla con el CRM por HTTP (webhook con secret), no comparten base de datos.

---

## 1. Crear el proyecto y la base de datos

1. En Dokploy: **Create Project** → nombre `Bellostas Web`.
2. Dentro, **Create Service → Database → PostgreSQL**:
   - Name: `web-db`
   - Database: `bellostas_web`
   - User: `bellostas`
   - Password: (genera uno fuerte y guárdalo)
   - Version: 16
3. Despliega la DB. Apunta su **connection string interno**, será algo como:
   ```
   postgres://bellostas:PASSWORD@web-db:5432/bellostas_web
   ```
   (el host es el nombre del servicio dentro de la red del proyecto)

---

## 2. Crear el servicio web

1. **Create Service → Application**.
   - Name: `web`
   - Source: tu repositorio Git (o sube por Docker).
   - Build: **Dockerfile** (ya está en la raíz del repo).
2. **Variables de entorno** del servicio `web`:

   ```env
   # Sitio
   NEXT_PUBLIC_SITE_URL=https://bellostas.studio

   # Cal.com
   NEXT_PUBLIC_CAL_LINK=bellostas/30min
   NEXT_PUBLIC_CAL_NAMESPACE=30min
   NEXT_PUBLIC_CAL_ORIGIN=https://cal.eu

   # CRM (mismo secret que en el proyecto del CRM)
   CRM_BASE_URL=https://admin.bellostas.studio
   WEB_WEBHOOK_SECRET=08a53be297094d245199198c845619c3f4b3d639bbad3e3190e9f0d5b538ce4f

   # Payload CMS
   DATABASE_URI=postgres://bellostas:PASSWORD@web-db:5432/bellostas_web
   PAYLOAD_SECRET=<genera con: openssl rand -hex 32>
   PAYLOAD_DB_PUSH=true

   NODE_ENV=production
   ```

   > `PAYLOAD_DB_PUSH=true` hace que Payload cree/sincronice las tablas en el
   > primer arranque, sin archivos de migración. (Para un setup más estricto a
   > futuro, se cambia a migraciones generadas en la imagen Docker node:22.)

   > Las `DATABASE_URI` y `PAYLOAD_SECRET` también hacen falta en **build**
   > porque Next pre-renderiza páginas que leen del CMS. Si Dokploy separa build
   > de runtime, marca esas vars también como build-time. (Si faltan en build, la
   > web igual compila usando el fallback estático.)

3. **Puerto**: la app escucha en `3000`. Configura el dominio `bellostas.studio`
   apuntando a este servicio (Dokploy gestiona el TLS con Let's Encrypt).

---

## 3. Volumen persistente para las imágenes

Las imágenes subidas en el CMS se guardan en `/app/public/media` dentro del
contenedor. Sin volumen, **se borran en cada redeploy**. En el servicio `web`:

1. **Volumes / Mounts → Add**:
   - Type: Volume
   - Name: `web-media`
   - Mount path: `/app/public/media`
2. Redeploy.

> Alternativa recomendada a medio plazo: mover el almacenamiento de `Media` a
> S3/Cloudflare R2 con `@payloadcms/storage-s3`, así las imágenes no dependen
> del disco del contenedor. (Hoy: volumen, que es suficiente.)

---

## 4. Primer arranque

1. Despliega `web`. En los logs verás `Pulling schema from database...` → Payload
   crea las tablas (push mode).
2. Entra a `https://bellostas.studio/admin` → pantalla de **crear primer usuario**.
   Crea tu cuenta (email + contraseña fuertes).
3. (Opcional) Migrar los 6 proyectos actuales de golpe en vez de a mano:
   desde tu máquina, con el servicio ya en producción:
   ```bash
   SEED_URL=https://bellostas.studio \
   SEED_ADMIN_EMAIL=tu-email@bellostas.studio \
   SEED_ADMIN_PASSWORD=tu-password \
   npm run seed
   ```
   (Crea el admin si no existe y sube los proyectos + la imagen de Gotten Gym.)

---

## 5. Comprobaciones post-deploy

- [ ] `https://bellostas.studio` carga (web pública)
- [ ] `https://bellostas.studio/admin` → login del CMS
- [ ] `https://bellostas.studio/blog` → listado (vacío hasta publicar)
- [ ] Subir una imagen en un proyecto del CMS → se ve en `/work`
- [ ] Enviar el form de contacto → llega al CRM (el `/api/contact` sigue intacto)
- [ ] Editar las 2 imágenes del hero de un servicio en el CMS (colección
      "Heros de servicio") → se reflejan en `/services/<slug>`

---

## Notas de arquitectura

- **Un solo contenedor** sirve la web pública Y el `/admin` de Payload. No hay
  servicio separado para el CMS — Payload 3 va embebido en Next.
- La API de Payload vive en `/payload-api/*` (no en `/api`) para no chocar con
  el `/api/contact` de la web. El `/admin` es la UI.
- Si la base de datos está caída, la web **sigue funcionando** con los datos
  estáticos de `lib/projects.ts` y `lib/service-pages.ts` (fallback automático).
- Node 22 en la imagen (recomendado por Payload). El build se hace dentro del
  contenedor para que `sharp` y deps nativas usen binarios linux correctos.
