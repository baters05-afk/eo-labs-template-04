/*
 * Config resolution + theme bootstrap. Runs synchronously in <head> (tiny) so the
 * preset and brand colours are on <html> before the first paint.
 * Layers (later wins):  data/*.js defaults  →  data/client.override.js  →  admin preview (localStorage)
 */
(function () {
  'use strict';
  const EO = (window.EO = window.EO || {});
  const STORAGE_KEY = 'eo-t04:override';
  const PRESET_KEY = 'eo-t04:preset';
  const isObj = (v) => v && typeof v === 'object' && !Array.isArray(v);

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

  const overrides = () => [window.EO_OVERRIDE, readStored()].filter(isObj);

  EO.STORAGE_KEY = STORAGE_KEY;
  EO.merge = merge;
  EO.isObj = isObj;
  EO.presets = ['black-frame', 'warm-stone', 'minimal-white'];
  EO.presetNames = { 'black-frame': 'Black Frame', 'warm-stone': 'Warm Stone', 'minimal-white': 'Minimal White' };
  EO.presetShort = { 'black-frame': 'Black', 'warm-stone': 'Warm', 'minimal-white': 'White' };

  let site = EO.defaults.siteConfig;
  overrides().forEach((o) => { site = merge(site, o.siteConfig || {}); });
  EO.site = site;

  /** Lists (products, projects …) + translations with overrides applied. Called after data files load. */
  EO.resolveData = function () {
    const d = EO.defaults;
    const db = {};
    ['categories', 'products', 'materials', 'projects', 'manufacturers', 'faq'].forEach((k) => {
      let list = d[k] || [];
      overrides().forEach((o) => { if (Array.isArray(o[k])) list = o[k]; });
      db[k] = list;
    });
    db.options = d.options || {};
    let tr = d.translations || {};
    overrides().forEach((o) => { if (isObj(o.translations)) tr = merge(tr, o.translations); });
    db.translations = tr;
    return db;
  };

  EO.getPreset = function () {
    let p = EO.site.preset;
    const switcher = EO.site.demoMode && EO.site.features && EO.site.features.presetSwitcher;
    if (switcher) { try { p = sessionStorage.getItem(PRESET_KEY) || p; } catch (e) { /* ignore */ } }
    return EO.presets.indexOf(p) > -1 ? p : EO.presets[0];
  };

  const COLOR_MAP = {
    primary: '--color-bg-dark', secondary: '--color-bg-light', black: '--color-bg-black',
    accent: '--color-accent', textDark: '--color-text-dark', textLight: '--color-text-light',
    muted: '--color-muted', mutedOnLight: '--color-muted-light', onAccent: '--color-on-accent'
  };

  EO.applyTheme = function (preset) {
    const root = document.documentElement;
    root.dataset.preset = preset || EO.getPreset();
    root.classList.add('js');
    Object.keys(COLOR_MAP).forEach((k) => {
      const v = EO.site.branding && EO.site.branding[k];
      if (v) root.style.setProperty(COLOR_MAP[k], v); else root.style.removeProperty(COLOR_MAP[k]);
    });
    if (EO.site.company && EO.site.company.logo) root.style.setProperty('--logo', `url("${new URL(EO.site.company.logo, document.baseURI).href}")`);
    const meta = document.querySelector('meta[name="theme-color"]');
    if (meta) meta.content = getComputedStyle(root).getPropertyValue('--color-bg-black').trim() || '#090909';
  };

  EO.setPreset = function (p) {
    try { sessionStorage.setItem(PRESET_KEY, p); } catch (e) { /* ignore */ }
    EO.applyTheme(p);
  };

  EO.applyTheme();
})();
