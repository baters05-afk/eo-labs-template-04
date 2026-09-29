/* Rendering: pure "data → HTML" functions for every homepage section. No client data lives here. */
(function () {
  'use strict';
  const EO = window.EO;
  EO.state = EO.state || { filter: { category: 'all', material: 'all' }, finish: {}, faqOpen: null };
  const t = (k, v) => EO.i18n.t(k, v);
  const tr = (o) => EO.i18n.tr(o);
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => Array.from(r.querySelectorAll(s));
  const ESC = { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' };
  const esc = (s) => String(s == null ? '' : s).replace(/[&<>"']/g, (c) => ESC[c]);
  const pad = (n) => String(n + 1).padStart(2, '0');

  const ICON = {
    arrow: '<svg viewBox="0 0 22 16" fill="none" stroke="currentColor" stroke-width="1.2" aria-hidden="true"><path d="M0 8h20M14 1.5 20.5 8 14 14.5"/></svg>',
    left: '<svg viewBox="0 0 22 16" fill="none" stroke="currentColor" stroke-width="1.2" aria-hidden="true"><path d="M22 8H2M8 1.5 1.5 8 8 14.5"/></svg>',
    thermal: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.2" aria-hidden="true"><rect x="4" y="3" width="16" height="18"/><path d="M4 12h16M12 3v18"/></svg>',
    acoustic: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.2" aria-hidden="true"><path d="M4 9h4l5-4v14l-5-4H4zM16 9c1.4 1.6 1.4 4.4 0 6M19 6.5c2.6 3 2.6 8 0 11"/></svg>',
    security: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.2" aria-hidden="true"><path d="M12 3 4.5 6v5.5c0 4.6 3.2 8 7.5 9.5 4.3-1.5 7.5-4.9 7.5-9.5V6zM9 12l2.2 2.2L15.5 10"/></svg>',
    durability: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.2" aria-hidden="true"><path d="M12 3v3M12 18v3M3 12h3M18 12h3M5.6 5.6l2.1 2.1M16.3 16.3l2.1 2.1M5.6 18.4l2.1-2.1M16.3 7.7l2.1-2.1"/><circle cx="12" cy="12" r="3.2"/></svg>',
    instagram: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.4" aria-hidden="true"><rect x="3.5" y="3.5" width="17" height="17" rx="4.5"/><circle cx="12" cy="12" r="4"/><circle cx="17.2" cy="6.8" r=".8" fill="currentColor"/></svg>',
    linkedin: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.4" aria-hidden="true"><rect x="3.5" y="3.5" width="17" height="17"/><path d="M8 10.5V16M8 8v.01M11.5 16v-5.5M11.5 13c0-1.6 1-2.5 2.3-2.5S16 11.4 16 13v3"/></svg>',
    youtube: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.4" aria-hidden="true"><rect x="3" y="6" width="18" height="12" rx="3.5"/><path d="m10.3 9.5 4 2.5-4 2.5z" fill="currentColor"/></svg>'
  };
  const arrow = () => `<span class="arrow" aria-hidden="true">${ICON.arrow}</span>`;

  /* ---------- helpers ---------- */
  const asImg = (i) => (typeof i === 'string' ? { src: i } : i || {});
  function media(image, alt, o = {}) {
    const i = asImg(image);
    if (!i.src) return `<span class="media"${o.ratio ? ` style="--ratio:${o.ratio}"` : ''}></span>`;
    const srcset = i.srcset ? ` srcset="${esc(i.srcset)}" sizes="${esc(o.sizes || '(min-width: 960px) 30vw, 80vw')}"` : '';
    return `<span class="media"${o.ratio ? ` style="--ratio:${o.ratio}"` : ''}><img src="${esc(i.src)}"${srcset} alt="${esc(alt)}" loading="${o.eager ? 'eager' : 'lazy'}" decoding="async">${o.overlay || ''}</span>`;
  }
  const demo = () => !!EO.site.demoMode;
  const db = () => EO.db;
  const active = (list) => (list || []).filter((x) => x.active !== false);
  const categories = () => active(db().categories);
  const materials = () => active(db().materials);
  const products = () => active(db().products);
  function projects() {
    return active(db().projects).filter((p) => demo() || !p.demo);
  }
  const faqItems = () => active(db().faq);
  const manufacturers = () => (demo() ? [] : active(db().manufacturers));

  function setSection(id, show) { const el = document.getElementById(id); if (el) el.hidden = !show; return el; }
  const reveal = (i) => `class="reveal-item" style="--i:${i}"`;

  /* ---------- brand / header ---------- */
  function brand(cls = '') {
    const c = EO.site.company;
    const mark = c.logo
      ? (c.logoMono !== false
        ? `<span class="brand__mark" aria-hidden="true"></span>`
        : `<img class="brand__img" src="${esc(c.logo)}" alt="" width="128" height="32">`)
      : '';
    const showText = c.logoMono !== false || !c.logo;
    return `<a class="brand ${cls}" href="#top" aria-label="${esc(c.name)}">${mark}${showText ? `<span class="brand__text"><strong>${esc(c.shortName || c.name)}</strong><small>${esc(t('brand.tagline'))}</small></span>` : ''}</a>`;
  }

  function navItems() {
    const f = EO.site.features;
    return [
      ['products', '#products', f.products !== false],
      ['materials', '#materials', f.materials],
      ['projects', '#projects', f.projects && projects().length > 0],
      ['about', '#about', true],
      ['faq', '#faq', f.faq && faqItems().length > 0],
      ['contact', '#contact', true]
    ].filter((x) => x[2]);
  }

  function langSwitch() {
    const list = EO.i18n.enabled;
    if (list.length < 2) return '';
    return `<div class="lang-switch" role="group" aria-label="${esc(t('nav.language'))}">${list.map((l) =>
      `<button type="button" data-lang="${l}" lang="${l}" aria-pressed="${l === EO.i18n.lang}" aria-label="${esc(EO.i18n.name(l))}">${l.toUpperCase()}</button>`).join('')}</div>`;
  }

  function renderHeader(menuOpen) {
    const items = navItems();
    const open = !!menuOpen;
    $('#headerMain').innerHTML = `${brand()}
      <nav class="primary-nav" aria-label="${esc(t('nav.main'))}"><ul>${items.map(([k, href]) => `<li><a href="${href}" data-nav="${k}">${esc(t('nav.' + k))}</a></li>`).join('')}</ul></nav>
      <div class="header-tools">${langSwitch()}
        <button class="btn btn--primary btn--sm" type="button" data-open-quote><span>${esc(t('btn.quote'))}</span>${arrow()}</button>
        <button class="menu-toggle" type="button" id="menuToggle" aria-expanded="${open}" aria-controls="mobileNav">${esc(open ? t('nav.close') : t('nav.menu'))}</button>
      </div>`;
    $('#mobileNav').innerHTML = `<div class="mobile-nav__inner"><ul>${items.map(([k, href]) => `<li><a href="${href}">${esc(t('nav.' + k))}${arrow()}</a></li>`).join('')}</ul>${langSwitch()}
      <button class="btn btn--primary" type="button" data-open-quote><span>${esc(t('btn.quote'))}</span>${arrow()}</button></div>`;
    $('#siteHeader').classList.toggle('is-open', open);

    const bar = $('#demoBar');
    if (demo()) {
      const sw = EO.site.features.presetSwitcher
        ? `<div class="preset-switch" role="group" aria-label="${esc(t('demo.preset'))}"><span class="preset-switch__label">${esc(t('demo.preset'))}</span>${EO.presets.map((p) => `<button type="button" data-preset="${p}" aria-pressed="${p === document.documentElement.dataset.preset}" aria-label="${esc(EO.presetNames[p])}"><span class="long" aria-hidden="true">${esc(EO.presetNames[p])}</span><span class="short" aria-hidden="true">${esc(EO.presetShort[p])}</span></button>`).join('')}</div>` : '';
      bar.innerHTML = `<div><b>${esc(t('demo.label'))}</b> <span>· ${esc(t('demo.notReal'))}</span></div>${sw}`;
      bar.hidden = false;
      document.documentElement.style.setProperty('--demo-bar-h', '2rem');
    } else {
      bar.hidden = true;
      document.documentElement.style.setProperty('--demo-bar-h', '0px');
    }
  }

  /* ---------- hero ---------- */
  function renderHero() {
    const h = EO.site.hero;
    const img = $('#heroImg');
    if (h.image && img.getAttribute('src') !== h.image) img.src = h.image;
    img.alt = tr(h.alt);
    $('#heroTags').innerHTML = categories().map((c) => `<li>${esc(tr(c.title))}</li>`).join('');
  }

  /* ---------- products ---------- */
  function pageFor(slug) {
    const p = EO.site.seo.pages && EO.site.seo.pages[slug];
    return p && p.enabled ? p.path : null;
  }

  function renderCategories() {
    $('#categoryGrid').innerHTML = categories().map((c, i) => {
      const inner = `${media(c.image, tr(c.alt) || tr(c.title), { overlay: `<span class="media-index" aria-hidden="true">${pad(i)}</span>` })}
        <span><span class="cat__title">${esc(tr(c.title))}</span><span class="cat__text" style="display:block;margin-top:.35rem">${esc(tr(c.tagline))}</span></span>${arrow()}`;
      const href = pageFor(c.pageSlug);
      return href
        ? `<a class="cat hover-zoom card-link reveal-item" style="--i:${i}" href="${esc(href)}">${inner}</a>`
        : `<button type="button" class="cat hover-zoom card-link reveal-item" style="--i:${i}" data-category="${esc(c.id)}">${inner}</button>`;
    }).join('');
  }

  function renderRange() {
    const f = EO.state.filter;
    const chip = (group, id, label, on) => `<button type="button" class="chip" data-filter="${group}:${esc(id)}" aria-pressed="${on}">${esc(label)}</button>`;
    $('#range').innerHTML = `
      <div class="range__head">
        <div class="range__filters">
          <div class="range__filter-row"><span class="label" id="fl-cat">${esc(t('products.category'))}</span>
            <div class="chips" role="group" aria-labelledby="fl-cat">${chip('category', 'all', t('products.all'), f.category === 'all')}${categories().map((c) => chip('category', c.id, tr(c.title), f.category === c.id)).join('')}</div></div>
          <div class="range__filter-row"><span class="label" id="fl-mat">${esc(t('products.material'))}</span>
            <div class="chips" role="group" aria-labelledby="fl-mat">${chip('material', 'all', t('products.all'), f.material === 'all')}${materials().map((m) => chip('material', m.id, tr(m.title), f.material === m.id)).join('')}</div></div>
        </div>
        <p class="range__count" id="rangeCount" role="status" aria-live="polite"></p>
      </div>
      <ul class="range-list" id="rangeList"></ul>`;
    updateRange();
  }

  function updateRange() {
    const f = EO.state.filter;
    $$('[data-filter]').forEach((b) => { const [g, id] = b.dataset.filter.split(':'); b.setAttribute('aria-pressed', String(f[g] === id)); });
    const matName = (id) => { const m = materials().find((x) => x.id === id); return m ? tr(m.title) : id; };
    const list = products().filter((p) => (f.category === 'all' || p.category === f.category) && (f.material === 'all' || (p.material || []).indexOf(f.material) > -1));
    $('#rangeCount').textContent = t('products.count', { n: list.length });
    $('#rangeList').innerHTML = list.length ? list.map((p, i) => {
      return `<li class="range-item">
        <div class="range-item__meta"><span>${pad(i)}</span><span>${esc((p.material || []).map(matName).join(' · '))}</span></div>
        <h3>${esc(tr(p.title))}</h3>
        <p>${esc(tr(p.description))}</p>
        <div class="range-item__foot">
          <ul class="range-item__features">${(p.features || []).slice(0, 2).map((x) => `<li>${esc(tr(x))}</li>`).join('')}</ul>
          <button type="button" class="link" data-configure="${esc(p.id)}"><span>${esc(t('btn.configure'))}</span>${arrow()}</button>
        </div></li>`;
    }).join('') : `<li class="range-empty">${esc(t('products.none'))}</li>`;
  }

  /* ---------- precision ---------- */
  const SPECS = ['thermal', 'acoustic', 'security', 'durability'];
  const ANNOS = [
    { id: 'glazing', x: '39%', y: '21%' },
    { id: 'thermalBreak', x: '48%', y: '50%' },
    { id: 'chambers', x: '57%', y: '66%' },
    { id: 'profile', x: '63%', y: '88%' }
  ];
  function renderPrecision() {
    const tech = EO.site.technical || {};
    const specs = tech.specs || {};
    const ann = tech.annotations || {};
    $('#specList').innerHTML = SPECS.map((k, i) => `<li class="spec reveal-item" style="--i:${i}"><span class="spec__icon">${ICON[k]}</span><span><span class="spec__title" style="display:block">${esc(t('precision.' + k))}</span><span class="spec__value">${esc(specs[k] || t('precision.' + k + 'Generic'))}</span></span></li>`).join('');
    const label = (a) => ({ title: t('precision.' + a.id), value: ann[a.id] || t('precision.' + a.id + 'Generic') });
    $('#tech').innerHTML = `<div class="tech__plate">${media(tech.image, t('precision.alt'), { ratio: '1300 / 1250', sizes: '(min-width: 960px) 46vw, 100vw' })}
      <ol class="anno-list" aria-hidden="true">${ANNOS.map((a, i) => { const l = label(a); return `<li class="anno" style="--x:${a.x};--y:${a.y}"><span class="anno__dot">${i + 1}</span><span class="anno__line"></span><span class="anno__label"><b>${esc(l.title)}</b>${l.value ? `<small>${esc(l.value)}</small>` : ''}</span></li>`; }).join('')}</ol></div>
      <ol class="anno-legend" aria-label="${esc(t('precision.legend'))}">${ANNOS.map((a) => { const l = label(a); return `<li><span><b>${esc(l.title)}</b>${esc(l.value)}</span></li>`; }).join('')}</ol>`;
  }

  /* ---------- projects ---------- */
  function renderProjects() {
    const list = projects();
    const show = EO.site.features.projects && list.length > 0;
    setSection('projects', show);
    if (!show) return;
    const featured = list.filter((p) => p.featured !== false).slice(0, 3);
    $('#projectGrid').innerHTML = featured.map((p, i) => {
      const img = (p.images || [])[0];
      const isDemo = demo() || p.demo;
      const sub = [tr(p.category), p.location].filter(Boolean).join(' · ');
      return `<button type="button" class="project hover-zoom reveal-item" style="--i:${i}" data-project="${esc(p.id)}" aria-label="${esc(t('projects.open'))}: ${esc(tr(p.title))}">
        ${media(img, tr(asImg(img).alt) || tr(p.title), { overlay: `<span class="media-index" aria-hidden="true">${pad(i)}</span>${isDemo ? `<span class="badge badge--on-media">${esc(t('demo.sample'))}</span>` : ''}` })}
        <span class="project__meta"><span><span class="project__title">${esc(tr(p.title))}</span><span class="project__sub" style="display:block">${esc(sub)}</span></span>${arrow()}</span></button>`;
    }).join('');
    const anyDemo = demo() || list.some((p) => p.demo);
    $('#projectsFoot').innerHTML = `<p class="projects__note">${anyDemo ? esc(t('projects.demoText')) : ''}</p>
      <button type="button" class="link" data-gallery-all><span>${esc(t('btn.viewAll'))}</span>${arrow()}</button>`;
  }

  /* ---------- materials ---------- */
  function renderMaterials() {
    const list = materials();
    const show = EO.site.features.materials && list.length > 0;
    setSection('materials', show);
    if (!show) return;
    $('#materialGrid').innerHTML = list.map((m, i) => {
      const fin = m.finishes || [];
      const cur = EO.state.finish[m.id] || (fin[0] && fin[0].id);
      const curFin = fin.find((f) => f.id === cur);
      return `<article class="material reveal-item" style="--i:${i}">
        <div class="swatch-strip" role="group" aria-label="${esc(t('materials.finishes'))}: ${esc(tr(m.title))}">${fin.map((f) => `<button type="button" class="swatch" style="--sw:${esc(f.color)}" data-swatch="${esc(m.id)}:${esc(f.id)}" aria-pressed="${f.id === cur}" aria-label="${esc(tr(f.name))}" title="${esc(tr(f.name))}"></button>`).join('')}</div>
        <p class="material__caption" aria-live="polite">${esc(t('materials.swatchLabel'))} — ${esc(curFin ? tr(curFin.name) : '')}</p>
        <div><h3 class="material__title">${esc(tr(m.title))}</h3><p class="material__sub">${esc(tr(m.subtitle))}</p></div>
        <p class="material__desc">${esc(tr(m.description))}</p>
        <ul class="material__features">${(m.features || []).map((x) => `<li>${esc(tr(x))}</li>`).join('')}</ul>
        ${EO.site.features.configurator ? `<button type="button" class="link" data-configure-material="${esc(m.id)}"><span>${esc(t('materials.configureWith', { material: tr(m.title) }))}</span>${arrow()}</button>` : ''}
      </article>`;
    }).join('');
  }

  /* ---------- about / manufacturers / faq ---------- */
  function renderAbout() {
    $('#aboutText').textContent = t('about.text') + (demo() ? ' ' + t('about.demoNote') : '');
    const steps = t('about.steps');
    $('#process').innerHTML = (Array.isArray(steps) ? steps : []).map((s, i) => `<li class="reveal-item" style="--i:${i}"><span class="n">${pad(i)}</span><div><h3>${esc(s.title)}</h3><p>${esc(s.text)}</p></div></li>`).join('');
  }

  function renderManufacturers() {
    const list = manufacturers();
    const show = EO.site.features.manufacturers && list.length > 0;
    setSection('manufacturers', show);
    if (!show) return;
    $('#logoRow').innerHTML = list.map((m) => {
      const img = `<img src="${esc(m.logo)}" alt="${esc(m.name)}" loading="lazy" decoding="async">`;
      return m.url ? `<a href="${esc(m.url)}" target="_blank" rel="noopener">${img}</a>` : `<span>${img}</span>`;
    }).join('');
  }

  function renderFaq() {
    const list = faqItems();
    const show = EO.site.features.faq && list.length > 0;
    setSection('faq', show);
    if (!show) return;
    const open = EO.state.faqOpen;
    $('#accordion').innerHTML = list.map((f) => `<div class="accordion__item"><h3><button type="button" class="accordion__trigger" id="faq-t-${esc(f.id)}" aria-expanded="${open === f.id}" aria-controls="faq-p-${esc(f.id)}"><span>${esc(tr(f.question))}</span><span class="accordion__icon" aria-hidden="true"></span></button></h3>
      <div class="accordion__panel${open === f.id ? ' is-open' : ''}" id="faq-p-${esc(f.id)}" role="region" aria-labelledby="faq-t-${esc(f.id)}"><div><p>${esc(tr(f.answer))}</p></div></div></div>`).join('');
  }

  /* ---------- cta ---------- */
  function renderCta() {
    const img = $('#ctaImg');
    const src = EO.site.cta && EO.site.cta.image;
    if (src && img.getAttribute('src') !== src) img.src = src;
    img.alt = t('cta.alt');
    $('#ctaDemoNote').hidden = !demo();
  }

  /* ---------- footer ---------- */
  function renderFooter() {
    const s = EO.site, c = s.contact || {}, co = s.company;
    const ph = `<span class="placeholder">${esc(t('demo.contactPlaceholder'))}</span>`;
    const countryName = (code) => { const o = (db().options.countries || []).find((x) => x.id === code); return o ? tr(o.title) : code; };
    const row = (key, value, href) => {
      if (value) return `<li><span class="k">${esc(t('footer.' + key))}</span>${href ? `<a href="${esc(href)}">${esc(value)}</a>` : esc(value)}</li>`;
      return demo() ? `<li><span class="k">${esc(t('footer.' + key))}</span>${ph}</li>` : '';
    };
    const wa = c.whatsapp ? `https://wa.me/${String(c.whatsapp).replace(/\D/g, '')}` : '';
    const area = (c.serviceArea || []).map(countryName).join(', ');
    const contact = [
      row('phone', c.phone, c.phone && `tel:${c.phone.replace(/[^\d+]/g, '')}`),
      row('email', c.email, c.email && `mailto:${c.email}`),
      row('whatsapp', c.whatsapp, wa),
      row('address', c.address),
      row('service', demo() ? '' : area)
    ].join('');
    const social = s.social || {};
    const socialLinks = ['instagram', 'linkedin', 'youtube'].filter((k) => social[k]).map((k) => `<li><span class="social"><a href="${esc(social[k])}" target="_blank" rel="noopener" aria-label="${k}">${ICON[k]}</a></span></li>`).join('');
    const nav = navItems().filter(([k]) => k !== 'contact');
    const legal = s.legal || {};
    const legalLinks = ['privacy', 'terms', 'cookies'].filter((k) => legal[k]).map((k) => `<li><a href="${esc(legal[k])}">${esc(t('footer.' + k))}</a></li>`).join('');
    const blurb = demo() ? t('footer.text') : tr(co.description);
    $('#footerInner').innerHTML = `
      <div class="footer__grid">
        <div class="footer__brand">${brand()}<p>${esc(blurb)}</p>
          ${demo() ? `<span class="footer__demo"><b>${esc(t('demo.label'))}</b>${esc(t('demo.notReal'))}</span>` : ''}</div>
        <div class="footer__col"><h2>${esc(t('footer.products'))}</h2><ul>${categories().map((cat) => `<li><a href="#products" data-category="${esc(cat.id)}">${esc(tr(cat.title))}</a></li>`).join('')}</ul></div>
        <div class="footer__col"><h2>${esc(t('footer.company'))}</h2><ul>${nav.map(([k, href]) => `<li><a href="${href}">${esc(t('nav.' + k))}</a></li>`).join('')}<li><a href="#contact" data-open-quote>${esc(t('btn.quote'))}</a></li></ul></div>
        <div class="footer__col footer__col--contact"><h2>${esc(t('footer.contact'))}</h2><ul>${contact}</ul></div>
        <div class="footer__col"><h2>${esc(t('footer.follow'))}</h2><ul>${socialLinks || (demo() ? `<li>${ph}</li>` : '')}</ul></div>
      </div>
      <div class="footer__bottom"><p>© ${new Date().getFullYear()} ${esc(co.legalName || co.name)}. ${esc(t('footer.rights'))}${demo() ? ' ' + esc(t('footer.demoNote')) : ''}</p>
        ${legalLinks ? `<ul>${legalLinks}</ul>` : ''}${langSwitch()}</div>`;
  }

  function fillArrows(root = document) { $$('[data-arrow]', root).forEach((el) => { el.innerHTML = ICON.arrow; el.setAttribute('aria-hidden', 'true'); }); }

  EO.ui = { esc, media, ICON, arrow, asImg, pad, $, $$, t, tr };
  EO.data = { categories, materials, products, projects, faqItems, manufacturers };

  EO.render = {
    all(menuOpen) {
      renderHeader(menuOpen); renderHero(); renderCategories(); renderRange(); renderPrecision();
      renderProjects(); renderMaterials();
      setSection('configurator', !!EO.site.features.configurator);
      if (EO.site.features.configurator) EO.configurator.render();
      renderAbout(); renderManufacturers(); renderFaq(); renderCta(); renderFooter();
      const products = $('#products'); if (products) products.hidden = EO.site.features.products === false;
      EO.i18n.apply(); fillArrows();
    },
    header: renderHeader, updateRange, renderMaterials, renderFaq, fillArrows
  };
})();
