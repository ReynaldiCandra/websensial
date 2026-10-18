# WEBSENSIAL — Project Conventions

Premium digital agency + template marketplace. Business model: **sell ready-made
template files** (model DEL A). No SaaS builder, no customer hosting, no
subscription engine.

## Stack

- Next.js 16 (App Router, Turbopack) + TypeScript (strict)
- Tailwind CSS v4 (design tokens in `app/globals.css` `@theme`)
- `next-intl` for Indonesian (`/id`, default) and English (`/en`)
- `motion` for restrained animation (respect `prefers-reduced-motion`)
- No database, no backend integrations yet. Data lives in typed files; migrate
  to a DB later without touching the UI layer.

## Directory map

- `app/[locale]/` — locale-prefixed routes (home, products, product detail,
  services, portfolio, contact). `app/[locale]/[...rest]` catches unknown
  routes → `notFound()`.
- `app/globals.css` — design tokens (colors, glass, shadows, utilities).
- `components/layout/` — Header, Footer, LanguageSwitcher.
- `components/ui/` — reusable primitives (Container, Button, Badge, Section
  Heading, …).
- `components/marketing/`, `components/products/`, `components/forms/` —
  domain sections.
- `components/motion/Reveal.tsx` — scroll-reveal wrapper (client).
- `lib/data/` — **all content lives here**: `site.ts`, `products.ts`,
  `categories.ts`, `services.ts`, `portfolio.ts`.
- `messages/id.json`, `messages/en.json` — UI strings. **Never hardcode
  user-facing text in components** unless it is a proper product/tech name.
- `public/previews/` — replaceable SVG placeholder artwork.

## Editing products / catalog

1. Open `lib/data/products.ts`. Add an object to `products[]` following
   `Product` type (`id, slug, name{en,id}, summaries, descriptions, category,
   price, currency, previews, liveDemoUrl, purchaseUrl, format, tech,
   compatibility, includedFiles, features, license, featured, status,
   installRequirements`). English and Indonesian copy are inline on each field.
2. Set `status: "draft"` to hide from catalog (published items only render).
3. `liveDemoUrl` / `purchaseUrl` are **null when not configured** — the UI must
   show an honest "not configured" state. Never invent URLs.
4. Product detail copy goes in `descriptions` (int) — do not put product copy
   in messages files.

## Honesty rules (non-negotiable)

- No fabricated clients, testimonials, stats, award badges, or payment
  confirmations. Showcase projects are labeled as concepts/showcase.
- Demo catalog products are labeled as demonstration concepts.
- Contact form opens the visitor's mail client (mailto) until a real backend /
  messaging integration is configured; UI states this openly.

## Design system

- Tokens: see `@theme` + `:root` in `globals.css` (premium white + purple
  `#6328F5`, hover `#4B18D6`, blue `#4F6BFF`, lavender `#A58BFF`).
- Glassmorphism: `.glass` for nav/chips; `.glass-card` (+ `.glass-card-hover`)
  for content cards. Section atmosphere uses `.bg-aurora` / `.bg-aurora-soft`
  with `SectionBackground`, and decorative 3D SVGs from `public/3d` are placed
  via `GlassObject` (`aria-hidden`, `pointer-events-none`, desktop-only).
- 3D/depth: the hero uses the art-directed dashboard composition shipped in
  `public/hero/hero-dashboard-composition.webp` (asset pack original, feathered
  with `.hero-scene-mask`); `components/hero/GlassScene*` are unused WebGL
  leftovers kept for reference. All decorative animation is disabled under
  reduced motion.
- Localization: two-letter locale folders, inline en/id copy in data files,
  everything else via `useTranslations`/`getTranslations`.

## Commands

- `npm run dev` — dev server
- `npm run build` — production build (must pass, all locales)
- `npm run lint`, `npx tsc --noEmit` — checks

<!-- BEGIN:nextjs-agent-rules -->

## This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->
