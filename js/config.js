/*
 * Config resolution. Pure (no DOM at load) so tools/build.js can run it in Node.
 * Layers (later wins):  data/client.config.js  →  data/client.override.js  →  admin preview (localStorage)
 */
(function () {
  'use strict';
  const EO = (window.EO = window.EO || {});
  const STORAGE_KEY = 'eo-t04:override';
  const PRESET_KEY = 'eo-t04:preset';
  const isObj = (v) => v && typeof v === 'object' && !Array.isArray(v);
  const LISTS = ['categories', 'products', 'materials', 'projects', 'manufacturers', 'faq'];

  /** Deep-merge plain objects; arrays and primitives from `extra` replace. */
  function merge(base, extra) {
    if (extra === undefined) return base;
    if (!isObj(base) || !isObj(extra)) return extra;
    const out = { ...base };
    Object.keys(extra).forEach((k) => { out[k] = isObj(extra[k]) && isObj(base[k]) ? merge(base[k], extra[k]) : extra[k]; });
    return out;
  }
  function readStored() {
    try { return JSON.parse(localStorage.getItem(STORAGE_KEY) || 'null'); } catch (e) { return null; }
  }
  const overrides = (withStored) => [window.EO_OVERRIDE, withStored ? readStored() : null].filter(isObj);

  EO.STORAGE_KEY = STORAGE_KEY;
  EO.merge = merge;
  EO.isObj = isObj;
  EO.presets = ['black-frame', 'warm-stone', 'minimal-white'];
  EO.presetNames = { 'black-frame': 'Black Frame', 'warm-stone': 'Warm Stone', 'minimal-white': 'Minimal White' };
  EO.presetShort = { 'black-frame': 'Black', 'warm-stone': 'Warm', 'minimal-white': 'White' };

  // defaults (used by the admin as the reset baseline)
  const C = EO.client;
  const siteDefaults = {};
  Object.keys(C).forEach((k) => { if (LISTS.indexOf(k) < 0) siteDefaults[k] = C[k]; });
  EO.defaults = Object.assign(EO.defaults || {}, { siteConfig: siteDefaults });
  LISTS.forEach((k) => { EO.defaults[k] = C[k] || []; });

  /** Resolve everything. `withStored` = include the admin's localStorage preview (browser only). */
  EO.resolve = function (withStored) {
    let site = siteDefaults;
    overrides(withStored).forEach((o) => { site = merge(site, o.siteConfig || {}); });
    const db = {};
    LISTS.forEach((k) => {
      let list = EO.defaults[k];
      overrides(withStored).forEach((o) => { if (Array.isArray(o[k])) list = o[k]; });
      db[k] = list;
    });
    db.options = EO.defaults.options || {};
    let tr = EO.defaults.translations || {};
    overrides(withStored).forEach((o) => { if (isObj(o.translations)) tr = merge(tr, o.translations); });
    db.translations = tr;
    EO.site = site;
    EO.db = db;
    return db;
  };

  /* ---------- theme ---------- */
  const COLOR_MAP = {
    primary: '--color-bg-dark', secondary: '--color-bg-light', black: '--color-bg-black',
    accent: '--color-accent', textDark: '--color-text-dark', textLight: '--color-text-light',
    muted: '--color-muted', mutedOnLight: '--color-muted-light', onAccent: '--color-on-accent'
  };
  EO.presetOf = function () { const p = EO.site.themePreset; return EO.presets.indexOf(p) > -1 ? p : EO.presets[0]; };

  /** CSS custom-property overrides for brand colours (inlined in <head> at build time). */
  EO.brandCss = function () {
    const B = EO.site.branding || {};
    const decl = Object.keys(COLOR_MAP).filter((k) => B[k]).map((k) => `${COLOR_MAP[k]}:${B[k]}`);
    return decl.length ? `:root{${decl.join(';')}}` : '';
  };

  /** Browser only: apply preset (session switcher wins in demo) + brand colours. */
  EO.applyTheme = function (preset) {
    const root = document.documentElement;
    let p = preset || EO.presetOf();
    if (!preset && EO.site.demoMode && EO.site.features.presetSwitcher) {
      try { p = sessionStorage.getItem(PRESET_KEY) || p; } catch (e) { /* ignore */ }
    }
    root.dataset.preset = p;
    Object.keys(COLOR_MAP).forEach((k) => {
      const v = EO.site.branding && EO.site.branding[k];
      if (v) root.style.setProperty(COLOR_MAP[k], v); else root.style.removeProperty(COLOR_MAP[k]);
    });
    if (EO.site.company.logo) root.style.setProperty('--logo', `url("${EO.cssAsset(EO.site.company.logo)}")`);
    const meta = document.querySelector('meta[name="theme-color"]');
    if (meta) meta.content = getComputedStyle(root).getPropertyValue('--color-bg-black').trim() || '#0A0A0A';
  };
  EO.setPreset = function (p) {
    try { sessionStorage.setItem(PRESET_KEY, p); } catch (e) { /* ignore */ }
    EO.applyTheme(p);
  };

  /** Prefix for root-relative assets: "" on /, "../" on /de/ … (set by build on <html data-root>). */
  EO.root = '';
  EO.asset = function (p) {
    if (!p || /^(?:[a-z]+:|\/|#|data:)/i.test(p)) return p || '';
    return EO.root + p;
  };

  /** URL for CSS custom properties: resolved against /css/*.css, so relative paths need "../". */
  EO.cssAsset = function (p) { return /^(?:[a-z]+:|\/|data:)/i.test(p) ? p : '../' + p; };

  EO.resolve(false);
})();
