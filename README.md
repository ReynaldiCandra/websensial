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

## CMS admin (Supabase)

`/admin` stores content in the Supabase table `websensial_content`
(`content_key = site-v1`) and images in the `websensial-media` bucket. Content is
**not** kept in this repository, so git cannot restore it.

Required variables (`.env.local` locally, Vercel for production): `SUPABASE_URL`,
`SUPABASE_ANON_KEY`, `SUPABASE_SERVICE_ROLE_KEY`, optionally
`ADMIN_SESSION_SECRET`. Schema: `supabase/websensial-cms.sql`; create the admin
user in Supabase Auth, then allow its UUID in `websensial_admins`.

If the panel says "CMS tidak dapat dihubungi" or the site falls back to the
demo catalog:

1. Open the Supabase dashboard and make sure the Websensial project is active.
   Free-tier projects are paused after days without activity; "Restore project"
   brings the data back.
2. Check that `SUPABASE_URL` in Vercel points to that project and its host still
   answers: `https://<ref>.supabase.co/auth/v1/health`.
3. Check that `SUPABASE_ANON_KEY` and `SUPABASE_SERVICE_ROLE_KEY` belong to the
   same project, then redeploy.
4. Sign in at `/admin` and verify Portfolio/Templates. If the project was
   recreated, `websensial_content` is empty and the content must be entered again.

Only the public site falls back to `lib/data/` so it stays online. The admin
editor never does: when the CMS cannot be read it refuses to load instead of
showing bundled content that a save would write over the stored data, and login
distinguishes a wrong password from an unreachable CMS.

### Snapshot fallback and keep-alive

Supabase pauses Free projects after about a week of low database activity, which
is why the portfolio used to revert to the demo catalog. Two safeguards:

- `lib/data/cms-snapshot.json` holds the last content saved from the CMS and the
  public site serves it when Supabase cannot be reached, so the real portfolio
  stays online. Refresh it after admin edits with `npm run cms:snapshot`, then
  commit the file. The admin editor never reads the snapshot.
- `.github/workflows/supabase-keep-alive.yml` reads one real row of
  `websensial_content` every day so a quiet site counts as active. It needs the
  repository secrets `SUPABASE_URL` and `SUPABASE_SERVICE_ROLE_KEY`, and it fails
  loudly (GitHub emails the owner) if Supabase answers anything but 200.

A paid Supabase plan is still the only guarantee against pausing. Moving the CMS
to a free database that does not pause projects (e.g. Neon) removes the problem
entirely.

## Current limitations (by design or not yet configured)

- Products are **demonstration concepts**; `liveDemoUrl`/`purchaseUrl` are
  `null`, so the UI shows honest "not configured" states instead of fake links.
- The contact form composes a real email via the visitor's mail client; wire a
  backend (e.g. Resend/Formspree) for automatic delivery.
- Preview artwork in `public/previews/*.svg` is generated placeholder art
  (`node scripts/generate-artwork.mjs`) — replace with real screenshots.
- `cacheComponents` / `partialPrefetching` are disabled in `next.config.ts`
  because of a React prerender quirk with the locale 404 catch-all.
