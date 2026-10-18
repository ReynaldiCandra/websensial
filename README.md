# WEBSENSIAL

Premium digital agency website + marketplace for ready-made website and landing
page templates. Built with Next.js 16 (App Router, Turbopack), TypeScript,
Tailwind CSS v4, next-intl (Indonesian/English) and Motion.

## Run locally

```bash
npm install
npm run dev        # http://localhost:3000 — redirects to /id (default locale)
```

Production:

```bash
npm run build
npm run start
```

Other checks: `npm run lint`, `npx tsc --noEmit`.

## Routes

| Route | Purpose |
| --- | --- |
| `/id` · `/en` | Home (hero, featured templates, categories, services, process, showcase, CTA) |
| `/id/products` · `/en/products` | Catalog with working search, category + format filters |
| `/id/products/[slug]` | Product detail: gallery, specs, license, honest demo/purchase states, related items |
| `/id/services` · `/en/services` | Agency services |
| `/id/portfolio` · `/en/portfolio` | Showcase (concepts are clearly labeled) |
| `/id/contact` · `/en/contact` | Validated contact form (mailto-based until a backend is configured) |
| `/sitemap.xml`, `/robots.txt` | Generated automatically |

## Content model

All editable content lives in `lib/data/`:

- `site.ts` — brand, canonical URL, contact channels
- `products.ts` — the template catalog (en/id copy inline per field)
- `categories.ts`, `services.ts`, `portfolio.ts`

UI strings live in `messages/id.json` + `messages/en.json`.
See `AGENTS.md` for the full conventions (how to add products, honesty rules,
design tokens).

## Current limitations (by design or not yet configured)

- Products are **demonstration concepts**; `liveDemoUrl`/`purchaseUrl` are
  `null`, so the UI shows honest "not configured" states instead of fake links.
- The contact form composes a real email via the visitor's mail client; wire a
  backend (e.g. Resend/Formspree) for automatic delivery.
- Preview artwork in `public/previews/*.svg` is generated placeholder art
  (`node scripts/generate-artwork.mjs`) — replace with real screenshots.
- `cacheComponents` / `partialPrefetching` are disabled in `next.config.ts`
  because of a React prerender quirk with the locale 404 catch-all.
