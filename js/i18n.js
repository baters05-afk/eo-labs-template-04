/* Language layer (pure): UI strings, localized content, current language. One language per URL. */
(function () {
  'use strict';
  const EO = window.EO;
  let dict = {};
  let lang = 'en';
  const enabled = () => (EO.site.languages && EO.site.languages.enabled) || ['en'];
  const fallbackLang = () => (EO.site.languages && EO.site.languages.default) || 'en';
  const dig = (o, path) => path.split('.').reduce((a, k) => (a == null ? a : a[k]), o);
  const vars = (s, v) => String(s).replace(/\{(\w+)\}/g, (m, k) => {
    if (v && v[k] != null) return v[k];
    if (k === 'company') return EO.site.company.name;
    if (k === 'name') return EO.site.company.shortName || EO.site.company.name;
    return m;
  });

  EO.i18n = {
    init(translations, code) {
      dict = translations;
      lang = enabled().indexOf(code) > -1 ? code : fallbackLang();
    },
    get lang() { return lang; },
    get enabled() { return enabled(); },
    get default() { return fallbackLang(); },
    /** UI string: current → default → English → key */
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
    name(code) { return (dict[code] && dict[code].langName) || code.toUpperCase(); }
  };
})();
