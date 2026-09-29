/* Language layer: translations lookup, localized-content helper, DOM application. */
(function () {
  'use strict';
  const EO = window.EO;
  const LANG_KEY = 'eo-t04:lang';
  let dict = {};
  let lang = 'en';

  function enabled() { return (EO.site.languages && EO.site.languages.enabled) || ['en']; }
  function fallbackLang() { return (EO.site.languages && EO.site.languages.default) || 'en'; }
  const dig = (o, path) => path.split('.').reduce((a, k) => (a == null ? a : a[k]), o);

  function detect() {
    const list = enabled();
    const q = new URLSearchParams(location.search).get('lang');
    if (q && list.indexOf(q) > -1) return q;
    try { const s = localStorage.getItem(LANG_KEY); if (s && list.indexOf(s) > -1) return s; } catch (e) { /* ignore */ }
    return list.indexOf(fallbackLang()) > -1 ? fallbackLang() : list[0];
  }

  const vars = (s, v) => String(s).replace(/\{(\w+)\}/g, (m, k) => {
    if (v && v[k] != null) return v[k];
    if (k === 'company') return EO.site.company.name;
    if (k === 'name') return EO.site.company.shortName || EO.site.company.name;
    return m;
  });

  EO.i18n = {
    init(translations) { dict = translations; lang = detect(); document.documentElement.lang = lang; },
    get lang() { return lang; },
    get enabled() { return enabled(); },
    /** UI string: current language → default language → English → key */
    t(key, v) {
      const val = [lang, fallbackLang(), 'en'].map((l) => dig(dict[l], key)).find((x) => x !== undefined && x !== null);
      if (val === undefined) return key;
      return typeof val === 'string' ? vars(val, v) : val;
    },
    /** Localized content object {en, de, nl…} (or plain string) */
    tr(obj) {
      if (obj == null) return '';
      if (typeof obj === 'string') return obj;
      const val = obj[lang] || obj[fallbackLang()] || obj.en || Object.values(obj).find(Boolean) || '';
      return typeof val === 'string' ? vars(val) : val;
    },
    name(code) { return (dict[code] && dict[code].langName) || code.toUpperCase(); },
    set(next) {
      if (enabled().indexOf(next) < 0 || next === lang) return false;
      lang = next;
      try { localStorage.setItem(LANG_KEY, next); } catch (e) { /* ignore */ }
      document.documentElement.lang = lang;
      return true;
    },
    /** Applies [data-i18n], [data-i18n-attr="attr:key;attr:key"] inside root. */
    apply(root = document) {
      root.querySelectorAll('[data-i18n]').forEach((el) => { el.textContent = EO.i18n.t(el.dataset.i18n); });
      root.querySelectorAll('[data-i18n-attr]').forEach((el) => {
        el.dataset.i18nAttr.split(';').forEach((pair) => {
          const [attr, key] = pair.split(':').map((s) => s.trim());
          if (attr && key) el.setAttribute(attr, EO.i18n.t(key));
        });
      });
    }
  };
})();
