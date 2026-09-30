/*
 * SEO layer (pure): builds every <head> tag + JSON-LD from config. tools/build.js writes them into the
 * static HTML (data-seo marks the managed tags); the browser only re-applies them when the config changed.
 */
(function () {
  'use strict';
  const EO = window.EO;
  const { esc, t, tr, asImg } = EO.ui;
  const LOCALES = { en: 'en_GB', de: 'de_DE', nl: 'nl_NL', fr: 'fr_FR', it: 'it_IT' };

  const base = () => ((EO.site.seo && EO.site.seo.siteUrl) || '').replace(/\/$/, '');
  const multi = () => EO.i18n.enabled.length > 1;
  const langUrl = (l) => (base() ? `${base()}/${multi() ? l + '/' : ''}` : '');
  const abs = (u) => { if (!u) return ''; if (/^https?:/i.test(u)) return u; return base() ? `${base()}/${String(u).replace(/^\//, '')}` : EO.asset(u); };

  function texts() {
    const seo = EO.site.seo || {};
    const demo = EO.site.demoMode;
    const title = (demo ? tr(seo.demoTitle) : tr(seo.title)) || (demo ? 'Windows & Doors Website Template — EO Labs Demo' : t('meta.title'));
    const description = (demo ? tr(seo.demoDescription) : tr(seo.description)) || t('meta.description');
    return { title, description };
  }

  function jsonld(pageUrl) {
    const s = EO.site, co = s.company, c = s.contact || {};
    const g = [];
    g.push({ '@type': 'BreadcrumbList', itemListElement: [{ '@type': 'ListItem', position: 1, name: co.name, item: pageUrl || undefined }] });
    const items = EO.data.products();
    if (items.length && !s.demoMode) {
      g.push({
        '@type': 'ItemList', name: t('products.title'),
        itemListElement: items.map((p, i) => {
          const cat = EO.data.categories().find((x) => x.id === p.category);
          const img = asImg((p.images && p.images[0]) || (cat && cat.image)).src;
          return { '@type': 'ListItem', position: i + 1, item: Object.assign({ '@type': 'Product', name: tr(p.title), description: tr(p.description) }, img ? { image: abs(img) } : {}) };
        })
      });
    }
    const faq = (EO.site.features || {}).faq ? EO.data.faqItems() : [];
    if (faq.length) g.push({ '@type': 'FAQPage', mainEntity: faq.map((f) => ({ '@type': 'Question', name: tr(f.question), acceptedAnswer: { '@type': 'Answer', text: tr(f.answer) } })) });
    // LocalBusiness: live sites with real data only. Never ratings, reviews, awards or certifications.
    if (!s.demoMode && co.name && (c.phone || c.email || c.address)) {
      const lb = { '@type': 'LocalBusiness', name: co.legalName || co.name };
      if (pageUrl) lb.url = pageUrl;
      if (co.logo) lb.image = abs(co.logo);
      if (c.phone) lb.telephone = c.phone;
      if (c.email) lb.email = c.email;
      if (c.address) lb.address = { '@type': 'PostalAddress', streetAddress: c.address };
      if ((s.serviceAreas || []).length) lb.areaServed = s.serviceAreas;
      const sameAs = Object.values(s.socials || {}).filter(Boolean);
      if (sameAs.length) lb.sameAs = sameAs;
      g.push(lb);
    }
    return { '@context': 'https://schema.org', '@graph': g };
  }

  /** Managed <head> markup as one string (each tag carries data-seo). */
  function headHtml() {
    const s = EO.site, seo = s.seo || {};
    const lang = EO.i18n.lang;
    const { title, description } = texts();
    const pageUrl = langUrl(lang);
    const meta = (attr, key, content) => (content ? `<meta ${attr}="${esc(key)}" content="${esc(content)}" data-seo>` : '');
    const out = [`<title data-seo>${esc(title)}</title>`, meta('name', 'description', description)];
    out.push(meta('name', 'robots', s.demoMode ? 'noindex, nofollow' : 'index, follow'));
    if (pageUrl) out.push(`<link rel="canonical" href="${esc(pageUrl)}" data-seo>`);
    if (base() && multi()) {
      EO.i18n.enabled.forEach((l) => out.push(`<link rel="alternate" hreflang="${l}" href="${esc(langUrl(l))}" data-seo>`));
      out.push(`<link rel="alternate" hreflang="x-default" href="${esc(langUrl(EO.i18n.default))}" data-seo>`);
    }
    const img = abs(seo.ogImage || asImg(s.hero.image).src);
    out.push(meta('property', 'og:type', 'website'), meta('property', 'og:site_name', s.demoMode ? 'EO Labs Demo' : s.company.name), meta('property', 'og:title', title), meta('property', 'og:description', description), meta('property', 'og:url', pageUrl), meta('property', 'og:locale', LOCALES[lang] || lang), meta('property', 'og:image', img), meta('property', 'og:image:alt', t('meta.ogAlt')));
    out.push(meta('name', 'twitter:card', seo.twitterCard || 'summary_large_image'), meta('name', 'twitter:title', title), meta('name', 'twitter:description', description), meta('name', 'twitter:image', img));
    if (s.company.favicon) out.push(`<link rel="icon" href="${esc(EO.asset(s.company.favicon))}"${s.company.favicon.endsWith('.svg') ? ' type="image/svg+xml"' : ''} data-seo>`);
    out.push(`<script type="application/ld+json" data-seo>${JSON.stringify(jsonld(pageUrl)).replace(/</g, '\\u003c')}</script>`);
    return out.filter(Boolean).join('\n  ');
  }

  EO.seo = {
    headHtml, texts,
    /** Browser: replace managed tags (only used when the live config differs from the prerendered HTML). */
    apply() {
      document.head.querySelectorAll('[data-seo]').forEach((n) => n.remove());
      document.head.insertAdjacentHTML('beforeend', headHtml());
    }
  };
})();
