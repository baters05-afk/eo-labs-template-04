#!/usr/bin/env node
/*
 * Static prerender — HTML = content, CSS = presentation, JS = interaction.
 *
 * Runs the SAME config + template code the browser uses (js/config.js, i18n.js, templates.js,
 * configurator.js, seo.js) inside a Node VM and writes crawler-visible HTML:
 *
 *   /index.html            default language      (canonical → /<default>/)
 *   /<lang>/index.html     one page per enabled language (hreflang alternates)
 *   /robots.txt            Disallow: / in demo mode, Allow + Sitemap in live mode
 *   /sitemap.xml           live mode with seo.siteUrl only
 *
 * Usage:  node tools/build.js        (no dependencies, run it after editing /data)
 */
const fs = require('fs');
const path = require('path');
const vm = require('vm');

const ROOT = path.join(__dirname, '..');
const read = (f) => fs.readFileSync(path.join(ROOT, f), 'utf8');
const template = read('src/index.template.html');

const SCRIPTS = ['data/client.config.js', 'data/client.override.js', 'data/options.js', 'data/translations.js', 'js/config.js', 'js/i18n.js', 'js/templates.js', 'js/configurator.js', 'js/seo.js'];

function makeContext() {
  const noop = () => {};
  const el = () => ({ style: {}, dataset: {}, classList: { add: noop, remove: noop }, setAttribute: noop, appendChild: noop, querySelector: () => null, querySelectorAll: () => [] });
  const ctx = {
    console, URL, URLSearchParams, JSON, Math, Date, Intl,
    localStorage: { getItem: () => null, setItem: noop, removeItem: noop },
    sessionStorage: { getItem: () => null, setItem: noop },
    location: { search: '', href: 'http://localhost/', protocol: 'http:', origin: 'http://localhost', pathname: '/' },
    matchMedia: () => ({ matches: false }),
    CSS: { escape: (s) => s },
    document: Object.assign(el(), { documentElement: el(), head: el(), body: el(), baseURI: 'http://localhost/', readyState: 'complete', addEventListener: noop, getElementById: () => null, createElement: el })
  };
  ctx.window = ctx;
  vm.createContext(ctx);
  SCRIPTS.forEach((f) => vm.runInContext(read(f), ctx, { filename: f }));
  return ctx;
}

function renderPage(lang, root) {
  const ctx = makeContext();
  const EO = ctx.EO;
  EO.root = root;
  EO.resolve(false);
  EO.i18n.init(EO.db.translations, lang);
  const site = EO.site;
  const t = EO.i18n.t;

  const brand = [];
  const css = EO.brandCss();
  if (css) brand.push(css);
  const vars = [];
  if (site.demoMode) vars.push('--demo-bar-h:2rem');
  if (site.company.logo) vars.push(`--logo:url("${EO.cssAsset(site.company.logo)}")`);
  if (vars.length) brand.push(`:root{${vars.join(';')}}`);

  const map = {
    lang, root,
    preset: EO.presetOf(),
    hash: EO.tpl.hash(),
    switcher: site.demoMode && site.features.presetSwitcher ? ' data-switcher="1"' : '',
    head: EO.seo.headHtml(),
    preload: EO.tpl.heroPreload(),
    brandStyle: brand.length ? `<style id="brand">${brand.join('')}</style>` : '',
    skip: t('nav.skip'),
    header: EO.tpl.headerInner(),
    main: EO.tpl.mainInner(),
    footer: EO.tpl.footerInner()
  };
  const html = template.replace(/\{\{(\w+)\}\}/g, (m, k) => (k in map ? map[k] : m));
  return { html, EO };
}

function write(rel, content) {
  const file = path.join(ROOT, rel);
  fs.mkdirSync(path.dirname(file), { recursive: true });
  fs.writeFileSync(file, content);
  console.log('wrote', rel, `(${(Buffer.byteLength(content) / 1024).toFixed(1)} KB)`);
}

// probe once for languages / mode
const probe = makeContext().EO;
probe.resolve(false);
const langs = probe.site.languages.enabled;
const def = probe.site.languages.default;
const site = probe.site;
const base = ((site.seo && site.seo.siteUrl) || '').replace(/\/$/, '');

write('index.html', renderPage(def, '').html);
if (langs.length > 1) langs.forEach((l) => write(`${l}/index.html`, renderPage(l, '../').html));

write('robots.txt', site.demoMode
  ? 'User-agent: *\nDisallow: /\n'
  : `User-agent: *\nAllow: /\n${base ? `Sitemap: ${base}/sitemap.xml\n` : ''}`);
if (!site.demoMode && base) {
  const urls = langs.length > 1 ? langs.map((l) => `${base}/${l}/`) : [`${base}/`];
  const alt = (l) => langs.map((x) => `    <xhtml:link rel="alternate" hreflang="${x}" href="${base}/${x}/"/>`).join('\n');
  write('sitemap.xml', `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">\n${urls.map((u, i) => `  <url>\n    <loc>${u}</loc>\n${langs.length > 1 ? alt(langs[i]) + '\n' : ''}  </url>`).join('\n')}\n</urlset>\n`);
} else if (fs.existsSync(path.join(ROOT, 'sitemap.xml'))) fs.unlinkSync(path.join(ROOT, 'sitemap.xml'));
console.log(`built: ${langs.join(', ')} · demoMode=${site.demoMode} · preset=${probe.presetOf()}`);
