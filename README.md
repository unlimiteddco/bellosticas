# Bellostas Studio

Boutique web design & development studio — bilingual (ES/EN) marketing site built on Next.js 15.

## Setup

```bash
nvm use
npm install
cp .env.local.example .env.local
npm run dev
```

Open http://localhost:3000.

## Stack

- Next.js 15 (App Router, Turbopack) · React 19 · TypeScript strict
- Tailwind v4 (`@theme` in `app/globals.css`, no `tailwind.config.js`)
- next-intl (`es` default at `/`, `en` at `/en`)
- GSAP 3 (load/scroll reveals) · Framer Motion 11 (UI/menu)
- Lenis smooth scroll (lerp 0.08, disabled under `prefers-reduced-motion`)
- @splinetool/react-spline (Hero 3D, dynamic `ssr: false`)
- lucide-react · next/font Crimson Text

## Env

- `NEXT_PUBLIC_SITE_URL` — canonical site URL.
- `NEXT_PUBLIC_SPLINE_SCENE_URL` — Spline scene URL. If empty, the Hero falls back to an animated SVG blob.

## Brand non-negotiables

- `//` prefix is part of every `EditorialLabel`.
- Carmín `#C2263A` only on CTAs, italic emphasis word in H1, hover states, and label dots.
- Crimson Text only for display (H1/H2/large numerals). Body & UI is Helvena (loaded from `/public/helvena-actualizado/` — only Regular 400, Medium 500, SemiBold 600).
- Grain overlay (`body::after` in `globals.css`) is permanent.
