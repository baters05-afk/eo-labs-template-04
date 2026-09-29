/* SEO layer: title/meta/canonical/OG/Twitter/hreflang + JSON-LD. Re-runs on every language change. */
(function () {
  'use strict';
  const EO = window.EO;
  const { t, tr } = EO.ui;
  const LOCALES = { en: 'en_GB', de: 'de_DE', nl: 'nl_NL', fr: 'fr_FR', it: 'it_IT' };

  function metaTag(attr, key, content) {
    let el = document.head.querySelector(`meta[${attr}="${key}"]`);
    if (content == null || content === '') { if (el) el.remove(); return; }
    if (!el) { el = document.createElement('meta'); el.setAttribute(attr, key); document.head.appendChild(el); }
    el.setAttribute('content', content);
  }
  function linkTag(rel, href, extra = {}) {
    const sel = `link[rel="${rel}"]` + (extra.hreflang ? `[hreflang="${extra.hreflang}"]` : '');
    let el = document.head.querySelector(sel);
    if (!href) { if (el) el.remove(); return; }
    if (!el) { el = document.createElement('link'); el.rel = rel; Object.keys(extra).forEach((k) => el.setAttribute(k, extra[k])); document.head.appendChild(el); }
    el.href = href;
  }
  function clearAlternates() { document.head.querySelectorAll('link[rel="alternate"][hreflang]').forEach((n) => n.remove()); }

  function abs(url, base) { if (!url) return ''; try { return new URL(url, base || location.href).href; } catch (e) { return url; } }

  function graph(canonical, title, description) {
    const s = EO.site, co = s.company, c = s.contact || {};
    const g = [];
    g.push({ '@type': 'BreadcrumbList', itemListElement: [{ '@type': 'ListItem', position: 1, name: co.name, item: canonical }] });
    const items = EO.data.products();
    if (items.length) {
      g.push({
        '@type': 'ItemList', name: t('products.title'),
        itemListElement: items.map((p, i) => {
          const cat = EO.data.categories().find((x) => x.id === p.category);
          const img = (p.images && p.images[0]) || (cat && cat.image);
          return { '@type': 'ListItem', position: i + 1, item: Object.assign({ '@type': 'Product', name: tr(p.title), description: tr(p.description) }, img ? { image: abs(typeof img === 'string' ? img : img.src, canonical) } : {}) };
        })
      });
    }
    const faq = EO.site.features.faq ? EO.data.faqItems() : [];
    if (faq.length) g.push({ '@type': 'FAQPage', mainEntity: faq.map((f) => ({ '@type': 'Question', name: tr(f.question), acceptedAnswer: { '@type': 'Answer', text: tr(f.answer) } })) });
    // LocalBusiness only for live sites with real data — never in demo mode, never with invented ratings/awards.
    if (!s.demoMode && co.name && (c.phone || c.email || c.address)) {
      const lb = { '@type': 'LocalBusiness', name: co.legalName || co.name, url: canonical };
      if (co.logo) lb.image = abs(co.logo, canonical);
      if (c.phone) lb.telephone = c.phone;
      if (c.email) lb.email = c.email;
      if (c.address) lb.address = { '@type': 'PostalAddress', streetAddress: c.address };
      if ((c.serviceArea || []).length) lb.areaServed = c.serviceArea;
      const sameAs = Object.values(s.social || {}).filter(Boolean);
      if (sameAs.length) lb.sameAs = sameAs;
      g.push(lb);
    }
    return { '@context': 'https://schema.org', '@graph': g };
  }

  EO.seo = {
    apply() {
      const s = EO.site, seo = s.seo || {};
      const lang = EO.i18n.lang;
      const title = tr(seo.title) || t('meta.title');
      const description = tr(seo.description) || t('meta.description');
      document.title = title;
      metaTag('name', 'description', description);
      const base = (seo.siteUrl || '').replace(/\/$/, '');
      const canonical = base ? `${base}/` : (location.protocol.startsWith('http') ? location.origin + location.pathname : '');
      linkTag('canonical', canonical);
      clearAlternates();
      if (base && EO.i18n.enabled.length > 1) {
        EO.i18n.enabled.forEach((l) => linkTag('alternate', `${canonical}?lang=${l}`, { hreflang: l }));
        linkTag('alternate', canonical, { hreflang: 'x-default' });
      }
      metaTag('name', 'robots', s.demoMode ? 'noindex, nofollow' : 'index, follow');
      const img = abs(seo.ogImage || (s.hero && s.hero.image), canonical || location.href);
      metaTag('property', 'og:type', 'website');
      metaTag('property', 'og:site_name', s.company.name);
      metaTag('property', 'og:title', title);
      metaTag('property', 'og:description', description);
      metaTag('property', 'og:url', canonical);
      metaTag('property', 'og:locale', LOCALES[lang] || lang);
      metaTag('property', 'og:image', img);
      metaTag('property', 'og:image:alt', t('meta.ogAlt'));
      metaTag('name', 'twitter:card', seo.twitterCard || 'summary_large_image');
      metaTag('name', 'twitter:title', title);
      metaTag('name', 'twitter:description', description);
      metaTag('name', 'twitter:image', img);
      if (s.company.favicon) linkTag('icon', s.company.favicon, { type: s.company.favicon.endsWith('.svg') ? 'image/svg+xml' : '' });
      let ld = document.getElementById('jsonld');
      if (!ld) { ld = document.createElement('script'); ld.type = 'application/ld+json'; ld.id = 'jsonld'; document.head.appendChild(ld); }
      ld.textContent = JSON.stringify(graph(canonical || location.href, title, description));
    }
  };
})();
