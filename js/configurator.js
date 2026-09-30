/*
 * Configurator — one real state object drives everything:
 *
 *   EO.state.configuratorState = { product, material, finish, glass, projectType }
 *
 * Every choice does:  update state → reconcile (drop impossible combinations) →
 *   renderConfiguratorStepper / Options / Nav / Summary  +  renderConfiguratorPreview (cross-fade) → sync URL.
 * The preview reacts immediately (no waiting for "Next"). All options and previews come from data:
 *   categories[].preview {image?, position}, categories[].availableMaterials / availableFinishes / availableGlass
 *   materials[].swatch, materials[].finishes[].{color, previewImage}
 *   options.glass[].{overlay, effect, note}, options.projectTypes[].image
 * Markup functions are pure (used by tools/build.js for the prerendered first step).
 */
(function () {
  'use strict';
  const EO = window.EO;
  const { esc, picture, arrow, $, t, tr, asImg } = EO.ui;
  const STEPS = ['product', 'material', 'finish', 'glass', 'projectType'];
  const LABEL = (k) => (k === 'projectType' ? 'project' : k);
  const PREVIEW_SIZES = '(min-width: 961px) 34vw, 100vw';
  const CHECK = '<svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.6" aria-hidden="true"><path d="m3 8.5 3.2 3.2L13 4.8"/></svg>';

  const S = () => EO.state.configuratorState;
  const opts = () => EO.db.options;
  const findIn = (list, id) => (list || []).find((x) => x.id === id);
  const material = (id) => findIn(EO.data.materials(), id);
  const category = (id) => findIn(EO.data.categories(), id);
  const finishObj = (s = S()) => { const m = material(s.material); return m && findIn(m.finishes, s.finish); };
  const glassObj = (s = S()) => findIn(opts().glass, s.glass);
  const projectObj = (s = S()) => findIn(opts().projectTypes, s.projectType);

  /* ---------- dependencies ---------- */
  /** What can be combined with the chosen product (data-driven, derived from products when not declared). */
  function availability(productId) {
    const c = category(productId) || {};
    let mats;
    if (c.availableMaterials) mats = new Set(c.availableMaterials);
    else { mats = new Set(); EO.data.products().filter((p) => p.category === productId).forEach((p) => (p.material || []).forEach((m) => mats.add(m))); }
    return {
      materials: mats,
      finishes: (matId) => {
        const all = (material(matId) || {}).finishes || [];
        const only = c.availableFinishes && c.availableFinishes[matId];
        return only ? all.filter((f) => only.indexOf(f.id) > -1) : all;
      },
      glass: c.availableGlass ? new Set(c.availableGlass) : new Set((opts().glass || []).map((g) => g.id))
    };
  }

  /** Drop every choice the current product/material no longer supports — never keep an impossible state. */
  function reconcile() {
    const s = S();
    if (s.product && !category(s.product)) s.product = null;
    if (!s.product) { if (s.finish && !s.material) s.finish = null; return; }
    const av = availability(s.product);
    if (s.material && !av.materials.has(s.material)) { s.material = null; s.finish = null; }
    if (s.material && s.finish && !av.finishes(s.material).some((f) => f.id === s.finish)) s.finish = null;
    if (s.glass && !av.glass.has(s.glass)) s.glass = null;
  }

  /** First step without a choice (the furthest step the user may open). */
  function maxStep() {
    const s = S();
    const i = STEPS.findIndex((k) => !s[k]);
    return i < 0 ? STEPS.length - 1 : i;
  }

  function valueLabel(step, s = S()) {
    switch (step) {
      case 'product': { const c = category(s.product); return c ? tr(c.title) : ''; }
      case 'material': { const m = material(s.material); return m ? tr(m.title) : ''; }
      case 'finish': { const f = finishObj(s); return f ? tr(f.name) : ''; }
      case 'glass': { const g = glassObj(s); return g ? tr(g.title) : ''; }
      case 'projectType': { const p = projectObj(s); return p ? tr(p.title) : ''; }
      default: return '';
    }
  }

  /* ---------- glass visuals ---------- */
  function boost(rgba, k) {
    const m = /rgba\(([^)]*),\s*([\d.]+)\)/.exec(rgba || '');
    return m ? `rgba(${m[1]}, ${Math.min(0.85, Number(m[2]) * k).toFixed(2)})` : 'transparent';
  }
  function glassGlyph(v = {}) {
    const panes = v.panes || 2;
    let x = 8, out = '';
    for (let i = 0; i < panes; i++) { out += `<rect x="${x}" y="4" width="4" height="32" fill="${v.tint || 'rgba(160,190,190,.28)'}" stroke="currentColor" stroke-width="1"/>`; x += 12; }
    if (v.coating) out += `<line x1="${x - 8.5}" y1="6" x2="${x - 8.5}" y2="34" stroke="currentColor" stroke-width="2" stroke-dasharray="2 2"/>`;
    return `<svg class="glyph" viewBox="0 0 ${x + 4} 40" aria-hidden="true" focusable="false">${out}</svg>`;
  }

  /* ---------- preview (own function; nothing else decides what the preview shows) ---------- */
  function previewModel(s = S(), step = EO.state.step) {
    const cats = EO.data.categories();
    const cat = category(s.product) || cats[0] || {};
    const pv = cat.preview || {};
    let img = pv.image || cat.image;
    let pos = pv.position || '50% 50%';
    let alt = tr(cat.alt) || tr(cat.title);
    const fin = finishObj(s);
    if (fin && fin.previewImage) img = fin.previewImage;               // finish-specific render, when the client has one
    const proj = projectObj(s);
    let context = '';
    if (STEPS[step] === 'projectType' && proj && proj.image) {         // last step: architectural context
      img = proj.image; pos = '50% 50%'; alt = tr(proj.title); context = tr(proj.title);
    }
    const mat = material(s.material);
    const chain = [valueLabel('product', s), valueLabel('material', s), valueLabel('finish', s)].filter(Boolean).join(' · ');
    return { img, pos, alt, key: `${asImg(img).src}|${pos}`, chain, context, mat, fin, glass: glassObj(s) };
  }

  function samplesHtml(m) {
    const mat = m.mat, fin = m.fin, g = m.glass;
    const cell = (label, visual, name, note) => `<div class="sample"><span class="sample__label">${esc(label)}</span><span class="sample__row">${visual}<span class="sample__text"><b>${esc(name || '—')}</b>${note ? `<small>${esc(note)}</small>` : ''}</span></span></div>`;
    const matVisual = `<i class="sw${mat ? '' : ' is-empty'}" style="--sw:${mat ? esc(mat.swatch || '#888') : 'transparent'}"></i>`;
    const finVisual = `<i class="frame-sample${fin ? '' : ' is-empty'}" style="--sw:${fin ? esc(fin.color) : 'transparent'}"></i>`;
    const glassVisual = `<i class="glass-sample${g ? '' : ' is-empty'}${g && g.effect === 'frosted' ? ' is-frosted' : ''}" style="--ov:${g ? boost(g.overlay, 4) : 'transparent'}"></i>`;
    return cell(t('config.frame'), matVisual, mat && tr(mat.title)) + cell(t('config.finishLabel'), finVisual, fin && tr(fin.name)) + cell(t('config.glassLabel'), glassVisual, g && tr(g.title), g && tr(g.note));
  }

  /** Pure markup of the preview block (first paint / prerender). */
  function renderConfiguratorPreview(s = S(), step = EO.state.step) {
    const m = previewModel(s, step);
    return `<div class="preview__frame">
        <div class="preview__layers" data-key="${esc(m.key)}"><div class="preview__layer is-on">${picture(m.img, m.alt, { sizes: PREVIEW_SIZES, focal: m.pos })}</div></div>
        <div class="preview__glass" style="background:${m.glass ? esc(m.glass.overlay) : 'transparent'}"></div>
        <div class="preview__frost${m.glass && m.glass.effect === 'frosted' ? ' is-on' : ''}"></div>
        <span class="preview__finish${m.fin ? ' is-on' : ''}" style="--sw:${m.fin ? esc(m.fin.color) : 'transparent'}" aria-hidden="true"></span>
      </div>
      <p class="preview__label label" id="cfgPreviewLabel">${esc(m.context ? t('config.context') : t('config.systemPreview'))}</p>
      <p class="preview__context" ${m.context ? '' : 'hidden'}>${esc(m.context)}</p>
      <p class="preview__caption" aria-live="polite">${esc(m.chain || t('config.previewEmpty'))}</p>
      <div class="preview__samples" id="cfgSamples">${samplesHtml(m)}</div>`;
  }

  /** Browser: update the preview in place, cross-fading the photo (no flash, no slide, no zoom). */
  function updatePreview() {
    const host = $('#cfgPreview');
    if (!host) return;
    const m = previewModel();
    const layers = host.querySelector('.preview__layers');
    if (layers.dataset.key !== m.key) {
      layers.dataset.key = m.key;
      const layer = document.createElement('div');
      layer.className = 'preview__layer';
      layer.innerHTML = picture(m.img, m.alt, { sizes: PREVIEW_SIZES, focal: m.pos, load: 'eager' });
      const old = Array.from(layers.children);
      layers.appendChild(layer);
      const show = () => requestAnimationFrame(() => {
        layer.classList.add('is-on');
        old.forEach((o) => o.classList.remove('is-on'));
        setTimeout(() => old.forEach((o) => o.remove()), 380);
      });
      const im = layer.querySelector('img');
      if (!im || im.complete) show(); else { im.addEventListener('load', show, { once: true }); im.addEventListener('error', show, { once: true }); }
    }
    host.querySelector('.preview__glass').style.background = m.glass ? m.glass.overlay : 'transparent';
    host.querySelector('.preview__frost').classList.toggle('is-on', !!(m.glass && m.glass.effect === 'frosted'));
    const fin = host.querySelector('.preview__finish');
    fin.classList.toggle('is-on', !!m.fin);
    fin.style.setProperty('--sw', m.fin ? m.fin.color : 'transparent');
    const ctx = host.querySelector('.preview__context');
    ctx.hidden = !m.context;
    ctx.textContent = m.context;
    host.querySelector('#cfgPreviewLabel').textContent = m.context ? t('config.context') : t('config.systemPreview');
    host.querySelector('.preview__caption').textContent = m.chain || t('config.previewEmpty');
    host.querySelector('#cfgSamples').innerHTML = samplesHtml(m);
  }

  /* ---------- steps, options, summary, nav ---------- */
  function renderConfiguratorStepper(s = S()) {
    const reach = maxStep();
    return STEPS.map((k, i) => {
      const active = i === EO.state.step;
      const done = !!s[k];
      const state = active ? 'active' : done ? 'done' : 'future';
      const ok = i <= reach;
      return `<li><button type="button" class="step" data-step="${i}" data-state="${state}" data-focus="st-${k}" ${active ? 'aria-current="step"' : ''} ${ok ? '' : 'disabled aria-disabled="true"'}>
        <span class="num">${state === 'done' ? CHECK : String(i + 1).padStart(2, '0')}</span><span class="name">${esc(t('config.steps.' + LABEL(k)))}</span>${state === 'done' ? `<span class="visually-hidden"> (${esc(t('config.stepDone'))})</span>` : ''}</button></li>`;
    }).join('');
  }

  const roving = (checked, first) => (checked || first ? 0 : -1);
  const dis = (ok) => (ok ? '' : 'disabled aria-disabled="true"');

  function renderConfiguratorOptions(step, s = S()) {
    if (step === 'product') {
      let list = EO.data.categories();
      let hint = '';
      if (s.material && !s.product) {   // arrived via "Configure in Timber": only products that support it
        list = list.filter((c) => availability(c.id).materials.has(s.material));
        hint = `<p class="config__hint">${esc(t('config.showingFor', { material: valueLabel('material', s) }))}</p>`;
      }
      return `${hint}<div class="opt-media-grid" role="radiogroup" aria-labelledby="cfgPrompt">${list.map((c, i) => `
        <button type="button" class="opt-media" role="radio" aria-checked="${s.product === c.id}" tabindex="${roving(s.product === c.id, !s.product && i === 0)}" data-opt="product:${esc(c.id)}" data-focus="opt-${esc(c.id)}">
          ${EO.ui.media((c.preview && c.preview.image) || c.image, '', { ratio: '4 / 3', sizes: '(min-width: 961px) 14vw, 40vw' })}<span class="opt-media__title">${esc(tr(c.title))}</span></button>`).join('')}</div>`;
    }
    if (step === 'material') {
      if (!s.product) return `<p class="config__hint">${esc(t('config.chooseFirst'))}</p>`;
      const av = availability(s.product);
      const list = EO.data.materials();
      const firstOk = list.find((m) => av.materials.has(m.id));
      return `<div class="option-grid option-grid--material" role="radiogroup" aria-labelledby="cfgPrompt">${list.map((m) => {
        const ok = av.materials.has(m.id);
        const fins = av.finishes(m.id).slice(0, 5);
        return `<button type="button" class="option option--material" role="radio" aria-checked="${s.material === m.id}" tabindex="${roving(s.material === m.id, !s.material && firstOk && firstOk.id === m.id)}" ${dis(ok)} data-opt="material:${esc(m.id)}" data-focus="opt-${esc(m.id)}">
          <span class="mini-swatches" aria-hidden="true">${fins.map((f) => `<i style="--sw:${esc(f.color)}"></i>`).join('')}</span>
          <span class="option__title">${esc(tr(m.title))}</span><span class="option__desc">${esc(ok ? tr(m.subtitle) : t('config.unavailable'))}</span></button>`;
      }).join('')}</div>`;
    }
    if (step === 'finish') {
      const m = material(s.material);
      if (!m || !s.product) return `<p class="config__hint">${esc(t('config.chooseFirst'))}</p>`;
      const fins = availability(s.product).finishes(m.id);
      return `<div class="finish-grid" role="radiogroup" aria-labelledby="cfgPrompt">${fins.map((f, i) => `
        <button type="button" class="finish" role="radio" aria-checked="${s.finish === f.id}" tabindex="${roving(s.finish === f.id, !s.finish && i === 0)}" data-opt="finish:${esc(f.id)}" data-focus="opt-${esc(f.id)}">
          <span class="swatch" style="--sw:${esc(f.color)}"></span><span class="finish__name">${esc(tr(f.name))}</span></button>`).join('')}</div>`;
    }
    if (step === 'glass') {
      const av = s.product ? availability(s.product).glass : null;
      const list = opts().glass;
      const firstOk = list.find((g) => !av || av.has(g.id));
      return `<div class="option-grid" role="radiogroup" aria-labelledby="cfgPrompt">${list.map((g) => {
        const ok = !av || av.has(g.id);
        return `<button type="button" class="option option--glass" role="radio" aria-checked="${s.glass === g.id}" tabindex="${roving(s.glass === g.id, !s.glass && firstOk && firstOk.id === g.id)}" ${dis(ok)} data-opt="glass:${esc(g.id)}" data-focus="opt-${esc(g.id)}">
          ${glassGlyph(g.visual)}<span class="option__title">${esc(tr(g.title))}</span><span class="option__desc">${esc(ok ? tr(g.note || g.description) : t('config.unavailable'))}</span></button>`;
      }).join('')}</div>`;
    }
    const cur = s.projectType;
    return `<div class="opt-media-grid" role="radiogroup" aria-labelledby="cfgPrompt">${opts().projectTypes.map((o, i) => `
      <button type="button" class="opt-media" role="radio" aria-checked="${cur === o.id}" tabindex="${roving(cur === o.id, !cur && i === 0)}" data-opt="projectType:${esc(o.id)}" data-focus="opt-${esc(o.id)}">
        ${o.image ? EO.ui.media(o.image, '', { ratio: '4 / 3', sizes: '(min-width: 961px) 14vw, 40vw' }) : ''}<span class="opt-media__title">${esc(tr(o.title))}</span></button>`).join('')}</div>`;
  }

  function stageInner(s = S()) {
    const stepId = STEPS[EO.state.step];
    return `<div class="config__stage-head"><h3 class="config__prompt" id="cfgPrompt">${esc(t('config.prompts.' + LABEL(stepId)))}</h3><span class="config__hint">${esc(t('config.stepOf', { n: EO.state.step + 1, total: STEPS.length }))}</span></div>${renderConfiguratorOptions(stepId, s)}`;
  }

  function renderConfiguratorNav(s = S()) {
    const stepId = STEPS[EO.state.step];
    const last = EO.state.step === STEPS.length - 1;
    return `<button type="button" class="btn btn--ghost" data-cfg-back data-focus="back" ${EO.state.step === 0 ? 'disabled' : ''}><span>${esc(t('btn.back'))}</span></button>
      ${last
        ? `<button type="button" class="btn btn--primary" data-cfg-continue data-focus="continue-nav" ${s[stepId] ? '' : 'disabled'}><span>${esc(t('btn.continue'))}</span>${arrow()}</button>`
        : `<button type="button" class="btn btn--primary" data-cfg-next data-focus="next" ${s[stepId] ? '' : 'disabled'}><span>${esc(t('btn.next'))}</span>${arrow()}</button>`}`;
  }

  function renderConfiguratorSummary(s = S()) {
    const rows = STEPS.map((step) => {
      const label = valueLabel(step, s);
      const f = step === 'finish' ? finishObj(s) : null;
      const swatch = f ? `<span class="swatch" style="--sw:${esc(f.color)}"></span>` : '';
      return `<div class="summary__row"><dt>${esc(t('config.steps.' + LABEL(step)))}</dt><dd class="${label ? '' : 'is-empty'}"><button type="button" data-step="${STEPS.indexOf(step)}" data-focus="sum-${step}" aria-label="${esc(t('config.edit'))}: ${esc(t('config.steps.' + LABEL(step)))}" ${STEPS.indexOf(step) <= maxStep() ? '' : 'disabled'}>${swatch}<span>${esc(label || '—')}</span></button></dd></div>`;
    }).join('');
    const done = STEPS.filter((k) => s[k]).length;
    const lastStep = EO.state.step === STEPS.length - 1;
    return `<p class="eyebrow summary__title" id="sumTitle">${esc(t('config.summary'))}</p>
      <button type="button" class="summary__toggle" data-summary-toggle aria-expanded="${!!EO.state.summaryOpen}" aria-controls="cfgRows"><span class="eyebrow">${esc(t('config.summary'))}</span><span class="summary__count">${done} / ${STEPS.length}</span><span class="summary__chev" aria-hidden="true"></span></button>
      <dl class="summary__rows" id="cfgRows" aria-live="polite">${rows}</dl>
      ${lastStep ? '' : `<button type="button" class="btn btn--primary" data-cfg-continue data-focus="continue" ${s.product ? '' : 'disabled'}><span>${esc(t('btn.continue'))}</span>${arrow()}</button>`}
      <p class="config__hint summary__hint">${esc(t('config.hint'))}</p>`;
  }

  /** Inner markup of #config (pure). */
  function markup() {
    return `<div class="config__left">
        <ol class="stepper" id="cfgStepper" aria-label="${esc(t('config.eyebrow'))}">${renderConfiguratorStepper()}</ol>
        <div class="config__stage" id="cfgStage">${stageInner()}</div>
        <div class="config__nav" id="cfgNav">${renderConfiguratorNav()}</div>
      </div>
      <div class="config__right">
        <div class="config__preview preview" id="cfgPreview" aria-label="${esc(t('config.preview'))}">${renderConfiguratorPreview()}</div>
        <aside class="config__summary summary theme-dark${EO.state.summaryOpen ? ' is-open' : ''}" id="cfgSummary" aria-labelledby="sumTitle">${renderConfiguratorSummary()}</aside>
      </div>`;
  }

  /* ---------- painting ---------- */
  function paint() {
    const host = $('#config');
    if (!host) return;
    const a = document.activeElement;
    const focusKey = a && host.contains(a) ? a.dataset.focus : null;
    $('#cfgStepper').innerHTML = renderConfiguratorStepper();
    $('#cfgStage').innerHTML = stageInner();
    $('#cfgNav').innerHTML = renderConfiguratorNav();
    $('#cfgSummary').innerHTML = renderConfiguratorSummary();
    $('#cfgSummary').classList.toggle('is-open', !!EO.state.summaryOpen);
    const st = $('#cfgStepper'), cur = st.querySelector('[aria-current]');
    if (cur && st.scrollWidth > st.clientWidth) st.scrollLeft = cur.offsetLeft - (st.clientWidth - cur.offsetWidth) / 2;
    updatePreview();
    if (focusKey) { const el = host.querySelector(`[data-focus="${CSS.escape(focusKey)}"]`); if (el && !el.disabled) el.focus({ preventScroll: true }); }
  }
  const render = () => { paint(); syncUrl(); };

  function announce(text) { const live = $('#liveRegion'); if (live) live.textContent = text; }

  /* ---------- query string (share a configuration) ---------- */
  const PARAMS = { product: 'product', material: 'material', finish: 'finish', glass: 'glass', projectType: 'project' };
  function syncUrl() {
    try {
      const q = new URLSearchParams(location.search);
      Object.keys(PARAMS).forEach((k) => { if (S()[k]) q.set(PARAMS[k], S()[k]); else q.delete(PARAMS[k]); });
      const qs = q.toString();
      history.replaceState(null, '', location.pathname + (qs ? `?${qs}` : '') + location.hash);
    } catch (e) { /* file:// or sandbox */ }
  }
  function restoreFromUrl() {
    const q = new URLSearchParams(location.search);
    let any = false;
    Object.keys(PARAMS).forEach((k) => { const v = q.get(PARAMS[k]); if (v) { S()[k] = v; any = true; } });
    if (!any) return false;
    const s = S();
    if (s.product && !category(s.product)) s.product = null;
    if (s.material && !material(s.material)) s.material = null;
    if (s.glass && !glassObj()) s.glass = null;
    if (s.projectType && !projectObj()) s.projectType = null;
    reconcile();
    EO.state.step = maxStep();
    return true;
  }

  /* ---------- actions ---------- */
  function ensurePreviewVisible() {
    if (!matchMedia('(max-width: 960px)').matches) return;
    const el = $('#cfgPreview');
    if (!el) return;
    const r = el.getBoundingClientRect();
    if (r.top > innerHeight - 140 || r.bottom < 90) el.scrollIntoView({ block: 'nearest', behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth' });
  }

  function choose(step, id) {
    const s = S();
    if (s[step] === id) return;
    s[step] = id;
    if (step === 'material') s.finish = null;
    reconcile();
    render();
    announce(`${t('config.steps.' + LABEL(step))}: ${valueLabel(step)}`);
    ensurePreviewVisible();
  }
  function go(n) {
    if (n < 0 || n > maxStep()) return;
    EO.state.step = n;
    render();
    announce(`${t('config.stepOf', { n: n + 1, total: STEPS.length })}: ${t('config.prompts.' + LABEL(STEPS[n]))}`);
  }

  /** Warm the few preview photos after load so clicks never flash white. */
  function preloadPreviews() {
    const imgs = EO.data.categories().map((c) => (c.preview && c.preview.image) || c.image).concat(opts().projectTypes.map((p) => p.image)).filter(Boolean);
    const box = document.createElement('div');
    box.setAttribute('aria-hidden', 'true');
    box.style.cssText = 'position:absolute;width:0;height:0;overflow:hidden;visibility:hidden';
    box.innerHTML = imgs.map((i) => picture(i, '', { sizes: PREVIEW_SIZES, load: 'eager' })).join('');
    document.body.appendChild(box);
  }

  EO.configurator = {
    markup, render, availability, reconcile,
    renderConfiguratorPreview, renderConfiguratorSummary, renderConfiguratorOptions,
    /** { category, material } from the range list ("Configure") or the materials section ("Configure in Timber") */
    preselect(o) {
      const s = S();
      if (o.category) s.product = o.category;
      if (o.material) s.material = o.material;
      if (o.material && !o.category && s.product) { /* keep the product if it supports the material, reconcile clears it otherwise */ }
      reconcile();
      EO.state.step = Math.min(maxStep(), !s.product ? 0 : !s.material ? 1 : 2);
      if (!s.product) EO.state.step = 0;
      render();
      announce(`${t('config.stepOf', { n: EO.state.step + 1, total: STEPS.length })}: ${t('config.prompts.' + LABEL(STEPS[EO.state.step]))}`);
      const el = document.getElementById('configurator');
      if (el) el.scrollIntoView({ behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth', block: 'start' });
    },
    init() {
      const host = $('#config');
      if (!host) return;
      if (restoreFromUrl()) paint();
      host.addEventListener('click', (e) => {
        const opt = e.target.closest('[data-opt]');
        if (opt && !opt.disabled) { const [step, id] = opt.dataset.opt.split(':'); choose(step, id); return; }
        const st = e.target.closest('[data-step]');
        if (st && !st.disabled) { go(Number(st.dataset.step)); return; }
        if (e.target.closest('[data-cfg-next]')) { go(EO.state.step + 1); return; }
        if (e.target.closest('[data-cfg-back]')) { go(EO.state.step - 1); return; }
        if (e.target.closest('[data-summary-toggle]')) { EO.state.summaryOpen = !EO.state.summaryOpen; paint(); const b = host.querySelector('[data-summary-toggle]'); if (b) b.focus({ preventScroll: true }); return; }
        if (e.target.closest('[data-cfg-continue]')) EO.quote.open({ prefill: EO.state.configuratorState });
      });
      const warm = () => (window.requestIdleCallback || ((f) => setTimeout(f, 800)))(preloadPreviews);
      if (document.readyState === 'complete') warm(); else window.addEventListener('load', warm, { once: true });
    }
  };
})();
