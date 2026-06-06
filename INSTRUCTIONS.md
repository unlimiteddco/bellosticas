# Bellostas Studio · Guía del proyecto

Documentación viva de cómo está montado el sitio y cómo extenderlo. Léelo antes de tocar nada o pídeselo al agente que tengas delante.

---

## Tabla de contenidos

1. [Stack y filosofía](#stack-y-filosofía)
2. [Estructura de carpetas](#estructura-de-carpetas)
3. [Design system](#design-system)
4. [i18n (ES default, EN secundario)](#i18n)
5. [Páginas existentes](#páginas-existentes)
6. [Convenciones críticas](#convenciones-críticas)
7. [Datos centralizados](#datos-centralizados)
8. [Cómo añadir una página de servicio](#cómo-añadir-una-página-de-servicio)
9. [Cómo añadir un proyecto al portfolio](#cómo-añadir-un-proyecto)
10. [Cómo crear un formulario (contacto, lead magnets, popups)](#cómo-crear-un-formulario-contacto-lead-magnet-popup-newsletter)
11. [Animaciones — qué herramienta para qué](#animaciones)
12. [Gotchas y bugs conocidos](#gotchas)
13. [Inventario de componentes](#inventario-de-componentes)
14. [Scripts útiles](#scripts-útiles)

---

## Stack y filosofía

| Pieza | Tecnología | Notas |
|---|---|---|
| Framework | **Next.js 15** (App Router, Turbopack) | React 19, server components por defecto |
| Lenguaje | TypeScript strict | `paths.@/*` apunta a la raíz |
| Estilos | **Tailwind v4** con `@theme` block | NO `tailwind.config.js`. Ver [gotchas](#gotchas) |
| i18n | **next-intl** `as-needed` | `/` = ES, `/en` = EN |
| Animaciones | **GSAP 3** (heavy reveals) + **Framer Motion 11** (UI/hover) + **Lenis** (smooth scroll lerp 0.08) | |
| 3D / Hero | **@splinetool/react-spline** (dynamic ssr:false) | Cae a SVG si no hay scene URL |
| Tipografía | **Helvena** local (3 pesos: 400/500/600/700) + **Crimson Text** Google | Vars `--font-helvena` y `--font-crimson` |
| Iconos | lucide-react | |
| Utils | clsx + tailwind-merge | `cn()` helper en `lib/utils.ts` |

**Filosofía:** premium boutique. Whitespace, jerarquía editorial, mezcla tipográfica (Helvena medium + Crimson italic carmín en headlines), patrón de asteriscos como marca, grain overlay global, animaciones que respetan `prefers-reduced-motion`.

---

## Estructura de carpetas

```
/app
  /[locale]
    layout.tsx            ← fonts, i18n, SmoothScroll, Preloader, Navbar variant
    page.tsx              ← home (orquesta todas las secciones)
    not-found.tsx
    /contact/page.tsx     ← form + booking
    /work/page.tsx        ← portfolio (featured + grid)
    /services/[slug]/page.tsx  ← landing por servicio (5 líneas, importa <ServiceLanding>)
  globals.css             ← @theme block, vars CSS, body grain overlay
  layout.tsx              ← passthrough root

/components
  /ui                     ← primitivas reusables (botones, labels, logo, avatar, asterisco)
  /layout                 ← Navbar, NavbarPill, Footer, MobileMenu, LocaleSwitcher
  /sections               ← bloques de página (Hero, Services, Work, FAQ, ...)
  /sections/process-v2    ← mockups animados de DAY 1/2/3
  /sections/service       ← plantilla genérica de páginas de servicio
  /effects                ← SmoothScroll, Preloader, GrainOverlay
  /floating               ← widgets fixed (VideoTestimonialWidget)
  /providers              ← MotionProvider (reduced-motion global)

/lib
  utils.ts                ← cn()
  services.ts             ← catálogo de los 6 servicios (slug, stack, hasPage)
  service-pages.ts        ← config por slug (mockups hero, visuales bento, etc.)
  projects.ts             ← portfolio (single source of truth)
  testimonials.ts         ← legacy, no usado activamente
  faqs.ts                 ← keys para el acordeón
  hooks/                  ← useReducedMotion, useMediaQuery

/messages
  es.json                 ← TODO el copy ES (UI strings + service-page content)
  en.json                 ← idem EN

/public
  /helvena-actualizado    ← .woff2 fonts (solo se cargan 4 pesos)
  /logos                  ← bellostas-wordmark, logo-black, logo-white-red
  /client-logos           ← marquee (6 SVGs)
  /clientes               ← case-study assets (logo+cover por proyecto)
  /images                 ← grain.svg, fotos de Antonio + Javi
  /patterns               ← patron-asteriscos.svg
  antonio.jpg, cliente.jpg ← mockup de Day 1 del proceso
```

---

## Design system

### Colores (`app/globals.css` → `@theme`)

```css
--color-bg:           #FDFDFB   /* off-white cream */
--color-surface:      #FDFDFB   /* mismo que bg, separación por dividers */
--color-surface-2:    #F4F2EE   /* warm gray sutil para cards específicas */
--color-accent:       #C2263A   /* carmín — CTAs, italic emphasis, hover */
--color-accent-hover: #A81E31
--color-text:         #1D1D1B   /* carbon — texto principal */
--color-text-muted:   #6B6B68   /* texto secundario, metadata */
--color-border:       #E5E2DC   /* warm border */
--color-black:        #1D1D1B
--color-white:        #FFFFFF
```

**Reglas:**
- Carmín ÚNICAMENTE para: CTAs, palabra italic emphasis en headlines, hover states, bullets de editorial labels
- Crimson Text SOLO para display (H1/H2/numbers/quotes)
- Body, UI, botones → siempre Helvena
- Grain overlay (`body::after`) es permanente, no quitar

### Tipografía

```
Display:  Crimson Text 400, 600, italic 400, italic 600  (Google Fonts)
Body:     Helvena 400, 500, 600, 700                      (local woff2)
```

**Headlines mezcla** (toda la web excepto H1 del hero home):

```tsx
<MixedHeadline
  className="text-[40px] md:text-[56px] lg:text-[64px]"
  parts={[
    { text: "Empezar es " },
    { text: "fácil", accent: true },  // ← Crimson italic semibold carmín
    { text: "." },
  ]}
/>
```

- Partes normales → Helvena `font-medium` color text
- Parte `accent` → Crimson italic `font-semibold` color accent
- `inline-block` + `whitespace: pre-wrap` para preservar espacios

**Editorial labels** (todas las secciones empiezan con uno):

```tsx
<EditorialLabel>// 02 — PROCESO</EditorialLabel>
```
- Helvena 11px uppercase, letter-spacing 0.18em, color muted
- El `//` prefix es identidad de marca, NUNCA quitar

### Botones

```tsx
<PrimaryButton href="/contact">Hablamos</PrimaryButton>
<PrimaryButton href="/contact" variant="inverse">Reservar</PrimaryButton>
<GhostButton href="/work">Ver trabajos</GhostButton>
```

- Pill 48px alto, padding 28px, rounded-full
- Hover: bg carmín, texto blanco puro `#FFFFFF`, scale 1.02
- **Ambos llevan `"use client"`** (usan onMouseEnter/Leave handlers)
- **Inline style guarantee** — el color y bg se setean por JS para evitar problemas con Tailwind v4

---

## i18n

- Default locale `es` (sin prefijo). EN en `/en`
- `localePrefix: "as-needed"` (next-intl)
- Middleware en raíz redirige automáticamente
- Todo el copy va en `messages/es.json` y `messages/en.json`
- En componentes:
  ```tsx
  const t = useTranslations("nav");      // client
  // o
  const t = await getTranslations({ locale, namespace: "..." });  // server
  ```

**Estructura de claves:**
- `nav.*` · navbar
- `hero.*` · home hero
- `shortTestimonials.*` · sección testimonios home
- `services.*` · sección Services home
- `process.*` · proceso 3 días
- `clientPortal.*` · sección diferenciador
- `work.*` · home + work page
- `studio.*` · sobre Antonio
- `numbers.*` · stats negros
- `faq.*` · acordeón
- `ctaFinal.*` · cierre
- `footer.*` · footer
- `contactPage.*` · página /contact
- `contact.*` · form de contacto (subset)
- `workPage.*` · página /work
- `servicePages.{slug}.*` · cada landing de servicio
- `videoTestimonial.*` · widget flotante

---

## Páginas existentes

| Ruta | Implementación |
|---|---|
| `/` y `/en` | `app/[locale]/page.tsx` — orquesta todas las secciones del home |
| `/work` y `/en/work` | `app/[locale]/work/page.tsx` — featured + grid + mini-CTA |
| `/contact` y `/en/contact` | `app/[locale]/contact/page.tsx` — hero + form + booking + footer |
| `/services/desarrollo-web` | Importa `<ServiceLanding config={...} />` (~25 líneas) |
| Otros `/services/{slug}` | Pendientes — flagship listo, replicar al resto |

**Navbar:**
- Trabajos → `/work`
- Servicios → `/#services` (anchor al home Services section, smooth scroll Lenis)
- Estudio → `/studio` (404 por ahora, pendiente)
- Love → `/love` (404 por ahora, pendiente)
- Hablamos / CTA → `/contact`

**Variante de navbar:** en `app/[locale]/layout.tsx` línea 18:

```ts
const NAVBAR_VARIANT: "pill" | "classic" = "pill";
```

Cambias el valor → o `<NavbarPill>` (glass blur flotante) o `<Navbar>` (full-width clásica). Reversible en 1 palabra.

---

## Convenciones críticas

### 1. Tailwind v4 + `@theme`

**Problema raíz:** cuando usas `@theme { --color-*: ... }`, Tailwind v4 SOLO genera utility classes para los colores que defines ahí. `text-white`, `bg-black`, `text-red-500` NO existen como utility si no añades sus vars al `@theme`.

**Solución actual:** `--color-white: #FFFFFF` añadido a `@theme`. Para colores adicionales:
- Añade `--color-{name}: #...` al `@theme`
- O usa bracket arbitrary: `text-[#FF00AA]`, `bg-[var(--color-text)]`

### 2. PrimaryButton / GhostButton inline-style fallback

Estos botones usan **inline style + JS hover handlers** además de Tailwind para garantizar que el color blanco/carmín siempre aplique aunque haya issues con la generación de utilities:

```tsx
style={{ backgroundColor: "var(--color-text)", color: "#FFFFFF" }}
onMouseEnter={e => { e.currentTarget.style.backgroundColor = "var(--color-accent)"; ... }}
onMouseLeave={e => { e.currentTarget.style.backgroundColor = "var(--color-text)"; ... }}
```

Si añades nuevos botones, **sigue este patrón** o garantiza que las utilities tailwind se generan.

### 3. "use client" boundary

Cualquier componente que use:
- `onMouseEnter` / `onMouseLeave` / `onClick` con función
- `useState`, `useEffect`, hooks
- Framer Motion (`motion.*`, `useScroll`, etc.)

… necesita `"use client"` arriba del archivo.

**Excepción:** un Server Component puede CONTENER children que son client components (motion.span, etc.) sin problema. El error aparece cuando un Server Component intenta **pasar funciones como props** a un child client component. Solución: convertir el padre a client, o pasar strings/data simple en lugar de funciones.

### 4. Nested `<a>` tags

`AnimatedLogo` y otros componentes de Logo pueden tener Link internos. Si los wrappeas en otro Link, fallarán con hydration error.

**Fix:** `AnimatedLogo` acepta `asLink={false}` para renderizar `<span>` en vez de `<Link>` cuando un ancestor ya es `<Link>`.

### 5. Modal scroll lock + portal

`WorkModal` se renderiza vía `createPortal(node, document.body)` para escapar stacking contexts creados por Lenis (que setea `transform` en `<html>`). Además llama a `(window as any).__lenis?.stop()` para que el smooth scroll no intercepte los eventos wheel dentro del modal.

### 6. Scroll-to-top en navegación client-side

`SmoothScroll.tsx` vigila `usePathname()` y al cambiar de ruta:
- Si la URL tiene `#hash` → no hace nada (deja al browser hacer anchor scroll)
- Si no → llama a `lenis.scrollTo(0, { immediate: true, force: true })`

Sin esto, navegar entre páginas dejaba la nueva a la mitad porque Lenis preserva el scroll del DOM real.

### 7. Server Components + animaciones

Si un componente es Server (sin `"use client"`), no puede usar `onMouseEnter` inline. Usa CSS hover puro:

```tsx
<div className="logo-cell"><img /></div>
<style>{`
  .logo-cell { opacity: 0.9; transition: opacity 400ms; }
  .logo-cell:hover { opacity: 1; }
`}</style>
```

(Ver `LogoMarquee.tsx` como referencia.)

### 8. Animaciones entry sin FOUC

GSAP `from()` corre en `useEffect` (después del primer paint) → causa flash de elementos en estado final antes de animar. **Solución:** usar Framer Motion con `initial={{ ... }}` que se aplica inline en el SSR. Ejemplo: `GoogleReviewBadge` en el hero.

---

## Datos centralizados

Todos los catálogos son **typed TypeScript files** en `/lib/`. Single source of truth.

### `lib/services.ts` — Los 6 servicios

```ts
export const services: Service[] = [
  { number: "01", titleKey: "s01", slug: "desarrollo-web", stack: [...], hasPage: true },
  { number: "02", titleKey: "s02", slug: "diseno-branding", stack: [...] },
  ...
];
```

- `slug` → URL `/services/{slug}`
- `titleKey` → busca en `messages.services.items.{titleKey}`
- `hasPage: true` → la card del home se vuelve clickable a su landing
- `featured: true` → muestra badge "Destacado"

### `lib/projects.ts` — Portfolio

```ts
export type Project = {
  slug: string;
  name: string;
  category: string;
  year: number;
  client: string;
  stack: string[];
  liveUrl?: string;
  color: string;            // bg de la card cuando no hay assets
  descriptionKey: string;   // → messages.work.items.{key}
  logo?: string;            // SVG blanco centrado en card
  cover?: string;           // mockup que aparece en hover + modal
};
```

Esto se lee desde:
- Home → `<Work>` section
- `/work` → grid completo + featured
- `/services/*/cases` → filtrado por `stackFilter`
- `WorkModal` → detalle del proyecto

Cambias **un campo aquí → cambia en TODA la web**. Eso es lo que pediste como "centralizado".

### `lib/service-pages.ts` — Config de cada landing

```ts
export const servicePages: Record<string, ServicePageConfig> = {
  "desarrollo-web": {
    slug: "desarrollo-web",
    i18nNamespace: "servicePages.web",
    hero: {
      mockups: [
        { src: "/clientes/fada-despues.jpg", alt: "FADA" },
        { src: "/clientes/caso-gotten.jpeg", alt: "Gotten Gym" },
      ],
      techBadge: { label: "N", bg: "#000000", color: "#FFFFFF" },
    },
    bento: {
      visuals: ["performance", "seo", "headless", "edge", "typescript"],
    },
    projects: { stackFilter: "next.js", limit: 4 },
    faq: { questionKeys: ["q1", "q2", "q3", "q4", "q5"] },
  },
};
```

Separa **lo visual/estructural** (mockups, qué visual va en qué casilla del bento, qué proyectos filtrar) del **copy** (que vive en `messages/`).

---

## Cómo añadir una página de servicio

Pasos completos (≈30 min):

### 1. Añadir entry a `lib/service-pages.ts`

```ts
"seo-performance": {
  slug: "seo-performance",
  i18nNamespace: "servicePages.seo",
  hero: {
    mockups: [
      { src: "/clientes/X.jpg", alt: "..." },
      { src: "/clientes/Y.jpg", alt: "..." },
    ],
    techBadge: { label: "S", bg: "#C2263A", color: "#FFFFFF" },
  },
  bento: {
    visuals: ["seo", "performance", "edge", "headless", "typescript"],
  },
  projects: { stackFilter: "next.js", limit: 4 },
  faq: { questionKeys: ["q1","q2","q3","q4","q5"] },
}
```

### 2. Añadir namespace a `messages/es.json` Y `messages/en.json`

Bajo `servicePages.{slug}` con esta estructura exacta (copia de `web` y modifica):

```json
"seo": {
  "metaTitle": "...",
  "metaDescription": "...",
  "hero": {
    "label": "// SERVICIO · SEO & PERFORMANCE",
    "title_part1": "...",
    "title_emphasis": "...",
    "title_part2": ".",
    "sub": "...",
    "cta_primary": "Hablamos",
    "cta_secondary": "Ver casos",
    "stats": { "lcp": "...", "lighthouse": "...", "uptime": "..." }
  },
  "trusted": { "label": "// TRUSTED BY" },
  "manifesto": {
    "label": "// ...",
    "title_part1": "...",
    "title_emphasis": "...",
    "title_part2": ".",
    "body": "...",
    "bullets": ["...", "...", "...", "..."]
  },
  "bento": {
    "label": "// ...",
    "title_part1": "...",
    "title_emphasis": "...",
    "title_part2": ".",
    "items": {
      "f1": { "title": "...", "description": "..." },
      "f2": { "title": "...", "description": "..." },
      "f3": { "title": "...", "description": "..." },
      "f4": { "title": "...", "description": "..." },
      "f5": { "title": "...", "description": "..." }
    }
  },
  "projects": {
    "label": "// ...",
    "title_part1": "...",
    "title_emphasis": "...",
    "title_part2": "."
  },
  "faq": {
    "label": "// ...",
    "title_part1": "...",
    "title_emphasis": "...",
    "title_part2": ".",
    "items": {
      "q1": { "question": "...", "answer": "..." },
      "q2": { "question": "...", "answer": "..." },
      ...
    }
  }
}
```

### 3. Crear `app/[locale]/services/{slug}/page.tsx`

Copia de `app/[locale]/services/desarrollo-web/page.tsx`, cambia 1 línea:

```tsx
const SLUG = "seo-performance";  // ← solo esto
```

### 4. Activar el card en home

En `lib/services.ts`, en la entry correspondiente:

```ts
{ ..., slug: "seo-performance", hasPage: true }
```

### 5. (Opcional) Crear visual de bento nuevo

Si la animación que quieres para esta página no existe, añade a `components/sections/service/BentoVisuals.tsx`:

```tsx
export function MiNuevoVisual() { return <svg>...</svg>; }
```

Añade el key a `BentoVisualKey` y el case al switch de `BentoVisual({kind})`.

---

## Cómo añadir un proyecto al portfolio

Cada proyecto = 1 entry en `lib/projects.ts` + assets en `/public/clientes/` + 1-2 strings en `messages/{es,en}.json`. Tarda 5 minutos por proyecto si tienes los assets listos.

### 1. Assets en `/public/clientes/`

Drop estos archivos con el `slug` del proyecto como prefijo:

| Archivo | Obligatorio | Formato | Tamaño recomendado | Para qué |
|---|---|---|---|---|
| `{slug}-logo.svg` | Recomendado | SVG blanco sobre transparente | Vector — escalable | Se muestra centrado en la card del grid de Work y en el header del modal |
| `{slug}-cover.jpg` o `.webp` | Recomendado | JPG / WEBP | 16:10 o más ancho, 2000-2400px lado largo | Mockup destacado: aparece al hacer hover de la card y como hero del modal |
| `{slug}-gallery-1.jpg` … `{slug}-gallery-N.jpg` | Opcional | JPG / WEBP | 4:3 aprox., 1400-1800px ancho | Galería extra de 2 columnas dentro del modal (móvil, admin, antes/después, etc.) |

**Sin logo SVG** → el modal muestra el nombre en Crimson italic sobre el `color` del proyecto. Funciona pero queda menos premium
**Sin cover** → la card del grid muestra solo el nombre, y el modal renderiza dos bloques placeholder en 2 columnas (no rotos pero feos)
**Sin gallery** → el modal solo muestra el cover. Es lo normal para la mayoría de proyectos

### 2. Entry en `lib/projects.ts`

```ts
{
  slug: "nuevo-proyecto",                // URL-safe, sin tildes ni espacios
  name: "Nombre del proyecto",
  category: "SaaS · E-commerce",         // Categoría editorial, libre
  year: 2026,
  client: "Empresa S.L.",
  stack: ["Next.js", "Sanity", "Stripe"],// 2-4 tags, capitalized
  liveUrl: "https://ejemplo.com",        // opcional — añade botón "Ver en vivo" en el modal
  color: "#1A2B3F",                      // bg del card antes del hover + header del modal. Usa un color sólido del branding del cliente
  descriptionKey: "p_nuevo",             // clave i18n — debe existir en messages bajo work.items
  logo: "/clientes/nuevo-logo.svg",      // opcional pero MUY recomendado
  cover: "/clientes/nuevo-cover.jpg",    // opcional pero MUY recomendado
  gallery: [                             // opcional — solo para proyectos con varias capturas
    { src: "/clientes/nuevo-shot-1.jpg", alt: "Vista desktop" },
    { src: "/clientes/nuevo-shot-2.jpg", alt: "Vista móvil" },
    { src: "/clientes/nuevo-shot-3.jpg", alt: "Panel admin" },
    { src: "/clientes/nuevo-shot-4.jpg", alt: "Email transaccional" },
  ],
}
```

**Sobre `color`**: úsalo como bg de la card. Elige un color sólido pegado al branding del cliente (el granate de Adobe, el azul de Stripe, el verde Spotify). Funciona como identidad visual cuando no hay hover y como backdrop del logo SVG. Para un look más editorial elige tonos oscuros y desaturados (`#0F0F0F`, `#1A2B3F`, `#2C2417`). Para algo más juguetón, los colores marca del cliente.

### 3. Descripción en `messages/es.json` y `messages/en.json`

```json
"work": {
  "items": {
    "p_nuevo": "Una frase contundente sobre qué hicimos. Stack o detalle técnico. Métrica concreta si la hay (40% más rápido, +200K usuarios, etc.). Lo ideal son 2-4 frases."
  }
}
```

Hazlo en **ambos** ficheros (es + en). Mantén el mismo `descriptionKey` en los dos.

### 4. (Opcional) Featured y ordenación

- El **primer** proyecto del array es el "featured" en la home y `/work` (se renderiza en aspect 21:9 a ancho completo). Si quieres destacar uno nuevo, ponlo el primero del array
- El orden del array es el orden de aparición — más recientes arriba

### Cómo se ve cada cosa

- **Home Work section**: featured (1) + grid de 3 cards. Pulsar abre el modal
- **`/work` página**: featured + grid completo con todos los proyectos. Modal al pulsar
- **Modal popup** (`WorkModal.tsx`):
  - Header con bg de `color` + logo o nombre
  - Categoría + nombre grande
  - Strip de cliente / año / stack
  - Descripción de `messages`
  - Cover full-width
  - **Galería 2 columnas** (si está definida) — si pones número impar de imágenes la última ocupa las dos columnas para que no quede colgando
  - Botón "Ver en vivo" si hay `liveUrl`
- **Páginas de servicio**: si la entrada del servicio en `lib/service-pages.ts` tiene `stackFilter`, el grid de proyectos solo muestra los que matcheen ese stack (case-insensitive)

### Ejemplo completo (Gotten Gym, ya en producción)

```ts
{
  slug: "gotten-gym",
  name: "Gotten Gym",
  category: "Site + Custom Admin",
  year: 2024,
  client: "Gotten Gym",
  stack: ["Next.js", "Payload", "Tailwind"],
  color: "#0F0F0F",
  descriptionKey: "p_gotten",
  logo: "/clientes/logo-web-svg-white.svg",
  cover: "/clientes/caso-gotten.jpeg",
  // Si quisieras añadir galería:
  // gallery: [
  //   { src: "/clientes/gotten-hero.jpg",     alt: "Home pública" },
  //   { src: "/clientes/gotten-clases.jpg",   alt: "Calendario de clases" },
  //   { src: "/clientes/gotten-admin.jpg",    alt: "Panel admin de socios" },
  //   { src: "/clientes/gotten-mobile.jpg",   alt: "Vista móvil" },
  // ],
}
```

### Workflow rápido para un proyecto nuevo

1. Saca 4-6 capturas del proyecto (escritorio + móvil + admin si hay)
2. Pásalas a JPG / WEBP, recorta a ~16:10 o 4:3, máximo 2000px de ancho
3. Guárdalas en `/public/clientes/` con el patrón `{slug}-*.jpg`
4. Si tienes el logo del cliente en SVG, métele un find-replace de fill a blanco y guárdalo como `{slug}-logo.svg`
5. Pega un entry en `lib/projects.ts`
6. Añade la descripción en los dos JSONs de messages
7. `npm run dev` → mira la home y el modal

Listo. Aparece automáticamente en: home Work section, `/work` grid, modal popup, y en las páginas de servicios que filtren por algún tag del stack.

---

## Payload CMS (blog, portfolio editable, imágenes de hero)

Desde mayo 2026 el contenido editorial vive en **Payload CMS** (embebido en la
misma app Next, admin en `/admin`). La UI del sitio (nav, botones, labels)
sigue en `messages/{es,en}.json`; solo el **contenido** está en el CMS.

### Qué se gestiona en el CMS

| Colección | Para qué | Frontend |
|---|---|---|
| **Proyectos** | Casos de éxito del portfolio (todos los campos + galería) | `/work`, home, landings de servicio |
| **Blog** | Artículos (bilingües, con borradores) | `/blog`, `/blog/[slug]` |
| **Heros de servicio** | Las 2 imágenes de la derecha de cada hero de servicio | `/services/<slug>` |
| **Media** | Todas las imágenes subidas | — |
| **Users** | Quién entra al `/admin` | — |

### Patrón clave: CMS con fallback estático

Todo lo del CMS tiene **fallback automático**: si Postgres está vacío o caído,
la web usa `lib/projects.ts` y `lib/service-pages.ts`. **La web nunca se rompe
por falta de base de datos.** Cuando el CMS tiene datos, manda el CMS.

- `lib/cms/client.ts` → instancia Payload (o `null` si no hay DB)
- `lib/cms/projects.ts` → `getProjects(locale)` (CMS → fallback estático)
- `lib/cms/service-heroes.ts` → `getServiceHero(slug)` (CMS → null → config estática)
- `lib/cms/posts.ts` → `getPosts` / `getPostBySlug` (CMS, sin fallback)

Los componentes cliente (`Work`, `WorkModal`, `ServiceProjects`…) reciben los
datos ya resueltos como **props** desde el server component de la página. No
importan `lib/projects.ts` directamente nunca más.

### Desarrollo local

```bash
npm run db:up        # arranca Postgres local (docker, puerto 5433)
npm run dev          # Next + admin en http://localhost:3001/admin
# primer arranque: /admin → crea tu usuario
npm run seed         # (opcional) sube los 6 proyectos actuales al CMS
npm run db:down      # parar la DB
```

Env necesario en `.env.local` (ver `.env.local.example`):
`DATABASE_URI`, `PAYLOAD_SECRET`.

### Añadir un artículo de blog

1. `/admin` → **Blog** → **Create New**.
2. Rellena título, slug (se autogenera), extracto, contenido (rich text).
3. Sube imagen de portada (recomendado **1600×900**, 16:9).
4. Idiomas: arriba a la derecha cambias entre **ES / EN** y traduces los campos
   localizados (título, extracto, contenido, SEO). El slug es compartido.
5. **Save as Draft** mientras escribes; **Publish** cuando esté listo.
   Solo los publicados salen en `/blog`.

### Editar / crear un proyecto del portfolio

`/admin` → **Proyectos**. Todos los campos que antes estaban en código:
nombre, cliente, año, categoría (localizada), stack, descripción (localizada),
color, URL en vivo, logo, cover y **galería** (2 columnas en el modal).
`featured` (sidebar) marca el destacado a ancho completo; `order` controla el
orden. Tamaños recomendados de imagen están escritos en cada campo del admin.

### Cambiar las 2 imágenes del hero de un servicio

`/admin` → **Heros de servicio** → elige el servicio (o crea su entrada).
- `mode: stacked` → 2 mockups en ángulo (sube image1 + image2, ratio 3:4 ~1200×1600).
- `mode: single` → una imagen / PNG transparente (solo image1, ~1600×1400).
- `techBadge` → símbolo flotante opcional ($, ⚡, →…).
Si no hay entrada para un servicio, usa los mockups estáticos de
`lib/service-pages.ts`.

### Añadir un campo / colección nueva

1. Edita o crea el archivo en `payload/collections/`.
2. Regístralo en `payload.config.ts` (`collections: [...]`).
3. En **dev** Payload sincroniza el esquema solo (push mode) al reiniciar.
   En **prod** con `PAYLOAD_DB_PUSH=true` también; si no, migraciones.
4. El admin necesita el importMap actualizado para campos con componentes
   custom (rich text, etc.). Payload lo regenera al arrancar dev; el archivo
   es `app/(payload)/admin/importMap.js`.

### Gotchas del CMS

- **API en `/payload-api`, no `/api`** — para no chocar con `/api/contact`.
  El admin está en `/admin`. Ambos excluidos del middleware de next-intl.
- **Multiple root layouts**: no hay `app/layout.tsx`. La web vive en
  `app/(frontend)/` (con su `<html>`), el admin en `app/(payload)/` (el suyo).
- **Node 24 + el CLI de Payload** (`generate:types`, `migrate`) falla por un
  bug de workers/tsx. Por eso: dev usa push mode (sin CLI), el seed usa HTTP
  (`payload/seed.mjs`, node puro), y las migraciones de prod se generan en la
  imagen Docker node:22. La APP funciona perfecto en Node 24; solo el CLI no.
- **Imágenes**: se guardan en `public/media` (servidas en `/payload-api/media/file/…`).
  En prod necesitan un volumen persistente en Dokploy (ver `DEPLOY-DOKPLOY.md`).
- **Despliegue**: ver `DEPLOY-DOKPLOY.md` (proyecto Dokploy nuevo, web + Postgres).

---

## Cómo crear un formulario (contacto, lead magnet, popup, newsletter)

**REGLA DE ORO: nunca crees un form que mande datos a un endpoint propio sin pasar por `submitForm()`**. La integración con el CRM ya tiene retry policy, secret server-side, idempotency, attribution (visitor_id + UTMs + click IDs + first-touch), audit trail de consentimiento y tracking de tiempo en página. Si lo bypasses, pierdes todo eso y rompes el stitching con Cal.com y futuras campañas.

El contrato completo entre web y CRM vive en [`public/web-integration.md`](./public/web-integration.md). Léelo si vas a tocar la integración por debajo. Para crear un nuevo formulario, el flujo es siempre el mismo:

### Pieza única: `submitForm()` en `lib/web-form.ts`

```ts
import { submitForm } from "@/lib/web-form";

const result = await submitForm({
  form_id: "<identificador-único-de-este-form>",    // p.ej. "popup_exit_intent_home"
  form_type: "<enum>",                              // contact | quote_request | lead_magnet | newsletter | popup_discount | audit_request | other
  name: "...",
  email: "...",
  phone: "...",        // opcional
  company: "...",      // opcional
  message: "...",      // opcional
  service_interest: "ecommerce",       // opcional, enum de ServiceInterest
  budget: "3k_7k",                     // opcional, enum de Budget
  locale: "es",                        // viene de useLocale()
  consent_marketing: true,             // bool del checkbox
  time_on_page_ms: 12500,              // opcional, Date.now() - mountedAt
});

if (result.ok) { /* éxito → result.id (uuid del CRM) */ }
else            { /* error → result.error (string), result.status */ }
```

`submitForm()` automáticamente añade al payload:
- `idempotency_key` (UUID v4 fresco por intento — soporta reintentos sin duplicar)
- `visitor_id` + `session_id` desde localStorage (`lib/tracking.ts`)
- `page_url`, `page_title`, `referrer`, `user_agent`, `viewport_*`
- `utm_*`, `gclid`, `fbclid`, `msclkid` (current + first-touch merged)
- `consent_timestamp` (ISO 8601 si `consent_marketing=true`)
- `submitted_at` (ISO 8601)

### Pieza opcional: estructura típica del componente

Si copias [`components/sections/ContactForm.tsx`](./components/sections/ContactForm.tsx) como punto de partida tienes el patrón listo:

1. **`"use client"`** — los forms son siempre client (estado + submit)
2. **`useState`** para cada campo + un `status: "idle" | "sending" | "sent" | "error"`
3. **`useRef`** capturando `Date.now()` en mount, para enviar `time_on_page_ms`
4. **`useLocale()`** para pasar `locale` a `submitForm`
5. **Checkbox de `consent_marketing`** + nota linkando a `/privacidad` (RGPD)
6. **Manejar `result.ok` / `result.error`** con UI de feedback (verde para sent, rojo para error)

### Enums cerrados — IMPORTANTE

Los siguientes campos son enums **strict** en el CRM. Si mandas un valor fuera del enum, el CRM lo guarda como `null` en ese campo (no rechaza el form para no perder leads). Pero **siempre** usa los valores válidos:

```ts
// lib/web-form.ts re-exporta estos tipos
type FormType         = "contact" | "quote_request" | "lead_magnet" | "newsletter" | "popup_discount" | "audit_request" | "other";
type ServiceInterest  = "web_design" | "ecommerce" | "web_app" | "automation" | "migration" | "white_label" | "other";
type Budget           = "under_3k" | "3k_7k" | "7k_15k" | "15k_plus" | "not_sure";
type Locale           = "es" | "en";
```

Si necesitas añadir un valor nuevo al enum, **coordina antes con el CRM** (`public/web-integration.md`) — los enums son contrato compartido.

### Patrones por caso de uso

**Contact form** (form principal de `/contact`):
- `form_id: "contact_main"`, `form_type: "contact"`
- Campos: nombre, email, teléfono opcional, empresa opcional, mensaje, service_interest (multi-select, mandar primero como enum + lista en message), budget, consent_marketing
- Ya implementado: `components/sections/ContactForm.tsx`

**Lead magnet** (e.g., descarga de un PDF, plantilla):
- `form_id: "lead_magnet_<slug-recurso>"` (p.ej. `lead_magnet_pricing_guide`)
- `form_type: "lead_magnet"`
- Campos mínimos: nombre + email + consent_marketing (high-friction barato → menos pasos)
- En éxito: redirige a la URL del recurso (`/downloads/<file>.pdf`) o dispara una respuesta automática del CRM con el link

**Popup de descuento / exit intent**:
- `form_id: "popup_exit_intent_<página>"` o `"popup_discount_<campaña>"`
- `form_type: "popup_discount"`
- Solo email + consent_marketing (mínimo absoluto)
- Componente debe persistir "ya mostrado" en localStorage para no reaparecer en cada navegación (`bp_popup_<id>_seen`)

**Newsletter**:
- `form_id: "newsletter_footer"` (o donde lo coloques)
- `form_type: "newsletter"`
- Solo email + consent_marketing (el consent ES la suscripción aquí — required)

**Auditoría / quote request**:
- `form_id: "audit_request_<contexto>"`
- `form_type: "audit_request"` o `"quote_request"`
- Más campos que un lead magnet — al menos service_interest y budget

### Qué NO hacer

- ❌ Llamar al endpoint del CRM directamente desde el cliente (el `WEB_WEBHOOK_SECRET` es server-only)
- ❌ Crear un endpoint propio tipo `/api/newsletter`. Reutiliza `/api/contact` — distingue por `form_id` en el CRM
- ❌ Generar el `idempotency_key` fuera de `submitForm()` (siempre fresh UUID v4 por intento)
- ❌ Mandar `Date` objects al CRM. Siempre `.toISOString()` (`submitForm` ya lo hace)
- ❌ Saltarse el checkbox `consent_marketing` "porque es opcional". Es opt-in pero **debe existir**, y el `consent_timestamp` es audit trail RGPD
- ❌ Capturar tracking manualmente (`document.cookie`, etc.). Usa `lib/tracking.ts`

### Testing local

1. `.env.local` con `WEB_WEBHOOK_SECRET` y `CRM_BASE_URL` (ver `.env.local.example`)
2. `npm run dev`
3. Visita con UTMs: `localhost:3001/?utm_source=test&gclid=abc`
4. Abre devtools → Application → Local Storage → verifica `bp_visitor_id`, `bp_first_touch`
5. Submite el form → Network tab → `POST /api/contact` debe devolver 201 con `{ ok: true, id }`
6. Revisa el panel del CRM — debería aparecer el lead con todos los campos incluido el visitor_id

### Cal.com → CRM

Los bookings de Cal.com **NO** pasan por la web. Cal.com los manda directos al CRM vía webhook desde sus servidores. Configuración:

1. En `cal.eu/event-types/<event-type>/webhooks` → crear webhook
2. URL: `https://admin.bellostas.studio/api/webhooks/web/cal`
3. Secret: `CAL_WEBHOOK_SECRET` (env del CRM, **no** de la web)
4. Eventos: `BOOKING_CREATED`, `BOOKING_RESCHEDULED`, `BOOKING_CANCELLED`

La web pasa `visitor_id` + UTMs + click IDs al embed de Cal vía `config.metadata` (ya configurado en `BookingSection.tsx` con `buildCalAttribution()`). Cal los devuelve en el payload del webhook bajo `payload.metadata`, y el CRM los lee para hacer stitching con el form / page views del mismo visitor.

---

## Animaciones

### GSAP — solo para Hero del home

GSAP se reserva para secuencias complejas de entrada al cargar (split text del headline, stagger de label/sub/CTAs/strip, counter de stats). Solo en `Hero.tsx`. **No usar GSAP fuera del hero del home**.

### Framer Motion — todo lo demás

- Entry on viewport: `initial + whileInView + viewport={{ once: true, margin: "-50px" }}`
- Hover: `whileHover={{ y: -4, scale: 1.01 }}`
- Layout shared: `layoutId="..."` (modal morph, video widget collapsed↔expanded)
- Stagger: `transition={{ delay: index * 0.08 }}`
- Path drawing SVG: `motion.path initial={{ pathLength: 0 }} animate={{ pathLength: 1 }}`
- Continuous loops: `animate={[1, 1.05, 1]} transition={{ repeat: Infinity }}`

### Lenis — smooth scroll global

- `lerp: 0.08` (tight, no floaty)
- Expuesto en `window.__lenis` para que el modal pueda pausarlo
- Reset al cambiar de ruta vía `usePathname()` watcher

### Reduced motion

Siempre respetar `prefers-reduced-motion`:
- Hook `useReducedMotion` from `@/lib/hooks/useReducedMotion` (custom) o de `framer-motion`
- Si reducido: animaciones a `duration: 0`, sin parallax, sin loops, sin pulse, sin scroll smooth (Lenis se desactiva)

---

## Gotchas

| Síntoma | Causa | Fix |
|---|---|---|
| `text-white` no aplica → texto carbon | Tailwind v4 no genera utility si `--color-white` no está en `@theme` | Añadir var O usar `text-[#FFFFFF]` |
| Botones se ven completamente negros | Mismo problema con `text-bg`/`text-white` | PrimaryButton tiene inline-style fallback. Sigue el patrón |
| Hydration error `<a> cannot be descendant of <a>` | Logo wrapped en doble Link | `AnimatedLogo asLink={false}` |
| `Event handlers cannot be passed to Client Component props` | Componente sin `"use client"` usa onClick | Añadir `"use client"` arriba |
| `Functions cannot be passed directly to Client Components` | Server pasa función a client | Pasa string/data o convierte padre a client |
| `Element type is invalid: got undefined` | Server importa export de "use client" file que no se serializa | Wrappea el switch en un client component (ver `BentoVisual`) |
| Logos marquee de distinto color | SVGs con fills variados | Aplicar `filter: grayscale + opacity` por defecto. Opcional: unfilter en hover. Para diferencias de tamaño aparente, usar prop `scale` por logo |
| Página nueva abre a media altura | Lenis preserva scroll cross-route | Ver `SmoothScroll.tsx` watcher de `usePathname` |
| Modal se ve por detrás de otros elementos | Stacking context creado por `transform` en ancestor (Lenis) | Render via `createPortal(node, document.body)` |
| Scroll dentro del modal scrollea la página | Lenis intercepta wheel events | `lenis.stop()` al montar modal, `lenis.start()` al cerrar |
| Headline en H1 se rompe en muchas líneas | Cada part del MixedHeadline es `inline-block` atómico | Reducir font-size o acortar copy. En service hero la columna estrecha (5/12) + tamaño lg:64px lo resuelve |
| FOUC en elementos animados con GSAP | GSAP `from` corre post-paint | Migrar a Framer Motion con `initial` (se aplica inline en SSR) |
| Video widget aparece siempre | El trigger debería esperar a Services en viewport | Asegurar `<Services data-video-trigger>` y `triggerSelector` en widget |

---

## Inventario de componentes

### `/components/ui/` — primitivas

| Componente | Uso |
|---|---|
| `PrimaryButton` | Botón principal pill carbon. `variant: 'default' \| 'inverse'`. **"use client"** |
| `GhostButton` | Botón outline carbon, hover bg + blanco. **"use client"** |
| `EditorialLabel` | `// LABEL` Helvena 11px uppercase tracking 0.18em muted |
| `MixedHeadline` | H2 mezcla Helvena medium + Crimson italic accent. Stagger entry |
| `Divider` | hr 1px border |
| `SectionCard` | Card base con border hover lift |
| `Logo` | Image wrapper de los 3 SVGs (wordmark / black / white-red) con aspect ratios reales |
| `AnimatedLogo` | Logo con slide-up flip. Acepta `asLink={false}` |
| `InitialsAvatar` | Círculo carbon con iniciales Crimson italic |
| `AsteriskIcon` | SVG inline del asterisco signature |
| `BrandPattern` | Patrón asteriscos repetido (tile 140×70 nativo + xs/sm/md/lg) |
| `GoogleReviewBadge` | Logo G + 5 estrellas + link Read reviews |

### `/components/layout/`

| Componente | Uso |
|---|---|
| `Navbar` | Variante clásica full-width |
| `NavbarPill` | Variante glass pill flotante (active) |
| `MobileMenu` | Overlay full-screen con Framer slide |
| `LocaleSwitcher` | ES / EN toggle |
| `Footer` | 4 cols + banda asteriscos + headquarters + locale switcher |

### `/components/sections/` — bloques del home

| Componente | Sección |
|---|---|
| `Hero` | H1 split-text + Spline bg + editorial column con asterisco + foto |
| `HeroEditorial` | Lado derecho del hero (asterisco rotating + foto Antonio) |
| `HeroSpline` | Spline 3D wrapper con fallback SVG blob |
| `LogoMarquee` | Marquee infinito de 6 logos de clientes |
| `ShortTestimonials` | Grid 2-col + video centro estilo Awesomic |
| `Services` | Grid 3×2 con magnetic hover + badge featured + link a `/services/{slug}` |
| `ServiceCard` | Card individual de servicio |
| `Process` / `ProcessV2` | Days 1/2/3 con mockups animados (V2 activa) |
| `ProcessV2Card` / `process-v2/MockupV2Day*` | Mockups específicos de cada día |
| `ClientPortal` | El diferenciador (mockup dashboard scroll-parallax) |
| `Work` | Grid 2-col + modal popup |
| `WorkCard` | Card con logo→mockup cross-fade. Prop `featured` = banner 21:9 |
| `WorkModal` | Modal via createPortal con logo + cover full-width |
| `Studio` | Sobre Antonio (foto B/N + texto + chips) |
| `Numbers` | 4 cifras counter on viewport, bg carbon + asteriscos |
| `NumberCounter` | Counter individual con `dark` prop |
| `FAQ` / `FAQItem` | Acordeón Framer height auto |
| `CTAFinal` | Cierre con 3 avatares + logos + headline |
| `PatternDivider` | Banda con asteriscos entre secciones |

### `/components/sections/service/` — plantilla

| Componente | Uso |
|---|---|
| `ServiceLanding` | **Orquestador** — recibe `config + locale`, renderiza toda la página |
| `ServiceHero` | Hero 2-col (texto + mockup) |
| `ServiceHeroMockup` | 2 imágenes a ángulos + tech badge |
| `ServiceManifesto` | Texto + bullets + code window animado scroll parallax |
| `ServiceFAQ` | FAQ específico del servicio |
| `ServiceProjects` | WorkCards filtrados por stack. `id="cases"` |
| `BentoCell` | Card del bento grid |
| `BentoVisuals` | 5 visuales animados (performance, seo, headless, edge, typescript) |

### `/components/sections/{page}/` — específicos

| Carpeta | Uso |
|---|---|
| `ContactForm` | Form de contacto (servicios multi-select, presupuesto pills) |
| `Contact` | Sección home (no usada actualmente) |
| `BookingSection` | Calendario Cal.com-style con días + slots |
| `WorkPageContent` | Componente principal del `/work` |

### `/components/effects/`

| Componente | Uso |
|---|---|
| `SmoothScroll` | Lenis wrapper + scroll-to-top en route change + expose `window.__lenis` |
| `Preloader` | Pantalla de carga inicial 1.2s con sessionStorage guard |
| `GrainOverlay` | Vacío (overlay vive en `body::after` de globals.css) |

### `/components/floating/`

| Componente | Uso |
|---|---|
| `VideoTestimonialWidget` | Floating bottom-right. Aparece cuando Services entra en viewport. Collapsed↔Expanded con layoutId |

### `/components/providers/`

| Componente | Uso |
|---|---|
| `MotionProvider` | `MotionConfig` framer con `reducedMotion="always" \| "never"` global |

---

## Scripts útiles

```bash
# Dev (Turbopack)
npm run dev

# Build
npm run build

# Start production
npm start

# Type check
npm run typecheck

# Lint
npm run lint
```

**Puerto:** suele saltar entre 3000–3004 según qué otro proyecto tengas corriendo. El terminal te dice al arrancar.

---

## Filosofía de "no over-engineering"

- **No CMS por ahora.** TypeScript files son single source of truth (`projects.ts`, `services.ts`, `service-pages.ts`, `messages/{es,en}.json`). Cero overhead, type-safe, version-controlled.
- **No micro-componentes.** Cada sección es un archivo razonablemente grande pero autocontenido. Sub-componentes solo cuando se reutilizan (BentoCell, FAQItem, WorkCard).
- **Reutilización agresiva.** El home Footer es el mismo que en /work y /contact. WorkCard se usa en home, /work y service pages. ShortTestimonials se usa en home Y service pages.
- **Animaciones contenidas.** GSAP solo en Hero del home. Framer Motion en todo lo demás. Lenis se pausa cuando hay modales abiertos. Reduced motion se respeta.

Cuando algo crece a >300 líneas o se reutiliza en 3+ sitios, ahí se separa.

---

## Cambios reversibles

Algunas decisiones están detrás de flags para revertir fácil:

| Decisión | Cómo revertir |
|---|---|
| Navbar pill vs classic | `NAVBAR_VARIANT = "classic"` en `app/[locale]/layout.tsx` |
| Process v1 vs v2 | En `app/[locale]/page.tsx`, cambiar `<ProcessV2>` por `<Process>` (el componente v1 sigue existiendo) |
| Comomelocomo bg verde | Restaurar `comomelocomo.svg.bak` en `/public/client-logos/` |

---

## Pendiente / Backlog

- [ ] Páginas individuales de servicio: `diseno-branding`, `seo-performance`, `headless-cms`, `chatbots-automacion`, `white-label`
- [ ] Página `/studio` (sobre el estudio detallado)
- [ ] Página `/love` (concepto pendiente)
- [ ] Integración real de Cal.com en `BookingSection`
- [ ] Endpoint `/api/contact` para procesar `ContactForm`
- [ ] Video real para `VideoTestimonialWidget` (actualmente placeholder)
- [ ] Foto real de Antonio para sección Studio (actualmente usa `antonio-bellostas-hero-grain.jpg`)
- [ ] Assets `logo + cover` para los proyectos restantes (SeoLatte, PrimeX, PVA, FADA, Embroidery)
- [ ] Schemas JSON-LD por página
- [ ] Sitemap.xml dinámico
- [ ] OG images por página (idealmente con `@vercel/og`)

---

_Última actualización: 13 may 2026_
