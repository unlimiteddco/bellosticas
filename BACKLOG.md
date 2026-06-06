# Bellostas Studio · Backlog

Auditoría viva de lo pendiente. Última revisión: **16 may 2026**.

Para detalles de arquitectura y convenciones del proyecto ver [`INSTRUCTIONS.md`](./INSTRUCTIONS.md).
Para el contrato de integración con el CRM ver [`public/web-integration.md`](./public/web-integration.md).

---

## 🚨 Bloqueante para lanzar (lo MÍNIMO indispensable)

### Acciones de usuario (no requieren código)
- [ ] **Configurar webhook Cal.com → CRM** en `cal.eu/event-types/30min/webhooks`
  - URL: `https://admin.bellostas.studio/api/webhooks/web/cal`
  - Secret: `CAL_WEBHOOK_SECRET` (el del CRM)
  - Events: `BOOKING_CREATED`, `BOOKING_RESCHEDULED`, `BOOKING_CANCELLED`
  - Sin esto: las reservas no entran al CRM
- [ ] **Email deliverability** para `info@bellostas.studio`: DKIM + SPF + DMARC en el provider de email
- [ ] **DNS de bellostas.studio** apuntando al servicio web en Dokploy
- [ ] **Crear servicio "Web"** en Dokploy junto a docuseal/postgres/Frontend, con env vars:
  - `NEXT_PUBLIC_SITE_URL=https://bellostas.studio`
  - `CRM_BASE_URL=https://admin.bellostas.studio`
  - `WEB_WEBHOOK_SECRET=08a53be...` (mismo que el CRM)
  - `NEXT_PUBLIC_CAL_LINK`, `NEXT_PUBLIC_CAL_NAMESPACE`, `NEXT_PUBLIC_CAL_ORIGIN`

### SEO básico (no se puede lanzar sin esto)
- [ ] `robots.txt` en `/public/robots.txt`
- [ ] `sitemap.xml` dinámico en `app/sitemap.ts` (Next 15 nativo)
- [ ] OG image estática (mínimo) — `/public/og-default.png`, 1200×630
- [ ] Canonical URLs verificadas (ya están en metadata, comprobar en deploy)

### Validación end-to-end antes de DNS
- [ ] Submit real del form de contacto desde la web → confirmar en CRM
- [ ] Reserva real desde el embed de Cal → confirmar en CRM con `visitor_id` correcto
- [ ] Borrar y volver a crear sesión → confirmar que el `bp_visitor_id` se persiste
- [ ] Test el banner de cookies en navegador limpio: accept / reject / configure

---

## 🔴 Importante — lanzar con esto o casi

### Bugs preexistentes (no son míos pero arrastran)
- [ ] `components/sections/BookingSection.tsx:30` — TS error `Property 'dark' is missing in type Theme record`. Hay que añadir `dark` variant a `cssVarsPerTheme` aunque no se use, o forzar `theme: "light"` de otro modo
- [ ] `components/sections/CTAFinal.tsx:72` — JSX `duplicate attribute name`. Limpiar el JSX

### SEO de impacto medio
- [ ] JSON-LD `Service` por landing de servicio (6 landings × 1 schema c/u)
- [ ] JSON-LD `FAQPage` en las landings que tienen FAQ
- [ ] JSON-LD `BreadcrumbList` en páginas internas
- [ ] OG images dinámicas con `@vercel/og` (1 por página, con título)

### Assets reales (todos tienen placeholder mientras tanto)

**Studio page** (12 imágenes en `/public/studio/`):
- [ ] `antonio-working.jpg` (hero vertical 4:5)
- [ ] `timeline-2022.jpg` → `timeline-2026.jpg` (5 hitos)
- [ ] `space-1.jpg` → `space-6.jpg` (gallery)

**Love page** (2 videos + 1 poster):
- [ ] `/public/testimonials/javier-flores.mp4`
- [ ] `/public/testimonials/themis-lopez.mp4`
- [ ] `/public/images/themis-testimonio.jpg` (poster)

**Work** (logos + covers en `/public/clientes/`):
- [ ] SeoLatte (logo + cover)
- [ ] PrimeX Academy (logo + cover)
- [ ] Voluntariado de Aragón (logo + cover)
- [ ] FADA — solo cover (logo ya está en client-logos)
- [ ] Embroidery Download (logo + cover)
- [x] Gotten Gym ✓
- [x] TeleAdhesivo (mockup ecommerce ✓)

### Analytics + monitorización
- [ ] Crear propiedad GA4 + meter `NEXT_PUBLIC_GA4_ID` en env (loader ya cableado, se enciende solo)
- [ ] Sentry para errores en producción
- [ ] Uptime monitor (Better Stack / UptimeRobot)
- [ ] Vercel Analytics o Plausible si quieres analítica sin Google (alternativa o complemento a GA4)

### Auditorías pre-launch
- [ ] Lighthouse en todas las páginas (objetivo ≥ 95 mobile + desktop)
- [ ] A11y: keyboard nav, aria labels, focus visible, contraste WCAG AA
- [ ] Cross-browser: Safari (Lenis tiene rarezas históricas) + Firefox
- [ ] Responsive iPhone SE (375px) — punto crítico de marca

---

## 🟡 Importante — primeras semanas tras lanzar

### Forms adicionales (patrones documentados en INSTRUCTIONS.md sección 10)
- [ ] Newsletter form en el footer (`form_id: "newsletter_footer"`)
- [ ] Lead magnet form: descarga de PDF o template (`form_id: "lead_magnet_<slug>"`)
- [ ] Popup exit-intent (`form_id: "popup_exit_intent_home"`)

### Mantenimiento
- [ ] Booking dot del hero: actualizar "Q2 2026" → "Q3 2026" cuando llegue julio
- [ ] Revisar el footer copyright al cambiar el año (auto con `new Date().getFullYear()` — verificar que sigue funcionando)

### Tracking events extra (opcional)
- [ ] Scroll-depth events al CRM (50%, 90%) usando el `visit` webhook
- [ ] Outbound click tracking
- [ ] Tiempo medio en página

---

## 🟢 Nice to have · backlog medio plazo

### Producto
- [ ] **Client portal real** en `portal.bellostas.studio` con login, proyectos en curso, fases, timestamps, comms async. Es **el** diferencial vs Awesomic/DesignMe — la home ya presume de él. Stack sugerido: Next.js + Clerk + Postgres + Drizzle
- [ ] Schema.org Review embed real (scraping de reseñas Google → JSON-LD para rich snippets)

### Contenido
- [ ] **Blog editorial** para SEO orgánico. CMS: Sanity. Áreas: técnico (Next.js, Postgres patterns), behind-the-scenes (cómo gestiono boutique), case studies extendidos
- [ ] Newsletter por email (Resend Audiences o Buttondown)

### UI / UX extras
- [ ] Dark mode toggle real (media web ya es dark, sería one-click)
- [ ] Sitemap multi-locale en footer
- [ ] Press / media kit page
- [ ] Awards / certifications strip (cuando llegue alguno)
- [ ] Página `/styleguide` interna con todos los componentes

### Otros
- [ ] A/B testing del CTA principal
- [ ] OG image personalizada por página dinámica con título + autor + cover
- [ ] Form de "Aplicar para colaborar" si decides abrir hiring/partner
- [ ] Service worker / PWA básica
- [ ] Open source: liberar piezas reutilizables (el `MixedHeadline`, el `BrandPattern`, etc.)

---

## ✅ Hecho en mayo 2026

### Legales y compliance
- [x] `/legal` aviso legal LSSI-CE (15 may)
- [x] `/privacidad` política de privacidad RGPD + LOPDGDD (15 may)
- [x] `/cookies` política de cookies (15 may)
- [x] Cookie banner sin librerías externas, con provider, modal granular, y delay 1.8s (15-16 may)
- [x] AnalyticsLoader condicional gated por consentimiento (15 may)

### Backend / CRM
- [x] `/api/contact` endpoint real cableado al CRM (15 may)
- [x] `lib/web-form.ts` con `submitForm()` — retry, idempotency, secret server-side (15 may)
- [x] `lib/tracking.ts` — visitor_id, session_id, UTMs, click IDs, first-touch (15 may)
- [x] Cal embed con metadata wiring para stitching web ↔ Cal (15 may)
- [x] `public/web-integration.md` — contrato web ↔ CRM documentado (15 may)
- [x] INSTRUCTIONS.md sección "Cómo crear un formulario" (16 may)

### Páginas de servicios completas (5 de 6, todas con `hasPage: true`)
- [x] `/services/desarrollo-web`
- [x] `/services/white-label`
- [x] `/services/aplicaciones-web` con manifesto code variant
- [x] `/services/ecommerce` con OrdersWindow + mockup hero-ecommerce-clean.png
- [x] `/services/automatizaciones` con WorkflowWindow (n8n-style)
- [x] `/services/migraciones` con MigrationWindow (Lighthouse climb)

### UX
- [x] 404 editorial nueva con glitch RGB-split, terminal typewriter, 4 tarjetas índice
- [x] Refactor layout para fix "Missing html/body" en 404s (root layout owns html/body)
- [x] Navbar consolidada: Call → Portal (eliminado tel: placeholder)
- [x] GhostButton extendido con prop `external`
- [x] Portal cliente enlazado en navbar + footer + mobile menu

### Dominio + SEO base
- [x] Dominio actualizado de bellostas.es → bellostas.studio en JSON-LD, hreflang, OG, alternates
- [x] PORTAL_URL `portal.bellostas.studio` reservado

---

## 📋 Mi recomendación de orden si quieres lanzar esta semana

```
Lunes      : Cal.com webhook + email DKIM/SPF/DMARC + robots.txt + sitemap.xml
Martes     : OG image estática + JSON-LD básico (Service + FAQPage por landing)
Miércoles  : Crear servicio Web en Dokploy + env vars + test build local con npm run build
Jueves     : Lighthouse + a11y audit + fix bugs pre-existentes (BookingSection, CTAFinal)
Viernes    : DNS bellostas.studio → Dokploy + verificación end-to-end (form + Cal)
```

Después de lanzar:
- Semana 2: reemplazar assets reales según vayan llegando
- Semana 3: GA4 + Sentry + Uptime monitor
- Mes 2: client portal real (es el moat)
- Mes 3: blog + newsletter

---

## 🗂️ Estado actual del proyecto

### Páginas en producción ✅
- `/` home completo (12 secciones)
- `/work` portfolio con featured + grid + modal
- `/studio` editorial sobre el estudio
- `/love` testimonios (videos + mosaic + results + Google)
- `/contact` form + Cal.com embed con metadata
- `/services/desarrollo-web`
- `/services/white-label`
- `/services/aplicaciones-web`
- `/services/ecommerce`
- `/services/automatizaciones`
- `/services/migraciones`
- `/legal` `/privacidad` `/cookies`
- `/[locale]/not-found.tsx` (404 editorial nueva)

### Stack consolidado
Next.js 15 · React 19 · TypeScript strict · Tailwind v4 (`@theme`) · next-intl (ES default, EN) · GSAP 3 · Framer Motion 11 · Lenis · @splinetool/react-spline · @calcom/embed-react · Helvena (4 pesos local) · Crimson Text · lucide-react

### Convenciones críticas
Ver `INSTRUCTIONS.md`:
- Tailwind v4 `@theme` y por qué `text-white` no funciona sin var explícita
- Inline-style fallback de PrimaryButton / GhostButton
- "use client" boundaries y nested anchor errors
- Modal con `createPortal` + Lenis pause
- Scroll reset en route change
- **Cómo crear un formulario** (sección 10) — siempre usar `submitForm()` de `lib/web-form.ts`
