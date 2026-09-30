/*
 * Templates: pure "data → HTML string" functions for the whole page.
 * They run in the browser (hydration / admin preview) AND in Node (tools/build.js) — so the HTML that
 * crawlers receive is produced by exactly the same code as the interactive page. No DOM access here.
 */
(function () {
  'use strict';
  const EO = window.EO;
  EO.state = EO.state || {
    filter: { category: 'all', material: 'all' }, finish: {}, faqOpen: null, step: 0,
    configuratorState: { product: null, material: null, finish: null, glass: null, projectType: null }
  };
  const t = (k, v) => EO.i18n.t(k, v);
  const tr = (o) => EO.i18n.tr(o);
  const $ = (s, r) => (r || document).querySelector(s);
  const $$ = (s, r) => Array.from((r || document).querySelectorAll(s));
  const ESC = { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' };
  const esc = (s) => String(s == null ? '' : s).replace(/[&<>"']/g, (c) => ESC[c]);
  const pad = (n) => String(n + 1).padStart(2, '0');
  const asset = (p) => EO.asset(p);

  const ICON = {
    arrow: '<svg viewBox="0 0 22 16" fill="none" stroke="currentColor" stroke-width="1.2" aria-hidden="true"><path d="M0 8h20M14 1.5 20.5 8 14 14.5"/></svg>',
    left: '<svg viewBox="0 0 22 16" fill="none" stroke="currentColor" stroke-width="1.2" aria-hidden="true"><path d="M22 8H2M8 1.5 1.5 8 8 14.5"/></svg>',
    thermal: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.1" aria-hidden="true"><rect x="4" y="3" width="16" height="18"/><path d="M4 12h16M12 3v18"/></svg>',
    acoustic: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.1" aria-hidden="true"><path d="M4 9h4l5-4v14l-5-4H4zM16 9c1.4 1.6 1.4 4.4 0 6M19 6.5c2.6 3 2.6 8 0 11"/></svg>',
    security: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.1" aria-hidden="true"><path d="M12 3 4.5 6v5.5c0 4.6 3.2 8 7.5 9.5 4.300-1.500 7.500-4.900 7.500-9.500V6zM9 12l2.200 2.200L15.500 10"/></svg>',
    durability: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.1" aria-hidden="true"><path d="M12 3v3M12 18v3M3 12h3M18 12h3M5.6 5.6l2.1 2.100M16.300 16.300l2.100 2.100M5.600 18.400l2.100-2.100M16.300 7.700l2.100-2.100"/><circle cx="12" cy="12" r="3.200"/></svg>',
    instagram: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.4" aria-hidden="true"><rect x="3.5" y="3.5" width="17" height="17" rx="4.5"/><circle cx="12" cy="12" r="4"/><circle cx="17.200" cy="6.800" r=".8" fill="currentColor"/></svg>',
    linkedin: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.4" aria-hidden="true"><rect x="3.5" y="3.5" width="17" height="17"/><path d="M8 10.500V16M8 8v.01M11.500 16v-5.500M11.500 13c0-1.600 1-2.500 2.300-2.500S16 11.400 16 13v3"/></svg>',
    youtube: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.4" aria-hidden="true"><rect x="3" y="6" width="18" height="12" rx="3.500"/><path d="m10.300 9.500 4 2.500-4 2.500z" fill="currentColor"/></svg>'
  };
  const arrow = () => `<span class="arrow" aria-hidden="true">${ICON.arrow}</span>`;

  /* ---------- images ---------- */
  const asImg = (i) => (typeof i === 'string' ? { src: i } : i || {});
  const assetSet = (set) => String(set).split(',').map((p) => { const [u, d] = p.trim().split(/\s+/); return `${asset(u)}${d ? ' ' + d : ''}`; }).join(', ');

  /** <picture> with AVIF/WebP sources, optional mobile art direction, srcset/sizes, lazy or eager. */
  function picture(image, alt, o = {}) {
    const i = asImg(image);
    if (!i.src) return '';
    const sizes = o.sizes ? ` sizes="${esc(o.sizes)}"` : '';
    const src = (s, media) => `<source${media ? ` media="${media}"` : ''}${s.type ? ` type="${s.type}"` : ''} srcset="${esc(assetSet(s.srcset || s.src))}"${sizes}>`;
    let out = '';
    if (o.mobile && o.mobile.src) {
      const m = asImg(o.mobile);
      (m.sources || []).forEach((s) => { out += src(s, '(max-width: 640px)'); });
      out += src({ srcset: m.srcset || m.src }, '(max-width: 640px)');
    }
    (i.sources || []).forEach((s) => { out += src(s); });
    const wh = i.width && i.height ? ` width="${i.width}" height="${i.height}"` : '';
    const style = o.focal ? ` style="object-position:${esc(o.focal)}"` : '';
    const img = `<img src="${esc(asset(i.src))}"${i.srcset ? ` srcset="${esc(assetSet(i.srcset))}"` : ''}${sizes} alt="${esc(alt)}"${wh}${style} loading="${o.eager || o.load === 'eager' ? 'eager' : 'lazy'}" decoding="async"${o.eager ? ' fetchpriority="high"' : ''}>`;
    return out ? `<picture>${out}${img}</picture>` : img;
  }
  function media(image, alt, o = {}) {
    const ratio = o.ratio ? ` style="--ratio:${o.ratio}"` : '';
    const inner = picture(image, alt, o);
    return `<span class="media"${ratio}>${inner}${inner ? (o.overlay || '') : ''}</span>`;
  }

  /* ---------- data helpers ---------- */
  const demo = () => !!EO.site.demoMode;
  const db = () => EO.db;
  const active = (list) => (list || []).filter((x) => x.active !== false);
  const categories = () => active(db().categories);
  const materials = () => active(db().materials);
  const products = () => active(db().products);
  const projects = () => active(db().projects).filter((p) => demo() || !p.demo);
  const faqItems = () => active(db().faq);
  const manufacturers = () => (demo() ? [] : active(db().manufacturers));
  const reveal = (i) => `class="reveal-item" style="--i:${i}"`;
  const feat = () => EO.site.features || {};

  /* ---------- brand / header ---------- */
  function brand(cls = '') {
    const c = EO.site.company;
    const mono = c.logoMono !== false;
    const mark = c.logo ? (mono ? '<span class="brand__mark" aria-hidden="true"></span>' : `<img class="brand__img" src="${esc(asset(c.logo))}" alt="" width="128" height="32">`) : '';
    const text = mono || !c.logo ? `<span class="brand__text"><strong>${esc(c.shortName || c.name)}</strong><small>${esc(t('brand.tagline'))}</small></span>` : '';
    return `<a class="brand ${cls}" href="${esc(EO.root || './')}" aria-label="${esc(c.name)}">${mark}${text}</a>`;
  }

  function navItems() {
    const f = feat();
    return [
      ['products', '#products', f.products !== false],
      ['materials', '#materials', f.materials && materials().length > 0],
      ['projects', '#projects', f.projects && projects().length > 0],
      ['about', '#about', true],
      ['faq', '#faq', f.faq && faqItems().length > 0],
      ['contact', '#contact', true]
    ].filter((x) => x[2]);
  }

  const langHref = (l) => `${EO.root}${l}/`;
  function langSwitch() {
    const list = EO.i18n.enabled;
    if (list.length < 2) return '';
    return `<div class="lang-switch" role="group" aria-label="${esc(t('nav.language'))}">${list.map((l) =>
      `<a href="${esc(langHref(l))}" hreflang="${l}" lang="${l}" data-lang="${l}"${l === EO.i18n.lang ? ' aria-current="true"' : ''} aria-label="${esc(EO.i18n.name(l))}">${l.toUpperCase()}</a>`).join('')}</div>`;
  }

  function headerInner() {
    const items = navItems();
    const bar = demo() ? `<div class="demo-bar" id="demoBar"><div><b>${esc(t('demo.label'))}</b> <span>· ${esc(t('demo.notReal'))}</span></div>${feat().presetSwitcher
      ? `<label class="preset-select"><span class="preset-switch__label">${esc(t('demo.preset'))}</span><select data-preset-select aria-label="${esc(t('demo.preset'))}">${EO.presets.map((p) => `<option value="${p}"${p === EO.presetOf() ? ' selected' : ''}>${esc(EO.presetNames[p])}</option>`).join('')}</select></label>` : ''}</div>` : '';
    return `${bar}
      <div class="container header-main">${brand()}
        <nav class="primary-nav" aria-label="${esc(t('nav.main'))}"><ul>${items.map(([k, href]) => `<li><a href="${href}" data-nav="${k}">${esc(t('nav.' + k))}</a></li>`).join('')}</ul></nav>
        <div class="header-tools">${langSwitch()}
          <button class="btn btn--primary btn--sm" type="button" data-open-quote><span>${esc(t('btn.quote'))}</span>${arrow()}</button>
          <button class="menu-toggle" type="button" id="menuToggle" aria-expanded="false" aria-controls="mobileNav"><span class="menu-toggle__label">${esc(t('nav.menu'))}</span></button>
        </div></div>
      <nav class="mobile-nav" id="mobileNav" aria-label="${esc(t('nav.main'))}"><div class="mobile-nav__inner">
        <ul>${items.map(([k, href]) => `<li><a href="${href}">${esc(t('nav.' + k))}${arrow()}</a></li>`).join('')}</ul>
        <div class="mobile-nav__foot">${langSwitch()}<button class="btn btn--primary" type="button" data-open-quote><span>${esc(t('btn.quote'))}</span>${arrow()}</button></div></div></nav>`;
  }

  /* ---------- hero ---------- */
  function hero() {
    const h = EO.site.hero;
    const cats = categories();
    return `<section class="hero on-photo" id="top" aria-labelledby="hero-title">
      <div class="hero__media" id="heroMedia">${picture(h.image, tr(h.alt), { eager: true, sizes: '100vw', focal: h.focal, mobile: h.imageMobile })}</div>
      <div class="container hero__inner">
        <div class="hero__content">
          <p class="eyebrow">${esc(t('hero.eyebrow'))}</p>
          <h1 class="display-xl" id="hero-title">${esc(t('hero.title'))}</h1>
          <p class="hero__text">${esc(t('hero.text'))}</p>
          <div class="hero__actions">
            <a class="btn btn--primary" href="#products"><span>${esc(t('btn.explore'))}</span>${arrow()}</a>
            <button class="btn btn--ghost" type="button" data-open-quote><span>${esc(t('btn.quote'))}</span></button>
          </div>
        </div>
        <ul class="hero__tags">${cats.map((c) => `<li>${esc(tr(c.title))}</li>`).join('')}</ul>
      </div></section>`;
  }

  /* ---------- products ---------- */
  const pageFor = (slug) => { const p = EO.site.seo.pages && EO.site.seo.pages[slug]; return p && p.enabled ? p.path : null; };

  function categoryGrid() {
    return categories().map((c, i) => {
      const inner = `${media(c.image, tr(c.alt) || tr(c.title), { focal: c.preview && c.preview.position, overlay: `<span class="media-index" aria-hidden="true">${pad(i)}</span>`, sizes: '(min-width: 961px) 24vw, (min-width: 641px) 46vw, 76vw' })}
        <span class="cat__body"><span class="cat__title">${esc(tr(c.title))}</span><span class="cat__text">${esc(tr(c.tagline))}</span></span>${arrow()}`;
      const href = pageFor(c.pageSlug);
      return href
        ? `<a class="cat hover-zoom card-link reveal-item" style="--i:${i}" href="${esc(href)}">${inner}</a>`
        : `<button type="button" class="cat hover-zoom card-link reveal-item" style="--i:${i}" data-category="${esc(c.id)}">${inner}</button>`;
    }).join('');
  }

  const matName = (id) => { const m = materials().find((x) => x.id === id); return m ? tr(m.title) : id; };
  const rangeCount = (n) => (n === 1 ? t('products.countOne') : t('products.count', { n }));
  function filteredProducts() {
    const f = EO.state.filter;
    return products().filter((p) => (f.category === 'all' || p.category === f.category) && (f.material === 'all' || (p.material || []).indexOf(f.material) > -1));
  }
  function rangeListHtml() {
    const list = filteredProducts();
    return list.length ? list.map((p, i) => `<li class="range-item">
        <div class="range-item__meta"><span>${pad(i)}</span><span>${esc((p.material || []).map(matName).join(' · '))}</span></div>
        <h3>${esc(tr(p.title))}</h3>
        <p>${esc(tr(p.description))}</p>
        <div class="range-item__foot">
          <ul class="range-item__features">${(p.features || []).slice(0, 2).map((x) => `<li>${esc(tr(x))}</li>`).join('')}</ul>
          <button type="button" class="link" data-configure="${esc(p.id)}"><span>${esc(t('btn.configure'))}</span>${arrow()}</button>
        </div></li>`).join('') : `<li class="range-empty">${esc(t('products.none'))}</li>`;
  }
  function rangeHtml() {
    const f = EO.state.filter;
    const chip = (group, id, label) => `<button type="button" class="chip" data-filter="${group}:${esc(id)}" aria-pressed="${f[group] === id}">${esc(label)}</button>`;
    return `<div class="range__head">
        <div class="range__filters">
          <div class="range__filter-row"><span class="label" id="fl-cat">${esc(t('products.category'))}</span>
            <div class="chips" role="group" aria-labelledby="fl-cat">${chip('category', 'all', t('products.all'))}${categories().map((c) => chip('category', c.id, tr(c.title))).join('')}</div></div>
          <div class="range__filter-row"><span class="label" id="fl-mat">${esc(t('products.material'))}</span>
            <div class="chips" role="group" aria-labelledby="fl-mat">${chip('material', 'all', t('products.all'))}${materials().map((m) => chip('material', m.id, tr(m.title))).join('')}</div></div>
        </div>
        <p class="range__count" id="rangeCount" role="status" aria-live="polite">${esc(rangeCount(filteredProducts().length))}</p>
      </div>
      <ul class="range-list" id="rangeList">${rangeListHtml()}</ul>`;
  }

  function productsSection() {
    if (feat().products === false) return '';
    return `<section class="section section--lg theme-light" id="products" aria-labelledby="products-title"><div class="container">
      <div class="section-head" data-reveal><div><p class="eyebrow">${esc(t('products.eyebrow'))}</p><h2 class="display-lg" id="products-title">${esc(t('products.title'))}</h2></div>
        <p class="section-head__text">${esc(t('products.text'))}</p></div>
      <div class="category-grid" id="categoryGrid" data-reveal>${categoryGrid()}</div>
      <div class="range" id="range" data-reveal>${rangeHtml()}</div></div></section>`;
  }

  /* ---------- precision / engineering ---------- */
  const SPECS = ['thermal', 'acoustic', 'security', 'durability'];
  const ANNO_FALLBACK = [
    { id: 'glazing', anchor: { x: 64, y: 26.7 } }, { id: 'thermalBreak', anchor: { x: 54.7, y: 51.3 } },
    { id: 'chambers', anchor: { x: 64.4, y: 73.3 } }, { id: 'profile', anchor: { x: 49.2, y: 92.9 } }
  ];
  const num = (v) => (Number.isFinite(Number(v)) ? Number(v) : 0);
  const sign = (v) => (v > 0 ? 1 : v < 0 ? -1 : 0);

  /**
   * Exploded view of the profile section. Layers are aligned transparent images on one canvas; each layer owns its
   * annotation dot + line, so anchors travel with the layer. Offsets are design px at an 800px-wide plate (scaled with
   * container units), mobile offsets are real px. Without layers it degrades to the static photo + fixed dots.
   */
  function profileFigure(tech) {
    const P = EO.site.technicalProfile || {};
    const ann = tech.annotations || {};
    const layers = (P.layers || []).filter((l) => l && l.image && asImg(l.image).src);
    const animate = P.animation !== false && layers.length > 0;
    const canvas = P.canvas || { width: 1800, height: 1200 };
    const base = animate && P.base && asImg(P.base).src ? P.base : tech.image;
    const items = (P.annotations && P.annotations.length ? P.annotations : ANNO_FALLBACK)
      .map((a, i) => ({ ...a, n: i + 1, title: t('precision.' + a.id), value: ann[a.id] || t('precision.' + a.id + 'Generic') }));
    const labelX = num(P.labelX) || 75;
    const layerOf = (id) => layers.find((l) => l.id === id);
    const off = (l, k) => ({ x: num(l && l[k] && l[k].x), y: num(l && l[k] && l[k].y) });
    const anchorHtml = (a) => `<span class="pev__dot" style="left:${a.anchor.x}%;top:${a.anchor.y}%" aria-hidden="true"><i>${a.n}</i></span>
        <svg class="pev__line" style="left:${a.anchor.x}%;top:${a.anchor.y}%;--reach:${Math.max(4, labelX - a.anchor.x - 1)};--i:${a.n - 1}" viewBox="0 0 100 2" preserveAspectRatio="none" aria-hidden="true" focusable="false"><line x1="0" y1="1" x2="100" y2="1" pathLength="1"/></svg>`;
    const timeline = layers.map((l) => (num(l.start) || 300) + (num(l.duration) || 600));
    const explodeMs = Math.max(600, Math.max(0, ...timeline) - 300);

    const layerHtml = animate
      ? layers.map((l, z) => {
        const d = off(l, 'desktopOffset'), m = off(l, 'mobileOffset');
        const mine = items.filter((a) => a.layer === l.id).map(anchorHtml).join('');
        return `<div class="pev__layer" data-layer="${esc(l.id)}" style="--z:${z + 1};--ddx:${d.x};--ddy:${d.y};--mdx:${m.x};--mdy:${m.y};--hx:${sign(d.x) * 5}px;--hy:${sign(d.y) * 5}px;--delay:${Math.max(0, (num(l.start) || 300) - 300)}ms;--dur:${num(l.duration) || 600}ms" aria-hidden="true">${picture(l.image, '', { sizes: '(min-width: 961px) 50vw, 100vw' })}${mine}</div>`;
      }).join('')
      : `<div class="pev__layer pev__layer--fixed" style="--z:1" aria-hidden="true">${items.map(anchorHtml).join('')}</div>`;

    const labelHtml = items.map((a) => {
      const d = off(layerOf(a.layer), 'desktopOffset');
      return `<li class="pev__label" data-layer="${esc(a.layer || '')}" style="--x:${labelX}%;--y:${a.anchor.y}%;--ddy:${d.y};--i:${a.n - 1}"><b>${esc(a.title)}</b>${a.value ? `<small>${esc(a.value)}</small>` : ''}</li>`;
    }).join('');

    return `<figure class="tech pev${animate ? '' : ' is-static'}" id="tech" data-pev="${animate ? 1 : 0}" data-explode-ms="${explodeMs}">
        <div class="pev__plate" style="--ratio:${canvas.width} / ${canvas.height}">
          <div class="pev__stage"><div class="pev__base">${picture(base, t('precision.alt'), { sizes: '(min-width: 961px) 50vw, 100vw' })}</div>${layerHtml}</div>
          <ol class="pev__labels">${labelHtml}</ol>
        </div>
        <ol class="anno-legend" aria-label="${esc(t('precision.legend'))}">${items.map((a) => `<li><span><b>${esc(a.title)}</b>${esc(a.value)}</span></li>`).join('')}</ol>
      </figure>`;
  }

  function precisionSection() {
    const tech = EO.site.technical || {};
    const specs = tech.specs || {};
    return `<section class="section section--lg theme-dark precision" id="precision" aria-labelledby="precision-title"><div class="container precision__grid">
      <div class="precision__copy" data-reveal>
        <p class="eyebrow">${esc(t('precision.eyebrow'))}</p>
        <h2 class="display-lg" id="precision-title">${esc(t('precision.title'))}</h2>
        <p class="lead">${esc(t('precision.text'))}</p>
        <ul class="spec-list">${SPECS.map((k, i) => `<li class="spec reveal-item" style="--i:${i}"><span class="spec__icon">${ICON[k]}</span><span><span class="spec__title">${esc(t('precision.' + k))}</span><span class="spec__value">${esc(specs[k] || t('precision.' + k + 'Generic'))}</span></span></li>`).join('')}</ul>
      </div>
      ${profileFigure(tech)}
    </div></section>`;
  }

  /* ---------- projects ---------- */
  function projectsSection() {
    const list = projects();
    if (!feat().projects || !list.length) return '';
    const featured = list.filter((p) => p.featured !== false).slice(0, 3);
    const anyDemo = demo() || list.some((p) => p.demo);
    return `<section class="section theme-light" id="projects" aria-labelledby="projects-title"><div class="container">
      <div class="section-head" data-reveal><div><p class="eyebrow">${esc(t('projects.eyebrow'))}</p><h2 class="display-lg" id="projects-title">${esc(t('projects.title'))}</h2></div>
        <div class="section-head__intro"><p class="section-head__text">${esc(demo() ? t('projects.textDemo') : t('projects.text'))}</p></div></div>
      <div class="project-grid" id="projectGrid" data-reveal>${featured.map((p, i) => {
        const img = (p.images || [])[0];
        const isDemo = demo() || p.demo;
        const sub = [tr(p.category), p.location].filter(Boolean).join(' · ');
        return `<button type="button" class="project hover-zoom reveal-item" style="--i:${i}" data-project="${esc(p.id)}" aria-label="${esc(t('projects.open'))}: ${esc(tr(p.title))}">
          ${media(img, tr(asImg(img).alt) || tr(p.title), { overlay: `<span class="media-index" aria-hidden="true">${pad(i)}</span>${isDemo ? `<span class="badge badge--on-media">${esc(t('demo.sample'))}</span>` : ''}`, sizes: i === 0 ? '(min-width: 961px) 42vw, 76vw' : '(min-width: 961px) 27vw, 76vw' })}
          <span class="project__meta"><span><span class="project__title">${esc(tr(p.title))}</span><span class="project__sub">${esc(sub)}</span></span>${arrow()}</span></button>`;
      }).join('')}</div>
      <div class="projects__foot"><p class="projects__note">${anyDemo ? esc(t('projects.demoText')) : ''}</p>
        <button type="button" class="link" data-gallery-all><span>${esc(t('btn.viewAll'))}</span>${arrow()}</button></div></div></section>`;
  }

  /* ---------- materials ---------- */
  function materialsGrid() {
    return materials().map((m, i) => {
      const fin = m.finishes || [];
      const cur = EO.state.finish[m.id] || (fin[0] && fin[0].id);
      const curFin = fin.find((f) => f.id === cur);
      return `<article class="material reveal-item" style="--i:${i}">
        <div class="swatch-strip" role="group" aria-label="${esc(t('materials.finishes'))}: ${esc(tr(m.title))}">${fin.map((f) => `<button type="button" class="swatch" style="--sw:${esc(f.color)}" data-swatch="${esc(m.id)}:${esc(f.id)}" aria-pressed="${f.id === cur}" aria-label="${esc(tr(m.title))} — ${esc(tr(f.name))}" title="${esc(tr(f.name))}"></button>`).join('')}</div>
        <p class="material__caption" aria-live="polite">${esc(t('materials.swatchLabel'))} — ${esc(curFin ? tr(curFin.name) : '')}</p>
        <div><h3 class="material__title">${esc(tr(m.title))}</h3><p class="material__sub">${esc(tr(m.subtitle))}</p></div>
        <p class="material__desc">${esc(tr(m.description))}</p>
        <ul class="material__features">${(m.features || []).map((x) => `<li>${esc(tr(x))}</li>`).join('')}</ul>
        ${feat().configurator ? `<button type="button" class="link" data-configure-material="${esc(m.id)}"><span>${esc(t('materials.configureWith', { material: tr(m.title) }))}</span>${arrow()}</button>` : ''}
      </article>`;
    }).join('');
  }
  function materialsSection() {
    if (!feat().materials || !materials().length) return '';
    return `<section class="section section--lg theme-dark" id="materials" aria-labelledby="materials-title"><div class="container">
      <div class="section-head" data-reveal><div><p class="eyebrow">${esc(t('materials.eyebrow'))}</p><h2 class="display-lg" id="materials-title">${esc(t('materials.title'))}</h2></div>
        <p class="section-head__text">${esc(t('materials.text'))}</p></div>
      <div class="material-grid" id="materialGrid" data-reveal>${materialsGrid()}</div></div></section>`;
  }

  /* ---------- configurator (markup lives in configurator.js) ---------- */
  function configuratorSection() {
    if (!feat().configurator) return '';
    return `<section class="section theme-light" id="configurator" aria-labelledby="config-title"><div class="container">
      <div class="section-head" data-reveal><div><p class="eyebrow">${esc(t('config.eyebrow'))}</p><h2 class="display-lg" id="config-title">${esc(t('config.title'))}</h2></div>
        <p class="section-head__text">${esc(t('config.text'))}</p></div>
      <div class="config" id="config" data-reveal>${EO.configurator.markup()}</div></div></section>`;
  }

  /* ---------- about / manufacturers / faq / cta ---------- */
  function aboutSection() {
    const steps = t('about.steps');
    return `<section class="section theme-dark" id="about" aria-labelledby="about-title"><div class="container about__grid">
      <div class="about__copy" data-reveal><p class="eyebrow">${esc(t('about.eyebrow'))}</p><h2 class="display-lg" id="about-title">${esc(t('about.title'))}</h2>
        <p class="lead">${esc(demo() ? t('about.textDemo') : t('about.text'))}</p></div>
      <ol class="process" id="process" data-reveal>${(Array.isArray(steps) ? steps : []).map((s, i) => `<li class="reveal-item" style="--i:${i}"><span class="n">${pad(i)}</span><div><h3>${esc(s.title)}</h3><p>${esc(s.text)}</p></div></li>`).join('')}</ol>
    </div></section>`;
  }

  function manufacturersSection() {
    const list = manufacturers();
    if (!feat().manufacturers || !list.length) return '';
    return `<section class="section section--sm theme-light" id="manufacturers" aria-labelledby="manufacturers-title"><div class="container" data-reveal>
      <p class="eyebrow">${esc(t('manufacturers.eyebrow'))}</p><h2 class="display-md" id="manufacturers-title">${esc(t('manufacturers.title'))}</h2>
      <div class="logo-row">${list.map((m) => { const img = `<img src="${esc(asset(m.logo))}" alt="${esc(m.name)}" loading="lazy" decoding="async">`; return m.url ? `<a href="${esc(m.url)}" target="_blank" rel="noopener">${img}</a>` : `<span>${img}</span>`; }).join('')}</div></div></section>`;
  }

  function faqSection() {
    const list = faqItems();
    if (!feat().faq || !list.length) return '';
    const open = EO.state.faqOpen;
    return `<section class="section theme-light" id="faq" aria-labelledby="faq-title"><div class="container faq__grid">
      <div data-reveal><p class="eyebrow">${esc(t('faq.eyebrow'))}</p><h2 class="display-lg" id="faq-title">${esc(t('faq.title'))}</h2></div>
      <div class="accordion" id="accordion" data-reveal>${list.map((f) => `<div class="accordion__item"><h3><button type="button" class="accordion__trigger" id="faq-t-${esc(f.id)}" aria-expanded="${open === f.id}" aria-controls="faq-p-${esc(f.id)}"><span>${esc(tr(f.question))}</span><span class="accordion__icon" aria-hidden="true"></span></button></h3>
        <div class="accordion__panel${open === f.id ? ' is-open' : ''}" id="faq-p-${esc(f.id)}" role="region" aria-labelledby="faq-t-${esc(f.id)}"><div><p>${esc(tr(f.answer))}</p></div></div></div>`).join('')}</div>
    </div></section>`;
  }

  function ctaSection() {
    const img = EO.site.cta && EO.site.cta.image;
    return `<section class="cta" id="cta" aria-labelledby="cta-title">
      <div class="cta__media">${picture(img, t('cta.alt'), { sizes: '(min-width: 961px) 50vw, 100vw' })}</div>
      <div class="cta__panel theme-dark" data-reveal>
        <p class="eyebrow">${esc(t('cta.eyebrow'))}</p><h2 class="display-lg" id="cta-title">${esc(t('cta.title'))}</h2>
        <p class="lead">${esc(t('cta.text'))}</p>
        <div class="cta__row"><button class="btn btn--primary" type="button" data-open-quote><span>${esc(t('btn.quote'))}</span>${arrow()}</button>
          <p class="cta__note">${esc(t('cta.note'))}${demo() ? `<br>${esc(t('demo.simulation'))}` : ''}</p></div></div></section>`;
  }

  /* ---------- footer ---------- */
  function footerInner() {
    const s = EO.site, c = s.contact || {}, co = s.company;
    const countryName = (code) => { const o = (db().options.countries || []).find((x) => x.id === code); return o ? tr(o.title) : code; };
    const row = (key, value, href) => (value ? `<li><span class="k">${esc(t('footer.' + key))}</span>${href ? `<a href="${esc(href)}">${esc(value)}</a>` : esc(value)}</li>` : '');
    const wa = c.whatsapp ? `https://wa.me/${String(c.whatsapp).replace(/\D/g, '')}` : '';
    const area = (s.serviceAreas || []).map(countryName).join(', ');
    const contact = [
      row('phone', c.phone, c.phone && `tel:${c.phone.replace(/[^\d+]/g, '')}`),
      row('email', c.email, c.email && `mailto:${c.email}`),
      row('whatsapp', c.whatsapp, wa),
      row('address', c.address),
      row('service', demo() ? '' : area)
    ].join('');
    const social = s.socials || {};
    const socialLinks = ['instagram', 'linkedin', 'youtube'].filter((k) => social[k]).map((k) => `<li><span class="social"><a href="${esc(social[k])}" target="_blank" rel="noopener" aria-label="${k}">${ICON[k]}</a></span></li>`).join('');
    const nav = navItems().filter(([k]) => k !== 'contact');
    const legal = s.legal || {};
    const legalLinks = ['privacy', 'terms', 'cookies'].filter((k) => legal[k]).map((k) => `<li><a href="${esc(legal[k])}">${esc(t('footer.' + k))}</a></li>`).join('');
    const blurb = demo() ? t('footer.text') : tr(co.description);
    return `<div class="container"><div class="footer__grid">
        <div class="footer__brand">${brand()}<p>${esc(blurb)}</p>${demo() ? `<span class="footer__demo"><b>${esc(t('demo.label'))}</b>${esc(t('demo.notReal'))}</span>` : ''}</div>
        <div class="footer__col"><h2>${esc(t('footer.products'))}</h2><ul>${categories().map((cat) => `<li><a href="#products" data-category="${esc(cat.id)}">${esc(tr(cat.title))}</a></li>`).join('')}</ul></div>
        <div class="footer__col"><h2>${esc(t('footer.company'))}</h2><ul>${nav.map(([k, href]) => `<li><a href="${href}">${esc(t('nav.' + k))}</a></li>`).join('')}<li><a href="#contact" data-open-quote>${esc(t('btn.quote'))}</a></li></ul></div>
        ${contact ? `<div class="footer__col footer__col--contact"><h2>${esc(t('footer.contact'))}</h2><ul>${contact}</ul></div>` : ''}
        ${socialLinks ? `<div class="footer__col"><h2>${esc(t('footer.follow'))}</h2><ul>${socialLinks}</ul></div>` : ''}
      </div>
      <div class="footer__bottom"><p>© ${new Date().getFullYear()} ${esc(demo() ? 'EO Labs' : (co.legalName || co.name))}. ${esc(t('footer.rights'))}</p>${legalLinks ? `<ul>${legalLinks}</ul>` : ''}${langSwitch()}</div></div>`;
  }

  const mainInner = () => [hero(), productsSection(), precisionSection(), projectsSection(), materialsSection(), configuratorSection(), aboutSection(), manufacturersSection(), faqSection(), ctaSection()].join('\n');

  /** <link rel=preload> for the hero (desktop + optional mobile art direction), used in <head>. */
  function heroPreload() {
    const h = EO.site.hero;
    const pick = (img) => { const i = asImg(img); const s = (i.sources || []).find((x) => x.type === 'image/avif') || (i.sources || []).find((x) => x.type === 'image/webp'); return { href: asset(i.src), set: s ? assetSet(s.srcset) : (i.srcset ? assetSet(i.srcset) : ''), type: s && s.type }; };
    const link = (p, media) => `<link rel="preload" as="image" href="${esc(p.href)}"${p.set ? ` imagesrcset="${esc(p.set)}" imagesizes="100vw"` : ''}${p.type ? ` type="${p.type}"` : ''}${media ? ` media="${media}"` : ''} fetchpriority="high">`;
    let out = '';
    if (h.imageMobile && h.imageMobile.src) out += link(pick(h.imageMobile), '(max-width: 640px)') + link(pick(h.image), '(min-width: 641px)');
    else out += link(pick(h.image));
    return out;
  }

  /** Cheap stable hash of everything the markup depends on — lets the browser skip re-rendering. */
  function hash() {
    const str = JSON.stringify([EO.site, EO.db.categories, EO.db.products, EO.db.materials, EO.db.projects, EO.db.manufacturers, EO.db.faq, EO.db.options, EO.i18n.lang, EO.db.translations]);
    let h = 5381;
    for (let i = 0; i < str.length; i++) h = ((h << 5) + h + str.charCodeAt(i)) | 0;
    return (h >>> 0).toString(36);
  }

  EO.ui = { esc, picture, media, ICON, arrow, asImg, pad, $, $$, t, tr };
  EO.data = { categories, materials, products, projects, faqItems, manufacturers };
  EO.tpl = { rangeCount, headerInner, footerInner, mainInner, rangeListHtml, rangeHtml, materialsGrid, heroPreload, hash, navItems };
})();
