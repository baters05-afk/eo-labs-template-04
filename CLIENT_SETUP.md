# EO Labs · Template 04 — Windows & Doors (BLACK FRAME engine)

Static, framework-free (HTML5 / CSS3 / vanilla ES6+) website platform for windows, doors, aluminium / PVC / timber systems, sliding systems and facades.
One engine, three visual presets, EN/DE (URL-per-language), no runtime dependencies.

**HTML = content · CSS = presentation · JS = interaction.**
The deployable HTML is generated from the config by `node tools/build.js`, so crawlers receive real text (H1, navigation, categories, materials, engineering, projects, FAQ, CTA, footer) *before* any JavaScript runs. JS only enhances.

```bash
cd eo-labs-template-04
node tools/build.js                       # regenerate /index.html, /en/, /de/, robots.txt (+ sitemap.xml in live mode)
npx http-server . -p 8804 -c-1            # preview
```

---

## 1 · New client in ~30 minutes

Everything client-specific lives in **one file: `data/client.config.js`** (+ `/assets`). No HTML/CSS/JS edits.

| # | Step | Where in `client.config.js` |
|---|------|------|
| 1 | Replace the logo (single-colour SVG follows the theme colour; colour logo → `logoMono:false`) | `company.logo` |
| 2 | Company name / short / legal | `company` |
| 3 | Contacts, service areas, socials, legal links | `contact`, `serviceAreas`, `socials`, `legal` |
| 4 | Pick a preset, set primary/accent if the brand needs it | `themePreset`, `branding` |
| 5 | Hero photo (+ optional mobile crop) | `hero.image`, `hero.imageMobile`, `hero.focal` |
| 6 | Categories & products (+ which materials/finishes/glass each supports) | `categories`, `products` |
| 7 | Materials + finish swatches | `materials` |
| 8 | Real projects (`demo:false`) | `projects` |
| 9 | Manufacturer logos (only real ones) | `manufacturers` |
| 10 | FAQ, languages, SEO | `faq`, `languages`, `seo` |
| 11 | Certified technical figures only | `technical.specs`, `technical.annotations` |
| 12 | `demoMode:false`, then **`node tools/build.js`** and deploy | `demoMode` |

**Admin (optional):** `/admin/index.html` edits the same data with instant preview on `/index.html`, then *Export client.override.js* → put it in `/data/` → run the build. The override is deep-merged over `client.config.js` (lists replace), so the base config stays clean.
**Texts** (hero headline, section titles, labels) live in `data/translations.js`; override single keys via `client.override.js → translations`.
See `CLIENT_CONFIG_EXAMPLE.js`.

## 2 · Photography pipeline (AVIF / WebP / JPEG, responsive)
1. Put source photos (≥2400 px wide) in `assets/photos-src/` (`hero.jpg`, `hero-mobile.jpg`, `cat-windows.jpg` …).
2. `node tools/images.js` → `assets/photos/<name>-{640,960,1440,1920}.{avif,webp,jpg}` + `manifest.json` (needs macOS `sips`, `cwebp`, optional `ffmpeg` with libsvtav1 for AVIF).
3. Paste the manifest entry into `hero.image` / `categories[].image` / `projects[].images[].src` …
4. `node tools/build.js` — the hero gets `<link rel="preload">` (with `imagesrcset`), `<picture>` sources, correct `width/height` (no CLS); below-the-fold images are `loading="lazy"`.

`hero.imageMobile` (its own portrait crop) is served to ≤640 px with its own preload. **The bundled images are generated SVG placeholders** — swap in real architectural photography for every client (no third-party photos are shipped).

## 3 · Presets — one engine, several characters
`themePreset`: `black-frame` · `warm-stone` · `minimal-white` (`css/presets.css`). A preset only redefines tokens (palette, display font/weight, radius, swatch shape, image filter, section spacing, hero/header treatment); components never change. In demo mode a switcher in the top bar flips presets live.
Add one: copy a block in `presets.css`, add the id to `EO.presets` in `js/config.js`. `branding.*` colours override any preset: `primary` = dark surface, `secondary` = light surface, `accent`, `black` (footer/base), `textDark`, `textLight`, `muted`.
Colour system: `#0A0A0A / #111 / #181818` · light `#F1EEE8 / #F5F3EF` · accent `#C9AC82` · muted `#98938A`.

## 4 · Configurator data model
Every click updates one state object and immediately updates the preview (cross-fading photo, material / finish / glass samples), the live "Your selection" and the next steps. A configuration can be shared as a link: `?product=sliding&material=aluminium&finish=anthracite&glass=low-e&project=commercial` (restored on load).
Preview data: `categories[].preview {image?, position}`, `materials[].swatch`, `materials[].finishes[].{color, previewImage}` (set `previewImage` for a finish-specific render), `options.glass[].{overlay, effect, note}`, `options.projectTypes[].image`.

`EO.state.configuratorState = { product, material, finish, glass, projectType }` — every option comes from data, nothing is hard-coded in the UI.
Per category (or product) in `client.config.js`:
```js
availableMaterials: ['aluminium', 'timber'],
availableFinishes: { aluminium: ['anthracite', 'black'], timber: ['oak', 'walnut'] },   // omit = all finishes of that material
availableGlass: ['standard', 'low-e', 'privacy']
```
Unsupported options are disabled with a reason; changing the product drops choices that are no longer valid. "Continue →" opens the quote wizard with the configuration pre-filled (it then only asks size, quantity, installation, location, contact).

## 4b · Exploded profile view (Precision section)
`technicalProfile` in `client.config.js` drives the animated cross-section: `animation`, `canvas`, `base`, `layers[]` (`id`, `image`, `desktopOffset {x,y}`, `mobileOffset {x,y}`, `start`, `duration` in ms), `annotations[]` (`id`, `layer`, `anchor {x,y}` in % of the canvas — the dot and line live *inside* the layer, so they move with it). Desktop offsets are design px at an 800 px plate (scaled with container width), mobile offsets are real px.
Sequence (once, at ~45 % visibility): assembled fade/scale-in → layers separate (staggered) → dots, lines draw, labels fade in → hover a label to lift its layer. `prefers-reduced-motion` and no-JS show the final state. Set `animation:false` (or remove `layers`) for the static `technical.image` fallback.
**New client render:** put the section photo/render in `assets/photos-src/profile.jpg`, adjust the region polygons at the top of `tools/make-profile-layers.py`, run `python3 tools/make-profile-layers.py` (needs Pillow) → `assets/profile/profile-<layer>-{960,1440}.webp` with identical canvases, then adjust anchors/offsets in the config and `node tools/build.js`.

## 5 · Languages & SEO
- One prerendered page per language: `/index.html` (default language, canonical → `/<default>/`), `/en/`, `/de/` … with `hreflang` alternates + `x-default` (needs `seo.siteUrl`). The language switch is real links (`<a href="../de/">`).
- Add Dutch: add `translations.nl` in `data/translations.js`, add `'nl'` to `languages.enabled`, rebuild → `/nl/` exists. Content lists fall back to the default language where `nl` is missing.
- `demoMode:true` → title "Windows & Doors Website Template — EO Labs Demo", `robots: noindex, nofollow`, `robots.txt Disallow: /`. `demoMode:false` → `index, follow`, client SEO, `sitemap.xml`.
- JSON-LD: `BreadcrumbList`, `FAQPage` (only when the FAQ is rendered), `ItemList/Product` (live mode, no offers/ratings), `LocalBusiness` **only** in live mode with real name + contact data. Never reviews, ratings, awards or certifications.
- Landing pages `/windows`, `/doors`, `/sliding-doors`, `/aluminium-windows`, `/pvc-windows`, `/timber-windows`, `/facades` are prepared as flags (`seo.pages.*.enabled`) but **not generated** — add one only when the client has unique content for it.

## 6 · demoMode
| `true` | `false` |
|---|---|
| DEMO TEMPLATE bar + footer label, noindex | none, indexable |
| Quote wizard is interactive but **sends nothing and stores nothing** ("Demo complete — No personal information has been submitted.") | POSTs JSON to `quote.endpoint`, or prepares a `mailto:`; consent required |
| Placeholders instead of phone/e-mail/address; no service area | only real values |
| Projects labelled "Demo imagery" | `demo:true` projects hidden |
| No manufacturers, no LocalBusiness | shown / built from real data |
| No testimonials, ratings, awards, certifications, guarantees, invented locations — anywhere | same |

## 7 · Architecture
```
src/index.template.html      page shell with {{tokens}}
js/templates.js              pure data → HTML (used by the browser AND the build)
js/config.js  i18n.js  seo.js  configurator.js   pure logic (runs in Node too)
js/app.js                    hydration: events, mobile menu, reveal, filters, accordion
js/gallery.js  quote.js      dialogs
tools/build.js               Node VM prerender → /index.html, /<lang>/index.html, robots.txt, sitemap.xml
tools/images.js              AVIF/WebP/JPEG pipeline
data/client.config.js        ← THE client file
data/client.override.js      per-client override (from admin)   data/options.js  data/translations.js
css/variables.css presets.css base.css layout.css components.css sections.css responsive.css
admin/                       local editor with import/export (never deploy)
```
The page carries `data-hash`; on load the browser compares it with the live config and only re-renders (from the same templates) when they differ — e.g. admin preview.

## 8 · Notes
- Deploy the folder without `/admin`, `/tools`, `/src`, `*.md`.
- The engineering section uses a generated cross-section illustration; replace `technical.image` with a real profile section photo/render.
- Fonts: system/Inter stack, zero webfont requests. To self-host add woff2 to `assets/fonts/` and `@font-face` in `variables.css`.
- Admin is local (`localStorage` + export), no authentication.

## 9 · Pre-launch checklist
- [ ] `demoMode:false`, real contacts, `seo.siteUrl`, titles/descriptions/OG, legal links, quote endpoint
- [ ] Real photography via `tools/images.js`; hero focal points checked on mobile; alt texts reviewed
- [ ] Only real projects/manufacturers; no demo labels visible
- [ ] `node tools/build.js` re-run after every config change; view-source shows the H1 and page text
- [ ] 360 / 390 / 430 / 768 / 1024 / 1440 / 1920: no horizontal scroll; menu, configurator, quote work; keyboard OK
