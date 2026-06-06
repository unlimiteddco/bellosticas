# Integración bellostas.studio ↔ CRM

Este documento es **el contrato** entre la web (bellostas.studio) y el CRM
(admin.bellostas.studio). Cualquier IA o developer que toque la web tiene que
respetar estos campos exactamente.

---

## 1. Formularios → CRM

### Endpoint

```
POST https://admin.bellostas.studio/api/webhooks/web/form
Content-Type: application/json
X-Webhook-Secret: <WEB_WEBHOOK_SECRET>
```

> El secret se comparte en el `.env` de la web. **Nunca expuesto en cliente.**
> La llamada se hace **siempre desde un Server Action / API route de Next.js**,
> nunca desde el navegador.

### Body (JSON)

```json
{
  "idempotency_key": "550e8400-e29b-41d4-a716-446655440000",
  "form_id": "contact_main",
  "form_type": "contact",

  "name": "Pedro García",
  "email": "pedro@empresa.com",
  "phone": "+34 600 000 000",
  "company": "Empresa SL",
  "message": "Quiero un ecommerce...",
  "service_interest": "ecommerce",
  "budget": "7k_15k",

  "page_url": "https://bellostas.studio/servicios",
  "page_title": "Servicios — Bellostas Studio",
  "referrer": "https://google.com",
  "locale": "es",

  "utm_source": "google",
  "utm_medium": "cpc",
  "utm_campaign": "branded",
  "utm_term": "diseño web madrid",
  "utm_content": "ad-variant-a",
  "gclid": "Cj0KCQ...",
  "fbclid": null,
  "msclkid": null,

  "visitor_id": "uuid-persistido-en-localStorage",
  "session_id": "uuid-rota-30min-inactividad",

  "consent_marketing": true,
  "consent_timestamp": "2026-05-14T17:30:00.000Z",

  "user_agent": "Mozilla/5.0 (...)",
  "viewport_width": 1440,
  "viewport_height": 900,
  "time_on_page_ms": 12500,
  "submitted_at": "2026-05-14T17:30:00.000Z"
}
```

### Campos obligatorios

| Campo | Tipo | Notas |
|---|---|---|
| `idempotency_key` | string UUID v4 | Único por intento de submit. Si reintentas, mismo UUID. |
| `form_id` | string | Identificador único del form en la web (`contact_main`, `cta_footer`, `popup_exit_intent`, …) |
| `form_type` | enum | Ver enums abajo |

Todo lo demás es **opcional** — pasa `null` o no lo incluyas.

### Enums (valores cerrados — strict matching)

**`form_type`**
- `contact`
- `quote_request`
- `lead_magnet`
- `newsletter`
- `popup_discount`
- `audit_request`
- `other`

**`service_interest`**
- `web_design`
- `ecommerce`
- `web_app`
- `automation`
- `migration`
- `white_label`
- `other`

**`budget`**
- `under_3k`
- `3k_7k`
- `7k_15k`
- `15k_plus`
- `not_sure`

**`locale`**
- `es`
- `en`

> Si la web manda un valor fuera del enum, el CRM lo guarda como `null` en ese campo (no rechaza el form para no perder leads).

### Respuesta del CRM

| Status | Body | Significado |
|---|---|---|
| `201 Created` | `{ ok: true, id: "uuid" }` | Form guardado correctamente |
| `200 OK` | `{ ok: true, duplicate: true, id: "uuid" }` | Ya teníamos este `idempotency_key` (re-intento) |
| `400 Bad Request` | `{ error: "..." }` | Faltan campos obligatorios o JSON inválido |
| `401 Unauthorized` | `{ error: "Unauthorized" }` | Secret incorrecto |
| `429 Too Many Requests` | `{ error: "Rate limit" }` | Más de 30 req/min desde esa IP. Header `Retry-After` indica espera |

### Retry policy desde la web

- 3 reintentos con backoff exponencial (1s, 4s, 16s)
- Cancelar después de 30s totales
- Si el código es **5xx** o **429**, reintentar
- Si es **4xx (excepto 429)**, NO reintentar (es un problema de validación)
- **Siempre** mantener el mismo `idempotency_key` entre reintentos

### Lo que hace el CRM al recibir

1. Valida secret + obligatorios
2. Comprueba idempotency
3. Guarda en BD
4. Crea notificación in-app para el admin
5. Envía email al admin (`info@bellostas.studio`) con todos los datos
6. Envía auto-reply al `email` del usuario (si lo dio) — en su `locale`

---

## 2. Analytics → Umami (próxima fase)

Cuando montemos Umami, el script será algo así (en `<head>` de la web):

```html
<script
  defer
  src="https://analytics.bellostas.studio/script.js"
  data-website-id="<UMAMI_WEBSITE_ID>"
></script>
```

Para que **stitching analytics ↔ forms** funcione, envía el `visitor_id` como propiedad en eventos de conversión:

```js
window.umami?.track("form_submitted", { visitor_id, form_id, form_type });
window.umami?.track("meeting_booked", { visitor_id });
```

**IMPORTANTE:** el mismo `visitor_id` que envías al CRM **DEBE** ser el mismo que mandas a Umami. Genera 1 UUID v4 al primer pageview, guárdalo en localStorage con clave `bp_visitor_id`, y reutilízalo en TODOS los eventos.

---

## 3. Cal.com → CRM

Cal.com manda los webhooks **directamente** desde sus servidores. No requiere código en la web. Lo configuras una vez en:

```
https://cal.eu/event-types/<event-type>/webhooks
```

Crear webhook con:

- **URL:** `https://admin.bellostas.studio/api/webhooks/web/cal`
- **Secret:** `<CAL_WEBHOOK_SECRET>` (env var en el CRM)
- **Events:** `BOOKING_CREATED`, `BOOKING_RESCHEDULED`, `BOOKING_CANCELLED`

### Pasar UTMs y visitor_id a cal.com

Para no perder atribución cuando alguien reserva una reunión desde la web:

1. Cuando el botón "Reservar" de la web tenga link a cal:
   ```
   https://cal.eu/bellostas/30min?utm_source=...&utm_campaign=...&metadata[visitor_id]=...&metadata[gclid]=...
   ```
2. Cal.com pasa esos params como `metadata` y `responses` del booking
3. El CRM los lee del payload y los guarda en `meetings`

---

## 4. Variables de entorno (CRM)

```env
WEB_WEBHOOK_SECRET=<string aleatorio largo>
CAL_WEBHOOK_SECRET=<string aleatorio largo>
```

Estos secrets se generan así (en cualquier terminal):

```bash
openssl rand -hex 32
```

---

## 5. Checklist para la IA que hace la web

- [ ] Crear util `bp-tracking.ts` que genera/recupera `visitor_id` desde localStorage
- [ ] Util `submitForm()` que:
  - genera `idempotency_key` UUID v4
  - junta UTMs de la URL + `localStorage.bp_visitor_id`
  - hace POST al endpoint del CRM (vía Server Action)
  - implementa retry policy
- [ ] Form de contacto con campos: nombre, email, teléfono opcional, empresa opcional, mensaje, service_interest (select), budget (select), checkbox consent_marketing
- [ ] Para futuro: util reusable para múltiples forms (`form_id` distinto)
- [ ] El secret nunca expuesto en `NEXT_PUBLIC_*`. Solo lo usa el Server Action en Node.
- [ ] HTTPS obligatorio en todos los entornos (incluso staging)
- [ ] (Opcional) Microsoft Clarity con `data-website-id` env var
