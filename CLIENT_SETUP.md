# EO Labs · Template 04 — Windows & Doors (BLACK FRAME engine)

Static, framework-free (HTML5 / CSS3 / vanilla ES6+) website platform for windows, doors, aluminium / PVC / timber systems, sliding systems and facades.
One engine, three visual presets, EN/DE out of the box, no build step, no dependencies.

```bash
cd eo-labs-template-04
npx http-server . -p 8804 -c-1     # or any static server; open http://localhost:8804
```

> Open it through a local server, not `file://` — the admin preview uses `localStorage`, which is per-origin.

---

## 1 · Adapting the template for a new client (10–30 min)

Everything client-specific lives in `/data`, `/assets` and (optionally) one override file. **No HTML/CSS/JS edits are required.**

| # | Step | Where |
|---|------|-------|
| 1 | Replace the logo (single-colour SVG follows the theme colour; for a colour logo/PNG set `logoMono: false`) | `assets/icons/logo.svg` or `company.logo` |
| 2 | Company name, short name, legal name | `data/site.config.js → company` |
| 3 | Pick a **preset** and, if needed, override brand colours | `preset`, `branding` |
| 4 | Contacts, service area, social, legal links | `contact`, `social`, `legal` |
| 5 | Hero image (+ update the `<link rel="preload">` in `index.html`), CTA image, technical profile image | `hero.image`, `cta.image`, `technical.image` |
| 6 | Products (range list) and the four category tiles | `data/products.js` |
| 7 | Materials + finish swatches | `data/materials.js` |
| 8 | Real projects (`demo:false`) | `data/projects.js` |
| 9 | Manufacturers the client really works with | `data/manufacturers.js` |
| 10 | Languages (`default`, `enabled`) | `languages` |
| 11 | SEO: `siteUrl`, titles, descriptions, OG image; FAQ answers | `seo`, `data/faq.js` |
| 12 | Technical figures — only certified values | `technical.specs`, `technical.annotations` |
| 13 | `demoMode: false` | `data/site.config.js` |
| 14 | Deploy the folder **without** `/admin` and `/tools` | any static host |

### Faster: use the admin
Open `/admin/index.html` → edit → changes autosave to your browser and are previewed on `/index.html` immediately → **Export client.override.js** → drop the file into `/data/`. Defaults are left untouched, so template updates stay mergeable.
Layer order (later wins): `data/*.js` defaults → `data/client.override.js` → admin preview (`localStorage`).
See `CLIENT_CONFIG_EXAMPLE.js` for a complete override.

### Texts (hero, section headings, form labels)
UI copy is in `data/translations.js`. Override single keys from `client.override.js`:
```js
window.EO_OVERRIDE = { translations: { en: { hero: { title: 'Windows built\nfor the Alps.' } } } };
```
`\n` becomes a line break in headings; `{company}` / `{name}` are replaced with the company name.

---

## 2 · Presets — one engine, several characters

Set `preset` in config (or in Admin → Branding). In demo mode a small switcher in the top bar lets you flip presets live.

| Preset | Character |
|---|---|
| `black-frame` | Dark editorial, thin sans, square corners, champagne accent |
| `warm-stone` | Umber & travertine, serif display, pill buttons/round swatches, warm muted photography |
| `minimal-white` | Light throughout, ultra-light type, generous space, ink-black accent |

A preset only redefines CSS tokens (`css/presets.css`): palette, display font/weight/tracking, radius, swatch shape, image filter, category ratio, section spacing, header/hero overlay. Components never change.
**Add a preset:** copy a block in `css/presets.css`, rename `[data-preset="…"]`, adjust tokens, add the id to `EO.presets` (+ `EO.presetNames`/`presetShort`) in `js/config.js`.
`branding.*` colours override the preset for any client: `primary` = "dark" surface, `secondary` = "light" surface, `accent`, `black` (footer/base), `textDark`, `textLight`, `muted`.

## 3 · Languages
`data/translations.js` holds UI strings; content lists carry `{en, de, …}` objects. Missing keys fall back to the default language, then English.
**Add Dutch:** add `translations.nl = { … }` (copy `en`), add `'nl'` to `languages.enabled`. Add `nl` values to content where you have them. No component changes.
Language is persisted, can be forced with `?lang=de`, updates `<html lang>`, title, meta, OG and JSON-LD without reload.

## 4 · demoMode

| `demoMode: true` | `demoMode: false` |
|---|---|
| "DEMO TEMPLATE · Not a real company" bar + footer label | hidden |
| `robots: noindex, nofollow` | `index, follow` |
| Quote wizard fully interactive, **nothing sent, nothing stored**, ends with "This is a demo. No personal data has been submitted." | POSTs JSON to `quote.endpoint`, or prepares a `mailto:` to `contact.email`; consent checkbox required |
| No phone/e-mail/address shown (placeholders instead), no service area | shows only what is filled in |
| Projects marked **Sample**, "Demo imagery / Sample presentation" | `demo:true` projects hidden automatically |
| Manufacturers section hidden | shown if real entries exist |
| No `LocalBusiness` schema | `LocalBusiness` built **only** from real data (name + phone/e-mail/address) |
| No reviews, ratings, awards, certifications, guarantees — anywhere | same: the template never generates them |

Technical figures (Uw, dB, RC class) are empty by default; the section then shows generic wording. Enter values only if they are certified for the client's real systems.

---

## 5 · Architecture

```
index.html               semantic shell: section landmarks, dialogs, no client data
css/
  variables.css          tokens: container, spacing, type scale, radius, motion, palette (BLACK FRAME defaults)
  presets.css            black-frame · warm-stone · minimal-white
  base.css  layout.css   reset/type · containers, section themes (.theme-dark/-light/-black/.on-photo), reveal
  components.css         buttons, chips, media, swatches, accordion, fields, options
  sections.css           header, hero, products, precision, projects, materials, configurator, about, faq, cta, footer, dialogs
  responsive.css         ≤1180 · ≤960 · ≤768 · ≤640 (mobile designed separately) · ≤380 · ≥1700
js/
  config.js  (sync, tiny) merge defaults → override → localStorage, apply preset + brand colours before first paint
  i18n.js                t(), tr(), language state, DOM application
  render.js              pure data → HTML for every section
  configurator.js        5-step selector + live summary (roving radio groups, availability rules from product data)
  quote.js               8-step wizard in <dialog>, validation, demo/live submit
  gallery.js             project lightbox (<dialog>, arrows, keyboard, index)
  seo.js                 title/meta/canonical/OG/Twitter/hreflang + JSON-LD
  app.js                 bootstrap, delegated events, header, reveal, parallax, accordion
data/
  site.config.js         business configuration (single object)
  products.js  materials.js  projects.js  manufacturers.js  faq.js  options.js
  translations.js        EN / DE UI copy
  client.override.js     per-client override (exported from admin)
admin/                   local editor: list CRUD + reorder, colours, presets, languages, SEO, export/import
tools/generate-demo-images.js   regenerates the demo illustrations
```

Responsive strategy: desktop-first with token-scaled type and spacing; at ≤960 the header collapses to a compact menu and grids fold; at ≤640 categories and projects become horizontal snap rails, the configurator and wizard go vertical/full-screen, technical callouts collapse into numbered markers + legend, CTAs go full width.

## 6 · SEO architecture
- Homepage: `title`, `description`, canonical (from `seo.siteUrl`), Open Graph, Twitter, `hreflang` (`?lang=xx`) when more than one language and a `siteUrl` are set.
- JSON-LD: `BreadcrumbList`, `ItemList` of `Product` (no offers/ratings), `FAQPage` **only when the FAQ is rendered**, `LocalBusiness` only in live mode with real data.
- Future landing pages are prepared, not generated: `seo.pages` (`/windows`, `/doors`, `/sliding-doors`, `/aluminium-windows`, `/pvc-windows`, `/timber-windows`, `/facades`). Set `enabled: true` for a slug once a real page with real content exists; the category tile then links to it instead of filtering the homepage range.
- The homepage HTML is filled by JavaScript (copy comes from translations). Search engines render this, but for maximum SEO consider a prerender step (e.g. headless snapshot at deploy time) — not included on purpose to keep the platform build-free.

## 7 · Notes & limits (be honest with the client)
- **Demo imagery** is generated abstract SVG (no third-party photography). Replace with real architectural photography (jpg/webp, 1920w hero, 1200w projects); give big images `srcset` via `{ src, srcset }` objects in the data files.
- **Fonts:** system/Inter-style stack, zero webfont requests. To self-host Inter/Manrope drop woff2 files in `assets/fonts/` and add `@font-face` to `variables.css`.
- **Admin** is a local tool (`localStorage` + export). Do not deploy it to production; it has no authentication.
- The quote endpoint is a plain JSON POST; wire it to the client's CRM/form backend. Add a privacy policy URL under `legal.privacy`.
- The preview `<link rel="preload">` in `index.html` points at the default hero — update it when you change `hero.image`.

## 8 · Pre-launch QA checklist
- [ ] `demoMode:false`, real contacts, no `Demo`/`Sample` labels visible
- [ ] Only real projects/manufacturers; demo projects removed or hidden
- [ ] `seo.siteUrl`, titles, descriptions, OG image set; canonical is correct
- [ ] Legal links (`privacy`, `terms`, `cookies`) set; quote endpoint tested
- [ ] Alt texts reviewed; images compressed; hero preload updated
- [ ] 360 / 390 / 430 / 768 / 1024 / 1440 / 1920 — no horizontal scroll, menu, configurator and quote wizard work
- [ ] Keyboard: skip link, menu, language switch, radio groups (arrow keys), dialogs (Esc), accordion
